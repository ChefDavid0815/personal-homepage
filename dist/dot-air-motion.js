// DOT/AIR exhibit motion: halftone sky field, split-flap departure board, magnetic fleet discs,
// Flight DNA strand and the cycling window board. All of it stops off-screen, in hidden tabs,
// and when the site motion switch or reduced motion is on.
import {getLanguage} from './i18n.js';
import {isMotionPaused,onMotionChange} from './motion-state.js';
import {dotAirAirports} from './dot-air-content.js';

const en=()=>getLanguage()==='en';
const HOME=dotAirAirports[0];
const rad=Math.PI/180;
export function greatCircleKm(a,b){
  const p1=a.lat*rad,p2=b.lat*rad,dp=p2-p1,dl=(b.lon-a.lon)*rad;
  const h=Math.sin(dp/2)**2+Math.cos(p1)*Math.cos(p2)*Math.sin(dl/2)**2;
  return Math.round(6371*2*Math.asin(Math.sqrt(h)));
}
const kmLabel=airport=>airport.code===HOME.code?'ORIGIN':`${greatCircleKm(HOME,airport).toLocaleString('en-US')} KM`;

/* ---------- split-flap ---------- */
const GLYPHS='ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789,';
const flapTimers=new WeakMap();
export function setFlaps(node,text){
  if(!node)return;
  const n=+node.dataset.flapSize||text.length,target=[...text.padEnd(n).slice(0,n)],cells=[...node.children];
  if(node.dataset.flap===text)return;node.dataset.flap=text;
  clearInterval(flapTimers.get(node));
  if(isMotionPaused()){cells.forEach((c,i)=>{c.textContent=target[i]===' '?' ':target[i];c.classList.remove('is-flipping');});return;}
  const steps=cells.map((c,i)=>target[i]===c.textContent.replace(' ',' ')?0:4+i*2+Math.floor(Math.random()*3));
  let tick=0;
  const timer=setInterval(()=>{
    tick++;let busy=false;
    cells.forEach((c,i)=>{
      if(tick<steps[i]){busy=true;c.textContent=GLYPHS[Math.floor(Math.random()*GLYPHS.length)];c.classList.remove('is-flipping');void c.offsetWidth;c.classList.add('is-flipping');}
      else if(tick===steps[i]){c.textContent=target[i]===' '?' ':target[i];c.classList.remove('is-flipping');void c.offsetWidth;c.classList.add('is-flipping');}
    });
    if(!busy){clearInterval(timer);flapTimers.delete(node);}
  },62);
  flapTimers.set(node,timer);
}
function updateBoard(root,code){
  const board=root?.querySelector('[data-da-board]');if(!board)return;
  const airport=dotAirAirports.find(a=>a.code===code)||HOME,[,to,dist]=board.querySelectorAll('.da-flaps');
  setFlaps(to,airport.code);setFlaps(dist,kmLabel(airport));
  board.dataset.route=String(airport.code!==HOME.code);
  const say=board.querySelector('[data-da-board-say]');
  if(say)say.textContent=airport.code===HOME.code?(en()?'Viewpoint: Dubai, the origin.':'视角：迪拜，出发点。'):(en()?`From Dubai to ${airport.name[1]}, about ${greatCircleKm(HOME,airport).toLocaleString('en-US')} km along the great circle.`:`从迪拜到${airport.name[0]}，理论大圆距离约 ${greatCircleKm(HOME,airport).toLocaleString('en-US')} 公里。`);
}

