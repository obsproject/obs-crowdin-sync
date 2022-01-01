import CROWDIN, { SourceFilesModel } from '@crowdin/crowdin-api-client';
import FSE from 'fs-extra';
import PATH from 'path';
import * as ACTIONS from '@actions/core';

import STRINGS from './strings';
import { exec, normalize } from './utils';
import { PROJECT_ID, CROWDIN_PAT, CROWDIN_ORG, JEST_RUN } from './constants';

if (!CROWDIN_PAT && !JEST_RUN) {
	ACTIONS.error('Environment variable CROWDIN_PAT not provided, skipping action.');
	process.exit(0);
}

const { sourceFilesApi, uploadStorageApi, sourceStringsApi } = new CROWDIN({
	token: CROWDIN_PAT || '',
	organization: CROWDIN_ORG
});

/**
 * Uses `git diff` to get the files changed by the commits.
 *
 * @returns `string ` of files changed by the commits.
 */
function getChangedFiles(): string {
	return exec(`git diff --name-only ${process.env.GITHUB_EVENT_BEFORE} ${process.env.GITHUB_SHA}`);
}

/**
 * Uploads updated English source files to Crowdin.
 *
 * @param changedFiles Files changed by the commits.
 */
export async function upload(changedFiles: string): Promise<void> {
	const sourceFilesPaths = new Map<string, number>();
	for (const { data: sourceFile } of (await sourceFilesApi.withFetchAll().listProjectFiles(PROJECT_ID)).data) {
		const exportOptions = sourceFile.exportOptions;
		if (!exportOptions) {
			continue;
		}
		sourceFilesPaths.set(
			exportOptions.exportPattern
				.substring(1)
				.replace('%file_name%', PATH.parse(sourceFile.name).name)
				.replace('%locale%', STRINGS.englishLanguage.locale),
			sourceFile.id
		);
	}
	const failedFiles = [];
	for (const filePath of normalize(changedFiles).split('\n')) {
		if (!filePath.endsWith(`/${STRINGS.englishLanguage.locale}.ini`)) {
			continue;
		}
		if (sourceFilesPaths.has(filePath)) {
			const fileId = sourceFilesPaths.get(filePath)!;
			const previousFileStrings = new Map<string, string>();
			for (const { data: sourceString } of (await sourceStringsApi.withFetchAll().listProjectStrings(PROJECT_ID, { fileId: fileId }))
				.data) {
				previousFileStrings.set(sourceString.identifier, (sourceString.text as string).replace(/"/g, '\\"'));
			}
			let localFileContent = (await FSE.readFile(filePath)).toString();
			const localFileContentCopy = localFileContent;
			let stringsChanged = false;
			for (const line of normalize(localFileContent).split('\n')) {
				if (line.startsWith('#')) {
					continue;
				}
				const stringKey = line.substring(0, line.indexOf('='));
				const stringValue = line.substring(line.indexOf('"') + 1, line.lastIndexOf('"'));
				if (previousFileStrings.has(stringKey)) {
					const previousStringValue = previousFileStrings.get(stringKey);
					if (previousStringValue !== stringValue) {
						localFileContent = localFileContent.replace(line, `${stringKey}="${previousStringValue}"`);
						if (!stringsChanged) {
							stringsChanged = true;
						}
					}
				}
			}
			await sourceFilesApi.updateOrRestoreFile(PROJECT_ID, fileId, {
				storageId: (await uploadStorageApi.addStorage('File1.ini', localFileContent)).data.id,
				updateOption: SourceFilesModel.UpdateOption.KEEP_TRANSLATIONS_AND_APPROVALS
			});
			if (stringsChanged && localFileContent !== localFileContentCopy) {
				await sourceFilesApi.updateOrRestoreFile(PROJECT_ID, fileId, {
					storageId: (await uploadStorageApi.addStorage('File2.ini', localFileContentCopy)).data.id
				});
			}
			ACTIONS.notice(`${filePath} updated on Crowdin.`);
		} else {
			failedFiles.push(filePath);
		}
	}
	if (failedFiles.length !== 0) {
		ACTIONS.setFailed(
			`Some files couldn't be found on Crowdin and/or their export paths need to be fixed to get updated:\n ${failedFiles.join('\n ')}`
		);
	}
}

(async () => {
	if (JEST_RUN) {
		return;
	}
	try {
		await upload(getChangedFiles());
	} catch (e) {
		ACTIONS.setFailed(e as Error);
	}
})();
