// 只需在这里添加项目，主页就会自动生成对应卡片。
// 接入真实项目后，将 demo 设为 false，并填写 repoUrl / liveUrl。
export const projects = [
  {
    id: 'nba-after-hours', name: 'NBA AFTER HOURS', subtitle: '为热爱，上场。',
    layout: 'court', headline: '把对篮球的热爱，\n做成一座自己的球场。',
    description: '我的第一个正式项目。一款打开浏览器就能玩的 3D 街机篮球游戏，从一场快速比赛，到一整条冠军之路。',
    category: '3D BASKETBALL', number: '01', color: 'lime', tags: ['Three.js', 'TypeScript', '3v3 / 5v5'],
    detail: 'NBA After Hours / 决胜时刻，是我把篮球与代码放在一起的第一次完整尝试。30 支球队、每队 5 位跨时代经典球员，支持快速比赛、16 队杯赛、自由训练、技巧挑战与同机双人。投篮绿窗、挡拆、慢动作回放和投篮复盘，让每一回合都有值得琢磨的细节。中英文随时切换，进度保存在当前浏览器；这是非官方球迷作品，阵容与能力值为游戏设计，不代表当季名单或官方评级。',
    demo: false, repoUrl: 'https://github.com/ChefDavid0815/nba-after-hours', liveUrl: 'https://chefzc-homepage.vercel.app/play/nba-after-hours/',
    translations: {
      zh: { category: '3D 篮球游戏', tags: ['Three.js', 'TypeScript', '3v3 / 5v5'] },
      en: {
        subtitle: 'For the love of the game.', headline: 'A love for basketball.\nA court of my own.',
        description: 'My first released project. A 3D arcade basketball game you can play in your browser, from a quick matchup to a championship run.',
        detail: 'NBA After Hours brings my love for basketball into code. Pick from 30 teams with five cross-era players each, and explore exhibition games, a 16-team tournament, practice, challenges, and local two-player matches. Time your release, call a screen, watch a slow-motion replay, and review your shot chart. Switch between Chinese and English; progress stays in the current browser. An unofficial fan project: fantasy lineups and game-balanced ratings are not current NBA rosters or official ratings.'
      }
    }
  },
  {
    id: 'neon', name: 'NEON', subtitle: '让灵感，多一个回声。',
    layout: 'standard', headline: '把一闪而过的灵感，\n变成下一步。',
    description: '一个 AI 灵感工作台的概念设计，将零散的念头整理为清晰的下一步。',
    category: 'AI EXPERIMENT', number: '01', color: 'lime', tags: ['AI', 'Web App'],
    detail: '这个示例展示了 AI 类项目在主页上的呈现方式：鲜明的产品预览、简短介绍，以及未来可以直接访问的项目和源码入口。当前仅为作品集视觉演示，尚未连接真实 AI 服务。',
    demo: true, repoUrl: '', liveUrl: '',
    translations: {
      zh: { category: 'AI 灵感实验', tags: ['AI', '网页应用'] },
      en: {
        subtitle: 'Give your ideas a sounding board.', headline: 'From a passing spark\nto a clear next step.',
        description: 'An AI workspace concept that turns scattered thoughts into a clear next step.',
        detail: 'This concept explores how an AI workspace could appear in a portfolio: a distinct product preview, a short introduction, and space for future demo and source links. It is a visual prototype and is not connected to an AI service.'
      }
    }
  },
  {
    id: 'flow', name: 'FLOW STATE', subtitle: '给专注，留一点频率。', layout: 'sound',
    description: '一个专注与环境声音应用的概念设计，让工作进入自己的节奏。',
    category: 'DIGITAL EXPERIENCE', number: '02', color: 'purple', tags: ['Experience', 'Creative'],
    detail: '这个示例展示了体验类项目的视觉卡片。波形、播放状态和时间在封面中仅用于展示界面设计，当前未接入音频播放或专注计时功能。',
    demo: true, repoUrl: '', liveUrl: '',
    translations: {
      zh: { category: '数字体验', tags: ['体验', '创意'] },
      en: {
        subtitle: 'Find your frequency for focus.',
        description: 'A focus and ambient sound app concept, designed around your own rhythm.',
        detail: 'A visual concept for a focus experience. The waveform, playback state, and timer illustrate the interface design. Audio playback and a working focus timer are not connected.'
      }
    }
  },
  {
    id: 'devkit', name: 'TINY TOOLS', subtitle: '小工具，大有用处。', layout: 'utility',
    description: '一个开发者工具箱的概念设计，把重复的小事交给顺手的工具。',
    category: 'DEVELOPER TOOLS', number: '03', color: 'orange', tags: ['Tools', 'Open Source'],
    detail: '这个示例展示了工具类项目的呈现方式。以后可以在这里放入自己的 JSON 格式化工具、自动化脚本或任何小作品，并配置真实的 GitHub 仓库和在线体验链接。',
    demo: true, repoUrl: '', liveUrl: '',
    translations: {
      zh: { category: '开发者工具', tags: ['工具', '开源'] },
      en: {
        subtitle: 'Small tools. A big difference.',
        description: 'A developer toolbox concept that makes repetitive little tasks easier.',
        detail: 'This concept shows how small utilities can be presented in the collection. It could become a home for JSON formatters, automation scripts, and other small projects, with links to real GitHub repositories and live demos.'
      }
    }
  }
];
