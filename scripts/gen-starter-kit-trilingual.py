# -*- coding: utf-8 -*-
"""
Generate the Story Time with Eva TRILINGUAL Starter Kit (EN / ES / FR).

Rebuilt from the bilingual EN/ES "Optimized" PDF (ReportLab original, no source
script available) into a trilingual edition: French added to every title,
paragraph, card and vocab item, with fonts/spacing tightened to fit three
languages on the 612x612 page. Illustrations are reused from scripts/starter-kit-assets/.

Run:  python3 scripts/gen-starter-kit-trilingual.py
Out:  public/bilingual-starter-kit.pdf  (now trilingual; served to en/es/fr)
"""
import os
from reportlab.pdfgen import canvas
from reportlab.lib.utils import simpleSplit, ImageReader

HERE = os.path.dirname(os.path.abspath(__file__))
ASSETS = os.path.join(HERE, "starter-kit-assets")
OUT = os.path.join(HERE, "..", "public", "bilingual-starter-kit.pdf")
PAGE = 612.0

# Brand palette (sampled from the original)
PURPLE = (0x6d/255, 0x28/255, 0xd8/255)
DARK   = (0x1f/255, 0x28/255, 0x36/255)
BODY   = (0.22, 0.22, 0.27)
GRAY   = (0.45, 0.45, 0.52)
FOOT   = (0xf0/255, 0xf4/255, 0xf9/255)
EN_BG, EN_BD = (0xed/255, 0xeb/255, 0xf8/255), PURPLE
ES_BG, ES_BD = (0xfd/255, 0xf2/255, 0xf8/255), (0xdb/255, 0x27/255, 0x77/255)
FR_BG, FR_BD = (0xea/255, 0xfb/255, 0xf1/255), (0x0f/255, 0x99/255, 0x5e/255)
PINKBAR = (0xec/255, 0x48/255, 0x99/255)

def img(name): return ImageReader(os.path.join(ASSETS, name))

def footer(c, n):
    c.setFillColorRGB(*FOOT); c.rect(0, 0, PAGE, 30, fill=1, stroke=0)
    c.setFillColorRGB(*GRAY); c.setFont("Helvetica", 8)
    c.drawString(28, 11, "Story Time with Eva  |  storytimewitheva.com")
    c.drawRightString(PAGE-28, 11, f"Page {n}")

def header(c, title, h=70, size=21):
    c.setFillColorRGB(*PURPLE); c.rect(0, PAGE-h, PAGE, h, fill=1, stroke=0)
    c.setFillColorRGB(1, 1, 1)
    lines = simpleSplit(title, "Helvetica-Bold", size, PAGE-60)
    yy = PAGE - h/2 + (len(lines)-1)*size*0.6
    for ln in lines:
        c.setFont("Helvetica-Bold", size); c.drawCentredString(PAGE/2, yy-size*0.35, ln); yy -= size*1.15
    return PAGE - h - 26  # content top y

def wrapped(c, text, x, y, w, font="Helvetica", size=10.5, lead=None, color=BODY):
    lead = lead or size*1.32
    c.setFillColorRGB(*color); c.setFont(font, size)
    for ln in simpleSplit(text, font, size, w):
        c.drawString(x, y, ln); y -= lead
    return y

def star(c, cx, cy, r, color):
    import math
    pts=[]
    for i in range(10):
        ang = -math.pi/2 + i*math.pi/5
        rr = r if i%2==0 else r*0.42
        pts.append((cx+rr*math.cos(ang), cy+rr*math.sin(ang)))
    c.setFillColorRGB(*color)
    p=c.beginPath(); p.moveTo(*pts[0])
    for pt in pts[1:]: p.lineTo(*pt)
    p.close(); c.drawPath(p, fill=1, stroke=0)

def card(c, x, y, w, h, bg, bd, label, label_color, body, body_size=10):
    c.setFillColorRGB(*bg); c.setStrokeColorRGB(*bd); c.setLineWidth(1.2)
    c.roundRect(x, y-h, w, h, 8, fill=1, stroke=1)
    c.setFillColorRGB(*label_color); c.setFont("Helvetica-Bold", 9.5)
    c.drawString(x+12, y-17, label)
    wrapped(c, body, x+12, y-32, w-24, size=body_size, lead=body_size*1.3, color=BODY)

