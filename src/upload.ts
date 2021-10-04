import CROWDIN from '@crowdin/crowdin-api-client';
import FSE from 'fs-extra';
import PATH from 'path';
import * as ACTION from '@actions/core';

import { exec, normalize } from './utils';
import { projectId } from './constants';

const { sourceFilesApi, uploadStorageApi } = new CROWDIN({
	token: process.env.CROWDIN_PAT!
});

(async () => {
	try {
		const sourceFiles = new Map<string, number>();
		for (const { data: sourceFile } of (
			await sourceFilesApi.listProjectFiles(projectId, {
				limit: 500
			})
		).data) {
			const exportOptions = sourceFile.exportOptions;
			if (!exportOptions) {
				continue;
			}
			sourceFiles.set(
				exportOptions.exportPattern.substr(1).replace('%file_name%', PATH.parse(sourceFile.name).name).replace('%locale%', 'en-US'),
				sourceFile.id
			);
		}
		let failed = 0;
		for (const filePath of normalize(exec(`git diff --name-only ${process.env.GITHUB_EVENT_BEFORE} ${process.env.GITHUB_SHA}`)).split(
			'\n'
		)) {
			if (sourceFiles.has(filePath)) {
				await sourceFilesApi.updateOrRestoreFile(projectId, sourceFiles.get(filePath)!, {
					storageId: (await uploadStorageApi.addStorage('File.ini', FSE.readFileSync(filePath))).data.id
				});
				ACTION.info(`${filePath} updated on Crowdin.`);
			} else {
				ACTION.error(`${filePath} couldn't be found on Crowdin.`);
				failed++;
			}
		}
		if (failed) {
			throw new Error(
				`${failed} file(s) couldn't be found on Crowdin and their export path needs to be fixed. New files need to be uploaded first manually to be updated.`
			);
		}
	} catch (e) {
		ACTION.setFailed(e as Error);
	}
})();
