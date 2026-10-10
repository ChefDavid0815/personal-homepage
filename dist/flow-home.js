// 川流 / Current 2.0 — the homepage. Ten chapters from the source back to the source.
import './home-dock.js';
import {t,getLanguage,onLanguageChange} from './i18n.js';
import {canAnimate,isMotionPaused,onMotionChange} from './motion-state.js';
import {projects} from './projects.js';
import {projectHref} from './site-routes.js';
import {mountCurrentField} from './current-field.js';
import {split,rise,onFontsActive} from './flow-current.js';

const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=v=>String(v).replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const reduced=matchMedia('(prefers-reduced-motion: reduce)');

/* ── Copy ── */
function copy(){
  for(const el of $$('[data-home]'))el.textContent=t('home.'+el.dataset.home);
  for(const el of $$('[data-home-html]'))el.innerHTML=t(el.dataset.homeHtml);
  $('.h-chapters')?.setAttribute('aria-label',t('home.chapters'));
  for(const el of $$('.h-display,.h-hello'))split(el);
  manifesto();
  works();
  rise();
}

/* ── 00 Source: the field and the clock ── */
const fieldRoot=$('[data-current-field]');
let field;
function glyphs(){
  return $$('.h-title [data-char]').map(s=>{const r=s.getBoundingClientRect();const cs=getComputedStyle(s);return {char:s.textContent,x:r.left+r.width/2,y:r.top+r.height/2,size:parseFloat(cs.fontSize),family:cs.fontFamily,weight:cs.fontWeight};});
}
function mountField(){if(fieldRoot&&!field)field=mountCurrentField(fieldRoot,{glyphs});}
(document.fonts?.ready||Promise.resolve()).then(mountField);
setTimeout(mountField,2500);
// The brush face arrives from Adobe Fonts after first paint; the river re-reads the glyph shapes when it does.
let fieldTimer=0;onFontsActive(()=>{clearTimeout(fieldTimer);fieldTimer=setTimeout(()=>{mountField();field?.refresh();},150);});

const clock=$('[data-dubai-clock]');
const fmt=new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Dubai',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false});
function tick(){if(clock){const v=fmt.format(new Date());clock.textContent=v+' GST';clock.dateTime=v;}}
tick();setInterval(tick,1000);

/* ── Veil: a brush writes 川, once per visit ── */
const veil=$('.h-veil');
if(veil){
  let seen=false;try{seen=sessionStorage.getItem('cz.veil')==='1';sessionStorage.setItem('cz.veil','1');}catch{}
  if(seen||isMotionPaused())veil.remove();
  else{document.documentElement.classList.add('h-veiled');setTimeout(()=>{veil.classList.add('is-out');document.documentElement.classList.remove('h-veiled');},1500);setTimeout(()=>veil.remove(),2600);}
}

/* ── 01 Creed: the manifesto inks itself in as you read ── */
let manifestoChars=[];
function manifesto(){
  const el=$('[data-manifesto]');if(!el)return;
  const text=el.textContent;el.setAttribute('aria-label',text);
  const en=getLanguage()==='en';
  const parts=en?text.split(/(\s+)/):[...text];
  el.innerHTML=parts.map(p=>/^\s+$/.test(p)?' ':`<span aria-hidden="true">${esc(p)}</span>`).join('');
  manifestoChars=$$('span',el);lit=-1;scroll();
}
let lit=-1;
function inkManifesto(){
  const el=$('[data-manifesto]');if(!el||!manifestoChars.length)return;
  const r=el.getBoundingClientRect();
  const p=isMotionPaused()?1:Math.min(1,Math.max(0,(innerHeight*.9-r.top)/(innerHeight*.75+r.height*.5)));
  const n=Math.round(p*manifestoChars.length);
  if(n===lit)return;lit=n;
  manifestoChars.forEach((s,i)=>s.classList.toggle('is-lit',i<n));
}