# ---------------------------------------------------------------- pages
def p1(c):
    c.drawImage(img("cover.jpg"), 106, 170, 400, 400, mask='auto')
    # title card
    c.setFillColorRGB(*PINKBAR); c.rect(0, 30, PAGE, 130, fill=1, stroke=0)
    c.setFillColorRGB(1,0.97,0.78); c.roundRect(60, 48, PAGE-120, 96, 10, fill=1, stroke=0)
    c.setFillColorRGB(*PURPLE); c.setFont("Helvetica-Bold", 24)
    c.drawCentredString(PAGE/2, 112, "Story Time with Eva")
    c.setFillColorRGB(*DARK); c.setFont("Helvetica-Bold", 12)
    c.drawCentredString(PAGE/2, 90, "Trilingual Starter Kit · Kit Trilingüe · Kit Trilingue")
    c.setFillColorRGB(*GRAY); c.setFont("Helvetica", 10)
    c.drawCentredString(PAGE/2, 70, "English · Español · Français   •   Ages 3-8   •   20 Pages")
    footer(c, 1)

def p2(c):
    y = header(c, "Welcome! / ¡Bienvenidos! / Bienvenue !")
    c.setFillColorRGB(*DARK); c.setFont("Helvetica-Bold", 14)
    c.drawString(50, y, "Dear Families / Estimadas Familias / Chères familles,"); y-=24
    y = wrapped(c, "Welcome to the Story Time with Eva Starter Kit! This 20-page kit is filled with fun activities, a mini story, and learning games designed to make reading magical for your child.", 50, y, PAGE-100, size=10.5); y-=6
    y = wrapped(c, "¡Bienvenidos al Kit de Inicio de Story Time with Eva! Este kit de 20 páginas está lleno de actividades divertidas, un mini cuento y juegos de aprendizaje para hacer que la lectura sea mágica para tu hijo.", 50, y, PAGE-100, size=10.5); y-=6
    y = wrapped(c, "Bienvenue dans le kit de démarrage de Story Time with Eva ! Ce kit de 20 pages est rempli d'activités amusantes, d'un mini-récit et de jeux d'apprentissage pour rendre la lecture magique pour votre enfant.", 50, y, PAGE-100, size=10.5); y-=16
    c.setFillColorRGB(*DARK); c.setFont("Helvetica-Bold", 14)
    c.drawString(50, y, "What's Inside / Qué Hay Adentro / Ce que contient le kit :"); y-=22
    items=[
        "First Words Visual Guide / Guía Visual de Primeras Palabras / Guide visuel des premiers mots",
        "Mini Story: Pawa's Big Day / Mini Cuento: El Gran Día de Pawa / Mini-récit : La grande journée de Pawa",
        "Coloring Page / Página para Colorear / Page à colorier",
        "Word Search / Sopa de Letras / Mots mêlés",
        "Trace the Letters / Traza las Letras / Trace les lettres",
        "Certificate of Completion / Certificado de Logro / Certificat de réussite",
    ]
    for it in items:
        c.setFillColorRGB(*PURPLE); c.rect(52, y-1, 7, 7, fill=1, stroke=0)
        wrapped(c, it, 68, y+4, PAGE-120, size=10); y-=22
    y-=6; c.setFillColorRGB(*DARK); c.setFont("Helvetica-Bold", 12)
    c.drawString(50, y, "With love / Con cariño / Avec amour, Eva Gallo")
    footer(c, 2)

def numbered(c, y, blocks):
    for i,(title,body) in enumerate(blocks,1):
        c.setFillColorRGB(*PURPLE); c.circle(64, y-6, 12, fill=1, stroke=0)
        c.setFillColorRGB(1,1,1); c.setFont("Helvetica-Bold", 12); c.drawCentredString(64, y-10, str(i))
        c.setFillColorRGB(*DARK); c.setFont("Helvetica-Bold", 12.5); c.drawString(86, y-4, title);
        yy = wrapped(c, body, 86, y-20, PAGE-140, size=9.8, lead=12.6)
        y = yy - 12
    return y

