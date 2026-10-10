from pathlib import Path
import re, json
ROOT=Path(__file__).resolve().parents[1]
DIST=ROOT/'dist'
for path in DIST.glob('*.html'):
    if path.name=='index.html': continue
    html=path.read_text(encoding='utf-8')
    if 'flow.css' not in html:
        html=html.replace('</head>', '  <link rel="stylesheet" href="./flow.css">\n  <script type="module" src="./flow-motion.js"></script>\n</head>')
    html=html.replace('content="#101112"', 'content="#eeeaf8"')
    path.write_text(html,encoding='utf-8')

path=DIST/'profile.html'; html=path.read_text(encoding='utf-8')
if 'flow-theme-title' not in html:
    card=re.search(r'  <article class="identity-card".*?</article>',html,re.S).group(0)
    html=html.replace(card,'')
    html=html.replace('<div class="identity-wrap">','''<div class="identity-wrap flow-object-stage" data-flow-stage>
  <div class="flow-object-plate" aria-hidden="true"><svg viewBox="0 0 600 600"><path d="M80 490C-20 280 220 110 400 220S600 570 310 580 40 220 300 80 670 230 530 420"/></svg></div>
  <div class="flow-object-orbit"><div class="flow-object-pose"><img class="flow-sculpture" src="./assets/flow/river-sculpture.webp" width="1280" height="1280" alt="蓝色、粉色与金色的流线，环绕篮球汇成一件流动雕塑" fetchpriority="high"></div></div>
  <span class="flow-object-label" aria-hidden="true">PASSION → POSSIBILITY →</span>
  <span class="flow-object-number" aria-hidden="true">∞</span>
  <button type="button" class="flow-turn" aria-pressed="false"><span data-flow-turn-label>让万物流转</span><span aria-hidden="true">↻</span></button>''')
    html=html.replace('  <p class="profile-headline">','''  <div class="flow-theme" aria-label="川流不息"><p class="flow-theme-title"><span>川流</span><span>不息<i aria-hidden="true">↗</i></span></p><p class="flow-theme-caption"><span data-flow-copy="theme">万物流动不止，世间万物皆有轮回因果。</span><span lang="en">EVERYTHING IN FLOW.</span></p></div>
  <p class="profile-headline">''')
    html=html.replace('</aside></div>\n</section>', '</aside></div>\n<div class="flow-identity-record">'+card+'</div>\n</section>',1)
    # CRLF source is normalized by read_text; the replacement above matches the original authored layout.
    assert 'flow-identity-record' in html
    html=html.replace('<main>','''<main>
<div class="flow-spine" aria-hidden="true"><svg viewBox="0 0 1400 2400" preserveAspectRatio="none"><path class="flow-spine-base" d="M1300 -100C300 70 1400 490 650 650S-160 1100 700 1200 1540 1650 650 1830 0 2200 900 2500"/><path class="flow-spine-trace" d="M1300 -100C300 70 1400 490 650 650S-160 1100 700 1200 1540 1650 650 1830 0 2200 900 2500"/></svg></div>''',1)
path.write_text(html,encoding='utf-8')

# Do not replace authored content dictionaries; retain every project, article and source URL.
print('Flow design linked to every authored top-level page. Profile content moved without deletion.')
