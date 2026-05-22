/**
 * Extract sign-in landing frame from platform-demo.webm (no play-button overlay).
 */
import { chromium } from 'playwright'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const videoFile = path.join(__dirname, '..', 'public', 'assets', 'platform-demo.webm')
const outDir = path.join(__dirname, '..', 'public', 'assets', 'portfolio', 'exchange')
const outPath = path.join(outDir, 'landing.jpg')

const videoUrl = 'file:///' + videoFile.replace(/\\/g, '/')
const html = `<!DOCTYPE html>
<html><head>
<meta charset="utf-8"/>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: 1280px; height: 800px; background: #0a0a0a; overflow: hidden; }
  video { width: 1280px; height: 800px; object-fit: cover; display: block; }
</style>
</head>
<body>
  <video id="v" muted playsinline></video>
  <script>
    const v = document.getElementById('v');
    v.src = ${JSON.stringify(videoUrl)};
    v.addEventListener('loadeddata', () => {
      v.currentTime = 0.55;
    }, { once: true });
    v.addEventListener('seeked', () => {
      document.body.dataset.ready = '1';
    });
  </script>
</body></html>`

fs.mkdirSync(outDir, { recursive: true })
const tmpHtml = path.join(outDir, '_capture.html')
fs.writeFileSync(tmpHtml, html)

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
await page.goto('file:///' + tmpHtml.replace(/\\/g, '/'), { waitUntil: 'load' })
await page.waitForFunction(() => document.body.dataset.ready === '1', { timeout: 30000 })
await page.waitForTimeout(400)
await page.locator('video').screenshot({ path: outPath, type: 'jpeg', quality: 92 })
fs.unlinkSync(tmpHtml)
await browser.close()
console.log('OK', outPath)
