import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import remarkCjkFriendly from 'remark-cjk-friendly';
import rehypeWrapTables from './scripts/rehype-wrap-tables.mjs';

export default defineConfig({
  site: 'https://rxdown.app',
  trailingSlash: 'always',
  // CommonMark's emphasis flanking rules mis-handle **bold** next to CJK
  // characters/fullwidth punctuation (e.g. **反彈（rebound）**是 renders the
  // asterisks literally). This plugin applies the CommonMark-CJK draft rules.
  markdown: {
    remarkPlugins: [remarkCjkFriendly],
    rehypePlugins: [rehypeWrapTables],
  },
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
