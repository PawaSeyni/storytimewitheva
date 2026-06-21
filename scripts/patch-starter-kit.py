# Patch applied to the owner-supplied trilingual Starter Kit PDF
# (Story_Time_with_Eva_Trilingual_Starter_Kit_EN_FR_ES_Optimized.pdf).
# Fixes: p13 callouts made EN/FR/ES; p15 + p17 overflowing text refit.
# Output -> public/bilingual-starter-kit.pdf. Uses reportlab VeraBd (DejaVu-like).
# -*- coding: utf-8 -*-
import fitz
SRC='Story_Time_with_Eva_Trilingual_Starter_Kit_EN_FR_ES_Optimized.pdf'
OUT='/tmp/kit_final.pdf'
VERA='/Library/Frameworks/Python.framework/Versions/3.14/lib/python3.14/site-packages/reportlab/fonts/VeraBd.ttf'
GREEN=(0x15/255,0x80/255,0x3d/255); BLACK=(0.10,0.10,0.12); DARK=(0x1f/255,0x29/255,0x37/255)
d=fitz.open(SRC)

# p13 trilingual callouts
p13=d[12]
labels=[
  (fitz.Rect(90,281,186,335),"nose","nez","nariz"),
  (fitz.Rect(426,226,526,297),"ears","oreilles","orejas"),
  (fitz.Rect(458,334,550,412),"tail","queue","cola"),
  (fitz.Rect(86,454,184,518),"paws","pattes","patas"),
]
for r,en,fr,es in labels:
    p13.draw_rect(r, color=BLACK, fill=(1,1,1), width=1.6, radius=0.28)
    th=3*11  # 3 lines approx
    top=r.y0+(r.height-th)/2
    p13.insert_textbox(fitz.Rect(r.x0, top, r.x1, r.y1), f"{en}\n{fr}\n{es}",
                       fontsize=9, fontname='vera', fontfile=VERA, color=DARK, align=fitz.TEXT_ALIGN_CENTER)

# p15 fit header
p15=d[14]
p15.add_redact_annot(fitz.Rect(48,605,568,627), fill=(1,1,1))
p15.add_redact_annot(fitz.Rect(572,603,615,629), fill=(1,1,1))
p15.apply_redactions()
p15.insert_textbox(fitz.Rect(48,606,564,628),
    'Now write the whole alphabet | Maintenant, écris tout l’alphabet | Ahora escribe todo el alfabeto',
    fontsize=9, fontname='vera', fontfile=VERA, color=GREEN, align=fitz.TEXT_ALIGN_CENTER)

# p17 fit tagline (3 centered lines)
p17=d[16]
p17.add_redact_annot(fitz.Rect(0,650,612,672), fill=(1,1,1))
p17.apply_redactions()
p17.insert_textbox(fitz.Rect(42,634,570,694),
    "Keep reading, every book is an adventure!\nContinue à lire, chaque livre est une aventure !\n¡Sigue leyendo, cada libro es una aventura!",
    fontsize=11, fontname='vera', fontfile=VERA, color=GREEN, align=fitz.TEXT_ALIGN_CENTER)

d.save(OUT, garbage=4, deflate=True)
import os; print('saved',OUT, os.path.getsize(OUT)//1024,'KB')
d2=fitz.open(OUT); d2[12].get_pixmap(matrix=fitz.Matrix(2,2)).save('/tmp/att/final_p13.png')
