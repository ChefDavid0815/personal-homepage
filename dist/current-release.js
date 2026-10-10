// The Current 2.0 release note and its Now entry, authored in both site languages.
// Art: current-release-art.js (the homepage's own streamline field, flowing around "2.0").
export const currentPost = {
  id: 'current-2', theme: 'current', number: '18', date: '2026-10-10',
  edition: 'CURRENT 2.0 / 2026',
  cover: './assets/flow/v2/home-current.webp', image: './assets/flow/v2/home-current.webp',
  link: './profile.html',
  zh: {
    category: '小站手记 / 2.0',
    title: '小站 2.0：川流来到第二程。',
    summary: '两天前刚换过新衣服，这次连骨架也换了：一条会为指针让路的河，一套汇文明朝体的中文，每一间重新布置的展柜。版本号第一次跳到 2.0。',
    lead: '10 月 8 日我写过，小站换了一身新衣服。结果接下来的两天，它又从里到外重新长了一遍：颜色、字体、每个展柜、每扇时间线小窗。改到后来我发现，这已经不是换衣服了，是这条河开始了第二程。',
    quote: '川流不息。\nViva la vida.\n保持热爱，保持初心。',
    imageAlt: '个人网站 2.0 的首页：上千条彩色流线从左向右流动，在“川流不息”四个大字周围分开又合拢',
    caption: 'FIG. 01 / 首页的川流。线条会绕开字形，也会绕开你的指针。',
    sections: [
      {title: '一条会让路的河', paragraphs: [
        '新首页只有一样最响的东西：上千条流线从左往右走，遇到“川流不息”四个字就分开，绕过去，再在后面慢慢合拢。鼠标放上去，它们会像水绕过石头一样让开；按住不放，水流会突然变急。',
        '往下是十个章节：源、信、我、爱、声、器、途、作、遇、归。从一条河的源头开始，最后回到源头。这是我对“川流不息”最直接的理解：一直在往前走，也一直记得从哪里出发。'
      ]},
      {title: '中文，换成汇文明朝体', paragraphs: [
        '这一版所有中文都换成了汇文明朝体。它有老式铅字的墨色和一点毛边，放大做标题有力量，缩小读正文也安静。全站只保留一种中文字体，看起来终于像一本书，而不是好几种字体拼在一起。',
        '中间也遇到过小麻烦：字库里有十四个简体字带着繁体或日文的部件，比如“认、让、讲、论、证”。我们用同一套字体里正确的偏旁把它们重新拼好，再只打包网站真正用到的字。'
      ]},
      {title: '每个展柜，都有自己的小机关', paragraphs: [
        '展柜不再只是截图和文字。我回去翻了每个项目的源代码，给它们各自找了一个最像自己的互动：DOT/AIR 有翻牌式的出发看板，会算出从迪拜到东京的大圆距离；Flight DNA 把软件里的八个偏好问题排成一条可以点的波点基因。',
        'Atlas 的星图换成了真实目录里的 33 门学科和 241 个主题；AXIOM 的胡克定律图可以直接拖动数据点，斜率和 R² 会跟着重新拟合；Roseraie 会落花瓣，AfterImage 会留下尾灯一样的光轨，Festival Toolkit 换季节就换天气，NBA After Hours 可以在球场上投一球。'
      ], image: './assets/flow/v2/dot-air-board.webp', imageAlt: 'DOT/AIR 展柜：机场按钮旁的翻牌看板显示 DXB 到 HND，理论大圆距离 7,934 公里', caption: 'FIG. 02 / DOT/AIR 的出发看板。换一个机场，字母会一格一格翻过去。'},
      {title: '星图、工具箱和新伙伴', paragraphs: [
        '“器”这一章重新画了一遍：电脑、iPad 和 iPhone 都变成了会自己画出来的线稿，常用工具变成一排会放大的 Dock。除了 ChatGPT Pro 和 Codex，Claude、Claude Code、Claude Max、Figma 和 Adobe 家族也住了进来，旁边还站着一位抱着书的 Claude 娘。',
        '这一版大部分是和 Claude 一起做的。Pulse 用量页也开始实时记录 Claude 的模型用量：用了多少，就清清楚楚写在那里。'
      ], image: './assets/flow/v2/toolkit.webp', imageAlt: '首页“器”章节：设备线稿、Claude 娘贴纸，以及包含 ChatGPT Pro、Codex、Claude、Figma、Photoshop 等图标的工具 Dock', caption: 'FIG. 03 / 新的工具箱。指针扫过时，图标会像桌面 Dock 一样放大。'},
      {title: '2.0 不是终点', paragraphs: [
        '版本号从 1.x 直接跳到 2.0，再到今天的 2.1.0。对我来说，它标记的不是“做完了”，而是这个小站终于有了一套自己的语言：一条河、一种中文、每件作品各自的性格。',
        '动效很多，但都可以一键暂停；中英文也一直并排。接下来继续做作品、写随笔，偶尔被一个“要不试试”带去新的支流。门一直开着，欢迎顺着河来逛逛。'
      ], image: './assets/flow/v2/atlas-constellation.webp', imageAlt: 'Atlas 展柜的星图：学科组的罗马数字星座与金色关联线', caption: 'FIG. 04 / Atlas 的真实星图。指向一颗星，就能看到它是哪门课。'}
    ],
    cta: '去 2.0 的主页走走', afterword: '2026.10.10 / 写在迪拜。小站 2.1.0。'
  },
  en: {
    category: 'SITE NOTES / VERSION 2.0',
    title: 'Version 2.0: the river begins its second run.',
    summary: 'Two days after a new outfit, the bones changed too: a current that moves aside for your pointer, one Chinese typeface throughout, and every exhibit rearranged. The version number reaches 2.0 for the first time.',
    lead: 'On 8 October I wrote that the website had a new outfit. Over the next two days it grew again from the inside out: colour, type, every exhibit, every window on the timeline. Somewhere along the way it stopped being a change of clothes. The river had started its second run.',
    quote: 'Everything in flow.\nViva la vida.\nKeep the love. Stay true to where it began.',
    imageAlt: 'The version 2.0 homepage: a thousand coloured streamlines flowing left to right, parting around the characters 川流不息 and closing again behind them',
    caption: 'FIG. 01 / The current on the homepage. The lines flow around the letters, and around your pointer.',
    sections: [
      {title: 'A river that makes way', paragraphs: [
        'The new homepage has one loud thing: a thousand streamlines running left to right. They part around the characters 川流不息, flow past and slowly close again behind them. Move your pointer in and they part like water around a stone; press and hold, and the current rushes.',
        'Below it are ten chapters, each named with one character: source, creed, self, love, sound, tools, journey, work, encounters, return. They start at the source of a river and end back there. It is the plainest reading of 川流不息 I know: keep moving forward, and remember where you set out.'
      ]},
      {title: 'One Chinese typeface: Huiwen Mincho', paragraphs: [
        'All Chinese on the site is now set in Huiwen Mincho. It carries the ink and slight roughness of old metal type: strong as a headline, quiet as body text. With a single Chinese face throughout, the site finally reads like one book rather than several fonts stitched together.',
        'There was one snag. Fourteen simplified characters in the font carried traditional or Japanese components, such as 认, 让, 讲, 论 and 证. We rebuilt them from the correct radicals in the same font, then packed only the characters the site actually uses.'
      ]},
      {title: 'Every exhibit gets its own mechanism', paragraphs: [
        'The exhibits are no longer just screenshots and text. I went back through the source code of every project and gave each one the interaction that is most like itself. DOT/AIR has a split-flap departure board that works out the great-circle distance from Dubai to Tokyo; Flight DNA turns the app’s eight preference questions into a dotted strand you can tap.',
        'The Atlas sky now holds the 33 subjects and 241 topics from its real catalogue. You can drag the data points on AXIOM’s Hooke’s law figure and watch the slope and R² refit. Roseraie drops petals, AfterImage leaves tail-light trails, Festival Toolkit changes the weather with the season, and NBA After Hours lets you take a shot on the court.'
      ], image: './assets/flow/v2/dot-air-board.webp', imageAlt: 'The DOT/AIR exhibit: beside the airport buttons, a split-flap board reads DXB to HND, a theoretical great-circle distance of 7,934 km', caption: 'FIG. 02 / The DOT/AIR departure board. Pick another airport and the letters flip one cell at a time.'},
      {title: 'A sky, a toolbox and new companions', paragraphs: [
        'The Tools chapter was redrawn. The laptop, iPad and iPhone are line drawings that draw themselves, and my everyday tools sit in a dock that magnifies as you pass. Next to ChatGPT Pro and Codex are now Claude, Claude Code, Claude Max, Figma and the Adobe family, with Claude-chan standing guard, book in hand.',
        'Most of this version was made together with Claude. The Pulse page now records Claude model usage in real time, too: whatever I use is written down plainly there.'
      ], image: './assets/flow/v2/toolkit.webp', imageAlt: 'The homepage Tools chapter: device line drawings, a Claude-chan sticker, and a dock with ChatGPT Pro, Codex, Claude, Figma, Photoshop and other icons', caption: 'FIG. 03 / The new toolbox. Icons magnify under the pointer like a desktop dock.'},
      {title: '2.0 is not the finish line', paragraphs: [
        'The version jumped from 1.x to 2.0, and today to 2.1.0. To me it does not mean “finished”. It means the site finally speaks its own language: one river, one Chinese face, and every project with its own character.',
        'There is plenty of motion, and all of it pauses with one switch; Chinese and English still sit side by side. Next I will keep making things, writing notes, and now and then follow a “why not try it” down a new branch. The door stays open. Follow the river in.'
      ], image: './assets/flow/v2/atlas-constellation.webp', imageAlt: 'The Atlas exhibit sky: constellations of subject groups in roman numerals with gold connecting lines', caption: 'FIG. 04 / The real Atlas sky. Point at a star to see which subject it is.'}
    ],
    cta: 'Walk through version 2.0', afterword: '10 October 2026 / Written in Dubai. Site version 2.1.0.'
  }
};

