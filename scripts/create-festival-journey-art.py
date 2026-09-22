"""Original Festival Toolkit 0.3 cover. Requires fontTools; no remote assets."""
from pathlib import Path
from math import sin, cos, pi
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen

ROOT=Path(__file__).resolve().parents[1]
FONT=Path('E:/Horizon Festival Toolkit/node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-700-normal.woff')
font=TTFont(FONT); glyphs=font.getGlyphSet(); cmap=font.getBestCmap(); units=font['head'].unitsPerEm

def text(label,x,y,size,color='#20392f',tracking=0):
    pen=SVGPathPen(glyphs); scale=size/units
    for ch in label:
        name=cmap.get(ord(ch),'space'); glyph=glyphs[name]
        glyph.draw(TransformPen(pen,(scale,0,0,-scale,x,y)))
        x+=glyph.width*scale+tracking
    return f'<path fill="{color}" d="{pen.getCommands()}"/>'

ink='#20392f';blue='#507f9f';pink='#ab537b'
s=['''<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" role="img" aria-labelledby="title desc"><title id="title">Festival Toolkit 0.3 — Let every journey bloom.</title><desc id="desc">An original mint, sky blue and pink composition. A journal pass, a compass and seven woven colour bands celebrate 38 categories and 2833 entries. Decorative artwork, not player progress.</desc><defs><pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".8" fill="#41684c" opacity=".2"/></pattern><pattern id="weave" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 1h4M1 0v4" stroke="#fff" stroke-opacity=".2" stroke-width=".6"/></pattern><linearGradient id="paper" x2="1" y2="1"><stop stop-color="#fffef4"/><stop offset="1" stop-color="#eaf0dc"/></linearGradient><linearGradient id="metal" x2="1" y2="1"><stop stop-color="#ecf6ff"/><stop offset=".5" stop-color="#a8cee8"/><stop offset="1" stop-color="#d2e8f5"/></linearGradient></defs><rect width="1600" height="900" rx="14" fill="#e0efca"/><rect x="820" y="91" width="780" height="716" fill="url(#dots)"/><path d="M1480 0 1100 900h340L1600 570V0Z" fill="#bfdcf4" opacity=".55"/><path d="M42 88h1516M42 811h1516" stroke="#527257" stroke-opacity=".4"/>''']
s+=[text('CHEFZC / THE FESTIVAL COLLECTION',48,57,23,tracking=2),text('EDITION / 03',1320,57,23,tracking=2),text('HORIZON FESTIVAL TOOLKIT',65,151,19,tracking=2)]
s+=[text('LET EVERY',57,312,156),text('JOURNEY',57,461,174,blue),text('BLOOM.',57,608,174)]
s+=['<rect x="70" y="663" width="126" height="44" rx="2" fill="#f7bbd4"/>',text('VERSION 0.3',88,693,23,pink),text('A LITTLE FURTHER. A LITTLE MORE CURIOUS.',222,693,20,tracking=1)]
s+=[text('38',70,771,45),text('CATEGORIES',125,768,15),text('2,833',297,771,45),text('ENTRIES',401,768,15),text('7',551,771,45),text('WRISTBAND COLOURS',580,768,15)]
s+=['<circle cx="1308" cy="270" r="165" fill="#25492f" opacity=".08" transform="translate(12 15)"/><circle cx="1308" cy="270" r="165" fill="url(#metal)" stroke="#6994a6"/><circle cx="1308" cy="270" r="156" fill="none" stroke="#f7f8ed" stroke-width="4"/><circle cx="1308" cy="270" r="136" fill="none" stroke="#6a92a6" stroke-width="12" stroke-dasharray="2 10"/><circle cx="1308" cy="270" r="112" fill="none" stroke="#6a92a6"/>']
for i in range(4):
    a=i*pi/2;s.append(f'<path d="M{1308+112*cos(a)} {270+112*sin(a)}l{30*cos(a)} {30*sin(a)}" stroke="#426981" stroke-width="2"/>')
s += [text('N',1300,166,21,blue),'<g transform="rotate(26 1308 270)"><path d="m1308 176 25 94-25 94-25-94Z" fill="#f7bbd4" stroke="#6b8190"/><path d="m1308 176 25 94h-50Z" fill="#507f9f"/><circle cx="1308" cy="270" r="12" fill="#f9f9eb" stroke="#507f9f"/></g>']
paper_start=len(s)
s+=['<g transform="translate(869 223) rotate(-9 235 233)"><rect x="14" y="17" width="450" height="472" fill="#9fc6d8" stroke="#709185"/><rect x="0" y="0" width="450" height="472" fill="url(#paper)" stroke="#6d8e77"/><rect x="26" y="24" width="70" height="32" fill="#bfdcf4"/>',text('H / 06',39,47,21),text('JOURNAL PASS',268,45,18,tracking=1),'<path d="M26 76h398" stroke="#759077"/>',text('TAKE THE',26,165,91),text('LONG WAY.',26,245,91,blue),'<path d="M32 339c77 0 44-68 111-68s65 96 158 78 25-47 104-47" fill="none" stroke="#7a9d82" stroke-width="2" stroke-dasharray="5 8"/><circle cx="32" cy="339" r="8" fill="#bfdcf4" stroke="#709185"/><circle cx="143" cy="271" r="8" fill="#f7bbd4" stroke="#709185"/><path d="m391 288 25 25m0-25-25 25" stroke="#ab537b" stroke-width="4"/><path d="M26 378h398" stroke="#759077" stroke-dasharray="5 5"/>',text('2,833',26,440,58),text('38 CATEGORIES',274,415,16),text('02 JOURNALS',274,438,16),'</g>']
bands_start=len(s)
colours=['#bfdcf4','#f7bbd4','#c3dbae','#f0d7a4','#bfb1df','#e99c9b','#82bcaa']
s+=['<g transform="translate(822 621) rotate(7)">']
for i,color in enumerate(colours):
    x=i*66;y=(i%3)*6
    s += [f'<path d="M{x} {y}h55v136l-27-15-28 15Z" fill="{color}" stroke="#597a6170"/>',f'<path d="M{x} {y}h55v136l-27-15-28 15Z" fill="url(#weave)"/>',f'<path d="M{x+6} {y+7}h43v109" fill="none" stroke="#35523d50" stroke-dasharray="3 3"/>',f'<g transform="translate({x+16} {y+14}) rotate(90)">',text(f'FESTIVAL / 0{i+1}',0,0,12),'</g>']
s+=['</g>']
s=s[:paper_start]+s[bands_start:]+s[paper_start:bands_start]
s+=['<g transform="rotate(12 1430 637)"><circle cx="1430" cy="637" r="93" fill="#f7bbd4" stroke="#b97d95"/><circle cx="1430" cy="637" r="82" fill="none" stroke="#a35179" stroke-dasharray="3 4"/>',text('EDITION',1398,589,18,pink,1),text('03',1386,668,95,pink),text('KEEP EXPLORING',1374,699,14,pink),'</g>',text('YOUR FESTIVAL. STILL GROWING.',50,859,22,tracking=2),text('WINDOWS / ZH + EN / 22 SEPTEMBER 2026',1102,859,18,tracking=.7),'</svg>']
out=ROOT/'dist/assets/projects/festival-toolkit/cover-v0.3.0.svg';out.write_text(''.join(s),encoding='utf-8');print(out)
