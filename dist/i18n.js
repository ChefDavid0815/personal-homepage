import { personalMessages } from './personal-content.js';
import { musicMessages } from './music-content.js';
// Authored translations only. HTML values preserve the site's existing visual accents.
export const messages = {
  'nav.label': ['主导航', 'Main navigation'],
  'nav.now': ['近况', 'Now'],
  'now.title': ['Now — ChefZC 的近况', 'Now — ChefZC'],
  'now.meta': ['ChefZC 的近况与进展。2026 年 9 月 16 日，正式创造自己的个人主页。', 'Updates from ChefZC. September 16, 2026: the day I started building my own personal website.'],
  'now.skip': ['跳到近况记录', 'Skip to updates'],
  'now.eyebrow': ['近况与进展', 'A WORK IN PROGRESS'],
  'now.intro': ['记录正在做的事，也记住每一次开始。', 'What I’m working on, and where it all begins.'],
  'now.updated': ['最近更新', 'LAST UPDATED'],
  'now.building': ['持续构建中', 'Still building'],
  'now.timeline': ['成长记录', 'THE TIMELINE'],
  'now.firstStep': ['第一步', 'FIRST STEP'],
  'now.beginning': ['一个新的开始', 'A NEW BEGINNING'],
  'now.firstTitle': ['正式创造自己的个人主页', 'Started building my own personal website'],
  'now.firstText': ['今天，为自己在互联网上留下一块空间。个人介绍、项目作品和之后的新想法，都从这里开始。', 'Today, I started making a space of my own on the internet. A home for who I am, the projects I make, and the ideas still to come.'],
  'now.tagsLabel': ['主页内容', 'Website features'],
  'now.tagProfile': ['个人介绍', 'Personal profile'],
  'now.tagGallery': ['作品集', 'Project gallery'],
  'now.tagBilingual': ['中英文切换', 'Chinese / English'],
  'now.viewGallery': ['看看我的作品集', 'Explore my Gallery'],
  'now.origin': ['一切从这里开始。', 'It all starts here.'],
  'nav.profile': ['个人介绍', '<span class="nav-long">Personal </span>Profile'],
  'nav.profileLabel': ['个人介绍', 'Personal Profile'],
  'nav.gallery': ['作品集<span class="nav-count" aria-hidden="true">↗</span>', 'Gallery<span class="nav-count" aria-hidden="true">↗</span>'],
  'nav.home': ['ChefZC 个人主页', 'ChefZC personal profile'],
  'nav.edition': ['个人空间 <span>/</span> 001', 'PERSONAL SPACE <span>/</span> 001'],
  'language.label': ['选择语言', 'Choose language'],
  'language.changed': ['已切换为中文', 'Language switched to English'],
  'footer.note': ['保持好奇 · 持续创造 · 2026', 'BUILT WITH CURIOSITY · 2026'],
  'footer.top': ['回到顶部 <span aria-hidden="true">↑</span>', 'Back to top <span aria-hidden="true">↑</span>'],
  'gallery.title': ['Gallery — ChefZC 数字作品陈列室', 'Gallery — ChefZC Digital Collection'],
  'gallery.meta': ['ChefZC 的数字作品陈列室。试玩第一个正式项目 NBA After Hours，探索代码、篮球与好奇心。', 'The digital collection by ChefZC. Play NBA After Hours, my first released project, and explore code, basketball, and curiosity.'],
  'gallery.skip': ['跳到作品', 'Skip to projects'],
  'gallery.kicker': ['<span class="lime-text">[</span> 数字作品陈列室 <span class="lime-text">]</span>', '<span class="lime-text">[</span> THE DIGITAL COLLECTION <span class="lime-text">]</span>'],
  'gallery.mark': ['灵感，正在成形', 'MADE OF IDEAS'],
  'gallery.headline': ['好玩的想法，<span>值得一个展位。</span>', 'Good ideas <span>deserve a space.</span>'],
  'gallery.intro': ['一些关于代码、设计和好奇心的探索。<br>把每一次「试试看」，留在这里。', 'Experiments in code, design, and curiosity.<br>A home for every “let’s try it.”'],
  'gallery.selected': ['作品与实验', 'PROJECTS & EXPERIMENTS'],
  'gallery.notice': ['正式作品 <span>/</span> 概念习作', 'Released projects <span>/</span> Concept studies'],
  'court.first': ['我的第一个正式项目', 'MY FIRST RELEASE'],
  'court.play': ['立即上场', 'PLAY NOW'],
  'court.source': ['探索源码', 'EXPLORE THE CODE'],
  'court.teams': ['支球队', 'TEAMS'],
  'court.modes': ['比赛阵容', 'ON COURT'],
  'court.local': ['同机对战', 'LOCAL PLAYERS'],
  'court.capture': ['真实游戏画面', 'ACTUAL GAMEPLAY'],
  'court.noInstall': ['浏览器直接玩 · 无需注册', 'IN YOUR BROWSER · NO SIGN-UP'],
  'court.controls': ['WASD 移动，按住空格投篮，在绿色区间松开。也支持手柄与触屏。', 'Move with WASD. Hold Space to shoot; release in the green window. Controller and touch supported.'],
  'court.browserSave': ['进度保存在当前浏览器。换设备前，可在游戏设置中导出备份。', 'Progress stays in this browser. Export a backup in game settings before switching devices.'],
  'gallery.end': ['本次陈列到此', 'END OF COLLECTION'],
  'gallery.continue': ['持续创造，继续探索。 <b aria-hidden="true">✳</b>', 'STILL MAKING. STILL EXPLORING. <b aria-hidden="true">✳</b>'],
  'gallery.behind1': ['作品', 'BEHIND'],
  'gallery.behind2': ['背后的我', 'THE WORK'],
  'gallery.by': ['CHEFZC 的个人作品集', 'A COLLECTION BY CHEFZC'],
  'gallery.closingTitle': ['作品是起点，好奇心是线索。', 'The work starts here. Curiosity leads on.'],
  'gallery.closingText': ['这里会继续收集新的项目、实验，以及那些值得被看见的小想法。', 'More projects, experiments, and small ideas worth sharing will find a home here.'],
  'gallery.creator': ['认识创作者', 'Meet the creator'],
  'gallery.profileLabel': ['个人介绍', 'PERSONAL PROFILE'],
  'project.viewAria': ['查看 {name} 项目详情', 'View {name} project details'],
  'project.view': ['查看项目', 'View project'],
  'project.concept': ['概念', 'CONCEPT'],
  'project.project': ['作品', 'PROJECT'],
  'project.featuredConcept': ['精选概念', 'FEATURED CONCEPT'],
  'project.featuredProject': ['精选作品', 'FEATURED PROJECT'],
  'project.demo': ['概念示例', 'Concept demo'],
  'project.work': ['项目作品', 'Project'],
  'project.exhibit': ['展品', 'EXHIBIT'],
  'project.aboutConcept': ['关于这个概念', 'About the concept'],
  'project.aboutProject': ['关于这个项目', 'About the project'],
  'project.type': ['类型', 'Category'],
  'project.status': ['状态', 'Status'],
  'project.tags': ['标签', 'Tags'],
  'project.demoStatus': ['概念示例 · 非已发布作品', 'Concept demo · Not a released product'],
  'project.live': ['在线体验 ↗', 'Live demo ↗'],
  'project.source': ['GitHub 源码 ↗', 'Source on GitHub ↗'],
  'project.close': ['关闭项目详情', 'Close project details'],
  'profile.title': ['个人介绍 — ChefZC', 'Personal Profile — ChefZC'],
  'profile.meta': ['认识 ChefZC。一个保持好奇、喜欢动手的数字世界探索者。这里记录我的创作想法，以及想做出来的东西。', 'Meet ChefZC: a curious, hands-on explorer of the digital world. Get to know the person and ideas behind the projects.'],
  'profile.skip': ['跳到个人介绍', 'Skip to personal introduction'],
  'profile.eyebrow': ['<span class="bracket">[</span> 作品背后的那个人 <span class="bracket">]</span>', '<span class="bracket">[</span> THE HUMAN BEHIND THE PROJECTS <span class="bracket">]</span>'],
  'profile.heroTitle': ['<span class="profile-greeting">你好，我是</span><br><span class="profile-name">ChefZC</span><span class="profile-cursor" aria-hidden="true">_</span>', '<span class="profile-greeting">Hi, I’m</span><br><span class="profile-name">ChefZC</span><span class="profile-cursor" aria-hidden="true">_</span>'],
  'profile.headline': ['保持好奇。<br class="mobile-line">偶尔脑洞大开。<span class="profile-spark" aria-hidden="true">✳</span>', 'Stay curious.<br class="language-mobile-break"> Think a little differently.<span class="profile-spark" aria-hidden="true">✳</span>'],
  'profile.intro': ['一个喜欢把「要不试试」变成现实的人。<br>在代码、设计和新想法之间，探索更多可能。', 'I turn “what if?” into something real.<br>Exploring where code, design, and new ideas meet.'],
  'profile.galleryCta': ['逛逛我的 Gallery <span aria-hidden="true">↗</span>', 'Explore my Gallery <span aria-hidden="true">↗</span>'],
  'profile.aboutCta': ['更多关于我 <span aria-hidden="true">↓</span>', 'More about me <span aria-hidden="true">↓</span>'],
  'profile.coordinate': ['个人介绍', 'PERSONAL PROFILE'],
  'profile.curiosity': ['好奇心，全速运行', '100% CURIOSITY'],
  'profile.sticker': ['不止是一个用户名。', 'NOT JUST A USERNAME.'],
  'profile.cardLabel': ['ChefZC 数字名片', 'ChefZC digital identity card'],
  'profile.digitalId': ['数字身份', 'DIGITAL ID'],
  'profile.mind': ['独立想法，自成一派。', 'A MIND OF MY OWN.'],
  'profile.role': ['默认保持好奇', 'CURIOUS BY DEFAULT'],
  'profile.alias': ['昵称', 'ALIAS'],
  'profile.mindset': ['心态', 'MINDSET'],
  'profile.exploring': ['继续探索', 'Keep exploring'],
  'profile.mode': ['模式', 'MODE'],
  'profile.make': ['让想法成真<span class="identity-caret" aria-hidden="true">▌</span>', 'Make it real<span class="identity-caret" aria-hidden="true">▌</span>'],
  'profile.caption': ['<span class="lime-text">+</span> 我的数字世界，小小一角', '<span class="lime-text">+</span> A SMALL CORNER OF MY DIGITAL WORLD'],
  'profile.process': ['<span class="mono">思考</span><span>→</span><span class="mono">动手</span><span>→</span><span class="mono">打磨</span><span class="divider-rule"></span><span class="mono">继续 <b>↺</b></span>', '<span class="mono">THINK</span><span>→</span><span class="mono">MAKE</span><span>→</span><span class="mono">REFINE</span><span class="divider-rule"></span><span class="mono">REPEAT <b>↺</b></span>'],
  'profile.aboutEyebrow': ['01 / 一点关于我', '01 / A LITTLE ABOUT ME'],
  'profile.aboutTitle': ['用户名之外<span class="purple-dot">.</span>', 'Beyond the username<span class="purple-dot">.</span>'],
  'profile.personalEdition': ['个人特别版', 'THE PERSONAL EDITION'],
  'profile.readmeTitle': ['<span class="mono">#</span> 你好，再正式认识一下。', '<span class="mono">#</span> Let’s get properly acquainted.'],
  'profile.bio1': ['我是 <strong>ChefZC</strong>。这里是我在互联网上的一小块自留地，用来安放作品，也用来留住那些值得动手的想法。', 'I’m <strong>ChefZC</strong>. This is my little corner of the internet: a home for my work and the ideas worth bringing to life.'],
  'profile.bio2': ['比起让灵感停留在脑海里，我更喜欢把它打开、试一试，再一点点做成自己的样子。一个小工具，一个新页面，一次没试过的尝试，都可以是起点。', 'I like taking an idea out of my head, trying it, and shaping it into something of my own. A small tool, a new page, or an unfamiliar experiment can be the starting point.'],
  'profile.bio3': ['慢慢积累，持续更新。<br><span>这个空间和我，都还在生长。</span>', 'A little progress, made often.<br><span>This space, like me, is still growing.</span>'],
  'profile.readmeStatus': ['文字很简单，想法很真实。', 'PLAIN TEXT. REAL THOUGHTS.'],
  'profile.manifestoLabel': ['创作宣言', 'Creative manifesto'],
  'profile.note': ['写给自己', 'NOTE TO SELF'],
  'profile.artAlt': ['荧光色与液态金属交织的星形雕塑', 'A sculptural asterisk in fluorescent colors and liquid chrome'],
  'profile.whatIf': ['永远给<br><span>「如果呢？」</span><br>留一点空间。', 'Always leave<br><span>a little room</span><br>for “what if?”'],
  'profile.weird': ['保留一点不一样。', 'STAY A LITTLE WEIRD.'],
  'profile.principlesEyebrow': ['02 / 我的创作准则', '02 / MY OPERATING SYSTEM'],
  'profile.principlesTitle': ['我的创作偏好<span class="lime-text">.</span>', 'How I like to create<span class="lime-text">.</span>'],
  'profile.craftLabel': ['01 / 用心打磨', '01 / CRAFT'],
  'profile.craftTitle': ['好用，也要好看。', 'Useful can be beautiful.'],
  'profile.craftText': ['功能让一个想法成立，细节让人愿意留下。两件事，都值得认真对待。', 'Function makes an idea work. Details make it worth staying for. Both deserve care.'],
  'profile.experimentLabel': ['02 / 动手尝试', '02 / EXPERIMENT'],
  'profile.experimentTitle': ['先做一个小小的版本。', 'Start with a small version.'],
  'profile.experimentText': ['从一个能运行的想法开始。在真实的尝试里，找到下一步的方向。', 'Start with an idea that works. Let real experiments point the way to the next step.'],
  'profile.curiosityLabel': ['03 / 保持好奇', '03 / CURIOSITY'],
  'profile.curiosityTitle': ['给未知留个位置。', 'Make room for the unknown.'],
  'profile.curiosityText': ['不急着定义边界。有意思的新东西，总值得多问一句、多试一次。', 'There’s no rush to set the boundaries. Something interesting deserves another question and another try.'],
  'profile.bridgeEyebrow': ['聊过了我，再看看作品。', 'ENOUGH ABOUT ME. LET’S SEE THE WORK.'],
  'profile.bridgeTitle': ['想法的另一面，<br>是<span>做出来的东西。</span>', 'On the other side of an idea<br>is <span>something you can see.</span>'],
  'profile.bridgeNote': ['我的项目、实验，还有下一次新尝试。', 'My projects, experiments, and whatever comes next.'],
  'profile.openGallery': ['打开作品集', 'OPEN GALLERY'],
  'profile.enterGallery': ['进入项目陈列室 <span aria-hidden="true">→</span>', 'Step into the collection <span aria-hidden="true">→</span>']
};

