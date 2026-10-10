// ProjectLens: a mint glass loupe that magnifies the real interface capture under the pointer.
// Pointer (mouse/pen) only; with motion off it still follows the pointer but without easing.
import {isMotionPaused} from './motion-state.js';
const ZOOM=2.6;
function mount(fig){
  if(fig.dataset.loupe)return;fig.dataset.loupe='on';
  const img=fig.querySelector('img');if(!img)return;
  const loupe=document.createElement('span');loupe.className='lens-loupe';loupe.setAttribute('aria-hidden','true');loupe.innerHTML='<i></i>';fig.append(loupe);
  let x=0,y=0,tx=0,ty=0,raf=0,on=false;
  const place=()=>{raf=0;const k=isMotionPaused()?1:.22;x+=(tx-x)*k;y+=(ty-y)*k;
    const b=img.getBoundingClientRect(),f=fig.getBoundingClientRect(),size=loupe.offsetWidth;
    loupe.style.transform=`translate(${(x+b.left-f.left-size/2).toFixed(1)}px,${(y+b.top-f.top-size/2).toFixed(1)}px)`;
    loupe.style.backgroundImage=`url("${img.currentSrc||img.src}")`;loupe.style.backgroundSize=`${b.width*ZOOM}px ${b.height*ZOOM}px`;
    loupe.style.backgroundPosition=`${(-x*ZOOM+size/2).toFixed(1)}px ${(-y*ZOOM+size/2).toFixed(1)}px`;
    if(on&&(Math.abs(tx-x)>.3||Math.abs(ty-y)>.3))raf=requestAnimationFrame(place);};
  img.addEventListener('pointerenter',e=>{if(e.pointerType==='touch')return;const b=img.getBoundingClientRect();x=tx=e.clientX-b.left;y=ty=e.clientY-b.top;on=true;fig.classList.add('is-looking');if(!raf)raf=requestAnimationFrame(place);});
  img.addEventListener('pointermove',e=>{if(!on)return;const b=img.getBoundingClientRect();tx=e.clientX-b.left;ty=e.clientY-b.top;if(!raf)raf=requestAnimationFrame(place);},{passive:true});
  img.addEventListener('pointerleave',()=>{on=false;fig.classList.remove('is-looking');});
}
const scan=()=>document.querySelectorAll('.lnx-plate,.lnx-capture').forEach(mount);
let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;scan();});}).observe(document.documentElement,{childList:true,subtree:true});
requestAnimationFrame(scan);
