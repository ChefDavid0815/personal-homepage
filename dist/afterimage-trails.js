// AFTERIMAGE: long-exposure light trails that follow the pointer across the hero photograph,
// ghost afterimages that slide off a photograph on hover, and facts that count up once.
// Pointer-led only; nothing runs with motion off, off-screen or in a hidden tab.
import {isMotionPaused} from './motion-state.js';

/* ---------- light trails over the hero ---------- */
function mountTrails(stage){
  if(stage.dataset.trails)return;stage.dataset.trails='on';
  const canvas=document.createElement('canvas');canvas.className='air-trails';canvas.setAttribute('aria-hidden','true');
  const shade=stage.querySelector('.air-shade');(shade||stage.firstElementChild).after(canvas);
  const ctx=canvas.getContext('2d');let w=0,h=0,dpr=1,raf=0;const pts=[];
  const size=()=>{const b=stage.getBoundingClientRect();w=b.width;h=b.height;dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);};
  new ResizeObserver(size).observe(stage);size();
  stage.addEventListener('pointermove',e=>{
    if(isMotionPaused()||e.pointerType==='touch')return;
    const b=canvas.getBoundingClientRect();pts.push({x:e.clientX-b.left,y:e.clientY-b.top,t:performance.now()});
    if(pts.length>90)pts.shift();if(!raf)raf=requestAnimationFrame(draw);
  },{passive:true});
  function draw(now){
    raf=0;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
    const LIFE=900;while(pts.length&&now-pts[0].t>LIFE)pts.shift();
    if(pts.length>1){
      ctx.lineCap='round';ctx.lineJoin='round';ctx.globalCompositeOperation='lighter';
      for(const [width,color,offset] of [[10,'rgba(226,90,67,.16)',0],[4,'rgba(255,94,66,.7)',0],[1.4,'rgba(255,244,236,.95)',0],[3,'rgba(255,214,120,.45)',7]]){
        for(let i=1;i<pts.length;i++){
          const a=pts[i-1],b=pts[i],life=1-(now-b.t)/LIFE;
          ctx.strokeStyle=color;ctx.globalAlpha=Math.max(0,life);ctx.lineWidth=width*(.35+.65*life);
          ctx.beginPath();ctx.moveTo(a.x,a.y+offset);ctx.lineTo(b.x,b.y+offset);ctx.stroke();
        }
      }
      ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
    }
    if(pts.length)raf=requestAnimationFrame(draw);
  }
}

/* ---------- ghost afterimages on photographs ---------- */
function mountGhosts(frame){
  if(frame.dataset.ghosts)return;frame.dataset.ghosts='on';
  const img=frame.querySelector('img');if(!img)return;
  const host=img.parentElement;if(getComputedStyle(host).position==='static')host.style.position='relative';
  let busy=false;
  frame.addEventListener('pointerenter',e=>{
    if(busy||isMotionPaused()||e.pointerType==='touch')return;busy=true;
    const ghosts=[.42,.26,.14].map((o,i)=>{const g=img.cloneNode();g.removeAttribute('loading');g.alt='';g.setAttribute('aria-hidden','true');g.className='air-ghost';g.style.opacity=o;host.insertBefore(g,img.nextSibling);
      return g.animate([{transform:'translateX(0)',opacity:o,filter:'blur(0)'},{transform:`translateX(${-(i+1)*26}px)`,opacity:0,filter:'blur(2px) saturate(1.6)'}],{duration:620+i*140,easing:'cubic-bezier(.16,1,.3,1)',fill:'forwards'});});
    Promise.all(ghosts.map(a=>a.finished.catch(()=>{}))).then(()=>{ghosts.forEach(a=>a.effect.target.remove());busy=false;});
  });
}

/* ---------- facts count up ---------- */
const io=new IntersectionObserver(es=>{for(const e of es)if(e.isIntersecting){io.unobserve(e.target);if(isMotionPaused())continue;
  e.target.querySelectorAll('strong').forEach(el=>{const target=el.textContent.trim(),n=+target.replace(/,/g,'');if(!n)return;const t0=performance.now();
    const step=now=>{const p=Math.min(1,(now-t0)/1300);el.textContent=String(Math.round(n*(1-(1-p)**4)));if(p<1)requestAnimationFrame(step);else el.textContent=target;};requestAnimationFrame(step);});}},{threshold:.4});

function scan(){
  document.querySelectorAll('[data-afterimage-stage]').forEach(mountTrails);
  document.querySelectorAll('.air-frame').forEach(mountGhosts);
  document.querySelectorAll('.air-facts:not([data-counted])').forEach(f=>{f.dataset.counted='1';io.observe(f);});
}
scan();
