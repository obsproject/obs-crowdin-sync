import AXIOS from 'axios';
import ZIP from 'adm-zip';
import PLIMIT from 'p-limit';
import PATH from 'path';
import FSE from 'fs-extra';
import CROWDIN, { ReportsModel, UsersModel } from '@crowdin/crowdin-api-client';
import * as ACTION from '@actions/core';

import STRINGS from './strings';
import { wait, exec, normalize } from './utils';
import { projectId, submodules, sourceEqualityCheck, gitAddAllowList, CROWDIN_PAT, CROWDIN_ORG, JEST_RUN } from './constants';

if (!CROWDIN_PAT && !JEST_RUN) {
	ACTION.error('Environment variable CROWDIN_PAT not provided, skipping action');
	process.exit(0);
}

const { reportsApi, translationsApi, usersApi, projectsGroupsApi, sourceFilesApi, sourceStringsApi, translationStatusApi } = new CROWDIN({
	token: CROWDIN_PAT || '',
	organization: CROWDIN_ORG
});

/**
 * Clears a directory excluding the default language files.
 *
 * @param dirPath Directory to clear.
 */
function emptyTranslationDir(dirPath: string): void {
	for (const file of FSE.readdirSync(dirPath)) {
		if (file !== `${STRINGS.language.locale}.ini`) {
			FSE.removeSync(`${dirPath}/${file}`);
		}
	}
}

/**
 * Remove all translations to prevent keeping dropped languages.
 */
function removePreviousTranslations(): void {
	emptyTranslationDir('UI/data/locale');
	emptyTranslationDir('plugins/enc-amf/resources/locale');
	emptyTranslationDir('plugins/mac-virtualcam/src/obs-plugin/data/locale');
	for (const dir of FSE.readdirSync('plugins')) {
		const dirPath = `plugins/${dir}/data/locale`;
		if (FSE.existsSync(dirPath) && FSE.lstatSync(dirPath).isDirectory()) {
			emptyTranslationDir(dirPath);
		}
	}
	for (const dir of FSE.readdirSync('UI/frontend-plugins')) {
		const dirPath = `UI/frontend-plugins/${dir}/data/locale`;
		if (FSE.existsSync(dirPath) && FSE.lstatSync(dirPath).isDirectory()) {
			emptyTranslationDir(dirPath);
		}
	}
}

/**
 * Finds submodules uneven with the main repository and checkouts `master` branch.
 *
 * @returns List of detached submodules in the repository.
 */
function prepareBuildProcessing(): string[] {
	const detachedSubmodules: string[] = [];
	for (const submodule of submodules) {
		process.chdir(`plugins/${submodule}`);
		if (exec('git diff master HEAD').length !== 0) {
			detachedSubmodules.push(submodule);
		}
		exec('git checkout master');
		process.chdir('../..');
	}
	return detachedSubmodules;
}

/**
 * Mappes file ids to their export paths.
 *
 * @returns File ids mapped to their export path.
 */
export async function getFilePaths(): Promise<Map<number, string>> {
	const filePaths = new Map<number, string>();
	for (const { data: file } of (
		await sourceFilesApi.listProjectFiles(projectId, {
			limit: 500
		})
	).data) {
		const fileName = file.name;
		const exportPattern = file.exportOptions.exportPattern.replace('%file_name%', fileName.substring(0, fileName.indexOf('.')));
		filePaths.set(file.id, exportPattern.substring(1, exportPattern.lastIndexOf('/')));
	}
	return filePaths;
}

/**
 * Maps source file ids to source string keys and source text.
 *
 * @param filePaths File ids mapped to their export path.
 * @returns Source file ids mapped to source string keys and source text.
 */
export async function getSourceFiles(filePaths: Map<number, string>): Promise<Map<number, Map<string, string>>> {
	const sourceFiles = new Map<number, Map<string, string>>();
	let offset = 0;
	let currentFileId;
	let currentFileStrings: Map<string, string> | undefined;
	while (true) {
		const projectStrings = (
			await sourceStringsApi.listProjectStrings(projectId, {
				limit: 500,
				offset: offset
			})
		).data;
		if (projectStrings.length === 0) {
			break;
		}
		for (const { data: sourceString } of projectStrings) {
			const fileId = sourceString.fileId;
			if (
				filePaths.has(fileId) &&
				!sourceEqualityCheck.includes(filePaths.get(fileId)!.substring(0, filePaths.get(fileId)!.indexOf('/')))
			) {
				continue;
			}
			if (fileId !== currentFileId) {
				if (typeof currentFileId !== 'undefined') {
					sourceFiles.set(currentFileId, currentFileStrings!);
				}
				currentFileId = fileId;
				if (sourceFiles.has(currentFileId)) {
					currentFileStrings = sourceFiles.get(currentFileId);
				} else {
					currentFileStrings = new Map<string, string>();
				}
			}
			currentFileStrings!.set(sourceString.identifier, sourceString.text as string);
		}
		offset += 500;
	}
	return sourceFiles;
}

