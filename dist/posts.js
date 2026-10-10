import {dotAirPostArt} from './dot-air-art.js';
import './dot-air-globe.bundle.js';
import {nabatPostArt} from './nabat-art.js';
import './nabat-entry.js';
import { flowReleaseArt } from './flow-release-art.js';
import {nerfPostArt} from './nerf-art.js';
import {nerfReaderParts} from './nerf-post.js';
import './nerf-motion.js';
import {chromaPostArt} from './chroma-exhibit.js';
import {atlasPostArt} from './atlas-exhibit-v2.js';
import {roseraiePostArt} from './roseraie-post-art-v2.js';
import {afterimagePostArt} from './afterimage-art.js';
import {midautumnPostArt} from './midautumn-post-art.js';
import { lensPostArt } from './projectlens-exhibit.js';
import { getLanguage, onLanguageChange } from './i18n.js';
import { posts } from './posts-data.js';
import { wisPostArt } from './wis-exhibit.js';
import {articleHref} from './site-routes.js';
import { festivalIcon } from './festival-exhibit.js';

const root = document.querySelector('#posts-content');
const isReader = document.body.dataset.view === 'article';
const selected = new URLSearchParams(location.search).get('article');
const post = posts.find(item => item.id === selected);
const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const copy = (zh, en) => getLanguage() === 'en' ? en : zh;
const href = item => articleHref(item.id);
const local = item => item[getLanguage()];
const minutes = item => {
  const text = local(item);
  const words = [text.title, text.lead, text.quote, ...text.sections.flatMap(section => [section.title, ...section.paragraphs])].join(' ');
  return Math.max(2, Math.ceil(getLanguage() === 'en' ? words.split(/\s+/).length / 220 : words.length / 360));
};
const readTime = item => copy(`约 ${minutes(item)} 分钟`, `${minutes(item)} min read`);

// Series plates for the set B covers and heroes (flow-windows-b.css): one motif, the wordmark,
// one line and one data line.
const bleed = (src, w, h) => `<div class="wb-motif wb-motif--bleed"><img src="${src}" width="${w}" height="${h}" alt="" loading="lazy" decoding="async"></div>`;
// The legacy bundle pins square corners and hard offset shadows on these two frames with layered !important
// rules, which no unlayered rule can beat; their frames take a neutral class name instead.
const frameTheme = theme => (theme === 'chroma' || theme === 'glass') ? `wb-${theme}` : theme;
const plate = (theme, motif, mark, line, data) => `<div class="post-art wb wb--wide wb--${theme}" aria-hidden="true">${motif.startsWith('<div class="wb-motif') ? motif : `<div class="wb-motif">${motif}</div>`}<div class="wb-type"><strong class="wb-mark">${mark}</strong><span class="wb-line">${line}</span></div><div class="wb-data"><span>${data[0]}</span><span>${data[1]}</span></div></div>`;

