// 《没了我你依然拥有太阳》 window (Now entry 033, post cover and hero), window series A.
// The opening still behind a torn paper edge, a cinnabar seal-sun with a carved 日; on hover the muted
// opening plays in the window. Rests with motion off.
import {isMotionPaused} from './motion-state.js';
import {sunMvAsset} from './sun-mv-content.js';

const seal='<span class="wa-sunseal" aria-hidden="true"></span>';
const art=(serial)=>`<div class="wa wa--sunmv" data-sunmv-window aria-hidden="true"><div class="wa-motif"><img class="wa-plate" src="${sunMvAsset}opening.jpg" width="1920" height="1080" alt="" loading="lazy" decoding="async"><video class="wa-sunmv-video" muted loop playsinline preload="none" data-src="${sunMvAsset}opening.mp4"></video><span class="wa-torn"></span>${seal}</div><div class="wa-type"><p class="wa-data"><span>ChefZC / Code film 01</span><span>${serial}</span></p><div class="wa-head"><strong class="wa-title">Every frame,<br>the song.</strong><span class="wa-line wa-zh" lang="zh-CN">没了我你依然拥有太阳</span></div></div></div>`;
export const sunMvPostArt=()=>art('10 Oct 2026');
export const sunMvNowArt=()=>art('033');

function bind(win){
  if(win.dataset.bound)return;win.dataset.bound='1';
  const v=win.querySelector('video');const host=win.closest('a,article,.wa-win')||win;
  host.addEventListener('pointerenter',()=>{if(isMotionPaused())return;if(!v.src)v.src=v.dataset.src;v.play().then(()=>win.classList.add('is-playing')).catch(()=>{});});
  host.addEventListener('pointerleave',()=>{v.pause();win.classList.remove('is-playing');});
}
function scan(){
  document.querySelectorAll('[data-sun-mv-now]').forEach(h=>{if(!h.querySelector('[data-sunmv-window]'))h.innerHTML=sunMvNowArt();});
  document.querySelectorAll('[data-sunmv-window]').forEach(bind);
}
let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;scan();});}).observe(document.documentElement,{childList:true,subtree:true});
requestAnimationFrame(scan);
