import {getLanguage} from './i18n.js';

const c = (zh, en) => getLanguage() === 'en' ? en : zh;
const repo = 'https://github.com/ChefDavid0815/atlas-diploma-observatory';
const fresco = './assets/projects/atlas/philosophical-cosmos-03.webp';
const pigment = './assets/projects/atlas/cosmic-pigment-03.webp';
const compass = `<svg class="atlas-compass" viewBox="0 0 240 240" aria-hidden="true"><circle cx="120" cy="120" r="103"/><circle cx="120" cy="120" r="83"/><circle cx="120" cy="120" r="5"/><path d="M120 4v232M4 120h232M38 38l164 164M202 38 38 202"/><path class="atlas-compass-needle" d="m120 26 14 80 80 14-80 14-14 80-14-80-80-14 80-14z"/></svg>`;
const astrolabe = `<svg class="atlas-astrolabe" viewBox="0 0 440 440" aria-hidden="true"><circle cx="220" cy="220" r="188"/><circle cx="220" cy="220" r="156"/><circle cx="220" cy="220" r="112"/><circle cx="220" cy="220" r="49"/><ellipse cx="220" cy="220" rx="188" ry="65" transform="rotate(-28 220 220)"/><ellipse cx="220" cy="220" rx="165" ry="91" transform="rotate(42 220 220)"/><path d="M220 12v416M12 220h416M73 73l294 294M367 73 73 367"/><circle cx="220" cy="220" r="10"/><circle cx="86" cy="288" r="5"/><circle cx="342" cy="162" r="6"/></svg>`;

const subjects = [
  ['I', 'LANGUAGE & LITERATURE', '语言与文学'],
  ['II', 'LANGUAGE ACQUISITION', '语言习得'],
  ['III', 'INDIVIDUALS & SOCIETIES', '个人与社会'],
  ['IV', 'SCIENCES', '科学'],
  ['V', 'MATHEMATICS', '数学'],
  ['VI', 'THE ARTS', '艺术']
];

function constellation() {
  const points = [[13,58],[26,35],[35,65],[48,22],[52,53],[69,36],[76,66],[90,27]];
  return `<svg class="atlas-constellation" viewBox="0 0 100 80" preserveAspectRatio="none" aria-hidden="true"><path d="M13 58 26 35 35 65 52 53 48 22 69 36 76 66 90 27"/>${points.map(([x,y],i)=>`<circle cx="${x}" cy="${y}" r="${i%3===0?1.25:.75}"/>`).join('')}</svg>`;
}

function bento() {
  return `<div class="atlas-bento" aria-label="${c('Atlas 0.3 视觉陈列','Atlas 0.3 visual exhibit')}">
    <div class="atlas-bento-main"><img src="${fresco}" width="1672" height="941" alt="" loading="lazy"><canvas class="atlas-starfield" aria-hidden="true"></canvas><span class="atlas-bento-index">PLATE I / THE COSMOS OF IDEAS</span><div class="atlas-bento-main-copy"><small>${c('一座为知识而建的观星台','AN OBSERVATORY FOR KNOWLEDGE')}</small><strong>ATLAS<span>.</span></strong><span>IB DIPLOMA / V 0.3.0</span></div>${compass}</div>
    <div class="atlas-bento-side atlas-bento-side--orbit"><span class="atlas-bento-index">PLATE II / CELESTIAL MAP</span>${astrolabe}<strong>784 <small>${c('知识节点','KNOWLEDGE NODES')}</small></strong><span class="atlas-orbit-glow"></span></div>
    <div class="atlas-bento-side atlas-bento-side--paper"><span class="atlas-bento-index">PLATE III / THE MANUSCRIPT</span><div class="atlas-paper-engraving">A<span>·</span></div><strong>${c('每个知识点，<br>都值得被看见。','A PLACE FOR<br>EVERY IDEA.')}</strong><small>1059 CONNECTIONS / 241 TOPICS</small></div>
  </div>`;
}

