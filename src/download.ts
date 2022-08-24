import AXIOS from 'axios';
import ZIP from 'adm-zip';
import PLIMIT from 'p-limit';
import PATH from 'path';
import FSE from 'fs-extra';
import CROWDIN from '@crowdin/crowdin-api-client';
import * as ACTION from '@actions/core';

import { wait, exec, normalize } from './utils';
import { PROJECT_ID, JEST_RUN, STRINGS } from './index';

const { reportsApi, translationsApi, usersApi, projectsGroupsApi, sourceFilesApi, translationStatusApi } = new CROWDIN({
	token: process.env.CROWDIN_PAT || ''
});

async function getSubmodules(): Promise<string[]> {
	const submodules = [];
	for (const line of exec('git config --file .gitmodules --get-regexp path').trimEnd().split('\n')) {
		const submodulePath = line.split(' ')[1];
		if (
			(await FSE.pathExists(`${submodulePath}/data/locale/en-US.ini`)) ||
			(submodulePath === 'plugins/enc-amf' && FSE.pathExists('plugins/enc-amf/resources/locale/en-US.ini'))
		) {
			submodules.push(submodulePath.split('/')[1]);
		}
	}
	return submodules;
}

export async function removePreviousTranslations(sourceFilePaths: string[]): Promise<void> {
	let pathsToClear: string[] = ['UI/data/locale', 'plugins/enc-amf/resources/locale', 'plugins/mac-virtualcam/src/obs-plugin/data/locale'];
	for (const pluginRootDir of ['plugins', 'UI/frontend-plugins']) {
		if (!(await FSE.pathExists(pluginRootDir))) {
			continue;
		}
		for (const pluginDir of await FSE.readdir(pluginRootDir)) {
			pathsToClear.push(`${pluginRootDir}/${pluginDir}/data/locale`);
		}
	}
	for (const path of pathsToClear) {
		if (!(await FSE.pathExists(path))) {
			continue;
		}
		for (const file of await FSE.readdir(path)) {
			if (file !== `${STRINGS.englishLanguage.locale}.ini` && sourceFilePaths.includes(path)) {
				await FSE.remove(`${path}/${file}`);
			}
		}
	}
}

