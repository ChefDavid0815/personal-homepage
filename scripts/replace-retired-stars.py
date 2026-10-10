from pathlib import Path
import json,shutil
ROOT=Path(__file__).resolve().parents[1]
backup=ROOT/'design/before-star-removal-20261007';backup.mkdir(exist_ok=True)
rules={'✳':'∞','✦':'∞','hero-asterisk.png':'flow/river-loop.svg','荧光色与液态金属交织的星形雕塑':'色彩交汇、回环往复的川流图形','A sculptural asterisk in fluorescent colors and liquid chrome':'Interlocking currents in cobalt, pink and yellow'}
rules.update({'荧光绿与液态金属交织的星形雕塑，个人主页的视觉符号':'回环往复的彩色川流，个人主页的视觉符号','A fluorescent green and liquid-metal asterisk, the visual symbol of my personal website':'Interlocking coloured currents, the visual symbol of my personal website'})
revision_file=ROOT/'design/flow-authorized-art-revision.json'
previous=json.loads(revision_file.read_text(encoding='utf-8')) if revision_file.exists() else {}
changed=previous.get('changedSources',[])
sources=list((ROOT/'dist').iterdir())
for directory in ('when-to-reset','reset-history'):
    sources.extend((ROOT/'dist'/directory).glob('*'))
for file in sources:
    if file.suffix not in ('.html','.js','.css') or any(name in file.name for name in ('bundle','flow-legacy','motion-vendor')):continue
    text=file.read_bytes().decode('utf-8');updated=text
    for old,new in rules.items():updated=updated.replace(old,new)
    if updated!=text:
        relative=file.relative_to(ROOT/'dist');saved=backup/relative
        saved.parent.mkdir(parents=True,exist_ok=True)
        if not saved.exists():shutil.copy2(file,saved)
        file.write_bytes(updated.encode('utf-8'));changed.append(file.relative_to(ROOT).as_posix())
source=ROOT/'dist/assets/hero-asterisk.png';retired=ROOT/'design/retired-art/hero-asterisk.png';retired.parent.mkdir(exist_ok=True)
if source.exists():shutil.copy2(source,retired)
# The old source remains recoverable in the design archive, outside the served site.
if source.exists() and retired.exists() and source.read_bytes()==retired.read_bytes():source.unlink()
revision={'userRequest':'Remove the green star artwork and all decorative stars; improve low-contrast text.','textSubstitutions':rules,'retiredAssets':{'dist/assets/hero-asterisk.png':'design/retired-art/hero-asterisk.png'},'changedSources':sorted(set(changed)),'allowedScope':'Exact decorative symbol, artwork URL and artwork alt substitutions. All original prose, releases and measurements remain protected.'}
(ROOT/'design/flow-authorized-art-revision.json').write_text(json.dumps(revision,ensure_ascii=False,indent=2),encoding='utf-8')
print(f'Replaced decorative stars in {len(changed)} authored sources; retired raster archived.')