function artwork(item) {
  if(item.theme === 'dot-air') return dotAirPostArt();
  if(item.theme === 'nabat') return nabatPostArt();
  if(item.theme === 'flow') return flowReleaseArt();
  if(item.theme === 'nerf') return nerfPostArt();
  if(item.theme === 'afterimage') return afterimagePostArt();
  if(item.theme === 'midautumn') return midautumnPostArt();
  if(item.theme === 'roseraie') return roseraiePostArt();
  if(item.theme === 'atlas') return atlasPostArt();
  if(item.theme === 'chroma') return chromaPostArt();
  if(item.theme === 'lens') return lensPostArt();
  if (item.theme === 'glass') return plate('court-models', bleed('./assets/models/arena-case.png', 1600, 1100), 'Love!<br>In 3D.', 'Courtside culture, the pop edition.', ['The courtside collection', '03']);
  if (item.theme === 'wis') return wisPostArt();
  if (item.theme === 'festival') return plate('festival', `<div class="wb-stamps">${['#c3dbae', '#f0d2b0', '#bfdcf4', '#f7bbd4'].map((tone, i) => `<span style="--stamp:${tone}">${festivalIcon(i)}</span>`).join('')}</div>`, 'FESTIVAL<br>TOOLKIT.', 'Your festival. Your way.', ['Festival notes / 005<em class="wb-more"> / four seasons</em>', '0.1.1']);
  if (item.theme === 'axiom') return plate('axiom', `<figure class="wb-plate"><img src="${item.cover}" width="400" height="280" alt="" loading="lazy"></figure>`, 'AXIOM<i>.</i>', 'From data. To discovery.', ['Lab notes 004<em class="wb-more"> / figure 01</em> / Hooke’s law', '1.0']);
  if (item.theme === 'signal') return `<div class="wa wa--signal" aria-hidden="true"><div class="wa-motif"><img src="${item.cover}" width="640" height="640" alt="" loading="lazy"></div><div class="wa-type"><p class="wa-data"><span>Personal space / 001</span><span>Est. 2026</span></p><div class="wa-head"><strong class="wa-title">Hello,<br>world<i></i></strong><span class="wa-line">Curiosity is the starting point.</span></div></div></div>`;
  if (item.theme === 'court') return plate('court', bleed(item.cover, 1440, 900), 'AFTER<br>HOURS.', '30 teams. 3v3 and 5v5. Your court.', ['First release<em class="wb-more"> / courtside notes</em>', '1.0']);
  return plate('folio', `<figure class="wb-plate"><img src="${item.cover}" width="1426" height="924" alt="" loading="lazy"></figure>`, 'Folio<i>.</i>', 'A little more of what you love.', ['The mod journal<em class="wb-more"> / first edition</em>', '1.0']);
}

// Journal frame (Current 2.1). The index is a reading log: months as chapters, dates as a real
// sequence down one river line, and each post's own cover art given room beside its words.
const icon = (name, cls = '') => `<svg class="ic${cls ? ' ' + cls : ''}" aria-hidden="true"><use href="./assets/flow/current-icons.svg#${name}"></use></svg>`;
const accents = {'dot-air':'#d8352a', nabat:'#2e5a43', flow:'#2445ef', nerf:'#3c7a2a', afterimage:'#c2331b', midautumn:'#a85a1a', roseraie:'#7d55a8', atlas:'#94592f', chroma:'#1b36e8', lens:'#1d7653', glass:'#d42f6a', wis:'#2f6a3f', festival:'#466d93', axiom:'#2f4fe0', signal:'#3d5cff', court:'#c24d1d', paper:'#a44e2a'};
const accent = item => accents[item.theme] || '#3d5cff';
const dotted = date => date.replaceAll('-', '.');
const total = String(posts.length).padStart(2, '0');
const monthName = key => new Intl.DateTimeFormat(getLanguage() === 'en' ? 'en-GB' : 'zh-CN', {month: 'long'}).format(new Date(Date.UTC(+key.slice(0, 4), +key.slice(5, 7) - 1, 15)));

function entry(item, i) {
  const text = local(item);
  const firstOfDay = i === 0 || item.date !== posts[i - 1].date;
  const day = item.date.slice(8, 10);
  return `<article id="post-${esc(item.id)}" class="jr-entry jr-entry--${item.theme}${i === 0 ? ' jr-entry--latest' : ''}${firstOfDay ? '' : ' jr-entry--sameday'}" style="--accent:${accent(item)}">
    <div class="jr-entry-date" aria-hidden="true"><i class="jr-node"></i>${firstOfDay ? `<b>${day}</b>` : ''}${i === 0 ? `<span class="jr-latest">${copy('最新一页', 'Latest entry')}</span>` : ''}</div>
    <div class="jr-entry-copy">
      <h3 class="jr-entry-title"><a href="${href(item)}">${esc(text.title)}</a></h3>
      <p class="jr-entry-summary">${esc(text.summary)}</p>
      <p class="jr-entry-meta"><time datetime="${item.date}">${dotted(item.date)}</time><span>${esc(text.category)}</span><span>${readTime(item)}</span><span class="jr-entry-no">${item.number} / ${total}</span></p>
      <span class="jr-entry-go" aria-hidden="true">${copy('翻开这一篇', 'Read the note')}${icon('arrow-up-right')}</span>
    </div>
    <div class="jr-entry-cover post-card post-card--${frameTheme(item.theme)}" aria-hidden="true">${artwork(item)}</div>
  </article>`;
}

