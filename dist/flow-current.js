// 川流 / Current 2.0 — shared motion for every owned page.
// Header ink/paper follows the section beneath it; a small cursor stone; reveal-on-arrival;
// and every long page ends at the same river (the finale field).
import {getLanguage,onLanguageChange} from './i18n.js';
import {canAnimate,onMotionChange} from './motion-state.js';
import {mountCurrentField} from './current-field.js';

const c=(zh,en)=>getLanguage()==='en'?en:zh;
/* Adobe Fonts (kit pqh3hik) is a dynamic CJK kit: it serves only the glyphs on the page, so new text asks again. */
const fontListeners=new Set();
let fontsReady=false;
const brushReady=()=>document.documentElement.classList.contains('wf-active')&&(document.fonts?.check?.('500 100px hellofont-id-chunhei','川流不息')??true);
function pingFonts(){if(fontsReady||!brushReady())return;fontsReady=true;for(const cb of fontListeners)cb();}
export function onFontsActive(cb){fontListeners.add(cb);if(fontsReady)cb();return()=>fontListeners.delete(cb);}
new MutationObserver(pingFonts).observe(document.documentElement,{attributes:true,attributeFilter:['class']});
document.fonts?.addEventListener?.('loadingdone',pingFonts);
onLanguageChange(()=>{try{window.Typekit?.load({async:true});}catch{}});
const root=document.documentElement;
const fine=matchMedia('(hover:hover) and (pointer:fine)');

/* Header theme: whichever [data-theme] section sits under the bar decides. */
function headerTheme(){
  let frame=0;
  const update=()=>{frame=0;const y=40;let theme='light';const sections=document.querySelectorAll('[data-theme]');
    for(const s of sections){const r=s.getBoundingClientRect();if(r.top<=y&&r.bottom>y){theme=s.dataset.theme;break;}}
    if(root.dataset.headerTheme!==theme){root.dataset.headerTheme=theme;document.querySelector('meta[name="theme-color"]')?.setAttribute('content',theme==='dark'?'#0b0d26':'#e7ebf2');}
  };
  addEventListener('scroll',()=>{if(!frame)frame=requestAnimationFrame(update);},{passive:true});
  addEventListener('resize',update,{passive:true});update();
}
headerTheme();

/* Cursor: a ring with difference blending. It decorates; the system cursor stays. */
function cursor(){
  if(!fine.matches)return;
  const el=document.createElement('div');el.className='cz-cursor';el.setAttribute('aria-hidden','true');el.innerHTML='<b></b>';document.body.append(el);
  let x=-100,y=-100,tx=-100,ty=-100,raf=0;
  const tick=()=>{raf=0;x+=(tx-x)*.22;y+=(ty-y)*.22;el.style.setProperty('--x',x.toFixed(1)+'px');el.style.setProperty('--y',y.toFixed(1)+'px');if(Math.abs(tx-x)+Math.abs(ty-y)>.3)raf=requestAnimationFrame(tick);};
  const go=()=>{if(!raf)raf=requestAnimationFrame(tick);};
  addEventListener('pointermove',e=>{
    if(e.pointerType!=='mouse'){el.classList.remove('is-on');return;}
    tx=e.clientX;ty=e.clientY;
    if(!canAnimate()){x=tx;y=ty;el.style.setProperty('--x',x+'px');el.style.setProperty('--y',y+'px');}else go();
    el.classList.add('is-on');
    const target=e.target.closest?.('a,button,summary,[data-cursor]');
    el.classList.toggle('is-link',!!target&&!target.closest('.h-field,[data-cursor=field]'));
    const label=target?.dataset?.cursor;el.classList.toggle('has-label',!!label&&label!=='field');el.querySelector('b').textContent=label&&label!=='field'?label:'';
  },{passive:true});
  document.addEventListener('pointerleave',()=>el.classList.remove('is-on'));
  addEventListener('pointerdown',()=>el.classList.add('is-down'),{passive:true});
  addEventListener('pointerup',()=>el.classList.remove('is-down'),{passive:true});
}
cursor();

