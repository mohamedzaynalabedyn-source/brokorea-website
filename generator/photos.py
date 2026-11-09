"""Web derivatives of the five BRO KOREA photos: crops (boxes from the approved proposal) plus a
modest midtone lift on the darker photos (tone.py). Nothing else is edited. Reads the unchanged
originals in images/photos/original/ and writes the WebP/JPEG sizes plus data/photos.json.
Needs Pillow with WebP support. Run: python3 generator/photos.py"""
import os, shutil, sys, json
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from PIL import Image, features
from tone import lift, GAMMA

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "images", "photos")
SRC = os.path.join(OUT, "original")      # the supplied photos, kept unchanged in the repository
assert features.check("webp"), "Pillow without WebP"

# key: (source, original name, {variant: (box, [output widths])})
PHOTOS = {
    "truck-wide":         ("11.jpg", "6100418732762008896_121.jpg", {"": ((35, 24, 1035, 691), [1000, 700]), "m": ((70, 0, 1030, 720), [960, 640])}),
    "warehouse-forklift": ("12.jpg", "6100418732762008900_121.jpg", {"": ((80, 0, 1160, 720), [1080, 720]), "m": ((150, 0, 1110, 720), [960, 640])}),
    "cartons-pallets":    ("14.jpg", "6100418732762008903_121.jpg", {"": ((0, 380, 720, 1280), [720, 480])}),
    "truck-portrait":     ("13.jpg", "6100418732762008901_121.jpg", {"": ((0, 70, 960, 1270), [960, 600]), "m": ((0, 190, 960, 1150), [960, 640])}),
    "warehouse-interior": ("15.jpg", "6100418732762008904_121.jpg", {"": ((50, 500, 840, 1132), [790, 520])}),
}

manifest = {}
for key, (src, orig, variants) in PHOTOS.items():
    path = os.path.join(SRC, orig)
    im = Image.open(path)
    assert im.getexif().get(0x0112, 1) == 1, f"{src} has an EXIF rotation"
    im = im.convert("RGB")
    if GAMMA.get(key, 1.0) != 1.0:
        im = lift(im, GAMMA[key])
    for v, (box, widths) in variants.items():
        crop = im.crop(box)
        name = key + ("-" + v if v else "")
        manifest[name] = {"w": crop.width, "h": crop.height, "sizes": widths, "orig": orig}
        for w in widths:
            out = crop if w == crop.width else crop.resize((w, round(crop.height * w / crop.width)), Image.LANCZOS)
            out.save(os.path.join(OUT, f"{name}-{w}.webp"), "WEBP", quality=78, method=6)
            out.save(os.path.join(OUT, f"{name}-{w}.jpg"), "JPEG", quality=80, optimize=True, progressive=True)
            print(f"{name}-{w}", out.size,
                  os.path.getsize(os.path.join(OUT, f"{name}-{w}.webp")) // 1024, "KB webp,",
                  os.path.getsize(os.path.join(OUT, f"{name}-{w}.jpg")) // 1024, "KB jpg")
json.dump(manifest, open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "data", "photos.json"), "w"), indent=1)
