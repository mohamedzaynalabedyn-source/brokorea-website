# BRO KOREA — Brand Guide

This is the source of truth for anything branded BRO KOREA: the website, catalogs,
quotes, invoices and social media. Claude: read this before designing or writing
anything for BRO KOREA.

---

## 1. Company (public info)

| | |
|---|---|
| Name | **BRO KOREA** (always uppercase, with a space) |
| Location | Seoul, South Korea |
| Established | 2012 |
| Business Reg. No. | 201-86-30533 |
| Email | info@brokorea.com |
| Phone / WhatsApp | +82 10-3949-1286 (wa.me/821039491286) |
| Website | brokorea.com |

**What we do:** B2B export of Korean car parts to wholesalers, parts shops and
importers, mainly in **Iraq and the UAE**. We have no fixed stock list. We source any
part available in Korea, including genuine Hyundai Mobis parts for Hyundai, Kia and
Genesis; GM Korea (Chevrolet/Daewoo); KG Mobility (SsangYong); Renault Korea;
NGK spark plugs; and on request, Mercedes-Benz, BMW (incl. smart keys) and Tesla parts.
We also export Korean cosmetics.

**How buyers order:** they send part numbers or a VIN, and we reply with a quote.
**Prices are never shown publicly.**

**Languages:** English and Arabic. Arabic layouts are right-to-left.

**Tone:** direct, trustworthy and practical, like a supplier who answers fast and
knows parts. No hype, no slang, and no fake reviews or invented customer names.

> Bank details are intentionally NOT in this file. This repo is public.

---

## 2. Logo

The logo is the original BRO KOREA design (BRO with the Taegukgi in the O, a red car
swoosh, and KOREA in a geometric font), redrawn as a clean vector. **Don't redesign
it, redraw it, or rebuild it from fonts. Always use the files.**

| File | Use it for |
|---|---|
| `logo.svg` / `bro-korea-logo.svg` | Default. Website header, documents, anything on white or light backgrounds |
| `logo-white.svg` / `bro-korea-logo-reverse.svg` | On navy, black or dark photos (white letters; the flag stays in color) |
| `bro-korea-logo-navy.svg` | One-color printing (stamps, engraving, single-color stickers) |
| `bro-korea-logo-black.svg` | Black-only printing, fax, photocopies |
| `bro-korea-logo-white.svg` | One-color white on colored backgrounds (e.g. red) |
| `bro-korea-icon.svg` | Round icon (the O with the flag): app icon, profile picture, watermark |
| `favicon.svg` / `favicon.ico` | Browser tab icon |
| `print/*.pdf` | Send these to print shops (vector, any size) |

**Clear space:** keep empty space around the logo at least equal to the thickness of
the O ring (about 5% of the logo's width) on every side.

**Minimum size:** 120 px wide on screens, 30 mm wide in print. Below that, use the
round icon instead.

**Don't:**
- stretch, squash or rotate the logo
- change its colors, except by using the provided variants
- change the flag (keep red on top, and keep the trigrams in their positions)
- add shadows, outlines, glows or gradients
- put the full-color logo on busy photos (use the white version on a dark overlay)
- retype "BRO KOREA" in a font as a substitute for the logo

---

## 3. Colors

| Name | HEX | RGB | CMYK (approx.) | Use |
|---|---|---|---|---|
| **BRO Navy** | `#1F2D44` | 31, 45, 68 | 54, 34, 0, 73 | Primary: logo letters, headings, header/footer, buttons |
| **Korea Red** | `#CD2E3A` | 205, 46, 58 | 0, 78, 72, 20 | Accent: swoosh, call-to-action buttons ("Request a Quote"), highlights |
| **Korea Blue** | `#0047A0` | 0, 71, 160 | 100, 56, 0, 37 | Flag only. Use sparingly elsewhere (links at most) |
| **Black** | `#000000` | 0, 0, 0 | 0, 0, 0, 100 | Flag trigrams |
| **White** | `#FFFFFF` | 255, 255, 255 | 0, 0, 0, 0 | Backgrounds |
| Light gray | `#F4F5F7` | 244, 245, 247 | — | Section backgrounds, cards |

The red and blue are the standard Korean flag colors. CMYK values are approximate,
so ask the print shop for a proof.

Suggested CSS tokens:

```css
:root {
  --bro-navy: #1F2D44;
  --bro-red: #CD2E3A;
  --bro-blue: #0047A0;
  --bro-gray: #F4F5F7;
  --bro-text: #1F2D44;
}
```

---

## 4. Fonts

Both fonts are free Google Fonts.

- **Montserrat** for English. Headings use 700–800, body text uses 400–500. Its
  geometric shapes match the KOREA lettering in the logo.
- **Cairo** for Arabic. Headings use 700, body text uses 400. It pairs well with
  Montserrat.

```html
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700&family=Montserrat:wght@400;500;700;800&display=swap" rel="stylesheet">
```

---

## 5. Website setup (files in `/website`)

Put these in the site root: `favicon.ico`, `favicon.svg`, `apple-touch-icon.png`,
`icon-192.png`, `icon-512.png`, `icon-maskable-512.png`, `site.webmanifest`,
`og-image.png`. Add to every page's `<head>`:

```html
<link rel="icon" href="/favicon.ico" sizes="any">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="manifest" href="/site.webmanifest">
<meta name="theme-color" content="#1F2D44">
<meta property="og:image" content="https://brokorea.com/og-image.png">
```

Header logo: `logo.svg`, about 56–64 px tall on desktop and 44–48 px on mobile, with
`alt="BRO KOREA"`. On a navy header or footer, use `logo-white.svg`.
