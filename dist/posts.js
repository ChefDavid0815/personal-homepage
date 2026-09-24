import {chromaPostArt} from './chroma-exhibit.js';
import {atlasPostArt} from './atlas-exhibit-v2.js';
import {roseraiePostArt} from './roseraie-post-art-v2.js';
import { lensPostArt } from './projectlens-exhibit.js';
import { getLanguage, onLanguageChange } from './i18n.js';
import { posts } from './posts-data.js';
import { wisPostArt } from './wis-exhibit.js';
import { festivalTicket } from './festival-exhibit.js';

const root = document.querySelector('#posts-content');
const isReader = document.body.dataset.view === 'article';
const selected = new URLSearchParams(location.search).get('article');
const post = posts.find(item => item.id === selected);
const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const copy = (zh, en) => getLanguage() === 'en' ? en : zh;
const href = item => `./post.html?article=${item.id}`;
const local = item => item[getLanguage()];
const minutes = item => {
  const text = local(item);
  const words = [text.title, text.lead, text.quote, ...text.sections.flatMap(section => [section.title, ...section.paragraphs])].join(' ');
  return Math.max(2, Math.ceil(getLanguage() === 'en' ? words.split(/\s+/).length / 220 : words.length / 360));
};
const readTime = item => copy(`约 ${minutes(item)} 分钟`, `${minutes(item)} MIN READ`);

function artwork(item) {
  if(item.theme === 'roseraie') return roseraiePostArt();
  if(item.theme === 'atlas') return atlasPostArt();
  if(item.theme === 'chroma') return chromaPostArt();
  if(item.theme === 'lens') return lensPostArt();
  if (item.theme === 'glass') return `<div class="post-art post-art--glass model-micro-art" aria-hidden="true"><img src="./assets/models/arena-case.png" width="1600" height="1100" alt="" loading="lazy"><span>THE COURTSIDE COLLECTION / 03</span><strong>LOVE!<br>IN <i>3D.</i></strong><b class="pop-art-badge">POP!</b><span>COURTSIDE CULTURE / THE POP EDITION</span></div>`;
  if (item.theme === 'wis') return wisPostArt();
  if (item.theme === 'festival') return `<div class="post-art post-art--festival" aria-hidden="true"><div class="post-art-top"><span>FESTIVAL NOTES / 005</span><span>VERSION 0.1.1</span></div><div class="festival-post-word">FESTIVAL<br><span>TOOLKIT.</span></div><div class="festival-post-ticket">${festivalTicket()}</div><span class="post-art-foot">YOUR FESTIVAL. YOUR WAY.</span></div>`;
  if (item.theme === 'axiom') return `<div class="post-art post-art--axiom" aria-hidden="true"><div class="post-art-top"><span>LAB NOTES / 004</span><span>VERSION 1.0</span></div><div class="axiom-post-word">AXIOM<span>↗</span></div><div class="axiom-post-plate"><small>FIGURE 01 / HOOKE’S LAW</small><img src="${item.cover}" width="400" height="280" alt=""></div><span class="post-art-foot">FROM DATA. TO DISCOVERY.</span></div>`;
  if (item.theme === 'signal') return `<div class="post-art post-art--signal" aria-hidden="true"><div class="post-art-top"><span>PERSONAL SPACE / 001</span><span>EST. 2026</span></div><div class="signal-word">HELLO,<br><span>WORLD</span><i>_</i></div><img src="${item.cover}" width="1254" height="1254" alt=""><span class="post-art-foot">CURIOSITY IS THE STARTING POINT.</span></div>`;
  if (item.theme === 'court') return `<div class="post-art post-art--court" aria-hidden="true"><img src="${item.cover}" width="1440" height="900" alt=""><div class="post-art-top"><span>FIRST RELEASE / V1.0</span><span>COURTSIDE NOTES</span></div><div class="court-word">AFTER<br><span>HOURS.</span></div><span class="post-art-foot">30 TEAMS <b>·</b> 3v3 / 5v5 <b>·</b> YOUR COURT.</span></div>`;
  return `<div class="post-art post-art--paper" aria-hidden="true"><div class="post-art-top"><span>THE MOD JOURNAL</span><span>FIRST EDITION / 1.0</span></div><span class="paper-word">Folio<i>.</i></span><div class="paper-print"><img src="${item.cover}" width="1426" height="924" alt=""></div><span class="post-art-foot">A LITTLE MORE OF WHAT YOU LOVE.</span></div>`;
}

