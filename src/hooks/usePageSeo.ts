import { useEffect } from 'react'
import { absoluteUrl, getSeoForPath } from '../data/seo'

function upsertMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute('name', name)
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

/** Per-route title, description, canonical — for crawlers and Search Console. */
export function usePageSeo(pathname: string) {
  useEffect(() => {
    const seo = getSeoForPath(pathname)
    const canonical = absoluteUrl(seo.path)

    document.title = seo.title
    upsertMeta('description', seo.description)
    upsertMeta('robots', 'index, follow')
    upsertLink('canonical', canonical)

    // Open Graph (optional but helps link previews)
    upsertMeta('og:title', seo.title)
    upsertMeta('og:description', seo.description)
    upsertMeta('og:url', canonical)
    upsertMeta('og:type', 'website')
    upsertMeta('og:locale', 'mk_MK')
  }, [pathname])
}
