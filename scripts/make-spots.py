#!/usr/bin/env python3
"""Spot illustrations for the Studio printables: a square crop of each book's English cover.

  python3 scripts/make-spots.py            # write public/spots/<book>.webp (300 x 300)
  python3 scripts/make-spots.py --sheet F  # also write a contact sheet to F for review

Boxes are (left, top, size) on the 700 px cover in public/covers/<book>-en.webp, chosen to show
the main character below the title. Re-run after a cover changes, and adjust a box if the crop
cuts the character or shows title lettering. Covers redesigned on KDP, crops redone 2026-11-27.
"""
import os, sys
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT = (180, 250, 340)  # below the title and subtitle, above the author badge
BOXES = {
    # book id: (left, top, size) — DEFAULT unless listed
    'fig-trees-secret': (450, 270, 250),   # the grandfather at the gate (the girl faces away)
    'russet-the-fox': (150, 330, 300),     # the fox
    'pawa-rainbow-cloud': (160, 245, 350), # Cirro and the sun
    'diegos-brave-leap': (165, 235, 360),
}

def books():
    return sorted(f[:-8] for f in os.listdir(os.path.join(ROOT, 'public', 'covers')) if f.endswith('-en.webp'))

def main():
    out = os.path.join(ROOT, 'public', 'spots'); os.makedirs(out, exist_ok=True)
    made = []
    for b in books():
        l, t, s = BOXES.get(b, DEFAULT)
        im = Image.open(os.path.join(ROOT, 'public', 'covers', f'{b}-en.webp')).convert('RGB')
        spot = im.crop((l, t, l + s, t + s)).resize((300, 300), Image.LANCZOS)
        spot.save(os.path.join(out, f'{b}.webp'), 'WEBP', quality=80, method=6)
        made.append((b, spot))
    if '--sheet' in sys.argv:
        cols = 5; rows = (len(made) + cols - 1) // cols
        sheet = Image.new('RGB', (cols * 160, rows * 176), 'white'); d = ImageDraw.Draw(sheet)
        for i, (b, sp) in enumerate(made):
            x, y = (i % cols) * 160, (i // cols) * 176
            sheet.paste(sp.resize((150, 150)), (x + 5, y + 20)); d.text((x + 5, y + 4), b[:24], fill='black')
        sheet.save(sys.argv[sys.argv.index('--sheet') + 1], quality=85)
    print(f'spots: wrote {len(made)}')

if __name__ == '__main__':
    main()
