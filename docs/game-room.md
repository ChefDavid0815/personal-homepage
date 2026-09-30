# Game room / 游戏房间

`game.html` contains three independent exhibits inside the existing bilingual shell. F1 25 uses a bright pop-art grid with bold flat type, the F1 mark, authentic 2026 Ferrari SF-26, McLaren MCL40 and Mercedes W17 launch imagery and official team logos. Selecting a car updates its focus panel and official gallery link. FH6 uses lime, cobalt, pink, Japan/Tokyo typography, a moving road and three selectable official images. NBA 2K27 uses its official cover in a glass sleeve, a neon court, a floating decorative basketball and spectrum/ice/pink lighting. Motion can be paused, stops offscreen/when the tab is hidden, and respects reduced motion. Selections survive language changes.

## Public data boundary

`dist/games-data.js` contains only aggregate values and dates. No raw saves, account identifiers, private paths, access tokens or game files are included. There is no remote save-decryption call and no attempt to read a visitor's drive.

- F1 25 AppID `3059520`: `dist/games-f1-data.js` is a separate, dated, offline snapshot. Steam's local app entry reported **4,050 minutes (67 h 30 m) total** and **156 minutes (2 h 36 m) in its two-week field** when read on 2026-09-26. The latest primary profile save file was modified on **2026-09-25 at 19:24:09 UTC**, and **3** replay highlight files were present. The opaque save payload is not interpreted as career results, race wins or season-pack ownership. The car images depict the real 2026 grid and are official launch media, not ChefZC game captures. Images, logos, source URLs and hashes are in `dist/assets/games/sources.json`.

- FH6 current save: only its last-write timestamp is available. The published **768 garage cars / 637 distinct car models / 148 photographed models** are from the already decrypted historical local snapshot exported on **2026-09-18 at 15:14 UTC+4**. They are not September 20 current balances/progress. Garage copies and unique models are deliberately separate.
- NBA 2K27: **3,627 minutes** total and **2,361 minutes** in the Steam two-week field; **1 career save** and **1 custom roster save**. Counts exclude companion photo files. Playtime comes from local Steam VDF, not from interpreting opaque binary save bytes. Counts do not imply a player rating or a completed match.
- Currency/ratings cannot be verified from the inspected files and are omitted, as requested. Unknown values must never become zeros, sample balances, or invented completion bars.

## Refresh offline

Python 3 standard library only. Supply paths privately on the command line; do not commit machine-specific commands or original files:

```text
python scripts/import-game-snapshot.py --fh6-save <current-C_ProfileData> --fh6-snapshot <existing-decrypted-snapshot> --snapshot-extracted-at <ISO-date-with-timezone> --steam-config <localconfig.vdf> --nba-remote <remote-save-directory> --output dist/games-data.js
npm run test:game-data
npm run check
```

The importer validates section boundaries and SQLite integrity, queries only aggregate allowlisted columns, opens the embedded database read-only, and checks source hashes before/after extraction. It does not decrypt, patch, re-encrypt or write to any original game save. Export dates must describe the actual historical input, not the time this command is rerun. Updating the webpage requires another import and deployment; the production page does not claim live synchronization.

F1 25 can be refreshed independently without touching the older FH6 or NBA snapshots:

```text
python scripts/import-f1-snapshot.py --steam-config <localconfig.vdf> --f1-remote <F1-25-Steam-remote-directory> --output dist/games-f1-data.js
npm run test:game-data
node --check dist/games-f1-data.js
```

The F1 importer reads only Steam playtime fields, primary profile file modification time and replay highlight file count. It hashes all inspected files before and after, rejects a changed source and will write only a non-symlink module named `games-f1-data.js`.

## 中文说明

Game 页面延续现有网站的双语导航。F1 25 使用现代波普大色块、粗线条、F1 标志，以及 Ferrari SF-26、McLaren MCL40、Mercedes W17 的 2026 官方赛车图与真实车队徽标；可以切换聚焦赛车。FH6 使用荧光绿、钴蓝、粉色、东京字牌与道路动效；NBA 2K27 使用官方封面、玻璃封套、霓虹球场与三种可切换灯光。支持暂停动效、离屏暂停和系统减少动态效果设置。

当前公开数字均由本地文件核验：F1 25 显示 Steam 游玩时长、最近启动、最近档案保存时间和回放片段数量；FH6 的车库与摄影数据明确标为 9 月 18 日导出的历史快照；2K27 显示 Steam 游玩时长和存档数量。读不到的游戏币、总评和 F1 比赛成绩不显示。原始存档、账号标识和本地路径不会上传。刷新脚本只读，发布前检查来源哈希和汇总边界；网页不会自动访问个人电脑。