def p3(c):
    y = header(c, "How to Use This Kit / Cómo Usar Este Kit / Comment utiliser ce kit")
    numbered(c, y, [
        ("Read Together / Lean Juntos / Lisez ensemble",
         "Sit with your child and read each page together, pointing to pictures and words. / Siéntense con su hijo y lean cada página juntos, señalando las imágenes y las palabras. / Asseyez-vous avec votre enfant et lisez chaque page ensemble en montrant les images et les mots."),
        ("Say It Three Ways / Díganlo de Tres Maneras / Dites-le de trois façons",
         "For every word, say it in English, Spanish, and French. Make it a fun game! / Para cada palabra, díganla en inglés, español y francés. ¡Conviértanlo en un juego! / Pour chaque mot, dites-le en anglais, en espagnol et en français. Faites-en un jeu !"),
        ("Do the Activities / Hagan las Actividades / Faites les activités",
         "Work at your child's own pace. There is no rush, learning is the journey! / Trabajen al ritmo de su hijo. ¡No hay prisa, el aprendizaje es el camino! / Avancez au rythme de votre enfant. Rien ne presse, l'apprentissage est un voyage !"),
        ("Celebrate Progress / Celebren el Progreso / Célébrez les progrès",
         "Use the Certificate on page 18 to celebrate your child's achievement! / ¡Usen el Certificado en la página 18 para celebrar el logro de su hijo! / Utilisez le certificat à la page 18 pour célébrer la réussite de votre enfant !"),
    ])
    footer(c, 3)

def p4(c):
    y = header(c, "Meet the Characters / Conoce a los Personajes / Rencontre les personnages")
    img_h = 180; img_bottom = y - img_h
    c.drawImage(img("eva.jpg"), 350, img_bottom, 185, 185, mask='auto')
    # Pawa: heading + text in the left column, beside the image
    c.setFillColorRGB(*DARK); c.setFont("Helvetica-Bold", 13); c.drawString(50, y, "Pawa the Dog / Pawa el Perro / Pawa le chien")
    wrapped(c, "Pawa is a friendly, curious golden dog who LOVES books and adventures. He is brave, kind, and always ready to learn! / Pawa es un perro dorado amigable y curioso que AMA los libros y las aventuras. ¡Es valiente, amable y siempre listo para aprender! / Pawa est un chien doré, amical et curieux, qui ADORE les livres et les aventures. Il est courageux, gentil et toujours prêt à apprendre !", 50, y-18, 285, size=10, lead=13)
    # Eva: full width, BELOW the image so nothing overlaps
    ey = img_bottom - 22
    c.setFillColorRGB(*DARK); c.setFont("Helvetica-Bold", 13); c.drawString(50, ey, "Eva / Eva / Eva")
    wrapped(c, "Eva is a young author who believes every child deserves a magical story. She writes books in English, Spanish, and French to help children explore the world! / Eva es una joven autora que cree que cada niño merece una historia mágica. ¡Escribe libros en inglés, español y francés para ayudar a los niños a explorar el mundo! / Eva est une jeune autrice qui croit que chaque enfant mérite une histoire magique. Elle écrit des livres en anglais, en espagnol et en français pour aider les enfants à explorer le monde !", 50, ey-18, PAGE-100, size=10, lead=13)
    footer(c, 4)

def vocab_grid(c, y, items, cols=2, swatches=None, row_h=44):
    colw = (PAGE-100)/cols
    for idx,it in enumerate(items):
        r,cc = divmod(idx, cols)
        x = 50 + cc*colw; yy = y - r*row_h
        if swatches:
            c.setFillColorRGB(*swatches[idx]); c.setStrokeColorRGB(*GRAY); c.setLineWidth(0.5)
            c.roundRect(x, yy-22, 26, 26, 4, fill=1, stroke=1); tx = x+36
        else:
            tx = x
        en,es,fr = it
        c.setFillColorRGB(*DARK); c.setFont("Helvetica-Bold", 11); c.drawString(tx, yy-4, en)
        c.setFillColorRGB(*GRAY); c.setFont("Helvetica", 9.5)
        c.drawString(tx, yy-17, f"{es}  ·  {fr}")

def p5(c):
    y = header(c, "Colors / Los Colores / Les Couleurs")
    items=[("Red","Rojo","Rouge"),("Orange","Naranja","Orange"),("Yellow","Amarillo","Jaune"),("Green","Verde","Vert"),("Blue","Azul","Bleu"),("Purple","Morado","Violet"),("Black","Negro","Noir"),("White","Blanco","Blanc"),("Brown","Marrón","Marron"),("Pink","Rosa","Rose")]
    sw=[(0.86,0.15,0.15),(0.95,0.55,0.13),(0.98,0.83,0.12),(0.16,0.66,0.33),(0.18,0.40,0.85),(0.55,0.30,0.78),(0.12,0.12,0.14),(1,1,1),(0.55,0.35,0.18),(0.96,0.55,0.74)]
    vocab_grid(c, y-6, items, cols=2, swatches=sw, row_h=46)
    footer(c, 5)

