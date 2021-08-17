import axios from 'axios';
import * as path from 'path';
import * as fse from 'fs-extra';
import * as Zip from 'adm-zip';
import * as core from '@actions/core';
import * as plimit from 'p-limit';
import Crowdin, { ReportsModel, UsersModel } from '@crowdin/crowdin-api-client';

import { wait, execute, normalize } from '../../shared/utils';
import { projectId, submodules, sourceEqualityCheck, promisesLimit } from '../../shared/constants';
import { LanguagesGatheringResult, BuildProcessingResult } from './interfaces';
import strings from './strings';

const { reportsApi, translationsApi, usersApi, projectsGroupsApi, sourceFilesApi, sourceStringsApi, translationStatusApi } = new Crowdin({
	token: process.env.CROWDIN_PAT!
});

/*
Crowdin's JavaScript client doesn't perfectly limit the amount of
concurrently executed requests which sometimes results in a failure.
This definitely slows everything down, but ensures a completion.
*/
const requestLimit = plimit(promisesLimit);

/**
 * Clears a directory excluding the default language files.
 *
 * @param dirPath Directory to clear.
 */
function emptyTranslationDir(dirPath: string): void {
	for (const file of fse.readdirSync(dirPath)) {
		if (file !== `${strings.language.locale}.ini`) {
			fse.removeSync(path.join(dirPath, file));
		}
	}
}

/**
 * Remove all translations to prevent keeping dropped languages.
 */