/* Arrival: elements marked [data-rise] or .cz-split ease in once, below the fold only. */
const io='IntersectionObserver' in window?new IntersectionObserver(entries=>{for(const e of entries)if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target);}},{rootMargin:'0px 0px -8% 0px',threshold:.05}):null;
export function rise(container=document){
  for(const el of container.querySelectorAll('[data-rise]:not(.cz-rise),.cz-split:not([data-split-ready])')){
    if(el.matches('.cz-split'))el.dataset.splitReady='';else el.classList.add('cz-rise');
    if(!io||!canAnimate()||el.getBoundingClientRect().top<innerHeight*.9)el.classList.add('is-in');else io.observe(el);
  }
}
export function split(el){
  // Wraps each word (Latin) or character (CJK) in a mask so it can rise line by line.
  const text=el.textContent;el.setAttribute('aria-label',text);
  const parts=text.match(/[　-〿＀-￯]|[一-鿿]|[A-Za-z0-9'’.,!?—\-]+|\s+/g)||[text];
  // [data-break] starts a new line after the first comma, so a two-clause title reads as two breaths.
  let i=0,broken=!el.hasAttribute('data-break');
  el.innerHTML=parts.map(p=>{if(/^\s+$/.test(p))return ' ';const html=`<span class="cz-w" aria-hidden="true"><i style="--i:${i++}">${p.replace(/[&<>]/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[m]))}</i></span>`;if(!broken&&/[，,]$/.test(p)){broken=true;return html+'<br>';}return html;}).join('');
  el.classList.add('cz-split');
}
rise();

/* The finale: every long page ends at the river, with the creed as stones in the stream. */
function finale(node){
  if(node.classList.contains('cz-finale'))return;
  node.classList.add('cz-finale');node.dataset.theme='dark';
  const render=()=>{
    node.setAttribute('aria-label',c('川流不息 — 保持热爱，保持初心','Everything in flow — keep the love, stay true'));
    node.innerHTML=`<div class="h-field"><canvas aria-hidden="true"></canvas></div>
      <div class="cz-finale-top"><span>CHEFZC / ${c('川流不息','EVERYTHING IN FLOW')}</span><span>EST. 2026 · DUBAI</span></div>
      <p class="cz-finale-title" aria-hidden="true"><span>川</span><span>流</span><span>不</span><span>息</span></p>
      <div class="cz-finale-caption"><p>${c('热爱没有终点，<br>好奇心也是。','No finish line<br>for curiosity.')}</p><p>${c('保持热爱，保持初心。','Keep the love. Stay true to the spring.')}<br><a href="./gallery.html">${c('继续看作品','Keep exploring')} ↗</a></p></div>
      <div class="cz-finale-bottom"><span>VIVA LA VIDA</span><span>${c('流向远方，也回到自己。','Outward, and home.')}</span></div>`;
    const field=node.querySelector('.h-field');
    node._field?.destroy();
    node._field=mountCurrentField(field,{glyphs:()=>[...node.querySelectorAll('.cz-finale-title span')].map(s=>{const r=s.getBoundingClientRect();const size=parseFloat(getComputedStyle(s).fontSize);return {char:s.textContent,x:r.left+r.width/2,y:r.top+r.height/2,size,family:getComputedStyle(s).fontFamily};})});
  };
  document.fonts?.ready.then(render)??render();
  let refreshTimer=0;onFontsActive(()=>{clearTimeout(refreshTimer);refreshTimer=setTimeout(()=>node._field?.refresh(),120);});
  onLanguageChange(render);
}
const findFinale=()=>{const n=document.querySelector('.atelier-finale');if(n&&!document.body.classList.contains('home-current')){finale(n);return true;}return false;};
if(!findFinale()){const mo=new MutationObserver(()=>{if(findFinale())mo.disconnect();});mo.observe(document.body,{childList:true,subtree:true});setTimeout(()=>mo.disconnect(),8000);}

onMotionChange(()=>{if(!canAnimate())document.querySelectorAll('.cz-rise,.cz-split').forEach(el=>el.classList.add('is-in'));});
