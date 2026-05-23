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

## Deploy note

Hosts (Cloudflare Pages, Netlify, Vercel) serve `dist/ponuda/index.html` for URL `/ponuda` automatically.

## If prerender fails

- Run `npx playwright install chromium` once.
- Or skip it and use `npm run build` only — site still works.
