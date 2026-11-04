"""Recolor ONLY the illuminated plinth to the portfolio's violet identity.
The real app screenshots and metallic iPhone bodies remain pixel-identical.
Run once in GitHub Actions to save actual optimized WebP assets in the repo.
"""
from pathlib import Path
import numpy as np
from PIL import Image

ROOT = Path("public/projects")
PROJECTS = ("stopou", "ritimo", "rotina", "karoane", "financas", "doe", "bruto")
for slug in PROJECTS:
    path = ROOT / slug / "desktop-stage.webp"
    im = Image.open(path).convert("RGBA")
    rgba = np.asarray(im).copy()
    hsv = np.asarray(Image.fromarray(rgba[:, :, :3], "RGB").convert("HSV")).copy()
    height, width = hsv.shape[:2]
    yy, xx = np.mgrid[:height, :width]
    sat = hsv[:, :, 1].astype(float)
    alpha = rgba[:, :, 3].astype(float)
    blend = (
        np.clip((yy - 519) / 25, 0, 1)
        * np.clip((627 - yy) / 19, 0, 1)
        * np.clip((xx - 52) / 16, 0, 1)
        * np.clip((640 - xx) / 16, 0, 1)
        * np.clip((sat - 25) / 90, 0, 1)
        * np.clip(alpha / 240, 0, 1)
    )
    old_hue = hsv[:, :, 0].astype(float)
    purple_hue = 197
    hue_delta = ((purple_hue - old_hue + 128) % 256) - 128
    hsv[:, :, 0] = np.uint8((old_hue + blend * hue_delta) % 256)
    hsv[:, :, 1] = np.uint8(
        np.clip(sat + blend * (np.maximum(sat, 145) - sat) * .25, 0, 255)
    )
    rgb = np.asarray(Image.fromarray(hsv, "HSV").convert("RGB"))
    out = Image.fromarray(np.dstack((rgb, rgba[:, :, 3])), "RGBA")
    out.save(path, format="WEBP", quality=93, method=6)
    print(f"{slug}: {path.stat().st_size} bytes")