/**
 * Build the final string to be saved to the AUTHORS file.
 *
 * @param gitContributors Output of getGitContributors()
 * @param translators Output of getTranslators()
 */
function generateAuthors(gitContributors: string, translators: string): void {
	FSE.writeFileSync(STRINGS.authors.fileName, `${STRINGS.authors.header}${gitContributors}${translators}`);
}

/**
 * Uses `git shortlog` to get a list Git contributors.
 *
 * @returns List of contributors, with heading
 */
function getGitContributors(): string {
	let output = `${STRINGS.authors.contributors}:\n`;
	for (const line of exec('git shortlog --all -sn --no-merges').split('\n')) {
		const contributor = line.substring(line.indexOf('\t') + 1);
		if (contributor !== STRINGS.git.committer.name) {
			output += ` ${contributor}\n`;
		}
	}
	return output;
}

const requestLimit = PLIMIT(10);

/**
 * Gets all translators from the Crowdin project.
 *
 * @param targetLanguageIds List of project target language ids.
 * @returns List of translators, with heading.
 */
export async function getTranslators(targetLanguageIds: string[]): Promise<string> {
	// blocked users
	const blockedUsers: number[] = [];
	for (const { data: blockedUser } of (await usersApi.listProjectMembers(projectId, undefined, UsersModel.Role.BLOCKED, undefined, 500))
		.data) {
		blockedUsers.push(blockedUser.id);
	}
	// report
	const requests = [];
	for (const languageId of targetLanguageIds) {
		requests.push(
			requestLimit(() =>
				(async () => {
					const { status: reportStatus, identifier: reportId } = (
						await reportsApi.generateReport(projectId, {
							name: 'top-members',
							schema: {
								unit: ReportsModel.Unit.WORDS,
								format: ReportsModel.Format.JSON,
								dateFrom: '2014-01-01T00:00:00+00:00',
								dateTo: '2030-01-01T00:00:00+00:00',
								languageId
							}
						})
					).data;
					let finished = reportStatus === 'finished';
					while (!finished) {
						await wait(3000);
						finished = (await reportsApi.checkReportStatus(projectId, reportId)).data.status === 'finished';
					}
					return (await AXIOS.get((await reportsApi.downloadReport(projectId, reportId)).data.url)).data;
				})()
			)
		);
	}

	const topMembers = new Map<string, string[]>();
	for (const reportData of await Promise.all(requests)) {
		if (!('data' in reportData)) {
			continue;
		}
		const languageName: string = reportData.language.name;
		let members: string[];
		if (topMembers.has(languageName)) {
			members = topMembers.get(languageName)!;
		} else {
			members = [];
		}
		for (const userObj of reportData.data) {
			const fullName: string = userObj.user.fullName;
			// Skip deleted and blocked accounts.
			if (fullName === 'REMOVED_USER' || blockedUsers.includes(Number(userObj.user.id))) {
				continue;
			}
			if (userObj.translated === 0 && userObj.approved === 0) {
				continue;
			}
			members.push(fullName);
		}
		topMembers.set(languageName, members);
	}

	let output = `${STRINGS.authors.translators}:\n`;
	for (const language of new Map([...topMembers].sort((a, b) => String(a[0]).localeCompare(b[0]))).keys()) {
		output += ` ${language}:\n`;
		for (const user of topMembers.get(language)!) {
			output += `  ${user}\n`;
		}
	}
	return output;
}

/**
 * Builds the Crowdin project.
 *
 * @returns The build id.
 */
export async function buildProject(): Promise<number> {
	if (process.env.CROWDIN_ORG) {
		const { id, status } = (await translationsApi.listProjectBuilds(projectId, undefined, 1)).data[0].data;
		if (status === 'finished') {
			return id;
		}
	}
	const { id, status } = (
		await translationsApi.buildProject(projectId, {
			skipUntranslatedStrings: true
		})
	).data;
	let finished = status === 'finished';
	while (!finished) {
		await wait(5000);
		finished = (await translationsApi.checkBuildStatus(projectId, id)).data.status === 'finished';
	}
	return id;
}

/**
 * Executes multiple language-related operations.
 *
 * @returns An object containing the properties `targetLanguageIds` and `languageCodeMap`.
 */
