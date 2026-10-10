// Roseraie atelier motion: drifting petals the cursor can stir (the app's own Atmosphere petals),
// silver filigree that draws itself, the Sol / Astra / Luna medallion, the woven threads and the
// closing rose drawn on scroll. Everything rests off-screen, in hidden tabs and with motion off.
import {isMotionPaused,onMotionChange} from './motion-state.js';

/* ---------- shared drawings ---------- */
export const roseFiligree=()=>['tl','tr','bl','br'].map(c=>`<svg class="rose-filigree rose-filigree--${c}" viewBox="0 0 120 120" aria-hidden="true"><path pathLength="1" d="M3 84V30Q3 3 30 3h54"/><path pathLength="1" d="M14 62c0-27 21-48 48-48"/><path pathLength="1" d="M62 14c11 0 16 9 9 15-6 5-13 0-9-6"/><path pathLength="1" d="M14 62c0 11 9 16 15 9 5-6 0-13-6-9"/><path pathLength="1" d="M24 24c9-3 16 1 19 10-9 3-16-1-19-10Z"/><path pathLength="1" d="M40 40c6-1 10 2 11 8-6 1-10-2-11-8Z"/><circle cx="31" cy="44" r="2.2"/><circle cx="44" cy="31" r="2.2"/><circle cx="96" cy="3" r="2.6"/><circle cx="3" cy="96" r="2.6"/></svg>`).join('');
function rosette(){
  // a rose seen from above: a centre spiral and five scalloped rings of petals
  const c=180,rings=[];let spiral='M'+c+' '+c;
  for(let a=0;a<=Math.PI*5;a+=.18){const r=1.4*a;spiral+=` L${(c+Math.cos(a)*r).toFixed(1)} ${(c+Math.sin(a)*r).toFixed(1)}`;}
  rings.push(spiral);
  for(let l=0;l<6;l++){
    const n=5+l*2,r=30+l*25,off=l*.42,span=Math.PI*2/n*1.04;let d='';
    for(let p=0;p<n;p++){
      const a=off+p*Math.PI*2/n,pt=(ang,rad)=>`${(c+Math.cos(ang)*rad).toFixed(1)} ${(c+Math.sin(ang)*rad).toFixed(1)}`;
      d+=`M${pt(a,r*.8)} C${pt(a+span*.1,r*1.14)} ${pt(a+span*.9,r*1.14)} ${pt(a+span,r*.8)} `;
    }
    rings.push(d.trim());
  }
  return `<svg class="rose-rosette" viewBox="0 0 360 360" aria-hidden="true">${rings.map((d,i)=>`<path pathLength="1" style="--ring:${i}" d="${d}"/>`).join('')}</svg>`;
}
export const roseRosette=rosette;

/* ---------- petal field ---------- */
const fields=new Map();
const PALETTE=[['#9778bb','#eee0ff'],['#b693d6','#f6eefe'],['#8c6cac','#e6d9f4'],['#c1a9d9','#fbf7ff']];
function mountPetals(host){
  if(fields.has(host))return;
  const canvas=document.createElement('canvas');canvas.className='rose-petal-field';canvas.setAttribute('aria-hidden','true');
  host.prepend(canvas);
  const f={host,canvas,ctx:canvas.getContext('2d'),petals:[],w:0,h:0,dpr:1,mx:-999,my:-999,vx:0,vy:0,visible:false,raf:0,last:0,dense:+(host.dataset.petals||26)};
  fields.set(host,f);
  f.ro=new ResizeObserver(()=>{sizePetals(f);paintPetals(f,0);});f.ro.observe(host);
  const hit=host.closest('.rose-hero,.wb')||host;
  hit.addEventListener('pointermove',e=>{const b=canvas.getBoundingClientRect(),x=e.clientX-b.left,y=e.clientY-b.top;if(f.mx>-900){f.vx=x-f.mx;f.vy=y-f.my;}f.mx=x;f.my=y;},{passive:true});
  hit.addEventListener('pointerleave',()=>{f.mx=f.my=-999;f.vx=f.vy=0;});
  io.observe(host);host.dataset.petalField='on';
}
function sizePetals(f){
  const b=f.host.getBoundingClientRect();if(!b.width)return;
  f.w=b.width;f.h=b.height;f.dpr=Math.min(devicePixelRatio||1,2);f.canvas.width=Math.round(f.w*f.dpr);f.canvas.height=Math.round(f.h*f.dpr);
  const n=Math.round(f.dense*Math.min(1.4,Math.max(.45,f.w*f.h/(1300*800))));
  while(f.petals.length<n)f.petals.push(seed(f,true));f.petals.length=n;
}
function seed(f,anywhere){
  const [a,b]=PALETTE[Math.floor(Math.random()*PALETTE.length)];
  return {x:Math.random()*f.w,y:anywhere?Math.random()*f.h:-20,s:5+Math.random()*9,rot:Math.random()*6.28,spin:(Math.random()-.5)*.02,flip:Math.random()*6.28,flipV:.01+Math.random()*.025,
    vy:.25+Math.random()*.45,sway:Math.random()*6.28,swayV:.006+Math.random()*.01,wx:0,wy:0,a,b,alpha:.35+Math.random()*.45};
}
function paintPetals(f,dt){
  const {ctx,w,h,dpr}=f;if(!w)return;
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
  const move=dt>0;
  for(const p of f.petals){
    if(move){
      const k=dt/16;
      p.sway+=p.swayV*k;p.flip+=p.flipV*k;p.rot+=p.spin*k;
      if(f.mx>-900){const dx=p.x-f.mx,dy=p.y-f.my,d2=dx*dx+dy*dy;if(d2<140*140){const fall=1-Math.sqrt(d2)/140;p.wx+=(f.vx*.05+dx/(Math.sqrt(d2)+1)*.6)*fall;p.wy+=(f.vy*.05+dy/(Math.sqrt(d2)+1)*.6)*fall;p.spin+=(Math.random()-.5)*.004*fall;}}
      p.wx*=.94;p.wy*=.94;
      p.x+=(Math.sin(p.sway)*.55+p.wx)*k;p.y+=(p.vy+p.wy)*k;
      if(p.y>h+24||p.x<-40||p.x>w+40)Object.assign(p,seed(f,false),{x:Math.random()*w});
    }
    const sx=Math.cos(p.flip);
    ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.rot);ctx.scale(Math.max(.12,Math.abs(sx)),1);
    const g=ctx.createLinearGradient(-p.s,-p.s,p.s,p.s);g.addColorStop(0,p.a);g.addColorStop(1,p.b);
    ctx.globalAlpha=p.alpha*(sx<0?.75:1);ctx.fillStyle=g;
    ctx.beginPath();ctx.moveTo(0,-p.s);ctx.bezierCurveTo(p.s*.95,-p.s*.7,p.s*.8,p.s*.6,0,p.s);ctx.bezierCurveTo(-p.s*.8,p.s*.6,-p.s*.95,-p.s*.7,0,-p.s);ctx.fill();
    ctx.globalAlpha=p.alpha*.35;ctx.strokeStyle='#fff';ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(0,-p.s*.7);ctx.quadraticCurveTo(p.s*.15,0,0,p.s*.75);ctx.stroke();
    ctx.restore();
  }
  f.vx*=.8;f.vy*=.8;
}
function loopPetals(f,t){f.raf=0;const dt=f.last?Math.min(48,t-f.last):0;f.last=t;paintPetals(f,dt);if(running(f))f.raf=requestAnimationFrame(n=>loopPetals(f,n));else f.last=0;}
const running=f=>f.visible&&!document.hidden&&!isMotionPaused();
function wakePetals(f){if(!f.raf&&running(f))f.raf=requestAnimationFrame(t=>loopPetals(f,t));if(!running(f))paintPetals(f,0);}