function getDetachedSubmodules(submodules: string[]): string[] {
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

export async function getSourceFilePaths(): Promise<string[]> {
	let paths: string[] = [];
	for (const { data: sourceFile } of (await sourceFilesApi.withFetchAll().listProjectFiles(PROJECT_ID)).data) {
		let path = sourceFile.exportOptions.exportPattern;
		path = path.replace('%file_name%', sourceFile.name.split('.')[0]);
		path = path.substring(1, path.lastIndexOf('/'));
		paths.push(path);
	}
	return paths;
}

async function generateAuthors(gitContributors: string, translators: string): Promise<void> {
	await FSE.writeFile(STRINGS.authors.fileName, `${STRINGS.authors.header}${gitContributors}${translators}`);
}

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

export async function getTranslators(targetLanguageIds: string[]): Promise<string> {
	// free test projects don't have access to reports, so return to avoid error
	if (PROJECT_ID && !JEST_RUN) {
		return '';
	}
	const blockedUsers: number[] = [];
	for (const { data: blockedUser } of (await usersApi.withFetchAll().listProjectMembers(PROJECT_ID, { role: 'blocked' })).data) {
		blockedUsers.push(blockedUser.id);
	}

	const requests = [];
	for (const languageId of targetLanguageIds) {
		requests.push(
			requestLimit(() =>
				(async () => {
					const { status: reportStatus, identifier: reportId } = (
						await reportsApi.generateReport(PROJECT_ID, {
							name: 'top-members',
							schema: {
								unit: 'words',
								format: 'json',
								dateFrom: '2014-01-01T00:00:00+00:00',
								dateTo: '2030-01-01T00:00:00+00:00',
								languageId
							}
						})
					).data;
					let finished = reportStatus === 'finished';
					while (!finished) {
						await wait(3000);
						finished = (await reportsApi.checkReportStatus(PROJECT_ID, reportId)).data.status === 'finished';
					}
					return (await AXIOS.get((await reportsApi.downloadReport(PROJECT_ID, reportId)).data.url)).data;
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

export async function buildTranslations(): Promise<number> {
	const appDirId = (await sourceFilesApi.listProjectDirectories(PROJECT_ID, { filter: 'App' })).data[0].data.id;
	const { id, status } = (await translationsApi.buildProjectDirectoryTranslation(PROJECT_ID, appDirId, { skipUntranslatedStrings: true }))
		.data;
	let finished = status === 'finished';
	while (!finished) {
		await wait(5000);
		finished = (await translationsApi.checkBuildStatus(PROJECT_ID, id)).data.status === 'finished';
	}
	return id;
}

export async function getLanguages(): Promise<{
	targetLanguageIds: string[];
	languageCodeMap: Map<string, string>;
}> {
	const projectData = (await projectsGroupsApi.getProject(PROJECT_ID)).data;
	const languageCodeMap = new Map<string, string>(); // <locale, languageId>
	for (const language of projectData.targetLanguages) {
		languageCodeMap.set(language.locale, language.id);
	}
	return {
		languageCodeMap,
		targetLanguageIds: projectData.targetLanguageIds
	};
}

export async function processBuild(buildId: number): Promise<{
	desktopFileTranslations: Map<string, Map<string, string>>;
	languageList: Map<string, string>;
}> {
	const build = new ZIP(
		(await AXIOS.get((await translationsApi.downloadTranslations(PROJECT_ID, buildId)).data.url, { responseType: 'arraybuffer' })).data
	);
	const desktopFileTranslations = new Map<string, Map<string, string>>(); // <locale, <stringKey, translation>>
	const languageList = new Map<string, string>(); // <locale, localeLanguageName>
	const missingDirs: string[] = [];
	for (const zipEntry of build.getEntries()) {
		const entryFullPath = zipEntry.entryName;
		const { dir: entryDir, name: entryName } = PATH.parse(entryFullPath);
		let fileContent = normalize(build.readAsText(zipEntry));
		if (fileContent.length === 0) {
			continue;
		}

		let fixedLineBreaks = '';
		for (const line of fileContent.trimEnd().split('\n')) {
			fixedLineBreaks += (line.includes('="') && !line.endsWith('="') ? '\n' : '\\n') + line;
		}
		fileContent = fixedLineBreaks.trimStart();
		const fileLines = fileContent.split('\n');

		if (entryDir === 'desktop-entry') {
			const translations = new Map<string, string>();
			for (const line of fileLines) {
				const parsedLine = parseStringLine(line);
				translations.set(parsedLine.key, parsedLine.value);
			}
			desktopFileTranslations.set(entryName, translations);
			continue;
		}

		if (entryDir === 'UI/data/locale') {
			const parsedLine = parseStringLine(fileLines[0]);
			if (parsedLine.key === 'Language') {
				languageList.set(entryName, parsedLine.value);
			}
		}
		if (!(await FSE.pathExists(entryDir))) {
			if (missingDirs.includes(entryDir)) {
				continue;
			}
			ACTION.notice(`${entryDir} doesn't exist in the codebase. Remove this file on Crowdin.`);
			missingDirs.push(entryDir);
			continue;
		}
		await FSE.writeFile(entryFullPath, `${fileContent}\n`);
	}
	return {
		desktopFileTranslations: new Map([...desktopFileTranslations].sort((a, b) => a[0].localeCompare(b[0]))),
		languageList
	};
}

export async function createDesktopFile(languageFiles: Map<string, Map<string, string>>): Promise<void> {
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

export async function createLocaleFile(languageList: Map<string, string>, languageCodeMap: Map<string, string>): Promise<void> {
	const progressMap = new Map<string, number>(); // <languageId, translationProgress>
	for (const { data: language } of (await translationStatusApi.withFetchAll().getProjectProgress(PROJECT_ID)).data) {
		progressMap.set(language.languageId, language.translationProgress);
	}
	const languagesInList = [];
	const languagueListPath = 'UI/data/locale.ini';
	for (const line of normalize(await FSE.readFile(languagueListPath, 'utf-8')).split('\n')) {
		if (line.startsWith('[') && line !== `[${STRINGS.englishLanguage.locale}]`) {
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
	finalLanguages.push(STRINGS.englishLanguage.locale);
	languageList.set(STRINGS.englishLanguage.locale, STRINGS.englishLanguage.name);
	let result = '';
	for (const locale of finalLanguages.sort()) {
		if (languageList.has(locale)) {
			result += `[${locale}]\nName=${languageList.get(locale)}\n\n`;
		} else {
			ACTION.error(`${locale} is missing a translation for its language name and could therefore not be included in the language list.`);
		}
	}
	await FSE.writeFile(languagueListPath, `${result.trimEnd()}\n`);
}
function pushChanges(detachedSubmodules: string[], submodules: string[]): void {
	if (ACTION.getInput('SKIP_PUSH') === 'TRUE') {
		return;
	}
	exec(`git config --global user.name '${STRINGS.git.committer.name}'`);
	exec(`git config --global user.email '${STRINGS.git.committer.email}'`);
	for (const submodule of submodules) {
		process.chdir(`plugins/${submodule}`);
		if (exec('git status --porcelain').length === 0) {
			process.chdir('../..');
			continue;
		}
		exec(`git add '${submodule === 'enc-amf' ? 'resources/locale/*-*.ini' : 'data/locale/*-*.ini'}'`);
		exec(`git commit -m '${STRINGS.git.commitTitle}'`);
		exec('git push');
		process.chdir('../..');
	}
	for (const allowedPath of [
		'AUTHORS',
		'plugins/*/data/locale/*-*.ini',
		'plugins/mac-virtualcam/src/obs-plugin/data/locale/*-*.ini',
		'UI/data/locale.ini',
		'UI/data/locale/*-*.ini',
		'UI/xdg-data/com.obsproject.Studio.desktop',
		'UI/frontend-plugins/*/data/locale/*-*.ini'
	]) {
		exec(`git add '${allowedPath}'`);
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

function parseStringLine(line: string): { key: string; value: string } {
	return { key: line.split('=')[0], value: line.split('="')[1].slice(0, -1) };
}

export async function execute() {
	await removePreviousTranslations(await getSourceFilePaths());
	const languages = await getLanguages();
	generateAuthors(getGitContributors(), await getTranslators(languages.targetLanguageIds));
	const processedBuild = await processBuild(await buildTranslations());
	createLocaleFile(processedBuild.languageList, languages.languageCodeMap);
	createDesktopFile(processedBuild.desktopFileTranslations);
	const submodules = await getSubmodules();
	pushChanges(getDetachedSubmodules(submodules), submodules);
}
