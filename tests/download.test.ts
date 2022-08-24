import NOCK from 'nock';
import ZIP from 'adm-zip';
import PATH from 'path';
import FSE from 'fs-extra';
import * as ACTION from '@actions/core';

import { PROJECT_ID } from '../src/index';
import {
	getLanguages,
	getTranslators,
	getSourceFilePaths,
	buildTranslations,
	processBuild,
	createLocaleFile,
	createDesktopFile,
	removePreviousTranslations
} from '../src/download';

async function convertFileStructureToObject(filePath: string): Promise<{}> {
	filePath = PATH.resolve(filePath);
	if (!(await FSE.pathExists(filePath))) {
		return {};
	}
	if ((await FSE.lstat(filePath)).isFile()) {
		return {
			name: PATH.basename(filePath),
			content: await FSE.readFile(filePath, { encoding: 'utf-8' })
		};
	} else {
		const fileList = [];
		const dirFiles = await FSE.readdir(filePath);
		for (const file of dirFiles) {
			if (dirFiles.length === 1) {
				const subfolderFileStructure = (await convertFileStructureToObject(`${filePath}/${file}`)) as any;
				return {
					name: `${PATH.basename(filePath)}/${subfolderFileStructure.name}`,
					content: subfolderFileStructure.content
				};
			}
			fileList.push(await convertFileStructureToObject(`${filePath}/${file}`));
		}
		return {
			name: PATH.basename(filePath),
			content: fileList
		};
	}
}

const scopeMain = NOCK(`https://api.crowdin.com/api/v2/projects/${PROJECT_ID}`);
const scopeDownloads = NOCK('https://downloads.net');
const MAX_API_PAGE_SIZE = 500;

beforeAll(async () => {
	const rootDir = 'tests/temp/download';
	if (await FSE.pathExists(rootDir)) {
		await FSE.rm(rootDir, { recursive: true });
	}
	await FSE.mkdir(`${rootDir}/translations`, { recursive: true });
	process.chdir(`${rootDir}/translations`);
	const crowdinBuildFiles: Record<string, string> = {
		'UI/data/locale/de-DE.ini': '\nLanguage="Deutsch"\nOK="Okay"\n\nApply="Übernehmen"\nCancel="Abbre\nchen"\n\n',
		'UI/data/locale/fr-FR.ini': 'abc="123"',
		'UI/data/locale/en-GB.ini': 'Language="English (UK)"\nOK="OK"',
		'UI/data/locale/bem-ZM.ini': '\n\n\n\n\n\n',
		'UI/frontend-plugins/frontend-tools/data/locale/de-DE.ini': 'abc="123"',
		'plugins/enc-amf/resources/locale/de-DE.ini': 'abc="123"',
		'plugins/mac-virtualcam/src/obs-plugin/data/locale/de-DE.ini': 'abc="123"',
		'plugins/decklink/data/locale/de-DE.ini': 'abc="123"',
		'desktop-entry/en_GB.ini': 'GenericName="enName"\nComment="enComment"',
		'desktop-entry/de_DE.ini': 'GenericName="deName"\nComment="deComment"\n\n',
		'plugins/missing/data/locale/de-DE.ini': 'Content',
		'plugins/missing/data/locale/fr-FR.ini': 'Content',
		'unexpectedDir/somefile.ini': 'Unexpected'
	};
	const buildArchive = new ZIP();
	for (const file in crowdinBuildFiles) {
		buildArchive.addFile(file, Buffer.from(crowdinBuildFiles[file]));
		const dir = PATH.parse(file).dir;
		if (dir.startsWith('UI') || (dir.startsWith('plugins') && !dir.startsWith('plugins/missing/data/locale'))) {
			await FSE.mkdir(dir, { recursive: true });
		}
	}
	await buildArchive.writeZipPromise('../Build.zip');

	const previousFiles: Record<string, string> = {
		'UI/data/locale/an-ES.ini': 'previous',
		'UI/data/locale/en-US.ini': 'source file',
		'UI/frontend-plugins/frontend-tools/data/locale/an-ES.ini': 'previous',
		'plugins/decklink/data/locale/an-ES.ini': 'previous'
	};
	for (const file in previousFiles) {
		await FSE.writeFile(file, previousFiles[file]);
	}
	await removePreviousTranslations([
		'UI/data/locale',
		'UI/frontend-plugins/frontend-tools/data/locale',
		'plugins/enc-amf/resources/locale',
		'plugins/mac-virtualcam/src/obs-plugin/data/locale',
		'plugins/decklink/data/locale'
	]);
});

