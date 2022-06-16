import CROWDIN from '@crowdin/crowdin-api-client';
import FSE from 'fs-extra';
import PATH from 'path';
import * as ACTIONS from '@actions/core';

import STRINGS from './strings';
import { exec, normalize } from './utils';
import { PROJECT_ID, CROWDIN_PAT, JEST_RUN } from './constants';

if (!CROWDIN_PAT && !JEST_RUN) {
	ACTIONS.error('Environment variable CROWDIN_PAT not provided. Skipping action.');
	process.exit(0);
}

const { sourceFilesApi, uploadStorageApi } = new CROWDIN({
	token: CROWDIN_PAT || ''
});

/**
 * Uses `git diff` to get the files changed by the commits.
 *
 * @returns List of files changed by the commits.
 */
function getChangedFiles(): string[] {
	if (exec(`git log --format=%B ${process.env.GITHUB_EVENT_BEFORE}..${process.env.GITHUB_SHA}`).includes('[skip crowdin-sync]')) {
		ACTIONS.info('Found [skip crowdin-sync] in at least one commit message. Skipping action.');
		process.exit(0);
	}
	return normalize(exec(`git diff --name-only ${process.env.GITHUB_EVENT_BEFORE}..${process.env.GITHUB_SHA}`)).split('\n');
}

/**
 * Uploads updated English source files to Crowdin.
 *
 * @param changedFiles Files changed by the commits.
 */
export async function upload(changedFiles: string[]): Promise<void> {
	const crowdinFilePaths = new Map<string, number>();
	for (const { data: crowdinFile } of (await sourceFilesApi.withFetchAll().listProjectFiles(PROJECT_ID)).data) {
		const exportOptions = crowdinFile.exportOptions;
		if (!exportOptions) {
			continue;
		}
		crowdinFilePaths.set(
			exportOptions.exportPattern
				.substring(1)
				.replace('%file_name%', PATH.parse(crowdinFile.name).name)
				.replace('%locale%', STRINGS.englishLanguage.locale),
			crowdinFile.id
		);
	}
	for (const filePath of changedFiles) {
		if (!filePath.endsWith(`/${STRINGS.englishLanguage.locale}.ini`)) {
			continue;
		}

		const crowdinFileId = crowdinFilePaths.get(filePath)!;
		if (!(await FSE.pathExists(filePath))) {
			await sourceFilesApi.deleteFile(PROJECT_ID, crowdinFileId);
			ACTIONS.notice(`${filePath} removed from Crowdin.`);
			continue;
		}

		const storageId = async () => (await uploadStorageApi.addStorage('File.ini', await FSE.readFile(filePath))).data.id;
		const pathParts = filePath.split('/');
		if (crowdinFilePaths.has(filePath)) {
			await sourceFilesApi.updateOrRestoreFile(PROJECT_ID, crowdinFileId, { storageId: await storageId() });
			ACTIONS.notice(`${filePath} updated on Crowdin.`);
			continue;
		}
		if (/^plugins\/.*\/data\/locale$/.test(PATH.parse(filePath).dir)) {
			await sourceFilesApi.createFile(PROJECT_ID, {
				name: `${pathParts[1]}.ini`,
				storageId: await storageId(),
				directoryId: 28,
				exportOptions: { exportPattern: '/plugins/%file_name%/data/locale/%locale%.ini' }
			});
		} else if (/^UI\/frontend-plugins\/.*\/data\/locale$/.test(PATH.parse(filePath).dir)) {
			await sourceFilesApi.createFile(PROJECT_ID, {
				name: `${pathParts[2]}.ini`,
				storageId: await storageId(),
				directoryId: 136,
				exportOptions: { exportPattern: '/UI/frontend-plugins/%file_name%/data/locale/%locale%.ini' }
			});
		} else {
			ACTIONS.error(`${filePath} not uploaded to Crowdin due to its unexpected location. This may be intended.`);
			continue;
		}
		ACTIONS.notice(`${filePath} uploaded to Crowdin.`);
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
