import { useEffect } from 'react'
import { absoluteUrl, getSeoForPath, SITE_NAME, SITE_URL } from '../data/seo'
import { getPageJsonLd } from '../lib/structuredData'

const JSON_LD_ID = 'nexaclaro-jsonld'
const OG_IMAGE = `${SITE_URL}/assets/og-image.jpg`

function upsertMetaByName(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertMetaByProperty(property: string, content: string) {
  let el = document.querySelector(`meta[property="${property}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('property', property)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

function upsertJsonLd(data: object) {
  let el = document.getElementById(JSON_LD_ID) as HTMLScriptElement | null
  if (!el) {
    el = document.createElement('script')
    el.id = JSON_LD_ID
    el.type = 'application/ld+json'
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

/** Per-route title, description, canonical, OG/Twitter, JSON-LD — for crawlers and Search Console. */
export function usePageSeo(pathname: string) {
  useEffect(() => {
    const seo = getSeoForPath(pathname)
    const canonical = absoluteUrl(seo.path)

    document.title = seo.title
    document.documentElement.lang = 'mk'

    upsertMetaByName('description', seo.description)
    upsertMetaByName('robots', 'index, follow')
    upsertLink('canonical', canonical)

    upsertMetaByProperty('og:title', seo.title)
    upsertMetaByProperty('og:description', seo.description)
    upsertMetaByProperty('og:url', canonical)
    upsertMetaByProperty('og:type', 'website')
    upsertMetaByProperty('og:locale', 'mk_MK')
    upsertMetaByProperty('og:site_name', SITE_NAME)
    upsertMetaByProperty('og:image', OG_IMAGE)

    upsertMetaByName('twitter:card', 'summary_large_image')
    upsertMetaByName('twitter:title', seo.title)
    upsertMetaByName('twitter:description', seo.description)
    upsertMetaByName('twitter:image', OG_IMAGE)

    upsertJsonLd(getPageJsonLd(pathname))
  }, [pathname])
}
