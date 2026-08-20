import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import test from 'node:test';

import { stageGuideLibrary } from '../scripts/import-guide-library.mjs';

const localeMap = {
  'zh-Hant': 'zh',
  ja: 'ja',
  ko: 'ko',
  de: 'de',
  es: 'es',
  fr: 'fr',
  id: 'id',
  'pt-PT': 'pt',
};

const liveSlugs = [
  'benzodiazepine-tapering-ashton',
  'hold-and-reinstate-guide',
  'sleep-during-withdrawal',
];

function put(path, contents) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, contents);
}

function article(slug, extra = '') {
  return `---\ntitle: ${slug}\nslug: ${slug}\ncontent_hub: Benzodiazepines\nsource_locale: en\n${extra}---\n# ${slug}\n`;
}

function fixtureSource() {
  const root = mkdtempSync(join(tmpdir(), 'rxdown-import-source-'));
  put(join(root, 'EXISTING_SITE_UPDATE_MAP.csv'), 'fixture');
  put(join(root, 'en/assets/figure.svg'), '<svg><title>English</title></svg>');
  put(join(root, 'en/articles/p1/new-guide.md'), article('new-guide'));
  for (const slug of liveSlugs) {
    put(join(root, `en/articles/live-revisions/${slug}.md`), article(slug, 'article_action: live-update\n'));
  }
  for (const [sourceLocale] of Object.entries(localeMap)) {
    put(join(root, `locales/${sourceLocale}/assets/figure.svg`), `<svg><title>${sourceLocale}</title></svg>`);
    put(join(root, `locales/${sourceLocale}/assets/guides/figure.svg`), `<svg><title>${sourceLocale}</title></svg>`);
    for (const slug of ['new-guide', ...liveSlugs]) {
      const action = liveSlugs.includes(slug) ? 'article_action: live-update\n' : '';
      const folder = liveSlugs.includes(slug) ? 'live-revisions' : 'p1';
      const source = article(slug, action)
        .replace('source_locale: en\n', `source_locale: en\nlocale: ${sourceLocale}\n`);
      put(join(root, `locales/${sourceLocale}/articles/${folder}/${slug}.md`), source);
    }
  }
  return root;
}

test('the importer stages byte-identical articles and locale-specific assets without writing into the site', () => {
  const source = fixtureSource();
  const output = join(tmpdir(), `rxdown-import-output-${crypto.randomUUID()}`);
  const summary = stageGuideLibrary({ source, output, expectedArticleCount: 4 });

  assert.deepEqual(summary, {
    englishArticles: 4,
    localizedArticles: 32,
    englishAssets: 1,
    localizedAssets: 8,
  });
  assert.equal(
    readFileSync(join(output, 'content/new-guide.md'), 'utf8'),
    readFileSync(join(source, 'en/articles/p1/new-guide.md'), 'utf8')
  );
  assert.equal(
    readFileSync(join(output, 'content/zh/new-guide.md'), 'utf8'),
    readFileSync(join(source, 'locales/zh-Hant/articles/p1/new-guide.md'), 'utf8')
  );
  assert.match(readFileSync(join(output, 'public/zh/assets/figure.svg'), 'utf8'), /zh-Hant/);
  assert.match(readFileSync(join(output, 'public/zh/assets/guides/figure.svg'), 'utf8'), /zh-Hant/);
  assert.match(readFileSync(join(output, 'public/assets/figure.svg'), 'utf8'), /English/);
  assert.match(readFileSync(join(output, 'public/assets/guides/figure.svg'), 'utf8'), /English/);
});

test('the importer refuses any existing output path instead of overwriting it', () => {
  const source = fixtureSource();
  const output = mkdtempSync(join(tmpdir(), 'rxdown-import-existing-'));
  assert.throws(
    () => stageGuideLibrary({ source, output, expectedArticleCount: 4 }),
    /output path already exists/i
  );
});
