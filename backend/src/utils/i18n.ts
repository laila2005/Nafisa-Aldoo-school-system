import en from '../locales/en.json';
import ar from '../locales/ar.json';

type Language = 'en' | 'ar';

const translations = {
  en,
  ar,
};

/**
 * Get translated message
 */
export const t = (key: string, language: Language = 'en'): string => {
  const keys = key.split('.');
  let value: any = translations[language];

  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return key; // Return key if translation not found
    }
  }

  return typeof value === 'string' ? value : key;
};

/**
 * Get user's preferred language from request
 */
export const getUserLanguage = (req: any): Language => {
  // Check query parameter first
  if (req.query?.lang && ['en', 'ar'].includes(req.query.lang)) {
    return req.query.lang as Language;
  }

  // Check header
  const acceptLanguage = req.headers['accept-language'];
  if (acceptLanguage?.includes('ar')) {
    return 'ar';
  }

  // Default to English
  return 'en';
};
