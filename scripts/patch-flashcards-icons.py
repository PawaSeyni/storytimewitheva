# Step 2 of the flashcard patch (run after scripts/patch-flashcards.py):
# fills the blank icon squares — emoji for animals + star/heart (Apple Color
# Emoji), color circles for colors, N dots for numbers, drawn shapes for
# circle/square/triangle. Output -> public/bilingual-flashcards.pdf.
# -*- coding: utf-8 -*-
import fitz
SRC='/tmp/flash_fixed.pdf'; OUT='/tmp/flash_final.pdf'
PURPLE=(0x6d/255,0x28/255,0xd8/255); GRAYBD=(0.62,0.62,0.66)
C=[(108,129),(306,129),(504,129),(108,381),(306,381),(504,381)]  # 1-square grid centers
COLORS={'red':(0.86,0.15,0.15),'orange':(0.95,0.55,0.13),'yellow':(0.97,0.82,0.10),
 'black':(0.12,0.12,0.14),'white':(1,1,1),'brown':(0.55,0.35,0.18),'green':(0.16,0.66,0.33),
 'blue':(0.18,0.40,0.85),'purple':(0.55,0.30,0.78),'pink':(0.96,0.55,0.74)}
PAGES={
 3:[('e','dog'),('e','cat'),('e','bird'),('e','fish'),('e','elephant'),('e','lion')],
 4:[('e','frog'),('e','rabbit'),('e','butterfly'),('e','turtle')],
 6:[('c','red'),('c','orange'),('c','yellow'),('c','green'),('c','blue'),('c','purple')],
 7:[('c','black'),('c','white'),('c','brown'),('c','pink')],
 11:[('s','circle'),('s','square'),('s','triangle'),('e','star'),('e','heart')],
}
# number cards: combined 2-square region centers + count
NUMS=[(120,128,1),(318,128,2),(516,128,3),(120,380,4),(318,380,5)]
d=fitz.open(SRC)
def tile(pg,x0,y0,x1,y1): pg.draw_rect(fitz.Rect(x0,y0,x1,y1), color=GRAYBD, fill=(1,1,1), width=0.7)
for pno,cards in PAGES.items():
    pg=d[pno]
    for i,(k,v) in enumerate(cards):
        cx,cy=C[i]
        if k=='e':
            tile(pg,cx-18,cy-18,cx+18,cy+18); pg.insert_image(fitz.Rect(cx-16,cy-16,cx+16,cy+16),filename=f'/tmp/emoji/{v}.png',keep_proportion=True)
        elif k=='c':
            tile(pg,cx-18,cy-18,cx+18,cy+18); col=COLORS[v]; bd=GRAYBD if v in ('white','yellow') else col
            pg.draw_circle((cx,cy),12,color=bd,fill=col,width=1)
        elif k=='s':
            tile(pg,cx-18,cy-18,cx+18,cy+18)
            if v=='circle': pg.draw_circle((cx,cy),11,color=PURPLE,fill=PURPLE,width=0)
            elif v=='square': pg.draw_rect(fitz.Rect(cx-10,cy-10,cx+10,cy+10),color=PURPLE,fill=PURPLE,width=0)
            elif v=='triangle': pg.draw_polyline([(cx,cy-12),(cx-12,cy+9),(cx+12,cy+9),(cx,cy-12)],color=PURPLE,fill=PURPLE,width=0,closePath=True)
# numbers page
npg=d[9]
for cx,cy,n in NUMS:
    tile(npg,cx-34,cy-16,cx+34,cy+16)            # wide white strip covering the 2 squares
    step=13; x0=cx-(n-1)*step/2
    for j in range(n): npg.draw_circle((x0+j*step,cy),3.6,color=PURPLE,fill=PURPLE,width=0)
d.save(OUT, garbage=4, deflate=True)
import os; print('saved',os.path.getsize(OUT)//1024,'KB')
o=fitz.open(OUT)
for p in [3,4,6,7,9,11]: o[p].get_pixmap(matrix=fitz.Matrix(1.5,1.5)).save(f'/tmp/fl/fin_p{p+1}.png')
