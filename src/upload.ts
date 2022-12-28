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

async function getDirId(name: string): Promise<number> {
	return (await sourceFilesApi.listProjectDirectories(PROJECT_ID, { filter: name })).data[0].data.id;
}

async function updateSourceFile(fileId: number, filePath: string) {
	const storageId = (await uploadStorageApi.addStorage('File.ini', await FSE.readFile(filePath))).data.id;

	await sourceFilesApi.updateOrRestoreFile(PROJECT_ID, fileId, {
		storageId
	});
	ACTIONS.notice(`${filePath} updated on Crowdin.`);
}

/**
 * Uploads updated English source files to Crowdin.
 *
 * @param changedFiles Files changed by the commits.
 */
export async function upload(changedFiles: string[], submoduleName?: string): Promise<void> {
	const crowdinFileIdMap = new Map<string, number>(); // <file export path, file id>
	for (const { data: crowdinFile } of (await sourceFilesApi.withFetchAll().listProjectFiles(PROJECT_ID)).data) {
		const exportOptions = crowdinFile.exportOptions;
		if (!exportOptions) {
			continue;
		}

		crowdinFileIdMap.set(
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

		if (submoduleName && filePath === `data/locale/${STRINGS.englishLanguage.locale}.ini`) {
			const submoduleExportPath = `plugins/${submoduleName}/data/locale/en-US.ini`;
			if (crowdinFileIdMap.has(submoduleExportPath)) {
				await updateSourceFile(crowdinFileIdMap.get(submoduleExportPath)!, filePath);
			} else {
				throw `For some reason ${submoduleExportPath} was not found on Crowdin.`;
			}
			break;
		}

		const crowdinFileId = crowdinFileIdMap.get(filePath)!;
		if (!(await FSE.pathExists(filePath))) {
			await sourceFilesApi.deleteFile(PROJECT_ID, crowdinFileId);
			ACTIONS.notice(`${filePath} removed from Crowdin.`);
			continue;
		}

		const storageId = async () => (await uploadStorageApi.addStorage('File.ini', await FSE.readFile(filePath))).data.id;
		const pathParts = filePath.split('/');
		if (crowdinFileIdMap.has(filePath)) {
			await updateSourceFile(crowdinFileId, filePath);
			continue;
		}
		if (/^plugins\/.*\/data\/locale$/.test(PATH.parse(filePath).dir)) {
			await sourceFilesApi.createFile(PROJECT_ID, {
				name: `${pathParts[1]}.ini`,
				storageId: await storageId(),
				directoryId: await getDirId('Plugins'),
				exportOptions: { exportPattern: '/plugins/%file_name%/data/locale/%locale%.ini' }
			});
		} else if (/^UI\/frontend-plugins\/.*\/data\/locale$/.test(PATH.parse(filePath).dir)) {
			await sourceFilesApi.createFile(PROJECT_ID, {
				name: `${pathParts[2]}.ini`,
				storageId: await storageId(),
				directoryId: await getDirId('Frontend'),
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
		await upload(getChangedFiles(), process.env.SUBMODULE_NAME);
	} catch (e) {
		ACTIONS.setFailed(e as Error);
	}
})();