/* ---------- halftone sky field ---------- */
const fields=new Map();
function mountField(hero){
  if(fields.has(hero))return;
  const canvas=document.createElement('canvas');canvas.className='da-field';canvas.setAttribute('aria-hidden','true');hero.prepend(canvas);
  const f={hero,canvas,ctx:canvas.getContext('2d'),w:0,h:0,dpr:1,px:-999,py:-999,tx:-999,ty:-999,inside:false,ripples:[],born:0,visible:false,raf:0,last:0,lens:0};
  fields.set(hero,f);
  f.ro=new ResizeObserver(()=>{size(f);draw(f,performance.now());});f.ro.observe(hero);
  hero.addEventListener('pointermove',e=>{const b=hero.getBoundingClientRect();f.tx=e.clientX-b.left;f.ty=e.clientY-b.top;if(!f.inside){f.px=f.tx;f.py=f.ty;}f.inside=true;wake(f);},{passive:true});
  hero.addEventListener('pointerleave',()=>{f.inside=false;wake(f);});
  io.observe(hero);size(f);hero.dataset.field='on';
}
function size(f){
  const b=f.hero.getBoundingClientRect();f.w=b.width;f.h=b.height;f.dpr=Math.min(devicePixelRatio||1,2);
  f.canvas.width=Math.round(f.w*f.dpr);f.canvas.height=Math.round(f.h*f.dpr);
  f.gap=f.w<700?32:46;f.r0=f.w<700?3.2:4.6;
}
function ripple(hero){
  const f=fields.get(hero);if(!f||isMotionPaused())return;
  const globe=hero.querySelector('.da-globe')?.getBoundingClientRect(),b=hero.getBoundingClientRect();
  f.ripples.push({x:globe?globe.left-b.left+globe.width/2:f.w*.7,y:globe?globe.top-b.top+globe.height/2:f.h/2,t:performance.now()});wake(f);
}
function draw(f,now){
  const {ctx,w,h,gap,r0,dpr}=f;if(!w)return false;
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
  const still=isMotionPaused();
  if(!still){f.px+=(f.tx-f.px)*.16;f.py+=(f.ty-f.py)*.16;f.lens+=((f.inside?1:0)-f.lens)*.08;}
  else f.lens=0;
  const born=still?1:Math.min(1,(now-f.born)/1600),sigma=w<700?80:120,s2=2*sigma*sigma;
  f.ripples=f.ripples.filter(r=>now-r.t<2200);
  let active=!still&&(born<1||Math.abs(f.tx-f.px)+Math.abs(f.ty-f.py)>.4||f.lens>.01&&f.lens<.99||f.ripples.length>0);
  const ox=(w%gap)/2,oy=(h%gap)/2,cols=Math.ceil(w/gap)+1,rows=Math.ceil(h/gap)+1;
  const paper='#f5f3eb',yellow='#ead25a';
  for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){
    let x=ox+i*gap,y=oy+j*gap;
    // entrance: a diagonal sweep fills the sky with dots
    const sweep=Math.min(1,Math.max(0,born*1.9-(x/w*.6+y/h*.3)));
    if(sweep<=0)continue;
    let r=r0*(1-(1-sweep)**3),hot=0;
    if(f.lens>.01){
      const dx=x-f.px,dy=y-f.py,d2=dx*dx+dy*dy,k=Math.exp(-d2/s2)*f.lens;
      r*=1+1.35*k;const d=Math.sqrt(d2)||1,push=k*gap*.38;x+=dx/d*push;y+=dy/d*push;
    }
    for(const rp of f.ripples){
      const age=now-rp.t,R=age*.95,dx=x-rp.x,dy=y-rp.y,d=Math.sqrt(dx*dx+dy*dy),band=Math.exp(-((d-R)**2)/(2*44*44))*(1-age/2200);
      r*=1+1.1*band;hot=Math.max(hot,band);
    }
    ctx.fillStyle=hot>.42?yellow:paper;ctx.beginPath();ctx.arc(x,y,Math.max(0,r),0,Math.PI*2);ctx.fill();
  }
  return active;
}
function wake(f){if(!f.raf&&f.visible&&!document.hidden)f.raf=requestAnimationFrame(t=>loop(f,t));}
function loop(f,t){f.raf=0;const more=draw(f,t);if(more&&f.visible&&!document.hidden)f.raf=requestAnimationFrame(n=>loop(f,n));}

