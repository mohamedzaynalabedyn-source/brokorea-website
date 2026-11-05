# Images

## Photos (`images/photos/`)

The five company photographs are used as cropped web copies. The untouched originals are kept in
`images/photos/original/` under their original file names.

| Where it shows | Original | Web files |
|---|---|---|
| Homepage introduction, beside the heading | `6100418732762008896_121.jpg` (loaded truck, wide) | `truck-wide-*` (computer, 3:2) and `truck-wide-m-*` (phone, 4:3) |
| Homepage "Why trust us?" section | `6100418732762008900_121.jpg` (warehouse with forklift) | `warehouse-forklift-*` (3:2) and `warehouse-forklift-m-*` (4:3) |
| Homepage "How it works", beside the steps | `6100418732762008903_121.jpg` (cartons on pallets) | `cartons-pallets-*` (4:5) |
| How it works page, beside the steps | `6100418732762008901_121.jpg` (loaded truck, portrait) | `truck-portrait-*` (4:5) and `truck-portrait-m-*` (phone, 1:1) |
| About page | `6100418732762008904_121.jpg` (warehouse interior) | `warehouse-interior-*` (5:4) |

Each web file exists as `.webp` (used by modern browsers) and `.jpg` (fallback), in two widths;
the number in the name is the width in pixels. The photos are cropped, and the darker ones have a
mild exposure lift (midtones only). Nothing is added, removed or placed on top of them; each photo
has a short factual caption below it on the page.

To replace a photo, keep the same crop shape (3:2, 4:3, 4:5, 1:1 or 5:4) and upload new files with
exactly the same names and widths, in both `.webp` and `.jpg`. If that's awkward, send the new photo
to whoever maintains the site and they can regenerate the files.

Only use photos you took yourself or have the rights to, and no car brand logos.

## Parts categories (`images/categories/`)

One product image per category, shown on the catalog grid and on each category page. They are
**representative illustrations**, not photographs of stock: studio-style CGI stills generated
with an AI image model (GPT Image 2.6 via Higgsfield, November 2026) on transparent
backgrounds, then placed on one shared 4:3 canvas with the same ground line and the same soft
contact shadow (key light from the upper left). No brand names, logos or part numbers.

| Category | Files (`images/categories/`) |
|---|---|
| Engine parts | `engine-parts-inline-four-engine-*` |
| Ignition & spark plugs | `ignition-two-spark-plugs-*` |
| Filters | `filters-oil-air-cabin-*` |
| Brakes | `brakes-disc-and-caliper-*` |
| Suspension & steering | `suspension-strut-and-control-arm-*` |
| Electrical & sensors | `electrical-alternator-and-sensor-*` |
| Cooling | `cooling-radiator-and-fan-*` |
| Lighting | `lighting-headlamp-assembly-*` |
| Body parts | `body-parts-bumper-and-mirror-*` |
| Transmission | `transmission-gearbox-assembly-*` |
| Smart keys & remotes | `smart-keys-two-key-fobs-*` |

Each has transparent WebP files at 400, 800 and 1200 px wide (used by browsers), an 800 px PNG
fallback, and the full 1200 × 900 transparent master in `images/categories/masters/`. To replace
one, keep the same transparent 4:3 layout and file names.

## Logo and icons

All logo files use the November 2026 swoosh. `BRO-KOREA-Logo-Pack.zip` in the main folder is the
downloadable pack, regenerated from the same master files.

The header logo is drawn in the page itself (inline SVG) so it can animate. On the first page of a
visit a red wave line runs in from the page edge (left in English, right in Arabic), becomes the
swoosh, and KOREA fades in; every later page in that visit shows the finished logo. It is skipped
for reduced motion and on narrow screens the logo just draws itself. Code: `assets/js/logo-anim.js`
(loads `assets/js/vendor/gsap.min.js` only when it plays).


These come from the BRO KOREA logo pack:
- `images/logo.svg` is the header logo. `images/logo-white.svg` is the footer logo on the dark
  background. `images/logo.png` is used by Google.
- In the main folder: `og-image.png` is the preview picture shown when a link is shared on
  WhatsApp, Facebook and similar apps (1200 × 630 px). `favicon.ico`, `favicon.svg`,
  `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` and
  `site.webmanifest` are the browser and phone icons.
- To update any of them, upload the new file with the same name.

## Fonts (`assets/fonts/`)

Noto Sans (English), Noto Kufi Arabic Bold (Arabic headings) and Noto Sans Arabic (Arabic text),
matching the company profile. They are free fonts under the SIL Open Font License; the licence
files are in the same folder.

How to upload on GitHub: open the folder on github.com → **Add file** → **Upload files** →
drag the files in → **Commit changes**. The site updates within a few minutes.
