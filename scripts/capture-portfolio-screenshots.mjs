/**
 * Captures 3 distinct viewport screenshots per portfolio folder from verified live demos.
 * Run: npm run capture:portfolio
 */
import { chromium } from 'playwright'
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..', 'public', 'assets', 'portfolio')

const VIEWPORT = { width: 1280, height: 800 }

/**
 * Each entry must be a real page (verified 200 + unique screenshot hash).
 * Labels align with content.ts screenshots[] per project type.
 */
const JOBS = {
  /** Restaurant Design — Почетна / Мени / Резервации */
  restaurant: [
    { url: 'https://themewagon.github.io/tasty/index.html', file: 'screen-0.jpg' },
    { url: 'https://themewagon.github.io/tasty/menu.html', file: 'screen-1.jpg' },
    { url: 'https://themewagon.github.io/tasty/reservation.html', file: 'screen-2.jpg' },
  ],
  /** Brew & Co. — Почетна / Производи / Контакт */
  cafe: [
    { url: 'https://themewagon.github.io/Coffo/', file: 'screen-0.jpg' },
    { url: 'https://themewagon.github.io/Coffo/about.html', file: 'screen-1.jpg' },
    { url: 'https://themewagon.github.io/Coffo/contact.html', file: 'screen-2.jpg' },
  ],
  /** Nova Industries — Почетна / Услуги / Контакт */
  corporate: [
    { url: 'https://themewagon.github.io/consulting/', file: 'screen-0.jpg' },
    { url: 'https://themewagon.github.io/consulting/services.html', file: 'screen-1.jpg' },
    { url: 'https://themewagon.github.io/consulting/contact.html', file: 'screen-2.jpg' },
  ],
  /** StayPoint — Почетна / Соби / Резервации */
  hotel: [
    { url: 'https://themewagon.github.io/sona/', file: 'screen-0.jpg' },
    { url: 'https://themewagon.github.io/sona/rooms.html', file: 'screen-1.jpg' },
    { url: 'https://themewagon.github.io/sona/contact.html', file: 'screen-2.jpg' },
  ],
  /** Prime Living — Почетна / Имоти / Контакт */
  estate: [
    { url: 'https://themewagon.github.io/property/', file: 'screen-0.jpg' },
    { url: 'https://themewagon.github.io/property/properties.html', file: 'screen-1.jpg' },
    { url: 'https://themewagon.github.io/property/contact.html', file: 'screen-2.jpg' },
  ],
  /** ClearFix — Почетна / Услуги / Контакт */
  service: [
    { url: 'https://themewagon.github.io/cleaning-company/', file: 'screen-0.jpg' },
    { url: 'https://themewagon.github.io/cleaning-company/services.html', file: 'screen-1.jpg' },
    { url: 'https://themewagon.github.io/cleaning-company/contact.html', file: 'screen-2.jpg' },
  ],
  /** OpsPanel — Преглед / Табели / Извештаи */
  dashboard: [
    { url: 'https://preview.tabler.io/', file: 'screen-0.jpg' },
    { url: 'https://preview.tabler.io/tables.html', file: 'screen-1.jpg' },
    { url: 'https://preview.tabler.io/charts.html', file: 'screen-2.jpg' },
  ],
}

function md5File(filePath) {
  return crypto.createHash('md5').update(fs.readFileSync(filePath)).digest('hex')
}

async function capture(page, url, outPath) {
  const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
  const status = response?.status() ?? 0
  if (status >= 400) {
    throw new Error(`HTTP ${status}`)
  }
  await page.evaluate(() => window.scrollTo(0, 0))
  await page.waitForTimeout(1500)
  await page.screenshot({ path: outPath, type: 'jpeg', quality: 90, fullPage: false })
}

async function main() {
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({ viewport: VIEWPORT, deviceScaleFactor: 1 })
  const page = await context.newPage()

  let failed = false

  for (const [folder, shots] of Object.entries(JOBS)) {
    const dir = path.join(root, folder)
    fs.mkdirSync(dir, { recursive: true })
    const hashes = new Map()

    console.log(`\n[${folder}]`)

    for (const { url, file } of shots) {
      const outPath = path.join(dir, file)
      try {
        await capture(page, url, outPath)
        const hash = md5File(outPath)
        if (hashes.has(hash)) {
          console.error(`  DUPLICATE ${file} matches ${hashes.get(hash)} (${hash.slice(0, 8)})`)
          failed = true
        } else {
          hashes.set(hash, file)
        }
        const kb = Math.round(fs.statSync(outPath).size / 1024)
        console.log(`  OK ${file} (${kb} KB) ${url}`)
      } catch (err) {
        console.error(`  FAIL ${file} ${url} — ${err.message}`)
        failed = true
      }
    }

    // Remove legacy unused assets so only screen-*.jpg remain
    for (const entry of fs.readdirSync(dir)) {
      if (!/^screen-\d\.jpg$/.test(entry)) {
        fs.unlinkSync(path.join(dir, entry))
        console.log(`  removed legacy ${entry}`)
      }
    }
  }

  await browser.close()

  if (failed) {
    console.error('\nCapture finished with errors or duplicate screens.')
    process.exit(1)
  }
  console.log('\nAll portfolio screenshots captured — 3 unique screens per project.')
}

main()
