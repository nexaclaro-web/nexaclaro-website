/** Production site URL — update here when the live domain is confirmed. */
export const SITE_URL = 'https://nexaclaro.com'

export const SITE_NAME = 'NexaClaro'

export type SeoRoute = {
  path: string
  title: string
  description: string
  /** sitemap <changefreq> */
  changefreq: 'weekly' | 'monthly'
  priority: string
}

/** All public indexable routes (must match App.tsx). */
export const SEO_ROUTES: SeoRoute[] = [
  {
    path: '/',
    title: 'NexaClaro — Веб-страници и бизнис платформи',
    description:
      'Модерни веб-страници, бизнис платформи и дигитални решенија по мерка за компании во Македонија и странство.',
    changefreq: 'weekly',
    priority: '1.0',
  },
  {
    path: '/uslugi',
    title: 'Услуги — NexaClaro',
    description:
      'Веб-страници, UI/UX дизајн, бизнис платформи, админ панели, автоматизација и поддршка — јасно дефинирани услуги со индивидуална понуда.',
    changefreq: 'monthly',
    priority: '0.9',
  },
  {
    path: '/platform',
    title: 'Exchange Office System — NexaClaro',
    description:
      'Платформа за менувачници — трансакции, документи и дневна работа на едно место. Exchange Office System во живо употреба.',
    changefreq: 'monthly',
    priority: '0.9',
  },
  {
    path: '/portfolio',
    title: 'Портфолио — NexaClaro',
    description:
      'Завршени проекти: веб-страници, панели и платформи за клиенти од Македонија и САД.',
    changefreq: 'monthly',
    priority: '0.8',
  },
  {
    path: '/recenzii',
    title: 'Рецензии — NexaClaro',
    description:
      'Што кажуваат клиентите за нашите веб-страници, платформи и соработка.',
    changefreq: 'monthly',
    priority: '0.7',
  },
  {
    path: '/ponuda',
    title: 'Побарај понуда — NexaClaro',
    description:
      'Побарајте индивидуална понуда за веб-страница, платформа или дигитално решение — без фиксни цени.',
    changefreq: 'monthly',
    priority: '0.9',
  },
  {
    path: '/kontakt',
    title: 'Контакт — NexaClaro',
    description:
      'Контактирајте го тимот на NexaClaro — WhatsApp, Viber, Telegram, е-пошта и телефон.',
    changefreq: 'monthly',
    priority: '0.8',
  },
]

export function getSeoForPath(pathname: string): SeoRoute {
  const normalized = pathname.endsWith('/') && pathname.length > 1 ? pathname.slice(0, -1) : pathname
  return SEO_ROUTES.find((r) => r.path === normalized) ?? SEO_ROUTES[0]
}

export function absoluteUrl(path: string): string {
  const base = SITE_URL.replace(/\/$/, '')
  return path === '/' ? `${base}/` : `${base}${path}`
}
