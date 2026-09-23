import {canAnimate,onMotionChange} from './motion-state.js';

const seen=new WeakSet();
const observer=new IntersectionObserver(entries=>{
  for(const entry of entries) entry.target.dataset.roseVisible=entry.isIntersecting?'true':'false';
},{rootMargin:'60px'});
function mount(){
  document.querySelectorAll('.exhibit--roseraie,.rose-now-art,.post-art--roseraie,.rose-detail').forEach(host=>{
    if(seen.has(host))return;
    seen.add(host);observer.observe(host);
    const stage=host.querySelector('.rose-hero-art');
    if(!stage)return;
    let frame=0;
    stage.addEventListener('pointermove',event=>{
      if(!canAnimate()||event.pointerType==='touch')return;
      if(frame)return;
      const x=event.clientX,y=event.clientY;
      frame=requestAnimationFrame(()=>{frame=0;const box=stage.getBoundingClientRect();stage.style.setProperty('--rose-x',`${(((x-box.left)/box.width-.5)*14).toFixed(1)}px`);stage.style.setProperty('--rose-y',`${(((y-box.top)/box.height-.5)*12).toFixed(1)}px`);});
    },{passive:true});
    stage.addEventListener('pointerleave',()=>{stage.style.removeProperty('--rose-x');stage.style.removeProperty('--rose-y');});
    onMotionChange(()=>{if(!canAnimate()){stage.style.removeProperty('--rose-x');stage.style.removeProperty('--rose-y');}});
  });
}
mount();document.addEventListener('roseraie:render',mount);
