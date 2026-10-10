"""User-authorized retirement of AER from the portfolio, with exact recoverable evidence."""
from pathlib import Path
from html.parser import HTMLParser
import json,hashlib,shutil,re
R=Path(__file__).resolve().parents[1];D=R/'dist';B=R/'design/aer-removal-20261009'
if (R/'design/aer-removal-20261009.json').exists():raise SystemExit('AER already retired; do not overwrite its original backup.')
B.mkdir(parents=True,exist_ok=True)
manifest={};removed={};patches={};htmlpatches={}
def backup(p):
    rel=p.relative_to(R).as_posix();q=B/rel;q.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(p,q);manifest[rel]=hashlib.sha256(p.read_bytes()).hexdigest()
for p in D.glob('*'):
    if p.is_file():backup(p)
for p in (D/'assets/projects/aer').rglob('*'):
    if p.is_file():backup(p)
backup(R/'design/flow-styles.json');backup(R/'package.json');backup(R/'scripts/verify-flow-content.py')
class Inventory(HTMLParser):
    def __init__(self):super().__init__(convert_charrefs=True);self.text=[];self.links=[];self.ids=[];self.ignored=0
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if tag in ('style','script'):self.ignored+=1
        if tag=='a' and 'href' in a:self.links.append(a['href'])
        if 'id' in a:self.ids.append(a['id'])
    def handle_endtag(self,tag):
        if tag in ('style','script'):self.ignored=max(0,self.ignored-1)
    def handle_data(self,s):
        if not self.ignored and s.strip():self.text.append(s.strip())
def inventory(s):
    parser=Inventory();parser.feed(s);return {k:getattr(parser,k) for k in ['text','links','ids']}
class TimelineRanges(HTMLParser):
    def __init__(self,s):
        super().__init__();self.s=s;self.offsets=[0];self.depth=0;self.start=None;self.ranges=[]
        for m in re.finditer('\n',s):self.offsets.append(m.end())
    def position(self):l,c=self.getpos();return self.offsets[l-1]+c
    def handle_starttag(self,tag,attrs):
        if tag=='li':
            if self.start is None and 'timeline-entry' in dict(attrs).get('class','').split():self.start=self.position();self.depth=1
            elif self.start is not None:self.depth+=1
    def handle_endtag(self,tag):
        if tag=='li' and self.start is not None:
            self.depth-=1
            if self.depth==0:self.ranges.append((self.start,self.position()+5));self.start=None
def edit(file,find,replace,protected=False,html=False):
    p=R/file;s=p.read_text(encoding='utf-8');assert s.count(find)==1,(file,find[:90]);p.write_text(s.replace(find,replace,1),encoding='utf-8',newline='')
    if protected:patches.setdefault(file,[]).append({'find':find,'replace':replace})
    if html:htmlpatches.setdefault(file,[]).append({'find':find,'replace':replace})
edit('dist/projects.js',"import {aerProject} from './aer-content.js';\n",'',True)
edit('dist/projects.js','  aerProject,\n','',True)
edit('dist/posts-data.js',"import {aerPost} from './aer-post.js';\n",'',True)
edit('dist/posts-data.js','  aerPost,\n','',True)
p=D/'now.html';s=p.read_text(encoding='utf-8');parser=TimelineRanges(s);parser.feed(s);ranges=[(a,b) for a,b in parser.ranges if 'milestone--aer' in s[a:b]];assert len(ranges)==2
removed['dist/now.html']=inventory(''.join(s[a:b] for a,b in ranges))
for a,b in reversed(ranges):s=s[:a]+s[b:]
s=s.replace('  <script type="module" src="./aer-entry.js"></script>','');p.write_text(s,encoding='utf-8',newline='')
edit('dist/now.html','/</span> 30</span>','/</span> 28</span>',html=True)
for a,b in [('030','028'),('029','027'),('028','026')]:
    # Select by the corresponding new content key; the old timeline is left untouched.
    key={'030':'dotAirKicker','029':'nabatKicker','028':'flowKicker'}[a]
    p=D/'now.html';s=p.read_text(encoding='utf-8');pattern=rf'(data-i18n="now\.{key}".*?</span><span>){a}(</span>)';s,n=re.subn(pattern,rf'\g<1>{b}\2',s,count=1);assert n==1,(a,key);p.write_text(s,encoding='utf-8',newline='')
