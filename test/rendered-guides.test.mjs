import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const root = new URL('..', import.meta.url).pathname;
const contentRoot = join(root, 'src/content/guides');
const distRoot = join(root, 'dist');
const locales = ['en', 'zh', 'ja', 'ko', 'de', 'es', 'fr', 'id', 'pt'];
const hreflang = { en: 'en', zh: 'zh-Hant', ja: 'ja', ko: 'ko', de: 'de', es: 'es', fr: 'fr', id: 'id', pt: 'pt-PT' };
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
      assert.match(html, /data-guide-safety-note/, `${locale}/${slug} safety reminder`);
      assert.ok(
        html.indexOf('data-guide-safety-note') < html.indexOf('class="guide-body"'),
        `${locale}/${slug} safety reminder must appear before article content`
      );
      assert.match(html, /data-guide-app-promo/, `${locale}/${slug} app promo`);
      assert.match(html, new RegExp(`/shots/${locale}/report\\.webp`), `${locale}/${slug} app image`);
      const promoImage = html.match(/<section class="guide-app-promo"[\s\S]*?<img(?=[^>]*\/shots\/[^"]+\/report\.webp)[^>]*>/)?.[0];
      assert.ok(promoImage, `${locale}/${slug} app promo image must render`);
      assert.doesNotMatch(
        promoImage,
        /\sloading="lazy"/,
        `${locale}/${slug} app promo must not flash a blank phone card before it enters view`
      );
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

test('a shared guide keeps its full language cluster and related reading', () => {
  const slug = 'i-stopped-my-medication-and-feel-unwell-what-information-should-i-gather-now';
  for (const locale of locales) {
    const html = readFileSync(outputFile(routePath(locale, slug)), 'utf8');
    for (const alternate of locales) {
      assert.ok(
        html.includes(
          `<link rel="alternate" hreflang="${hreflang[alternate]}" href="https://rxdown.app${routePath(alternate, slug)}">`
        ),
        `${locale}/${slug} ${alternate} alternate`
      );
    }
    assert.match(html, /data-guide-related/, `${locale}/${slug} related reading`);
  }
});

test('rendered guide pages exclude internal editorial notices', () => {
  const internalMarkers = [
    /Editorial status:/i,
    /Replacement draft for the existing RxDown URL/i,
    /EDITORIAL IMPLEMENTATION NOTES/i,
    /Suggested internal links:/i,
    /Suggested URL:|Preserve canonical URL:|Search record:/i,
    /Use in this draft:/i,
    /This draft prioritizes/i,
    /How it is used in this draft/i,
    /before publication/i,
    /Redaktioneller Status/i,
    /Ersatzentwurf/i,
    /Dieser Entwurf priorisiert/i,
    /Verwendung in diesem Entwurf/i,
    /vor der Veröffentlichung/i,
    /Estado editorial/i,
    /Borrador (?:de )?sustituci[oó]n/i,
    /Este borrador prioriza/i,
    /Uso en este borrador/i,
    /antes de publicar/i,
    /Statut éditorial/i,
    /(?:Projet|Version) de remplacement/i,
    /Ce projet(?: d’article)? privilégie/i,
    /Utilisation dans ce projet/i,
    /avant publication/i,
    /Draf pengganti/i,
    /Draf ini memprioritaskan/i,
    /Cara digunakan dalam draf ini/i,
    /sebelum publikasi/i,
    /編集状況|編集ステータス|編集状態|差し替え原稿|置き換える草稿/,
    /この草稿では|本草稿での使用方法|公開前/,
    /편집 상태|기존 RxDown URL.*대체/,
    /이 초안은|이 초안에서의 활용 방식|게시 전/,
    /Rascunho de substituição/i,
    /Este rascunho dá prioridade/i,
    /Utilização neste rascunho/i,
    /antes da publicação|antes de publicar/i,
    /編輯狀態|(?:用於)?取代.*草稿|替換稿|請勿發布|本草稿優先|本草稿如何使用|發布前/,
  ];

  for (const locale of locales) {
    for (const slug of slugs(locale)) {
      const html = readFileSync(outputFile(routePath(locale, slug)), 'utf8');
      for (const marker of internalMarkers) {
        assert.doesNotMatch(html, marker, `${locale}/${slug} must not expose ${marker}`);
      }
    }
  }
});

test('every guide URL appears in the generated sitemap', () => {
  const sitemap = readdirSync(distRoot)
    .filter((name) => /^sitemap.*\.xml$/.test(name))
    .map((name) => readFileSync(join(distRoot, name), 'utf8'))
    .join('\n');

  for (const locale of locales) {
    for (const slug of slugs(locale)) {
      assert.ok(
        sitemap.includes(`https://rxdown.app${routePath(locale, slug)}`),
        `${locale}/${slug} must appear in the sitemap`
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

test('homepages offer only the current cache-busted raster favicon choices', () => {
  for (const locale of locales) {
    const file = locale === 'en' ? join(distRoot, 'index.html') : join(distRoot, locale, 'index.html');
    const html = readFileSync(file, 'utf8');
    const iconLinks = html.match(/<link rel="icon"[^>]*>/g) ?? [];

    assert.equal(iconLinks.length, 2, `${locale} must expose ICO and PNG favicon fallbacks`);
    assert.ok(
      iconLinks.some((link) => /href="\/favicon\.ico\?v=20260820-2"/.test(link)),
      `${locale} must cache-bust the current ICO favicon`
    );
    assert.ok(
      iconLinks.some((link) => /href="\/favicon\.png\?v=20260820-2"/.test(link)),
      `${locale} must cache-bust the current PNG favicon`
    );
    assert.doesNotMatch(html, /<link rel="icon"[^>]+icon\.svg/, `${locale} must not advertise the legacy SVG favicon`);
  }
});

test('the English AI-readable guide index contains every English guide route', () => {
  const source = readFileSync(join(distRoot, 'llms-full.txt'), 'utf8');
  const guideLines = source
    .split('\n')
    .filter((line) => /^- \[.+\]\(https:\/\/rxdown\.app\/guides\/.+\/\)/.test(line));
  assert.equal(guideLines.length, 121);
  assert.ok(!/https:\/\/rxdown\.app\/guides\/(?:zh|ja|ko|de|es|fr|id|pt)\//.test(source));
  assert.ok(source.includes('I Stopped My Medication and Feel Unwell'));
});
