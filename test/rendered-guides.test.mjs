import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const root = new URL('..', import.meta.url).pathname;
const contentRoot = join(root, 'src/content/guides');
const distRoot = join(root, 'dist');
const locales = ['en', 'zh', 'ja', 'ko', 'de', 'es', 'fr', 'id', 'pt'];
const appStore = 'https://apps.apple.com/app/id6757333483';
const playStore = 'https://play.google.com/store/apps/details?id=com.xupstudio.rxtaper';

function slugs(locale) {
  const dir = locale === 'en' ? contentRoot : join(contentRoot, locale);
  return readdirSync(dir)
    .filter((name) => name.endsWith('.md'))
    .map((name) => name.slice(0, -3));
}

function routePath(locale, slug = '') {
  const prefix = locale === 'en' ? '' : `/${locale}`;
  return `${prefix}/guides/${slug ? `${slug}/` : ''}`;
}

function outputFile(route) {
  return join(distRoot, route.replace(/^\//, ''), 'index.html');
}

test('every localized directory renders all categories, cards, and accessible search controls', () => {
  for (const locale of locales) {
    const file = outputFile(routePath(locale));
    assert.ok(existsSync(file), `${locale} guide directory must exist`);
    const html = readFileSync(file, 'utf8');
    assert.match(html, /data-guide-directory/);
    assert.equal((html.match(/<a[^>]+data-guide-hub-link(?:\s|>)/g) ?? []).length, 9, `${locale} category links`);
    assert.equal((html.match(/data-guide-card(?:\s|>)/g) ?? []).length, 121, `${locale} guide cards`);
    assert.match(html, /<input[^>]+type="search"/);
  }
});

test('every guide renders one heading, a category, and the app promotion as its final section', () => {
  let count = 0;
  for (const locale of locales) {
    for (const slug of slugs(locale)) {
      count += 1;
      const file = outputFile(routePath(locale, slug));
      assert.ok(existsSync(file), `${locale}/${slug} must render`);
      const html = readFileSync(file, 'utf8');
      assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1, `${locale}/${slug} h1`);
      assert.match(html, /data-guide-category/, `${locale}/${slug} category`);
      assert.match(html, /data-guide-app-promo/, `${locale}/${slug} app promo`);
      assert.match(html, /\/shots\/report\.webp/, `${locale}/${slug} app image`);
      assert.ok(html.includes(appStore), `${locale}/${slug} App Store link`);
      assert.ok(html.includes(playStore), `${locale}/${slug} Play Store link`);
      assert.ok(
        html.includes(`<link rel="canonical" href="https://rxdown.app${routePath(locale, slug)}">`),
        `${locale}/${slug} canonical URL`
      );
      assert.equal(
        (html.match(/<link rel="alternate" hreflang=/g) ?? []).length,
        10,
        `${locale}/${slug} language alternates`
      );
      assert.ok(
        html.lastIndexOf('data-guide-app-promo') > html.lastIndexOf('data-guide-related'),
        `${locale}/${slug} app promo must follow related reading`
      );
    }
  }
  assert.equal(count, 1089);
});

test('guide pages do not emit broken root-relative links or image sources', () => {
  for (const locale of locales) {
    for (const slug of ['', ...slugs(locale)]) {
      const file = outputFile(routePath(locale, slug));
      const html = readFileSync(file, 'utf8');
      for (const match of html.matchAll(/(?:href|src)="(\/[^"?#]*)(?:[?#][^"]*)?"/g)) {
        const path = decodeURI(match[1]);
        const target = path.endsWith('/')
          ? join(distRoot, path.replace(/^\//, ''), 'index.html')
          : join(distRoot, path.replace(/^\//, ''));
        assert.ok(existsSync(target), `${routePath(locale, slug)} → ${path}`);
      }
    }
  }
});

test('the English AI-readable guide index contains only the 121 canonical English routes', () => {
  const source = readFileSync(join(distRoot, 'llms-full.txt'), 'utf8');
  const guideLines = source
    .split('\n')
    .filter((line) => /^- \[.+\]\(https:\/\/rxdown\.app\/guides\/.+\/\)/.test(line));
  assert.equal(guideLines.length, 121);
  assert.ok(!/https:\/\/rxdown\.app\/guides\/(?:zh|ja|ko|de|es|fr|id|pt)\//.test(source));
});
