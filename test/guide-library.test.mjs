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

const cbtIComparisonTitles = {
  en: 'CBT-I vs Sleep Hygiene: Why Advice Alone Is Not the Same Treatment',
  zh: 'CBT-I 與睡眠衛生：為什麼只有建議不等於治療',
  ja: 'CBT-Iと睡眠衛生：助言だけでは同じ治療にならない理由',
  ko: 'CBT-I와 수면 위생: 조언만으로는 같은 치료가 아닌 이유',
  de: 'CBT-I vs. Schlafhygiene: Warum Ratschläge allein nicht dieselbe Behandlung sind',
  es: 'CBT-I frente a higiene del sueño: por qué los consejos por sí solos no equivalen al mismo tratamiento',
  fr: 'CBT-I et hygiène du sommeil : pourquoi de simples conseils ne constituent pas le même traitement',
  id: 'CBT-I vs higiene tidur: mengapa saran saja bukanlah pengobatan yang sama',
  pt: 'CBT-I vs. higiene do sono: por que os conselhos, por si só, não são o mesmo tratamento',
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

test('guide card metadata stays plain text in every locale', () => {
  const markdownSyntax = /\*\*|__|`|\[[^\]]+\]\([^)]+\)|<\/?[a-z][^>]*>/i;
  for (const [locale, pathLocale] of locales) {
    for (const file of filesForLocale(pathLocale)) {
      const source = readFileSync(file, 'utf8');
      assert.doesNotMatch(scalar(source, 'title') ?? '', markdownSyntax, `${locale}/${basename(file)} title`);
      assert.doesNotMatch(
        scalar(source, 'description') ?? '',
        markdownSyntax,
        `${locale}/${basename(file)} description`
      );
    }
  }
});

test('the CBT-I comparison keeps its intended localized topic in metadata and the article heading', () => {
  const slug = 'cbt-i-vs-sleep-hygiene-why-advice-alone-is-not-the-same-treatment.md';
  for (const [locale, pathLocale] of locales) {
    const file = join(contentRoot, pathLocale, slug);
    const source = readFileSync(file, 'utf8');
    const heading = source.match(/^#\s+(.+)$/m)?.[1];
    assert.equal(scalar(source, 'title'), cbtIComparisonTitles[locale], `${locale} metadata title`);
    assert.equal(heading, cbtIComparisonTitles[locale], `${locale} article heading`);
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
