// Public releases only. Historical notes retain their original scope.
export const festivalReleaseUrl = version => `https://github.com/ChefDavid0815/horizon-festival-toolkit/releases/tag/v${version}`;
export const festivalReleases = [
  {
    version:'0.3.0', date:'2026-09-22', edition:'03',
    zh:{
      name:'让旅途，完整绽放。',
      intro:'从四季和车库，走向整段旅程。探索日本、嘉年华收藏手册与七色腕带，有了自己的精致工作区。',
      changes:[
        ['JOURNEY / 收藏手册','38 个分类、2,833 个子项目。搜索、查看真实进度，选择单项、整类、整条路线或全部旅程；完成记录与积分一起写入。'],
        ['COLOURS / 七色腕带','读取腕带持有记录，单条选择或补齐所有缺失颜色。选择统一进入待应用列表，写入前自动备份。'],
        ['UPDATE / 下一次相遇','每天检查 GitHub 已发布版本，新版本弹窗直达下载页。延续原有配色，精细化动效、腕带材质与双语版本历史。']
      ],
      note:'已通过隔离存档和桌面流程验证。腕带持有记录不等于剧情及赛事资格；真实游戏读档、奖励、解锁与云同步仍未验证。'
    },
    en:{
      name:'Let every journey bloom.',
      intro:'Beyond seasons and a garage, a whole journey. Discover Japan, Festival journals and seven wristband colours now have their own workspace.',
      changes:[
        ['JOURNEY / THE JOURNAL','38 categories, 2,833 items. Search real progress and select an item, category, path or every journey; completion records and points update together.'],
        ['COLOURS / SEVEN WRISTBANDS','Read ownership records and add one colour or every missing wristband. Changes join a shared queue, with a backup before writing.'],
        ['UPDATE / THE NEXT CHAPTER','Daily GitHub release checks and a direct download prompt. The palette stays, with refined motion, wristband materials and bilingual release history.']
      ],
      note:'Isolated-save and desktop flows verified. Wristband ownership is separate from story and race eligibility. In-game loading, rewards, unlocks and cloud sync remain unverified.'
    }
  },
  {
    version: '0.2.0', date: '2026-09-20', edition: '02',
    zh: {
      name: '把梦想，开进车库。',
      intro: '四季之外，给热爱多留一个车位。新的车辆收藏与更新中心，让这张通行证继续生长。',
      changes: [
        ['647 / 车辆收藏', '按车型、品牌、年份或 ID 搜索。单车增加 1–20 台，也可以只补齐目录内尚未拥有的车型。'],
        ['SYNC / 持续更新', '从本地游戏资源同步赛季与车辆目录，支持独立内容包；可选启动时与运行期间每 30 分钟检查。'],
        ['ART / 真实封面', '各系列赛读取自己的游戏内海报并缓存；四季卡片、中英切换、备份与恢复继续保留。']
      ],
      note: '新赛季须已存在于存档，未知格式仍需适配。当前游戏内读档、驾驶、奖励与线上同步尚未验证。'
    },
    en: {
      name: 'A little more room to dream.',
      intro: 'Beyond four seasons, a place for the next car. A new garage and content centre keep this festival pass growing.',
      changes: [
        ['647 / THE GARAGE', 'Search by model, make, year or ID. Add 1–20 copies of a model, or one of each missing catalogue model.'],
        ['SYNC / KEEP GROWING', 'Sync series and cars from local game resources, or import a content pack. Optional checks run at launch and every 30 minutes while open.'],
        ['ART / SERIES POSTERS', 'Each series gets its actual in-game cover, cached locally. The season cards, bilingual UI, backups and recovery stay.']
      ],
      note: 'New series must already exist in the save; unknown formats need adapter work. In-game loading, driving, rewards and online sync remain unverified.'
    }
  },
  {
    version: '0.1.1', date: '2026-09-18', edition: '01',
    zh: {
      name: '每一周，都值得点亮。',
      intro: '最初的四季工坊。薄荷绿、淡蓝和粉色，把一段赛车爱好装进 Windows 小工具。',
      changes: [
        ['PLAYLIST / 四季起点', '收录 S1–S5 共 20 周，按周、赛季或全部已识别记录处理。'],
        ['CARE / 留一条回去的路', '写入前备份，处理已有 SCopy，并分别恢复原文件与副本。'],
        ['LANGUAGE / 两种语言', '中文、English 与跟随系统，记住手动偏好；首个公开版本与展柜同步上线。']
      ],
      note: '历史版本不含车辆添加功能；当时的游戏内效果与线上同步也未验证。'
    },
    en: {
      name: 'Every week. A little brighter.',
      intro: 'The original four-season workshop. Mint, blue and pink, and a love of racing turned into a Windows tool.',
      changes: [
        ['PLAYLIST / FIRST SEASONS', 'S1–S5, twenty weeks. Select a week, a series or all recognised records.'],
        ['CARE / A WAY BACK', 'Back up before writing, handle existing SCopy files and restore each original separately.'],
        ['LANGUAGE / TWO VOICES', 'Chinese, English and system language with a saved preference. The first public release arrived with its Gallery exhibit.']
      ],
      note: 'This historical release has no car-adding feature. In-game effects and online sync were unverified.'
    }
  }
];
export const currentFestival = festivalReleases[0];
export const festivalUpdateMessages = {
  'now.meta': ['ChefZC 的近况。2026 年 9 月 20 日，Festival Toolkit 0.2 发布：车辆收藏、内容更新与版本手记。', 'Updates from ChefZC. September 20, 2026: Festival Toolkit 0.2 brings a garage, content updates and a version journal.'],
  'profile.bridgeNote': ['Festival Toolkit 来到 0.2：四季之外，多一间梦想车库。还有 AXIOM、Folio 与 NBA After Hours，以及独立的校园实验室。每件作品，都有自己的风景。', 'Festival Toolkit reaches 0.2: beyond four seasons, a garage for the next dream. Explore AXIOM, Folio, NBA After Hours and the separate School Lab. A landscape for every project.']
};
