import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import test from 'node:test';

const root = new URL('..', import.meta.url).pathname;
const distRoot = join(root, 'dist');
const locales = ['en', 'zh', 'ja', 'ko', 'de', 'es', 'fr', 'id', 'pt'];
const shots = ['today', 'voice', 'journey', 'insights', 'ai', 'report', 'log', 'export'];

function homeFile(locale) {
  return locale === 'en'
    ? join(distRoot, 'index.html')
    : join(distRoot, locale, 'index.html');
}

test('each localized homepage ships and renders its matching app screenshots', () => {
  for (const locale of locales) {
    const html = readFileSync(homeFile(locale), 'utf8');
    for (const shot of shots) {
      const source = `/shots/${locale}/${shot}.webp`;
      assert.ok(
        existsSync(join(root, 'public', 'shots', locale, `${shot}.webp`)),
        `${locale}/${shot} source asset must exist`
      );
      assert.ok(
        existsSync(join(distRoot, 'shots', locale, `${shot}.webp`)),
        `${locale}/${shot} built asset must exist`
      );
      assert.ok(html.includes(`src="${source}"`), `${locale} homepage must render ${source}`);
    }
  }
});
