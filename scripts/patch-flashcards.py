# Relabels the owner-supplied flashcard set "Bilingual" -> "Trilingual"
# (the content is already EN/ES/FR). The PDF is image-based, so the word is
# covered (matching navy/purple) and re-rendered (Vera-Bold) on the cover +
# the 6 card-page headers. Output -> public/bilingual-flashcards.pdf.
# -*- coding: utf-8 -*-
import fitz
SRC='Bilingual_Flashcard_Set_Optimized.pdf'; OUT='/tmp/flash_fixed.pdf'
VERA='/Library/Frameworks/Python.framework/Versions/3.14/lib/python3.14/site-packages/reportlab/fonts/VeraBd.ttf'
VF=fitz.Font(fontfile=VERA)
NAVY=(0x1b/255,0x2c/255,0x57/255); PURPLE=(0x73/255,0x2b/255,0xee/255)
WHITE=(1,1,1); LAV=(0.80,0.84,0.93)
def box(pg,r,col): pg.draw_rect(fitz.Rect(*r), color=col, fill=col, width=0)
d=fitz.open(SRC)

# cover p1
p1=d[0]
box(p1,(116,557,496,598),NAVY)
ttl="Trilingual Flashcard Set"; ts=24
p1.insert_text((306-VF.text_length(ttl,ts)/2, 590), ttl, fontsize=ts, fontname='vera', fontfile=VERA, color=WHITE)
box(p1,(100,601,512,627),NAVY)
sub="Set de Tarjetas Trilingüe   |   Jeu de Cartes Trilingue"; ss=13
p1.insert_text((306-VF.text_length(sub,ss)/2, 620), sub, fontsize=ss, fontname='vera', fontfile=VERA, color=LAV)

# card-page headers
hdr="Story Time with Eva   —   Trilingual Flashcard Set"; hs=13.0
for pno in [3,4,6,7,9,11]:
    pg=d[pno]
    box(pg,(16,13,436,47),PURPLE)
    pg.insert_text((51, 34), hdr, fontsize=hs, fontname='vera', fontfile=VERA, color=WHITE)

d.save(OUT, garbage=4, deflate=True)
import os; print('saved', os.path.getsize(OUT)//1024,'KB')
o=fitz.open(OUT)
o[0].get_pixmap(matrix=fitz.Matrix(2,2)).save('/tmp/fl/v_p1.png')
o[3].get_pixmap(matrix=fitz.Matrix(2,2)).save('/tmp/fl/v_p4.png')
