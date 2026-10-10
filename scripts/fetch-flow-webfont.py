from pathlib import Path
import urllib.request,re,json
ROOT=Path(__file__).resolve().parents[1]
url='https://fonts.googleapis.com/css2?family=Unbounded:wght@200..900&display=swap'
headers={'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'}
with urllib.request.urlopen(urllib.request.Request(url,headers=headers),timeout=25) as response: css=response.read().decode()
blocks=css.split('/* latin */')
assert len(blocks)>1 and 'font-weight: 200 900' in blocks[-1], 'Need the actual variable Latin face'
font_url=re.findall(r'url\((https://[^)]+)\)',blocks[-1])[0]
with urllib.request.urlopen(font_url,timeout=25) as response: font=response.read()
assert font[:4]==b'wOF2'
(ROOT/'dist/assets/fonts/unbounded-variable.woff2').write_bytes(font)
source_path=ROOT/'dist/assets/flow/SOURCES.json'
sources=json.loads(source_path.read_text(encoding='utf-8'));sources['font'].update(webSource=url,webFileSource=font_url,webFile='unbounded-variable.woff2',webBytes=len(font))
source_path.write_text(json.dumps(sources,ensure_ascii=False,indent=2),encoding='utf-8')
css_path=ROOT/'dist/flow.css'; flow=css_path.read_text(encoding='utf-8').replace("url('./assets/fonts/unbounded-variable.ttf') format('truetype')","url('./assets/fonts/unbounded-variable.woff2') format('woff2')")
css_path.write_text(flow,encoding='utf-8')
print(f'Variable Latin WOFF2 served by Google Fonts: {len(font)} bytes')
