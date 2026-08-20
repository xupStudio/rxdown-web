import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';
import { isPublishedGuideData } from '../src/lib/guide-publication.js';

const root = new URL('..', import.meta.url).pathname;
const contentRoot = join(root, 'src/content/guides');
const distRoot = join(root, 'dist');
const locales = ['en', 'zh', 'ja', 'ko', 'de', 'es', 'fr', 'id', 'pt'];
const appStore = 'https://apps.apple.com/app/id6757333483';
const playStore = 'https://play.google.com/store/apps/details?id=com.xupstudio.rxtaper';

function frontmatterValue(source, key) {
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1] ?? '';
  const value = frontmatter.match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, 'm'))?.[1];
  return value?.replace(/^['"]|['"]$/g, '');
}

function guideFiles(locale) {
  const dir = locale === 'en' ? contentRoot : join(contentRoot, locale);
  return readdirSync(dir)
    .filter((name) => name.endsWith('.md'))
    .map((name) => {
      const source = readFileSync(join(dir, name), 'utf8');
      return {
        slug: name.slice(0, -3),
        published: isPublishedGuideData({
          review_status: frontmatterValue(source, 'review_status'),
          publication_status: frontmatterValue(source, 'publication_status'),
        }),
      };
    });
}

function slugs(locale) {
  return guideFiles(locale)
    .filter((guide) => guide.published)
    .map((guide) => guide.slug);
}

function draftSlugs(locale) {
  return guideFiles(locale)
    .filter((guide) => !guide.published)
    .map((guide) => guide.slug);
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
    assert.equal((html.match(/data-guide-card(?:\s|>)/g) ?? []).length, 12, `${locale} guide cards`);
    assert.match(html, /<input[^>]+type="search"/);
    const hero = html.match(/<header class="guide-library-hero">([\s\S]*?)<\/header>/)?.[1] ?? '';
    assert.match(hero, /class="guide-search"/, `${locale} search belongs in the top hero area`);
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
      assert.match(html, new RegExp(`/shots/${locale}/report\\.webp`), `${locale}/${slug} app image`);
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
  assert.equal(count, 108);
});

test('clinical-review drafts do not render public guide routes', () => {
  for (const locale of locales) {
    for (const slug of draftSlugs(locale)) {
      assert.ok(
        !existsSync(outputFile(routePath(locale, slug))),
        `${locale}/${slug} must stay unpublished until clinical review is complete`
      );
    }
  }
});

test('clinical-review drafts never reach generated crawl surfaces', () => {
  const crawlableOutput = [
    readFileSync(join(distRoot, 'llms-full.txt'), 'utf8'),
    ...readdirSync(distRoot)
      .filter((name) => /^sitemap.*\.xml$/.test(name))
      .map((name) => readFileSync(join(distRoot, name), 'utf8')),
  ].join('\n');

  for (const locale of locales) {
    for (const slug of draftSlugs(locale)) {
      assert.ok(
        !crawlableOutput.includes(`https://rxdown.app${routePath(locale, slug)}`),
        `${locale}/${slug} must stay out of crawlable output until clinical review is complete`
      );
    }
  }
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

test('the English AI-readable guide index contains only the 12 published English routes', () => {
  const source = readFileSync(join(distRoot, 'llms-full.txt'), 'utf8');
  const guideLines = source
    .split('\n')
    .filter((line) => /^- \[.+\]\(https:\/\/rxdown\.app\/guides\/.+\/\)/.test(line));
  assert.equal(guideLines.length, 12);
  assert.ok(!/https:\/\/rxdown\.app\/guides\/(?:zh|ja|ko|de|es|fr|id|pt)\//.test(source));
  assert.ok(!source.includes('I Stopped My Medication and Feel Unwell'));
});