def p6(c):
    y = header(c, "Animals / Los Animales / Les Animaux")
    items=[("Dog","Perro","Chien"),("Cat","Gato","Chat"),("Bird","Pájaro","Oiseau"),("Fish","Pez","Poisson"),("Elephant","Elefante","Éléphant"),("Lion","León","Lion"),("Frog","Rana","Grenouille"),("Rabbit","Conejo","Lapin"),("Butterfly","Mariposa","Papillon"),("Turtle","Tortuga","Tortue"),("Cow","Vaca","Vache"),("Penguin","Pingüino","Pingouin")]
    vocab_grid(c, y-6, items, cols=2, row_h=38)
    footer(c, 6)

def p7(c):
    y = header(c, "Numbers 1-10 / Los Números 1-10 / Les Nombres 1-10")
    nums=[("1","One","Uno","Un"),("2","Two","Dos","Deux"),("3","Three","Tres","Trois"),("4","Four","Cuatro","Quatre"),("5","Five","Cinco","Cinq"),("6","Six","Seis","Six"),("7","Seven","Siete","Sept"),("8","Eight","Ocho","Huit"),("9","Nine","Nueve","Neuf"),("10","Ten","Diez","Dix")]
    colw=(PAGE-100)/2
    for idx,(n,en,es,fr) in enumerate(nums):
        r,cc=divmod(idx,2); x=50+cc*colw; yy=y-6-r*46
        c.setFillColorRGB(*PURPLE); c.circle(x+14, yy-10, 14, fill=1, stroke=0)
        c.setFillColorRGB(1,1,1); c.setFont("Helvetica-Bold", 12); c.drawCentredString(x+14, yy-14, n)
        c.setFillColorRGB(*DARK); c.setFont("Helvetica-Bold", 11); c.drawString(x+38, yy-6, f"{en} / {es} / {fr}")
        c.setFillColorRGB(*PURPLE)
        for k in range(int(n)): c.rect(x+38+k*8, yy-22, 5, 9, fill=1, stroke=0)
    footer(c, 7)

def p8(c):
    y = header(c, "Matching Game / Juego de Emparejamiento / Jeu d'association")
    y = wrapped(c, "Draw a line to match each English word with its Spanish translation! / ¡Traza una línea para unir cada palabra en inglés con su traducción en español! / Trace une ligne pour relier chaque mot anglais à sa traduction espagnole !", 50, y, PAGE-100, size=9.8, color=GRAY); y-=14
    left=["Dog","Cat","Red","One","Sun","Book","Tree","Happy"]
    right=["Rojo","Perro","Sol","Árbol","Libro","Gato","Feliz","Uno"]
    fr=["(Chien)","(Chat)","(Rouge)","(Un)","(Soleil)","(Livre)","(Arbre)","(Heureux)"]
    for i in range(8):
        yy=y-i*30
        c.setFillColorRGB(*EN_BG); c.setStrokeColorRGB(*EN_BD); c.setLineWidth(1)
        c.roundRect(70, yy-20, 150, 24, 6, fill=1, stroke=1)
        c.setFillColorRGB(*DARK); c.setFont("Helvetica-Bold", 11); c.drawString(80, yy-13, left[i])
        c.setFillColorRGB(*GRAY); c.setFont("Helvetica", 8.5); c.drawRightString(212, yy-13, fr[i])
        c.setFillColorRGB(*ES_BG); c.setStrokeColorRGB(*ES_BD)
        c.roundRect(PAGE-220, yy-20, 150, 24, 6, fill=1, stroke=1)
        c.setFillColorRGB(*DARK); c.setFont("Helvetica-Bold", 11); c.drawString(PAGE-210, yy-13, right[i])
    footer(c, 8)

def story(c, n, title, en, es, fr, image):
    y = header(c, title, h=64, size=15)
    c.drawImage(img(image), 45, y-200, 200, 200, mask='auto')
    cx=260; cw=PAGE-cx-46
    card(c, cx, y, cw, 88, EN_BG, EN_BD, "English", EN_BD, en, body_size=9.3)
    card(c, cx, y-100, cw, 88, ES_BG, ES_BD, "Español", ES_BD, es, body_size=9.3)
    card(c, 45, y-210, PAGE-92, 70, FR_BG, FR_BD, "Français", FR_BD, fr, body_size=9.3)
    footer(c, n)