/* ── 02 Self: tilt and flame ── */
const card=$('[data-tilt-card]');
if(card){
  const inner=$('.h-id-card',card);
  card.addEventListener('pointermove',e=>{if(!canAnimate()||e.pointerType!=='mouse')return;const r=card.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;inner.style.setProperty('--rx',(-y*10).toFixed(2)+'deg');inner.style.setProperty('--ry',(x*12).toFixed(2)+'deg');inner.style.setProperty('--gx',((x+.5)*100).toFixed(1)+'%');inner.style.setProperty('--gy',((y+.5)*100).toFixed(1)+'%');},{passive:true});
  card.addEventListener('pointerleave',()=>{inner.style.setProperty('--rx','0deg');inner.style.setProperty('--ry','0deg');});
  const video=$('[data-flame]',card);let visible=false,loaded=false;
  const sync=()=>{if(!visible||!canAnimate()){video.pause();card.classList.remove('is-playing');return;}if(!loaded){video.src='./assets/identity-blueflame-loop.mp4';loaded=true;}video.play().then(()=>card.classList.add('is-playing')).catch(()=>{});};
  new IntersectionObserver(e=>{visible=e[0].isIntersecting;sync();},{rootMargin:'100px'}).observe(card);
  onMotionChange(sync);
}

/* ── 03 Passion: a sideways current inside a vertical scroll ── */
const passion=$('.h-passion'),track=$('[data-track]'),meter=$('[data-track-meter]');
let pinned=false,travel=0;
function layoutPassion(){
  if(!passion||!track)return;
  pinned=matchMedia('(min-width: 900px)').matches&&!reduced.matches;
  passion.classList.toggle('is-pinned',pinned);
  if(!pinned){passion.style.height='';track.style.transform='';return;}
  travel=Math.max(0,track.scrollWidth-innerWidth);
  passion.style.height=(innerHeight+travel)+'px';
}
function movePassion(){
  if(!pinned)return;
  const r=passion.getBoundingClientRect();
  const p=Math.min(1,Math.max(0,-r.top/Math.max(1,r.height-innerHeight)));
  track.style.transform=`translate3d(${(-p*travel).toFixed(1)}px,0,0)`;
  if(meter)meter.style.transform=`scaleX(${p.toFixed(4)})`;
  passion.style.setProperty('--p',p.toFixed(4));
}
const inkPanel=$('.h-panel--ink');
if(inkPanel)new IntersectionObserver(entries=>{if(entries[0].isIntersecting&&canAnimate()){$('[data-ink-anim]',inkPanel)?.beginElement?.();}},{threshold:.5}).observe(inkPanel);

/* ── 04 Sound: the room takes the colour of the record on the turntable ── */
const cover=$('#music-cover'),glow=$('[data-sound-glow]');
if(cover&&glow){const sync=()=>{glow.src=cover.currentSrc||cover.src;};new MutationObserver(sync).observe(cover,{attributes:true,attributeFilter:['src']});sync();}

/* ── 05 Tools: numbers count up once ── */
const counters=$$('[data-count]');
if(counters.length&&'IntersectionObserver' in window){
  const ob=new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){ob.unobserve(e.target);if(!canAnimate())continue;const end=+e.target.dataset.count;const t0=performance.now();const step=now=>{const k=Math.min(1,(now-t0)/1100);e.target.textContent=Math.round(end*(1-Math.pow(1-k,3)));if(k<1)requestAnimationFrame(step);};requestAnimationFrame(step);}},{threshold:.6});
  counters.forEach(c=>ob.observe(c));
}

/* ── 06 Journey: the river draws itself downstream ── */
const river=$('[data-river]');
function drawRiver(){
  if(!river)return;
  const r=river.getBoundingClientRect();
  const p=isMotionPaused()?1:Math.min(1,Math.max(0,(innerHeight*.85-r.top)/(r.height+innerHeight*.3)));
  river.style.setProperty('--river',p.toFixed(4));
  $$('.h-stops li',river).forEach((li,i,all)=>li.classList.toggle('is-reached',p>=(i+.3)/all.length));
}

