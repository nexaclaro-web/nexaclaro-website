/**
 * Regenerates public/sitemap.xml from src/data/seo.ts route list.
 * Run: node scripts/generate-sitemap.mjs
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const seoPath = join(root, 'src', 'data', 'seo.ts')
const outPath = join(root, 'public', 'sitemap.xml')

const source = readFileSync(seoPath, 'utf8')

const siteUrlMatch = source.match(/export const SITE_URL = '([^']+)'/)
const siteUrl = siteUrlMatch?.[1] ?? 'https://nexaclaro.com'

const routeBlocks = [...source.matchAll(/path: '([^']+)'[\s\S]*?priority: '([^']+)'/g)]
const lastmod = new Date().toISOString().slice(0, 10)

const urls = routeBlocks
  .map(([, path, priority]) => {
    const loc = path === '/' ? `${siteUrl}/` : `${siteUrl}${path}`
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
  </url>`
  })
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

writeFileSync(outPath, xml, 'utf8')
console.log(`Wrote ${outPath} (${routeBlocks.length} URLs, ${siteUrl})`)
