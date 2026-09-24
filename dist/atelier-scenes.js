import { getLanguage, onLanguageChange } from './i18n.js';
import { canAnimate, onMotionChange } from './motion-state.js';

const c=(zh,en)=>getLanguage()==='en'?en:zh;
const seen=new WeakSet(), inView=new Set();
const motif='<svg viewBox="0 0 700 460" preserveAspectRatio="xMidYMid slice"><g fill="none" stroke="currentColor"><ellipse cx="390" cy="235" rx="272" ry="142" transform="rotate(-27 390 235)"/><ellipse cx="390" cy="235" rx="272" ry="142" transform="rotate(-10 390 235)"/><ellipse cx="390" cy="235" rx="272" ry="142" transform="rotate(7 390 235)"/><ellipse cx="390" cy="235" rx="272" ry="142" transform="rotate(24 390 235)"/><path d="M60 235H660M390 30V435" stroke-dasharray="2 9"/></g><g fill="currentColor"><circle cx="140" cy="167" r="4"/><circle cx="625" cy="290" r="3"/><path d="M560 70v20m-10-10h20M120 350v14m-7-7h14" stroke="currentColor"/></g></svg>';
function decoration(className,html){const node=document.createElement('div');node.className=className;node.setAttribute('aria-hidden','true');node.innerHTML=html;return node;}

const identity=document.querySelector('.identity-art');
if(identity){
  const flame=decoration('identity-flame','<img class="identity-flame-still" src="./assets/identity-blueflame-poster.jpg" alt="" width="1112" height="1079"><video class="identity-flame-video" muted loop playsinline preload="none" aria-hidden="true"></video>');
  identity.querySelector('.monogram').after(flame);
  identity.classList.add('identity-art--flame');
  const video=flame.querySelector('video');
  let visible=false,sourceAdded=false,playRequest=0;
  const syncFlame=()=>{
    const request=++playRequest;
    if(!visible||!canAnimate()){
      video.pause();
      flame.classList.remove('is-playing');
      return;
    }
    if(!sourceAdded){video.src='./assets/identity-blueflame-loop.mp4';sourceAdded=true;video.load();}
    video.play().then(()=>{
      if(request===playRequest&&visible&&canAnimate())flame.classList.add('is-playing');
      else video.pause();
    }).catch(()=>flame.classList.remove('is-playing'));
  };
  video.addEventListener('error',()=>flame.classList.remove('is-playing'));
  const flameObserver=new IntersectionObserver(entries=>{visible=entries.some(entry=>entry.isIntersecting);syncFlame();},{rootMargin:'120px'});
  flameObserver.observe(flame);
  onMotionChange(syncFlame);
}

const directory=document.querySelector('.atelier-directory');
if(directory){
  const finale=document.createElement('section');finale.className='atelier-finale';
  const render=()=>{finale.setAttribute('aria-label',c('保持热爱，继续创造','Keep loving. Keep creating.'));finale.innerHTML=`<div class="finale-eyebrow"><span>CHEFZC / AN OPEN-ENDED EXPERIMENT</span><span>EST. 2026</span></div><a href="./gallery.html" class="finale-title"><span>KEEP <i>✳</i></span><span>CREATING<span class="finale-period">.</span><b aria-hidden="true">↗</b></span></a><div class="finale-caption"><span>${c('热爱没有终点，好奇心也是。','No finish line for curiosity.')}</span><span>VIVA LA VIDA</span></div>`;};
  render();onLanguageChange(render);directory.before(finale);
}

