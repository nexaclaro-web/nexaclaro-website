import { chromium } from 'playwright'
import crypto from 'crypto'

const urls = [
  'https://themewagon.github.io/consulting/',
  'https://themewagon.github.io/consulting/services.html',
  'https://themewagon.github.io/consulting/contact.html',
]

const browser = await chromium.launch({ headless: true })
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } })
for (const url of urls) {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
  await page.waitForTimeout(600)
  const buf = await page.screenshot({ type: 'jpeg', quality: 60 })
  const hash = crypto.createHash('md5').update(buf).digest('hex').slice(0, 8)
  console.log(hash, url)
}
await browser.close()
