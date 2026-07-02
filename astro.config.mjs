import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://rxdown.app',
  trailingSlash: 'always',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh', 'ja', 'ko', 'de', 'es', 'fr', 'id', 'pt'],
    routing: {
      prefixDefaultLocale: false,
      redirectToDefaultLocale: false,
    },
  },
  integrations: [
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en',
          zh: 'zh-Hant',
          ja: 'ja',
          ko: 'ko',
          de: 'de',
          es: 'es',
          fr: 'fr',
          id: 'id',
          pt: 'pt-PT',
        },
      },
    }),
  ],
});
