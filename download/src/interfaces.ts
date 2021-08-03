export interface BuildProcessingResult {
		desktopFileTranslations: Map<string, Map<string, string>>,
		languageList: Map<string, string>
	}
export interface LanguagesGatheringResult {
		targetLanguageIds: string[],
		languageCodeMap: Map<string, string>
	}