function overview() {
  document.title = copy('随笔 — ChefZC', 'Posts — ChefZC');
  document.querySelector('meta[name="description"]').content = copy('ChefZC 的随笔：DOT/AIR 波点航空探索、NeRF 研究、AfterImage 赛车影像档案，以及作品与生活手记。', 'Notes by ChefZC: DOT/AIR flight exploration, NeRF research, AFTERIMAGE and the stories behind the work.');
  const groups = [];
  posts.forEach((item, i) => {
    const key = item.date.slice(0, 7);
    let group = groups.at(-1);
    if (!group || group.key !== key) groups.push(group = {key, items: []});
    group.items.push([item, i]);
  });
  const dates = posts.map(item => item.date).sort();
  root.innerHTML = `<section class="posts-heading jr-masthead" aria-labelledby="posts-title">
    <div class="jr-masthead-title"><h1 id="posts-title">POSTS<span>.</span></h1><p class="jr-masthead-aside">${copy('写在作品之外', 'The notes between the work')}</p></div>
    <div class="jr-masthead-intro">
      <h2>${copy('一些想法，<br>不必急着变成作品。', 'Some thoughts.<br>Room to let them grow.')}</h2>
      <div class="jr-masthead-side"><p>${copy('关于做东西，也关于生活。<br>把值得留下的念头，写成一页。', 'On making things, and on living.<br>A page for the thoughts worth keeping.')}</p>
        <dl class="jr-facts">
          <div><dt>${copy('随笔与制作手记', 'Notes & build journals')}</dt><dd class="jr-facts-count">${total}</dd></div>
          <div><dt>${copy('写作时间', 'Written')}</dt><dd><time datetime="${dates[0]}">${dotted(dates[0])}</time> – <time datetime="${dates.at(-1)}">${dotted(dates.at(-1))}</time></dd></div>
          <div><dt>${copy('排列', 'Order')}</dt><dd>${copy('最新在前 / 按时间阅读', 'Newest first / the journal')}${icon('arrow-down')}</dd></div>
        </dl>
      </div>
    </div>
  </section>
  <section class="posts-collection jr-log" aria-label="${copy('所有文章', 'All posts')}">
    ${groups.map(group => `<section class="jr-month" aria-labelledby="month-${group.key}">
      <header class="jr-month-head"><h2 id="month-${group.key}"><span class="jr-month-name">${monthName(group.key)}</span><span class="jr-month-year">${group.key.slice(0, 4)}</span></h2><p>${copy(`${group.items.length} 篇`, `${group.items.length} ${group.items.length === 1 ? 'note' : 'notes'}`)}</p></header>
      <div class="jr-entries posts-chronological">${group.items.map(([item, i]) => entry(item, i)).join('')}</div>
    </section>`).join('')}
  </section>
  <footer class="posts-end jr-end"><p class="jr-end-line"><span>TO BE CONTINUED</span><img class="jr-end-loop" src="./assets/flow/river-loop.svg" width="640" height="640" alt="" loading="lazy"></p><p>${copy('下一页，留给新的好奇心。', 'The next page is for a new curiosity.')}</p><p class="jr-end-sign">ChefZC / Journal</p></footer>`;
}