def p9(c):
    story(c, 9, "Pawa's Big Day - Part 1 / El Gran Día de Pawa - Parte 1 / La grande journée de Pawa - 1ère partie",
        "One sunny morning, Pawa woke up feeling excited. Today was going to be a very special day! He stretched his paws, wagged his tail, and looked at the colorful book on his nightstand.",
        "Una mañana soleada, Pawa se despertó sintiéndose emocionado. ¡Hoy iba a ser un día muy especial! Estiró sus patas, movió su cola y miró el colorido libro en su mesita de noche.",
        "Un matin ensoleillé, Pawa se réveilla tout excité. Aujourd'hui allait être une journée très spéciale ! Il étira ses pattes, remua la queue et regarda le livre coloré sur sa table de nuit.",
        "story1.jpg")

def p10(c):
    story(c, 10, "Pawa's Big Day - Part 2 / El Gran Día de Pawa - Parte 2 / La grande journée de Pawa - 2e partie",
        "Pawa trotted to the library. His eyes went wide, there were SO many books! A kind librarian smiled and said: “Welcome, Pawa! Every book here is a new adventure waiting for you.”",
        "Pawa trotó hasta la biblioteca. Sus ojos se abrieron mucho, ¡había TANTOS libros! Una amable bibliotecaria sonrió y dijo: “¡Bienvenido, Pawa! Cada libro aquí es una nueva aventura que te espera.”",
        "Pawa trotta jusqu'à la bibliothèque. Ses yeux s'écarquillèrent : il y avait TELLEMENT de livres ! Une gentille bibliothécaire sourit et dit : « Bienvenue, Pawa ! Chaque livre ici est une nouvelle aventure qui t'attend. »",
        "story2.jpg")

def p11(c):
    story(c, 11, "Pawa's Big Day - Part 3 / El Gran Día de Pawa - Parte 3 / La grande journée de Pawa - 3e partie",
        "Pawa chose his favorite book and sat under a big tree in the park. A butterfly landed on the page. Pawa smiled. He had found the best adventure of all, the adventure of reading!",
        "Pawa eligió su libro favorito y se sentó bajo un gran árbol en el parque. Una mariposa se posó en la página. Pawa sonrió. ¡Había encontrado la mejor aventura de todas, la aventura de leer!",
        "Pawa choisit son livre préféré et s'assit sous un grand arbre dans le parc. Un papillon se posa sur la page. Pawa sourit. Il avait trouvé la plus belle aventure de toutes : l'aventure de la lecture !",
        "story3.jpg")

def p12(c):
    y = header(c, "Reading Questions / Preguntas de Comprensión / Questions de lecture")
    y = wrapped(c, "After reading Pawa's Big Day, answer these questions! / ¡Después de leer El Gran Día de Pawa, responde! / Après avoir lu La grande journée de Pawa, réponds à ces questions !", 50, y, PAGE-100, size=9.8, color=GRAY); y-=12
    qs=[
        "Where did Pawa go? / ¿A dónde fue Pawa? / Où Pawa est-il allé ?",
        "What did Pawa find at the library? / ¿Qué encontró Pawa en la biblioteca? / Qu'a trouvé Pawa à la bibliothèque ?",
        "How did Pawa feel at the end? / ¿Cómo se sintió Pawa al final? / Comment Pawa se sentait-il à la fin ?",
        "What is YOUR favorite book? / ¿Cuál es TU libro favorito? / Quel est TON livre préféré ?",
        "If you went on an adventure with Pawa, where would you go? / ¿A dónde irías de aventura con Pawa? / Où irais-tu à l'aventure avec Pawa ?",
    ]
    for i,q in enumerate(qs,1):
        c.setFillColorRGB(*PURPLE); c.circle(62, y-6, 11, fill=1, stroke=0)
        c.setFillColorRGB(1,1,1); c.setFont("Helvetica-Bold",11); c.drawCentredString(62, y-10, str(i))
        yy = wrapped(c, q, 84, y-4, PAGE-134, size=10, lead=12.5, color=DARK)
        c.setStrokeColorRGB(*GRAY); c.setLineWidth(0.4); c.line(84, yy+2, PAGE-50, yy+2)
        y = yy - 18
    footer(c, 12)

def p13(c):
    y = header(c, "Color Pawa! / ¡Colorea a Pawa! / Colorie Pawa !")
    wrapped(c, "Use your favorite colors to bring Pawa to life! / ¡Usa tus colores favoritos para darle vida a Pawa! / Utilise tes couleurs préférées pour donner vie à Pawa !", 50, y, PAGE-100, size=10, color=GRAY)
    c.drawImage(img("color-pawa.png"), 106, 70, 400, 400, mask='auto')
    footer(c, 13)

