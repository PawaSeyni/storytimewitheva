#!/usr/bin/env python3
"""
Generate 4 email hero banners (600x300, 2x retina = 1200x600 PNG) for the
Story Time with Eva welcome automation. Flat-illustration style with warm
gradients, simple shapes, and bold typography. No emoji (no color-emoji font
in this sandbox) — using geometric/illustration primitives instead.
"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import math
import os

OUT_DIR = "/sessions/jolly-kind-hawking/mnt/Eva/storytimewitheva/email-drafts/banners"
os.makedirs(OUT_DIR, exist_ok=True)

# Retina 2x — 1200x600 then downscale label is up to MailerLite. Most clients
# render at ~600 wide; 2x source means it stays crisp on retina devices.
W, H = 1200, 600

POPPINS_BOLD = "/usr/share/fonts/truetype/google-fonts/Poppins-Bold.ttf"
POPPINS_MED = "/usr/share/fonts/truetype/google-fonts/Poppins-Medium.ttf"
LATO_MED = "/usr/share/fonts/truetype/lato/Lato-Medium.ttf"


def vgradient(size, top, bottom):
    """Vertical gradient image."""
    w, h = size
    base = Image.new("RGB", (1, h))
    for y in range(h):
        t = y / (h - 1)
        r = int(top[0] * (1 - t) + bottom[0] * t)
        g = int(top[1] * (1 - t) + bottom[1] * t)
        b = int(top[2] * (1 - t) + bottom[2] * t)
        base.putpixel((0, y), (r, g, b))
    return base.resize((w, h))


def text_centered_block(draw, lines, fonts, colors, cx, cy, line_gap=18):
    """Draw a stack of centered lines around (cx, cy). lines/fonts/colors zip together."""
    measured = []
    total_h = 0
    for txt, font in zip(lines, fonts):
        bbox = draw.textbbox((0, 0), txt, font=font)
        h = bbox[3] - bbox[1]
        measured.append((bbox, h))
        total_h += h
    total_h += line_gap * (len(lines) - 1)
    y = cy - total_h / 2
    for (txt, font, color), (bbox, h) in zip(zip(lines, fonts, colors), measured):
        tw = bbox[2] - bbox[0]
        draw.text((cx - tw / 2 - bbox[0], y - bbox[1]), txt, font=font, fill=color)
        y += h + line_gap


def draw_star(draw, cx, cy, r, color, points=5):
    pts = []
    for i in range(points * 2):
        rr = r if i % 2 == 0 else r * 0.45
        a = -math.pi / 2 + i * math.pi / points
        pts.append((cx + rr * math.cos(a), cy + rr * math.sin(a)))
    draw.polygon(pts, fill=color)


def add_sparkles(im, points, color="white"):
    """Add small drawn sparkles/dots — decorative."""
    d = ImageDraw.Draw(im, "RGBA")
    for x, y, r in points:
        d.ellipse([x - r, y - r, x + r, y + r], fill=color)


# ---------- Email 1: Welcome + Starter Kit ----------
def banner_1_welcome():
    # Warm sunrise: gold -> coral -> pink
    bg = vgradient((W, H), (255, 213, 130), (255, 138, 162))
    d = ImageDraw.Draw(bg, "RGBA")

    # Soft glow circle behind gift box
    glow_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow_layer)
    gd.ellipse([280, 130, 580, 430], fill=(255, 255, 255, 70))
    glow_layer = glow_layer.filter(ImageFilter.GaussianBlur(60))
    bg = Image.alpha_composite(bg.convert("RGBA"), glow_layer)
    d = ImageDraw.Draw(bg, "RGBA")

    # Gift box (left of center)
    box_cx, box_cy = 430, 300
    box_w, box_h = 220, 180
    # Box bottom
    d.rectangle([box_cx - box_w/2, box_cy - box_h/2 + 30, box_cx + box_w/2, box_cy + box_h/2], fill=(125, 70, 175))
    # Box lid
    d.rectangle([box_cx - box_w/2 - 10, box_cy - box_h/2 + 10, box_cx + box_w/2 + 10, box_cy - box_h/2 + 60], fill=(95, 50, 150))
    # Vertical ribbon
    d.rectangle([box_cx - 18, box_cy - box_h/2 + 10, box_cx + 18, box_cy + box_h/2], fill=(255, 220, 100))
    # Horizontal ribbon
    d.rectangle([box_cx - box_w/2 - 10, box_cy - box_h/2 + 28, box_cx + box_w/2 + 10, box_cy - box_h/2 + 50], fill=(255, 220, 100))
    # Bow loops
    d.ellipse([box_cx - 50, box_cy - box_h/2 - 25, box_cx - 4, box_cy - box_h/2 + 22], fill=(255, 220, 100))
    d.ellipse([box_cx + 4, box_cy - box_h/2 - 25, box_cx + 50, box_cy - box_h/2 + 22], fill=(255, 220, 100))
    d.ellipse([box_cx - 12, box_cy - box_h/2 - 12, box_cx + 12, box_cy - box_h/2 + 12], fill=(245, 200, 80))

    # Sparkles around the gift
    add_sparkles(bg, [(310, 180, 6), (350, 240, 4), (570, 200, 5), (600, 290, 7),
                       (290, 350, 4), (620, 380, 5), (700, 160, 6)], color=(255, 255, 255, 240))

    # Tiny stars
    draw_star(d, 250, 230, 14, (255, 255, 255, 200))
    draw_star(d, 660, 130, 10, (255, 255, 255, 180))
    draw_star(d, 660, 450, 12, (255, 235, 150, 220))

    # Text on the right
    font_h1 = ImageFont.truetype(POPPINS_BOLD, 64)
    font_h2 = ImageFont.truetype(POPPINS_MED, 32)
    font_body = ImageFont.truetype(LATO_MED, 26)
    d2 = ImageDraw.Draw(bg)
    # Wordmark + title block (right of gift box)
    d2.text((730, 175), "Welcome!", font=font_h1, fill=(60, 25, 80))
    d2.text((730, 260), "Your Bilingual", font=font_h2, fill=(90, 40, 120))
    d2.text((730, 305), "Starter Kit", font=font_h2, fill=(90, 40, 120))
    d2.text((730, 365), "Story Time with Eva", font=font_body, fill=(120, 60, 140))

    return bg.convert("RGB")


# ---------- Email 2: Make bilingual reading stick ----------
def banner_2_reading():
    bg = vgradient((W, H), (210, 165, 230), (255, 190, 200))
    d = ImageDraw.Draw(bg, "RGBA")

    # Open book (left-center)
    book_cx, book_cy = 380, 330
    # Pages (left & right) as two trapezoids meeting at spine
    page_color = (255, 250, 235)
    page_shadow = (240, 230, 215)
    # Left page
    d.polygon([(book_cx - 200, book_cy - 100), (book_cx, book_cy - 90),
               (book_cx, book_cy + 120), (book_cx - 200, book_cy + 100)],
              fill=page_color, outline=(160, 130, 100), width=3)
    # Right page
    d.polygon([(book_cx, book_cy - 90), (book_cx + 200, book_cy - 100),
               (book_cx + 200, book_cy + 100), (book_cx, book_cy + 120)],
              fill=page_color, outline=(160, 130, 100), width=3)
    # Spine shadow
    d.line([(book_cx, book_cy - 90), (book_cx, book_cy + 120)], fill=(170, 140, 110), width=4)

    # Text lines on pages
    line_color = (200, 170, 140)
    for i in range(5):
        y = book_cy - 60 + i * 22
        # left page lines (shorter, varying)
        d.line([(book_cx - 175, y), (book_cx - 30, y)], fill=line_color, width=3)
        # right page lines
        d.line([(book_cx + 30, y), (book_cx + 175 - (i % 2) * 30, y)], fill=line_color, width=3)

    # Glowing lamp light behind book (cozy)
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([180, 100, 580, 500], fill=(255, 240, 200, 100))
    glow = glow.filter(ImageFilter.GaussianBlur(80))
    bg = Image.alpha_composite(bg.convert("RGBA"), glow)

    # Composite the book back on top of the glow
    book_layer = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    bd = ImageDraw.Draw(book_layer)
    bd.polygon([(book_cx - 200, book_cy - 100), (book_cx, book_cy - 90),
                (book_cx, book_cy + 120), (book_cx - 200, book_cy + 100)],
               fill=page_color, outline=(160, 130, 100), width=3)
    bd.polygon([(book_cx, book_cy - 90), (book_cx + 200, book_cy - 100),
                (book_cx + 200, book_cy + 100), (book_cx, book_cy + 120)],
               fill=page_color, outline=(160, 130, 100), width=3)
    bd.line([(book_cx, book_cy - 90), (book_cx, book_cy + 120)], fill=(170, 140, 110), width=4)
    for i in range(5):
        y = book_cy - 60 + i * 22
        bd.line([(book_cx - 175, y), (book_cx - 30, y)], fill=line_color, width=3)
        bd.line([(book_cx + 30, y), (book_cx + 175 - (i % 2) * 30, y)], fill=line_color, width=3)
    bg = Image.alpha_composite(bg, book_layer)

    # Text on the right
    d2 = ImageDraw.Draw(bg)
    font_h1 = ImageFont.truetype(POPPINS_BOLD, 60)
    font_h2 = ImageFont.truetype(POPPINS_MED, 28)
    font_sub = ImageFont.truetype(LATO_MED, 24)
    d2.text((660, 195), "Make reading", font=font_h1, fill=(70, 30, 95))
    d2.text((660, 260), "stick.", font=font_h1, fill=(155, 60, 110))
    d2.text((660, 350), "A bilingual reading", font=font_h2, fill=(100, 50, 130))
    d2.text((660, 388), "guide for parents", font=font_h2, fill=(100, 50, 130))

    return bg.convert("RGB")


# ---------- Email 3: Printable bilingual flashcards ----------
def banner_3_flashcards():
    bg = vgradient((W, H), (255, 240, 220), (255, 200, 175))
    d = ImageDraw.Draw(bg, "RGBA")

    # 4 overlapping flashcards
    # Each card has a colored top half + label area
    cards = [
        # (x, y, rotation_deg, top_color, label1, label2)
        (250, 250, -12, (255, 180, 95), "SUN", "SOL"),
        (430, 270, -3, (140, 200, 230), "CAT", "GATO"),
        (610, 250, 8, (180, 220, 130), "STAR", "ESTRELLA"),
        (790, 280, 15, (230, 165, 215), "TREE", "ÁRBOL"),
    ]
    font_word = ImageFont.truetype(POPPINS_BOLD, 30)
    font_word_es = ImageFont.truetype(LATO_MED, 22)

    for cx, cy, rot, top_col, w1, w2 in cards:
        card = Image.new("RGBA", (220, 280), (0, 0, 0, 0))
        cd = ImageDraw.Draw(card)
        # Card body (white) with rounded corners (simulated via ellipse on corners)
        cd.rounded_rectangle([10, 10, 210, 270], radius=20, fill=(255, 255, 255), outline=(220, 195, 175), width=3)
        # Top color band
        cd.rounded_rectangle([20, 20, 200, 150], radius=12, fill=top_col)
        # Simple "illustration" dot inside the band — abstract symbol
        cd.ellipse([85, 50, 135, 100], fill=(255, 255, 255, 220))
        # Words below
        bbox = cd.textbbox((0, 0), w1, font=font_word)
        cd.text(((220 - (bbox[2] - bbox[0])) / 2 - bbox[0], 170 - bbox[1]), w1, font=font_word, fill=(60, 50, 70))
        bbox = cd.textbbox((0, 0), w2, font=font_word_es)
        cd.text(((220 - (bbox[2] - bbox[0])) / 2 - bbox[0], 215 - bbox[1]), w2, font=font_word_es, fill=(140, 120, 150))
        # Rotate and paste
        card_rot = card.rotate(rot, resample=Image.BICUBIC, expand=True)
        rw, rh = card_rot.size
        bg.paste(card_rot, (int(cx - rw / 2), int(cy - rh / 2)), card_rot)

    # Bottom title strip
    d2 = ImageDraw.Draw(bg)
    font_h1 = ImageFont.truetype(POPPINS_BOLD, 54)
    font_sub = ImageFont.truetype(LATO_MED, 26)
    # Centered title at bottom
    title = "Printable Bilingual Flashcards"
    bbox = d2.textbbox((0, 0), title, font=font_h1)
    tw = bbox[2] - bbox[0]
    d2.text(((W - tw) / 2 - bbox[0], 470), title, font=font_h1, fill=(80, 35, 25))
    sub = "Everyday words · EN / ES · Print, cut, play"
    bbox = d2.textbbox((0, 0), sub, font=font_sub)
    tw = bbox[2] - bbox[0]
    d2.text(((W - tw) / 2 - bbox[0], 538), sub, font=font_sub, fill=(150, 90, 70))

    return bg.convert("RGB")


# ---------- Email 4: Calmer bedtimes / moon ----------
def banner_4_bedtime():
    # Deep night gradient: indigo → purple → soft pink at horizon
    bg = vgradient((W, H), (30, 35, 85), (95, 60, 130))
    d = ImageDraw.Draw(bg, "RGBA")

    # Stars (scattered)
    star_dots = [
        (120, 80, 3), (200, 130, 2), (280, 90, 3), (370, 60, 2),
        (450, 110, 3), (520, 80, 2), (600, 130, 3), (680, 80, 2),
        (760, 100, 3), (850, 60, 4), (940, 120, 2), (1020, 90, 3),
        (1100, 60, 2), (1130, 140, 3), (90, 200, 2), (200, 240, 3),
        (110, 320, 2), (180, 380, 3), (90, 450, 4), (1090, 250, 3),
        (1130, 350, 2), (1060, 420, 3), (1130, 480, 2),
    ]
    add_sparkles(bg, star_dots, color=(255, 245, 220, 235))

    # 4-pointed sparkle stars (bigger)
    for cx, cy, r in [(330, 180, 8), (770, 200, 10), (220, 460, 7), (970, 480, 8)]:
        d.polygon([(cx, cy - r), (cx + r/3, cy - r/3), (cx + r, cy), (cx + r/3, cy + r/3),
                   (cx, cy + r), (cx - r/3, cy + r/3), (cx - r, cy), (cx - r/3, cy - r/3)],
                  fill=(255, 240, 200, 230))

    # Crescent moon (large, slightly left of center)
    moon_cx, moon_cy = 450, 300
    moon_r = 130
    # Moon glow
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([moon_cx - 200, moon_cy - 200, moon_cx + 200, moon_cy + 200],
               fill=(255, 235, 180, 90))
    glow = glow.filter(ImageFilter.GaussianBlur(60))
    bg = Image.alpha_composite(bg.convert("RGBA"), glow)
    d = ImageDraw.Draw(bg, "RGBA")

    # Full moon disc (cream)
    d.ellipse([moon_cx - moon_r, moon_cy - moon_r, moon_cx + moon_r, moon_cy + moon_r],
              fill=(255, 235, 195))
    # Carve out crescent — overlap with bg-colored disc shifted right
    # We'll instead drop a darker disc on top, shifted right, to create crescent
    d.ellipse([moon_cx - moon_r + 50, moon_cy - moon_r, moon_cx + moon_r + 50, moon_cy + moon_r],
              fill=(60, 50, 100))

    # Cloud (subtle, near bottom)
    cloud_color = (200, 180, 220, 180)
    for cx, cy, r in [(120, 520, 30), (160, 510, 40), (210, 520, 30)]:
        d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=cloud_color)

    # Text on right
    d2 = ImageDraw.Draw(bg)
    font_h1 = ImageFont.truetype(POPPINS_BOLD, 60)
    font_h2 = ImageFont.truetype(POPPINS_MED, 32)
    font_sub = ImageFont.truetype(LATO_MED, 24)
    d2.text((680, 200), "Calmer", font=font_h1, fill=(255, 245, 220))
    d2.text((680, 265), "bedtimes.", font=font_h1, fill=(255, 200, 180))
    d2.text((680, 360), "A 5-step printable", font=font_h2, fill=(240, 220, 235))
    d2.text((680, 405), "routine chart", font=font_h2, fill=(240, 220, 235))

    return bg.convert("RGB")


# ---------- Generate and save ----------
banners = [
    ("email-1-welcome-starter-kit.png", banner_1_welcome),
    ("email-2-reading-habits.png", banner_2_reading),
    ("email-3-flashcards.png", banner_3_flashcards),
    ("email-4-bedtime-routine.png", banner_4_bedtime),
]

for filename, fn in banners:
    img = fn()
    # Also save a 600x300 display-size version
    path_2x = os.path.join(OUT_DIR, filename)
    img.save(path_2x, "PNG", optimize=True)
    img.resize((600, 300), Image.LANCZOS).save(
        os.path.join(OUT_DIR, filename.replace(".png", "-600x300.png")), "PNG", optimize=True
    )
    print(f"✓ {filename} ({W}×{H} + 600×300 versions)")

print(f"\nAll 4 banners saved to: {OUT_DIR}")
