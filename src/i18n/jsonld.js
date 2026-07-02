import { APP_STORE_URL, PLAY_STORE_URL } from './locales.js';

/** Home page only — controls the site name Google shows. */
export function webSiteLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'RxDown',
    alternateName: 'RxTaper',
    url: 'https://rxdown.app/',
  };
}

export function softwareAppLd(t) {
  return {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: 'RxDown',
    description: t.meta.home.description,
    applicationCategory: 'HealthApplication',
    operatingSystem: 'iOS, Android',
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    installUrl: [APP_STORE_URL, PLAY_STORE_URL],
    publisher: { '@type': 'Organization', name: 'XUPLABS' },
  };
}

/** Every Q&A must also be visible verbatim in the page HTML. */
export function faqLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((i) => ({
      '@type': 'Question',
      name: i.q,
      acceptedAnswer: { '@type': 'Answer', text: i.a },
    })),
  };
}

/** Guide articles: Article schema with real dates and an honest author.
 *  slug is the locale-free article id; the diagram is shared across locales. */
export function articleLd(entry, url, slug, locale = 'en') {
  const d = entry.data;
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: d.title,
    description: d.description,
    datePublished: d.pubDate.toISOString().slice(0, 10),
    dateModified: (d.updatedDate ?? d.pubDate).toISOString().slice(0, 10),
    inLanguage: locale,
    mainEntityOfPage: url,
    image: `https://rxdown.app/guides/${slug ?? entry.id}.png`,
    author: {
      '@type': 'Person',
      name: 'Chih Yu Lin',
      description:
        'Founder of RxDown. Writing synthesizes published clinical guidelines and peer-reviewed research; sources are cited in each article. Not a medical professional — content is educational, not medical advice.',
      url: 'https://rxdown.app/support/',
    },
    publisher: {
      '@type': 'Organization',
      name: 'XUPLABS',
      logo: { '@type': 'ImageObject', url: 'https://rxdown.app/icon-512.png' },
    },
    citation: d.sources.map((s) => ({
      '@type': 'CreativeWork',
      name: s.label,
      url: s.url,
    })),
  };
}

export function breadcrumbLd(locale, pathName, pageName, parentName, parentPath) {
  const home = locale === 'en' ? 'https://rxdown.app/' : `https://rxdown.app/${locale}/`;
  const abs = (p) => new URL(p, 'https://rxdown.app').href;
  const items = [{ '@type': 'ListItem', position: 1, name: 'RxDown', item: home }];
  if (parentName && parentPath) {
    items.push({ '@type': 'ListItem', position: 2, name: parentName, item: abs(parentPath) });
  }
  items.push({
    '@type': 'ListItem',
    position: items.length + 1,
    name: pageName,
    item: abs(pathName),
  });
  return { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: items };
}
