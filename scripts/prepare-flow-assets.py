from pathlib import Path
import json, re, urllib.request, shutil
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
ART=ROOT/'dist/assets/flow'; ART.mkdir(parents=True,exist_ok=True)
source=Path(r'C:\Users\zzich\.codex\generated_images\01a115e2-63b3-7371-a2a0-107aef72856c\exec-4fcaf7fa-ba8e-4d4a-9568-77d206c2b6f3.png')
shutil.copy2(source,ROOT/'design/river-sculpture-source.png')
with Image.open(source) as image:
    assert image.mode=='RGBA', 'The sculpture must retain a genuine alpha channel'
    image.save(ART/'river-sculpture.webp',quality=91,method=6)

def get(url):
    request=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
    with urllib.request.urlopen(request,timeout=25) as response:return response.read()
font_url='https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/unbounded/Unbounded%5Bwght%5D.ttf'
font=get(font_url);assert font[:4]==b'\x00\x01\x00\x00'
font_path=ROOT/'dist/assets/fonts/unbounded-variable.ttf'
font_path.write_bytes(font)
from fontTools.ttLib import TTFont
from fontTools import subset
typeface=TTFont(font_path)
assert any(a.axisTag=='wght' and a.minValue==200 and a.maxValue==900 for a in typeface['fvar'].axes)
subsetter=subset.Subsetter(options=subset.Options())
subsetter.populate(unicodes=list(range(0x20,0x250))+list(range(0x2000,0x2070))+list(range(0x20a0,0x20d0)))
subsetter.subset(typeface);typeface.flavor=None;typeface.save(font_path)
license_url='https://cdn.jsdelivr.net/gh/google/fonts@main/ofl/unbounded/OFL.txt'
license_text=get(license_url).decode();assert 'SIL OPEN FONT LICENSE' in license_text
(ROOT/'dist/assets/fonts/OFL-Unbounded.txt').write_text(license_text,encoding='utf-8')
(ART/'SOURCES.json').write_text(json.dumps({'sculpture':{'source':'Built-in image_gen','original':str(source),'alpha':True,'output':'river-sculpture.webp','use':'Decorative original sculpture; never a product screenshot'},'font':{'family':'Unbounded','fileSource':font_url,'licenseSource':license_url,'license':'OFL-1.1','weightRange':[200,900],'subset':'Latin','adobeCandidate':'Obviously: catalog preview only; no Adobe web kit created'}},ensure_ascii=False,indent=2),encoding='utf-8')
print(f'Alpha sculpture: {(ART/"river-sculpture.webp").stat().st_size} bytes. Variable display font: {font_path.stat().st_size} bytes.')