export async function getLanguages(): Promise<{
	targetLanguageIds: string[];
	languageCodeMap: Map<string, string>;
}> {
	const projectData = (await projectsGroupsApi.getProject(projectId)).data;
	const languageCodeMap = new Map<string, string>(); // <locale, languageId>
	for (const language of projectData.targetLanguages) {
		languageCodeMap.set(language.locale, language.id);
	}
	return {
		languageCodeMap,
		targetLanguageIds: projectData.targetLanguageIds
	};
}

/**
 * Downloads the build, trims the translation files and moves them to their directories.
 *
 * @param buildId Build id.
 * @param sourceFiles Source files mapped to source string keys and their source text.
 * @param filePaths File ids mapped to their export path.
 * @returns An object containing the properties `desktopFileTranslations` and `languageList`.
 */
export async function processBuild(
	buildId: number,
	sourceFiles: Map<number, Map<string, string>>,
	filePaths: Map<number, string>
): Promise<{
	desktopFileTranslations: Map<string, Map<string, string>>;
	languageList: Map<string, string>;
}> {
	const translatedSourceMap = new Map<string, Map<string, string>>(); // <filePath, <stringKey, stringText>> Paths mapped to source strings insteaad of file ids.
	for (const key of sourceFiles.keys()) {
		if (filePaths.has(key)) {
			translatedSourceMap.set(filePaths.get(key)!, sourceFiles.get(key)!);
		}
	}
	// Download build.
	const zipFile = new ZIP(
		(await AXIOS.get((await translationsApi.downloadTranslations(projectId, buildId)).data.url, { responseType: 'arraybuffer' })).data
	);
	const desktopFileTranslations = new Map<string, Map<string, string>>(); // <locale, <stringKey, translation>>
	const languageList = new Map<string, string>(); // <locale, localeLanguageName>
	for (const zipEntry of zipFile.getEntries()) {
		const entryFullPath = zipEntry.entryName;
		const { dir: entryDir, name: entryName } = PATH.parse(entryFullPath);
		if (entryDir === 'Website') {
			continue;
		}
		let fileContent = normalize(zipFile.readAsText(zipEntry));
		if (fileContent.length === 0) {
			continue;
		}
		// Replace line breaks with \n, as OBS only supports on-line translations.
		let fixedLineBreaks = '';
		for (const line of fileContent.trimEnd().split('\n')) {
			if (line.includes('="') && line.indexOf('="') !== line.length - 2) {
				fixedLineBreaks += '\n';
			} else {
				fixedLineBreaks += '\\n';
			}
			fixedLineBreaks += line;
		}
		fileContent = fixedLineBreaks.trimStart();
		// Desktop Entry
		if (entryDir === 'desktop-entry') {
			const translations = new Map<string, string>();
			for (const line of fileContent.split('\n')) {
				translations.set(line.substring(0, line.indexOf('=')), line.substring(line.indexOf('"') + 1, line.lastIndexOf('"')));
			}
			desktopFileTranslations.set(entryName, translations);
			continue;
		}
		// Remove translations equal to source.
		let translationContent = '';
		if (translatedSourceMap.has(entryDir)) {
			let readLanguageName = false;
			if (entryDir === 'UI/data/locale') {
				readLanguageName = true;
			}
			for (const line of fileContent.split('\n')) {
				const key = line.substring(0, line.indexOf('='));
				const value = line.substring(line.indexOf('"') + 1, line.length - 1);
				if (value !== translatedSourceMap.get(entryDir)!.get(key)) {
					translationContent += `${line}\n`;
					if (readLanguageName && key === 'Language') {
						languageList.set(entryName, value);
						readLanguageName = false;
					}
				}
			}
			if (translationContent.length === 0) {
				continue;
			}
		} else {
			translationContent = `${fileContent}\n`;
		}
		await FSE.writeFile(entryFullPath, translationContent);
	}
	return {
		desktopFileTranslations: new Map([...desktopFileTranslations].sort((a, b) => String(a[0]).localeCompare(b[0]))),
		languageList
	};
}

/**
 * Updates `com.obsproject.Studio.desktop` file with translations.
 *
 * @param languageFiles Locales mapped to their desktop file translations.
 */
