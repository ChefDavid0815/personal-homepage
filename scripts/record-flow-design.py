from pathlib import Path
import json,hashlib
ROOT=Path(__file__).resolve().parents[1]
sources=[p for p in (ROOT/'dist').iterdir() if p.suffix in ('.html','.css','.js')]
sources += [p for p in (ROOT/'scripts').iterdir() if p.suffix in ('.mjs','.py')]
manifest={p.relative_to(ROOT).as_posix():hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(sources)}
fingerprint=hashlib.sha256(json.dumps(manifest,sort_keys=True).encode()).hexdigest()
contract={
 'schema_version':'1.0','system_version':'3.3.0','status':'locally verified candidate',
 'project':'ChefZC personal website — 川流不息 / Everything in flow',
 'brief':'An expressive, youthful dopamine portfolio whose flowing forms, typography, relationships and returns express continuity and causality. Preserve every existing work, note, record, source and asset.',
 'theme':{'name':'川流不息','statement':'万物流动不止，世间万物皆有轮回因果。','signature':'Offset Chinese theme lettering, interlocking sculptural currents, a continuous river spine and a navigable flow index.'},
 'platform':'Existing static HTML / ESM JavaScript / CSS / esbuild; embedded apps keep their own interfaces.',
 'sourceOfTruth':{'content':'Existing project, post, music and research records; exact decorative revisions tracked in flow-authorized-art-revision.json, retired raster hash protected in the design archive.','routes':'dist/site-routes.js','catalogue':'dist/site-catalog.js + existing project and post records','visual':'dist/flow.css + dist/site-navigation.css','motionPreference':'dist/motion-state.js','sceneBuild':'scripts/build-motion.mjs'},
 'scope':['Personal profile and all original sections','Gallery and its four collection rooms','Game room','Now timeline','Posts and individual readers','Usage observatory','School and model exhibits','NeRF and AER public topics','Reset radar and archive','New flow index with 40 real destinations'],
 'layout':{'composition':'Subject-led asymmetry; wide identity typography; flowing sculptural material; calm reading and direct controls.','breakpoints':[600,760,1000,1100,1600],'phone':'Recompose text and sculpture into a vertical flow; all primary navigation remains visible. Reading panels use comfortable insets; metrics become compact rows and the model ring separates from its legend below 600px.'},
 'tokens':{'paper':'#eeeaf8','ink':'#202044','blue':'#2445ef','pink':'#fcaed3','yellow':'#f6ef59','mint':'#c6f2c9','orange':'#ff713e'},
 'typography':[{'role':'Latin display','family':'Unbounded','weightRange':[200,900],'source':'OFL self-hosted variable WOFF2'},{'role':'Chinese display','family':'Noto Sans SC with readable system fallback','weight':900},{'role':'Reading / controls','family':'DM Sans + Noto Sans SC','mobileInputs':'16px to avoid Safari focus zoom'}],
 'assets':['design/flow-assets.json','design/flow-board.svg','dist/assets/flow/SOURCES.json','design/project-expression.json'],
 'stateInvariants':['One shared language and motion preference across owned pages.','The current project identity is reflected in a shareable URL.','Browser Back closes a project view before leaving the collection.','Article return links point to the original stable card.','Changing language retains the selected Atlas plate.','Empty search and invalid project links have a working recovery path.','Copy transactions cannot publish stale feedback after language changes.','All collection rooms derive the main count from the actual project array.'],
 'motion':{'ambient':'9-second sculptural breathing, flowing SVG traces, context-specific existing exhibit motion and native navigation transitions.','interaction':'One critically damped controller owns sculpture inspection and pointer pose; target changes retain position and velocity.','pause':'Shared OS/manual preference; background/offscreen suspension; full settled content in reduced motion.','build':'Shared Three.js engine chunks; canonical imports for language, motion and shared chrome.'},
 'evidence':['design/flow-spacing-verification.json','design/flow-reading-pass.json','design/flow-reading-readers.json','design/flow-reading-dialogs.json','design/flow-spacing-responsive.json','design/flow-contrast-after.json','design/flow-reader-contrast.json','design/flow-dialog-contrast.json','design/flow-art-revision-verification.json','design/flow-content-verification.json','design/flow-http-verification.json','design/flow-route-verification.json','design/flow-responsive-verification.json','design/flow-engine-verification.json','design/flow-navigation-verification.json','design/flow-qa/'],
 'review':{'kind':'One-agent simulated review across nine perspectives; no independent experts or numerical award scores claimed.','perspectives':['Creative direction','Art direction','UX','Motion','Creative development','Frontend engineering','Accessibility','Performance','Mobile']},
 'limitations':['No Awwwards submission or award result claimed; the 2026-10-08 publication is tracked separately in flow-publication-verification.json.','Browser viewport emulation is not physical phone or Safari evidence.','Physical touch, screen-reader output, forced colours, 200% text zoom and hardware Web Vitals remain unverified.','QQ Music playback permissions remain platform-dependent.','Editable deliverables are local SVG/CSS/JS and specifications; no Figma/Illustrator cloud files created.'],
 'previousContract':'design/before-dopamine-20261007/design/design-contract.json','codeFingerprint':fingerprint
}
(ROOT/'design/design-contract.json').write_text(json.dumps(contract,ensure_ascii=False,indent=2),encoding='utf-8')
(ROOT/'design/flow-code-manifest.json').write_text(json.dumps({'fingerprint':fingerprint,'files':manifest},indent=2),encoding='utf-8')
print('Recorded the shared design contract and current source fingerprint.')
