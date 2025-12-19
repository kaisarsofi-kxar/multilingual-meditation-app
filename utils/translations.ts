import { Language } from '@/store/languageStore';
import en from '@/translations/en';
import pt from '@/translations/pt';
import es from '@/translations/es';
import de from '@/translations/de';
import ru from '@/translations/ru';
import fr from '@/translations/fr';
import it from '@/translations/it';
import ja from '@/translations/ja';
import zh from '@/translations/zh';
import ar from '@/translations/ar';

const translations = {
  en,
  pt,
  es,
  de,
  ru,
  fr,
  it,
  ja,
  zh,
  ar,
};

export const getTranslation = (key: string, language: Language, params?: Record<string, string>): string => {
  const keys = key.split('.');
  let value: any = translations[language];
  
  for (const k of keys) {
    value = value?.[k];
  }
  
  if (typeof value !== 'string') {
    return key;
  }
  
  if (params) {
    return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
      return params[paramKey] || match;
    });
  }
  
  return value;
};

export const t = (key: string, params?: Record<string, string>): string => {
  const { useLanguageStore } = require('@/store/languageStore');
  const language = useLanguageStore.getState().language;
  return getTranslation(key, language, params);
};

