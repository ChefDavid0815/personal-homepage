// 只需在这里添加项目，主页就会自动生成对应卡片。
// 接入真实项目后，将 demo 设为 false，并填写 repoUrl / liveUrl。
export const projects = [
  {
    id: 'folio', name: 'Folio', subtitle: '为热爱，留一席之地。', layout: 'folio',
    category: 'WINDOWS MOD MANAGER', number: '02', color: 'paper', tags: ['Electron', 'React', 'TypeScript'],
    description: 'Folio · 模组手帖 1.0。一间安静的 Windows 游戏与模组收藏工作室，优先适配 NBA 2K27。',
    demo: false, version: '1.0.0', repoUrl: 'https://github.com/ChefDavid0815/folio-mod-studio',
    downloadUrl: 'https://github.com/ChefDavid0815/folio-mod-studio/releases/tag/v1.0.0', liveUrl: '',
    translations: {
      zh: { category: 'WINDOWS 模组管理软件' },
      en: { subtitle: 'A home for the things you love.', description: 'Folio Mod Studio 1.0. A quiet Windows studio for your games and mods, with dedicated NBA 2K27 organisation.' }
    }
  },
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
  }
];
