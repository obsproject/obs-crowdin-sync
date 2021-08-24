export const projectId = 51028;

export const submodules = ['enc-amf', 'obs-browser', 'obs-vst'];
export const sourceEqualityCheck = ['UI', 'plugins'];
export const gitAddAllowList:{[key:string]: string | string[]} = {
	all: ['AUTHORS', 'UI/data/locale/*-*.ini', 'plugins/*/data/locale/*-*.ini', 'plugins/mac-virtualcam/src/obs-plugin/data/locale/*-*.ini', 'UI/data/locale.ini', 'UI/xdg-data/com.obsproject.Studio.desktop'],
	'enc-amf': 'plugins/enc-amf/resources/locale/*-*.ini',
	'obs-browser': 'plugins/obs-browser/data/locale/*-*.ini',
	'obs-vst': 'plugins/obs-vst/data/locale/*-*.ini'
};

export const promisesLimit = 10;
