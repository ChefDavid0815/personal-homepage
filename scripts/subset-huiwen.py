"""Rebuild dist/assets/fonts/huiwen-mincho-site.woff2 from the repaired master, keeping only the
CJK / punctuation characters the site actually uses (same unicode-range as the @font-face)."""
import hashlib, json, sys
from pathlib import Path
from fontTools import subset
ROOT = Path(__file__).resolve().parents[1]
MASTER = Path(sys.argv[1]) if len(sys.argv) > 1 else ROOT.parent / '.release-work/huiwen-mincho/HuiwenMinchoGBK-repaired.ttf'
OUT = ROOT / 'dist/assets/fonts/huiwen-mincho-site.woff2'
RANGES = [(0x2000, 0x206F), (0x3000, 0x303F), (0x3400, 0x9FFF), (0xFF00, 0xFFEF)]
chars = set()
for f in (ROOT / 'dist').rglob('*'):
    if f.suffix not in {'.html', '.js', '.json', '.css', '.md'} or f.name.startswith('flow-legacy'): continue
    try: text = f.read_text(encoding='utf-8')
    except Exception: continue
    chars.update(c for c in text if any(a <= ord(c) <= b for a, b in RANGES))
opts = subset.Options(); opts.flavor = 'woff2'; opts.layout_features = ['*']; opts.name_IDs = ['*']; opts.notdef_outline = True
font = subset.load_font(str(MASTER), opts)
sub = subset.Subsetter(opts); sub.populate(unicodes=[ord(c) for c in chars]); sub.subset(font)
subset.save_font(font, str(OUT), opts)
meta_path = OUT.with_name('huiwen-mincho-source.json'); meta = json.loads(meta_path.read_text(encoding='utf-8'))
cmap = font.getBestCmap(); meta['glyphs'] = len(font.getGlyphOrder()); meta['outputSha256'] = hashlib.sha256(OUT.read_bytes()).hexdigest()
missing = sorted(c for c in chars if ord(c) not in cmap)
meta_path.write_text(json.dumps(meta, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print('chars', len(chars), 'glyphs', meta['glyphs'], 'bytes', OUT.stat().st_size, 'missing', ascii(''.join(missing)))
