import NOCK from 'nock';
import FSE from 'fs-extra';
import * as ACTIONS from '@actions/core';

import { upload } from '../src/upload';
import { PROJECT_ID } from '../src/constants';

let scopeMain: NOCK.Scope;
let scopeStorages: NOCK.Scope;

beforeAll(async () => {
	const rootDir = 'tests/worktree/upload';
	if (await FSE.pathExists(rootDir)) {
		await FSE.rm(rootDir, { recursive: true });
	}
	await FSE.mkdir(`${rootDir}/UI/data/locale`, { recursive: true });
	process.chdir(rootDir);
	await FSE.mkdir('plugins/sndio/data/locale', { recursive: true });
	await FSE.writeFile('UI/data/locale/en-US.ini', '\n# Comment"\nYes="Yes"\nCancel="Cancel"\n');
	await FSE.writeFile('plugins/sndio/data/locale/en-US.ini', 'Device="Device"\nRate="Rate"\n');

	const MAX_API_PAGE_SIZE = 500;
	scopeMain = NOCK(`https://api.crowdin.com/api/v2/projects/${PROJECT_ID}`)
		.get('/files')
		.query({ limit: MAX_API_PAGE_SIZE })
		.reply(200, {
			data: [
				{
					data: {
						exportOptions: {
							exportPattern: '/%file_name%/data/locale/%locale%.ini'
						},
						id: 29,
						name: 'UI.ini'
					}
				}
			]
		})
		.put('/files/29', {
			storageId: 1
		})
		.reply(200, {
			data: [
				{
					data: {
						identifier: 'Yes',
						text: 'Yes'
					}
				},
				{
					data: {
						identifier: 'Cancel',
						text: 'Cancel'
					}
				},
				{
					data: {
						identifier: 'OK',
						text: 'OK'
					}
				},
				{
					data: {
						identifier: 'Apply',
						text: 'Apply'
					}
				}
			]
		});

	scopeStorages = NOCK('https://api.crowdin.com/api/v2/storages')
		.post('', '\n# Comment"\nYes="Yes"\nCancel="Cancel"\n')
		.matchHeader('Crowdin-API-FileName', 'File.ini')
		.reply(201, {
			data: {
				id: 1
			}
		});
});

it(upload.name, async () => {
	const noticeMock = jest.spyOn(ACTIONS, 'notice').mockImplementation(() => {});
	const errorMock = jest.spyOn(ACTIONS, 'setFailed').mockImplementation(() => {});
	await upload('UI/data/locale/en-US.ini\nAUTHORS\nUI/adv-audio-control.cpp\nplugins/decklink/data/locale/en-US.ini');
	expect(noticeMock).toBeCalledWith('UI/data/locale/en-US.ini updated on Crowdin.');
	expect(errorMock).toBeCalledWith(
		"Some files couldn't be found on Crowdin and/or their export paths need to be fixed to get updated:\n plugins/decklink/data/locale/en-US.ini"
	);
});

afterAll(() => {
	scopeMain.done();
	scopeStorages.done();
});
