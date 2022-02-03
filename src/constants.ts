export const PROJECT_ID = Number(process.env.CROWDIN_PROJECT_ID) || 51028;
export const CROWDIN_PAT = process.env.CROWDIN_PAT;
export const JEST_RUN = process.env.JEST_WORKER_ID !== undefined;

export const SOURCE_EQUALITY_CHECK_DIRS = ['UI', 'plugins'];
export const GIT_ALLOW_LIST: Record<string, string | string[]> = {
	all: [
		'AUTHORS',
		'plugins/*/data/locale/*-*.ini',
		'plugins/mac-virtualcam/src/obs-plugin/data/locale/*-*.ini',
		'UI/data/locale.ini',
		'UI/data/locale/*-*.ini',
		'UI/xdg-data/com.obsproject.Studio.desktop',
		'UI/frontend-plugins/*/data/locale/*-*.ini'
	],
	'enc-amf': 'resources/locale/*-*.ini',
	'obs-browser': 'data/locale/*-*.ini',
	'obs-vst': 'data/locale/*-*.ini'
};
