"""Editable dot Earth and artboard from the app's actual cloud and OFL lettering."""
from pathlib import Path
import math,json,hashlib
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from PIL import Image
R=Path(__file__).resolve().parents[1]; A=R/'dist/assets/projects/dot-air'
rows=json.loads((A/'orbital-points.json').read_text())
font=TTFont(A/'ArchivoBlack-Regular.ttf');glyphs=font.getGlyphSet();cmap=font.getBestCmap()
def word(text,x,y,size,color):
    cursor=0;parts=[]
    for c in text:
        name=cmap.get(ord(c));g=glyphs[name];pen=SVGPathPen(glyphs);g.draw(pen)
        if pen.getCommands():parts.append(f'<path d="{pen.getCommands()}" transform="translate({cursor},0)"/>')
        cursor+=g.width
    scale=size/font['head'].unitsPerEm
    return f'<g fill="{color}" transform="translate({x},{y}) scale({scale},-{scale})">'+''.join(parts)+'</g>'
paths={'land':[],'ocean':[]}
for i,(lon,lat,land) in enumerate(rows):
    if i%2:continue
    p=math.radians(lat);l=math.radians(lon-55.37);tilt=math.radians(18)
    x=math.cos(p)*math.sin(l);y=math.sin(p);z=math.cos(p)*math.cos(l)
    yr=y*math.cos(tilt)-z*math.sin(tilt);zr=y*math.sin(tilt)+z*math.cos(tilt)
    if zr<.02:continue
    cx=350+x*310;cy=350-yr*310;rr=(2.43 if land else 1.05)*(.55+.45*zr)
    paths['land' if land else 'ocean'].append(f'M{cx-rr:.2f},{cy:.2f}a{rr:.2f},{rr:.2f} 0 1,0 {rr*2:.2f},0a{rr:.2f},{rr:.2f} 0 1,0 {-rr*2:.2f},0')
defs='<radialGradient id="sphere" cx="30%" cy="25%"><stop stop-color="#ff9d68"/><stop offset=".3" stop-color="#ee3829"/><stop offset="1" stop-color="#951714"/></radialGradient><pattern id="dots" width="42" height="42" patternUnits="userSpaceOnUse"><circle cx="21" cy="21" r="4" fill="#f5f3eb"/></pattern>'
earth='<circle cx="350" cy="350" r="313" fill="#20221f"/><circle cx="350" cy="350" r="310" fill="url(#sphere)"/>'+''.join(f'<path fill="{color}" d="{"".join(paths[key])}"/>' for key,color in [('ocean','#ad2118'),('land','#fff5e8')])
(A/'globe.svg').write_text(f'<svg xmlns="http://www.w3.org/2000/svg" width="700" height="700" viewBox="0 0 700 700"><title>DOT/AIR dotted Earth, Natural Earth geography</title><defs>{defs}</defs>{earth}</svg>',encoding='utf-8')
board=f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1200" height="1450" viewBox="0 0 1200 1450"><title>DOT/AIR editable exhibit, Now and journal composition</title><defs>{defs}<g id="earth">{earth}</g></defs><rect width="1200" height="1450" fill="#f5f3eb"/><rect y="80" width="1200" height="680" fill="#ee3829"/><rect y="80" width="1200" height="680" fill="url(#dots)"/><use xlink:href="#earth" transform="translate(520,60) scale(1.14)"/>'+word('DOT/AIR',42,52,34,'#20221f')+word('EVERY',58,288,128,'#f5f3eb')+word('FLIGHT',58,410,128,'#20221f')+'<g transform="rotate(-4,80,470)"><path d="M60 453H430Q530 453 530 500Q530 547 430 547H60Z" fill="#20221f" transform="translate(6,8)"/><path d="M60 453H430Q530 453 530 500Q530 547 430 547H60Z" fill="#f5f3eb"/>'+word('YOUR',75,523,60,'#20221f')+word('WAY.',290,523,60,'#d92c20')+'</g>'+word('DOT/AIR DOT/AIR DOT/AIR',-15,742,61,'#f5f3eb')+'<text x="60" y="810" font-family="sans-serif" font-size="14" fill="#20221f">DXB / LHR / HND / JFK / SIN    •    EARTH VIEWPOINT</text><rect x="40" y="880" width="480" height="520" fill="#ee3829"/><rect x="40" y="880" width="480" height="520" fill="url(#dots)"/><clipPath id="half"><rect x="40" y="880" width="480" height="520"/></clipPath><g clip-path="url(#half)"><use xlink:href="#earth" transform="translate(-65,1140) scale(.95)"/></g>'+word('THE WORLD',70,1030,42,'#f5f3eb')+word('IN DOTS.',70,1080,42,'#20221f')+'<rect x="560" y="880" width="600" height="390" fill="#ee3829"/><rect x="560" y="880" width="600" height="390" fill="url(#dots)"/><clipPath id="cover"><rect x="560" y="880" width="600" height="390"/></clipPath><g clip-path="url(#cover)"><use xlink:href="#earth" transform="translate(800,885) scale(.66)"/></g>'+word('EVERY',595,1030,62,'#f5f3eb')+word('FLIGHT',595,1095,62,'#20221f')+word('YOUR WAY.',595,1160,32,'#f5f3eb')+'<text x="580" y="1320" font-family="sans-serif" font-size="14" fill="#20221f">POST 17 / INFINITE SKY. INDIVIDUAL FLIGHT.</text></svg>'
(R/'design/dot-air-board.svg').write_text(board,encoding='utf-8')
image=Image.open(A/'software.png');w,h=image.size
files={p.name:{'bytes':p.stat().st_size,'sha256':hashlib.sha256(p.read_bytes()).hexdigest()} for p in A.iterdir() if p.is_file()}
manifest={'sourceApp':'E:/个人项目/dot-air','screenshot':{'source':'actual local Web signed-out public view','width':w,'height':h},'globe':{'samples':len(rows),'landSamples':sum(row[2] for row in rows),'source':'Original Dot Air orbital-points.json from Natural Earth public-domain atlas','license':'https://www.naturalearthdata.com/about/terms-of-use/','implementation':'real Three.js sphere and perspective point shader; SVG only static fallback'},'files':files}
(R/'design/dot-air-assets.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8')
print('Editable artboard and geographic fallback ready; actual software screenshot:',w,h)
