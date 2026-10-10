"""Build the shared editable NABAT cover and reviewable GitHub documentation."""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
import base64, json, hashlib, shutil, subprocess

SITE=Path(__file__).resolve().parents[1]
SOFTWARE=Path('E:/INJAZ')
WORK=SITE.parent/'.release-work/nabat-20261009'
PROFILE=WORK/'profile'
ASSETS=SITE/'dist/assets/projects/nabat'
fonts={}
for key,file,weight in [('serif','fraunces-latin.woff2',450),('sans','geist-latin.woff2',500)]:
    font=TTFont(ASSETS/file)
    axes={axis.axisTag:axis.defaultValue for axis in font['fvar'].axes}
    axes['wght']=weight
    if 'opsz' in axes:axes['opsz']=96
    fonts[key]=(font,font.getGlyphSet(location=axes),font.getBestCmap())
def lettering(text,x,y,size,family='serif',color='#153d32',tracking=0):
    font,glyphs,cmap=fonts[family]
    scale=size/font['head'].unitsPerEm
    advance=0;paths=[]
    for char in text:
        name=cmap.get(ord(char),'space')
        pen=SVGPathPen(glyphs);glyphs[name].draw(pen)
        if pen.getCommands():paths.append(f'<path d="{pen.getCommands()}" transform="translate({advance:.3f} 0)"/>')
        advance+=glyphs[name].width+tracking/scale
    return f'<g aria-label="{text}" fill="{color}" transform="translate({x} {y}) scale({scale:.6f} {-scale:.6f})">'+''.join(paths)+'</g>'

photo=base64.b64encode((SITE/'design/nabat-monstera-embedded.jpg').read_bytes()).decode()
mark='M23 4C4 16 2 38 23 49c21-11 19-33 0-45Z M23 5v44 M8 20l15 17 15-17 M12 11l11 15 11-15 M39 28q8-9 0-18 M43 33q13-13 0-27'
svg='''<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1600 760" role="img" aria-labelledby="title desc">
<title id="title">NABAT 1.1 — My INJAZ business competition work</title>
<desc id="desc">Ivory and botanical green. Original NABAT type, leaf/radio identity, a synthetic Monstera specimen and a living tag connect field care with native operations.</desc>
<defs><clipPath id="plant-window"><path d="M815 681V362C815 210 929 142 1102 142H1600V681Z"/></clipPath></defs>
<style>.signal{stroke-dasharray:140 500;animation:current 12s linear infinite}.tag-sway{transform-box:fill-box;transform-origin:50% 0%;animation:sway 9s ease-in-out infinite}@keyframes current{to{stroke-dashoffset:-640}}@keyframes sway{0%,100%{transform:rotate(-3deg)}50%{transform:rotate(3deg)}}@media(prefers-reduced-motion:reduce){.signal,.tag-sway{animation:none}}</style>
<rect width="1600" height="760" rx="12" fill="#f7f6ef"/>
<path d="M40 112H1560M40 704H1560" stroke="#d9dfd2"/>
<g opacity=".065" fill="none" stroke="#153d32" stroke-width="2" transform="translate(-122 383) scale(1.13)"><path d="M308 30C58 193 44 422 308 600 572 422 558 193 308 30ZM308 35V591M101 225L308 443 515 225M157 126L308 331 459 126"/></g>'''
svg+=lettering('CHEFZC / THE INJAZ COLLECTION',70,77,17,'sans',tracking=1.7)
svg+=lettering('1.1.0 / NATIVE OPERATIONS',1225,77,13,'sans',tracking=.7)
svg+=f'<g transform="translate(70 170) scale(1.65)" fill="none" stroke="#153d32" stroke-width="1.6" stroke-linecap="round"><path d="{mark}"/></g>'
svg+=lettering('NABAT',166,290,167,tracking=-3)
svg+='<circle cx="752" cy="278" r="12" fill="#ad571d"/>'
svg+=lettering('Every plant',70,409,66)
svg+=lettering('has a history.',70,489,66)
svg+=lettering('A small tag. A record that keeps growing.',70,545,18,'sans')
svg+=lettering('MY INJAZ BUSINESS',70,625,14,'sans',tracking=1)
svg+=lettering('COMPETITION WORK / CHEFZC',70,647,14,'sans',tracking=1)
svg+=f'<image x="742" y="142" width="899" height="539" preserveAspectRatio="xMidYMid slice" clip-path="url(#plant-window)" xlink:href="data:image/jpeg;base64,{photo}"/>'
svg+='<path d="M791 661C784 557 771 419 854 380C912 353 958 434 920 468" class="signal" fill="none" stroke="#ad571d" stroke-width="2"/>'
svg+='<g transform="translate(721 481)"><path d="M74 -70V0" stroke="#688061"/><g class="tag-sway"><rect width="148" height="181" rx="17" fill="#153d3220" transform="translate(5 6)"/><rect width="148" height="181" rx="17" fill="#f7f6ef" stroke="#96aa8c"/>'
svg+=f'<g transform="translate(53 21) scale(.9)" fill="none" stroke="#153d32" stroke-width="1.6" stroke-linecap="round"><path d="{mark}"/></g>'
svg+=lettering('NABAT',31,104,24,tracking=1)
svg+=lettering('NAB-004',48,133,10,'sans',tracking=1)
svg+='<path d="M78 151q9 9 0 18M85 147q14 14 0 26" fill="none" stroke="#153d32" stroke-width="1.6" stroke-linecap="round"/></g></g>'
svg+=lettering('A LIVING RECORD / FIELD CARE',70,735,12,'sans',tracking=1.3)
svg+=lettering('WINDOWS / WEB / GROWING WITH CARE.',1173,735,11,'sans',tracking=.4)
svg+='</svg>'
(SITE/'design/nabat-cover.svg').write_text(svg,encoding='utf-8',newline='')
(ASSETS/'cover.svg').write_text(svg,encoding='utf-8',newline='')
(SOFTWARE/'docs/assets').mkdir(parents=True,exist_ok=True)
(PROFILE/'assets').mkdir(parents=True,exist_ok=True)
for target in [SOFTWARE/'docs/assets/cover.svg',PROFILE/'assets/nabat.svg']:
    target.write_text(svg,encoding='utf-8',newline='')