export const currentReleaseMessages = {
  'now.meta': ['ChefZC 的近况。2026 年 10 月 10 日，个人网站来到 2.0。', 'Updates from ChefZC. October 10, 2026: the website reaches version 2.0.'],
  'now.currentLabel': ['网站 / 2.0', 'WEBSITE / VERSION 2.0'],
  'now.currentKicker': ['同一条河，第二程', 'THE SAME RIVER, A SECOND RUN'],
  'now.currentTitle': ['个人网站 2.0，川流来到第二程。', 'My website reaches 2.0. The river begins its second run.'],
  'now.currentText': ['首页换成一条会为指针让路的川流，全站中文统一为汇文明朝体，每个展柜都按照项目的源代码重新设计了自己的互动：翻牌看板、真实星图、可以拖动的拟合图、季节天气，还有球场上的一投。工具箱迎来 Claude 与 Adobe 家族，Pulse 也开始实时记录 Claude 用量。今天发布 2.1.0。', 'The homepage is now a current that moves aside for your pointer, all Chinese is set in Huiwen Mincho, and every exhibit has an interaction rebuilt from its project’s own source code: a split-flap board, a real constellation, a fit you can drag, seasonal weather and a shot on the court. Claude and the Adobe family join the toolbox, and Pulse now records Claude usage live. Version 2.1.0 ships today.'],
  'now.currentHome': ['看看 2.0 的首页', 'See the 2.0 homepage'],
  'now.currentPost': ['读 2.0 手记', 'Read the 2.0 note'],
  'now.currentGallery': ['逛重新布置的展柜', 'Walk the rebuilt Gallery'],
  'now.currentArtLabel': ['打开个人网站 2.0 手记', 'Open the version 2.0 note']
};