function figure(src, alt, caption, type = '') {
  const size = src.includes('/dot-air/') ? [1265,712] : src.includes('/nabat/') ? (src.endsWith('monstera.webp') ? [1536,1024] : src.endsWith('compare-native.png') ? [1748,1369] : [2282,1524]) : src.includes('/afterimage/') ? (src.endsWith('silverstone.webp') ? [1800,1200] : [1800,1013]) : src.includes('midautumn-') ? [1672,941] : src.includes('/roseraie/') ? (src.endsWith('models-0.2.0.png') ? [1536,960] : [2304,1517]) : src.includes('/chroma/') ? (src.endsWith('.svg') ? [1600,960] : src.endsWith('/mini.png') ? [410,351] : [1480,962]) : src.includes('/projectlens/') ? (src.endsWith('.svg') ? [1600,900] : [1699,982]) : src.includes('/models/') ? [1600,1100] : src.includes('/wis-tech-tank/') ? (src.endsWith('.webp') ? [1536,1024] : [1440,1292]) : src.includes('/festival-toolkit/') ? [2139,1356] : src.includes('/axiom/') ? (src.endsWith('.svg') ? [400,280] : [2283,1437]) : src.includes('/folio/') ? [1426,924] : src.includes('flow/river-loop.svg') ? [640,640] : src.includes('flow/river-sculpture.webp') ? [1280,1280] : [1440,900];
  return `<figure class="article-figure jr-figure ${type}"><div><img src="${src}" alt="${esc(alt)}" width="${size[0]}" height="${size[1]}" loading="lazy" decoding="async"></div><figcaption>${esc(caption)}</figcaption></figure>`;
}

const sentence = value => value ? value.charAt(0) + value.slice(1).toLowerCase() : '';
const pad = n => String(n).padStart(2, '0');

function neighbour(item, label, dir) {
  const text = local(item);
  return `<a class="jr-neighbour jr-neighbour--${dir}" href="${href(item)}" style="--accent:${accent(item)}"><span class="jr-neighbour-dir">${dir === 'newer' ? icon('arrow-up') : icon('arrow-down')}${label}</span><strong>${esc(text.title)}</strong><span class="jr-neighbour-meta"><time datetime="${item.date}">${dotted(item.date)}</time><span>${esc(text.category)}</span><span>Note ${item.number}</span></span></a>`;
}

