export const festivalPost = {
  id:'festival-toolkit', theme:'festival', number:'05', date:'2026-09-18', version:'0.1.1',
  cover:'./assets/projects/festival-toolkit/cover.svg', image:'./assets/projects/festival-toolkit/workspace.png',
  link:'./gallery.html#project-festival-toolkit',
  zh:{
    category:'制作手记 / FESTIVAL TOOLKIT',title:'给四季，一张新的通行证。',
    summary:'这次，把赛车、代码和一点嘉年华的颜色放在一起。Festival Toolkit 0.1.1：一个关于季节赛记录、备份与恢复的 Windows 小工具。',
    lead:'我喜欢赛车，也喜欢赛车之外的那一整套气氛：菜单里的斜线，换季的颜色，一张张等待打开的卡片。这次想把这些感觉留在一个自己做的小工具里，让重复的整理，也有一点出发前的期待。',
    quote:'给每一周一种颜色，\n也给每一次修改，留一条回去的路。',
    imageAlt:'Festival Toolkit 0.1.1 的真实 Windows 界面，显示四季卡片，未连接任何存档',
    caption:'WORKSHOP / 01 — 真实软件界面，处于未连接存档状态。界面中的游戏摄影归原权利人所有。',
    sections:[
      {title:'从喜欢赛车，到做一件小工具',paragraphs:['从 F1 到勒芒，从看比赛到折腾游戏，赛车一直是我的兴趣之一。做 NBA After Hours 时，我把篮球搬进代码；做 Folio 时，我为游戏与模组留了一个有秩序的空间。这次，视线落在了地平线的季节赛。','Horizon Festival Toolkit 是一间 Windows 存档工坊。它把当前收录的 S1–S5、共 20 周记录排成清楚的卡片，展示积分与完成情况，并让需要处理的周有一个明确的选择范围。它不是新的赛车游戏，而是我围绕一份热爱做的小工具。']},
      {title:'薄荷绿的底，天空和腕带的颜色',paragraphs:['我想让这件作品看起来轻快一点。展柜铺上浅绿色，淡蓝像天空，粉色像嘉年华的入场腕带。凝缩的大字、斜切的标签、四季符号和票券上的虚线，接上软件本身赛车菜单的节奏。','点一下夏、秋、冬、春，展柜里的通行证就换一种心情；鼠标靠近，叠放的卡片轻轻展开。这些小动作属于展示页面，不会连接游戏或操作存档。我喜欢动效让人想伸手试试，也希望停下来阅读时，它足够安静。']},
      {title:'有去处，也要有退路',paragraphs:['真正处理文件时，顺序比动画更重要。先选定存档和需要修改的周，写回前保存原文件；遇到已有的 SCopy，也一起纳入备份与恢复。没有明确执行，就不会在启动时自动修改存档。','这个版本专注季节赛，不包含加车功能。加密存档需要通过 ForzaCryptoTool 交给 forzamods.dev 在线处理，这件事在连接前就应该被讲清楚。工具的用途、需要联网的地方、会发生什么，都不该藏在好看的界面后面。']},
      {title:'0.1.1，一件继续生长的作品',paragraphs:['目前软件支持简体中文和 English，也能跟随系统语言。源代码、说明与展柜一起公开；因为功能依赖 Windows 本地文件接口，这次没有另做一个无法操作存档的网页版。','隔离副本中的结构检查、选周范围、车库字节保持、幂等和恢复流程已有测试。但游戏实际读档、奖励发放和线上同步尚未验证，不能把字段写入成功当成游戏里的全部结果。把边界记录下来，也是做作品的一部分。','第四件作品，就这样加入了 Gallery。篮球有自己的球场，Folio 有手帖，AXIOM 有实验台，这次是一张嘉年华通行证。它们长得不同，却都来自同一件事：喜欢，所以想亲手做出来。']}
    ],
    cta:'走进 Festival Toolkit 展柜',afterword:'写于 Festival Toolkit 加入作品集的这一天。下一季，继续保持热爱。'
  },
  en:{
    category:'BUILD JOURNAL / FESTIVAL TOOLKIT',title:'A fresh pass for all four seasons.',
    summary:'Racing, code and a little festival colour. Festival Toolkit 0.1.1 is a Windows workshop for seasonal records, backups and recovery.',
    lead:'I love racing, and I love the atmosphere around it: diagonal menus, a new season’s colours, a row of cards waiting to be opened. This time, I wanted some of that feeling in a small tool of my own. Even organising things can carry a little anticipation.',
    quote:'A colour for every week.\nA way back from every change.',
    imageAlt:'The real Festival Toolkit 0.1.1 Windows interface, with four season cards and no save connected',
    caption:'WORKSHOP / 01 — Actual application, with no save connected. Game photography in the interface belongs to its respective rights holders.',
    sections:[
      {title:'From following races to making a tool',paragraphs:['From F1 to Le Mans, from watching races to exploring games, cars have always been part of my world. NBA After Hours brought basketball into code. Folio gave games and mods a considered home. This time, I turned towards Horizon’s seasonal playlist.','Horizon Festival Toolkit is a Windows save workshop. Its current catalogue puts S1–S5, twenty weeks in total, into clear cards with points and completion records. You choose the scope of the work. It is a small companion built around an interest I already have.']},
      {title:'Mint paper, sky blue, festival pink',paragraphs:['I wanted this exhibition to feel light. Pale green makes the ground, blue suggests the sky, pink brings the colour of a festival wristband. Condensed lettering, angled labels, seasonal symbols and perforated tickets echo the racing-menu rhythm of the application.','Choose summer, autumn, winter or spring and the exhibition changes mood. Hover and the layered cards open up a little. These interactions belong to the portfolio: they never connect to the game or touch a save. Motion should invite a closer look and leave room to read.']},
      {title:'A way forward, and a way back',paragraphs:['When real files are involved, sequence matters. Choose a save and the weeks to edit, keep the original files before writing, and include an existing SCopy in backup and recovery. Launching the app alone does not automatically modify saves.','This version focuses on seasonal records and does not add cars. Encrypted saves are sent to forzamods.dev through ForzaCryptoTool for online processing. That needs to be clear before connecting a file. A polished interface should also explain what will happen.']},
      {title:'Version 0.1.1, with room to grow',paragraphs:['The app supports Simplified Chinese, English and the system language. Its source, documentation and exhibition are now public. The workflow depends on Windows file access, so this release has no separate browser edition.','Tests on isolated copies cover data structures, selected-week scope, unchanged garage bytes, idempotence and recovery. In-game loading, reward delivery and online synchronisation remain unverified. Writing a field successfully does not prove every in-game effect. Recording that boundary is part of making the tool.','This is project four. Basketball has a court, Folio has its journal, AXIOM has its laboratory, and now there is a festival pass. They look different, but each began in the same place: something I enjoyed enough to want to build.']}
    ],
    cta:'Explore the Festival Toolkit exhibition',afterword:'Written as Festival Toolkit joins the collection. Another season, the same love of making.'
  }
};
