// 影像作品 / Films hall: each reel in the index plays a muted excerpt while it is hovered or focused.
import {isMotionPaused} from './motion-state.js';

for(const reel of document.querySelectorAll('.fh-reel')){
  const v=reel.querySelector('video');if(!v)continue;
  const play=()=>{if(isMotionPaused())return;if(!v.src)v.src=v.dataset.src;v.play().then(()=>reel.classList.add('is-playing')).catch(()=>{});};
  const stop=()=>{v.pause();reel.classList.remove('is-playing');};
  reel.addEventListener('pointerenter',play);reel.addEventListener('focus',play);
  reel.addEventListener('pointerleave',stop);reel.addEventListener('blur',stop);
}
