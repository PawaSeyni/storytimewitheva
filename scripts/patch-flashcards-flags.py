# Step 3 of the flashcard patch (after relabel + icons): replaces the failed
# flag-emoji placeholders (the small double squares before each ES/FR word)
# with drawn flags (ES red/yellow/red, FR blue/white/red). Detects markers,
# covers with the local card color, draws the flag. Out -> public/bilingual-flashcards.pdf.
# -*- coding: utf-8 -*-
import fitz, numpy as np
from PIL import Image
from collections import deque, defaultdict
SRC='/tmp/flash_final.pdf'; OUT='/tmp/flash_final2.pdf'
ES_RED=(0.78,0.06,0.18); ES_YEL=(1.0,0.79,0.0)
FR_BLU=(0.0,0.21,0.65); FR_WHT=(1,1,1); FR_RED=(0.94,0.26,0.21)
BORD=(0.55,0.55,0.58)
d=fitz.open(SRC)
def detect(pno):
    S=2; d[pno].get_pixmap(matrix=fitz.Matrix(S,S)).save('/tmp/fl/_dd.png')
    im=Image.open('/tmp/fl/_dd.png').convert('RGB'); a=np.asarray(im)
    dark=(a[:,:,0]<55)&(a[:,:,1]<60)&(a[:,:,2]<70); H,W=dark.shape; seen=np.zeros_like(dark,bool); boxes=[]
    for y in range(H):
      for x in range(W):
        if dark[y,x] and not seen[y,x]:
          q=deque([(y,x)]); seen[y,x]=1; xs=[x];ys=[y]
          while q:
            cy,cx=q.popleft()
            for dy,dx in((1,0),(-1,0),(0,1),(0,-1),(1,1),(1,-1),(-1,1),(-1,-1)):
              ny,nx=cy+dy,cx+dx
              if 0<=ny<H and 0<=nx<W and dark[ny,nx] and not seen[ny,nx]: seen[ny,nx]=1;q.append((ny,nx));xs.append(nx);ys.append(ny)
          x0,x1,y0,y1=min(xs),max(xs),min(ys),max(ys); w,h=x1-x0+1,y1-y0+1
          if 14<=w<=34 and 10<=h<=26 and len(xs)/(w*h)>0.7: boxes.append((x0/S,y0/S,x1/S,y1/S))
    boxes.sort(key=lambda b:(round(b[1]/6),b[0])); markers=[]; used=[False]*len(boxes)
    for i,b in enumerate(boxes):
      if used[i]:continue
      grp=[b];used[i]=True
      for j in range(i+1,len(boxes)):
        if used[j]:continue
        c=boxes[j]
        if abs(c[1]-b[1])<4 and (c[0]-grp[-1][2])<10: grp.append(c);used[j]=True
      markers.append([min(g[0] for g in grp),min(g[1] for g in grp),max(g[2] for g in grp),max(g[3] for g in grp)])
    return im,markers
def es_flag(pg,X0,Y0,X1,Y1):
    h=Y1-Y0
    pg.draw_rect(fitz.Rect(X0,Y0,X1,Y0+h*0.25),color=None,fill=ES_RED,width=0)
    pg.draw_rect(fitz.Rect(X0,Y0+h*0.25,X1,Y0+h*0.75),color=None,fill=ES_YEL,width=0)
    pg.draw_rect(fitz.Rect(X0,Y0+h*0.75,X1,Y1),color=None,fill=ES_RED,width=0)
    pg.draw_rect(fitz.Rect(X0,Y0,X1,Y1),color=BORD,width=0.5)
def fr_flag(pg,X0,Y0,X1,Y1):
    w=X1-X0
    pg.draw_rect(fitz.Rect(X0,Y0,X0+w/3,Y1),color=None,fill=FR_BLU,width=0)
    pg.draw_rect(fitz.Rect(X0+w/3,Y0,X0+2*w/3,Y1),color=None,fill=FR_WHT,width=0)
    pg.draw_rect(fitz.Rect(X0+2*w/3,Y0,X1,Y1),color=None,fill=FR_RED,width=0)
    pg.draw_rect(fitz.Rect(X0,Y0,X1,Y1),color=BORD,width=0.5)
for pno in [3,4,6,7,9,11]:
    im,markers=detect(pno); pg=d[pno]
    cells=defaultdict(list)
    for m in markers:
        cx=(m[0]+m[2])/2; cy=(m[1]+m[3])/2
        cells[(0 if cy<300 else 1, 0 if cx<200 else (1 if cx<400 else 2))].append(m)
    for cl,ms in cells.items():
        ms.sort(key=lambda m:m[1])
        for idx,m in enumerate(ms):
            x0,y0,x1,y1=m
            sx=int(((x0+x1)/2)*2); sy=int((y0-6)*2); r,g,b=im.getpixel((min(sx,im.size[0]-1),max(sy,0)))
            pg.draw_rect(fitz.Rect(x0-2,y0-3,x1+2,y1+3),color=(r/255,g/255,b/255),fill=(r/255,g/255,b/255),width=0)
            cyc=(y0+y1)/2; FW=17; FH=11; fx0=x0
            R=(fx0,cyc-FH/2,fx0+FW,cyc+FH/2)
            (es_flag if idx==0 else fr_flag)(pg,*R)
d.save(OUT,garbage=4,deflate=True)
import os; print('saved',os.path.getsize(OUT)//1024,'KB')
o=fitz.open(OUT)
for p in [3,9]: o[p].get_pixmap(matrix=fitz.Matrix(2.2,2.2)).save(f'/tmp/fl/ff_p{p+1}.png')