function removePreviousTranslations(): void {
	core.info('Removing previous translations.');
	emptyTranslationDir(path.join('UI', 'data', 'locale'));
	emptyTranslationDir(path.join('plugins', 'enc-amf', 'resources', 'locale'));
	for (const file of fse.readdirSync('plugins')) {
		const dirPath = path.join('plugins', file, 'data', 'locale');
		if (fse.existsSync(dirPath) && fse.lstatSync(dirPath).isDirectory()) {
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
	core.info('Preparing project build.');
	const detachedSubmodules: string[] = [];
	for (const submodule of submodules) {
		process.chdir(path.join('plugins', submodule));
		if (execute('git diff master HEAD').length !== 0) {
			detachedSubmodules.push(submodule);
		}
		execute('git checkout master');
		process.chdir('../..');
	}
	return detachedSubmodules;
}

/**
 * Mappes file ids to their export paths.
 *
 * @returns File ids mapped to their export path.
 */
async function getFilePaths(): Promise<Map<number, string>> {
	const filePaths = new Map<number, string>();
	for (const { data: file } of (await sourceFilesApi.listProjectFiles(projectId, { limit: 500 })).data) {
		const fileName = file.name;
		const exportPattern = file.exportOptions.exportPattern.replace('%file_name%', fileName.substring(0, fileName.indexOf('.')));
		filePaths.set(file.id, exportPattern.substring(1, exportPattern.lastIndexOf('/')));
	}
	return filePaths;
}

/**
 * Downloads all project source files and maps their strings.
 *
 * @param filePaths File ids mapped to their export path.
 * @returns Source files mapped to source string keys and their source text.
 */
async function getSourceStrings(filePaths: Map<number, string>): Promise<Map<number, Map<string, string>>> {
	const sourceFiles = new Map<number, Map<string, string>>();
	let offset = 0;
	let currentFileId;
	let currentFileStrings: Map<string, string> | undefined;
	while (true) {
		const data = (await sourceStringsApi.listProjectStrings(projectId, { limit: 500, offset: offset })).data;
		if (data.length === 0) {
			break;
		}
		for (const { data: string } of data) {
			const fileId = string.fileId;
			if (filePaths.has(fileId) && !sourceEqualityCheck.includes(filePaths.get(fileId)!.substring(0, filePaths.get(fileId)!.indexOf('/')))) {
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
			if (typeof string.text === 'string') {
				currentFileStrings!.set(string.identifier, string.text);
			}
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
	core.info('AUTHORS file.');
	fse.writeFileSync(strings.authors.fileName, `${strings.authors.header}${gitContributors}${translators}`);
}

/**
 * Uses `git shortlog` to get a list Git contributors.
 *
 * @returns List of contributors, with heading
 */
function getGitContributors(): string {
	core.info('Getting Git contributors.');
	let output = `${strings.authors.contributors}:\n`;
	for (const line of execute('git shortlog --all -sn --no-merges').split('\n')) {
		const contributor = line.substring(line.indexOf('\t') + 1);
		if (contributor !== strings.git.committer.name) {
			output += ` ${contributor}\n`;
		}
	}
	return output;
}

/**
 * Gets all translators from the Crowdin project.
 *
 * @param targetLanguageIds List of project target language ids.
 * @returns List of translators, with heading.
 */
async function getTranslators(targetLanguageIds: string[]): Promise<string> {
	core.info('Getting translators.');
	// blocked users
	const blockedUsers: number[] = [];
	for (const { data: blockedUser } of (await usersApi.listProjectMembers(projectId, undefined, UsersModel.Role.BLOCKED, undefined, 500)).data) {
		blockedUsers.push(blockedUser.id);
	}
	// report
	const requests = [];
	for (const languageId of targetLanguageIds) {
		/**
		 * @returns Crowdin top members report request
		 */
		async function request(): Promise<any> {
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
			return (await axios.get((await reportsApi.downloadReport(projectId, reportId)).data.url)).data;
		}
		requests.push(requestLimit(() => request()));
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

	let output = `${strings.authors.translators}:\n`;
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
async function buildProject(): Promise<number> {
	core.info('Building Crowdin project.');
	if (process.env.CROWDIN_SYNC_SKIP_BUILD) { // download newest build when testing
		const { id, status } = (await translationsApi.listProjectBuilds(projectId, undefined, 1)).data[0].data;
		if (status === 'finished') {
			return id;
		}
	}
	const { id, status } = (await translationsApi.buildProject(projectId, { skipUntranslatedStrings: true })).data;
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
 * @returns A `LanguagesGatheringResult` object containing the properties `targetLanguageIds` and `languageCodeMap`.
 */
async function getLanguages(): Promise<LanguagesGatheringResult> {
	const projectData = (await projectsGroupsApi.getProject(projectId)).data;
	const languageCodeMap = new Map<string, string>(); // <locale, languageId>
	for (const language of projectData.targetLanguages) {
		languageCodeMap.set(language.locale, language.id);
	}
	return { languageCodeMap, targetLanguageIds: projectData.targetLanguageIds };
}

/**
 * Downloads the build, trims the translation files and moves them to their directories.
 *
 * @param buildId Build id.
 * @param sourceFiles Source files mapped to source string keys and their source text.
 * @param filePaths File ids mapped to their export path.
 * @returns A `processBuildResult` object containing the properties `desktopFileTranslations` and `languageList`.
 */
async function processBuild(buildId: number, sourceFiles: Map<number, Map<string, string>>, filePaths: Map<number, string>): Promise<BuildProcessingResult> {
	core.info('Processing build.');
	const translatedSourceMap = new Map<string, Map<string, string>>(); // <filePath, <stringKey, stringText>> Paths mapped to source strings insteaad of file ids.
	for (const key of sourceFiles.keys()) {
		if (filePaths.has(key)) {
			translatedSourceMap.set(filePaths.get(key)!, sourceFiles.get(key)!);
		}
	}
	// Download build.
	const zipFile = new Zip(
		(await axios.get((await translationsApi.downloadTranslations(projectId, buildId)).data.url, { responseType: 'arraybuffer' })).data
	);
	const desktopFileTranslations = new Map<string, Map<string, string>>(); // <locale, <stringKey, translation>>
	const languageList = new Map<string, string>(); // <locale, localeLanguageName>
	for (const zipEntry of zipFile.getEntries()) {
		const entryFullPath = zipEntry.entryName;
		const { dir: entryDir, name: entryName } = path.parse(entryFullPath);
		if (entryDir === 'Website') {
			continue;
		}
		let fileContent = normalize(zipFile.readAsText(zipEntry));
		if (fileContent.length === 0) {
			continue;
		}
		// Replace line breaks with \n, as OBS only supports one-line translations.
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
		fse.writeFileSync(entryFullPath, translationContent);
	}
	return { desktopFileTranslations: new Map([...desktopFileTranslations].sort((a, b) => String(a[0]).localeCompare(b[0]))), languageList };
}

/**
 * Updates `com.obsproject.Studio.desktop` file with translations.
 *
 * @param languageFiles Locales mapped to their desktop file translations.
 */
function desktopFile(languageFiles: Map<string, Map<string, string>>): void {
	core.info('UI/xdg-data/com.obsproject.Studio.desktop');
	const filePath = path.join('UI', 'xdg-data', 'com.obsproject.Studio.desktop');
	const desktopFile = normalize(fse.readFileSync(filePath, 'utf-8'));
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
	fse.writeFileSync(filePath, result);
}

/**
 * Updates `locale.ini` file with languages.
 *
 * @param languageList Locales mapped to their locale language name.
 * @param languageCodeMap Locales mapped to their language id.
 */
async function languagesFile(languageList: Map<string, string>, languageCodeMap: Map<string, string>): Promise<void> {
	core.info('UI/data/locale.ini');
	const progressMap = new Map<string, number>(); // <languageId, translationProgress>
	for (const { data: language } of (await translationStatusApi.getProjectProgress(projectId, 500)).data) {
		progressMap.set(language.languageId, language.translationProgress);
	}
	const languagesInList = [];
	const languagueListPath = path.join('UI', 'data', 'locale.ini');
	for (const line of normalize(fse.readFileSync(languagueListPath, 'utf-8')).split('\n')) {
		if (line.startsWith('[') && line !== `[${strings.language.locale}]`) {
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
	finalLanguages.push(strings.language.locale);
	languageList.set(strings.language.locale, strings.language.name);
	let result = '';
	for (const locale of finalLanguages.sort()) {
		if (languageList.has(locale)) {
			result += `[${locale}]\nName=${languageList.get(locale)}\n\n`;
		} else {
			core.error(`${locale} was supposed to be included but is missing the language name ('Language' string in 'Main Application' file).`);
		}
	}
	fse.writeFileSync(languagueListPath, `${result.trimEnd()}\n`);
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
	core.info('Pushing changes.');
	execute(`git config --global user.name '${strings.git.committer.name}'`);
	execute(`git config --global user.email '${strings.git.committer.email}'`);
	for (const submodule of submodules) {
		process.chdir(path.join('plugins', submodule));
		if (execute('git status --porcelain').length === 0) {
			process.chdir('../..');
			continue;
		}
		execute('git add .');
		execute(`git commit -m '${strings.git.commitTitle}'`);
		execute('git push');
		process.chdir('../..');
	}
	execute('git add .');
	for (const submodule of detachedSubmodules) {
		core.info(`${submodule} has commits not pushed to the main repository. Only pushing to submodule.`);
		execute(`git checkout HEAD -- plugins/${submodule}`);
		execute(`git submodule update --init plugins/${submodule}`);
	}
	if (execute('git status --porcelain').length === 0) {
		core.info('No changes in main repository. Skipping push.');
		return;
	}
	execute(`git commit -m '${strings.git.commitTitle}'`);
	execute('git push');
}

// Executes steps simultaneously where possible.
(async() => {
	try {
		removePreviousTranslations();
		const results = [];
		results[0] = await Promise.all([prepareBuildProcessing(), await getFilePaths(), await buildProject(), await getLanguages()]);
		results[1] = await Promise.all([generateAuthors(getGitContributors(), await getTranslators(results[0][3].targetLanguageIds)), await processBuild(results[0][2], await getSourceStrings(results[0][1]), results[0][1])]);
		await languagesFile(results[1][1].languageList, results[0][3].languageCodeMap);
		desktopFile(results[1][1].desktopFileTranslations);
		pushChanges(results[0][0]);
	} catch (error) {
		console.error(error);
		core.setFailed(error);
	}
})();