WORDGRID=["DOGSTARXBK","RFCATLOVEQ","ESUNMTREEP","DBOOKZWXYJ","STARLIGHTV","CATFUNHAPP","READINGXYZ","SUNFLOWERA","TREEHOUSEC","BOOKSHELFG"]
def p14(c):
    y = header(c, "Word Search / Sopa de Letras / Mots mêlés")
    y = wrapped(c, "Find these words in the grid! Words go across and down. / ¡Encuentra estas palabras! Van horizontal y vertical. / Trouve ces mots ! Ils se lisent horizontalement et verticalement.", 50, y, PAGE-100, size=9.6, color=GRAY); y-=8
    c.setFillColorRGB(*DARK); c.setFont("Helvetica-Bold", 10)
    c.drawString(50, y, "Find / Encuentra / Trouve:  DOG  CAT  RED  BOOK  TREE  SUN  STAR  LOVE"); y-=20
    gx, gy, cell = 156, y, 30
    c.setFont("Courier-Bold", 15)
    for r,row in enumerate(WORDGRID):
        for col,ch in enumerate(row):
            c.setStrokeColorRGB(0.8,0.8,0.85); c.setLineWidth(0.5)
            c.rect(gx+col*cell, gy-r*cell-cell, cell, cell, fill=0, stroke=1)
            c.setFillColorRGB(*DARK); c.drawCentredString(gx+col*cell+cell/2, gy-r*cell-cell+9, ch)
    footer(c, 14)

def p15(c):
    y = header(c, "Trace the Letters / Traza las Letras / Trace les lettres")
    y = wrapped(c, "Trace each letter, then write it yourself! / ¡Traza cada letra, luego escríbela! / Trace chaque lettre, puis écris-la toi-même !", 50, y, PAGE-100, size=9.8, color=GRAY); y-=10
    letters=[("A","a"),("B","b"),("C","c"),("D","d"),("E","e"),("F","f"),("G","g"),("H","h")]
    for i,(u,l) in enumerate(letters):
        r,cc=divmod(i,2); x=60+cc*270; yy=y-r*78
        c.setFillColorRGB(0.85,0.85,0.9); c.setFont("Helvetica-Bold", 40)
        c.drawString(x, yy-44, u+" "+l)
        c.setStrokeColorRGB(0.8,0.8,0.85); c.setLineWidth(0.6)
        c.line(x+115, yy-44, x+250, yy-44)
    c.setFillColorRGB(*DARK); c.setFont("Helvetica-Bold", 11)
    c.drawString(50, 70, "Now write the whole alphabet! / ¡Ahora escribe todo el alfabeto! / Maintenant, écris tout l'alphabet !")
    footer(c, 15)

def p16(c):
    y = header(c, "Spot the Difference! / ¡Encuentra las Diferencias! / Trouve les différences !")
    y = wrapped(c, "Can you find 5 differences between the two pictures? Circle them! / ¿Puedes encontrar 5 diferencias? ¡Enciérralas! / Peux-tu trouver 5 différences ? Entoure-les !", 50, y, PAGE-100, size=9.6, color=GRAY); y-=6
    c.setFillColorRGB(*PURPLE); c.setFont("Helvetica-Bold", 10)
    c.drawCentredString(160, y, "Picture 1 / Imagen 1 / Image 1"); c.drawCentredString(452, y, "Picture 2 / Imagen 2 / Image 2"); y-=6
    c.drawImage(img("spot1.jpg"), 45, y-190, 230, 190, mask='auto')
    c.drawImage(img("spot2.jpg"), 337, y-190, 230, 190, mask='auto')
    yy=y-210
    c.setFillColorRGB(*DARK); c.setFont("Helvetica-Bold", 11)
    c.drawString(50, yy, "Differences found / Diferencias encontradas / Différences trouvées :"); yy-=28
    for i in range(5):
        x=50+i*108
        c.setStrokeColorRGB(*ES_BD); c.setLineWidth(1.2); c.roundRect(x, yy-6, 92, 30, 8, fill=0, stroke=1)
        c.setFillColorRGB(*ES_BD); c.setFont("Helvetica-Bold", 12); c.drawString(x+12, yy+4, f"#{i+1}")
    footer(c, 16)

