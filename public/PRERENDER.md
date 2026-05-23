# Optional prerender (SEO)

**Default build** (`npm run build`) includes prerender automatically.

Faster build without prerender (SPA only):

```bash
npm run build:spa
```

`npm run build` runs `vite build`, then Playwright opens each public page and saves full HTML into `dist/`:

- `/` → `dist/index.html`
- `/ponuda` → `dist/ponuda/index.html`
- etc. (all routes in `src/data/seo.ts`)

## First-time / CI setup

```bash
npx playwright install chromium
```

## When to skip prerender

Use `npm run build:spa` if Playwright fails on your machine and you need a quick deploy (sitemap + meta tags still work).

## Deploy note (Vercel)

On Vercel, use **Build Command:** `npm run build` (no Playwright install). Prerender is skipped automatically on Vercel; routing uses `vercel.json`.

For static HTML per route on the server, run `npm run build` on your PC before a release, or use `npm run build:spa` on Vercel (same as auto-skip).

Other hosts: prerendered `dist/ponuda/index.html` is served for `/ponuda` when you upload a full `npm run build` output from your machine.

## If prerender fails

- Run `npx playwright install chromium` once.
- Or skip it and use `npm run build` only — site still works.
