import { readdirSync, readFileSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { LOCALE_CODES } from '../src/i18n/locales.js';
import { isPublishedGuideData } from '../src/lib/guide-publication.js';

const guidesRoot = fileURLToPath(new URL('../src/content/guides/', import.meta.url));

function markdownFiles(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? markdownFiles(path) : entry.name.endsWith('.md') ? [path] : [];
  });
}

function frontmatterValue(source, key) {
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1] ?? '';
  const value = frontmatter.match(new RegExp(`^${key}:\\s*(.+?)\\s*$`, 'm'))?.[1];
  return value?.replace(/^['"]|['"]$/g, '');
}

function unpublishedGuidePaths() {
  return new Set(
    markdownFiles(guidesRoot).flatMap((file) => {
      const source = readFileSync(file, 'utf8');
      const data = {
        review_status: frontmatterValue(source, 'review_status'),
        publication_status: frontmatterValue(source, 'publication_status'),
      };
      if (isPublishedGuideData(data)) return [];

      const id = relative(guidesRoot, file).replaceAll('\\', '/').replace(/\.md$/, '');
      const [firstSegment, ...remainingSegments] = id.split('/');
      const [locale, slug] = LOCALE_CODES.includes(firstSegment)
        ? [firstSegment, remainingSegments.join('/')]
        : ['en', id];
      return [locale === 'en' ? `/guides/${slug}/` : `/${locale}/guides/${slug}/`];
    })
  );
}

const unpublishedPaths = unpublishedGuidePaths();

function isUnpublishedGuideHref(href) {
  if (typeof href !== 'string') return false;
  const url = new URL(href, 'https://rxdown.app');
  if (url.origin !== 'https://rxdown.app') return false;
  const path = url.pathname.endsWith('/') ? url.pathname : `${url.pathname}/`;
  return unpublishedPaths.has(path);
}

// Retain the link text but not a route to a clinical-review draft.
export default function rehypeUnpublishedGuideLinks() {
  return (tree) => {
    const walk = (node) => {
      const children = node.children;
      if (!children) return;

      for (let index = 0; index < children.length; index += 1) {
        const child = children[index];
        if (
          child.type === 'element' &&
          child.tagName === 'a' &&
          isUnpublishedGuideHref(child.properties?.href)
        ) {
          children.splice(index, 1, ...child.children);
          index += child.children.length - 1;
          continue;
        }
        walk(child);
      }
    };

    walk(tree);
  };
}