it(getLanguages.name, async () => {
	scopeMain.get('').reply(200, {
		data: {
			targetLanguageIds: ['de', 'fr'],
			targetLanguages: [
				{
					locale: 'de-DE',
					id: 'de'
				},
				{
					locale: 'fr-FR',
					id: 'fr'
				}
			]
		}
	});

	expect(await getLanguages()).toEqual({
		languageCodeMap: new Map<string, string>([
			['de-DE', 'de'],
			['fr-FR', 'fr']
		]),
		targetLanguageIds: ['de', 'fr']
	});
});

it(getTranslators.name, async () => {
	scopeMain
		.get('/members')
		.query({
			role: 'blocked',
			limit: MAX_API_PAGE_SIZE
		})
		.reply(200, {
			data: [
				{
					data: {
						id: 5
					}
				}
			]
		})
		.post('/reports', {
			name: 'top-members',
			schema: {
				unit: 'words',
				format: 'json',
				dateFrom: '2014-01-01T00:00:00+00:00',
				dateTo: '2030-01-01T00:00:00+00:00',
				languageId: 'de'
			}
		})
		.reply(200, {
			data: {
				status: 'created',
				identifier: '1234'
			}
		})
		.post('/reports', {
			name: 'top-members',
			schema: {
				unit: 'words',
				format: 'json',
				dateFrom: '2014-01-01T00:00:00+00:00',
				dateTo: '2030-01-01T00:00:00+00:00',
				languageId: 'fr'
			}
		})
		.reply(200, {
			data: {
				status: 'created',
				identifier: '4321'
			}
		})
		.get('/reports/1234/download')
		.reply(200, {
			data: {
				url: `https://downloads.net/reports/1234`
			}
		})
		.get('/reports/4321/download')
		.reply(200, {
			data: {
				url: `https://downloads.net/reports/4321`
			}
		})
		.get('/reports/1234')
		.reply(200, {
			data: {
				status: 'finished'
			}
		})
		.get('/reports/4321')
		.reply(200, {
			data: {
				status: 'finished'
			}
		});
	scopeDownloads
		.get('/reports/1234')
		.reply(200, {
			language: {
				name: 'German'
			},
			data: [
				{
					user: {
						id: 5,
						fullName: 'Blocked User'
					},
					translated: 124,
					approved: 123
				},
				{
					user: {
						id: 1,
						fullName: 'First User'
					},
					translated: 123,
					approved: 12
				},
				{
					user: {
						id: 2,
						fullName: 'Last User'
					},
					translated: 5,
					approved: 0
				}
			]
		})
		.get('/reports/4321')
		.reply(200, {
			language: {
				name: 'French'
			},
			data: [
				{
					user: {
						id: 1,
						fullName: 'REMOVED_USER'
					},
					translated: 5,
					approved: 10
				},
				{
					user: {
						id: 2,
						fullName: 'French Translator'
					},
					translated: 123,
					approved: 12
				}
			]
		});

	expect(await getTranslators(['de', 'fr'])).toBe('Translators:\n French:\n  French Translator\n German:\n  First User\n  Last User\n');
});

it(getSourceFilePaths.name, async () => {
	scopeMain
		.get('/files')
		.query({ limit: MAX_API_PAGE_SIZE })
		.reply(200, {
			data: [
				{
					data: {
						name: 'UI.ini',
						exportOptions: {
							exportPattern: '/%file_name%/data/locale/%locale%.ini'
						}
					}
				},
				{
					data: {
						name: 'aja.ini',
						exportOptions: {
							exportPattern: '/plugins/%file_name%/data/locale/%locale%.ini'
						}
					}
				}
			]
		});

	expect(await getSourceFilePaths()).toEqual(['UI/data/locale', 'plugins/aja/data/locale']);
});

it(buildTranslations.name, async () => {
	scopeMain
		.get('/directories')
		.query({ filter: 'App' })
		.reply(200, {
			data: [
				{
					data: {
						id: 738
					}
				}
			]
		})
		.post('/translations/builds/directories/738')
		.reply(200, {
			data: {
				id: 1,
				status: 'created'
			}
		})
		.get('/translations/builds/1')
		.reply(200, {
			data: {
				status: 'finished'
			}
		});

	expect(await buildTranslations()).toBe(1);
});

