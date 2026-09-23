import {canAnimate,onMotionChange} from './motion-state.js';

const sessions=new Map();
const pointerBound=new WeakSet();
let timelineContext;

function noise(seed) {
  const value=Math.sin(seed*127.1+19.7)*43758.5453;
  return value-Math.floor(value);
}

function startStars(canvas) {
  if(sessions.has(canvas)) return;
  const context=canvas.getContext('2d',{alpha:true});
  if(!context) return;
  const stars=Array.from({length:72},(_,i)=>({x:noise(i*5+1),y:noise(i*5+2),size:.45+noise(i*5+3)*1.35,phase:noise(i*5+4)*Math.PI*2,depth:.3+noise(i*5+5)*.7}));
  let width=0,height=0,visible=false,frame=0,last=0,phase=0;

  function resize() {
    width=canvas.clientWidth;
    height=canvas.clientHeight;
    if(!width||!height) return;
    const dpr=Math.min(window.devicePixelRatio||1,1.5);
    canvas.width=Math.round(width*dpr);
    canvas.height=Math.round(height*dpr);
    context.setTransform(dpr,0,0,dpr,0,0);
    draw(false);
  }

  function draw(advance=true) {
    if(!width||!height) return;
    context.clearRect(0,0,width,height);
    const count=width<380?44:stars.length;
    for(let i=0;i<count;i++) {
      const star=stars[i];
      const x=star.x*width+(advance?Math.sin(phase+star.phase)*5*star.depth:0);
      const y=star.y*height+(advance?Math.cos(phase*.65+star.phase)*4*star.depth:0);
      const light=.46+.34*Math.sin(phase*1.6+star.phase);
      context.beginPath();
      context.arc(x,y,star.size,0,Math.PI*2);
      context.fillStyle=`rgba(255,226,171,${Math.max(.22,light)})`;
      context.fill();
      if(i%9===0 && i+2<count) {
        const next=stars[i+2];
        context.beginPath();
        context.moveTo(x,y);
        context.lineTo(next.x*width,next.y*height);
        context.strokeStyle='rgba(244,207,151,.16)';
        context.lineWidth=.7;
        context.stroke();
      }
    }
  }

  function tick(now) {
    frame=0;
    if(!canvas.isConnected) { destroy(); return; }
    if(!visible||!canAnimate()) { draw(false); return; }
    const elapsed=last?Math.min(now-last,50):16;
    last=now;
    phase+=elapsed*.00034;
    draw(true);
    frame=requestAnimationFrame(tick);
  }

  function resume() {
    if(frame) cancelAnimationFrame(frame);
    frame=0;
    last=0;
    if(visible&&canAnimate()) frame=requestAnimationFrame(tick);
    else draw(false);
  }

  const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;resume()},{threshold:0});
  const resizeObserver=new ResizeObserver(resize);
  function destroy() {
    cancelAnimationFrame(frame);
    observer.disconnect();
    resizeObserver.disconnect();
    sessions.delete(canvas);
  }
  sessions.set(canvas,{resume,destroy});
  resize();
  observer.observe(canvas);
  resizeObserver.observe(canvas);
}

function bindPointer(stage) {
  if(pointerBound.has(stage)) return;
  pointerBound.add(stage);
  stage.addEventListener('pointermove',event=>{
    if(event.pointerType==='touch'||!canAnimate()) return;
    const rect=stage.getBoundingClientRect();
    stage.style.setProperty('--atlas-pointer-x',`${((event.clientX-rect.left)/rect.width*100).toFixed(1)}%`);
    stage.style.setProperty('--atlas-pointer-y',`${((event.clientY-rect.top)/rect.height*100).toFixed(1)}%`);
  },{passive:true});
  stage.addEventListener('pointerleave',()=>{
    stage.style.removeProperty('--atlas-pointer-x');
    stage.style.removeProperty('--atlas-pointer-y');
  },{passive:true});
}

function scrollMotion() {
  timelineContext?.revert();
  timelineContext=undefined;
  const gsap=window.gsap;
  const ScrollTrigger=window.ScrollTrigger;
  if(!canAnimate()||!gsap||!ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  timelineContext=gsap.context(()=>{
    document.querySelectorAll('.atlas-v2-overture').forEach(stage=>{
      const art=stage.querySelector('.atlas-v2-overture-art');
      const copy=stage.querySelector('.atlas-v2-overture-copy');
      gsap.fromTo(copy,{y:42,opacity:.25},{y:0,opacity:1,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:stage,start:'top 85%',once:true}});
      gsap.to(art,{yPercent:-5,ease:'none',scrollTrigger:{trigger:stage,start:'top bottom',end:'bottom top',scrub:.8}});
    });
    document.querySelectorAll('.atlas-v2-prologue h3,.atlas-v2-epilogue-copy h3').forEach(heading=>{
      gsap.fromTo(heading,{y:34,opacity:.35},{y:0,opacity:1,duration:.9,ease:'power2.out',scrollTrigger:{trigger:heading,start:'top 87%',once:true}});
    });
    document.querySelectorAll('.atlas-v2-ledger>div').forEach((item,i)=>{
      gsap.fromTo(item,{y:27,opacity:.35},{y:0,opacity:1,duration:.75,delay:i*.08,ease:'power2.out',scrollTrigger:{trigger:item,start:'top 90%',once:true}});
    });
    document.querySelectorAll('.atlas-v2-now-core,.atlas-v2-post-title').forEach(item=>{
      gsap.fromTo(item,{y:24,opacity:.5},{y:0,opacity:1,duration:.85,ease:'power2.out',scrollTrigger:{trigger:item,start:'top 92%',once:true}});
    });
    document.querySelectorAll('.article-card--atlas .article-figure').forEach(figure=>{
      gsap.fromTo(figure,{clipPath:'inset(0 0 18% 0)',opacity:.7},{clipPath:'inset(0 0 0% 0)',opacity:1,ease:'none',scrollTrigger:{trigger:figure,start:'top 95%',end:'top 48%',scrub:.7}});
    });
  });
}

function initialize() {
  for(const [canvas,session] of sessions) if(!canvas.isConnected) session.destroy();
  document.querySelectorAll('.atlas-v2-stars').forEach(startStars);
  document.querySelectorAll('.atlas-v2-overture,.atlas-v2-now,.atlas-v2-post-art').forEach(bindPointer);
  scrollMotion();
}

document.addEventListener('atlas:render',()=>requestAnimationFrame(initialize));
document.addEventListener('visibilitychange',()=>sessions.forEach(session=>session.resume()));
onMotionChange(()=>{
  sessions.forEach(session=>session.resume());
  requestAnimationFrame(scrollMotion);
});
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',initialize,{once:true});
else requestAnimationFrame(initialize);