let frame=0;
function update(){
  frame=0;
  for(const element of inView){
    if(!element.isConnected){inView.delete(element);observer.unobserve(element);continue;}
    const r=element.getBoundingClientRect();
    const progress=Math.max(-1,Math.min(1,(innerHeight*.5-r.top-r.height*.5)/(innerHeight*.5+r.height*.5)));
    element.style.setProperty('--scene-progress',canAnimate()?progress.toFixed(4):'0');
  }
  document.querySelectorAll('.scene-index a').forEach(link=>{const target=document.getElementById(link.hash.slice(1));if(!target)return;const r=target.getBoundingClientRect();const active=r.top<innerHeight*.45&&r.bottom>innerHeight*.45;if(active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
}
function schedule(){if(!frame)frame=requestAnimationFrame(update);}
const observer=new IntersectionObserver(entries=>{for(const e of entries){e.target.classList.toggle('scene-in-view',e.isIntersecting);if(e.isIntersecting)inView.add(e.target);else inView.delete(e.target);}schedule();},{rootMargin:'60px'});
window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});onMotionChange(schedule);

function addIndex(){
  const grid=document.querySelector('#project-grid');
  if(grid&&!document.querySelector('.scene-index--works')){
    const nav=document.createElement('nav');nav.className='scene-index scene-index--works';nav.setAttribute('aria-label',c('快速浏览作品','Browse the collection'));
    const projects=[['roseraie','ROSERAIE','08','rose'],['atlas','ATLAS','07','atlas'],['chroma','CHROMA','06','chroma'],['projectlens','PROJECTLENS','05','lens'],['festival-toolkit','FESTIVAL','04','festival'],['axiom','AXIOM','03','axiom'],['folio','FOLIO','02','folio'],['nba-after-hours','AFTER HOURS','01','court']];
    nav.innerHTML=projects.map(([id,name,number,theme])=>`<a href="#project-${id}" data-index-theme="${theme}"><i aria-hidden="true"></i><small>${number}</small><span>${name}</span><b aria-hidden="true">↓</b></a>`).join('');grid.before(nav);
  }
  const divider=document.querySelector('.profile-divider');
  if(divider&&!document.querySelector('.scene-index--profile')){
    const nav=document.createElement('nav');nav.className='scene-index scene-index--profile';
    const sections=[['.profile-intro','intro','关于我','ABOUT'],['.passions-section','passions','热爱','PASSIONS'],['.music-section','music','音乐','SOUNDS'],['.setup-section','devices','设备','TOOLS'],['.contact-section','contact','联系','CONNECT']];
    const render=()=>{nav.setAttribute('aria-label',c('个人主页章节','Profile chapters'));nav.innerHTML=sections.filter(([selector])=>document.querySelector(selector)).map(([selector,id,zh,en],i)=>{document.querySelector(selector).id=id;return `<a href="#${id}"><small>0${i+1}</small><span>${c(zh,en)}</span><b aria-hidden="true">↘</b></a>`;}).join('');};render();onLanguageChange(render);divider.after(nav);
  }
}

function enhance(root=document){
  const select=selector=>[...(root.matches?.(selector)?[root]:[]),...root.querySelectorAll(selector)];
  for(const header of select('.profile-hero,.gallery-header,.posts-heading,.school-header,.now-header,.game-intro-grid,.usage-hero')){
    if(header.querySelector(':scope > .scene-contours'))continue;
    header.append(decoration('scene-contours',motif));
  }
  for(const element of select('.exhibit,.model-work,.wis-cover,.timeline-entry,.post-card,.article-art,.game-exhibit,.atelier-finale,.profile-hero')){
    if(seen.has(element))continue;seen.add(element);observer.observe(element);element.classList.add('scene-composition');
  }
  for(const room of select('.collection-navigation>a')){
    if(room.querySelector('.room-token'))continue;
    const type=room.getAttribute('href').includes('school')?'forest':room.getAttribute('href').includes('models')?'glass':'studio';room.dataset.room=type;
    room.prepend(decoration('room-token',type==='forest'?'<i></i><i></i><i></i>':type==='glass'?'<i></i><b></b>':'<i></i><i></i><i></i>'));
  }
  const nba=document.querySelector('.nba-exhibit');
  if(nba&&!nba.querySelector('.neon-installation')){
    nba.prepend(decoration('neon-installation','<div class="neon-spill"></div><div class="neon-tube neon-tube--top"></div><div class="neon-tube neon-tube--right"></div><div class="neon-tube neon-tube--bottom"></div><div class="neon-tube neon-tube--left"></div><i class="neon-bracket neon-bracket--a"></i><i class="neon-bracket neon-bracket--b"></i><i class="neon-bracket neon-bracket--c"></i><i class="neon-bracket neon-bracket--d"></i>'));
  }
  addIndex();schedule();
}
enhance();
// Deep links can arrive before the JS-rendered exhibitions exist.
if(location.hash)requestAnimationFrame(()=>{try{document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView({behavior:'instant',block:'start'});}catch{/* Invalid URL fragments do not affect navigation. */}});
const mutation=new MutationObserver(records=>{for(const record of records)for(const node of record.addedNodes)if(node.nodeType===1&&node.isConnected)enhance(node);});
const main=document.querySelector('main');if(main)mutation.observe(main,{subtree:true,childList:true});
onLanguageChange(()=>queueMicrotask(()=>{enhance();document.querySelector('.scene-index--works')?.setAttribute('aria-label',c('快速浏览作品','Browse the collection'));}));

// Directional sheen reacts to intent, with no idle JS animation loop.
let pointerFrame=0, current=null, position;
document.addEventListener('pointermove',event=>{
  if(!canAnimate()||event.pointerType==='touch'||!matchMedia('(hover:hover)').matches)return;
  const target=event.target.closest?.('.exhibit,.identity-wrap,.post-card,.music-feature,.wis-cover');
  if(target!==current){current?.style.removeProperty('--scene-x');current?.style.removeProperty('--scene-y');current=target;}
  if(!current)return;position=[event.clientX,event.clientY];if(pointerFrame)return;
  pointerFrame=requestAnimationFrame(()=>{pointerFrame=0;if(!current||!canAnimate())return;const r=current.getBoundingClientRect();current.style.setProperty('--scene-x',((position[0]-r.left)/r.width-.5).toFixed(3));current.style.setProperty('--scene-y',((position[1]-r.top)/r.height-.5).toFixed(3));});
},{passive:true});
const resetPointer=()=>{current?.style.removeProperty('--scene-x');current?.style.removeProperty('--scene-y');current=null;};
document.addEventListener('pointerleave',resetPointer);onMotionChange(()=>{if(!canAnimate())resetPointer();});