edit('dist/dot-air-content.js',"number:'10'","number:'09'")
edit('dist/dot-air-content.js',"number:'18'","number:'17'")
edit('dist/dot-air-content.js','DOT/AIR 波点地球、AER 玻璃航班探索、AfterImage 赛车影像档案，以及十件主展厅作品。','DOT/AIR 波点地球、AfterImage 赛车影像档案，以及九件主展厅作品。')
edit('dist/dot-air-content.js','DOT/AIR’s dotted Earth, AER flight exploration, the AFTERIMAGE archive, and ten works','DOT/AIR’s dotted Earth, the AFTERIMAGE archive, and nine works')
edit('dist/nabat-content.js',"number:'17'","number:'16'")
edit('dist/flow-release.js',"number: '16'","number: '15'")
p=D/'dot-air-art.js';s=p.read_text(encoding='utf-8').replace('030 / DEPARTURE','028 / DEPARTURE').replace('10 / A PERSONAL FLIGHT ATLAS','09 / A PERSONAL FLIGHT ATLAS').replace('PROJECT 10 /','PROJECT 09 /');p.write_text(s,encoding='utf-8',newline='')
edit('dist/gallery.html','10 WORKS · 01 LIVE SITE','09 WORKS · 01 LIVE SITE',html=True)
p=D/'gallery.html';s=p.read_text(encoding='utf-8');s=s.replace('AER 的透明玻璃航班探索、AfterImage 赛车影像档案，以及十件主展厅作品。','DOT/AIR 的波点航空探索、AfterImage 赛车影像档案，以及九件主展厅作品。');p.write_text(s,encoding='utf-8',newline='')
p=D/'gallery.js';s=p.read_text(encoding='utf-8')
s=re.sub(r"^.*(?:aerCard|aer-motion\.js|aerEditions|aerCarrier|aer:render|changeAerAirline).*(?:\n|$)",'',s,flags=re.M)
s=s.replace(", 'aer-dialog'",'')
a=s.index('function openAerFromHash()');b=s.index('\nfunction openProject(',a)
s=s[:a]+"function openDotAirFromHash() {\n  if(location.hash==='#project-dot-air')requestAnimationFrame(()=>requestAnimationFrame(()=>grid.querySelector('#project-dot-air')?.scrollIntoView({block:'start',behavior:'auto'})));\n}\n"+s[b:]
s=s.replace('openAerFromHash','openDotAirFromHash')
# Removal is surgical: old AER-specific branch only.
s=re.sub(r"^.*if\(projectId === 'aer'\).*(?:\n|$)",'',s,flags=re.M)
s=re.sub(r"^\s*if\(aerButton\).*(?:\n|$)",'',s,flags=re.M)
p.write_text(s,encoding='utf-8',newline='')
p=D/'posts.js';s=p.read_text(encoding='utf-8');s=re.sub(r"^import .*aer-.*\n",'',s,flags=re.M);s=re.sub(r"^\s*if\(item.theme === 'aer'\).*\n",'',s,flags=re.M)
a=s.index("  if(post.theme === 'aer') {");b=s.index("  if(post.theme === 'nerf')",a);s=s[:a]+s[b:];s=s.replace(" document.dispatchEvent(new Event('aer:render'));",'').replace('AER 玻璃航班探索','DOT/AIR 波点航空探索').replace('AER flight exploration','DOT/AIR flight exploration');p.write_text(s,encoding='utf-8',newline='')
p=D/'i18n.js';s=p.read_text(encoding='utf-8').replace("import {aerMessages} from './aer-content.js';\n",'').replace('aerMessages, ','');p.write_text(s,encoding='utf-8',newline='')
p=D/'site-routes.js';s=p.read_text(encoding='utf-8');s=re.sub(r"^.*\{id:'aer'.*\n",'',s,flags=re.M);p.write_text(s,encoding='utf-8',newline='')
p=D/'site-catalog.js';s=p.read_text(encoding='utf-8').replace("'post','explore','aer','nerf'","'post','explore','nerf'").replace("project.id==='aer'?'./aer.html':projectHref(project.id)","projectHref(project.id)");p.write_text(s,encoding='utf-8',newline='')
p=D/'site-navigation.js';s=p.read_text(encoding='utf-8').replace('DOT/AIR、AER、Roseraie','DOT/AIR、Roseraie').replace('DOT/AIR, AER, Roseraie','DOT/AIR, Roseraie').replace("(projects.length===10?'十':String(projects.length))","(['零','一','二','三','四','五','六','七','八','九','十'][projects.length]||String(projects.length))");p.write_text(s,encoding='utf-8',newline='')
p=D/'sitemap.xml';s=p.read_text(encoding='utf-8');s=re.sub(r'^.*(?:/aer.html|article=aer).*\n','',s,flags=re.M);p.write_text(s,encoding='utf-8',newline='')
p=D/'aer.html';removed['dist/aer.html']=inventory(p.read_text(encoding='utf-8'));p.write_text('<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=./gallery.html#project-dot-air"><title>作品已更新 — ChefZC</title></head><body><p>这一展位已更新。<a href="./gallery.html#project-dot-air">走进 DOT/AIR 的波点天空 ↗</a></p></body></html>\n',encoding='utf-8',newline='')
retired={}
files=[p for p in D.glob('aer*') if p.is_file() and p.name!='aer.html']
files+=list((D/'assets/projects/aer').rglob('*'))
for p in files:
    if not p.is_file():continue
    resolved=p.resolve();assert resolved.is_relative_to(D.resolve())
    rel=p.relative_to(R).as_posix();saved=B/rel;assert saved.exists() and hashlib.sha256(saved.read_bytes()).hexdigest()==hashlib.sha256(p.read_bytes()).hexdigest()
    retired[rel]=saved.relative_to(R).as_posix();p.unlink()
assetdir=(D/'assets/projects/aer').resolve();assert assetdir.is_relative_to((D/'assets/projects').resolve());shutil.rmtree(assetdir)
p=R/'design/flow-styles.json';data=json.loads(p.read_text());data.pop('aer.html',None)
for k in data:data[k]=[v for v in data[k] if not v.startswith('./aer')]
p.write_text(json.dumps(data,indent=2)+'\n',encoding='utf-8')
p=R/'package.json';data=json.loads(p.read_text());data['scripts']['check']=re.sub(r' && node --check dist/aer[-\w.]+','',data['scripts']['check']);p.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
record={'date':'2026-10-09','authorization':'User explicitly requested removing original AER exhibit, all its Now entries and its Post. Only AER is retired. Other original contents remain protected.','retiredAssets':retired,'protectedSourcePatches':patches,'htmlPatches':htmlpatches,'allowedHtmlRemovals':removed,'backupHashes':manifest,'counts':{'gallery':9,'now':28,'posts':17},'numbering':'Newer records close the removed AER slots; all earlier entries retain their existing order and number.'}
(R/'design/aer-removal-20261009.json').write_text(json.dumps(record,ensure_ascii=False,indent=2),encoding='utf-8')
print('AER retired: 1 exhibit, 2 timeline entries, 1 note. Backup verified:',len(retired),'runtime files. Remaining 9 / 28 / 17.')
