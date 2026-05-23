# Google indexing checklist (NexaClaro)

After deploy to **https://nexaclaro.com**:

1. **Google Search Console** — add property `https://nexaclaro.com`, verify (HTML tag or DNS).
2. **Submit sitemap** — `https://nexaclaro.com/sitemap.xml`
3. **Request indexing** — URL inspection for `/`, `/ponuda`, `/uslugi` (optional).
4. **robots.txt** — confirm `https://nexaclaro.com/robots.txt` shows `Allow: /` and Sitemap line.

## Already on the site

- `robots.txt` + `sitemap.xml` (7 public routes)
- Per-page `<title>`, meta description, canonical
- Open Graph + Twitter cards (link previews)
- JSON-LD: Organization, WebSite, WebPage
- `lang="mk"`, `index, follow`

## Optional later

- OG image **1200×630** at `/assets/og-image.jpg` (in use for link previews)
- `google-site-verification` meta after Search Console gives you the code
- Bing Webmaster Tools (same sitemap)

Run before each release: `npm run sitemap` (also runs on `npm run build`).