function plate(id) {
  if(id === 'manuscript') return `<div class="atlas-plate atlas-plate--manuscript"><img src="${fresco}" alt="" width="1672" height="941" loading="lazy"><div class="atlas-plate-frame"><span>FOLIO / 02</span><strong>${c('知识有它的纹理。','KNOWLEDGE HAS A TEXTURE.')}</strong><p>${c('从一门学科，走进主题、概念与手记；把线索读成一段自己的理解。','From a subject to its topics, concepts and notes: follow a thread and make sense of it in your own way.')}</p></div></div>`;
  if(id === 'path') return `<div class="atlas-plate atlas-plate--path"><div class="atlas-path-header"><span>INDEX / 03</span><span>THE DIPLOMA CONSTELLATION</span></div><div class="atlas-path-list">${subjects.map(([n,en,zh])=>`<div><b>${n}</b><span>${c(zh,en)}</span><i></i></div>`).join('')}</div><div class="atlas-path-foot">TOK · EE · CAS <span> / DP CORE</span></div></div>`;
  return `<div class="atlas-plate atlas-plate--sky"><img src="${pigment}" alt="" width="1672" height="941" loading="lazy"><canvas class="atlas-starfield" aria-hidden="true"></canvas>${constellation()}<div class="atlas-sky-readout"><span>FIG. 01 / LIVING KNOWLEDGE ATLAS</span><strong>784 <i>/</i> 1059</strong><small>${c('知识节点 / 关联','NODES / CONNECTIONS')}</small></div>${compass}</div>`;
}

const viewNames = {sky:['星图','THE ATLAS'],manuscript:['手记','THE MANUSCRIPT'],path:['学科索引','THE INDEX']};
export function atlasView(id='sky') { return `<div class="atlas-view" data-atlas-view-active="${id}"><div class="atlas-view-top"><span>THE OBSERVATORY / 0.3</span><div role="group" aria-label="${c('选择展柜视觉','Choose an exhibit view')}">${Object.entries(viewNames).map(([key,label])=>`<button type="button" data-atlas-view="${key}" aria-pressed="${key===id}">${c(...label)}</button>`).join('')}</div></div><div class="atlas-view-stage" aria-live="polite">${plate(id)}</div><p class="atlas-view-caption">${c('此处为依据 0.3 视觉语言制作的动态展柜意象；打开网页版可操作真实知识星图。','An animated editorial interpretation of version 0.3. Open the web app to explore the actual knowledge atlas.')}</p></div>`; }
export function changeAtlasView(button) { const host=button.closest('.atlas-view'); if(!host)return; const id=button.dataset.atlasView; if(!viewNames[id])return; host.dataset.atlasViewActive=id; host.querySelectorAll('[data-atlas-view]').forEach(item=>item.setAttribute('aria-pressed',String(item===button))); host.querySelector('.atlas-view-stage').innerHTML=plate(id); document.dispatchEvent(new Event('atlas:render')); }

function links() { return `<div class="atlas-actions"><a class="atlas-action-primary" href="./atlas/" target="_blank" rel="noopener noreferrer">${c('进入 Atlas 观星台','Enter Atlas on the web')} <b>↗</b></a><a href="${repo}" target="_blank" rel="noopener noreferrer">GitHub <b>↗</b></a><a href="./post.html?article=atlas">${c('读制作手记','Read the field notes')} <b>↗</b></a></div>`; }

export function atlasCard() { return `<article class="exhibit exhibit--atlas" id="project-atlas"><div class="atlas-edition"><span>CHEFZC / THE DIGITAL COLLECTION</span><span>NO. 07 / ATLAS 0.3.0</span></div>${bento()}<div class="atlas-intro"><div><span class="atlas-overline">THE DIPLOMA OBSERVATORY / 2026</span><h3>${c('在思想之上，<br><em>仰望无垠。</em>','Above every idea,<br><em>a wider universe.</em>')}</h3></div><div><p>${c('Atlas 把 IB Diploma 的知识点排成一片可以漫游的星空：从学科到主题，从概念到关联。古典手稿的温度，遇见持续生长的宇宙。','Atlas turns IB Diploma knowledge into a sky you can navigate: from subjects to topics, from concepts to their connections. The warmth of a classical manuscript meets a living universe.')}</p><button type="button" data-project="atlas">${c('打开作品档案','Open the project folio')} <span>↗</span></button></div></div><div class="atlas-rule"><span>THE OBSERVATORY</span><i></i><span>VII / 2026</span></div>${atlasView()}<div class="atlas-facts"><div><strong>784</strong><span>${c('知识节点','KNOWLEDGE NODES')}</span></div><div><strong>1,059</strong><span>${c('关联路径','CONNECTIONS')}</span></div><div><strong>241</strong><span>${c('课程主题','COURSE TOPICS')}</span></div><div><strong>中 / EN</strong><span>${c('两种阅读语言','TWO READING LANGUAGES')}</span></div></div>${links()}<div class="atlas-disclaimer">${c('独立学习工具；非 IB 官方产品。知识关联包含编辑性的阅读路径，不代表官方先修关系。','An independent study tool, not an official IB product. Connections include editorial reading paths, not official prerequisites.')}</div></article>`; }

