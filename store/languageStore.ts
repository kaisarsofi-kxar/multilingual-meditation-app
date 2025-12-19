import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";

export type Language =
  | "en"
  | "pt"
  | "es"
  | "de"
  | "ru"
  | "fr"
  | "it"
  | "ja"
  | "zh"
  | "ar";

interface LanguageState {
  language: Language;
  hasSelectedLanguage: boolean;
  setLanguage: (lang: Language) => Promise<void>;
  initializeLanguage: () => Promise<void>;
}

const STORAGE_KEY = "@app_language";
const STORAGE_SELECTED_KEY = "@app_has_selected_language";

const getDeviceLanguage = (): Language => {
  const locales = getLocales();
  const locale = locales[0]?.languageCode?.toLowerCase() || "en";
  if (locale.startsWith("pt")) return "pt";
  if (locale.startsWith("es")) return "es";
  if (locale.startsWith("de")) return "de";
  if (locale.startsWith("ru")) return "ru";
  if (locale.startsWith("fr")) return "fr";
  if (locale.startsWith("it")) return "it";
  if (locale.startsWith("ja")) return "ja";
  if (locale.startsWith("zh")) return "zh";
  if (locale.startsWith("ar")) return "ar";
  return "en";
};

export const useLanguageStore = create<LanguageState>((set) => ({
  language: "en",
  hasSelectedLanguage: false,

  setLanguage: async (lang: Language) => {
    await AsyncStorage.setItem(STORAGE_KEY, lang);
    await AsyncStorage.setItem(STORAGE_SELECTED_KEY, "true");
    set({ language: lang, hasSelectedLanguage: true });
  },

  initializeLanguage: async () => {
    try {
      const hasSelected = await AsyncStorage.getItem(STORAGE_SELECTED_KEY);
      if (hasSelected === "true") {
        const savedLang = await AsyncStorage.getItem(STORAGE_KEY);
        if (
          savedLang &&
          ["en", "pt", "es", "de", "ru", "fr", "it", "ja", "zh", "ar"].includes(
            savedLang
          )
        ) {
          set({ language: savedLang as Language, hasSelectedLanguage: true });
          return;
        }
      }
      const deviceLang = getDeviceLanguage();
      set({ language: deviceLang, hasSelectedLanguage: false });
    } catch {
      const deviceLang = getDeviceLanguage();
      set({ language: deviceLang, hasSelectedLanguage: false });
    }
  },
}));
