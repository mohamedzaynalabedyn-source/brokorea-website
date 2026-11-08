# Site generator

The website's HTML pages are generated. Change the text or templates here, run the generator, check
the result, and commit the generator change together with the regenerated pages.

| File | What it is |
|---|---|
| `content.py` | All English and Arabic text: navigation, pages, catalogue categories, form labels and messages. |
| `build.py` | Page templates. Writes every page in the main folder and `ar/`, plus `404.html`, `sitemap.xml`, `robots.txt`, `CNAME` and `.nojekyll`. It also sets each page's Content Security Policy (see `csp()`). |
| `data/photos.json` | Sizes of the photo files in `images/photos/`. `photos.py` writes this file. |
| `data/category-images.json` | Which image belongs to which catalogue category. |
| `photos.py`, `tone.py` | Rebuild the photo crops and sizes from the untouched originals in `images/photos/original/`. Only needed if photos change. |
| `category_images.py` | Rebuild the category image sizes from `images/categories/masters/`. Only needed if a category image changes. |

`assets/css/style.css` and the scripts in `assets/js/` are edited directly. The generator does not
write them.

## Requirements

- Python 3.12 or newer. `build.py` uses only the standard library.
- The image tools also need Pillow with WebP support (`pip install Pillow`). These outputs were made
  with Pillow 12.3.0.

## Make a change

```
python3 generator/build.py      # from the repository root (works from anywhere)
git status                      # only the pages you meant to change should be listed
git diff                        # read the change before committing
```

If you edit an `.html` file directly instead, make the same change in `content.py` or `build.py`.
Otherwise the next run of the generator will undo your edit.

Edit English and Arabic together. Arabic pages are right-to-left.

Running the generator on an unchanged repository must change nothing. If `git status` shows changes
you didn't make, stop and check them before committing.

## Things to keep

- The quote form's access key lives in `assets/js/form-config.js`, not here. The generator contains
  no keys or passwords, and none should ever be added: everything in this repository is public.
- If you change the small inline script at the top of every page (`LOGO_INTRO_HEAD`), the Content
  Security Policy hash is recalculated automatically. Any other new inline script, inline style,
  or file from another website will be blocked by the browser until `csp()` allows it.
