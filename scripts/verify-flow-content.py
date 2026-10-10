"""Verify preservation against the actual pre-redesign working tree, not Git HEAD."""
from pathlib import Path
from html.parser import HTMLParser
from collections import Counter
import json, hashlib, sys
ROOT=Path(__file__).resolve().parents[1]
baseline=json.loads((ROOT/'design/before-dopamine-20261007/manifest.json').read_text(encoding='utf-8'))
revision=json.loads((ROOT/'design/flow-authorized-art-revision.json').read_text(encoding='utf-8'))
publication_path=ROOT/'design/flow-publication-addition.json'
publication=json.loads(publication_path.read_text(encoding='utf-8')) if publication_path.exists() else {}
nabat_path=ROOT/'design/nabat-content-addition.json'
nabat=json.loads(nabat_path.read_text(encoding='utf-8')) if nabat_path.exists() else {}
dot_air_path=ROOT/'design/dot-air-content-addition.json'
dot_air=json.loads(dot_air_path.read_text(encoding='utf-8')) if dot_air_path.exists() else {}
retirement_path=ROOT/'design/aer-removal-20261009.json'
retirement=json.loads(retirement_path.read_text(encoding='utf-8')) if retirement_path.exists() else {}

dot_air_v11_path=ROOT/'design/dot-air-v11-addition.json'
dot_air_v11=json.loads(dot_air_v11_path.read_text(encoding='utf-8')) if dot_air_v11_path.exists() else {}

current_path=ROOT/'design/current-redesign-20261010.json'
redesign=json.loads(current_path.read_text(encoding='utf-8')) if current_path.exists() else {}

ac8_path=ROOT/'design/ac8-content-addition.json'
ac8=json.loads(ac8_path.read_text(encoding='utf-8')) if ac8_path.exists() else {}

def approved_publication_patches(relative,text):
    patches=list(publication.get('protectedSourcePatches',{}).get(relative,[]))
    if relative=='dist/now.html':patches+=publication.get('nowHeaderPatches',[])
    patches+=nabat.get('protectedSourcePatches',{}).get(relative,[])
    patches+=nabat.get('htmlPatches',{}).get(relative,[])
    patches+=dot_air.get('protectedSourcePatches',{}).get(relative,[])
    patches+=dot_air.get('htmlPatches',{}).get(relative,[])
    patches+=retirement.get('protectedSourcePatches',{}).get(relative,[])
    patches+=retirement.get('htmlPatches',{}).get(relative,[])
    patches+=dot_air_v11.get('htmlPatches',{}).get(relative,[])
    patches+=ac8.get('htmlPatches',{}).get(relative,[])
    for patch in patches:
        if text.count(patch['find'])!=1:raise ValueError(f'Publication patch no longer matches exactly once: {relative}')
        text=text.replace(patch['find'],patch['replace'],1)
    return text
def approved_art_substitutions(text):
    for old,new in revision['textSubstitutions'].items():text=text.replace(old,new)
    return text
class Content(HTMLParser):
    def __init__(self):super().__init__(convert_charrefs=True);self.text=[];self.links=[];self.ids=[];self.ignore=0
    def handle_starttag(self,tag,attrs):
        attrs=dict(attrs)
        if tag in ('style','script'):self.ignore+=1
        if 'href' in attrs and tag=='a':self.links.append(attrs['href'])
        if 'id' in attrs:self.ids.append(attrs['id'])
    def handle_endtag(self,tag):
        if tag in ('style','script'):self.ignore=max(0,self.ignore-1)
    def handle_data(self,value):
        if not self.ignore and value.strip():self.text.append(value.strip())
errors=[];pages=0;frozen=0;authorized=[];archived=[];publication_changes=[]
for relative,record in baseline.items():
    path=ROOT/relative
    if not path.exists():
        archive=revision['retiredAssets'].get(relative) or retirement.get('retiredAssets',{}).get(relative)
        saved=ROOT/archive if archive else None
        if saved and saved.exists() and hashlib.sha256(saved.read_bytes()).hexdigest()==record['sha256']:
            archived.append(relative)
        else:errors.append(f'Missing file: {relative}')
        continue
    if path.suffix=='.html':
        source=ROOT/'design/before-dopamine-20261007'/relative
        if source.exists():
            old=Content();old.feed(approved_publication_patches(relative,approved_art_substitutions(source.read_text(encoding='utf-8'))))
            current=Content();current.feed(path.read_text(encoding='utf-8'))
            for kind in ('text','links','ids'):
                approved_removed=Counter(retirement.get('allowedHtmlRemovals',{}).get(relative,{}).get(kind,[]))+Counter(redesign.get('allowedHtmlRemovals',{}).get(relative,{}).get(kind,[]))
                missing=(Counter(getattr(old,kind))-approved_removed)-Counter(getattr(current,kind))
                if missing:errors.append(f'{relative} lost {kind}: {dict(missing)}')
            if len(current.ids)!=len(set(current.ids)):errors.append(f'Duplicate IDs in {relative}')
            pages+=1
    # The redesign must not mutate any authored project/music/post data or embedded apps/assets.
    tool_pages={'dist/when-to-reset/index.html','dist/reset-history/index.html'}
    immutable=(path.parent.name!='dist' and relative not in tool_pages) or path.name.endswith(('-content.js','-data.js','-releases.js')) or path.name=='projects.js'
    if immutable:
        digest=hashlib.sha256(path.read_bytes()).hexdigest()
        if digest==record['sha256']:frozen+=1
        elif redesign.get('revisedFiles',{}).get(relative)==digest:authorized.append(relative)
        elif relative in revision['changedSources'] or relative in publication.get('protectedSourcePatches',{}) or relative in nabat.get('protectedSourcePatches',{}) or relative in dot_air.get('protectedSourcePatches',{}) or relative in retirement.get('protectedSourcePatches',{}):
            source=ROOT/'design/before-dopamine-20261007'/relative
            if source.exists() and approved_publication_patches(relative,approved_art_substitutions(source.read_text(encoding='utf-8')))==path.read_text(encoding='utf-8'):
                authorized.append(relative)
                if relative in publication.get('protectedSourcePatches',{}):publication_changes.append(relative)
            else:errors.append(f'Beyond authorized decorative revision: {relative}')
        else:errors.append(f'Frozen content/asset changed: {relative}')
report={'baseline':'before-dopamine-20261007','pagesWithPreservedAuthorizedTextLinksAndIds':pages,'unchangedContentAndAssets':frozen,'authorizedDecorativeOrAdditiveRevisions':authorized,'authorizedNewPostRegistration':publication_changes,'archivedRetiredAssets':archived,'explicitAERRetirement':retirement.get('counts'),'currentCountsAfterDotAir11':dot_air_v11.get('counts'),'errors':errors}
(ROOT/'design/flow-content-verification.json').write_text(json.dumps(report,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps(report,ensure_ascii=False,indent=2));sys.exit(bool(errors))
