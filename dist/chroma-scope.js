// CHROMA: a pixel-mosaic signal scope for the channel selector. Each channel plays its own simulated
// trace (CPU load waves, GPU frame bursts, RAM stepped fill) in the app's tile colours. It never reads
// visitor hardware. Pointer adds gain; rests off-screen, in hidden tabs and with motion off.
import {isMotionPaused,onMotionChange} from './motion-state.js';

const TONES=['#e9f2ff','#00edff','#fff000','#ff273a'];
const scopes=new Map();
function signal(kind,x,t){
  if(kind==='gpu'){const p=(x+t*14)%19;return .22+.08*Math.sin(x*.9+t*4)+(p<1.6?.62-p*.18:0)+(p>9&&p<10.2?.3:0);}
  if(kind==='ram'){const step=Math.floor((x+t*3)/9);return .34+((step*7)%5)*.1+.03*Math.sin(x+t);}
  return .48+.2*Math.sin(t*1.6+x*.17)+.13*Math.sin(t*3.2+x*.51)+.06*Math.sin(x*1.7-t*5);
}
function mount(el){
  if(scopes.has(el))return;
  const canvas=el.querySelector('canvas'),s={el,canvas,ctx:canvas.getContext('2d'),w:0,h:0,dpr:1,t:0,last:0,gain:0,gx:-1,visible:false,raf:0,acc:0};
  scopes.set(el,s);
  s.ro=new ResizeObserver(()=>{size(s);draw(s);});s.ro.observe(el);
  el.addEventListener('pointermove',e=>{const b=canvas.getBoundingClientRect();s.gx=(e.clientX-b.left)/b.width;s.target=1;wake(s);},{passive:true});
  el.addEventListener('pointerleave',()=>{s.target=0;wake(s);});
  io.observe(el);
}
function size(s){const b=s.canvas.getBoundingClientRect();s.w=b.width;s.h=b.height;s.dpr=Math.min(devicePixelRatio||1,2);s.canvas.width=Math.round(s.w*s.dpr);s.canvas.height=Math.round(s.h*s.dpr);}
function draw(s){
  const {ctx,w,h,dpr}=s;if(!w)return;
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
  const kind=s.el.closest('[data-chroma-channel]')?.dataset.chromaChannel||'cpu',cell=w<560?10:14,gap=w<560?2:3,step=cell+gap;
  const cols=Math.floor((w+gap)/step),rows=Math.floor((h+gap)/step),ox=(w-(cols*step-gap))/2,oy=(h-(rows*step-gap))/2;
  for(let c=0;c<cols;c++){
    const x=c/cols;let v=signal(kind,c,s.t);
    if(s.gain>.01){v+=s.gain*.35*Math.exp(-((x-s.gx)**2)/.006);}
    const lit=Math.max(1,Math.min(rows,Math.round(v*rows)));
    for(let r=0;r<rows;r++){
      const on=r<lit,frac=(r+1)/rows,tone=frac<.4?0:frac<.65?1:frac<.85?2:3;
      ctx.fillStyle=on?TONES[tone]:'rgba(255,255,255,.07)';
      ctx.fillRect(ox+c*step,oy+(rows-1-r)*step,cell,cell);
    }
  }
}
function tick(s,now){
  s.raf=0;const dt=s.last?Math.min(64,now-s.last):16;s.last=now;s.acc+=dt;
  s.gain+=((s.target||0)-s.gain)*.12;
  if(s.acc>=33){s.t+=s.acc/1000;s.acc=0;draw(s);}
  if(running(s))s.raf=requestAnimationFrame(n=>tick(s,n));else s.last=0;
}
const running=s=>s.visible&&!document.hidden&&!isMotionPaused();
function wake(s){if(!s.raf&&running(s))s.raf=requestAnimationFrame(n=>tick(s,n));else if(!running(s))draw(s);}
const io=new IntersectionObserver(es=>{for(const e of es){const s=scopes.get(e.target);if(s){s.visible=e.isIntersecting;wake(s);}}},{threshold:.05});

export function mountChromaScope(){
  for(const [el,s] of scopes)if(!el.isConnected){s.ro.disconnect();io.unobserve(el);cancelAnimationFrame(s.raf);scopes.delete(el);}
  document.querySelectorAll('[data-chroma-scope]').forEach(mount);
}
document.addEventListener('click',e=>{if(e.target.closest?.('[data-chroma-channel-button]'))requestAnimationFrame(()=>{for(const s of scopes.values()){const label=s.el.querySelector('[data-scope-label]'),kind=s.el.closest('[data-chroma-channel]')?.dataset.chromaChannel||'cpu';if(label)label.textContent=`SIMULATED SIGNAL / ${kind.toUpperCase()}`;draw(s);}});});
document.addEventListener('visibilitychange',()=>{for(const s of scopes.values())wake(s);});
onMotionChange(()=>{for(const s of scopes.values())wake(s);});
let queued=false;
new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;mountChromaScope();});}).observe(document.documentElement,{childList:true,subtree:true});
requestAnimationFrame(mountChromaScope);
