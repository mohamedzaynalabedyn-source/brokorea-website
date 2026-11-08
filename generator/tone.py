"""Modest tone correction: a midtone (gamma) lift only. No local edits, no colour changes."""
from PIL import Image
def lift(im, gamma):
    lut = [round(255 * ((i / 255) ** gamma)) for i in range(256)]
    return im.point(lut * 3)
# per-photo gamma (<1 lifts midtones/shadows, highlights stay put); 1.0 = untouched
GAMMA = {"truck-wide": 1.0, "warehouse-forklift": 0.94, "cartons-pallets": 0.86, "truck-portrait": 0.9, "warehouse-interior": 0.95}
