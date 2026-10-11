// 《周旋》 window (Now entry 034, post cover and hero), window series A.
// The same live crayon-thread heart as the room, smaller: it beats at 123 BPM on its lines; hovering the
// window plucks every line. Rests as a still frame with motion off.
import {mountHeart} from './zhouxuan-heart.js';

const art=(serial)=>`<div class="wa wa--zhouxuan" data-zx-window aria-hidden="true"><div class="wa-motif"><canvas></canvas></div><div class="wa-type"><p class="wa-data"><span>ChefZC / Code film 02</span><span>${serial}</span></p><div class="wa-head"><strong class="wa-title">Held up<br>by lines.</strong><span class="wa-line wa-zh" lang="zh-CN">周旋</span></div></div></div>`;
export const zxPostArt=()=>art('11 Oct 2026');
export const zxNowArt=()=>art('034');

const mounted=new WeakSet();
function bind(win){
  if(mounted.has(win))return;mounted.add(win);
  const motif=win.querySelector('.wa-motif');
  const heart=mountHeart(motif,{threads:64,lines:11,title:false,interactive:false,layout:'window',seed:23});
  const host=win.closest('a,article,.wa-win')||win;
  host.addEventListener('pointerenter',()=>heart.pluckAll(.14));
  new MutationObserver((_,obs)=>{if(!win.isConnected){heart.destroy();obs.disconnect();}}).observe(document.body,{childList:true,subtree:true});
}
function scan(){
  document.querySelectorAll('[data-zx-now]').forEach(h=>{if(!h.querySelector('[data-zx-window]'))h.innerHTML=zxNowArt();});
  document.querySelectorAll('[data-zx-window]').forEach(bind);
}
let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;scan();});}).observe(document.documentElement,{childList:true,subtree:true});
requestAnimationFrame(scan);
