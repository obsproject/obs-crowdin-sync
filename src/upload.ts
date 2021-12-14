import CROWDIN, { SourceFilesModel } from '@crowdin/crowdin-api-client';
import FSE from 'fs-extra';
import PATH from 'path';
import * as ACTION from '@actions/core';

import STRINGS from './strings';
import { exec, normalize } from './utils';
import { projectId, CROWDIN_PAT, CROWDIN_ORG, JEST_RUN } from './constants';

if (!CROWDIN_PAT && !JEST_RUN) {
	ACTION.error('Environment variable CROWDIN_PAT not provided, skipping action.');
	process.exit(0);
}

const { sourceFilesApi, uploadStorageApi, sourceStringsApi } = new CROWDIN({
	token: CROWDIN_PAT || '',
	organization: CROWDIN_ORG
});

(async () => {
	try {
		const sourceFilesPaths = new Map<string, number>();
		for (const { data: sourceFile } of (
			await sourceFilesApi.listProjectFiles(projectId, {
				limit: 500
			})
		).data) {
			const exportOptions = sourceFile.exportOptions;
			if (!exportOptions) {
				continue;
			}
			sourceFilesPaths.set(
				exportOptions.exportPattern
					.substr(1)
					.replace('%file_name%', PATH.parse(sourceFile.name).name)
					.replace('%locale%', STRINGS.language.locale),
				sourceFile.id
			);
		}
		const failedFiles = [];
		for (const filePath of normalize(exec(`git diff --name-only ${process.env.GITHUB_EVENT_BEFORE} ${process.env.GITHUB_SHA}`)).split(
			'\n'
		)) {
			if (!filePath.endsWith(`/${STRINGS.language.locale}.ini`)) {
				continue;
			}
			if (sourceFilesPaths.has(filePath)) {
				const fileId = sourceFilesPaths.get(filePath)!;
				const previousFileStrings = new Map<string, string>();
				let offset = 0;
				while (true) {
					const projectStrings = (
						await sourceStringsApi.listProjectStrings(projectId, {
							fileId: fileId,
							limit: 500,
							offset: offset
						})
					).data;
					if (projectStrings.length === 0) {
						break;
					}
					for (const { data: sourceString } of projectStrings) {
						previousFileStrings.set(sourceString.identifier, (sourceString.text as string).replace(/"/g, '\\"'));
					}
					offset += 500;
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
				await sourceFilesApi.updateOrRestoreFile(projectId, fileId, {
					storageId: (await uploadStorageApi.addStorage('File1.ini', localFileContent)).data.id,
					updateOption: SourceFilesModel.UpdateOption.KEEP_TRANSLATIONS_AND_APPROVALS
				});
				if (stringsChanged && localFileContent !== localFileContentCopy) {
					await sourceFilesApi.updateOrRestoreFile(projectId, fileId, {
						storageId: (await uploadStorageApi.addStorage('File2.ini', localFileContentCopy)).data.id
					});
				}
				ACTION.notice(`${filePath} updated on Crowdin.`);
			} else {
				failedFiles.push(filePath);
			}
		}
		if (failedFiles.length !== 0) {
			throw new Error(
				`Some files couldn't be found on Crowdin and/or their export paths need to be fixed to get updated:\n ${failedFiles.join('\n ')}`
			);
		}
	} catch (e) {
		ACTION.setFailed(e as Error);
	}
})();
