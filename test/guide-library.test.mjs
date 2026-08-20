import assert from 'node:assert/strict';
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { basename, join } from 'node:path';
import test from 'node:test';

const root = new URL('..', import.meta.url).pathname;
const contentRoot = join(root, 'src/content/guides');
const publicRoot = join(root, 'public');

const locales = [
  ['en', ''],
  ['zh', 'zh'],
  ['ja', 'ja'],
  ['ko', 'ko'],
  ['de', 'de'],
  ['es', 'es'],
  ['fr', 'fr'],
  ['id', 'id'],
  ['pt', 'pt'],
];

const expectedHubCounts = {
  'Start Here & Tapering Fundamentals': 3,
  Antidepressants: 14,
  Benzodiazepines: 11,
  'Sleep Medications': 13,
  'Sleep & CBT-I': 9,
  'Other Medications': 19,
  'Symptoms & Recovery': 3,
  'Practical Tapering Tools': 6,
  'Research & Emerging Evidence': 31,
};

function markdownFiles(dir) {
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith('.md'))
    .map((entry) => join(dir, entry.name));
}

function filesForLocale(pathLocale) {
  if (pathLocale) return markdownFiles(join(contentRoot, pathLocale));
  return markdownFiles(contentRoot);
}

function scalar(source, key) {
  const match = source.match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, 'm'));
  return match?.[1]?.replace(/^['"]|['"]$/g, '');
}

function importedFiles(pathLocale) {
  return filesForLocale(pathLocale).filter((file) =>
    /^content_hub:\s*.+$/m.test(readFileSync(file, 'utf8'))
  );
}

function canonicalHub(value) {
  const normalized = value.trim().toLowerCase();
  const match = Object.keys(expectedHubCounts).find((hub) => hub.toLowerCase() === normalized);
  assert.ok(match, `Unexpected content_hub: ${value}`);
  return match;
}

test('the integrated library keeps 12 legacy guides and adds the verified 109-guide master in every locale', () => {
  for (const [locale, pathLocale] of locales) {
    const all = filesForLocale(pathLocale);
    const imported = importedFiles(pathLocale);
    assert.equal(all.length, 121, `${locale} must expose 121 stable guide slugs`);
    assert.equal(imported.length, 109, `${locale} must include all 109 verified handoff guides`);
    assert.equal(
      imported.filter((file) => scalar(readFileSync(file, 'utf8'), 'article_action') === 'live-update').length,
      3,
      `${locale} must replace only the three authorized live URLs`
    );
  }
});

test('the English evidence master keeps the handoff category distribution and governance metadata', () => {
  const counts = Object.fromEntries(Object.keys(expectedHubCounts).map((hub) => [hub, 0]));
  for (const file of importedFiles('')) {
    const source = readFileSync(file, 'utf8');
    counts[canonicalHub(scalar(source, 'content_hub'))] += 1;
    assert.equal(scalar(source, 'source_locale'), 'en', basename(file));
    assert.match(scalar(source, 'evidence_cutoff') ?? '', /^2026-08-(18|19)$/, basename(file));
    assert.equal(scalar(source, 'slug'), basename(file, '.md'), basename(file));
  }
  assert.deepEqual(counts, expectedHubCounts);
});

test('localized imports retain source hashes and mandatory publication review status', () => {
  for (const [locale, pathLocale] of locales.slice(1)) {
    const imported = importedFiles(pathLocale);
    assert.equal(imported.length, 109, `${locale} metadata audit must cover every imported guide`);
    for (const file of imported) {
      const source = readFileSync(file, 'utf8');
      assert.match(scalar(source, 'translation_source_sha256') ?? '', /^[a-f0-9]{64}$/, basename(file));
      assert.equal(
        scalar(source, 'translation_status'),
        'machine-localized-clinical-review-required',
        `${locale}/${basename(file)}`
      );
      assert.equal(
        scalar(source, 'publication_status'),
        'clinical-review-required',
        `${locale}/${basename(file)}`
      );
    }
  }
});

test('every imported figure resolves to an English or locale-specific public asset', () => {
  for (const [locale, pathLocale] of locales) {
    const imported = importedFiles(pathLocale);
    assert.equal(imported.length, 109, `${locale} asset audit must cover every imported guide`);
    for (const file of imported) {
      const source = readFileSync(file, 'utf8');
      for (const match of source.matchAll(/src="\.\.\/\.\.\/assets\/([^"?#]+)"/g)) {
        const target = pathLocale
          ? join(publicRoot, pathLocale, 'assets', match[1])
          : join(publicRoot, 'assets', match[1]);
        assert.ok(existsSync(target) && statSync(target).isFile(), `${locale}/${basename(file)} → ${target}`);
      }
      const featured = scalar(source, 'featured_image');
      if (!featured) continue;
      const target = pathLocale
        ? join(publicRoot, pathLocale, featured.replace(/^\//, ''))
        : join(publicRoot, featured.replace(/^\//, ''));
      assert.ok(existsSync(target) && statSync(target).isFile(), `${locale}/${basename(file)} → ${target}`);
    }
  }
});
