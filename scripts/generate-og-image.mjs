/**
 * Regenerates public/assets/og-image.jpg (1200×630) for link previews.
 * Centered layout so WhatsApp / Viber square crops stay readable.
 * Run: node scripts/generate-og-image.mjs
 */
import { readFileSync } from 'node:fs'
import { chromium } from 'playwright'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const outJpg = join(root, 'public', 'assets', 'og-image.jpg')
const outPng = join(root, 'public', 'assets', 'og-image.png')
const logoPath = join(root, 'public', 'assets', 'logo.png')
const logoB64 = readFileSync(logoPath).toString('base64')
const logoUrl = `data:image/png;base64,${logoB64}`

const html = `<!DOCTYPE html>
<html lang="mk">
<head>
<meta charset="UTF-8" />
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 1200px;
    height: 630px;
    background: radial-gradient(ellipse 80% 70% at 50% 45%, #1a1a1f 0%, #050505 72%);
    font-family: Inter, system-ui, sans-serif;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .safe {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    max-width: 720px;
    padding: 0 48px;
  }
  .logo-wrap {
    width: 280px;
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }
  .logo {
    width: 280px;
    height: 280px;
    object-fit: contain;
    transform: scale(1.55);
    transform-origin: center;
    filter: drop-shadow(0 12px 36px rgba(0,0,0,0.55));
  }
  h1 {
    font-size: 50px;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.02em;
    line-height: 1.05;
    margin-bottom: 16px;
  }
  .line {
    width: 64px;
    height: 3px;
    background: linear-gradient(90deg, transparent, #22c55e, transparent);
    margin-bottom: 20px;
    border-radius: 2px;
  }
  p {
    font-size: 26px;
    font-weight: 500;
    color: #a1a1aa;
    line-height: 1.35;
    margin-bottom: 22px;
  }
  .url {
    font-size: 20px;
    color: #71717a;
    letter-spacing: 0.04em;
  }
</style>
</head>
<body>
  <div class="safe">
    <div class="logo-wrap"><img class="logo" src="${logoUrl}" alt="" /></div>
    <h1>NexaClaro</h1>
    <div class="line"></div>
    <p>Веб-страници и бизнис платформи</p>
    <span class="url">nexaclaro.com</span>
  </div>
</body>
</html>`

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } })
await page.setContent(html, { waitUntil: 'load' })
await page.waitForFunction(() => {
  const img = document.querySelector('.logo')
  return img instanceof HTMLImageElement && img.complete && img.naturalWidth > 0
})
await page.screenshot({ path: outPng, type: 'png' })
await page.screenshot({ path: outJpg, type: 'jpeg', quality: 92 })
await browser.close()
console.log('Wrote', outJpg)
console.log('Wrote', outPng)