/* ---------- magnetic fleet discs ---------- */
const discs=new Map();
function mountDisc(el){
  if(discs.has(el))return;
  const canvas=document.createElement('canvas');canvas.setAttribute('aria-hidden','true');el.append(canvas);
  const style=getComputedStyle(el),tail=el.closest('.da-tail');
  const d={el,tail,canvas,ctx:canvas.getContext('2d'),dots:[],px:-999,py:-999,hover:0,on:false,raf:0,visible:false,
    ink:el.closest('.da-tail-2')?'#f5f3eb':'#20221f'};
  discs.set(el,d);
  d.ro=new ResizeObserver(()=>{layoutDisc(d);paintDisc(d);});d.ro.observe(el);
  const move=e=>{const b=el.getBoundingClientRect();d.px=e.clientX-b.left;d.py=e.clientY-b.top;d.on=true;wakeDisc(d);};
  tail.addEventListener('pointerenter',move,{passive:true});tail.addEventListener('pointermove',move,{passive:true});
  tail.addEventListener('pointerleave',()=>{d.on=false;wakeDisc(d);});
  tail.addEventListener('focus',()=>{const b=el.getBoundingClientRect();d.px=b.width/2;d.py=b.height*.62;d.on=true;wakeDisc(d);});
  tail.addEventListener('blur',()=>{d.on=false;wakeDisc(d);});
  io.observe(el);el.dataset.canvas='on';
}
function layoutDisc(d){
  const b=d.el.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);if(!b.width)return;
  d.size=b.width;d.canvas.width=Math.round(b.width*dpr);d.canvas.height=Math.round(b.height*dpr);d.dpr=dpr;
  const gap=b.width<150?16:27*(b.width/230),r=b.width<150?3:5*(b.width/230),R=b.width/2;d.r=r;d.dots=[];
  for(let y=gap/2;y<b.width;y+=gap)for(let x=gap/2;x<b.width;x+=gap){if((x-R)**2+(y-R)**2<(R-r*.4)**2)d.dots.push({hx:x,hy:y,x,y,vx:0,vy:0});}
}
function paintDisc(d){
  const {ctx,dpr,size,r}=d;if(!size)return false;
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,size,size);ctx.fillStyle=d.ink;
  const still=isMotionPaused();let moving=false;
  d.hover+=((d.on&&!still?1:0)-d.hover)*.12;
  for(const p of d.dots){
    if(!still){
      let fx=(p.hx-p.x)*.08,fy=(p.hy-p.y)*.08;
      if(d.hover>.01){const dx=p.x-d.px,dy=p.y-d.py,dist=Math.hypot(dx,dy)||1,reach=size*.36;if(dist<reach){const k=(1-dist/reach)**2*9*d.hover;fx+=dx/dist*k;fy+=dy/dist*k;}}
      p.vx=(p.vx+fx)*.78;p.vy=(p.vy+fy)*.78;p.x+=p.vx;p.y+=p.vy;
      if(Math.abs(p.vx)+Math.abs(p.vy)>.03||Math.abs(p.x-p.hx)+Math.abs(p.y-p.hy)>.2)moving=true;
    }else{p.x=p.hx;p.y=p.hy;}
    const off=Math.min(1,Math.hypot(p.x-p.hx,p.y-p.hy)/(size*.12));
    ctx.beginPath();ctx.arc(p.x,p.y,r*(1-off*.45),0,Math.PI*2);ctx.fill();
  }
  return moving||(d.hover>.01&&d.hover<.99);
}
function wakeDisc(d){if(!d.raf&&d.visible)d.raf=requestAnimationFrame(()=>loopDisc(d));}
function loopDisc(d){d.raf=0;if(paintDisc(d)&&d.visible&&!document.hidden)d.raf=requestAnimationFrame(()=>loopDisc(d));}

/* ---------- Flight DNA ---------- */
function syncStrand(root){
  root.querySelectorAll('.da-gene').forEach((gene,gi)=>{
    const on=[...gene.querySelectorAll('.da-allele')].map(b=>b.getAttribute('aria-checked')==='true'||b.getAttribute('aria-pressed')==='true');
    root.querySelectorAll(`[data-strand="${gi}"] i`).forEach((i,k)=>i.classList.toggle('on',on[k]));
    const value=gene.querySelector('.da-gene-value');
    if(value)value.textContent=[...gene.querySelectorAll('.da-allele')].filter((b,k)=>on[k]).map(b=>b.textContent.trim()).join(' + ')||'—';
  });
}
function pickAllele(button){
  const gene=button.closest('.da-gene'),root=button.closest('[data-da-dna]');
  if(gene.hasAttribute('data-multi'))button.setAttribute('aria-pressed',String(button.getAttribute('aria-pressed')!=='true'));
  else gene.querySelectorAll('.da-allele').forEach(b=>{const on=b===button;b.setAttribute('aria-checked',String(on));b.tabIndex=on?0:-1;});
  if(!isMotionPaused())button.animate([{scale:.6},{scale:1.18},{scale:1}],{duration:420,easing:'cubic-bezier(.16,1,.3,1)'});
  syncStrand(root);
}

