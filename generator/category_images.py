"""Web derivatives for the category images: transparent WebP at 400/800/1200 px and a lighter
palette PNG fallback at 800 px, made from the 1200 x 900 transparent masters in
images/categories/masters/. Needs Pillow with WebP support. Run: python3 generator/category_images.py
(To replace an image, put the new 1200 x 900 master in masters/ under the same name, then run this.)"""
import os, sys, json
from PIL import Image
S = os.path.dirname(os.path.abspath(__file__))
SITE = os.path.join(os.path.dirname(S), 'images', 'categories')
MAP = json.load(open(os.path.join(S, 'data', 'category-images.json')))      # slug -> descriptive basename
report = {}
for slug, base in MAP.items():
    src = os.path.join(SITE, 'masters', f'{base}.png')
    im = Image.open(src).convert('RGBA')
    files = {}
    for w in (400, 800, 1200):
        out = im if w == im.width else im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        f = os.path.join(SITE, f'{base}-{w}.webp')
        out.save(f, 'WEBP', quality=84, alpha_quality=100, method=6)
        files[f'{w}.webp'] = os.path.getsize(f)
    fb = im.resize((800, 600), Image.LANCZOS)
    q = fb.quantize(colors=256, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.FLOYDSTEINBERG)
    f = os.path.join(SITE, f'{base}-800.png'); q.save(f, optimize=True)
    files['800.png'] = os.path.getsize(f)
    files['master.png'] = os.path.getsize(os.path.join(SITE, 'masters', f'{base}.png'))
    report[slug] = files
print(json.dumps({k: {f: f'{v/1024:.0f} KB' for f, v in d.items()} for k, d in report.items()}, indent=1))
