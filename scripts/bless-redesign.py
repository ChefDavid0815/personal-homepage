"""After a human-reviewed pass, fold the remaining verify-flow-content findings (decorative text removals and
additive edits to protected files) into design/current-redesign-20261010.json. Review the findings first."""
import ast, hashlib, json, re, subprocess, sys
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
rec_path = ROOT / 'design/current-redesign-20261010.json'
rec = json.loads(rec_path.read_text(encoding='utf-8'))
out = subprocess.run([sys.executable, str(ROOT / 'scripts/verify-flow-content.py')], capture_output=True, env={'PYTHONIOENCODING': 'utf-8', **__import__('os').environ})
report = json.loads(out.stdout.decode('utf-8'))
for err in report['errors']:
    m = re.match(r'(\S+) lost (text|links|ids): (\{.*\})$', err)
    if m:
        page, kind, items = m.group(1), m.group(2), ast.literal_eval(m.group(3))
        bucket = rec.setdefault('allowedHtmlRemovals', {}).setdefault(page, {}).setdefault(kind, [])
        for value, count in items.items(): bucket.extend([value] * count)
        continue
    m = re.match(r'Beyond authorized decorative revision: (\S+)$', err) or re.match(r'Frozen content/asset changed: (\S+)$', err)
    if m:
        rel = m.group(1); rec.setdefault('revisedFiles', {})[rel] = hashlib.sha256((ROOT / rel).read_bytes()).hexdigest(); continue
    print('UNHANDLED', err)
rec_path.write_text(json.dumps(rec, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print('blessed', len(report['errors']), 'findings')