it(processBuild.name, async () => {
	scopeMain.get('/translations/builds/1/download').reply(200, {
		data: {
			url: 'https://downloads.net/builds/1'
		}
	});
	scopeDownloads.get('/builds/1').replyWithFile(200, '../Build.zip');

	const noticeMock = jest.spyOn(ACTION, 'notice').mockImplementation(() => {});
	expect(await processBuild(1)).toEqual({
		desktopFileTranslations: new Map<string, Map<string, string>>([
			[
				'de_DE',
				new Map<string, string>([
					['GenericName', 'deName'],
					['Comment', 'deComment']
				])
			],
			[
				'en_GB',
				new Map<string, string>([
					['GenericName', 'enName'],
					['Comment', 'enComment']
				])
			]
		]),
		languageList: new Map<string, string>([
			['de-DE', 'Deutsch'],
			['en-GB', 'English (UK)']
		])
	});
	expect(await convertFileStructureToObject('.')).toEqual({
		name: PATH.basename(PATH.resolve('.')),
		content: [
			{
				name: 'UI',
				content: [
					{
						name: 'data/locale',
						content: [
							{
								name: 'de-DE.ini',
								content: 'Language="Deutsch"\nOK="Okay"\nApply="Übernehmen"\nCancel="Abbre\\nchen"\n'
							},
							{
								name: 'en-GB.ini',
								content: 'Language="English (UK)"\nOK="OK"\n'
							},
							{
								name: 'en-US.ini',
								content: 'source file'
							},
							{
								name: 'fr-FR.ini',
								content: 'abc="123"\n'
							}
						]
					},
					{
						name: 'frontend-plugins/frontend-tools/data/locale/de-DE.ini',
						content: 'abc="123"\n'
					}
				]
			},
			{
				name: 'plugins',
				content: [
					{
						name: 'decklink/data/locale/de-DE.ini',
						content: 'abc="123"\n'
					},
					{
						name: 'enc-amf/resources/locale/de-DE.ini',
						content: 'abc="123"\n'
					},
					{
						name: 'mac-virtualcam/src/obs-plugin/data/locale/de-DE.ini',
						content: 'abc="123"\n'
					}
				]
			}
		]
	});
	expect(noticeMock).toBeCalledWith("plugins/missing/data/locale doesn't exist in the codebase. Remove this file on Crowdin.");
});

it(createLocaleFile.name, async () => {
	scopeMain
		.get('/languages/progress')
		.query({ limit: MAX_API_PAGE_SIZE })
		.reply(200, {
			data: [
				{
					data: {
						translationProgress: 22,
						languageId: 'de'
					}
				},
				{
					data: {
						translationProgress: 50,
						languageId: 'en-GB'
					}
				},
				{
					data: {
						translationProgress: 80,
						languageId: 'fr'
					}
				},
				{
					data: {
						translationProgress: 99,
						languageId: 'da'
					}
				}
			]
		});

	const languageListPath = 'UI/data/locale.ini';
	await FSE.writeFile(languageListPath, '[ab-cd]\nName=LanguageName\n[de-DE]\nName=Deutsch\n[fr-FR]\nName=Français\n\n');
	await createLocaleFile(
		new Map<string, string>([
			['de-DE', 'Deutsch'],
			['fr-FR', 'Français'],
			['en-GB', 'English (UK)'],
			['da-DK', 'Dansk']
		]),
		new Map<string, string>([
			['de-DE', 'de'],
			['fr-FR', 'fr'],
			['en-GB', 'en-GB'],
			['da-DK', 'da']
		])
	);
	expect(await FSE.readFile(languageListPath, 'utf-8')).toBe('[da-DK]\nName=Dansk\n\n[en-US]\nName=English\n\n[fr-FR]\nName=Français\n');
});

it(createDesktopFile.name, async () => {
	const filePath = 'UI/xdg-data/com.obsproject.Studio.desktop';
	await FSE.mkdir(PATH.parse(filePath).dir);
	await FSE.writeFile(filePath, '[Desktop Entry]\nVersion=1.0\nName=OBS Studio\n\nGenericName[an_ES]=abc\nComment[an_ES]=abc\n');
	await createDesktopFile(
		new Map<string, Map<string, string>>([
			[
				'de_DE',
				new Map<string, string>([
					['GenericName', 'deName'],
					['Comment', 'deComment']
				])
			],
			[
				'en_GB',
				new Map<string, string>([
					['GenericName', 'enName'],
					['Comment', 'enComment']
				])
			]
		])
	);
	expect(await FSE.readFile(filePath, 'utf-8')).toBe(
		'[Desktop Entry]\nVersion=1.0\nName=OBS Studio\n\nGenericName[de_DE]=deName\nComment[de_DE]=deComment\nGenericName[en_GB]=enName\nComment[en_GB]=enComment\n'
	);
});

afterAll(() => {
	scopeDownloads.done();
	scopeMain.done();
});
