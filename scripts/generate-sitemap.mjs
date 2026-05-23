/**
 * Regenerates public/robots.txt and public/sitemap.xml from src/data/seo.ts.
 * Run: npm run sitemap
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const seoPath = join(root, 'src', 'data', 'seo.ts')
const sitemapPath = join(root, 'public', 'sitemap.xml')
const robotsPath = join(root, 'public', 'robots.txt')

const source = readFileSync(seoPath, 'utf8')

const siteUrlMatch = source.match(/export const SITE_URL = '([^']+)'/)
const siteUrl = siteUrlMatch?.[1] ?? 'https://nexaclaro.com'

const routeBlocks = [
  ...source.matchAll(/path: '([^']+)'[\s\S]*?changefreq: '([^']+)'[\s\S]*?priority: '([^']+)'/g),
]
const lastmod = new Date().toISOString().slice(0, 10)

const urls = routeBlocks
  .map(([, path, changefreq, priority]) => {
    const loc = path === '/' ? `${siteUrl}/` : `${siteUrl}${path}`
    return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`
  })
  .join('\n')

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`

const robots = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`

writeFileSync(sitemapPath, sitemap, 'utf8')
writeFileSync(robotsPath, robots, 'utf8')
console.log(`Wrote ${sitemapPath} (${routeBlocks.length} URLs, ${siteUrl})`)
console.log(`Wrote ${robotsPath}`)
