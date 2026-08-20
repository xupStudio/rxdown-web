import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const root = new URL('..', import.meta.url).pathname;
const distRoot = join(root, 'dist');
const locales = ['en', 'zh', 'ja', 'ko', 'de', 'es', 'fr', 'id', 'pt'];
const heroShots = ['today', 'voice'];
const storeShots = ['01_today', '02_log', '03_voice', '04_journey', '05_ai', '06_report', '07_insights', '08_export'];
const phoneFrameShots = ['today', 'journey', 'insights', 'export'];
const shotVersion = '20260820-3';
const storeShotVersion = '20260820-1';

function homeFile(locale) {
  return locale === 'en'
    ? join(distRoot, 'index.html')
    : join(distRoot, locale, 'index.html');
}

function hasWebpAlpha(source) {
  return source.subarray(12, 16).toString() === 'VP8X' && (source[20] & 0x10) !== 0;
}

test('each localized homepage ships and renders its matching app screenshots', () => {
  for (const locale of locales) {
    const html = readFileSync(homeFile(locale), 'utf8');
    for (const shot of heroShots) {
      const source = `/shots/${locale}/${shot}.webp`;
      const renderedSource = `${source}?v=${shotVersion}`;
      assert.ok(
        existsSync(join(root, 'public', 'shots', locale, `${shot}.webp`)),
        `${locale}/${shot} source asset must exist`
      );
      assert.ok(
        existsSync(join(distRoot, 'shots', locale, `${shot}.webp`)),
        `${locale}/${shot} built asset must exist`
      );
      assert.ok(html.includes(`src="${renderedSource}"`), `${locale} homepage must render ${renderedSource}`);
    }
  }
});

test('the homepage gallery renders the complete localized iOS store sequence', () => {
  for (const locale of locales) {
    const html = readFileSync(homeFile(locale), 'utf8');
    const gallery = html.match(/<div class="gallery"[^>]*>([\s\S]*?)<\/div>/)?.[1];
    assert.ok(gallery, `${locale} homepage must render the app gallery`);
    const expectedSources = storeShots.map(
      (shot) => `/store-shots/${locale}/${shot}.webp?v=${storeShotVersion}`
    );
    const renderedSources = [...gallery.matchAll(/<img[^>]*src="([^"]+)"[^>]*>/g)].map((match) => match[1]);
    assert.deepEqual(renderedSources, expectedSources, `${locale} gallery must keep the iOS store story order`);
    const imageTags = gallery.match(/<img[^>]*>/g) ?? [];

    for (const shot of storeShots) {
      assert.ok(
        existsSync(join(root, 'public', 'store-shots', locale, `${shot}.webp`)),
        `${locale}/${shot} source store asset must exist`
      );
      assert.ok(
        existsSync(join(distRoot, 'store-shots', locale, `${shot}.webp`)),
        `${locale}/${shot} built store asset must exist`
      );
      const source = `/store-shots/${locale}/${shot}.webp?v=${storeShotVersion}`;
      const image = imageTags.find((tag) => tag.includes(`src="${source}"`));
      assert.ok(image, `${locale}/${shot} store image must render`);
      assert.doesNotMatch(
        image,
        /\sloading="lazy"/,
        `${locale}/${shot} must not wait for horizontal scrolling before it loads`
      );
    }
  }
});

test('localized app screenshots have opaque safe areas instead of transparent phone-frame gaps', () => {
  for (const locale of locales) {
    for (const shot of phoneFrameShots) {
      const source = readFileSync(join(root, 'public', 'shots', locale, `${shot}.webp`));
      assert.equal(
        hasWebpAlpha(source),
        false,
        `${locale}/${shot} must not expose the page background through its phone frame`
      );
    }
  }
});
