// Editorial copy is stored as text. Both languages share the same images and links.
export const posts = [
  {
    id: 'hello-world', theme: 'signal', number: '01', date: '2026-09-17',
    cover: './assets/hero-asterisk.png', image: './assets/hero-asterisk.png',
    zh: {
      category: '生活切片 / 一个开始', title: '你好，这是我的一小块互联网。',
      summary: '网站终于搭起来了。想在这里放作品，也放一些没有标准答案的想法。先不着急定义它，慢慢长成自己的样子。',
      lead: '终于，我也有了一个自己的网址。点开它的时候，感觉有点像推开一扇刚装好的门：里面还会添很多东西，但已经是自己的地方了。',
      quote: '保持热忱，保持热爱。\nViva la vida.',
      imageAlt: '荧光绿与液态金属交织的星形雕塑，个人主页的视觉符号',
      caption: '01 / 一点数码感，一点多巴胺。把喜欢的颜色，变成这个空间的开场白。',
      sections: [
        { title: '先给自己留一个位置', paragraphs: ['9 月 16 日，我正式开始搭建自己的个人主页。原本想得很简单：以后做出来的东西，总要有个地方好好放着。随着页面一点点成形，我又想加上喜欢的音乐、正在做的事，还有眼前这些小文章。', '这里不只是一个项目清单。我希望过一段时间再回来，能看见当时的自己：在对什么好奇，又把哪个“要不试试”真的做了出来。'] },
        { title: '屏幕之外，也有很多喜欢', paragraphs: ['我是 ChefZC，在迪拜读 IB 的 Year 12 学生。喜欢篮球、库里和 NBA，也爱看 F1、勒芒，喜欢勒克莱尔。会画画、写书法，研究电脑硬件，也折腾 Agent、追 AI 的新变化。', '看起来兴趣有点散，但对我来说，它们都来自同一种心情：这个世界还有很多值得看、值得学、值得亲手碰一碰的东西。未来想做计算机工程师，或者研究空气动力学。现在，就先把好奇心用起来。'] },
        { title: '这个地方，可以慢慢长大', paragraphs: ['Gallery 放真正做出来的作品，Now 记下一点点进展，Posts 就留给这些不必写得很正式的想法。一次尝试、一场比赛、一个突然想明白的小问题，都可以在这里有个位置。', '我不想等到一切都准备好了才开始。网站已经开门了，接下来边走边添。希望以后再翻到第一篇时，我已经做了更多有意思的东西，也依然保持现在的热爱。'] }
      ],
      cta: '去看看我的作品', afterword: '写在这个空间的开头。'
    },
    en: {
      category: 'LIFE NOTES / A BEGINNING', title: 'Hello, my little corner of the internet.',
      summary: 'The website is finally here. A home for my work, a few unfinished thoughts, and whatever this space grows into.',
      lead: 'I finally have a web address of my own. Opening it feels a little like walking through a newly fitted door. There is plenty left to put inside, but it already feels like my place.',
      quote: 'Stay passionate. Keep loving life.\nViva la vida.',
      imageAlt: 'A fluorescent green and liquid-metal asterisk, the visual symbol of my personal website',
      caption: '01 / A little digital energy, a little dopamine. My favourite colours introduce this space.',
      sections: [
        { title: 'A place to put things', paragraphs: ['On September 16, I started building my personal website. The first idea was simple: everything I make should have somewhere to live. As the pages took shape, I wanted to add music, small updates, and now these notes.', 'I want this to be more than a project list. When I come back later, I hope to recognise the person I was: what made me curious, and which “what if?” I actually tried.'] },
        { title: 'There is a world beyond the screen', paragraphs: ['I’m ChefZC, a Year 12 IB student in Dubai. I love basketball, Curry and the NBA, along with F1, Le Mans and Leclerc. I draw, practise calligraphy, explore computer hardware, and spend time with agents and new developments in AI.', 'Those interests might look scattered, but they come from the same feeling: there is so much worth seeing, learning and trying. Computer engineering and aerodynamic design are two futures I’m drawn to. For now, I want to put that curiosity to work.'] },
        { title: 'Room to grow', paragraphs: ['Gallery holds the things I have made. Now keeps track of little steps. Posts is for thoughts that do not need to become a polished project: an experiment, a game, or a small question I finally understand.', 'I don’t want to wait until everything is ready to begin. The door is open. I’ll add things as I go. When I read this first post again, I hope I have made more interesting things, and still care just as much.'] }
      ],
      cta: 'Explore my work', afterword: 'A note at the beginning of this space.'
    },
    link: './gallery.html'
  },
  {
    id: 'nba-after-hours', theme: 'court', number: '02', date: '2026-09-17',
    cover: './assets/projects/nba-after-hours/gameplay.png', image: './assets/projects/nba-after-hours/gameplay.png',
    zh: {
      category: '制作手记 / 第一个游戏', title: '把对篮球的热爱，做成一座自己的球场。',
      summary: 'NBA After Hours 1.0，我的第一个正式项目。从喜欢看球、打球和玩 2K，到亲手做一个能在浏览器里开打的篮球游戏。',
      lead: '喜欢篮球这件事，很自然地从球场延伸到了屏幕里。看 NBA，喜欢库里，打球，也玩 2K。于是这一次，我想再往前走一步：做一座自己的球场。',
      quote: '这一次，不只看下一回合。\n也亲手做出下一回合。',
      imageAlt: 'NBA After Hours 实际比赛截图：勇士对凯尔特人，3D 球场与比赛计分板',
      caption: 'ON COURT / 真实游戏画面。灯亮起来，下一回合交给你。',
      sections: [
        { title: '先让一场比赛发生', paragraphs: ['NBA After Hours / 决胜时刻，是我的第一个正式项目。它是一款浏览器里的 3D 街机篮球游戏，用 Three.js 和 TypeScript 搭起来。打开页面，选好球队，就可以开始。', '我喜欢“想玩就能开一局”的直接感。所以除了快速比赛，也做了训练和技巧挑战。没有那么多准备工作，先走进球场，找找投篮的手感。'] },
        { title: '让热爱有更多玩法', paragraphs: ['1.0 有 30 支球队，每队 5 位跨时代经典球员，可以打 3v3 或 5v5。想认真走一段赛程，有 16 队杯赛；想和朋友一起玩，也有同机双人。中英文、键盘、手柄和触屏，让不同的入口都能通向这座球场。', '我也把注意力放在回合里的小细节：投篮时机、挡拆、慢动作回放、赛后的投篮复盘。一次出手之后，能再想想刚才的选择，下一球也就有了新的期待。'], image: './assets/projects/nba-after-hours/menu.png', imageAlt: 'NBA After Hours 主菜单，展示快速比赛、冠军征程和其他模式', caption: 'THE LOBBY / 从一场快速比赛，到一条冠军之路。' },
        { title: '第一版，先上场', paragraphs: ['这是一个非官方球迷作品。跨时代阵容和能力值服务于游戏设计，不代表当季真实名单或官方评级。进度会留在当前浏览器里，换一台设备不会自动带走存档。', '对我来说，1.0 最有意义的地方，是第一次把一个完整的想法交到别人手里。它已经能玩，已经有自己的样子。接下来可以继续打磨，但第一声哨响，已经吹出去了。'] }
      ],
      cta: '立即上场 · PLAY NOW', afterword: '我的第一个项目。为热爱，上场。'
    },
    en: {
      category: 'BUILD NOTES / MY FIRST GAME', title: 'A love for basketball. A court of my own.',
      summary: 'NBA After Hours 1.0 is my first released project. From watching the NBA and playing 2K to building a basketball game you can open in your browser.',
      lead: 'Basketball has always followed me from the court to the screen: watching the NBA, following Curry, playing a game myself, or loading up 2K. This time I wanted to take another step and build a court of my own.',
      quote: 'Not just watching the next possession.\nMaking it happen, too.',
      imageAlt: 'An actual NBA After Hours game: Warriors versus Celtics on a 3D court with a scoreboard',
      caption: 'ON COURT / Actual gameplay. The lights are on. The next possession is yours.',
      sections: [
        { title: 'First, let a game happen', paragraphs: ['NBA After Hours is my first released project: a 3D arcade basketball game built with Three.js and TypeScript. Open the page, pick a team, and play.', 'I like the directness of being able to jump into a game. Alongside exhibition matches, there is practice and a set of skill challenges. Step onto the court and find your shot.'] },
        { title: 'More ways to play', paragraphs: ['Version 1.0 has 30 teams, with five cross-era players on each roster, and 3v3 or 5v5 games. There is a 16-team tournament for a longer run, and local two-player matches for a friend. Chinese and English, keyboard, controller and touch all lead to the same court.', 'I also wanted to care about the small decisions inside a possession: release timing, screens, slow-motion replays and the shot chart afterwards. Looking back at a shot can make the next one more interesting.'], image: './assets/projects/nba-after-hours/menu.png', imageAlt: 'NBA After Hours main menu with exhibition, championship and other game modes', caption: 'THE LOBBY / From a quick matchup to a championship run.' },
        { title: 'Version one. Time to play.', paragraphs: ['This is an unofficial fan project. Its cross-era lineups and game-balanced ratings are not current NBA rosters or official ratings. Progress stays in the current browser and does not automatically move between devices.', 'What matters most to me about 1.0 is handing a complete idea to someone else for the first time. It is playable and has a character of its own. There is room to refine it, but the first whistle has already blown.'] }
      ],
      cta: 'Step onto the court · PLAY NOW', afterword: 'My first project. For the love of the game.'
    },
    link: './play/nba-after-hours/'
  },
  {
    id: 'folio', theme: 'paper', number: '03', date: '2026-09-17',
    cover: './assets/projects/folio/library.png', image: './assets/projects/folio/library.png',
    zh: {
      category: '制作手记 / FOLIO 1.0', title: '为热爱，留一席之地。',
      summary: '游戏与模组，也值得被用心收藏。Folio 1.0，一间用奶油纸、陶土橙和留白搭起来的 Windows 模组工作室。',
      lead: '如果说 NBA After Hours 是把热爱做成一场比赛，那么 Folio 就是为这些热爱，做一个可以好好安放它们的地方。它叫“模组手帖”，因为我希望整理文件也能有一点翻书的心情。',
      quote: '整理细节，\n也珍藏热爱。',
      imageAlt: 'Folio 1.0 的我的收藏界面，奶油纸色游戏书架与 NBA 2K27 封面',
      caption: 'PLATE 01 / 我的收藏。真实的 Folio 1.0 桌面界面。',
      sections: [
        { title: '一个工具，也可以很温柔', paragraphs: ['Folio 是一款 Windows 游戏与模组管理软件。和主页的数码风不同，我给它选了奶油纸、陶土橙、暖玫瑰和鼠尾草色，再加上衬线字、细线条和留白。', '我希望打开它时，看到的是一间自己的收藏工作室：游戏有封面，作品有位置，细节可以慢慢翻。好看并不替代实用，但可以让一个日常工具，变成愿意经常打开的东西。'] },
        { title: '让文件，回到看得懂的秩序', paragraphs: ['1.0 优先适配 NBA 2K27。面补、球衣、球馆、照片等资源按 ID 整理成虚拟作品，关联文件可以在完整文件树里查看。名称不对时可以校订，也可以维护各自独立的 ID 对照表；其他游戏使用通用文件夹管理。', '这种整理不需要为了展示分类而搬动文件。需要停用时，文件会保留相对路径移到同级的 .folio-vault；恢复时再放回去。ZIP 导入前可以先看清单，同名冲突会停止，不自动覆盖。'], image: './assets/projects/folio/files.png', imageAlt: 'Folio 的文件详情，以库里关联资源为例展示完整文件树', caption: 'PLATE 02 / 文件与细节。分类在界面里，原始路径保留下来。' },
        { title: '第一册，正式上架', paragraphs: ['Folio 1.0 提供 Windows x64 安装版和免安装版，界面是中文。Gallery 里可以翻阅真实截图；真正管理本地文件，需要下载桌面应用。游戏和加载器需要自己准备，Folio 不附带模组，也不把“文件在目录里”说成“已经在游戏中生效”。', '从一个篮球游戏，到一个整理游戏的工具，两件作品的样子很不一样，但起点其实一样：把自己喜欢的事情认真做一次。第一册已经放上书架，留白的地方，等以后慢慢写。'] }
      ],
      cta: '获取 Folio 1.0', afterword: '第一册 / September 2026。用心收藏。'
    },
    en: {
      category: 'BUILD NOTES / FOLIO 1.0', title: 'A home for the things you love.',
      summary: 'Games and mods deserve a place of their own. Folio 1.0 is a Windows mod studio in cream paper, terracotta and generous white space.',
      lead: 'NBA After Hours turns a love for basketball into a game. Folio gives the games I love somewhere to belong. I think of it as a mod journal, because even organising files can feel a little like turning pages.',
      quote: 'Every detail,\nthoughtfully kept.',
      imageAlt: 'Folio 1.0 personal collection, a cream-paper bookshelf with an NBA 2K27 cover',
      caption: 'PLATE 01 / The personal collection. Actual Folio 1.0 desktop interface.',
      sections: [
        { title: 'A tool with a softer voice', paragraphs: ['Folio is a Windows game and mod manager. I chose a different palette from my website: cream paper, terracotta, warm rose and sage, with serif type, fine rules and room to breathe.', 'I wanted it to feel like a personal collection studio: covers for the games, a place for each work, and details you can browse at your own pace. Beauty does not replace function, but it can make an everyday tool something you enjoy opening.'] },
        { title: 'Making sense of the files', paragraphs: ['Version 1.0 focuses on NBA 2K27. Faces, jerseys, courts, portraits and other resources become virtual collections organised by ID. You can inspect the complete file tree, edit labels and maintain separate ID mappings. Other games use general folder-based organisation.', 'Files are not moved merely to display categories. Disabling moves them into a neighbouring .folio-vault while keeping their relative paths; restoring puts them back. ZIP imports begin with a preview, and conflicts stop the operation instead of overwriting files.'], image: './assets/projects/folio/files.png', imageAlt: 'Folio file details showing the complete tree of resources associated with Curry', caption: 'PLATE 02 / Files & fragments. Organised on screen, with original paths preserved.' },
        { title: 'The first edition is on the shelf', paragraphs: ['Folio 1.0 comes as a Windows x64 installer or portable app, with a Chinese interface. The Gallery lets you browse real screenshots; local file management requires the desktop application. Games and loaders are separate, mods are not bundled, and files being present does not mean they have been verified in-game.', 'A basketball game and a mod manager look quite different, but they begin with the same wish: give something I love a serious try. The first edition is on the shelf. The blank pages can fill up later.'] }
      ],
      cta: 'Get Folio 1.0', afterword: 'First edition / September 2026. Collect with care.'
    },
    link: 'https://github.com/ChefDavid0815/folio-mod-studio/releases/tag/v1.0.0'
  }
];