function reader() {
  if (!post) {
    document.title = copy('没有找到这篇文章 — ChefZC', 'Post not found — ChefZC');
    root.innerHTML = `<section class="post-missing jr-missing"><h1>${copy('这一页还没有写下。', 'This page has not been written.')}</h1><p class="jr-missing-code">404 / LOST PAGE</p><a href="./posts.html">${copy('返回所有随笔', 'Back to all posts')}${icon('arrow-up-right')}</a></section>`;
    return;
  }
  const text = local(post);
  const nerf = post.theme === 'nerf' ? nerfReaderParts() : null;
  const displayTitle = post.theme === 'flow' && getLanguage() === 'zh' ? esc(text.title).replace('：', '：<br>') : post.theme === 'court' && getLanguage() === 'zh' ? esc(text.title).replace('，', '，<br>') : esc(text.title);
  document.title = `${text.title} — ChefZC`;
  document.querySelector('meta[name="description"]').content = text.summary;
  const at = posts.indexOf(post);
  const newer = posts[at - 1], older = posts[at + 1];
  const edition = post.edition ? esc(post.edition) : post.theme === 'afterimage' ? 'THE VISUAL SEASON / 2026' : post.theme === 'midautumn' ? 'MID-AUTUMN / 2026' : post.theme === 'signal' ? 'VOL. 01' : `VERSION ${esc(post.version || '1.0')}`;
  const indexNote = post.theme === 'afterimage' ? 'EVERY FRAME KEEPS IT ALIVE.' : post.theme === 'midautumn' ? 'FULL MOON / FULL HEART' : post.theme === 'roseraie' ? 'LE SALON DES POSSIBLES' : post.theme === 'paper' ? 'COLLECT WITH CARE.' : 'STAY CURIOUS.';
  const external = link => link.startsWith('https:') ? ' target="_blank" rel="noopener noreferrer"' : '';
  root.innerHTML = `<nav class="reader-topline jr-topline" aria-label="${copy('文章导航', 'Article navigation')}"><a href="./posts.html">${icon('arrow-right', 'ic-back')}${copy('所有随笔', 'All posts')}</a><span>${nerf ? nerf.toplineLabel : `Note ${post.number} / ${total}`}</span><span class="jr-topline-end"><span>${readTime(post)}</span>${nerf ? `<a href="${nerf.projectLink}">NeRF${icon('arrow-up-right')}</a>` : ''}</span></nav>
    <article class="jr-article jr-article--${post.theme}" style="--accent:${accent(post)}" aria-labelledby="article-title">
      <header class="jr-head">
        <div class="jr-head-rail"><p class="jr-head-date"><time datetime="${post.date}"><b>${post.date.slice(5, 7)}.${post.date.slice(8, 10)}</b><span>${dotted(post.date)}</span></time></p><p class="jr-head-cat">${esc(text.category)}</p></div>
        <div class="jr-head-main"><h1 id="article-title">${displayTitle}</h1><p class="jr-standfirst">${esc(text.summary)}</p>
          <div class="jr-byline"><span class="jr-avatar" aria-hidden="true">c_</span><span class="jr-byline-name">ChefZC<small>${copy('写在热爱里', 'Notes from my world')}</small></span><span class="jr-byline-data"><span>${edition}</span><span>${readTime(post)}</span></span></div>
        </div>
      </header>
      <div class="jr-hero${nerf ? ' jr-hero--nerf' : ` article-card article-card--${frameTheme(post.theme)}`}"><div class="article-art">${nerf ? nerf.cover : artwork(post)}</div></div>
      <div class="jr-reading">
        <aside class="jr-rail article-index" aria-label="${copy('本篇目录', 'On this page')}">
          <p class="jr-rail-title">${copy('本篇目录', 'On this page')}</p>
          <div class="jr-rail-track"><span class="jr-rail-progress" aria-hidden="true"><i></i></span><ol>${text.sections.map((section, i) => `<li><a href="#chapter-${i + 1}"><b>${pad(i + 1)}</b><span>${esc(section.title)}</span></a></li>`).join('')}</ol></div>
          ${nerf ? '' : `<p class="jr-rail-note">${indexNote}</p>`}
          ${nerf ? `<ul class="jr-rail-facts"><li>${nerf.railTag}</li>${nerf.facts.map(fact => `<li>${fact}</li>`).join('')}</ul>` : ''}
        </aside>
        <div class="jr-body">
          <p class="jr-lead">${esc(text.lead)}</p>
          ${text.sections.map((section, i) => `<section class="article-chapter jr-chapter" id="chapter-${i + 1}">
            <p class="jr-chapter-no" aria-hidden="true">${pad(i + 1)}</p>
            <h2>${esc(section.title)}</h2>${nerf ? `<p class="jr-chapter-deck" lang="en">${sentence(nerf.overline(i))}</p>` : ''}
            ${section.paragraphs.map(p => `<p>${esc(p)}</p>`).join('')}
            ${i === 0 ? `<blockquote class="jr-quote"><p>${esc(text.quote).replace(/\n/g, '<br>')}</p></blockquote>${nerf ? '' : figure(text.image || post.image, text.imageAlt, text.caption, post.theme === 'signal' ? 'article-figure--sculpture' : '')}` : ''}
            ${section.image ? figure(section.image, section.imageAlt, section.caption) : ''}
            ${nerf ? nerf.insert(i) : ''}
          </section>`).join('')}
          <footer class="jr-signoff"><p>${esc(text.afterword)}</p><span class="jr-sign">ChefZC<span aria-hidden="true">_</span></span></footer>
          <div class="jr-actions"><a class="jr-cta" href="${post.link}"${external(post.link)}><span>${esc(text.cta)}</span>${icon('arrow-up-right')}</a>${nerf ? nerf.links.map(link => `<a class="jr-textlink" href="${link.href}"${link.external ? ' target="_blank" rel="noopener noreferrer"' : ''}>${link.label}${icon('arrow-up-right')}</a>`).join('') : ''}</div>
        </div>
      </div>
    </article>
    <section class="more-notes jr-more" aria-labelledby="more-title">
      <header class="jr-more-head"><h2 id="more-title">${copy('也许还想翻翻', 'Another page to turn')}</h2><a href="./posts.html">${copy('所有随笔', 'All posts')}${icon('arrow-up-right')}</a></header>
      ${nerf ? `<a class="jr-beyond" href="${nerf.beyond.href}"><span class="jr-beyond-tag">${nerf.beyond.heading}<small>${nerf.beyond.tag}</small></span><strong>${nerf.beyond.title}</strong>${icon('arrow-up-right')}</a>` : ''}
      <div class="jr-neighbours">${newer ? neighbour(newer, copy('较新的一篇', 'Newer note'), 'newer') : ''}${older ? neighbour(older, copy('更早的一篇', 'Earlier note'), 'older') : ''}</div>
      <ol class="jr-shelf">${posts.filter(item => item !== post && item !== newer && item !== older).map(item => `<li><a class="jr-shelf-item" href="${href(item)}" style="--accent:${accent(item)}"><span class="jr-shelf-no">${item.number}</span><span class="jr-shelf-title">${esc(local(item).title)}</span><span class="jr-shelf-cat">${esc(local(item).category)}</span><time datetime="${item.date}">${dotted(item.date)}</time></a></li>`).join('')}</ol>
    </section>`;
}

