"""Repair Huiwen Mincho GBK glyphs that carry traditional/Japanese components for simplified code points.
target = (donor glyph clipped left of its radical gap) ∪ (source glyph clipped right of its gap, refitted).
Outlines in this font are merged across components, so clipping uses skia-pathops booleans."""
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.ttGlyphPen import TTGlyphPen
from fontTools.pens.cu2quPen import Cu2QuPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.basePen import DecomposingPen
from PIL import Image, ImageDraw, ImageFont
import pathops

src, out = sys.argv[1], sys.argv[2]
font = TTFont(src)
cmap = font.getBestCmap(); gs = font.getGlyphSet(); glyf = font['glyf']; hmtx = font['hmtx']
upm = font['head'].unitsPerEm
pil = ImageFont.truetype(src, 400)

class Decomp(DecomposingPen):
    def __init__(self, glyphSet, inner): super().__init__(glyphSet); self.inner = inner
    def moveTo(self, p): self.inner.moveTo(p)
    def lineTo(self, p): self.inner.lineTo(p)
    def curveTo(self, *ps): self.inner.curveTo(*ps)
    def qCurveTo(self, *ps): self.inner.qCurveTo(*ps)
    def closePath(self): self.inner.closePath()
    def endPath(self): self.inner.endPath()

def path_of(ch):
    p = pathops.Path(); gs[cmap[ord(ch)]].draw(Decomp(gs, p.getPen())); return p

def rect(x0, x1):
    p = pathops.Path(); pen = p.getPen()
    pen.moveTo((x0, -400)); pen.lineTo((x1, -400)); pen.lineTo((x1, 1200)); pen.lineTo((x0, 1200)); pen.closePath(); return p

def gap_x(ch, lo=0.28, hi=0.55):
    """Column with the least ink between lo and hi of the em, in font units."""
    im = Image.new('L', (400, 480), 0); d = ImageDraw.Draw(im); d.text((0, 0), ch, font=pil, fill=255)
    px = im.load(); best = None
    for x in range(int(400 * lo), int(400 * hi)):
        s = sum(1 for y in range(480) if px[x, y] > 100)
        if best is None or s < best[0]: best = (s, x)
    return best[1] / 400 * upm

def clip(p, x0, x1): return pathops.op(p, rect(x0, x1), pathops.PathOp.INTERSECTION)

def bbox(p):
    b = p.bounds; return b

def compose(target, donor, source, donor_range=(0.28, 0.5), source_range=(0.3, 0.55)):
    sd = gap_x(donor, *donor_range); ss = gap_x(source, *source_range)
    left = clip(path_of(donor), -500, sd)
    right = clip(path_of(source), ss, 1500)
    lb = bbox(left); rb = bbox(right)
    new_x0 = lb[2] + 26; new_x1 = rb[2]
    sx = max(0.88, min(1.2, (new_x1 - new_x0) / max(1, rb[2] - rb[0])))
    moved = pathops.Path(); tp = TransformPen(moved.getPen(), (sx, 0, 0, 1, new_x0 - rb[0] * sx, 0)); right.draw(tp)
    union = pathops.op(left, moved, pathops.PathOp.UNION)
    ttpen = TTGlyphPen(None); union.draw(Cu2QuPen(ttpen, max_err=1.0, reverse_direction=True))
    g = ttpen.glyph(); name = cmap[ord(target)]
    glyf[name] = g; g.recalcBounds(glyf)
    hmtx[name] = (hmtx[name][0], getattr(g, 'xMin', 0))
    return round(sd), round(ss), round(sx, 3)

jobs = [
    ('认', '计', '认'), ('让', '计', '让'), ('讲', '计', '讲'), ('论', '计', '论'), ('证', '计', '证'),
    ('钟', '针', '钟'), ('钥', '针', '钥'), ('钻', '针', '钻'),
    ('辆', '轨', '辆'), ('辐', '轨', '辐'), ('辑', '轨', '辑'), ('输', '轨', '输'),
    ('练', '红', '炼'), ('继', '红', '继'),
]
for t, dnr, srcc in jobs:
    print(t, compose(t, dnr, srcc))
font.save(out)
