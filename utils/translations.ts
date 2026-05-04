import type { Language } from "@/store/languageStore";
import { useLanguageStore } from "@/store/languageStore";
import ar from "@/translations/ar";
import de from "@/translations/de";
import en from "@/translations/en";
import es from "@/translations/es";
import fr from "@/translations/fr";
import it from "@/translations/it";
import ja from "@/translations/ja";
import pt from "@/translations/pt";
import ru from "@/translations/ru";
import zh from "@/translations/zh";

type NestedTranslations = { readonly [key: string]: string | NestedTranslations };

const translations: Record<Language, NestedTranslations> = {
  en: en as NestedTranslations,
  pt: pt as NestedTranslations,
  es: es as NestedTranslations,
  de: de as NestedTranslations,
  ru: ru as NestedTranslations,
  fr: fr as NestedTranslations,
  it: it as NestedTranslations,
  ja: ja as NestedTranslations,
  zh: zh as NestedTranslations,
  ar: ar as NestedTranslations,
};

function getStringAtPath(
  root: NestedTranslations,
  path: string[]
): string | undefined {
  let current: string | NestedTranslations | undefined = root;
  for (const segment of path) {
    if (current === undefined || typeof current === "string") {
      return undefined;
    }
    current = current[segment];
  }
  return typeof current === "string" ? current : undefined;
}

export const getTranslation = (
  key: string,
  language: Language,
  params?: Record<string, string>
): string => {
  const path = key.split(".");
  const fromLang = getStringAtPath(translations[language], path);
  const fromEn = getStringAtPath(translations.en, path);
  const value = fromLang ?? (language !== "en" ? fromEn : undefined);

  if (typeof value !== "string") {
    return key;
  }

  if (params) {
    return value.replace(/\{(\w+)\}/g, (match, paramKey: string) => {
      return params[paramKey] ?? match;
    });
  }

  return value;
};

export const t = (key: string, params?: Record<string, string>): string => {
  const language = useLanguageStore.getState().language;
  return getTranslation(key, language, params);
};
