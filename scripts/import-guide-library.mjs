import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
} from 'node:fs';
import { basename, dirname, join, relative } from 'node:path';
import { pathToFileURL } from 'node:url';

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

const expectedLiveSlugs = [
  'benzodiazepine-tapering-ashton',
  'hold-and-reinstate-guide',
  'sleep-during-withdrawal',
];

function filesUnder(root, extension) {
  if (!existsSync(root)) throw new Error(`Missing source directory: ${root}`);
  const files = [];
  for (const entry of readdirSync(root, { withFileTypes: true })) {
    const path = join(root, entry.name);
    if (entry.isDirectory()) files.push(...filesUnder(path, extension));
    else if (!extension || entry.name.endsWith(extension)) files.push(path);
  }
  return files.sort();
}

function assertUniqueSlugs(files, label) {
  const seen = new Set();
  for (const file of files) {
    const slug = basename(file, '.md');
    if (seen.has(slug)) throw new Error(`${label} contains duplicate slug: ${slug}`);
    seen.add(slug);
  }
}

function assertLiveRevisions(articlesRoot, label) {
  const liveRoot = join(articlesRoot, 'live-revisions');
  const actual = existsSync(liveRoot)
    ? filesUnder(liveRoot, '.md').map((file) => basename(file, '.md')).sort()
    : [];
  assertSameList(actual, expectedLiveSlugs, `${label} live revisions`);
}

function assertSameList(actual, expected, label) {
  const want = [...expected].sort();
  if (actual.length !== want.length || actual.some((value, index) => value !== want[index])) {
    throw new Error(`${label} mismatch: expected ${want.join(', ')}, got ${actual.join(', ')}`);
  }
}

function copyNew(source, target) {
  if (existsSync(target)) throw new Error(`Staging target collision: ${target}`);
  mkdirSync(dirname(target), { recursive: true });
  copyFileSync(source, target);
}

function copyAssets(sourceRoot, targetRoot) {
  const files = filesUnder(sourceRoot);
  for (const file of files) {
    const assetPath = relative(sourceRoot, file);
    copyNew(file, join(targetRoot, assetPath));
  }
  const topLevelFiles = files.filter((file) => dirname(file) === sourceRoot);
  for (const file of topLevelFiles) {
    if (basename(file).toLowerCase() === 'readme.md') continue;
    const featuredTarget = join(targetRoot, 'guides', basename(file));
    if (!existsSync(featuredTarget)) {
      copyNew(file, featuredTarget);
      continue;
    }
    if (!readFileSync(file).equals(readFileSync(featuredTarget))) {
      throw new Error(`Asset variants disagree: ${file} and ${featuredTarget}`);
    }
  }
  return topLevelFiles.length;
}

export function stageGuideLibrary({ source, output, expectedArticleCount = 109 }) {
  if (!source || !output) throw new Error('Both source and output paths are required');
  if (existsSync(output)) throw new Error(`Output path already exists: ${output}`);
  if (!existsSync(join(source, 'EXISTING_SITE_UPDATE_MAP.csv'))) {
    throw new Error('Source is missing EXISTING_SITE_UPDATE_MAP.csv');
  }

  const englishArticlesRoot = join(source, 'en/articles');
  const englishArticles = filesUnder(englishArticlesRoot, '.md');
  if (englishArticles.length !== expectedArticleCount) {
    throw new Error(`Expected ${expectedArticleCount} English articles, found ${englishArticles.length}`);
  }
  assertUniqueSlugs(englishArticles, 'English library');
  assertLiveRevisions(englishArticlesRoot, 'English library');

  for (const file of englishArticles) {
    copyNew(file, join(output, 'content', basename(file)));
  }

  let localizedArticles = 0;
  for (const [sourceLocale, routeLocale] of Object.entries(localeMap)) {
    const articlesRoot = join(source, `locales/${sourceLocale}/articles`);
    const articles = filesUnder(articlesRoot, '.md');
    if (articles.length !== expectedArticleCount) {
      throw new Error(`Expected ${expectedArticleCount} ${sourceLocale} articles, found ${articles.length}`);
    }
    assertUniqueSlugs(articles, `${sourceLocale} library`);
    assertSameList(
      articles.map((file) => basename(file, '.md')).sort(),
      englishArticles.map((file) => basename(file, '.md')).sort(),
      `${sourceLocale} slug set`
    );
    assertLiveRevisions(articlesRoot, `${sourceLocale} library`);
    for (const file of articles) {
      copyNew(file, join(output, 'content', routeLocale, basename(file)));
    }
    localizedArticles += articles.length;
  }

  const englishAssets = copyAssets(join(source, 'en/assets'), join(output, 'public/assets'));
  let localizedAssets = 0;
  for (const [sourceLocale, routeLocale] of Object.entries(localeMap)) {
    localizedAssets += copyAssets(
      join(source, `locales/${sourceLocale}/assets`),
      join(output, `public/${routeLocale}/assets`)
    );
  }

  return {
    englishArticles: englishArticles.length,
    localizedArticles,
    englishAssets,
    localizedAssets,
  };
}

function cliArguments(args) {
  const value = (flag) => {
    const index = args.indexOf(flag);
    return index === -1 ? undefined : args[index + 1];
  };
  return { source: value('--source'), output: value('--output') };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  try {
    const summary = stageGuideLibrary(cliArguments(process.argv.slice(2)));
    process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
  } catch (error) {
    process.stderr.write(`${error.message}\n`);
    process.exitCode = 1;
  }
}
