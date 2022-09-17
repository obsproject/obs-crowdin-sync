import FSE from 'fs-extra';
import PATH from 'path';
import CROWDIN from '@crowdin/crowdin-api-client';
import * as ACTION from '@actions/core';

import { exec, normalize } from './utils';
import { PROJECT_ID, STRINGS } from './index';

const { sourceFilesApi, uploadStorageApi } = new CROWDIN({
	token: process.env.CROWDIN_PAT || ''
});

function getChangedFiles(): string[] {
	if (exec(`git log --format=%B ${process.env.GITHUB_EVENT_BEFORE}..${process.env.GITHUB_SHA}`).includes('[skip crowdin-sync]')) {
		ACTION.info('Found [skip crowdin-sync] in at least one commit message. Skipping action.');
		process.exit(0);
	}
	return normalize(exec(`git diff --name-only ${process.env.GITHUB_EVENT_BEFORE}..${process.env.GITHUB_SHA}`)).split('\n');
}

async function getDirId(name: string): Promise<number> {
	return (await sourceFilesApi.listProjectDirectories(PROJECT_ID, { filter: name })).data[0].data.id;
}

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
		async function uploadToStorage() {
			return (await uploadStorageApi.addStorage('File.ini', await FSE.readFile(filePath))).data.id;
		}
		async function updateSourceFile(fileId: number) {
			await sourceFilesApi.updateOrRestoreFile(PROJECT_ID, fileId, {
				storageId: await uploadToStorage()
			});
			ACTION.notice(`${filePath} updated on Crowdin.`);
		}

		if (submoduleName && filePath === `data/locale/${STRINGS.englishLanguage.locale}.ini`) {
			const submoduleExportPath = `plugins/${submoduleName}/data/locale/en-US.ini`;
			if (crowdinFileIdMap.has(submoduleExportPath)) {
				await updateSourceFile(crowdinFileIdMap.get(submoduleExportPath)!);
			} else {
				throw `For some reason ${submoduleExportPath} was not found on Crowdin.`;
			}
			break;
		}

		const crowdinFileId = crowdinFileIdMap.get(filePath)!;
		if (!(await FSE.pathExists(filePath))) {
			await sourceFilesApi.deleteFile(PROJECT_ID, crowdinFileId);
			ACTION.notice(`${filePath} removed from Crowdin.`);
			continue;
		}

		const pathParts = filePath.split('/');
		if (crowdinFileIdMap.has(filePath)) {
			await updateSourceFile(crowdinFileId);
			continue;
		}
		if (/^plugins\/.*\/data\/locale$/.test(PATH.parse(filePath).dir)) {
			await sourceFilesApi.createFile(PROJECT_ID, {
				name: `${pathParts[1]}.ini`,
				storageId: await uploadToStorage(),
				directoryId: await getDirId('Plugins'),
				exportOptions: { exportPattern: '/plugins/%file_name%/data/locale/%locale%.ini' }
			});
		} else if (/^UI\/frontend-plugins\/.*\/data\/locale$/.test(PATH.parse(filePath).dir)) {
			await sourceFilesApi.createFile(PROJECT_ID, {
				name: `${pathParts[2]}.ini`,
				storageId: await uploadToStorage(),
				directoryId: await getDirId('Frontend'),
				exportOptions: { exportPattern: '/UI/frontend-plugins/%file_name%/data/locale/%locale%.ini' }
			});
		} else {
			ACTION.error(`${filePath} not uploaded to Crowdin due to its unexpected location. This may be correct.`);
			continue;
		}
		ACTION.notice(`${filePath} uploaded to Crowdin.`);
	}
}

export async function execute() {
	await upload(getChangedFiles(), ACTION.getInput('SUBMODULE_NAME'));
}
