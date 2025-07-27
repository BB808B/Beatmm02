import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next/initReactI18next';
import { headers } from 'next/headers';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

export const i18nConfig = {
  locales: ['en', 'zh', 'my'],
  defaultLocale: 'en',
};

export async function initTranslations(locale: string, namespaces: string[] = ['common']) {
  const i18nInstance = createInstance();

  await i18nInstance
    .use(initReactI18next)
    .init({
      lng: locale,
      namespaces,
      fallbackLng: i18nConfig.defaultLocale,
      supportedLngs: i18nConfig.locales,
      resources: {
        en: {
          common: require('../public/locales/en.json'),
        },
        zh: {
          common: require('../public/locales/zh.json'),
        },
        my: {
          common: require('../public/locales/my.json'),
        },
      },
    });

  return i18nInstance;
}

export function getLocale() {
  const negotiatorHeaders: Record<string, string> = {};
  headers().forEach((value, key) => (negotiatorHeaders[key] = value));

  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();
  const locale = match(languages, i18nConfig.locales, i18nConfig.defaultLocale);

  return locale;
}