function card(item, featured = false) {
  const text = local(item);
  return `<a class="post-card post-card--${item.theme}${featured ? ' post-card--featured' : ''}" href="${href(item)}">${artwork(item)}<div class="post-card-copy"><div class="post-card-meta"><span>${esc(text.category)}</span><span>${item.number} / ${String(posts.length).padStart(2,'0')}</span></div><h2>${esc(text.title)}</h2><p>${esc(text.summary)}</p><div class="post-card-bottom"><time datetime="${item.date}">${item.date.replaceAll('-','.')}</time><span>${readTime(item)}</span><span class="post-read">${copy('翻开这一篇', 'READ THE NOTE')} <b aria-hidden="true">↗</b></span></div></div></a>`;
}

function overview() {
  document.title = copy('随笔 — ChefZC', 'Posts — ChefZC');
  document.querySelector('meta[name="description"]').content = copy('ChefZC 的随笔：生活、Roseraie、Atlas、CHROMA、ProjectLens、NBA After Hours、Folio、AXIOM、Festival Toolkit、WIS TECH TANK 与篮球建模的制作手记。', 'Notes by ChefZC: life, Roseraie, Atlas, CHROMA, ProjectLens, NBA After Hours, Folio, AXIOM, Festival Toolkit, WIS TECH TANK and the Courtside 3D collection.');
  root.innerHTML = `<section class="posts-heading" aria-labelledby="posts-title"><div class="posts-kicker"><span>[ ${copy('写在作品之外', 'THE NOTES BETWEEN THE WORK')} ]</span><span>CHEFZC / JOURNAL</span></div><div class="posts-heading-line"><h1 id="posts-title">POSTS<span>.</span></h1><span class="posts-mark" aria-hidden="true">↙</span></div><div class="posts-intro"><h2>${copy('一些想法，<br>不必急着变成作品。', 'Some thoughts.<br>Room to let them grow.')}</h2><p>${copy('关于做东西，也关于生活。<br>把值得留下的念头，写成一页。', 'On making things, and on living.<br>A page for the thoughts worth keeping.')}</p></div></section><section class="posts-collection" aria-label="${copy('所有文章', 'All posts')}"><div class="posts-section-label"><span>${copy('随笔与制作手记', 'NOTES & BUILD JOURNALS')} <b>${String(posts.length).padStart(2,'0')}</b></span><span class="posts-order-note">${copy('最新在前 / 按时间阅读', 'NEWEST FIRST / THE JOURNAL')}</span></div><div class="posts-grid posts-chronological">${posts.map((item, i) => `${i === 0 || item.date !== posts[i-1].date ? `<div class="post-index-date"><time datetime="${item.date}">${item.date.replaceAll('-','.')}</time>${i === 0 ? `<b>${copy('最新一页','LATEST ENTRY')}</b>` : ''}</div>` : ''}${card(item)}`).join('')}</div></section><div class="posts-end"><span>TO BE CONTINUED</span><p>${copy('下一页，留给新的好奇心。', 'The next page is for a new curiosity.')}</p><span aria-hidden="true">✳</span></div>`;
}

function figure(src, alt, caption, type = '') {
  const size = src.includes('/roseraie/') ? (src.endsWith('models-0.2.0.png') ? [1536,960] : [2304,1517]) : src.includes('/chroma/') ? (src.endsWith('.svg') ? [1600,960] : src.endsWith('/mini.png') ? [410,351] : [1480,962]) : src.includes('/projectlens/') ? (src.endsWith('.svg') ? [1600,900] : [1699,982]) : src.includes('/models/') ? [1600,1100] : src.includes('/wis-tech-tank/') ? (src.endsWith('.webp') ? [1536,1024] : [1440,1292]) : src.includes('/festival-toolkit/') ? [2139,1356] : src.includes('/axiom/') ? (src.endsWith('.svg') ? [400,280] : [2283,1437]) : src.includes('/folio/') ? [1426,924] : src.includes('hero-asterisk') ? [1254,1254] : [1440,900];
  return `<figure class="article-figure ${type}"><div><img src="${src}" alt="${esc(alt)}" width="${size[0]}" height="${size[1]}" loading="lazy" decoding="async"></div><figcaption>${esc(caption)}</figcaption></figure>`;
}

