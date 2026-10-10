"""Capture the current working tree, including uncommitted content, before redesign."""
from pathlib import Path
from html.parser import HTMLParser
import hashlib, json, shutil, subprocess

ROOT = Path(__file__).resolve().parents[1]
SNAPSHOT = ROOT / 'design' / 'before-dopamine-20261007'
SNAPSHOT.mkdir(parents=True, exist_ok=False)

class Content(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.text, self.links, self.ids, self.ignore = [], [], [], 0
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ('style', 'script'): self.ignore += 1
        if 'href' in attrs: self.links.append(attrs['href'])
        if 'id' in attrs: self.ids.append(attrs['id'])
    def handle_endtag(self, tag):
        if tag in ('style', 'script'): self.ignore = max(0, self.ignore - 1)
    def handle_data(self, value):
        if not self.ignore and value.strip(): self.text.append(value.strip())

manifest = {}
for file in sorted((ROOT / 'dist').rglob('*')):
    if not file.is_file(): continue
    relative = file.relative_to(ROOT).as_posix()
    manifest[relative] = {'bytes': file.stat().st_size, 'sha256': hashlib.sha256(file.read_bytes()).hexdigest()}
    # All authored root sources and reset tools are recoverable. Large embedded apps/assets are hash recorded.
    if file.parent == ROOT / 'dist' or (file.suffix in ('.html','.js','.css') and file.parent.name in ('when-to-reset','reset-history')):
        dest = SNAPSHOT / relative
        dest.parent.mkdir(parents=True, exist_ok=True)
        shutil.copy2(file, dest)
    if file.suffix == '.html':
        parser = Content(); parser.feed(file.read_text(encoding='utf-8'))
        manifest[relative].update(text=parser.text, links=parser.links, ids=parser.ids)
for relative in ('package.json','design/design-contract.json','design/verification.md'):
    source = ROOT / relative
    if source.exists():
        dest = SNAPSHOT / relative; dest.parent.mkdir(parents=True, exist_ok=True); shutil.copy2(source, dest)
(SNAPSHOT / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2), encoding='utf-8')
(SNAPSHOT / 'working-tree.patch').write_bytes(subprocess.check_output(['git','diff','--binary'], cwd=ROOT))
print(f'Snapshot saved: {SNAPSHOT} | {len(manifest)} files recorded')
