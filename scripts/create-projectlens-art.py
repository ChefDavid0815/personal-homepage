"""Reproducible vector artwork for the ProjectLens collection. No external assets."""
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
TARGET = ROOT / 'dist/assets/projects/projectlens'
TARGET.mkdir(parents=True, exist_ok=True)

defs = '''<defs>
<linearGradient id="bg" x2="1" y2="1"><stop stop-color="#142722"/><stop offset=".5" stop-color="#081413"/><stop offset="1" stop-color="#0b1e25"/></linearGradient>
<radialGradient id="aura"><stop stop-color="#79f4bb" stop-opacity=".2"/><stop offset="1" stop-color="#5cedc0" stop-opacity="0"/></radialGradient>
<linearGradient id="metal" x1=".15" y1=".1" x2=".8" y2=".9"><stop stop-color="#b3d5c7"/><stop offset=".14" stop-color="#253f3c"/><stop offset=".32" stop-color="#6eafa0"/><stop offset=".53" stop-color="#142f30"/><stop offset=".78" stop-color="#254b4b"/><stop offset="1" stop-color="#81b6ac"/></linearGradient>
<linearGradient id="glass" x2=".85" y2="1"><stop stop-color="#b1ffdc" stop-opacity=".65"/><stop offset=".23" stop-color="#72d7b1" stop-opacity=".16"/><stop offset=".56" stop-color="#103d3c" stop-opacity=".65"/><stop offset=".9" stop-color="#8bd3ff" stop-opacity=".3"/><stop offset="1" stop-color="#cefce6" stop-opacity=".55"/></linearGradient>
<linearGradient id="ink"><stop stop-color="#c5ffc6"/><stop offset=".5" stop-color="#90ffcb"/><stop offset="1" stop-color="#92cff3"/></linearGradient>
<linearGradient id="scan"><stop stop-color="#8fffc6" stop-opacity="0"/><stop offset=".5" stop-color="#baffd9"/><stop offset="1" stop-color="#8fffc6" stop-opacity="0"/></linearGradient>
<pattern id="grid" width="46" height="46" patternUnits="userSpaceOnUse"><path d="M46 0H0V46" fill="none" stroke="#8fccb0" stroke-opacity=".08"/></pattern>
<filter id="shadow" x="-50%" y="-50%" width="200%" height="220%"><feDropShadow dx="0" dy="28" stdDeviation="24" flood-opacity=".65"/></filter>
<filter id="bloom" x="-90%" y="-90%" width="280%" height="280%"><feGaussianBlur stdDeviation="8"/></filter>
</defs>'''

def optics():
    ticks=''.join(f'<path d="M0 -262v{17 if i%5==0 else 7}" stroke="{ "#b2ffcd" if i%5==0 else "#648d81" }" stroke-width="{2 if i%5==0 else 1}" transform="rotate({i*6})"/>' for i in range(60))
    plates=''
    for i in range(3):
        lines=''.join(f'<rect x="{-117+(j%2)*18}" y="{-54+j*22}" width="{76+j%3*33}" height="3" rx="1" fill="{"#9effc7" if j%3==0 else "#608b82"}"/>' for j in range(6))
        plates+=f'<g transform="translate({-32+i*23} {75-i*20}) rotate({-17+i*4})"><rect x="-180" y="-118" width="370" height="248" rx="8" fill="#102d2b" stroke="#8bbca0" stroke-opacity=".4"/><path d="M-155 -83H160" stroke="#8fdabc" stroke-opacity=".2"/>{lines}</g>'
    return f'''<g transform="translate(1110 430)"><g class="optics"><g filter="url(#shadow)">{plates}<g transform="rotate(-22) scale(1 .85)">
    <circle cy="25" r="226" fill="#071512" stroke="#355b51" stroke-width="21"/><circle r="228" fill="#122b2a" stroke="url(#metal)" stroke-width="42"/>
    <circle r="245" fill="none" stroke="#b4e7ce" stroke-opacity=".7"/><circle r="209" fill="#08201d" stroke="#87e8bd" stroke-width="2"/>
    <g opacity=".3">{plates}</g><circle r="203" fill="url(#glass)"/>
    <path d="M-162 -108Q-54 -217 103 -152" stroke="#d0ffe3" stroke-width="2" fill="none" opacity=".55"/>
    <circle r="192" fill="none" stroke="#bbffdc" stroke-opacity=".2"/><circle r="272" fill="none" stroke="#5d9a85" stroke-opacity=".3" stroke-dasharray="1 9"/>
    <g class="ticks">{ticks}</g><path d="M-167 40H166" stroke="url(#scan)" stroke-width="5" filter="url(#bloom)"/><path class="scan" d="M-167 40H166" stroke="url(#scan)" stroke-width="2"/>
    <text x="0" y="16" text-anchor="middle" font-size="42" font-family="monospace" fill="#caffdd" opacity=".52">[ / ]</text>
    </g></g></g></g>'''