export async function desktopFile(languageFiles: Map<string, Map<string, string>>): Promise<void> {
	const filePath = 'UI/xdg-data/com.obsproject.Studio.desktop';
	const desktopFile = normalize(await FSE.readFile(filePath, 'utf-8'));
	let result = '';
	for (const line of desktopFile.split('\n')) {
		if (line.length === 0) {
			continue;
		}
		if (!(line.startsWith('GenericName[') || line.startsWith('Comment['))) {
			result += `${line}\n`;
		}
	}
	result += '\n';
	for (const language of languageFiles.entries()) {
		for (const translation of language[1].entries()) {
			result += `${translation[0]}[${language[0]}]=${translation[1]}\n`;
		}
	}
	await FSE.writeFile(filePath, result);
}

/**
 * Updates `locale.ini` file with languages.
 *
 * @param languageList Locales mapped to their locale language name.
 * @param languageCodeMap Locales mapped to their language id.
 */
export async function localeFile(languageList: Map<string, string>, languageCodeMap: Map<string, string>): Promise<void> {
	const progressMap = new Map<string, number>(); // <languageId, translationProgress>
	for (const { data: language } of (await translationStatusApi.getProjectProgress(projectId, 500)).data) {
		progressMap.set(language.languageId, language.translationProgress);
	}
	const languagesInList = [];
	const languagueListPath = 'UI/data/locale.ini';
	for (const line of normalize(FSE.readFileSync(languagueListPath, 'utf-8')).split('\n')) {
		if (line.startsWith('[') && line !== `[${STRINGS.language.locale}]`) {
			languagesInList.push(line.substring(1, line.length - 1));
		}
	}
	const finalLanguages = [];
	for (const [locale, languageId] of languageCodeMap.entries()) {
		if (progressMap.has(languageId)) {
			const progress = progressMap.get(languageId)!;
			if ((languagesInList.includes(locale) && progress >= 30) || progress >= 60) {
				finalLanguages.push(locale);
			}
		}
	}
	finalLanguages.push(STRINGS.language.locale);
	languageList.set(STRINGS.language.locale, STRINGS.language.name);
	let result = '';
	for (const locale of finalLanguages.sort()) {
		if (languageList.has(locale)) {
			result += `[${locale}]\nName=${languageList.get(locale)}\n\n`;
		} else {
			ACTION.error(
				`${locale} was supposed to be included but is missing the language name ('Language' string in 'Main Application' file).`
			);
		}
	}
	await FSE.writeFile(languagueListPath, `${result.trimEnd()}\n`);
}
/**
 * Pushes all changes to the submodules and the main repository.
 *
 * @param detachedSubmodules List of detached submodules in the repository.
 */
function pushChanges(detachedSubmodules: string[]): void {
	if (process.env.CROWDIN_SYNC_SKIP_PUSH) {
		return;
	}
	ACTION.info('Pushing translation and author changes.');
	exec(`git config --global user.name '${STRINGS.git.committer.name}'`);
	exec(`git config --global user.email '${STRINGS.git.committer.email}'`);
	for (const submodule of submodules) {
		process.chdir(`plugins/${submodule}`);
		if (exec('git status --porcelain').length === 0) {
			process.chdir('../..');
			continue;
		}
		exec(`git add '${gitAddAllowList[submodule]}'`);
		exec(`git commit -m '${STRINGS.git.commitTitle}'`);
		exec('git push');
		process.chdir('../..');
	}
	for (const path of gitAddAllowList.all) {
		exec(`git add '${path}'`);
	}
	for (const submodule of submodules) {
		exec(`git add plugins/${submodule}`);
	}
	for (const submodule of detachedSubmodules) {
		ACTION.info(`${submodule} has commits not pushed to the main repository. Only pushing to submodule.`);
		exec(`git checkout HEAD -- plugins/${submodule}`);
		exec(`git submodule update --init plugins/${submodule}`);
	}
	if (exec('git status --porcelain').length === 0) {
		ACTION.info('No changes in main repository. Skipping push.');
		return;
	}
	exec(`git commit -m '${STRINGS.git.commitTitle}'`);
	exec('git push');
}

// Executes steps simultaneously where possible.
(async () => {
	if (JEST_RUN) {
		return;
	}
	try {
		removePreviousTranslations();
		const results = [];
		results[0] = await Promise.all([prepareBuildProcessing(), await getFilePaths(), await buildProject(), await getLanguages()]);
		results[1] = await Promise.all([
			generateAuthors(getGitContributors(), await getTranslators(results[0][3].targetLanguageIds)),
			await processBuild(results[0][2], await getSourceFiles(results[0][1]), results[0][1])
		]);
		await localeFile(results[1][1].languageList, results[0][3].languageCodeMap);
		desktopFile(results[1][1].desktopFileTranslations);
		pushChanges(results[0][0]);
	} catch (e) {
		ACTION.setFailed(e as Error);
	}
})();
