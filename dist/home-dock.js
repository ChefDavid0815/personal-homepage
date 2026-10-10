// 器: the toolkit dock magnifies under the pointer like a desktop dock; tiles and devices draw in once.
import {isMotionPaused} from './motion-state.js';
const dock=document.querySelector('[data-dock]');
if(dock){
  const apps=[...dock.querySelectorAll('.h-app')];let raf=0,px=null;
  const apply=()=>{raf=0;for(const a of apps){if(px===null||isMotionPaused()){a.style.removeProperty('--mag');continue;}
    const b=a.getBoundingClientRect(),d=Math.abs(px-(b.left+b.width/2)),k=Math.max(0,1-d/150);a.style.setProperty('--mag',(k*k*(3-2*k)).toFixed(3));}};
  dock.querySelector('.h-dock').addEventListener('pointermove',e=>{if(e.pointerType==='touch')return;px=e.clientX;if(!raf)raf=requestAnimationFrame(apply);},{passive:true});
  dock.querySelector('.h-dock').addEventListener('pointerleave',()=>{px=null;if(!raf)raf=requestAnimationFrame(apply);});
}
const io=new IntersectionObserver(es=>{for(const e of es)if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target);}},{threshold:.25});
document.querySelectorAll('[data-dock],.h-dev').forEach(el=>{if(isMotionPaused())el.classList.add('is-in');else io.observe(el);});
