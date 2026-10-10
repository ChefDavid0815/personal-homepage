from pathlib import Path
import json
R=Path(__file__).resolve().parents[1]
protected={};htmlpatches={}
def patch(file,find,replace,protect=False):
    p=R/file;s=p.read_text(encoding='utf-8')
    if s.count(find)!=1:raise ValueError(f'{file}: expected unique source: {find[:80]}')
    p.write_text(s.replace(find,replace,1),encoding='utf-8',newline='')
    if protect:protected.setdefault(file,[]).append({'find':find,'replace':replace})
patch('dist/projects.js',"import {aerProject}","import {dotAirProject} from './dot-air-content.js';\nimport {aerProject}",True)
patch('dist/projects.js','export const projects = [\n  aerProject,','export const projects = [\n  dotAirProject,\n  aerProject,',True)
patch('dist/posts-data.js',"import {nabatPost}","import {dotAirPost} from './dot-air-content.js';\nimport {nabatPost}",True)
patch('dist/posts-data.js','export const posts = [\n  nabatPost,','export const posts = [\n  dotAirPost,\n  nabatPost,',True)
patch('dist/i18n.js',"import {nabatMessages}","import {dotAirMessages} from './dot-air-content.js';\nimport {nabatMessages}")
patch('dist/i18n.js','flowReleaseMessages, nabatMessages);','flowReleaseMessages, nabatMessages, dotAirMessages);')
patch('dist/gallery.js',"import {chromaCard", "import {dotAirCard,dotAirDetail} from './dot-air-art.js';\nimport './dot-air-globe.bundle.js';\nimport {chromaCard")
patch('dist/gallery.js',"    if(project.id === 'aer')", "    if(project.id === 'dot-air') return dotAirCard();\n    if(project.id === 'aer')")
patch('dist/gallery.js',"  document.dispatchEvent(new Event('aer:render'));\n}","  document.dispatchEvent(new Event('aer:render'));\n  document.dispatchEvent(new Event('dot-air:render'));\n}")
p=R/'dist/gallery.js';s=p.read_text(encoding='utf-8').replace("'aer-dialog');","'aer-dialog', 'da-dialog');")
s=s.replace("  if(projectId === 'aer')", "  if(projectId === 'dot-air') {dialog.classList.add('da-dialog');dialogContent.innerHTML=dotAirDetail();return;}\n  if(projectId === 'aer')",1)
s=s.replace("  if(location.hash !== '#project-aer') return;", "  if(location.hash === '#project-dot-air'){requestAnimationFrame(()=>requestAnimationFrame(()=>grid.querySelector('#project-dot-air')?.scrollIntoView({block:'start',behavior:'auto'})));return;}\n  if(location.hash !== '#project-aer') return;")
p.write_text(s,encoding='utf-8',newline='')
patch('dist/posts.js',"import {nabatPostArt}","import {dotAirPostArt} from './dot-air-art.js';\nimport './dot-air-globe.bundle.js';\nimport {nabatPostArt}")
patch('dist/posts.js',"  if(item.theme === 'nabat')", "  if(item.theme === 'dot-air') return dotAirPostArt();\n  if(item.theme === 'nabat')")
patch('dist/posts.js',"  const size = src.includes('/nabat/')", "  const size = src.includes('/dot-air/') ? [1265,712] : src.includes('/nabat/')")
patch('dist/posts.js',"function render() { isReader ? reader() : overview();", "function render() { isReader ? reader() : overview(); document.dispatchEvent(new Event('dot-air:render'));")
for f in ['gallery','now','posts','post']:
    patch(f'dist/{f}.html','  <link rel="stylesheet" href="./flow.css">','  <link rel="stylesheet" href="./flow.css">\n  <link rel="stylesheet" href="./dot-air.css" data-project-style>')
