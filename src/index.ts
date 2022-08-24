import * as ACTION from '@actions/core';
import { execute as executeDownload } from './download';
import { execute as executeUpload } from './upload';

export const PROJECT_ID = Number(ACTION.getInput('PROJECT_ID')) || 51028;
export const JEST_RUN = process.env.JEST_WORKER_ID !== undefined;

export const STRINGS = {
	git: {
		committer: {
			name: 'Translation Updater',
			email: '<>'
		},
		commitTitle: 'Update translations from Crowdin'
	},
	authors: {
		header: 'Original Author: Hugh Bailey ("Jim")\n\nContributors are sorted by their amount of commits / translated words.\n\n',
		contributors: 'Contributors',
		translators: 'Translators',
		fileName: 'AUTHORS'
	},
	englishLanguage: {
		locale: 'en-US',
		name: 'English'
	}
};

(async () => {
	try {
		if (!process.env.CROWDIN_PAT && !JEST_RUN) {
			throw 'Environment variable CROWDIN_PAT not provided. Skipping action.';
		}

		const syncMode = ACTION.getInput('MODE');
		if (syncMode === 'DOWNLOAD') {
			await executeDownload();
		} else if (syncMode === 'UPLOAD') {
			await executeUpload();
		} else {
			if (!JEST_RUN) {
				throw 'Input MODE is neither DOWNLOAD nor UPLOAD.';
			}
		}
	} catch (e) {
		ACTION.setFailed(e as Error);
	}
})();
