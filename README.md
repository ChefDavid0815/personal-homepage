# ChefZC — 数字实验室

个人介绍与项目展示网站：深色数码风，荧光绿、紫色、电光蓝与橙色点缀。

## 页面

- `profile.html`：Personal Profile，包含数字名片、真实简介、篮球与赛车主题卡、AI 与艺术兴趣、数码设备、成长经历及公开联系方式。
- `gallery.html`：独立的 Gallery，横向主展位、音乐海报、终端封面与项目详情。
- `now.html`：Now 近况页，按日期倒序记录 2026-09-17 创建音乐模块、2026-09-16 创建个人主页、2026-08-27 步入 IB、2026-04-20 开始接触 Agents。
- `index.html`：网站入口，自动转到 Personal Profile，并保留查询参数与页内锚点。

三个页面共用品牌、配色、导航、语言偏好与页脚，可以互相切换。个人资料采用 ChefZC 提供的信息：在迪拜的 GEMS Wellington International School 就读 Year 12 / IB。公开位置只展示城市。

公开链接：GitHub `ChefDavid0815`、Instagram `chefzichuan`、邮箱 `zzichuan0808@outlook.com`。主页提供邮箱复制按钮；它仅操作当前设备剪贴板，不会发送邮件。

## 音乐唱片架（v1.6）

Personal Profile 新增 `#music` 音乐区：9 位歌手、84 首精选、真实歌手肖像与专辑封面。周杰伦、薛之谦、邓紫棋、陶喆、陈奕迅、许嵩、张靓颖、林俊杰各 10 首；门尼为《哀人 (i)》《抑人 (e)》《巴拉莱卡（The Rod）》《没有了 (The End)》。合作歌曲保留官方署名。最爱专辑单独展示《守村人》《七里香》。歌曲和专辑名保持 QQ 音乐正式名称，界面与歌手显示名支持中英文。

封面每 12 秒从当前歌手/全部歌曲中随机轮换，也可手动暂停、随机换曲、前后翻阅。鼠标停留、键盘焦点进入、页面隐藏、播放器打开时暂停自动轮换；系统要求减少动态效果时默认关闭自动轮换。切换展示歌曲不会自动切换已打开的播放器。曲库支持歌手筛选、搜索和分页。

「在此听歌」按需加载 QQ 音乐官方外链播放器，实际播放需要在官方控件内点击。加载超时显示 QQ 音乐歌曲跳转入口，关闭会移除 iframe。当前预览浏览器测试中嵌入未能载入，独立官方播放器页面可以显示歌曲、封面及时长，但未确认成功播放，因此不宣称站内播放已打通。本站不读取 QQ 登录状态，不获取密码、cookie 或会员凭证，不同步账号歌单，不托管音频。完整播放由 QQ 音乐的登录、会员、版权和地区规则决定。

维护文件：`dist/music-data.js`（精选数据）、`dist/music-content.js`（双语文案）、`dist/music.js`（交互）、`dist/music.css`（视觉）、`dist/assets/music/`（71 张本地真实图片）。数据来源保存于 `dist/assets/music/sources.json`；图片版权属于相应权利人，不继承本站已有运动员照片的 Creative Commons 许可。`scripts/import-music.mjs` 从已验证的本地候选 manifest 导入快照，不在浏览器运行非公开搜索 API。音乐控件图标来自 Lucide，使用同目录现有 ISC 许可。

## 中英文切换

右上角的「中 / EN」即时切换两种语言，覆盖导航、个人介绍、作品文案、项目详情及页面标题。默认中文，选择保存在当前浏览器的本地存储中，刷新和跨页面访问会保持一致；本地存储不可用时仍可在当前页面切换。多个同源标签页的语言也会同步。

ChefZC、项目名称与概念封面内的视觉文案保留原设计，不随语言切换。移动端的导航和长英文文案有单独排版。

## 本地预览

安装 Node.js 后，在这个目录运行 `npm run dev`，浏览器访问终端显示的本地地址（默认 http://127.0.0.1:4173）。停止后可用同一命令重新打开。

