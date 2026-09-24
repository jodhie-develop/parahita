# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A static, multi-page marketing website for **PT Parahita Adhi Sakti**, an Indonesian commodity trading company (rempah/spices, dolomite fertilizer, wood chips, marine products). No framework, no build step, no package manager — plain HTML/CSS/JS deployed as-is to Vercel. Pages: `index.html` (the main one-pager), `gallery.html` (full photo gallery), and one SEO landing page per commodity — `rempah.html`, `dolomit.html`, `wood-chip.html`, `marine-product.html` — all sharing `style.css` and `script.js`.

Current SEO focus (see git history / ask the user for the latest state): the site was not yet indexed by Google as of 2026-09-24 (`site:www.parahitaindonesia.com` returned zero results) despite solid on-page SEO — indexing/Search Console setup takes priority over further on-page work until that's confirmed fixed.

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

- **`index.html`** — the main one-pager. All homepage sections (hero, vision/mission, commodities, market coverage, gallery preview, "why us", contact) are in this one file, in source order matching the on-page order. It also contains:
  - All SEO metadata: title/description/keywords, Open Graph, Twitter Card, and a JSON-LD `@graph` (Organization + WebSite) — keep these in sync with any content/contact changes.
  - The hero (`#about`) section's background is a **crossfading slider** (`.hero-bg-slider` > `.hero-bg-slide` divs, one per photo, toggled via the `active` class) layered under a fixed `.hero-overlay` gradient scrim and the `.hero-content` text — driven by the interval in `script.js`. Slide images are hardcoded `url(...)` paths (currently 3 photos from `gallery/`), not auto-discovered.
  - An inline `<script>` at the bottom implementing the **homepage gallery preview carousel**: it auto-discovers images by probing `gallery/1.jpg`, `gallery/2.jpg`, ... sequentially (stops at the first missing index) rather than reading a manifest. To add/remove preview photos, add/remove sequentially-numbered `.jpg` files in `gallery/` — no code changes needed. This carousel only ever shows the sequentially-numbered files, never arbitrarily-named ones (see `gallery.html` below for the full set). A "Lihat Semua Galeri" button links to `gallery.html`.
- **`gallery.html`** — full photo grid of **every** image in `gallery/`, hardcoded (filenames in `gallery/` aren't uniform, so there's no auto-discovery here). Reuses the same header/nav/footer markup as `index.html`; its nav links point back to `index.html#section` anchors. Add a new `<div class="gallery-item">` block (image + `openLightbox(...)` call) here whenever a new photo is added to `gallery/`, and add a matching `<image:image>` entry in `sitemap.xml`.
- **`rempah.html` / `dolomit.html` / `wood-chip.html` / `marine-product.html`** — one SEO landing page per commodity, each with its own `<title>`/meta description/canonical/OG/Twitter tags and a `WebPage` JSON-LD tied into the homepage's Organization/WebSite `@graph`. Same header/nav/footer pattern as `gallery.html`. Content structure is a `.commodity-detail-grid` (photo + description/varieties/packaging/capacity text) followed by a `.commodity-related` cross-link block to the other 3 commodity pages. The homepage's "Our Commodities" cards (`#commodities` in `index.html`) are `<a>` tags linking to these pages — only 4 of the 5 cards link out; "Other Commodities" (palm oil/rubber/coal) has no dedicated page. When editing these, don't invent unverified specifics (certifications, named export countries, per-commodity tonnage) — the copy intentionally stays general where the business hasn't confirmed exact claims; verify with the user before adding anything more specific.
- **`script.js`** — shared by both pages; every page-specific block (hero text slider, hero background slider, `.btn-primary` handler) is null-guarded since the element only exists on one of the two pages. Also defines `openLightbox()`/`closeLightbox()`, used by both the homepage carousel's inline script and `gallery.html`'s grid.
- **`style.css`** — all shared styling, including the gallery/lightbox CSS (`.gallery-section`, `.gallery-item`, `.lightbox-modal`, etc. — used by both pages) and the `.full-gallery-grid`/`.page-banner` rules specific to `gallery.html`. The header (`header`) is `position: fixed` (floating over content while scrolling); `.hero` reserves `padding-top` to compensate, and `.page-banner` on `gallery.html` does the same.
- **`vercel.json`** — platform config (redirects, headers, clean URLs); see Deployment above. `cleanUrls: true` means `gallery.html` is reachable as `/gallery`; that's the canonical form used in `gallery.html`'s own meta tags and in `sitemap.xml`.
- **`robots.txt` / `sitemap.xml`** — keep `sitemap.xml`'s `<lastmod>` and per-page `<image:image>` list current when content or gallery images change.
- **`images/`** — fixed, hand-referenced images used throughout the page (commodities, "why us", office photos).
- **`gallery/`** — holds two naming conventions: sequentially-numbered `N.jpg` files (auto-loaded by `index.html`'s preview carousel) and arbitrarily-named files like `Gudang parahita N.JPG` (uppercase extension, contains spaces — reference as `%20`-encoded and case-exact, since Vercel's filesystem is case-sensitive). Every file here should have a corresponding hardcoded entry in `gallery.html` and `sitemap.xml`.
- **`gallery/thumbs/`** — downscaled (max 800px, JPEG q78) copies of every file in `gallery/`, same filenames. Both the homepage carousel and `gallery.html`'s grid display these (fast to load); clicking a photo still opens the full-resolution original from `gallery/` in the lightbox (`openLightbox()`'s first argument is always the non-thumb path). **Whenever a photo is added to `gallery/`, generate a matching thumbnail into `gallery/thumbs/` (same filename) before wiring it into `index.html`/`gallery.html`** — there's no build step or script for this, it was done ad hoc via ImageMagick/PowerShell `System.Drawing`; a thumbnail-less photo will 404 in the grid.

## Notable non-obvious details

- The nav bar has an EN/ID language switcher (`#lang-en` / `#lang-id`) and `data-key` attributes on translatable elements, but **no JS wires it up** — it's currently a visual-only stub, not a working i18n toggle.
- The "REQUEST QUOTATION" button (`.btn-primary`) only shows a JS `alert()` placeholder in `script.js` — it isn't wired to a real form or destination.
- Site copy mixes Indonesian and English (Indonesian for body copy/descriptions, English for headings/labels) — match the existing pattern for a given section rather than translating wholesale.
- Recent history has focused on on-page SEO (titles, meta tags, structured data, keyword phrasing like "rempan/rempah") — when editing visible copy, check whether corresponding `<meta>`/JSON-LD text should be updated too.
- Because the header is fixed/floating, any new top-level page needs enough `padding-top` on its first section to clear it (see `.hero` and `.page-banner`).