Object.assign(messages, personalMessages, musicMessages);
const storageKey = 'chefzc.language';
let language = 'zh';
try { if (globalThis.localStorage?.getItem(storageKey) === 'en') language = 'en'; } catch { /* Storage may be disabled; the switch still works. */ }
const listeners = new Set();
export const getLanguage = () => language;
export function t(key, params = {}) {
  const pair = messages[key];
  if (!pair) throw new Error(`Missing translation: ${key}`);
  return pair[language === 'en' ? 1 : 0].replace(/\{(\w+)\}/g, (match, name) => params[name] ?? match);
}
export const localizeProject = project => ({ ...project, ...(project.translations?.[language] || {}) });
export function onLanguageChange(listener) { listeners.add(listener); return () => listeners.delete(listener); }

const commonBindings = [
  ['nav.page-nav', 'nav.label', 'aria-label'], ['.brand', 'nav.home', 'aria-label'],
  ['.page-nav a[href="./now.html"]', 'nav.now'],
  ['.page-nav a[href="./profile.html"]', 'nav.profile', 'html'], ['.page-nav a[href="./profile.html"]', 'nav.profileLabel', 'aria-label'],
  ['.page-nav a[href="./gallery.html"]', 'nav.gallery', 'html'], ['.edition', 'nav.edition', 'html'],
  ['.language-switch', 'language.label', 'aria-label'], ['.site-footer > .mono', 'footer.note'], ['.back-top', 'footer.top', 'html']
];
const bindings = {
  now: [['title', 'now.title'], ['meta[name="description"]', 'now.meta', 'content']],
  gallery: [
    ['title','gallery.title'], ['meta[name="description"]','gallery.meta','content'], ['.skip-link','gallery.skip'],
    ['.gallery-kicker > span:first-child','gallery.kicker','html'], ['.collection-mark > span','gallery.mark'],
    ['.gallery-introduction h2','gallery.headline','html'], ['.gallery-introduction > p','gallery.intro','html'],
    ['#collection-title > .mono:first-child','gallery.selected'], ['.collection-toolbar > p','gallery.notice','html'],
    ['.collection-end > span:first-child','gallery.end'], ['.collection-end > span:last-child','gallery.continue','html'],
    ['.colophon-index > span:nth-child(1)','gallery.behind1'], ['.colophon-index > span:nth-child(2)','gallery.behind2'],
    ['.colophon-copy .eyebrow','gallery.by'], ['#colophon-title','gallery.closingTitle'], ['.colophon-copy > p:last-child','gallery.closingText'],
    ['.creator-link > span:first-child','gallery.creator'], ['.creator-link .mono','gallery.profileLabel'], ['.dialog-close','project.close','aria-label']
  ],
  profile: [
    ['title','profile.title'], ['meta[name="description"]','profile.meta','content'], ['.skip-link','profile.skip'],
    ['.profile-hero-copy > .eyebrow','profile.eyebrow','html'], ['#profile-title','profile.heroTitle','html'],
    ['.profile-headline','profile.headline','html'], ['.profile-hero-description','profile.intro','html'],
    ['.profile-actions .primary-button','profile.galleryCta','html'], ['.intro-link','profile.aboutCta','html'],
    ['.profile-coordinate > span:first-child','profile.coordinate'], ['.profile-coordinate > span:last-child','profile.curiosity'],
    ['.identity-floating','profile.sticker'], ['.identity-card','profile.cardLabel','aria-label'], ['.identity-top > span:first-child','profile.digitalId'],
    ['.identity-art-footer > span:first-child','profile.mind'], ['.identity-role','profile.role'],
    ['.identity-fields > div:nth-child(1) dt','profile.alias'], ['.identity-fields > div:nth-child(2) dt','profile.mindset'],
    ['.identity-fields > div:nth-child(2) dd','profile.exploring'], ['.identity-fields > div:nth-child(3) dt','profile.mode'],
    ['.identity-fields > div:nth-child(3) dd','profile.make','html'], ['.identity-caption','profile.caption','html'], ['.profile-divider','profile.process','html'],
    ['.profile-intro .profile-section-heading .eyebrow','profile.aboutEyebrow'], ['#intro-title','profile.aboutTitle','html'],
    ['.readme-toolbar > span:last-child','profile.personalEdition'], ['.readme-title','profile.readmeTitle','html'],
    ['.readme-content > p:nth-child(2)','profile.bio1','html'], ['.readme-content > p:nth-child(3)','profile.bio2'],
    ['.readme-last','profile.bio3','html'], ['.readme-status > span:first-child','profile.readmeStatus'],
    ['.curiosity-panel','profile.manifestoLabel','aria-label'], ['.curiosity-top > span:first-child','profile.note'], ['.curiosity-art','profile.artAlt','alt'],
    ['.curiosity-copy > p','profile.whatIf','html'], ['.curiosity-copy > .mono','profile.weird'],
    ['.principles-section .eyebrow','profile.principlesEyebrow'], ['#principles-title','profile.principlesTitle','html'],
    ['.principle-lime .principle-top .mono','profile.craftLabel'], ['.principle-lime h3','profile.craftTitle'], ['.principle-lime p','profile.craftText'],
    ['.principle-purple .principle-top .mono','profile.experimentLabel'], ['.principle-purple h3','profile.experimentTitle'], ['.principle-purple p','profile.experimentText'],
    ['.principle-cyan .principle-top .mono','profile.curiosityLabel'], ['.principle-cyan h3','profile.curiosityTitle'], ['.principle-cyan p','profile.curiosityText'],
    ['.gallery-bridge .eyebrow','profile.bridgeEyebrow'], ['#gallery-bridge-title','profile.bridgeTitle','html'], ['.bridge-note','profile.bridgeNote'],
    ['.gallery-door > .mono','profile.openGallery'], ['.door-bottom','profile.enterGallery','html']
  ]
};

