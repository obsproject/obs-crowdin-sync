import * as core from '@actions/core';
import * as fse from 'fs-extra';
import * as path from 'path';
import Crowdin from '@crowdin/crowdin-api-client';

import { execute, normalize } from '../../shared/utils';
import { projectId } from '../../shared/constants';

const { sourceFilesApi, uploadStorageApi } = new Crowdin({
	token: process.env.CROWDIN_PAT!,
	organization: 'vainock'
});

(async() => {
	try {
		const sourceFiles = new Map<string, number>();
		for (const { data: sourceFile } of (await sourceFilesApi.listProjectFiles(projectId, { limit: 500 })).data) {
			const exportOptions = sourceFile.exportOptions;
			if (!exportOptions) {
				continue;
			}
			sourceFiles.set(exportOptions.exportPattern.substr(1).replace('%file_name%', path.parse(sourceFile.name).name).replace('%locale%', 'en-US'), sourceFile.id);
		}
		let failed = 0;
		for (const filePath of normalize(execute(`git diff --name-only ${process.env.GITHUB_EVENT_BEFORE} ${process.env.GITHUB_SHA}`)).split('\n')) {
			if (sourceFiles.has(filePath)) {
				const storageId = (await uploadStorageApi.addStorage('File.ini', fse.readFileSync(filePath))).data.id;
				await sourceFilesApi.updateOrRestoreFile(projectId, sourceFiles.get(filePath)!, { storageId: storageId });
				core.info(`${filePath} updated on Crowdin.`);
			} else {
				core.error(`${filePath} couldn't be found on Crowdin.`);
				failed++;
			}
		}
		if (failed) {
			throw new Error(`${failed} file(s) couldn't be found on Crowdin. Fix the export path or upload the file(s) if missing.`);
		}
	} catch (error) {
		console.error(error);
		core.setFailed(error);
	}
})();