shutil.copy2(ASSETS/'home-native.png',SOFTWARE/'docs/assets/operations-home.png')
shutil.copy2(ASSETS/'tags-native.png',SOFTWARE/'docs/assets/tag-studio.png')
shutil.copy2(ASSETS/'compare-native.png',SOFTWARE/'docs/assets/compare.png')
shutil.copy2(ASSETS/'home-native.png',PROFILE/'assets/nabat-native.png')

# Preserve the original technical README as an explicitly historical reference.
archive=SOFTWARE/'docs/TECHNICAL-V1.md'
if not archive.exists():
    (WORK/'repository-before').mkdir(parents=True,exist_ok=True)
    shutil.copy2(SOFTWARE/'README.md',WORK/'repository-before/README.md')
    original=(SOFTWARE/'README.md').read_text(encoding='utf-8')
    archive.write_text('# Historical V1 technical reference\n\nThis preserves the original V1 setup notes. Provider configuration and offline behavior described here may predate 1.1. Use the current README and Operations guide for the active pilot.\n\n'+original,encoding='utf-8',newline='')

en_repo="""<a href="https://nabat-injaz.vercel.app/"><img src="docs/assets/cover.svg" width="100%" alt="NABAT 1.1 — ivory, botanical green and a living identity. My INJAZ business competition work." /></a>

<p align="center"><b>English</b> · <a href="README.zh-CN.md">简体中文</a></p>
<p align="center"><a href="https://nabat-injaz.vercel.app/"><b>EXPLORE NABAT ↗</b></a> · <a href="https://chefzc.dev/school-gallery.html#project-nabat">THE LIVING EXHIBITION ↗</a> · <a href="docs/OPERATIONS.md">OPERATIONS GUIDE</a> · <a href="https://chefzc.dev/post.html?article=nabat">FIELD NOTES ↗</a></p>

# NABAT · Every plant, known.

**My INJAZ business competition work.** A small NFC / QR tag connects a plant to its identity, observations, care and the history that follows. **1.1.0 / Operations / Pilot.** Mobile field care and a native Windows workspace share the same authorised plant record.

Ivory, deep botanical green, chlorophyll and saffron; editorial type and precise instruments. The plant stays at the centre, from the first tag to the next pair of caring hands.

## 01 / A living record

| Workspace | What it does |
| :--- | :--- |
| **Plant identity** | Stable NFC / QR links, public-safe passports, replacement labels and history that follows the plant. |
| **Mobile field care** | Photos, observations and care records; an already-open authenticated page can retain pending care during a connection loss. |
| **Native Windows** | WinUI 3 Operations Home, Today / maintenance, virtualised plant explorer and independent profile windows. |
| **Evidence & comparison** | Linked image comparison, actual-time history and analysis provenance; unavailable evidence remains unavailable. |
| **Places & people** | Location plans, plant pins, reviewed batches, shared tasks, team capabilities and accountable handovers. |
| **Tag Studio** | Printable QR designs and NFC programming simulation; hardware write/read-back is a separate verification step. |
| **Continuity** | Scoped SQLite cache and durable care outbox, with retries, receipts and explicit conflict review. |

<img src="docs/assets/operations-home.png" width="100%" alt="Actual NABAT 1.1 native Windows Operations Home, using the synthetic NABAT Demo Hotel workspace" />

<details><summary><b>Tag Studio / 标签工坊</b></summary>

<img src="docs/assets/tag-studio.png" width="100%" alt="Actual native NABAT Tag Studio with synthetic plant identities and printable tags" />

</details>

<details><summary><b>Observation comparison / 观察对照</b></summary>

<img src="docs/assets/compare.png" width="100%" alt="Actual native NABAT observation comparison, with synthetic records explicitly labelled" />

</details>

These are captures of the actual running WinUI XAML content, excluding the operating system window frame. Botanical images and demonstration observations are **synthetic**; they are not measured plant results. The cover is an editable brand illustration using the original NABAT specimen and type.

## 02 / Start a collection

The **[public website](https://nabat-injaz.vercel.app/)** introduces NABAT. Register or sign in to use a private plant workspace. Photos remain private; public passports disclose only the explicitly enabled identity fields.

For a local, isolated demonstration, use Node.js 22.23 or newer:

```powershell
npm ci
npm run dev:operations
```

Open **http://127.0.0.1:3001** and choose **Explore the demo**. The script isolates the synthetic local database, storage and analysis provider from cloud credentials. Saved demonstration interactions persist.

The existing native Windows builds are in `windows/artifacts/`. Extract the whole x64 portable folder, not only its EXE. `windows/Start-Nabat.ps1` starts the isolated server and native app; [native build and package instructions](docs/OPERATIONS_RELEASE.md) describe the self-contained x64 / ARM64 folders and unsigned MSIX packages. The verified Windows x64 portable pilot is available at https://github.com/ChefDavid0815/nabat-injaz/releases/tag/v1.1.0. MSIX and ARM64 build instructions are preserved; those packages are not included in the public download.

## 03 / Care with context

- Identity survives a label replacement and an authorised ownership handover.
- A photo or care event is saved separately from analysis availability. An unavailable external provider does not become an invented score.
- Longitudinal signals require comparable provider/model/contract, usable observations and declared viewpoint/lighting. Health scores are heuristic estimates, not calibrated biological measurements.
- Roles and capabilities protect each private workspace. Windows sessions use OS-bound credential storage; pending work remains scoped to its original actor and workspace.
- Local continuity covers recent cached records and care replay. Uncached originals, new imports and a fresh offline private-web launch are separate limitations.

The existing Workspace Agent integration is configured, but its last established external trigger failure was HTTP 409. This repository does not claim that subscribed inference availability has recovered. Physical NFC writing, trusted signed installation, physical printing and ARM64 execution remain unverified.

## 04 / Build and verify

Web / API: Next.js 16, React 19, TypeScript, PostgreSQL and private media storage. Native client: WinUI 3, Windows App SDK 2.5.1, .NET 10 and SQLite. One shared domain API keeps identities and care history connected.

```powershell
npm test
npm run typecheck
npm run lint
npm run contract:check
npm run build
```

On **2026.10.09**, the existing TypeScript domain suite passed **67 tests**. The [1.1 acceptance record](docs/qa/operations/VERIFICATION.md), dated October 4, separately records 25 C# tests, eight browser checks and published x64 native rendering, process restart and cloud care acknowledgement. Those recorded native checks are not a new physical-hardware certification.

[Architecture](docs/ARCHITECTURE.md) · [Operations](docs/OPERATIONS.md) · [Deployment](docs/DEPLOYMENT.md) · [Original V1 technical notes](docs/TECHNICAL-V1.md) · [Asset provenance](docs/design/ASSETS.md)

## 05 / The INJAZ collection

**Made by ChefZC for the INJAZ business competition.**

[School exhibit ↗](https://chefzc.dev/school-gallery.html#project-nabat) · [Now 029 ↗](https://chefzc.dev/now.html#milestone-nabat) · [Botanical field notes ↗](https://chefzc.dev/post.html?article=nabat)

**Small care. Lasting change. — ChefZC**
"""
zh_repo="""<a href="https://nabat-injaz.vercel.app/"><img src="docs/assets/cover.svg" width="100%" alt="NABAT 1.1：象牙白、植物绿与会生长的身份档案。我的 INJAZ 商赛作品。" /></a>

<p align="center"><a href="README.md">English</a> · <b>简体中文</b></p>
<p align="center"><a href="https://nabat-injaz.vercel.app/"><b>进入 NABAT ↗</b></a> · <a href="https://chefzc.dev/school-gallery.html#project-nabat">生长档案展柜 ↗</a> · <a href="docs/OPERATIONS.md">工作台指南</a> · <a href="https://chefzc.dev/post.html?article=nabat">植物手记 ↗</a></p>

# NABAT · 让每一株，都被记得。

**这是我的 INJAZ 商赛作品。** 一枚小小的 NFC / QR 标签，把植物的身份、观察、照护与之后的历史连在一起。**1.1.0 / Operations / 试点版。** 现场的移动端与原生 Windows 工作台，围绕同一个经过授权的植物档案工作。

象牙白、深植物绿、叶绿素色与一点藏红花色。编辑式字形与精确的观察仪表，让一株植物始终留在故事中央。

## 01 / 一本会生长的档案

| 工作区 | 可以做什么 |
| :--- | :--- |
| **植物身份** | 稳定的 NFC / QR 入口、安全的公开身份页、标签替换与持续历史。 |
| **现场照护** | 照片、观察和照护记录；已打开并登录的移动页面断网后可保留待同步照护。 |
| **原生 Windows** | WinUI 3 照护首页、今日任务、养护会话、虚拟化植物目录与独立档案窗口。 |
| **影像与证据** | 联动的照片对照、真实时间的记录与分析来源；没有提供的证据不会被补画。 |
| **地点与协作** | 地点平面图、植物位置、经过审查的批量操作、团队任务与历史交接。 |
| **标签工坊** | 可打印 QR 设计与 NFC 编程模拟；物理写入及读回属于独立硬件验证。 |
| **本机连续性** | 按身份隔离的 SQLite 缓存与持久照护队列；重试、回执与冲突清楚可见。 |

<img src="docs/assets/operations-home.png" width="100%" alt="NABAT 1.1 原生 Windows 照护工作台的实际界面，使用 NABAT Demo Hotel 合成样例工作区" />

<details><summary><b>标签工坊 / Tag Studio</b></summary>

<img src="docs/assets/tag-studio.png" width="100%" alt="真实原生 NABAT 标签工坊，展示合成植物身份与可打印标签" />

</details>

<details><summary><b>观察对照 / Observation comparison</b></summary>

<img src="docs/assets/compare.png" width="100%" alt="真实原生 NABAT 影像对照界面，合成观察记录有明确说明" />

</details>

以上为实际运行的 WinUI XAML 内容截图，不包含操作系统窗口框。植物品牌图与演示观察为**合成样例**，不是实际植物测量。封面沿用原有 NABAT 植物样图与字体，是可编辑的品牌插画。

## 02 / 开始一座植物收藏

**[公开网站](https://nabat-injaz.vercel.app/)** 可以直接浏览品牌介绍。注册或登录后使用个人植物工作区；照片保持私密，公开身份页只展示明确允许的字段。

本地演示建议使用 Node.js 22.23 或更新版本：

```powershell
npm ci
npm run dev:operations
```

打开 **http://127.0.0.1:3001**，选择 **Explore the demo**。脚本把合成数据库、储存与分析提供方和云端凭据隔离；演示中的照护和观察会保存在本机。

原生 Windows 构建位于 `windows/artifacts/`。请完整解压 x64 便携文件夹，不要只复制 EXE。`windows/Start-Nabat.ps1` 会启动隔离演示服务与原生应用；[构建与打包指南](docs/OPERATIONS_RELEASE.md)说明了自包含 x64 / ARM64 文件夹和未签名 MSIX 包。已核对的 Windows x64 便携版已公开：https://github.com/ChefDavid0815/nabat-injaz/releases/tag/v1.1.0。MSIX 与 ARM64 包暂未公开，构建指南完整保留。

## 03 / 照护，也要保留来处

- 更换标签或经过授权的所属权交接，都保留植物身份与历史。
- 照片、照护先保存，分析可用性另行处理。提供方暂不可用时，不生成假分数。
- 前后对照需要相同的提供方、模型和契约，并说明观察质量、视角与光线。健康分数是启发式估计，不是经过校准的生物测量。
- 角色与权限保护各自的私密工作区；Windows 凭据由操作系统绑定，待同步工作保留原始记录者和所属空间。
- 本机连续性覆盖最近缓存的档案与照护重放；未缓存原图、新导入、全新离线启动私密网页属于其他边界。

既有 Workspace Agent 集成已经配置，但最近建立的外部触发失败为 HTTP 409；这里不宣称订阅推理服务已经恢复。物理 NFC 写入、可信签名安装、实体打印和 ARM64 真机执行仍待验证。

## 04 / 构建与验证

网页与共享 API：Next.js 16、React 19、TypeScript、PostgreSQL 和私密媒体储存。原生客户端：WinUI 3、Windows App SDK 2.5.1、.NET 10 与 SQLite。同一套领域 API，让植物身份与照护记录彼此接得上。

```powershell
npm test
npm run typecheck
npm run lint
npm run contract:check
npm run build
```

**2026.10.09**，既有 TypeScript 领域测试通过 **67 项**。[1.1 验收记录](docs/qa/operations/VERIFICATION.md)另行记录了 10 月 4 日的 25 项 C# 测试、8 项浏览器检查，以及发布后 x64 应用的原生渲染、真实进程重启和云端照护回执。这些已有记录不是新的实体硬件认证。

[架构说明](docs/ARCHITECTURE.md) · [工作台指南](docs/OPERATIONS.md) · [部署指南](docs/DEPLOYMENT.md) · [原始 V1 技术记录](docs/TECHNICAL-V1.md) · [资产来源](docs/design/ASSETS.md)

## 05 / INJAZ 商赛作品

**由 ChefZC 为 INJAZ 商赛制作。**

[校园展柜 ↗](https://chefzc.dev/school-gallery.html#project-nabat) · [Now 029 ↗](https://chefzc.dev/now.html#milestone-nabat) · [植物手记 ↗](https://chefzc.dev/post.html?article=nabat)

**小小的照护，也能长成持续的改变。— ChefZC**
"""
(SOFTWARE/'README.md').write_text(en_repo,encoding='utf-8',newline='')
(SOFTWARE/'README.zh-CN.md').write_text(zh_repo,encoding='utf-8',newline='')
subprocess.run(['node',str(SOFTWARE/'node_modules/prettier/bin/prettier.cjs'),'--write',str(SOFTWARE/'README.md'),str(SOFTWARE/'README.zh-CN.md')],cwd=SOFTWARE,check=True,stdout=subprocess.DEVNULL)

