export const projectId = Number(process.env.CROWDIN_PROJECT_ID) || 51028;
export const CROWDIN_PAT = process.env.CROWDIN_PAT;
export const CROWDIN_ORG = process.env.CROWDIN_ORG;
export const JEST_RUN = process.env.JEST_WORKER_ID !== undefined;

export const submodules = ['enc-amf', 'obs-browser', 'obs-vst'];
export const sourceEqualityCheck = ['UI', 'plugins'];
export const gitAddAllowList: Record<string, string | string[]> = {
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