style='''<style>.optics{animation:float 9s ease-in-out infinite;transform-origin:0 0}.scan{animation:sweep 7s ease-in-out infinite}.ticks{animation:turn 120s linear infinite;transform-origin:0 0}@keyframes float{50%{transform:translateY(-12px) rotate(2deg)}}@keyframes sweep{0%,100%{transform:translateY(-80px);opacity:.1}50%{transform:translateY(60px);opacity:1}}@keyframes turn{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.optics,.scan,.ticks{animation:none}}</style>'''
svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900" role="img" aria-labelledby="title desc"><title id="title">ProjectLens — look closer.</title><desc id="desc">An original graphite, mint and ice-blue optical study, with a metal lens and layered code plates. Art, not scan results.</desc>{defs}{style}
<rect width="1600" height="900" rx="20" fill="url(#bg)"/><rect x="1" y="1" width="1598" height="898" rx="20" fill="none" stroke="#78ba9650"/>
<rect x="730" y="90" width="810" height="650" fill="url(#grid)"/><ellipse cx="1100" cy="420" rx="510" ry="360" fill="url(#aura)"/>
<path d="M58 99H1542M58 801H1542" stroke="#a3edbf" stroke-opacity=".2"/>
<g fill="#84b29b" font-family="monospace" font-size="13" letter-spacing="2"><text x="62" y="61">[ / ]   CHEFZC / THE LOCAL INTELLIGENCE COLLECTION</text><text x="1538" y="61" text-anchor="end">005 — V0.1.0</text></g>
<g font-family="Arial,Helvetica,sans-serif" font-weight="800" letter-spacing="-10"><text x="64" y="301" font-size="114" fill="#e6f5ec">PROJECT</text><text x="61" y="436" font-size="155" fill="url(#ink)">LENS_</text></g>
<text x="68" y="514" font-size="32" fill="#c4e4cd" font-family="Arial,Helvetica,sans-serif" letter-spacing="-1">A little clarity in the code.</text>
<g font-family="monospace" font-size="14" fill="#8fb3a0"><text x="68" y="571">CODE. CONFIGURATION. DOCUMENTATION.</text><text x="68" y="602">Follow the file. Understand the signal.</text></g>
<g transform="translate(68 665)"><rect width="214" height="51" rx="4" fill="#b6f6ce"/><text x="107" y="32" text-anchor="middle" font-family="monospace" font-size="14" fill="#153222">WINDOWS / LOCAL FIRST</text><path d="M255 26H524" stroke="#aaf8c5" stroke-opacity=".3"/></g>
{optics()}
<g transform="translate(943 705) rotate(-4)"><rect width="346" height="65" rx="7" fill="#15322b" stroke="#87c3a5" stroke-opacity=".6"/><text x="21" y="28" font-size="15" fill="#c4f7d8" font-family="monospace">PROJECTLENS / OPTICAL STUDY</text><text x="21" y="47" font-size="9" fill="#86ad98" font-family="monospace" letter-spacing="1">READ-ONLY · LOCAL · EXPLAINABLE</text></g>
<g font-family="monospace" font-size="12" fill="#739981" letter-spacing="1.4"><text x="62" y="850">01 / STRUCTURE</text><text x="443" y="850">02 / SIGNALS</text><text x="829" y="850">03 / REPORT</text><text x="1538" y="850" text-anchor="end">LOOK CLOSER. STAY CURIOUS.</text></g></svg>'''
(TARGET/'cover.svg').write_text(svg,encoding='utf-8')
print('Created ProjectLens original vector cover: 1600 x 900')