profile_sections={
 'en':('### School lab / Ideas that take root.',"""<a href="https://chefzc.dev/school-gallery.html#project-nabat"><img src="assets/nabat.svg" width="100%" alt="NABAT 1.1 — my INJAZ business competition work, in ivory and botanical green." /></a>

**NABAT 1.1 · My INJAZ business competition work** — every plant, known.

A stable NFC / QR identity connects plant photographs, observations and care history. Mobile field care and a native Windows operations workspace carry the same record into tasks, plant exploration, locations, labels and comparison. Ivory, botanical green and editorial type give each little act of care a lasting home. Demonstration plants and signals are synthetic; physical NFC writing and trusted signed installation remain unverified.

<details><summary><b>Inside the native workspace / 原生软件展示窗</b></summary>

<img src="assets/nabat-native.png" width="100%" alt="Actual NABAT 1.1 native WinUI Operations Home with the synthetic NABAT Demo Hotel workspace." />

Actual rendered XAML content, excluding the operating system window frame.

</details>

[**OPEN NABAT ↗**](https://nabat-injaz.vercel.app/) &nbsp; / &nbsp; [**SOURCE · EN / 中文 ↗**](https://github.com/ChefDavid0815/nabat-injaz) &nbsp; / &nbsp; [**LIVING EXHIBITION ↗**](https://chefzc.dev/school-gallery.html#project-nabat) &nbsp; / &nbsp; [**FIELD NOTES ↗**](https://chefzc.dev/post.html?article=nabat)

"""),
 'zh':('### 校园实验室 / 让想法，慢慢生长。',"""<a href="https://chefzc.dev/school-gallery.html#project-nabat"><img src="assets/nabat.svg" width="100%" alt="NABAT 1.1：我的 INJAZ 商赛作品，象牙白与植物绿的生长档案。" /></a>

**NABAT 1.1 · 我的 INJAZ 商赛作品** — 让每一株，都被记得。

一枚稳定的 NFC / QR 身份，连接植物的照片、观察与照护历史。移动端留给现场，原生 Windows 工作台负责任务、目录、地点、标签与影像对照；同一份记录从一株植物，继续走向一座空间。象牙白、植物绿与编辑式字形，给每一次小小的照护留一个长期的家。演示植物与信号为合成样例，物理 NFC 写入与可信签名安装仍待验证。

<details><summary><b>原生软件展示窗 / Inside the native workspace</b></summary>

<img src="assets/nabat-native.png" width="100%" alt="NABAT 1.1 原生 WinUI 照护工作台的实际界面，使用 NABAT Demo Hotel 合成工作区。" />

真实 XAML 渲染内容，不包含操作系统窗口框。

</details>

[**进入 NABAT ↗**](https://nabat-injaz.vercel.app/) &nbsp; / &nbsp; [**源码 · 中文 / EN ↗**](https://github.com/ChefDavid0815/nabat-injaz) &nbsp; / &nbsp; [**生长档案展柜 ↗**](https://chefzc.dev/school-gallery.html#project-nabat) &nbsp; / &nbsp; [**植物手记 ↗**](https://chefzc.dev/post.html?article=nabat)

""")
}
preservation=[]
for lang,(heading,section) in profile_sections.items():
    before=(PROFILE/f'README-before.{lang}.md').read_bytes().decode('utf-8')
    # Normalise line endings once, without changing any original prose or links.
    before=before.replace('\r\n','\n')
    assert before.count(heading)==1
    inserted=heading+'\n\n'+section
    updated=before.replace(heading+'\n\n',inserted,1)
    assert updated.replace(section,'',1)==before
    if lang=='en':
        marker='| Signal | What\'s happening |\n| :--- | :--- |'
        status='\n| **NABAT 1.1 / INJAZ** | My [business competition work](https://github.com/ChefDavid0815/nabat-injaz), with a [living school exhibit](https://chefzc.dev/school-gallery.html#project-nabat). |'
        timeline='| Date | A page in the journal |\n| :--- | :--- |'
        event='\n| **2026.10.09** | Added NABAT, my INJAZ competition work, with a botanical exhibit, native software window and field notes. |'
    else:
        marker='| 信号 | 正在发生 |\n| :--- | :--- |'
        status='\n| **NABAT 1.1 / INJAZ** | 我的 [INJAZ 商赛作品](https://github.com/ChefDavid0815/nabat-injaz)，加入[生长档案展柜](https://chefzc.dev/school-gallery.html#project-nabat)。 |'
        timeline='```text\n'
        event='2026.10.09  ──  INJAZ 商赛作品 NABAT 加入校园实验室，配套原生软件展示窗与植物手记。\n'
    assert updated.count(marker)==1 and updated.count(timeline)==1
    updated=updated.replace(marker,marker+status,1).replace(timeline,timeline+event,1)
    stripped=updated.replace(section,'',1).replace(status,'',1).replace(event,'',1)
    assert stripped==before
    destination=PROFILE/('README.md' if lang=='en' else 'README.zh-CN.md')
    destination.write_text(updated,encoding='utf-8',newline='')
    preservation.append({'language':lang,'allOriginalContentPreserved':True,'oldCharacters':len(before),'newCharacters':len(updated)})

manifest={'status':'prepared; not pushed','author':'ChefZC','classification':'My INJAZ business competition work','intendedRepository':'ChefDavid0815/nabat-injaz','profileRepository':'ChefDavid0815/ChefDavid0815','profileBaseline':'profile/github-baseline-en.json and github-baseline-zh.json','softwareSourceCommit':'d6c97b9','profileContentPreservation':preservation,'publicationDeferred':'User asked to finish production first and restore GitHub networking later.','artwork':'Editable SVG with original NABAT photographic specimen and exact source-font glyph outlines; PNG fallback to be rendered.','ignoredPrivateFilesIncluded':False}
(WORK/'publication-plan.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2),encoding='utf-8',newline='')
print('Prepared editable NABAT artwork, bilingual repository READMEs and additive profile showcase.')