/* ---------- reveals: filigree, medallions, rosette ---------- */
const scrubbed=new Set();
function scrubRosette(){
  for(const svg of scrubbed){
    if(!svg.isConnected){scrubbed.delete(svg);continue;}
    const b=svg.getBoundingClientRect(),vh=innerHeight,p=isMotionPaused()?1:Math.min(1,Math.max(0,(vh-b.top)/(vh*.55+b.height*.6)));
    svg.style.setProperty('--draw',p.toFixed(3));
  }
}
let scrollQueued=false;
addEventListener('scroll',()=>{if(scrollQueued)return;scrollQueued=true;requestAnimationFrame(()=>{scrollQueued=false;scrubRosette();});},{passive:true});

const io=new IntersectionObserver(entries=>{
  for(const e of entries){
    const f=fields.get(e.target);
    if(f){f.visible=e.isIntersecting;wakePetals(f);continue;}
    if(e.isIntersecting){e.target.classList.add('is-drawn');io.unobserve(e.target);}
  }
},{threshold:.18});

/* ---------- Sol / Astra / Luna ---------- */
function pickModel(button){
  const group=button.closest('[data-rose-models]');
  group.querySelectorAll('[data-rose-model]').forEach(b=>{const on=b===button;b.setAttribute('aria-checked',String(on));b.tabIndex=on?0:-1;});
  const label=group.closest('.rose-medallion')?.querySelector('[data-rose-model-label]');if(label)label.textContent='GPT-6 '+button.dataset.roseModel;
}
document.addEventListener('click',e=>{const b=e.target.closest('[data-rose-model]');if(b)pickModel(b);});
document.addEventListener('keydown',e=>{
  const b=e.target.closest?.('[data-rose-model]');if(!b||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;
  e.preventDefault();const all=[...b.parentElement.querySelectorAll('[data-rose-model]')],next=all[(all.indexOf(b)+(e.key==='ArrowLeft'||e.key==='ArrowUp'?-1:1)+all.length)%all.length];next.focus();pickModel(next);
});

export function mountRoseraieAtelier(){
  for(const [host,f] of fields)if(!host.isConnected){f.ro.disconnect();io.unobserve(host);cancelAnimationFrame(f.raf);fields.delete(host);}
  document.querySelectorAll('[data-rose-petal-host]').forEach(mountPetals);
  document.querySelectorAll('.rose-frame,.rose-medallion,.wb--roseraie .wb-arch').forEach(el=>{if(el.dataset.roseWatch)return;el.dataset.roseWatch='1';if(isMotionPaused())el.classList.add('is-drawn');else io.observe(el);});
  document.querySelectorAll('.rose-rosette').forEach(svg=>scrubbed.add(svg));scrubRosette();
}
document.addEventListener('visibilitychange',()=>{for(const f of fields.values())wakePetals(f);});
onMotionChange(()=>{for(const f of fields.values())wakePetals(f);if(isMotionPaused())document.querySelectorAll('.rose-frame,.rose-medallion,.wb--roseraie .wb-arch').forEach(el=>el.classList.add('is-drawn'));scrubRosette();});
document.addEventListener('roseraie:render',()=>requestAnimationFrame(mountRoseraieAtelier));
requestAnimationFrame(mountRoseraieAtelier);
