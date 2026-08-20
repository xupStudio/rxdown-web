import { getCollection } from 'astro:content';
import { LOCALE_CODES } from './locales.js';

/** Guide markdown ids encode locale by directory:
 *  EN lives at the collection root ("brain-zaps"), translations live in a
 *  locale subdir ("zh/brain-zaps"). These helpers split that apart. */
export function guideLocale(id) {
  const i = id.indexOf('/');
  const loc = i === -1 ? 'en' : id.slice(0, i);
  return LOCALE_CODES.includes(loc) ? loc : 'en';
}

export function guideSlug(id) {
  const i = id.indexOf('/');
  return i === -1 ? id : id.slice(i + 1);
}

export function guidePath(locale, slug) {
  return locale === 'en' ? `/guides/${slug}/` : `/${locale}/guides/${slug}/`;
}

export function guidesIndexPath(locale) {
  return locale === 'en' ? '/guides/' : `/${locale}/guides/`;
}

/** All guide entries for one locale, id normalised so callers see clean slugs. */
export async function guidesForLocale(locale) {
  const all = await getCollection('guides');
  return all
    .filter((g) => guideLocale(g.id) === locale)
    .map((g) => ({ entry: g, slug: guideSlug(g.id) }));
}

/** hreflang cluster for one article: every locale that actually has it. */
export async function guideAlternates(slug) {
  const all = await getCollection('guides');
  const present = new Set(
    all.filter((g) => guideSlug(g.id) === slug).map((g) => guideLocale(g.id))
  );
  return LOCALE_CODES.filter((l) => present.has(l)).map((l) => ({
    locale: l,
    path: guidePath(l, slug),
  }));
}
