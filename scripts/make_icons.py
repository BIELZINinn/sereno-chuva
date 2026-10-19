#!/usr/bin/env python3
from PIL import Image, ImageDraw
import math
import os

OUT = "/workspace/assets/icons"
os.makedirs(OUT, exist_ok=True)

BG = (7, 11, 18, 255)
ACCENT = (158, 199, 230, 255)
CLOUD = (186, 214, 232, 255)
DROP = (122, 168, 201, 230)
GOLD = (201, 184, 150, 255)


def lerp(a, b, t):
    return int(a + (b - a) * t)


def night_bg(size, round_mask=False, radius=None):
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    px = img.load()
    cx, cy = size / 2, size / 2
    for y in range(size):
        for x in range(size):
            dx = (x - cx) / size
            dy = (y - cy) / size
            r = math.sqrt(dx * dx + dy * dy)
            t = min(1.0, r * 1.35)
            col = (
                lerp(21, 7, t),
                lerp(32, 11, t),
                lerp(51, 18, t),
                255,
            )
            px[x, y] = col
    if round_mask:
        mask = Image.new("L", (size, size), 0)
        d = ImageDraw.Draw(mask)
        rr = radius if radius is not None else int(size * 0.22)
        d.rounded_rectangle((0, 0, size - 1, size - 1), radius=rr, fill=255)
        out = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        out.paste(img, (0, 0), mask)
        return out
    return img


def draw_mark(draw, size, pad=0.16):
    s = size
    left = s * pad
    right = s * (1 - pad)
    top = s * 0.30
    # cloud
    cy = s * 0.46
    r1 = s * 0.13
    r2 = s * 0.16
    r3 = s * 0.11
    draw.ellipse((left + s * 0.08, cy - r1, left + s * 0.08 + r1 * 2, cy + r1), fill=CLOUD)
    draw.ellipse((s * 0.34, cy - r2 - s * 0.04, s * 0.34 + r2 * 2, cy + r2 - s * 0.04), fill=CLOUD)
    draw.ellipse((right - r3 * 2 - s * 0.06, cy - r3, right - s * 0.06, cy + r3), fill=CLOUD)
    draw.rounded_rectangle((left + s * 0.06, cy, right - s * 0.06, cy + s * 0.16), radius=s * 0.08, fill=CLOUD)
    # rain drops
    drops = [
        (s * 0.34, s * 0.70, s * 0.08),
        (s * 0.50, s * 0.76, s * 0.10),
        (s * 0.66, s * 0.70, s * 0.08),
    ]
    for x, y, h in drops:
        w = h * 0.42
        draw.ellipse((x - w, y, x + w, y + h), fill=DROP)
        draw.polygon([(x, y - h * 0.55), (x - w, y + h * 0.2), (x + w, y + h * 0.2)], fill=DROP)
    # small moon
    mx, my, mr = s * 0.74, s * 0.28, s * 0.08
    draw.ellipse((mx - mr, my - mr, mx + mr, my + mr), fill=GOLD)
    draw.ellipse((mx - mr * 0.25, my - mr * 1.05, mx + mr * 1.35, my + mr * 0.55), fill=(12, 20, 34, 255))


def save_icon(size, path, rounded=True):
    img = night_bg(size, round_mask=rounded, radius=int(size * 0.22))
    draw = ImageDraw.Draw(img)
    draw_mark(draw, size)
    img.save(path, "PNG")
    return path


def save_maskable(size, path):
    img = night_bg(size, round_mask=False)
    draw = ImageDraw.Draw(img)
    draw_mark(draw, size, pad=0.22)
    img.save(path, "PNG")


def save_splash(w, h, path):
    img = Image.new("RGBA", (w, h), BG)
    px = img.load()
    cx, cy = w / 2, h * 0.38
    for y in range(h):
        for x in range(w):
            dx = (x - cx) / w
            dy = (y - cy) / h
            r = math.sqrt(dx * dx * 1.4 + dy * dy)
            t = min(1.0, r * 1.1)
            px[x, y] = (
                lerp(18, 7, t),
                lerp(28, 11, t),
                lerp(44, 18, t),
                255,
            )
    mark = night_bg(512, round_mask=True, radius=118)
    d = ImageDraw.Draw(mark)
    draw_mark(d, 512)
    ms = int(min(w, h) * 0.28)
    mark = mark.resize((ms, ms), Image.Resampling.LANCZOS)
    img.paste(mark, ((w - ms) // 2, int(h * 0.32) - ms // 2), mark)
    img.save(path, "PNG")


def save_feature(w, h, path):
    img = Image.new("RGBA", (w, h), BG)
    px = img.load()
    for y in range(h):
        for x in range(w):
            t = y / h
            px[x, y] = (lerp(16, 7, t), lerp(26, 11, t), lerp(42, 18, t), 255)
    mark = night_bg(512, round_mask=True, radius=118)
    d = ImageDraw.Draw(mark)
    draw_mark(d, 512)
    ms = min(h - 80, 420)
    mark = mark.resize((ms, ms), Image.Resampling.LANCZOS)
    img.paste(mark, (80, (h - ms) // 2), mark)
    img.save(path, "PNG")


sizes = [48, 72, 96, 128, 144, 152, 180, 192, 256, 384, 512]
for s in sizes:
    save_icon(s, f"{OUT}/icon-{s}.png", rounded=True)

save_icon(1024, f"{OUT}/icon-1024.png", rounded=True)
save_maskable(512, f"{OUT}/maskable-512.png")
save_icon(192, f"{OUT}/apple-touch-icon.png", rounded=True)
save_icon(180, f"{OUT}/apple-touch-icon-180.png", rounded=True)

# Android mipmap
mip = {
    "mdpi": 48,
    "hdpi": 72,
    "xhdpi": 96,
    "xxhdpi": 144,
    "xxxhdpi": 192,
}
and_dir = "/workspace/assets/android"
os.makedirs(and_dir, exist_ok=True)
for dens, s in mip.items():
    save_icon(s, f"{and_dir}/ic_launcher-{dens}.png", rounded=True)
    save_maskable(s, f"{and_dir}/ic_launcher_foreground-{dens}.png")

save_splash(1080, 1920, "/workspace/assets/splash-1080x1920.png")
save_splash(1242, 2688, "/workspace/assets/splash-1242x2688.png")
save_feature(1024, 500, "/workspace/assets/feature-graphic.png")
print("ok")
