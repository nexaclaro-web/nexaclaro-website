import { absoluteUrl, getSeoForPath, SITE_NAME, SITE_URL } from '../data/seo'

const ORG_ID = `${SITE_URL}/#organization`
const WEBSITE_ID = `${SITE_URL}/#website`

const organization = {
  '@type': 'Organization',
  '@id': ORG_ID,
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/assets/logo.png`,
  email: 'contact@nexaclaro.com',
  telephone: '+38979312438',
  areaServed: {
    '@type': 'Country',
    name: 'North Macedonia',
  },
  sameAs: ['https://www.linkedin.com/company/nexaclaro'],
}

const website = {
  '@type': 'WebSite',
  '@id': WEBSITE_ID,
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: 'mk',
  publisher: { '@id': ORG_ID },
}

/** Schema.org JSON-LD for the current route (Organization + WebSite + WebPage). */
export function getPageJsonLd(pathname: string) {
  const seo = getSeoForPath(pathname)
  const pageUrl = absoluteUrl(seo.path)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      organization,
      website,
      {
        '@type': 'WebPage',
        '@id': `${pageUrl}#webpage`,
        url: pageUrl,
        name: seo.title,
        description: seo.description,
        isPartOf: { '@id': WEBSITE_ID },
        about: { '@id': ORG_ID },
        inLanguage: 'mk',
      },
    ],
  }
}
