#!/usr/bin/env python3
"""400 px copies of the local book covers for small displays (cards, thumbnails).

  python3 scripts/make-cover-variants.py            # write missing or stale variants
  python3 scripts/make-cover-variants.py --check    # exit 1 if any cover lacks a fresh variant

public/covers/<name>.webp (700 x 700) -> public/covers/400/<name>.webp (400 x 400, WebP q78).
src/lib/covers.ts (sizedCover) serves the 400 px file for any requested width up to 400,
and BookCard offers both through srcset. Site audit 2026-11-18, finding 1 (SW-023).
"""
import os, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'public', 'covers')
OUT = os.path.join(SRC, '400')
SIZE, QUALITY = 400, 78

def main(check: bool) -> int:
    os.makedirs(OUT, exist_ok=True)
    stale = []
    for name in sorted(os.listdir(SRC)):
        if not name.endswith('.webp'):
            continue
        src, dst = os.path.join(SRC, name), os.path.join(OUT, name)
        if os.path.exists(dst) and os.path.getmtime(dst) >= os.path.getmtime(src):
            continue
        stale.append(name)
        if not check:
            with Image.open(src) as im:
                im.convert('RGB').resize((SIZE, SIZE), Image.LANCZOS).save(dst, 'WEBP', quality=QUALITY, method=6)
    extra = [n for n in os.listdir(OUT) if not os.path.exists(os.path.join(SRC, n))]
    if check:
        if stale or extra:
            print(f'cover variants: {len(stale)} missing or stale, {len(extra)} orphaned: {(stale + extra)[:5]}')
            return 1
        print('cover variants: all present')
        return 0
    for n in extra:
        os.remove(os.path.join(OUT, n))
    print(f'cover variants: wrote {len(stale)}, removed {len(extra)}')
    return 0

if __name__ == '__main__':
    sys.exit(main('--check' in sys.argv))
