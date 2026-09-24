# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, single-page marketing website for **PT Parahita Adhi Sakti**, an Indonesian commodity trading company (rempah/spices, dolomite fertilizer, wood chips, marine products). No framework, no build step, no package manager — plain HTML/CSS/JS deployed as-is to Vercel.

## Running / previewing changes

There is no build or dev server tooling (no `package.json`). To preview locally, just open `index.html` in a browser, or serve the directory statically, e.g.:

```
npx serve .
```

There are no tests and no linter configured in this repo.

## Deployment

Deployed on Vercel as a static site. `vercel.json` controls platform behavior:
- `cleanUrls: true`
- Permanent redirect from `parahita.vercel.app` to `https://www.parahitaindonesia.com`
- Security headers (`X-Content-Type-Options`, `Referrer-Policy`) on all routes
- Long-lived `Cache-Control` for `/gallery/*`, `/images/*`, and for `style.css`/`script.js`/`logo.png`

## Architecture

Everything lives in a handful of top-level files:

- **`index.html`** — the entire page. All sections (hero, vision/mission, commodities, market coverage, gallery, "why us", contact) are in this one file, in source order matching the on-page order. It also contains:
  - All SEO metadata: title/description/keywords, Open Graph, Twitter Card, and a JSON-LD `@graph` (Organization + WebSite) — keep these in sync with any content/contact changes.
  - A `<style>` block embedded in `<head>` (gallery grid + lightbox/zoom modal CSS) that is **separate from `style.css`** — gallery/lightbox styling lives here, everything else lives in `style.css`.
  - An inline `<script>` at the bottom implementing the **gallery carousel and lightbox**: it auto-discovers images by probing `gallery/1.jpg`, `gallery/2.jpg`, ... sequentially (stops at the first missing index) rather than reading a manifest. To add/remove gallery photos, just add/remove sequentially-numbered `.jpg` files in `gallery/` — no code or HTML changes needed. Also update `sitemap.xml`'s `<image:image>` entries to match.
- **`script.js`** — loaded after the inline script; handles the header scroll-shadow effect (duplicated from the inline script — both run), the animated stats counters (`.counter[data-target]`), and the rotating hero headline/subtext (`sliderData` array, swapped every 4s).
- **`style.css`** — styling for everything except the gallery carousel/lightbox (see above).
- **`vercel.json`** — platform config (redirects, headers, clean URLs); see Deployment above.
- **`robots.txt` / `sitemap.xml`** — keep `sitemap.xml`'s `<lastmod>` and image list current when content or gallery images change.
- **`images/`** — fixed, hand-referenced images used throughout the page (commodities, "why us", office photos).
- **`gallery/`** — sequentially numbered photos (`1.jpg`, `2.jpg`, ...) auto-loaded by the inline script in `index.html`; must stay numbered with no gaps for the auto-loader to pick them all up.

## Notable non-obvious details

- The nav bar has an EN/ID language switcher (`#lang-en` / `#lang-id`) and `data-key` attributes on translatable elements, but **no JS wires it up** — it's currently a visual-only stub, not a working i18n toggle.
- The "REQUEST QUOTATION" button (`.btn-primary`) only shows a JS `alert()` placeholder in `script.js` — it isn't wired to a real form or destination.
- Site copy mixes Indonesian and English (Indonesian for body copy/descriptions, English for headings/labels) — match the existing pattern for a given section rather than translating wholesale.
- Recent history on this branch (`seo-update`) has focused on on-page SEO (titles, meta tags, structured data, keyword phrasing like "rempan/rempah") — when editing visible copy, check whether corresponding `<meta>`/JSON-LD text should be updated too.
