/**
 * Optional post-build prerender for SEO (static HTML per route).
 * Run after build: npm run build && npm run prerender
 *
 * Requires: playwright (already in devDependencies)
 */
import { spawn } from 'node:child_process'
import { readFileSync, mkdirSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const distDir = join(root, 'dist')
const seoPath = join(root, 'src', 'data', 'seo.ts')
const PREVIEW_PORT = 4173
const PREVIEW_URL = `http://127.0.0.1:${PREVIEW_PORT}`

function getRoutes() {
  const source = readFileSync(seoPath, 'utf8')
  return [...source.matchAll(/path: '([^']+)'/g)].map(([, path]) => path)
}

function distPathForRoute(route) {
  if (route === '/') return join(distDir, 'index.html')
  const dir = join(distDir, route.slice(1))
  mkdirSync(dir, { recursive: true })
  return join(dir, 'index.html')
}

function waitForPreviewReady(timeoutMs = 60000) {
  return new Promise((resolve, reject) => {
    const start = Date.now()
    const tick = async () => {
      try {
        const res = await fetch(PREVIEW_URL)
        if (res.ok) return resolve()
      } catch {
        /* server not up yet */
      }
      if (Date.now() - start > timeoutMs) {
        return reject(new Error('vite preview did not start in time'))
      }
      setTimeout(tick, 400)
    }
    tick()
  })
}

function startPreview() {
  const proc = spawn(
    process.platform === 'win32' ? 'npx.cmd' : 'npx',
    ['vite', 'preview', '--port', String(PREVIEW_PORT), '--strictPort'],
    { cwd: root, stdio: 'pipe', shell: process.platform === 'win32' },
  )
  return proc
}

async function main() {
  if (!existsSync(distDir)) {
    console.error('dist/ not found. Run: npm run build')
    process.exit(1)
  }

  const routes = getRoutes()
  console.log(`Prerender ${routes.length} routes → dist/`)

  const preview = startPreview()
  try {
    await waitForPreviewReady()
    const browser = await chromium.launch({ headless: true })
    const page = await browser.newPage({
      viewport: { width: 1280, height: 900 },
    })

    for (const route of routes) {
      const url = route === '/' ? PREVIEW_URL : `${PREVIEW_URL}${route}`
      console.log(`  ${route} → ${url}`)

      await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 })
      await page.waitForSelector('footer', { timeout: 30000 })
      await page.waitForTimeout(1500)

      const html = await page.content()
      const out = distPathForRoute(route)
      writeFileSync(out, html, 'utf8')
      console.log(`    wrote ${out.replace(root + '\\', '').replace(root + '/', '')}`)
    }

    await browser.close()
    console.log('Prerender complete.')
  } finally {
    preview.kill('SIGTERM')
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
