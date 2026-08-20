import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const root = new URL('..', import.meta.url).pathname;
const distRoot = join(root, 'dist');
const locales = ['en', 'zh', 'ja', 'ko', 'de', 'es', 'fr', 'id', 'pt'];
const shots = ['today', 'voice', 'journey', 'insights', 'ai', 'report', 'log', 'export'];
const galleryShots = ['journey', 'insights', 'ai', 'report', 'log', 'export'];
const phoneFrameShots = ['today', 'journey', 'insights', 'export'];
const shotVersion = '20260820-3';

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
    for (const shot of shots) {
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

test('visible homepage gallery screenshots are ready without horizontal-scroll lazy loading', () => {
  for (const locale of locales) {
    const html = readFileSync(homeFile(locale), 'utf8');
    for (const shot of galleryShots) {
      const source = `/shots/${locale}/${shot}.webp`;
      const image = html.match(new RegExp(`<img(?=[^>]*src="${source}\\?v=${shotVersion}")[^>]*>`))?.[0];
      assert.ok(image, `${locale}/${shot} gallery image must render`);
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