这是纯静态站点，没有依赖安装和编译步骤。`dist` 是完整网站，后续可以部署到支持静态网站的服务。

## 内容维护

- `dist/projects.js`：项目清单。添加或修改项目即可生成卡片。
- `dist/gallery.html`：Gallery 页面、网站标题和作品区。
- `dist/gallery.css`：Gallery 的专用布局、封面和详情样式。
- `dist/gallery.js`：项目渲染、三种概念封面和详情弹窗。
- `dist/index.html`：原首页地址的兼容入口。
- `dist/profile.html`：个人介绍、兴趣、设备、经历与联系方式。
- `dist/profile.css`：Personal Profile 的专用样式。
- `dist/now.html`、`dist/now.css`：近况时间线及专用样式。新增记录时在 `.timeline-list` 开头添加条目，使用唯一的标题 ID，并同步最近更新日期与记录数量。
- `dist/styles.css`：颜色、布局、响应式样式。
- `dist/i18n.js`：中英文文案、页面绑定及语言偏好逻辑；修改正文时同步更新这里的翻译。
- `dist/language.css`：语言切换按钮，以及双语排版适配。
- `dist/personal-content.js`：真实个人资料的中英文文案，覆盖初版的通用介绍。更新个人资料优先维护这里及 HTML 中的默认文案。
- `dist/personal.css`：个人兴趣、运动主题、设备、联系区及通用动效样式。
- `dist/personal.js`：邮箱复制与语言切换反馈。
- `dist/motion.js`：滚动入场、鼠标轻微倾斜。响应系统减少动态效果设置，触屏不启用倾斜；内容在脚本不可用时仍可阅读。
- `dist/assets/hero-asterisk.png`：为此页面生成的原创主视觉。
- `dist/assets/stephen-curry-2016.jpg`、`charles-leclerc-2024.jpg`：真实运动员照片；署名与授权见页面底部及 `dist/assets/PHOTO-CREDITS.md`。照片仅通过 CSS 裁切、调色和覆盖渐变，保留相应 CC BY-SA 授权。
- `dist/assets/icons.svg`：Lucide 与 Tabler 图标，授权见同目录的 `LUCIDE-LICENSE.txt` 与 `TABLER-LICENSE.txt`。

现有三个项目均为概念示例，页面已明确标注。替换真实项目时填写 `name`、`subtitle`、`description`、`detail`、`tags`，将 `demo` 改为 `false`；`repoUrl` 与 `liveUrl` 可分别设置源码和在线演示链接。不填写的链接不会显示。新增项目没有对应预览设计时，封面会使用项目名称。

`layout` 可设为 `feature`（横向主展位）、`sound`（窄卡片）、`utility`（宽卡片）或 `standard`（标准卡片）。`headline` 可单独配置 Gallery 文案并使用换行；不填写时使用 `subtitle`。展示数量自动按项目清单更新。

项目的 `translations.zh`、`translations.en` 用于覆盖相应语言的 `category`、`subtitle`、`headline`、`description`、`detail` 和 `tags`；未提供的字段使用项目基础值。新增或替换真实项目时请同时维护两种语言。

Now 页的正文使用 `data-i18n` 对应 `dist/i18n.js` 的 `now.*` 翻译。日期固定记录事件发生的那一天，不会随着访问日期改变；新增时间节点时请同时添加中英文文案。

## 发布与部署

源码仓库：[ChefDavid0815/personal-homepage](https://github.com/ChefDavid0815/personal-homepage)。Vercel 使用 `vercel.json` 中的配置，运行 `npm run check` 后发布 `dist` 目录。首页为 Personal Profile，Gallery 和 Now 均为独立页面。

ChefZC 是展示昵称，GitHub 账号为 ChefDavid0815。字体通过 Google Fonts 加载，离线时使用系统字体；照片与图标随站点本地提供。

## 检查

`npm run check` 检查浏览器脚本、项目数据和预览服务的 JavaScript 语法。
