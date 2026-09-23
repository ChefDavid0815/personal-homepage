import {getLanguage} from './i18n.js';

const t = (zh, en) => getLanguage() === 'en' ? en : zh;
const repo = 'https://github.com/ChefDavid0815/atlas-diploma-observatory';
const fresco = './assets/projects/atlas/philosophical-cosmos-03.webp';
const pigment = './assets/projects/atlas/cosmic-pigment-03.webp';
const observatory = './atlas/art/renaissance-observatory.png';

const compass = `<svg class="atlas-v2-compass" viewBox="0 0 280 280" aria-hidden="true"><circle cx="140" cy="140" r="127"/><circle cx="140" cy="140" r="111"/><circle cx="140" cy="140" r="71"/><circle cx="140" cy="140" r="5"/><path d="M140 0v280M0 140h280M41 41l198 198M239 41 41 239"/><path d="m140 24 13 103 103 13-103 13-13 103-13-103-103-13 103-13z"/></svg>`;
const orrery = `<svg class="atlas-v2-orrery" viewBox="0 0 520 520" aria-hidden="true"><circle cx="260" cy="260" r="234"/><circle cx="260" cy="260" r="205"/><circle cx="260" cy="260" r="149"/><circle cx="260" cy="260" r="94"/><circle cx="260" cy="260" r="8"/><ellipse cx="260" cy="260" rx="230" ry="88" transform="rotate(-31 260 260)"/><ellipse cx="260" cy="260" rx="208" ry="117" transform="rotate(36 260 260)"/><path d="M260 0v520M0 260h520M75 75l370 370M445 75 75 445"/><circle cx="101" cy="355" r="6"/><circle cx="414" cy="183" r="8"/><circle cx="375" cy="407" r="4"/></svg>`;
const constellations = `<svg class="atlas-v2-network" viewBox="0 0 1000 500" preserveAspectRatio="none" aria-hidden="true"><path d="M76 364 184 230 304 306 391 133 505 260 622 122 738 240 898 103M184 230 391 133M304 306 505 260M505 260 738 240"/>${[[76,364],[184,230],[304,306],[391,133],[505,260],[622,122],[738,240],[898,103]].map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="${i%3===0?4:2.5}"/>`).join('')}</svg>`;

const subjects = [
  ['I','语言与文学','LANGUAGE & LITERATURE'],
  ['II','语言习得','LANGUAGE ACQUISITION'],
  ['III','个人与社会','INDIVIDUALS & SOCIETIES'],
  ['IV','科学','SCIENCES'],
  ['V','数学','MATHEMATICS'],
  ['VI','艺术','THE ARTS']
];

function actions() {
  return `<div class="atlas-v2-actions"><a class="atlas-v2-primary" href="./atlas/">${t('进入知识宇宙','Enter the observatory')}<span aria-hidden="true">↗</span></a><a href="${repo}" target="_blank" rel="noopener noreferrer">${t('查看项目源码','Explore the source')}<span aria-hidden="true">↗</span></a><a href="./post.html?article=atlas">${t('阅读制作手记','Read the field notes')}<span aria-hidden="true">↗</span></a></div>`;
}

function sky() {
  return `<div class="atlas-v2-plate atlas-v2-plate--sky"><img src="${pigment}" width="1672" height="941" alt="" loading="lazy"><canvas class="atlas-v2-stars" aria-hidden="true"></canvas>${constellations}<div class="atlas-v2-sky-title"><span>FIG. I / THE LIVING ATLAS</span><strong>${t('每一颗星，<br>都是一个问题。','EVERY STAR<br>BEGINS WITH A QUESTION.')}</strong></div><div class="atlas-v2-sky-count"><b>784</b><span>${t('知识节点','NODES OF KNOWLEDGE')}</span></div>${orrery}</div>`;
}

function manuscript() {
  return `<div class="atlas-v2-plate atlas-v2-plate--manuscript"><img src="${observatory}" width="1536" height="1024" alt="" loading="lazy"><div class="atlas-v2-manuscript-copy"><span>FOLIO II / THE MANUSCRIPT</span><b>II</b><strong>${t('让知识，<br>有可以翻阅的温度。','A MANUSCRIPT<br>FOR THE MIND.')}</strong><p>${t('从星图进入主题与概念，沿着 241 篇笔记读下去。','Enter a topic from the sky, then follow 241 original study notes.')}</p></div><span class="atlas-v2-manuscript-index">AD ASTRA · PER SCIENTIAM</span></div>`;
}

function index() {
  return `<div class="atlas-v2-plate atlas-v2-plate--index"><div class="atlas-v2-index-head"><span>INDEX III / SIX SUBJECT GROUPS</span>${compass}<span>THE DIPLOMA CONSTELLATION</span></div><div class="atlas-v2-index-title">${t('六门学科，一片星空。','SIX DOMAINS. ONE SKY.')}</div><div class="atlas-v2-index-grid">${subjects.map(([n,zh,en])=>`<div><b>${n}</b><span>${t(zh,en)}</span><i aria-hidden="true"></i></div>`).join('')}</div><span class="atlas-v2-index-foot">TOK <i>·</i> EE <i>·</i> CAS <span> / THE DP CORE</span></span></div>`;
}

const views = {
  sky: {number:'01', zh:'星图', en:'THE SKY', descriptionZh:'在 784 个知识节点间寻找联系。', descriptionEn:'Find relationships among 784 knowledge nodes.', render:sky},
  manuscript: {number:'02', zh:'手稿', en:'THE MANUSCRIPT', descriptionZh:'把每一个主题读成自己的理解。', descriptionEn:'Turn every topic into a deeper reading.', render:manuscript},
  index: {number:'03', zh:'学科索引', en:'THE INDEX', descriptionZh:'从学科、主题与 DP 核心开始。', descriptionEn:'Begin with subjects, topics and the DP core.', render:index}
};

export function atlasView(id='sky') {
  const active = views[id] || views.sky;
  return `<section class="atlas-v2-view atlas-view" data-atlas-view-active="${id}" aria-label="${t('Atlas 观星视角','Atlas observatory views')}"><div class="atlas-v2-view-head"><span>THE OBSERVATORY / PLATES I–III</span><span>CHEFZC · 2026</span></div><div class="atlas-v2-view-layout"><div class="atlas-v2-view-rail"><p>${t('选择一页观星手稿','CHOOSE A CELESTIAL PLATE')}</p><div role="group" aria-label="${t('切换展柜视角','Switch exhibit view')}">${Object.entries(views).map(([key,view])=>`<button type="button" data-atlas-view="${key}" aria-pressed="${id===key}"><b>${view.number}</b><span>${t(view.zh,view.en)}</span><i aria-hidden="true">↗</i></button>`).join('')}</div><div class="atlas-v2-view-aside"><span>FIG. ${active.number}</span><p class="atlas-v2-view-description">${t(active.descriptionZh,active.descriptionEn)}</p><small>${t('艺术化展柜画面。完整知识图谱请进入 Atlas 网页版。','An artistic exhibit. Open Atlas for the working knowledge map.')}</small></div></div><div class="atlas-v2-view-stage" aria-live="polite">${active.render()}</div></div></section>`;
}

export function changeAtlasView(button) {
  const host=button.closest('.atlas-v2-view');
  const id=button.dataset.atlasView;
  if(!host || !views[id] || host.dataset.atlasViewActive===id) return;
  host.dataset.atlasViewActive=id;
  host.querySelectorAll('[data-atlas-view]').forEach(item=>item.setAttribute('aria-pressed',String(item===button)));
  host.querySelector('.atlas-v2-view-stage').innerHTML=views[id].render();
  host.querySelector('.atlas-v2-view-aside>span').textContent=`FIG. ${views[id].number}`;
  host.querySelector('.atlas-v2-view-description').textContent=t(views[id].descriptionZh,views[id].descriptionEn);
  document.dispatchEvent(new Event('atlas:render'));
}

export function atlasCard() {
  return `<article class="exhibit exhibit--atlas atlas-v2-exhibit" id="project-atlas"><div class="atlas-v2-edition"><span>CHEFZC / THE DIGITAL COLLECTION</span><span>NO. 07 <i>✦</i> ATLAS 0.3.0</span></div><div class="atlas-v2-overture"><img class="atlas-v2-overture-art" src="${fresco}" width="1672" height="941" alt="" fetchpriority="high"><canvas class="atlas-v2-stars" aria-hidden="true"></canvas><div class="atlas-v2-overture-frame" aria-hidden="true"></div><div class="atlas-v2-overture-top"><span>AD ASTRA · PER SCIENTIAM</span><span>ANNO MMXXVI</span></div><div class="atlas-v2-overture-copy"><span>${t('一部关于求知的宇宙志','THE BOOK OF CONNECTIONS')}</span><h3>ATLAS<span>.</span></h3><p>${t('在思想之上，仰望无垠。','Above every idea, a wider universe.')}</p></div><div class="atlas-v2-overture-bottom"><span>IB DIPLOMA OBSERVATORY / 0.3.0</span>${compass}<span>${t('向下翻阅手稿','SCROLL TO UNFOLD')} ↓</span></div></div><div class="atlas-v2-prologue"><div><span class="atlas-v2-overline">PROLOGUE / 观星手记</span><h3>${t('打开一门课，<br><em>也打开一片夜空。</em>','OPEN A SUBJECT.<br><em>OPEN A SKY.</em>')}</h3></div><div><p>${t('Atlas 把 IB 的学科、主题、概念与手记连成一片可以漫游的星空。文艺复兴的建筑与手稿，给每个知识点一处可以停留、追问和继续前行的地方。','Atlas connects IB subjects, topics, concepts and notes into a navigable sky. Renaissance architecture and manuscript craft give each idea room to be seen, questioned and followed.')}</p><button type="button" data-project="atlas">${t('打开作品档案','Open the project folio')} <span aria-hidden="true">↗</span></button></div></div><div class="atlas-v2-ledger"><div><b>784</b><span>${t('知识节点','KNOWLEDGE NODES')}</span></div><div><b>1,059</b><span>${t('条知识关联','CONNECTIONS')}</span></div><div><b>241</b><span>${t('篇主题手记','TOPIC NOTES')}</span></div><p>${t('数字是地图的刻度，<br>好奇心才是方向。','NUMBERS MARK THE MAP.<br>CURIOSITY SETS THE COURSE.')}</p></div>${atlasView()}<div class="atlas-v2-epilogue"><img src="${observatory}" width="1536" height="1024" alt="" loading="lazy"><div class="atlas-v2-epilogue-copy"><span>EPILOGUE / THE OPEN OBSERVATORY</span><h3>${t('带着一个问题来，<br>带着更多问题离开。','ARRIVE WITH A QUESTION.<br>LEAVE WITH A UNIVERSE.')}</h3>${actions()}<small>${t('Atlas 是独立学习工具，并非 IB 官方产品或完整考纲。知识关联包含编辑性的阅读路径，不等于官方先修关系。','Atlas is an independent study tool, not an official IB product or exhaustive syllabus. Editorial reading paths are not official prerequisites.')}</small></div></div></article>`;
}

export function atlasDetail(id='sky') {
  return `<div class="atlas-v2-detail atlas-detail"><header class="atlas-v2-detail-head"><span>CHEFZC / PROJECT FOLIO 07 / V 0.3.0</span><h2 id="dialog-title">ATLAS<span>.</span></h2><p>${t('把知识连成星座，把好奇心写进手稿。','Knowledge as constellations. Curiosity as a manuscript.')}</p>${compass}</header>${atlasView(id)}<div class="atlas-v2-detail-chapters"><section><span>I / THE QUESTION</span><h3>${t('一章之外，还有什么？','WHAT LIES BEYOND A CHAPTER?')}</h3><p>${t('从一门学科走向主题，再从一个概念走向相邻的问题。Atlas 0.3 整理了 784 个节点、1,059 条关系与 241 篇主题手记，让求知不止于目录。','Move from a subject to a topic, then from one concept to its neighbours. Atlas 0.3 maps 784 nodes, 1,059 relationships and 241 topic notes so curiosity can travel beyond a table of contents.')}</p></section><section><span>II / THE MATERIAL</span><h3>${t('青金石的夜，羊皮纸的光。','LAPIS SKY. VELLUM LIGHT.')}</h3><p>${t('深蓝宇宙、黄铜轨道、文艺复兴壁画和古典字形共同组成观星台。中文标题采用朱雀仿宋，正文采用霞鹜文楷 GB；网页版与 Windows 桌面版共用同一套知识内容。','A lapis sky, brass orbits, a Renaissance fresco and classical typography form the observatory. Zhuque Fangsong and LXGW WenKai GB shape the Chinese reading experience. Web and Windows editions share the same knowledge content.')}</p></section><section><span>III / THE BOUNDARY</span><h3>${t('一张诚实的探索地图。','AN HONEST MAP FOR EXPLORATION.')}</h3><p>${t('Atlas 并非 IB 官方认证或完整课程大纲；部分连线是编辑性的阅读顺序。网页和桌面版分别保存本地学习进度，Windows 程序目前尚未签名。','Atlas is not IB-certified or an exhaustive syllabus; some edges are editorial reading sequences. Web and desktop progress remain in separate local profiles. Windows binaries are unsigned.')}</p></section></div>${actions()}</div>`;
}

export function atlasPostArt() {
  return `<div class="post-art post-art--atlas atlas-v2-post-art" aria-hidden="true"><img src="${observatory}" width="1536" height="1024" alt="" loading="lazy"><canvas class="atlas-v2-stars"></canvas><div class="atlas-v2-post-border"></div><div class="atlas-v2-post-top"><span>CHEFZC / FIELD NOTES</span><span>X / MMXXVI</span></div><div class="atlas-v2-post-title"><small>THE DIPLOMA OBSERVATORY</small><strong>ATLAS<span>.</span></strong><em>${t('在思想之上，仰望无垠。','ABOVE EVERY IDEA, A WIDER UNIVERSE.')}</em></div><div class="atlas-v2-post-foot"><span>V 0.3.0 / AN OPEN BOOK OF CONNECTIONS</span><span>✦</span></div></div>`;
}

export function atlasNowArt() {
  return `<div class="milestone-art atlas-now-art atlas-v2-now" aria-hidden="true"><img src="${fresco}" width="1672" height="941" alt="" loading="lazy"><canvas class="atlas-v2-stars"></canvas><span class="atlas-v2-now-top">ATLAS / MICRO OBSERVATORY <b>✦</b></span>${orrery}<div class="atlas-v2-now-core"><span>NO. 016 / 2026</span><strong>ATLAS<span>.</span></strong><i>${t('一部关于求知的宇宙志','THE BOOK OF CONNECTIONS')}</i></div><div class="atlas-v2-now-bottom"><span>784 NODES<br>1,059 LINKS</span><span>V 0.3.0<br>23 SEP 2026</span></div></div>`;
}
