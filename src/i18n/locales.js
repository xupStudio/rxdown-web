// Locale registry — single source of truth for routing, hreflang, and the switcher.
export const LOCALES = {
  en: { hreflang: 'en', ogLocale: 'en_US', name: 'English' },
  zh: { hreflang: 'zh-Hant', ogLocale: 'zh_TW', name: '繁體中文' },
  ja: { hreflang: 'ja', ogLocale: 'ja_JP', name: '日本語' },
  ko: { hreflang: 'ko', ogLocale: 'ko_KR', name: '한국어' },
  de: { hreflang: 'de', ogLocale: 'de_DE', name: 'Deutsch' },
  es: { hreflang: 'es', ogLocale: 'es_ES', name: 'Español' },
  fr: { hreflang: 'fr', ogLocale: 'fr_FR', name: 'Français' },
  id: { hreflang: 'id', ogLocale: 'id_ID', name: 'Bahasa Indonesia' },
  pt: { hreflang: 'pt-PT', ogLocale: 'pt_PT', name: 'Português' },
};

export const LOCALE_CODES = Object.keys(LOCALES);
export const NON_DEFAULT_LOCALES = LOCALE_CODES.filter((l) => l !== 'en');

import en from './en.json';
import zh from './zh.json';
import ja from './ja.json';
import ko from './ko.json';
import de from './de.json';
import es from './es.json';
import fr from './fr.json';
import id from './id.json';
import pt from './pt.json';

export const STRINGS = { en, zh, ja, ko, de, es, fr, id, pt };

/** Path helpers: en lives at /, others at /<locale>/ */
export function localePath(locale, path = '/') {
  const clean = path.startsWith('/') ? path : `/${path}`;
  return locale === 'en' ? clean : `/${locale}${clean}`;
}

export const APP_STORE_URL = 'https://apps.apple.com/app/id6757333483';
export const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.xupstudio.rxtaper';
export const SUPPORT_EMAIL = 'xup654m42@gmail.com';
