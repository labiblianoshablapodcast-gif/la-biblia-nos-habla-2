"""Generate the two original Kids printable sheets and their endpoint payload."""
from pathlib import Path
import base64
import json
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import letter
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

pdfmetrics.registerFont(TTFont("KidsSans", "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"))
pdfmetrics.registerFont(TTFont("KidsSansBold", "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"))

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf"
OUT.mkdir(parents=True, exist_ok=True)

def text(c, x, y, value, size=12, bold=False):
    c.setFont("KidsSansBold" if bold else "KidsSans", size)
    c.drawString(x, y, value)

def heading(c, age, subtitle):
    c.setTitle(f"David y Goliat - Estudio Kids - {age} años")
    c.setAuthor("La Biblia Nos Habla")
    text(c, 42, 755, "LA BIBLIA NOS HABLA / ESTUDIO KIDS", 10, True)
    text(c, 42, 718, "David y Goliat", 29, True)
    text(c, 42, 694, f"{age} años | 1 Samuel 17 | {subtitle}", 11)
    c.setLineWidth(1)
    c.line(42, 679, 570, 679)

def footer(c):
    c.line(42, 62, 570, 62)
    text(c, 42, 45, "Actividad original para realizar con un adulto. No lances piedras ni imites la honda.", 9)
    text(c, 42, 30, "La Biblia Nos Habla - Estudio Kids", 9)
    text(c, 532, 30, "1 / 1", 9)

def sheep(c, x, y, scale=1):
    c.saveState(); c.translate(x, y); c.scale(scale, scale)
    c.setLineWidth(2)
    c.line(-20, -18, -20, -40); c.line(20, -18, 20, -40)
    c.setFillColorRGB(1, 1, 1)
    c.ellipse(-47, -25, 43, 28, fill=1)
    c.ellipse(25, -8, 61, 25, fill=1)
    c.circle(48, 12, 2, fill=1)
    c.restoreState()

def david(c, x, y):
    c.saveState(); c.translate(x, y); c.setLineWidth(2)
    c.line(-17, 0, -22, -47); c.line(17, 0, 22, -47)
    c.line(-31, -47, -13, -47); c.line(14, -47, 32, -47)
    p=c.beginPath(); p.moveTo(-28, 95); p.lineTo(28, 95); p.lineTo(38, 0); p.lineTo(-38, 0); p.close()
    c.drawPath(p)
    c.line(-31, 47, 33, 47)
    c.circle(0, 124, 29)
    p=c.beginPath(); p.moveTo(-27, 135); p.curveTo(-16, 168, 24, 162, 29, 132); p.curveTo(11, 151, -8, 130, -27, 135); c.drawPath(p)
    c.circle(-9, 125, 2); c.circle(10, 125, 2)
    p=c.beginPath(); p.moveTo(-8, 113); p.curveTo(-3, 106, 4, 106, 10, 114); c.drawPath(p)
    c.line(-28, 83, -49, 40); c.line(28, 83, 48, 58)
    c.line(52, -45, 62, 154)
    c.arc(47, 150, 68, 174, 0, 160)
    c.restoreState()

def young():
    path=OUT / "david-y-goliat-4-6.pdf"
    c=canvas.Canvas(str(path), pagesize=letter, pageCompression=1)
    heading(c, "4-6", "Colorear, contar y conversar")
    text(c, 42, 654, "1. Colorea a David y las ovejas que cuidaba.", 14, True)
    c.roundRect(42, 332, 528, 300, 12)
    c.circle(500, 579, 24)
    for dx,dy in [(0,32),(0,-32),(32,0),(-32,0),(24,24),(-24,24)]:
        c.line(500+dx*.85,579+dy*.85,500+dx*1.15,579+dy*1.15)
    c.line(59, 386, 553, 386)
    david(c, 224, 448)
    sheep(c, 374, 431, .85); sheep(c, 469, 413, .7)
    text(c, 42, 304, "2. Cuenta y colorea las cinco piedras del arroyo.", 14, True)
    for i in range(5):
        x=99+i*100
        c.ellipse(x-24, 242, x+24, 275)
        text(c, x-4, 227, str(i+1), 12)
    text(c, 42, 194, "3. Conversemos en familia", 14, True)
    text(c, 42, 172, "¿En quién confiaba David? ¿A qué adulto puedes pedir ayuda?", 12)
    text(c, 42, 135, "Recordamos:", 12, True)
    text(c, 42, 113, "Puedo confiar en Dios cuando tengo miedo.", 16, True)
    footer(c); c.showPage(); c.save()
    return path

def older():
    path=OUT / "david-y-goliat-7-10.pdf"
    c=canvas.Canvas(str(path), pagesize=letter, pageCompression=1)
    heading(c, "7-10", "Comprender y vivir la enseñanza")
    text(c, 42, 651, "1. Ordena la historia: escribe 1, 2, 3 y 4.", 14, True)
    statements=["David escoge cinco piedras del arroyo.","David vence a Goliat con la ayuda de Dios.","David escucha el desafío de Goliat.","David declara su confianza en el Señor."]
    for i,s in enumerate(statements):
        y=618-i*32
        c.roundRect(44, y-5, 22, 22, 4)
        text(c, 81, y, s, 12)
    text(c, 42, 472, "2. Busca en 1 Samuel 17:37, 38-40 y 45-47.", 14, True)
    text(c, 42, 447, "¿Qué recordaba David de la ayuda de Dios?", 12)
    c.line(42, 421, 570, 421); c.line(42, 397, 570, 397)
    text(c, 42, 370, "¿Por qué su confianza no dependía de una armadura?", 12)
    c.line(42, 344, 570, 344); c.line(42, 320, 570, 320)
    text(c, 42, 284, "3. Mi plan cuando tengo miedo", 14, True)
    text(c, 42, 260, "Una oración que puedo hacer:", 12)
    c.line(42, 235, 570, 235)
    text(c, 42, 208, "Un adulto de confianza al que puedo pedir ayuda:", 12)
    c.line(42, 182, 570, 182)
    text(c, 42, 146, "Para conversar:", 12, True)
    text(c, 42, 125, "Confiar en Dios no significa buscar peligros ni pelear con otros.", 12)
    text(c, 42, 105, "¿Qué decisión sabia podrías tomar esta semana?", 12)
    footer(c); c.showPage(); c.save()
    return path

paths=[young(), older()]
payload={age:base64.b64encode(path.read_bytes()).decode("ascii") for age,path in zip(["4-6","7-10"],paths)}
# Generated mechanical asset encoding for the Next.js download endpoint.
(ROOT / "data" / "kids-sheets.json").write_text(json.dumps(payload,indent=2)+"\n",encoding="utf-8")
for path in paths:
    print(path)