export function atlasDetail(view='sky') { return `<div class="atlas-detail"><header class="atlas-detail-head"><span>CHEFZC / PROJECT FOLIO 07 / 0.3.0</span><h2 id="dialog-title">ATLAS<span>.</span></h2><p>${c('把知识连成星座，把好奇心写进手稿。','Knowledge as constellations. Curiosity as a manuscript.')}</p></header>${atlasView(view)}<div class="atlas-detail-chapters"><section><span>01 / THE IDEA</span><h3>${c('打开一门课，也打开一片夜空。','Open a subject. Open a sky.')}</h3><p>${c('它不是把一张课程表涂成星空，而是让主题、概念与关联能够被阅读、被追问。0.3 版的知识图谱整理出 784 个节点与 1,059 条连线，覆盖 241 个主题；你可以从一个问题出发，慢慢找到相邻的想法。','This is more than a syllabus painted with stars. Topics, concepts and connections are made to be read and questioned. Version 0.3 maps 784 nodes and 1,059 links across 241 topics, so one question can lead naturally to the next.')}</p></section><section><span>02 / THE MEDIUM</span><h3>${c('文艺复兴的质感，现代学习的节奏。','Renaissance texture. A contemporary rhythm.')}</h3><p>${c('深蓝星空、暖金轨道、石墙与纸页组成 Atlas 的视觉语法。中文标题采用朱雀仿宋，正文采用霞鹜文楷 GB，让汉字拥有和西文一样完整的古典气质。网页版与 Windows 桌面版均可使用。','A midnight sky, golden orbits, stone and paper form the visual language. Zhuque Fangsong headings and LXGW WenKai GB reading text give Chinese the same classical care as the Latin typography. Available on the web and Windows.')}</p></section><section><span>03 / THE BOUNDARY</span><h3>${c('探索的地图，仍需保持诚实。','An honest map for exploration.')}</h3><p>${c('Atlas 是独立制作的 IB 学习工具，不代表 IB 官方认证或完整课程大纲。部分关联为编辑性的阅读顺序，不能当作正式先修要求。网页与桌面版的本地学习进度各自保存；Windows 程序尚未签名。','Atlas is an independent IB study tool, neither IB-certified nor an exhaustive syllabus. Some edges are editorial reading order, not formal prerequisites. Web and desktop progress stay in separate local profiles. Windows binaries are unsigned.')}</p></section></div>${links()}</div>`; }

export function atlasPostArt() { return `<div class="post-art post-art--atlas" aria-hidden="true"><img src="${fresco}" width="1672" height="941" alt="" loading="lazy"><canvas class="atlas-starfield"></canvas><div class="atlas-post-frame"><span>FIELD NOTES / X / 2026</span><strong>ATLAS<span>.</span></strong><em>${c('让知识成为一片可以漫游的星空','KNOWLEDGE, A SKY TO WANDER')}</em><small>THE DIPLOMA OBSERVATORY / V 0.3</small></div>${compass}</div>`; }

export function atlasNowArt() { return `<div class="milestone-art atlas-now-art" aria-hidden="true"><img src="${pigment}" width="1672" height="941" alt="" loading="lazy"><canvas class="atlas-starfield"></canvas><span class="atlas-now-top">ATLAS / OBSERVATORY <b>07</b></span>${astrolabe}<strong>ATLAS<span>.</span></strong><div class="atlas-now-bottom"><span>784 NODES<br>1,059 PATHS</span><span>V 0.3.0<br>23 SEP 2026</span></div></div>`; }