patch('dist/now.html','  <script type="module" src="./nabat-entry.js"></script>','  <script type="module" src="./nabat-entry.js"></script>\n  <script type="module" src="./dot-air-entry.js"></script>')
count={'find':'/</span> 29</span>','replace':'/</span> 30</span>'}
patch('dist/now.html',count['find'],count['replace']);htmlpatches['dist/now.html']=[count]
patch('dist/now.html','ChefZC 的近况。2026 年 10 月 9 日，INJAZ 商赛作品 NABAT 加入校园实验室。','ChefZC 的近况。2026 年 10 月 9 日，DOT/AIR 的波点地球飞进 Gallery。')
now='''<li class="timeline-entry"><div class="entry-date"><time datetime="2026-10-09"><span class="entry-year mono">2026</span><span class="entry-day">10<span>/</span>09</span></time><span class="entry-label mono" data-i18n="now.dotAirLabel">个人作品 / 航空探索</span></div><article class="milestone milestone--dot-air" aria-labelledby="milestone-dot-air"><div class="milestone-copy"><div class="milestone-kicker mono"><span data-i18n="now.dotAirKicker">每个点，都可以是出发点</span><span>030</span></div><h3 id="milestone-dot-air" data-i18n="now.dotAirTitle">DOT/AIR，让世界沿着波点转起来。</h3><p class="milestone-description" data-i18n="now.dotAirText">今天让 DOT/AIR 飞进 Gallery。沿用软件的朱红、黑白波点和宽体字，把真实地理点云做成一颗持续自转的地球：选择机场，同一颗球转向新的坐标。机队图鉴、公共空域资料与 Flight DNA，让航空兴趣和个人偏好都有自己的位置；Web 与原生 Windows 工作台共用账户。</p><ul class="milestone-tags"><li>DOT/AIR 0.1.0</li><li>Orbital Earth</li><li>Web + WPF</li></ul><p class="milestone-progress" data-i18n="now.dotAirNote">公共航空资料版 0.1.0；可售航班与票价尚未接入供应商，不提供预订或出票。</p><div class="da-now-links"><a class="milestone-link" href="./gallery.html#project-dot-air"><span data-i18n="now.dotAirExplore">走进波点天空</span> ↗</a><a class="milestone-link" href="./post.html?article=dot-air"><span data-i18n="now.dotAirRead">读这篇出发手记</span> ↗</a></div></div><a class="milestone-art da-now-art" data-dot-air-now href="./gallery.html#project-dot-air" aria-label="打开 DOT/AIR 的波点地球展柜" data-i18n-label="now.dotAirArtLabel"><span>DOT/AIR ● INFINITE SKY.</span></a></article></li>'''
p=R/'dist/now.html';s=p.read_text(encoding='utf-8');start=s.index('<ol ',s.index('id="timeline"'));end=s.index('>',start)+1;s=s[:end]+'\n'+now+s[end:];p.write_text(s,encoding='utf-8',newline='')
patch('scripts/build-motion.mjs',"    'nerf-page.bundle':'dist/nerf-page.entry.js'","    'nerf-page.bundle':'dist/nerf-page.entry.js',\n    'dot-air-globe.bundle':'dist/dot-air-globe-source.js'")
patch('scripts/build-motion.mjs','Built four scenes','Built five scenes')
patch('scripts/build-flow.mjs',"console.log(`Built", "await transform(await readFile(path.join(dist,'dot-air.css'),'utf8'),{loader:'css',target:'chrome110'});\nconsole.log(`Built")
patch('scripts/verify-flow-content.py',"def approved_publication_patches(relative,text):", "dot_air_path=ROOT/'design/dot-air-content-addition.json'\ndot_air=json.loads(dot_air_path.read_text(encoding='utf-8')) if dot_air_path.exists() else {}\n\ndef approved_publication_patches(relative,text):")
patch('scripts/verify-flow-content.py',"    for patch in patches:","    patches+=dot_air.get('protectedSourcePatches',{}).get(relative,[])\n    patches+=dot_air.get('htmlPatches',{}).get(relative,[])\n    for patch in patches:")
patch('scripts/verify-flow-content.py',"or relative in nabat.get('protectedSourcePatches',{}):","or relative in nabat.get('protectedSourcePatches',{}) or relative in dot_air.get('protectedSourcePatches',{}):")
(R/'design/dot-air-content-addition.json').write_text(json.dumps({'date':'2026-10-09','intent':'Explicit Dot Air Gallery, Now and Post addition. Old records retain exact content.','protectedSourcePatches':protected,'htmlPatches':htmlpatches},ensure_ascii=False,indent=2),encoding='utf-8')
p=R/'package.json';data=json.loads(p.read_text());data['version']='1.26.0';data['scripts']['test:dot-air']='node --test scripts/test-dot-air.mjs';data['scripts']['check:flow']+=' && node --check dist/dot-air-state.js && node --check dist/dot-air-content.js && node --check dist/dot-air-art.js && node --check dist/dot-air-entry.js && node --check dist/dot-air-globe-source.js';p.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='')
p=R/'package-lock.json';data=json.loads(p.read_text());data['version']='1.26.0';data['packages']['']['version']='1.26.0';p.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='')
patch('dist/sitemap.xml','</urlset>','  <url><loc>https://chefzc.dev/post.html?article=dot-air</loc><lastmod>2026-10-09</lastmod></url>\n</urlset>')
p=R/'dist/dot-air-art.js';s=p.read_text(encoding='utf-8').replace('width="1265" height="877"','width="1265" height="712"');p.write_text(s,encoding='utf-8',newline='')
print('Dot Air 10 / Now 030 / Post 18 integrated; version 1.26.0; additive preservation rules recorded.')