/* ── 07 Works: a running list of real projects from the catalogue ── */
const previews={'dot-air':'dot-air/software-v1.1.png',roseraie:'roseraie/home-0.2.0.png',atlas:'atlas/philosophical-cosmos-03.webp',chroma:'chroma/pro-zh.png',projectlens:'projectlens/workspace.jpg','festival-toolkit':'festival-toolkit/journey-v0.3.png',axiom:'axiom/workspace.png',folio:'folio/v1.1/fh6-local.png','nba-after-hours':'nba-after-hours/gameplay.png'};
const preview=document.createElement('div');preview.className='h-preview';preview.setAttribute('aria-hidden','true');preview.innerHTML='<img alt="">';
let px=0,py=0,tx=0,ty=0,pr=0,praf=0;
function previewTick(){praf=0;const dx=tx-px;px+=dx*.16;py+=(ty-py)*.16;pr+=((Math.max(-8,Math.min(8,dx*.08)))-pr)*.12;preview.style.setProperty('--x',px.toFixed(1)+'px');preview.style.setProperty('--y',py.toFixed(1)+'px');preview.style.setProperty('--r',pr.toFixed(2)+'deg');if(Math.abs(dx)+Math.abs(ty-py)>.5)praf=requestAnimationFrame(previewTick);}
function bindPreview(list){
  if(!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
  if(!preview.isConnected)document.body.append(preview);
  list.addEventListener('pointermove',e=>{const a=e.target.closest('a[data-preview]');if(!a){preview.classList.remove('is-on');return;}
    const src='./assets/projects/'+a.dataset.preview;const img=preview.firstChild;if(!img.src.endsWith(a.dataset.preview))img.src=src;
    tx=e.clientX+28;ty=e.clientY-120;if(!preview.classList.contains('is-on')){px=tx;py=ty;}preview.classList.add('is-on');
    if(canAnimate()){if(!praf)praf=requestAnimationFrame(previewTick);}else{px=tx;py=ty;previewTick();}
  },{passive:true});
  list.addEventListener('pointerleave',()=>preview.classList.remove('is-on'));
}
let previewBound=false;
function works(){
  const list=$('[data-work-list]');if(!list)return;
  const en=getLanguage()==='en';
  const living=`<li><a href="./gallery.html#living-sites" data-preview="../afterimage/monaco.webp"><span class="h-work-no">∞</span><span class="h-work-name">AfterImage</span><span class="h-work-sub">${esc(en?'The living motorsport archive.':'持续运营的赛车影像档案。')}</span><svg class="ic" aria-hidden="true"><use href="./assets/flow/current-icons.svg#arrow-up-right"></use></svg></a></li>`;
  list.innerHTML=living+projects.map((p,i)=>{const tr=p.translations?.[en?'en':'zh']||{};const sub=tr.subtitle||p.subtitle||'';return `<li><a href="${projectHref(p.id)}"${previews[p.id]?` data-preview="${previews[p.id]}"`:''}><span class="h-work-no">${String(i+1).padStart(2,'0')}</span><span class="h-work-name">${esc(p.name)}</span><span class="h-work-sub">${esc(sub)}</span><svg class="ic" aria-hidden="true"><use href="./assets/flow/current-icons.svg#arrow-up-right"></use></svg></a></li>`;}).join('');
  if(!previewBound){bindPreview(list);previewBound=true;}
  const count=$('[data-work-count]');if(count)count.textContent=t('home.worksCount',{count:String(projects.length).padStart(2,'0')});
}

/* ── Chapters index ── */
const chapterLinks=$$('.h-chapters a');
function chapters(){
  const mid=innerHeight*.45;let active='source';
  for(const s of $$('main [data-chapter]')){const r=s.getBoundingClientRect();if(r.top<=mid&&r.bottom>mid){active=s.dataset.chapter;break;}}
  chapterLinks.forEach(a=>a.toggleAttribute('aria-current',a.dataset.target===active));
  document.body.dataset.homeChapter=active;
}

/* ── Source parallax: the title sinks a little as the river carries you on ── */
const source=$('.h-source');
function sourceScroll(){
  if(!source)return;
  const p=Math.min(1,Math.max(0,scrollY/innerHeight));
  source.style.setProperty('--sp',p.toFixed(4));
}

let frame=0;
function scroll(){frame=0;inkManifesto();movePassion();drawRiver();chapters();sourceScroll();}
addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(scroll);},{passive:true});
let resizeTimer=0;
addEventListener('resize',()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{layoutPassion();scroll();},120);},{passive:true});
reduced.addEventListener('change',()=>{layoutPassion();scroll();});
onMotionChange(()=>{lit=-1;scroll();});

onLanguageChange(()=>{copy();requestAnimationFrame(()=>{layoutPassion();scroll();field?.refresh();});});
// i18n fills its own bindings on DOMContentLoaded; the homepage copy settles right after it.
function start(){copy();layoutPassion();scroll();}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start();
addEventListener('load',()=>{layoutPassion();scroll();});
