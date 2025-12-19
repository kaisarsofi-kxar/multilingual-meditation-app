import { useLanguageStore } from '@/store/languageStore';
import { getTranslation } from '@/utils/translations';

export const useTranslation = () => {
  const language = useLanguageStore((state) => state.language);

  const t = (key: string, params?: Record<string, string>): string => {
    return getTranslation(key, language, params);
  };

  return { t, language };
};

