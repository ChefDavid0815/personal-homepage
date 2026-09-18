import { currentFolio, folioReleaseUrl } from './folio-releases.js';
// 只需在这里添加项目，主页就会自动生成对应卡片。
// 接入真实项目后，将 demo 设为 false，并填写 repoUrl / liveUrl。
export const projects = [
  {
    id:'festival-toolkit', name:'Festival Toolkit', subtitle:'每一周，都值得点亮。', layout:'festival',
    category:'WINDOWS SAVE WORKSHOP', number:'04', color:'mint', tags:['Electron','React','Windows'],
    description:'Horizon Festival Toolkit 0.1.1。FH6 季节赛记录、选周修改与备份恢复，属于赛车爱好者的存档工坊。',
    demo:false, version:'0.1.1', repoUrl:'https://github.com/ChefDavid0815/horizon-festival-toolkit',
    downloadUrl:'https://github.com/ChefDavid0815/horizon-festival-toolkit/releases/tag/v0.1.1', liveUrl:'',
    translations:{zh:{category:'WINDOWS 季节赛存档工具'},en:{subtitle:'Every week. A little brighter.',description:'Horizon Festival Toolkit 0.1.1. FH6 seasonal records, selected-week edits, backups and recovery in a Windows save workshop.'}}
  },
  {
    id: 'axiom', name: 'AXIOM', subtitle: '让数据，形成观点。', layout: 'axiom',
    category: 'SCIENTIFIC PLOTTING', number: '03', color: 'scientific', tags: ['React', 'TypeScript', 'Electron'],
    description: 'AXIOM · 格物 1.0。科学绘图、误差分析与数学物理计算，属于好奇心的工作台。',
    demo: false, version: '1.0.0', repoUrl: 'https://github.com/ChefDavid0815/axiom-studio', liveUrl: 'https://chefzc-axiom.vercel.app',
    translations: { zh: {category: '科学绘图工作台'}, en: {subtitle: 'From data. To discovery.', description: 'AXIOM 1.0. Scientific plotting, uncertainty analysis and maths and physics calculators. A workspace for curiosity.'} }
  },
  {
    id: 'folio', name: 'Folio', subtitle: '为热爱，留一席之地。', layout: 'folio',
    category: 'WINDOWS MOD MANAGER', number: '02', color: 'paper', tags: ['Electron', 'React', 'TypeScript'],
    description: 'Folio · 模组手帖 1.1。FH6 专项适配、Nexus 书房与版本手记，让热爱驶向新的旷野。',
    demo: false, version: currentFolio.version, repoUrl: 'https://github.com/ChefDavid0815/folio-mod-studio',
    downloadUrl: folioReleaseUrl(currentFolio.version), liveUrl: '',
    translations: {
      zh: { category: 'WINDOWS 模组管理软件' },
      en: { subtitle: 'A home for the things you love.', description: 'Folio Mod Studio 1.1. A wider horizon: dedicated FH6 tools, a Nexus reading room, and a version journal.' }
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
