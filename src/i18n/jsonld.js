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

export function breadcrumbLd(locale, pathName, pageName) {
  const base = locale === 'en' ? 'https://rxdown.app' : `https://rxdown.app/${locale}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'RxDown', item: `${base}/` },
      { '@type': 'ListItem', position: 2, name: pageName, item: `${base}${pathName}` },
    ],
  };
}
