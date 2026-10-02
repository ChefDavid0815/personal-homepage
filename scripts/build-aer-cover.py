"""Build the repository-native AER cover from its licensed type and original tail assets."""
from pathlib import Path
import base64
from fontTools.ttLib import TTFont
from fontTools.varLib.instancer import instantiateVariableFont
from fontTools.pens.svgPathPen import SVGPathPen

root=Path(__file__).resolve().parents[1]/'dist/assets/projects/aer'
font=TTFont(root/'manrope.ttf')
if 'fvar' in font: font=instantiateVariableFont(font,{'wght':500},inplace=False)
glyphs=font.getGlyphSet();cmap=font.getBestCmap();cursor=0;letters=[]
for letter in 'aer':
    name=cmap[ord(letter)];pen=SVGPathPen(glyphs);glyphs[name].draw(pen)
    letters.append(f'<path d="{pen.getCommands()}" transform="translate({cursor} 0)"/>')
    cursor+=glyphs[name].width-50
scale=310/font['head'].unitsPerEm
word=f'<g fill="#355967" transform="translate(120 430) scale({scale} {-scale})">'+''.join(letters)+'</g>'
zh_font=TTFont(root.parents[1]/'fonts/noto-sans-sc-site-variable.woff2')
if 'fvar' in zh_font: zh_font=instantiateVariableFont(zh_font,{'wght':400},inplace=False)
zh_glyphs=zh_font.getGlyphSet();zh_cmap=zh_font.getBestCmap();zh_cursor=0;zh_paths=[]
for letter in '让下一程，更像你。':
    name=zh_cmap[ord(letter)];pen=SVGPathPen(zh_glyphs);zh_glyphs[name].draw(pen)
    zh_paths.append(f'<path d="{pen.getCommands()}" transform="translate({zh_cursor} 0)"/>');zh_cursor+=zh_glyphs[name].width
zh_scale=23/zh_font['head'].unitsPerEm
chinese=f'<g fill="#668599" transform="translate(125 646) scale({zh_scale} {-zh_scale})">'+''.join(zh_paths)+'</g>'
def tail(file,x,y,width,rotate):
    data=base64.b64encode((root/file).read_bytes()).decode()
    return f'<g transform="translate({x} {y}) rotate({rotate} {width/2} {width*.42})" filter="url(#shadow)"><image href="data:image/webp;base64,{data}" width="{width}" height="{width*.85}" preserveAspectRatio="xMidYMid meet"/></g>'
svg=f'''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1600 900" role="img" aria-labelledby="title desc">
<title id="title">AER 1.0 / Flight, thoughtfully / ChefZC</title><desc id="desc">A daylight optical-glass cover with an Emirates tail, two companion tails, curved reflective rims and bilingual departure copy.</desc>
<defs><linearGradient id="sky" x2="1" y2=".7"><stop stop-color="#fffaf4"/><stop offset=".5" stop-color="#e8f1f5"/><stop offset="1" stop-color="#d8e5f2"/></linearGradient><radialGradient id="lilac"><stop stop-color="#cfcbea" stop-opacity=".6"/><stop offset="1" stop-color="#dfe9f1" stop-opacity="0"/></radialGradient><linearGradient id="rim" x2=".7" y2="1"><stop stop-color="#fff"/><stop offset=".3" stop-color="#eff7ff" stop-opacity=".25"/><stop offset=".65" stop-color="#b7cbe4" stop-opacity=".48"/><stop offset="1" stop-color="#fff"/></linearGradient><linearGradient id="sheet" x2="1" y2="1"><stop stop-color="#fff" stop-opacity=".18"/><stop offset=".6" stop-color="#fff" stop-opacity=".015"/><stop offset="1" stop-color="#c7d5ec" stop-opacity=".2"/></linearGradient><filter id="shadow" x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="10" dy="19" stdDeviation="7" flood-color="#375a74" flood-opacity=".18"/></filter></defs>
<rect width="1600" height="900" rx="28" fill="url(#sky)"/><ellipse cx="1360" cy="750" rx="650" ry="450" fill="url(#lilac)"/>
<path d="M0 760 1600 230v100L0 856Z" fill="#fff" opacity=".2"/>
<g fill="none" stroke="#b1ccd7" stroke-width="1"><ellipse cx="1120" cy="475" rx="330" ry="166" transform="rotate(-19 1120 475)"/><ellipse cx="1120" cy="475" rx="270" ry="196" transform="rotate(24 1120 475)"/><path d="M784 614Q890 195 1444 378"/></g>
<ellipse cx="1110" cy="461" rx="254" ry="243" fill="none" stroke="url(#rim)" stroke-width="30" transform="rotate(-13 1110 461)"/>
<ellipse cx="1110" cy="461" rx="269" ry="258" fill="none" stroke="#fff" stroke-opacity=".9" stroke-width="1.5" transform="rotate(-13 1110 461)"/>
<rect x="936" y="267" width="347" height="349" rx="38" fill="url(#sheet)" stroke="#fff" stroke-opacity=".85" stroke-width="2" transform="rotate(-11 1110 450)" filter="url(#shadow)"/>
{tail('qatar-tail.webp',748,481,137,-6)}{tail('singapore-tail.webp',1375,293,119,-5)}{tail('emirates-tail.webp',934,214,440,-5)}
<rect x="834" y="527" width="420" height="147" rx="31" fill="url(#sheet)" stroke="#fff" stroke-opacity=".68" stroke-width="2" transform="rotate(-9 1030 600)"/>
<ellipse cx="1110" cy="674" rx="162" ry="24" fill="#fff" fill-opacity=".1" stroke="#fff" stroke-width="2" filter="url(#shadow)"/>
<g fill="#5e7e91" font-family="Arial, sans-serif"><text x="120" y="94" font-size="13" letter-spacing="3">CHEFZC / THE DEPARTURE COLLECTION</text><text x="1450" y="94" text-anchor="end" font-size="13" letter-spacing="2">NO. 09 / V 1.0</text><text x="123" y="242" font-size="14" letter-spacing="3">FLIGHT, THOUGHTFULLY</text></g>{word}
<g fill="#486c81" font-family="Arial, sans-serif" font-weight="300"><text x="123" y="523" font-size="47" letter-spacing="-2">A little closer.</text><text x="123" y="582" font-size="47" letter-spacing="-2" fill="#7b98a8">A little more you.</text></g>{chinese}
<g fill="#708fa2" font-family="Arial, sans-serif" font-size="12" letter-spacing="1.8"><text x="1160" y="176">LIGHT, THROUGH A CLEARER SKY.</text><text x="120" y="814">GLASS / SKY / JOURNEY</text><text x="1450" y="814" text-anchor="end">AER 1.0 · 2026.10.02</text></g><path d="M120 773H1480" stroke="#8caebf" stroke-opacity=".23"/>
</svg>'''
(root/'cover.svg').write_text(svg,encoding='utf-8')
print(f'AER cover: {(root/"cover.svg").stat().st_size:,} bytes')