/* ---------- window board ---------- */
const cycles=new Map();
function mountCycle(node){
  if(cycles.has(node))return;
  const c={node,index:1,timer:0,visible:false};cycles.set(node,c);io.observe(node);
}
function runCycle(c){
  clearInterval(c.timer);c.timer=0;
  if(!c.visible||isMotionPaused()||document.hidden)return;
  c.timer=setInterval(()=>{
    c.index=c.index%(dotAirAirports.length-1)+1;const a=dotAirAirports[c.index],[,to,dist]=c.node.querySelectorAll('.da-flaps');
    setFlaps(to,a.code);setFlaps(dist,kmLabel(a));
  },3400);
}

/* ---------- shared visibility ---------- */
const io=new IntersectionObserver(entries=>{
  for(const e of entries){
    const f=fields.get(e.target);if(f){f.visible=e.isIntersecting;if(f.visible&&!f.born){f.born=performance.now();}if(f.visible)wake(f);continue;}
    const d=discs.get(e.target);if(d){d.visible=e.isIntersecting;if(d.visible)paintDisc(d);continue;}
    const c=cycles.get(e.target);if(c){c.visible=e.isIntersecting;runCycle(c);continue;}
    if(e.target.matches('[data-da-dna]')&&e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target);}
  }
},{threshold:.05});

export function mountDotAirMotion(){
  for(const [hero,f] of fields)if(!hero.isConnected){f.ro.disconnect();io.unobserve(hero);cancelAnimationFrame(f.raf);fields.delete(hero);}
  for(const [el,d] of discs)if(!el.isConnected){d.ro.disconnect();io.unobserve(el);cancelAnimationFrame(d.raf);discs.delete(el);}
  for(const [node,c] of cycles)if(!node.isConnected){clearInterval(c.timer);io.unobserve(node);cycles.delete(node);}
  document.querySelectorAll('.da-hero').forEach(mountField);
  document.querySelectorAll('.da-tail-disc').forEach(mountDisc);
  document.querySelectorAll('[data-da-cycle]').forEach(mountCycle);
  document.querySelectorAll('[data-da-dna]').forEach(root=>{syncStrand(root);if(isMotionPaused())root.classList.add('is-in');else io.observe(root);});
  document.querySelectorAll('[data-da-exhibit]').forEach(root=>{const code=root.querySelector('[data-da-airport][aria-pressed=true]')?.dataset.daAirport;if(code)updateBoard(root,code);});
}

document.addEventListener('click',e=>{
  const airport=e.target.closest('[data-da-airport]');
  if(airport){const root=airport.closest('[data-da-exhibit]');updateBoard(root,airport.dataset.daAirport);const hero=root?.querySelector('.da-hero');if(hero)ripple(hero);return;}
  const allele=e.target.closest('.da-allele');if(allele)pickAllele(allele);
});
document.addEventListener('keydown',e=>{
  const allele=e.target.closest?.('.da-gene:not([data-multi]) .da-allele');if(!allele||!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;
  e.preventDefault();const all=[...allele.parentElement.children],i=all.indexOf(allele),next=all[(i+(e.key==='ArrowLeft'||e.key==='ArrowUp'?-1:1)+all.length)%all.length];
  next.focus();pickAllele(next);
});
document.addEventListener('visibilitychange',()=>{for(const f of fields.values())wake(f);for(const c of cycles.values())runCycle(c);});
onMotionChange(()=>{
  for(const f of fields.values()){f.ripples=[];draw(f,performance.now());wake(f);}
  for(const d of discs.values())paintDisc(d);
  for(const c of cycles.values())runCycle(c);
  document.querySelectorAll('[data-da-dna]').forEach(r=>{if(isMotionPaused())r.classList.add('is-in');});
});
document.addEventListener('dot-air:render',()=>requestAnimationFrame(mountDotAirMotion));
requestAnimationFrame(mountDotAirMotion);
