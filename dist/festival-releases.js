// Public releases only. Historical notes retain their original scope.
export const festivalReleaseUrl = version => `https://github.com/ChefDavid0815/horizon-festival-toolkit/releases/tag/v${version}`;
// A source-only version has no release page yet: link its release notes in the repository instead.
export const festivalSourceUrl = version => `https://github.com/ChefDavid0815/horizon-festival-toolkit/blob/main/docs/RELEASE-${version}.md`;
export const festivalReleases = [
  {
    version:'0.4.0', date:'2026-10-16', edition:'04', source:true,
    zh:{
      name:'每一次调校，都有据可查。',
      intro:'调校工坊开张。车库里每辆车的调校、改装和实际花费都能读出来；季节赛跟着游戏自己更新；整个界面换成一张车检证。',
      changes:[
        ['TUNING / 调校工坊','读取每辆车的完整调校、已装部件和每个部件的实际成交价，胎压、齿比、定位、防倾杆、阻尼、刹车与差速器换算成实际单位。八种场景计算，同车型复制调校或整套改装，本机调校库，以及社区分享码查询。'],
        ['REWARDS / 奖励车辆','自动找到 Steam 与 Xbox 安装目录，运行时每分钟比对游戏资源。每周、整季和各项赛事的奖励车辆都从游戏资源读取，未拥有的可以一次加入待写入列表。'],
        ['REGISTER / 车检证','全新界面：浅绿防伪底纹纸面、带角标的字段框、墨色文字，朱红印章只盖在待写入的修改上；待写入的数值逐位滚动。']
      ],
      note:'源码版本，尚未发布安装包。45 项测试通过，桌面版已用隔离存档逐页走查；写入的调校与复制的改装在游戏内的效果尚未验证，场景计算只是一个起点。'
    },
    en:{
      name:'Every tune, on the record.',
      intro:'The tuning workshop opens. Every car’s tune, upgrades and the CR actually paid can be read from the save; the playlist follows game updates by itself; and the whole interface becomes a vehicle register.',
      changes:[
        ['TUNING / THE WORKSHOP','Read every car’s full tune, installed parts and the price paid for each part, with tyre pressure, gearing, alignment, anti-roll, damping, brakes and differential in real units. Eight scenario calculators, same-model tune or full-build transfer, a local tune library and community share-code lookup.'],
        ['REWARDS / THE CARS','The Steam or Xbox install is found automatically and checked every minute while the app is open. Week, season and event reward cars are read from game resources, and the missing ones can be staged in one step.'],
        ['REGISTER / A NEW FACE','A complete redesign: tinted security paper, boxed fields with corner tabs, sumi ink, and a vermilion seal reserved for staged changes; staged figures roll digit by digit.']
      ],
      note:'Source version; no installer has been published yet. All 45 tests pass and the desktop app was walked page by page on an isolated save. In-game effects of written tunes and copied builds are unverified, and scenario tunes are only a starting point.'
    }
  },
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
// The newest version with a published installer, for download links.
export const festivalInstaller = festivalReleases.find(release => !release.source);
export const festivalUpdateMessages = {
  'now.festival04Label': ['软件 / 大版本', 'SOFTWARE / MAJOR UPDATE'],
  'now.festival04Kicker': ['把每一次调校，记进车检证', 'EVERY TUNE, INTO THE REGISTER'],
  'now.festival04Title': ['Festival Toolkit 0.4，调校工坊开张。', 'Festival Toolkit 0.4: the tuning workshop opens.'],
  'now.festival04Text': ['读出车库里每辆车的调校、改装和实际成交价，胎压、齿比、定位、阻尼都换成真实单位；八种场景计算、同车型复制调校与改装、本机调校库和社区分享码。季节赛会自己跟着游戏更新，奖励车辆一键补齐。整个界面重做成一张车检证：防伪底纹纸、字段框和只盖在待写入修改上的朱红印章。', 'Every car’s tune, upgrades and the CR actually paid, read from the save, with tyre pressure, gearing, alignment and damping in real units; eight scenario calculators, same-model tune and build transfer, a local tune library and community share codes. The playlist now follows game updates, and missing reward cars can be added in one step. The whole interface was redrawn as a vehicle register: security paper, boxed fields and a vermilion seal only for staged changes.'],
  'now.festival04Note': ['源码版本，安装包尚未发布；写入的调校在游戏内的效果尚未验证。', 'Source version; the installer is not published yet. In-game effects of written tunes are unverified.'],
  'now.festival04Notes': ['读 0.4 版本说明', 'Read the 0.4 release notes'],
  'now.meta': ['ChefZC 的近况。2026 年 9 月 20 日，Festival Toolkit 0.2 发布：车辆收藏、内容更新与版本手记。', 'Updates from ChefZC. September 20, 2026: Festival Toolkit 0.2 brings a garage, content updates and a version journal.'],
  'profile.bridgeNote': ['Festival Toolkit 来到 0.2：四季之外，多一间梦想车库。还有 AXIOM、Folio 与 NBA After Hours，以及独立的校园实验室。每件作品，都有自己的风景。', 'Festival Toolkit reaches 0.2: beyond four seasons, a garage for the next dream. Explore AXIOM, Folio, NBA After Hours and the separate School Lab. A landscape for every project.']
};
