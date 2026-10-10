// Festival Toolkit: the season switch changes the weather over the room — summer light motes,
// autumn leaves, winter snow, spring blossom — in the app's mint / blue / pink festival palette.
// Rests off-screen, in hidden tabs and when motion is off (a still scatter stays visible).
import {isMotionPaused,onMotionChange} from './motion-state.js';

const KINDS={
  summer:{n:46,col:['#fff6c9','#ffe58a','#ffffff'],vy:[-.35,-.12],size:[1.5,3.6],shape:'mote'},
  autumn:{n:30,col:['#e0703c','#c9452f','#e8a33d','#9c5a2a'],vy:[.5,1.1],size:[8,14],shape:'leaf'},
  winter:{n:70,col:['#ffffff','#eaf4ff','#d6e8ff'],vy:[.35,.9],size:[1.4,3.4],shape:'snow'},
  spring:{n:36,col:['#f6b6cf','#f9d3e2','#ef8fb5','#ffffff'],vy:[.35,.75],size:[4,7.5],shape:'petal'}
};
const rooms=new Map();
const rnd=(a,b)=>a+Math.random()*(b-a);
function seed(r,p,anywhere){
  const k=KINDS[r.kind];
  Object.assign(p,{x:rnd(0,r.w),y:anywhere?rnd(0,r.h):(k.vy[0]<0?r.h+10:-12),vy:rnd(...k.vy),s:rnd(...k.size),c:k.col[Math.floor(Math.random()*k.col.length)],a:rnd(0,6.28),va:rnd(-.03,.03),ph:rnd(0,6.28),alpha:rnd(.45,.95)});
  return p;
}
function populate(r){const k=KINDS[r.kind];r.p=Array.from({length:Math.round(k.n*Math.min(1.3,Math.max(.5,r.w/1300)))},()=>seed(r,{},true));}
function mount(card){
  if(rooms.has(card))return;
  const canvas=document.createElement('canvas');canvas.className='fsx-weather';canvas.setAttribute('aria-hidden','true');
  card.prepend(canvas);
  const r={card,canvas,ctx:canvas.getContext('2d'),kind:card.dataset.season||'summer',w:0,h:0,dpr:1,p:[],visible:false,raf:0,last:0,fade:1};
  rooms.set(card,r);
  r.ro=new ResizeObserver(()=>{size(r);populate(r);paint(r,0);});r.ro.observe(card);
  new MutationObserver(()=>{const k=card.dataset.season;if(k&&k!==r.kind&&KINDS[k]){r.kind=k;populate(r);r.fade=0;wake(r);paint(r,0);}}).observe(card,{attributes:true,attributeFilter:['data-season']});
  io.observe(card);
}
function size(r){const b=r.card.getBoundingClientRect();r.w=b.width;r.h=b.height;r.dpr=Math.min(devicePixelRatio||1,1.6);r.canvas.width=Math.round(r.w*r.dpr);r.canvas.height=Math.round(r.h*r.dpr);}
function paint(r,dt){
  const {ctx,w,h,dpr}=r;if(!w)return;
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
  const k=dt/16,shape=KINDS[r.kind].shape;r.fade=Math.min(1,r.fade+dt/700);
  for(const p of r.p){
    if(dt){p.ph+=.02*k;p.a+=p.va*k;p.y+=p.vy*k;p.x+=Math.sin(p.ph)*(shape==='leaf'?.9:.35)*k;
      if(p.y>h+16||p.y<-16)seed(r,p,false);}
    ctx.globalAlpha=p.alpha*r.fade;ctx.fillStyle=p.c;
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.a);
    if(shape==='leaf'){ctx.scale(1,Math.abs(Math.cos(p.ph))*.7+.3);ctx.beginPath();ctx.moveTo(0,-p.s);ctx.quadraticCurveTo(p.s*.8,0,0,p.s);ctx.quadraticCurveTo(-p.s*.8,0,0,-p.s);ctx.fill();ctx.strokeStyle='rgba(80,40,20,.35)';ctx.lineWidth=.7;ctx.beginPath();ctx.moveTo(0,-p.s);ctx.lineTo(0,p.s);ctx.stroke();}
    else if(shape==='petal'){ctx.scale(Math.abs(Math.cos(p.ph*1.4))*.7+.3,1);ctx.beginPath();ctx.ellipse(0,0,p.s*.55,p.s,0,0,6.283);ctx.fill();}
    else if(shape==='mote'){const g=ctx.createRadialGradient(0,0,0,0,0,p.s*3);g.addColorStop(0,p.c);g.addColorStop(1,'rgba(255,240,180,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,p.s*3,0,6.283);ctx.fill();}
    else{ctx.beginPath();ctx.arc(0,0,p.s,0,6.283);ctx.fill();}
    ctx.restore();
  }
  ctx.globalAlpha=1;
}
const running=r=>r.visible&&!document.hidden&&!isMotionPaused();
function loop(r,t){r.raf=0;const dt=r.last?Math.min(48,t-r.last):0;r.last=t;paint(r,dt);if(running(r))r.raf=requestAnimationFrame(n=>loop(r,n));else r.last=0;}
function wake(r){if(!r.raf&&running(r))r.raf=requestAnimationFrame(t=>loop(r,t));}
const io=new IntersectionObserver(es=>{for(const e of es){const r=rooms.get(e.target);if(r){r.visible=e.isIntersecting;wake(r);}}},{threshold:0});

function scan(){
  for(const [c,r] of rooms)if(!c.isConnected){r.ro.disconnect();io.unobserve(c);cancelAnimationFrame(r.raf);rooms.delete(c);}
  document.querySelectorAll('.xr--festival').forEach(mount);
}
let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;scan();});}).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('visibilitychange',()=>{for(const r of rooms.values())wake(r);});
onMotionChange(()=>{for(const r of rooms.values()){r.fade=1;paint(r,0);wake(r);}});
requestAnimationFrame(scan);