function reader() {
  if (!post) {
    document.title = copy('没有找到这篇文章 — ChefZC', 'Post not found — ChefZC');
    root.innerHTML = `<section class="post-missing"><span class="mono">404 / LOST PAGE</span><h1>${copy('这一页还没有写下。', 'This page has not been written.')}</h1><a href="./posts.html">${copy('返回所有随笔', 'Back to all posts')} ↗</a></section>`;
    return;
  }
  const text = local(post);
  const displayTitle = post.theme === 'court' && getLanguage() === 'zh' ? esc(text.title).replace('，', '，<br>') : esc(text.title);
  document.title = `${text.title} — ChefZC`;
  document.querySelector('meta[name="description"]').content = text.summary;
  root.innerHTML = `<nav class="reader-topline" aria-label="${copy('文章导航', 'Article navigation')}"><a href="./posts.html">← ${copy('所有随笔', 'ALL POSTS')}</a><span>NOTE ${post.number} / ${String(posts.length).padStart(2,'0')}</span><span>${readTime(post)}</span></nav>
    <article class="article-card article-card--${post.theme}" aria-labelledby="article-title">
      <header class="article-header"><div class="article-meta"><span>${esc(text.category)}</span><time datetime="${post.date}">${post.date.replaceAll('-','.')}</time></div><h1 id="article-title">${displayTitle}</h1><div class="article-byline"><span class="article-avatar" aria-hidden="true">c_</span><span>ChefZC <small>${copy('写在热爱里', 'NOTES FROM MY WORLD')}</small></span><span class="article-edition">${post.theme === 'signal' ? 'VOL. 01' : `VERSION ${esc(post.version || '1.0')}`}</span></div></header>
      <div class="article-art">${artwork(post)}</div>
      <div class="article-reading"><aside class="article-index"><span>${copy('本篇目录', 'ON THIS PAGE')}</span><ol>${text.sections.map((section, i) => `<li><a href="#chapter-${i+1}"><b>0${i+1}</b>${esc(section.title)}</a></li>`).join('')}</ol><span class="article-index-note">${post.theme === 'roseraie' ? 'LE SALON DES POSSIBLES' : post.theme === 'paper' ? 'COLLECT WITH CARE.' : 'STAY CURIOUS.'}</span></aside>
        <div class="article-body"><p class="article-lead">${esc(text.lead)}</p>
        ${text.sections.map((section, i) => `<section class="article-chapter" id="chapter-${i+1}"><div class="chapter-label"><span>0${i+1}</span><span></span></div><h2>${esc(section.title)}</h2>${section.paragraphs.map(p => `<p>${esc(p)}</p>`).join('')}${i === 0 ? `<blockquote>${esc(text.quote).replace(/\n/g,'<br>')}</blockquote>${figure(text.image || post.image, text.imageAlt, text.caption, post.theme === 'signal' ? 'article-figure--sculpture' : '')}` : ''}${section.image ? figure(section.image, section.imageAlt, section.caption) : ''}</section>`).join('')}
        <div class="article-signoff"><p>${esc(text.afterword)}</p><span>ChefZC<span aria-hidden="true">_</span></span></div>
        <a class="article-cta" href="${post.link}"${post.link.startsWith('https:') ? ' target="_blank" rel="noopener noreferrer"' : ''}><span>${esc(text.cta)}</span><span aria-hidden="true">↗</span></a></div></div>
    </article><section class="more-notes" aria-label="${copy('继续阅读', 'Keep reading')}"><div class="posts-section-label"><span>${copy('也许还想翻翻', 'ANOTHER PAGE TO TURN')}</span><a href="./posts.html">${copy('所有随笔', 'ALL POSTS')} ↗</a></div><div>${posts.filter(item => item.id !== post.id).map(item=>`<a class="next-note next-note--${item.theme}" href="${href(item)}"><span class="mono">NOTE ${item.number}</span><h2>${esc(local(item).title)}</h2><span aria-hidden="true">↗</span></a>`).join('')}</div></section>`;
}

function render() { isReader ? reader() : overview(); updateProgress(); document.dispatchEvent(new Event('atlas:render')); document.dispatchEvent(new Event('roseraie:render')); }
let pendingFrame = false;
function updateProgress() {
  const range = document.documentElement.scrollHeight - innerHeight;
  document.querySelector('.reading-progress')?.style.setProperty('--read', range > 0 ? String(Math.min(1, Math.max(0, scrollY / range))) : '0');
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
render();
onLanguageChange(render);
