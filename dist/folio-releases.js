// Newest first. Keep released editions and their dates immutable.
export const folioReleases = [
  {
    version: '1.1.0', edition: '1.1', date: '2026-09-18', title: 'The open road',
    zh: { name: '驶向新的旷野', introduction: '手帖翻到新的一页。把收藏的边界，延伸到更远的地平线。',
      changes: [ ['FH6 专项适配', '独立作品库、分类与 ZIP 预览；部署前查看变更，保留原文件备份，支持更新与还原。'], ['Nexus 书房', '个人 API Key 连接、分页浏览、文件下载与关注更新。Premium 直接下载，普通账号通过官网授权的 nxm 链接接收。'], ['版本手记', '在软件中翻阅每一次成长。自动迁移 1.0 收藏，延续奶油纸、陶土色与轻盈动效。'] ],
      note: 'SSO 暂未开放；真实 Nexus 账号、线上下载与游戏内兼容性尚未完成验证。' },
    en: { name: 'The open road', introduction: 'A new page in the journal. A little more room, and a wider horizon.',
      changes: [ ['A chapter for FH6', 'A separate collection, categories and ZIP previews. Review deployments, keep original backups, update and restore.'], ['The Nexus reading room', 'Connect a personal API key, browse pages, download files and follow updates. Premium downloads directly; free accounts use website-authorised nxm links.'], ['A living journal', 'Read each edition inside Folio. Existing 1.0 collections migrate automatically, with the same warm paper, terracotta and quiet motion.'] ],
      note: 'SSO is not available. Live Nexus account/download flows and in-game compatibility have not been verified.' }
  },
  {
    version: '1.0.0', edition: '1.0', date: '2026-09-17', title: 'The first edition',
    zh: { name: '为热爱，留一席之地', introduction: '一间属于游戏与模组的收藏工作室，由此开始。',
      changes: [ ['私人游戏书架', 'Steam 搜索、真实游戏封面、手动收藏与可选 RAWG 资料库。'], ['NBA 2K27 专项归档', '按资源 ID 归组，查看文件树，维护名称与分类对照。'], ['有序安放', 'ZIP 导入预览、同名保护，以及保留原路径的停用与恢复。'] ], note: '第一版 Windows x64 安装包与免安装包。历史版本与发布说明继续保留。' },
    en: { name: 'A home for what you love', introduction: 'The first page of a personal studio for games and mods.',
      changes: [ ['Your own bookshelf', 'Steam search, game covers, manual collections and an optional RAWG catalogue.'], ['Made for NBA 2K27', 'Group resources by ID, browse file trees and maintain name/category mappings.'], ['Keep with care', 'Preview ZIP imports, protect against conflicts, and disable or restore files with their original paths intact.'] ], note: 'The first Windows x64 installer and portable edition. Original downloads and release notes remain available.' }
  }
];
export const currentFolio = folioReleases[0];
export const folioReleaseUrl = version => `https://github.com/ChefDavid0815/folio-mod-studio/releases/tag/v${version}`;