def p17(c):
    y = header(c, "My Reading Log / Mi Diario de Lectura / Mon journal de lecture")
    y = wrapped(c, "Track the books you read! Give each one a star rating. / ¡Registra los libros que lees! Dale estrellas a cada uno. / Note les livres que tu lis ! Donne une note en étoiles à chacun.", 50, y, PAGE-100, size=9.8, color=GRAY); y-=14
    cols=[("Book Title / Título / Titre",50,210),("Author / Autor / Auteur",270,150),("Date / Fecha",420,80),("Stars / Étoiles",500,62)]
    c.setFillColorRGB(*PURPLE); c.rect(46, y-22, PAGE-92, 22, fill=1, stroke=0)
    c.setFillColorRGB(1,1,1); c.setFont("Helvetica-Bold", 8.5)
    for label,x,w in cols: c.drawString(x+4, y-15, label)
    y-=22
    c.setStrokeColorRGB(0.8,0.8,0.85); c.setLineWidth(0.6)
    for r in range(6):
        ry=y-r*40
        c.rect(46, ry-40, PAGE-92, 40, fill=0, stroke=1)
        for label,x,w in cols[:3]:
            c.line(x, ry-40, x, ry)
        c.line(500, ry-40, 500, ry)
        for s in range(5): star(c, 512+s*17, ry-20, 6, (0.85,0.85,0.88))
    c.setFillColorRGB(*DARK); c.setFont("Helvetica-Bold", 10.5)
    c.drawCentredString(PAGE/2, 52, "Keep reading, every book is an adventure! / ¡Sigue leyendo! / Continue à lire, chaque livre est une aventure !")
    footer(c, 17)

def p18(c):
    # decorative border
    c.setStrokeColorRGB(*PURPLE); c.setLineWidth(3); c.roundRect(34, 44, PAGE-68, PAGE-88, 14, fill=0, stroke=1)
    c.setStrokeColorRGB(*PINKBAR); c.setLineWidth(1); c.roundRect(44, 54, PAGE-88, PAGE-108, 12, fill=0, stroke=1)
    c.setFillColorRGB(*PURPLE); c.setFont("Helvetica-Bold", 28); c.drawCentredString(PAGE/2, PAGE-110, "Certificate of Completion")
    c.setFillColorRGB(*ES_BD); c.setFont("Helvetica-Bold", 16)
    c.drawCentredString(PAGE/2, PAGE-138, "Certificado de Logro  ·  Certificat de réussite")
    c.setFillColorRGB(*GRAY); c.setFont("Helvetica", 12)
    c.drawCentredString(PAGE/2, PAGE-185, "This certifies that / Este certificado es para / Ce certificat est décerné à :")
    c.setStrokeColorRGB(*GRAY); c.setLineWidth(0.8); c.line(140, PAGE-235, PAGE-140, PAGE-235)
    c.setFont("Helvetica-Oblique", 9); c.drawCentredString(PAGE/2, PAGE-250, "(Write your name here / Escribe tu nombre / Écris ton nom)")
    c.setFillColorRGB(*DARK); c.setFont("Helvetica-Bold", 13)
    c.drawCentredString(PAGE/2, PAGE-285, "has completed the Trilingual Starter Kit!")
    c.setFillColorRGB(*GRAY); c.setFont("Helvetica", 11)
    c.drawCentredString(PAGE/2, PAGE-303, "¡ha completado el Kit Trilingüe!  ·  a terminé le kit trilingue !")
    for s in range(5): star(c, PAGE/2-72+s*36, PAGE-345, 13, (0.98,0.78,0.12))
    c.setFillColorRGB(*PURPLE); c.setFont("Helvetica-Bold", 17)
    c.drawCentredString(PAGE/2, PAGE-385, "You are a TRILINGUAL SUPERSTAR!")
    c.setFillColorRGB(*ES_BD); c.setFont("Helvetica-Bold", 12)
    c.drawCentredString(PAGE/2, PAGE-405, "¡Eres una SUPERESTRELLA TRILINGÜE!  ·  Tu es une SUPERSTAR TRILINGUE !")
    c.setStrokeColorRGB(*GRAY); c.line(110, 120, 250, 120); c.line(PAGE-250, 120, PAGE-110, 120)
    c.setFillColorRGB(*GRAY); c.setFont("Helvetica", 9)
    c.drawCentredString(180, 106, "Signed / Firmado / Signé : Eva Gallo"); c.drawCentredString(PAGE-180, 106, "Date / Fecha / Date")
    c.setFillColorRGB(*PURPLE); c.setFont("Helvetica-Bold", 10); c.drawCentredString(PAGE/2, 78, "storytimewitheva.com")
    footer(c, 18)

