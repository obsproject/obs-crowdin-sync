import NOCK from 'nock';
import FSE from 'fs-extra';
import PATH from 'path';
import * as ACTIONS from '@actions/core';

import { upload } from '../src/upload';
import { PROJECT_ID } from '../src/constants';

const scopeMain = NOCK(`https://api.crowdin.com/api/v2/projects/${PROJECT_ID}`);
const scopeStorages = NOCK('https://api.crowdin.com/api/v2/storages');
const MAX_API_PAGE_SIZE = 500;

beforeAll(async () => {
	const rootDir = 'tests/temp/upload';
	if (await FSE.pathExists(rootDir)) {
		await FSE.rm(rootDir, { recursive: true });
	}
	await FSE.mkdir(rootDir, { recursive: true });
	process.chdir(rootDir);
	for (const [filePath, content] of Object.entries({
		'UI/data/locale/en-US.ini': '\n# Comment"\nYes="Yes"\nCancel="Cancel"\n',
		'UI/frontend-plugins/some-frontend/data/locale/en-US.ini': 'MyFrontendString="Text"',
		'plugins/sndio/data/locale/en-US.ini': 'Device="Device"\nRate="Rate"\n',
		'plugins/my-plugin/data/locale/en-US.ini': 'MyPluginString="Text"',
		'plugins/data/locale/en-US.ini': '123'
	})) {
		await FSE.mkdir(PATH.parse(filePath).dir, { recursive: true });
		await FSE.writeFile(filePath, content);
	}
});

it(upload.name, async () => {
	scopeMain
		.get('/directories')
		.query({ filter: 'Plugins' })
		.reply(200, {
			data: [
				{
					data: {
						id: 28
					}
				}
			]
		})
		.get('/directories')
		.query({ filter: 'Frontend' })
		.reply(200, {
			data: [
				{
					data: {
						id: 136
					}
				}
			]
		})
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
				},
				{
					data: {
						exportOptions: {
							exportPattern: '/plugins/%file_name%/data/locale/%locale%.ini'
						},
						id: 187,
						name: 'removed.ini'
					}
				}
			]
		})
		.put('/files/29', {
			storageId: 1
		})
		.reply(200)
		.post('/files', {
			storageId: 2,
			directoryId: 28,
			name: 'my-plugin.ini',
			exportOptions: {
				exportPattern: '/plugins/%file_name%/data/locale/%locale%.ini'
			}
		})
		.reply(201)
		.post('/files', {
			storageId: 3,
			directoryId: 136,
			name: 'some-frontend.ini',
			exportOptions: {
				exportPattern: '/UI/frontend-plugins/%file_name%/data/locale/%locale%.ini'
			}
		})
		.reply(201)
		.delete('/files/187')
		.reply(204);
	scopeStorages
		.post('', '\n# Comment"\nYes="Yes"\nCancel="Cancel"\n')
		.reply(201, {
			data: {
				id: 1
			}
		})
		.post('', 'MyPluginString="Text"')
		.reply(201, {
			data: {
				id: 2
			}
		})
		.post('', 'MyFrontendString="Text"')
		.reply(201, {
			data: {
				id: 3
			}
		});

	const noticeMock = jest.spyOn(ACTIONS, 'notice').mockImplementation(a => {});
	const errorMock = jest.spyOn(ACTIONS, 'error').mockImplementation(() => {});

	await upload([
		'UI/data/locale/en-US.ini',
		'AUTHORS',
		'UI/frontend-plugins/some-frontend/data/locale/en-US.ini',
		'plugins/my-plugin/data/locale/en-US.ini',
		'plugins/data/locale/en-US.ini',
		'plugins/removed/data/locale/en-US.ini'
	]);

	expect(noticeMock).toBeCalledWith('UI/data/locale/en-US.ini updated on Crowdin.');
	expect(noticeMock).toBeCalledWith('UI/frontend-plugins/some-frontend/data/locale/en-US.ini uploaded to Crowdin.');
	expect(noticeMock).toBeCalledWith('plugins/my-plugin/data/locale/en-US.ini uploaded to Crowdin.');
	expect(noticeMock).toBeCalledWith('plugins/removed/data/locale/en-US.ini removed from Crowdin.');
	expect(errorMock).toBeCalledWith(
		'plugins/data/locale/en-US.ini not uploaded to Crowdin due to its unexpected location. This may be intended.'
	);
});

afterAll(() => {
	scopeMain.done();
	scopeStorages.done();
});