function render() { isReader ? reader() : overview(); document.dispatchEvent(new Event('dot-air:render')); document.dispatchEvent(new Event('nabat:render')); updateProgress(); document.dispatchEvent(new Event('atlas:render')); document.dispatchEvent(new Event('roseraie:render')); document.dispatchEvent(new Event('nerf:render')); }
let pendingFrame = false;
// Reading progress follows the article body (not the whole page), so the rail fills exactly as the text is read.
function updateProgress() {
  const body = document.querySelector('.jr-body');
  let read = 0;
  if (body) {
    const box = body.getBoundingClientRect();
    const span = box.height - innerHeight * .55;
    read = span > 0 ? Math.min(1, Math.max(0, (innerHeight * .45 - box.top) / span)) : 0;
  }
  const value = read.toFixed(4);
  document.querySelector('.reading-progress')?.style.setProperty('--read', value);
  document.querySelector('.jr-rail')?.style.setProperty('--read', value);
}
if (isReader) {
  window.addEventListener('scroll', () => {
    if (pendingFrame) return;
    pendingFrame = true;
    requestAnimationFrame(() => { updateProgress(); pendingFrame = false; });
  }, { passive: true });
  window.addEventListener('resize', updateProgress, { passive: true });
  root.addEventListener('load', updateProgress, true);
}

// The index's one motion moment: the current fills the river of dates down to the reading line,
// and each day's node takes its post's colour as you pass it.
let riverFrame = false;
function updateRiver() {
  const log = document.querySelector('.jr-log');
  if (!log) return;
  const line = innerHeight * .62;
  const box = log.getBoundingClientRect();
  log.style.setProperty('--river', Math.min(1, Math.max(0, (line - box.top) / box.height)).toFixed(4));
  log.querySelectorAll('.jr-entry').forEach(item => item.classList.toggle('is-passed', item.getBoundingClientRect().top + 20 < line));
}
if (!isReader) {
  window.addEventListener('scroll', () => {
    if (riverFrame) return;
    riverFrame = true;
    requestAnimationFrame(() => { updateRiver(); riverFrame = false; });
  }, { passive: true });
  window.addEventListener('resize', updateRiver, { passive: true });
}
render();
updateRiver();
onLanguageChange(() => { render(); updateRiver(); });