export function applyTranslations() {
  document.documentElement.lang = language === 'en' ? 'en' : 'zh-CN';
  const page = ['gallery', 'profile', 'now'].find(name => document.body.classList.contains(`${name}-page`)) || 'profile';
  for (const [selector, key, mode] of [...commonBindings, ...bindings[page]]) {
    for (const element of document.querySelectorAll(selector)) {
      if (mode === 'html') element.innerHTML = t(key);
      else if (mode) element.setAttribute(mode, t(key));
      else element.textContent = t(key);
    }
  }
  document.querySelectorAll('[data-i18n]').forEach(element => { element.textContent = t(element.dataset.i18n); });
  document.querySelectorAll('[data-i18n-label]').forEach(element => { element.setAttribute('aria-label', t(element.dataset.i18nLabel)); });
  document.querySelectorAll('[data-i18n-alt]').forEach(element => { element.setAttribute('alt', t(element.dataset.i18nAlt)); });
  document.querySelectorAll('[data-language]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.language === language)));
}

export function setLanguage(next, { persist = true, announce = true } = {}) {
  if (!['zh', 'en'].includes(next) || next === language) return;
  language = next;
  if (persist) { try { localStorage.setItem(storageKey, next); } catch { /* In-memory switching remains available. */ } }
  applyTranslations();
  listeners.forEach(listener => listener(language));
  if (announce) document.querySelector('#language-announcement').textContent = t('language.changed');
}

function initialize() {
  applyTranslations();
  document.querySelectorAll('[data-language]').forEach(button => button.addEventListener('click', () => setLanguage(button.dataset.language)));
  window.addEventListener('storage', event => {
    if (event.key === storageKey || event.key === null) setLanguage(event.newValue === 'en' ? 'en' : 'zh', { persist: false, announce: false });
  });
}
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initialize, { once: true });
  else initialize();
}