def p19(c):
    y = header(c, "Answer Key / Respuestas / Corrigé")
    c.setFillColorRGB(*DARK); c.setFont("Helvetica-Bold", 12); c.drawString(50, y, "Matching Game / Emparejamiento / Association:"); y-=18
    pairs="Dog → Perro → Chien   ·   Cat → Gato → Chat   ·   Red → Rojo → Rouge   ·   One → Uno → Un   ·   Sun → Sol → Soleil   ·   Book → Libro → Livre   ·   Tree → Árbol → Arbre   ·   Happy → Feliz → Heureux"
    y = wrapped(c, pairs, 50, y, PAGE-100, size=10, lead=15); y-=10
    c.setFillColorRGB(*DARK); c.setFont("Helvetica-Bold", 12); c.drawString(50, y, "Word Search / Sopa de Letras / Mots mêlés:"); y-=18
    y = wrapped(c, "DOG: Row 1, cols 1-3  |  CAT: Row 2, cols 3-5  |  SUN: Row 3, cols 2-4  |  BOOK: Row 4, cols 2-5  |  STAR: Row 1, cols 4-7  |  TREE: Row 9, cols 5-8  |  LOVE: Row 2, cols 7-10  |  RED: Row 1, col 1 (down)", 50, y, PAGE-100, size=9.5, lead=14); y-=10
    c.setFillColorRGB(*DARK); c.setFont("Helvetica-Bold", 12); c.drawString(50, y, "Comprehension / Comprensión / Compréhension:"); y-=18
    ans=["1. Pawa went to the library. / Pawa fue a la biblioteca. / Pawa est allé à la bibliothèque.",
         "2. He found lots of colorful books. / Encontró muchos libros coloridos. / Il a trouvé plein de livres colorés.",
         "3. He felt happy and inspired. / Se sintió feliz e inspirado. / Il était heureux et inspiré.",
         "4-5. Your own answers! / ¡Tus propias respuestas! / Tes propres réponses !"]
    for a in ans: y = wrapped(c, a, 50, y, PAGE-100, size=9.8, lead=13)-3
    footer(c, 19)

def p20(c):
    y = header(c, "You Did It! / ¡Lo Lograste! / Tu as réussi !")
    c.setFillColorRGB(*DARK); c.setFont("Helvetica-Bold", 13)
    for ln,fn in [("Congratulations on completing the Trilingual Starter Kit!","Helvetica-Bold"),
                  ("¡Felicitaciones por completar el Kit Trilingüe!","Helvetica"),
                  ("Félicitations pour avoir terminé le kit trilingue !","Helvetica")]:
        c.setFont(fn, 12.5 if fn=="Helvetica-Bold" else 11); c.setFillColorRGB(*(DARK if fn=="Helvetica-Bold" else GRAY))
        c.drawCentredString(PAGE/2, y, ln); y-=20
    y-=10; c.setFillColorRGB(*DARK); c.setFont("Helvetica-Bold", 14); c.drawString(50, y, "What's Next? / ¿Qué Sigue? / Et maintenant ?"); y-=24
    bullets=["Explore all of Eva's books on Amazon / Explora los libros de Eva en Amazon / Découvre tous les livres d'Eva sur Amazon",
             "Try more free activities on our website / Prueba más actividades gratis en el sitio / Essaie d'autres activités gratuites sur le site",
             "Share this kit with a friend! / ¡Comparte este kit con un amigo! / Partage ce kit avec un ami !"]
    for b in bullets:
        c.setFillColorRGB(*PINKBAR); c.rect(52, y-1, 7, 7, fill=1, stroke=0)
        y = wrapped(c, b, 68, y+4, PAGE-120, size=10, lead=13)-10
    y-=10; c.setFillColorRGB(*PURPLE); c.setFont("Helvetica-Bold", 11)
    c.drawCentredString(PAGE/2, y, "storytimewitheva.com  |  hello@storytimewitheva.com"); y-=16
    c.setFillColorRGB(*GRAY); c.setFont("Helvetica", 10); c.drawCentredString(PAGE/2, y, "amazon.com/author/evagallo"); y-=22
    c.setFillColorRGB(*GRAY); c.setFont("Helvetica-Oblique", 9.5)
    c.drawCentredString(PAGE/2, y, "Made with love for curious young minds everywhere")
    footer(c, 20)

def build():
    c = canvas.Canvas(OUT, pagesize=(PAGE, PAGE))
    for fn in [p1,p2,p3,p4,p5,p6,p7,p8,p9,p10,p11,p12,p13,p14,p15,p16,p17,p18,p19,p20]:
        fn(c); c.showPage()
    c.save(); print("wrote", os.path.relpath(OUT))

if __name__ == "__main__":
    build()
