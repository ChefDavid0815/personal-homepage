# One domain / 同域整合

The existing sites share one static deployment on `chefzc-homepage`:

| Website / 网站 | Address / 地址 |
| --- | --- |
| ChefZC portfolio / 个人主页 | https://chefzc.dev/ |
| AXIOM | https://chefzc.dev/axiom/ |
| STRIDE · WIS TECH TANK | https://chefzc.dev/stride/ |
| NBA After Hours | https://chefzc.dev/play/nba-after-hours/ |

AXIOM and STRIDE are unchanged copies of their existing browser builds. Their scripts, styles, images, model weights and worker files live in their own directories. There is no iframe, external rewrite, proxy function, new navigation or visual redesign. Gallery, article and Now launch links use relative paths, so preview deployments remain self-contained too. Bare `/axiom` and `/stride` addresses redirect to their trailing-slash form so relative assets resolve correctly.

AXIOM 与 STRIDE 直接使用现有网页版构建，文件逐个复制，界面与功能不变。主站按钮只修改链接，不增加导航或新的视觉模块。两个应用由主站静态目录直接提供，不经过外部代理；原有 NBA 游戏也继续由主站提供。旧部署保留作回退，不是新入口的请求上游。

## Refresh / 更新

Build a new version in the application's own repository, then import both verified browser builds:

```powershell
node scripts/import-web-projects.mjs "E:\AXIOM" "E:\WIS TECH TANK"
npm run check
```

Each subdirectory has a `release.json` with source commit, application version and SHA-256 hashes. The import does not modify source apps, recompile them or delete files. Desktop releases keep their original versions. Deploy the portfolio to publish all three websites together. STRIDE retains its model notices, worker/WASM content types and same-origin camera policy. Heavy models are loaded only when the existing app requests them.

在各自项目中构建后，运行上面的导入命令，再部署个人主页。`release.json` 记录源码提交、版本和文件校验值；这次域名整合不变更软件版本。

Browser storage is origin-scoped. Drafts, preferences and saves from an old `vercel.app` address cannot be read automatically from `chefzc.dev`; export an AXIOM project from its previous address and import it at the new address if needed. Original deployments remain available for that purpose. Both apps already namespace their own local-storage keys.

浏览器存储按域名隔离。旧 `vercel.app` 上的草稿、偏好和游戏存档不会自动出现在新域名；AXIOM 如有旧草稿，可在旧站导出，再到新地址导入。旧部署保留，因此仍可取回原有草稿。

Unifying the deployment avoids an extra proxy hop. It does not eliminate normal page, asset or API requests. Hashed AXIOM assets use immutable caching; STRIDE assets/model files keep a one-day cache because their filenames are not content hashes. The existing Pulse API and sync endpoint remain available.

同域整合减少的是跨站代理环节，并不会把页面、图片和接口的正常请求变成零。AXIOM 哈希资源长期缓存，STRIDE 的固定名称模型与资源沿用一天缓存；Pulse 接口及现有同步入口继续保留。

## Verification / 验证 · 2026-09-22

- Domain ownership and DNS verified by Vercel; production deployment `dpl_686Mh183tjcLi8eAEt9CJsivsnHh` is assigned to `chefzc.dev`.
- All 35 imported application files returned HTTP 200 on the new domain; 18 HTML/JS/CSS/font/icon files were downloaded and matched their local SHA-256. Large WASM/model files were checked by HTTP HEAD rather than downloaded again.
- Root, Gallery, School Lab, both app entry points, the NBA game and Pulse API returned HTTP 200. Both slashless app paths resolved to their intended trailing-slash paths without a loop.
- Local browser checks followed the existing Gallery and School Lab buttons. AXIOM rendered its sample chart and formula calculator; STRIDE switched to downward stairs and ran its 3D simulation with distance and response updates. No camera permission was requested and no physical-device inference was retested.
- JavaScript syntax checks passed. The imported application build files are byte-identical to the original local builds; their design, text and application code were not edited.

域名、DNS 与线上 HTTPS 已验证。35 个应用文件全部可访问，18 个较小资源完成线上哈希对比；大模型通过 HEAD 检查可访问性，避免重复下载。既有按钮可打开相同软件，AXIOM 图表/公式与 STRIDE 楼梯模拟已检查；未重新申请摄像头权限或进行真实环境推理测试。
