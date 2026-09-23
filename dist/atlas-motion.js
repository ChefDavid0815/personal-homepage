const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const stars = new WeakSet();
const starfieldSessions = new Set();
let motionContext;

function seeded(index) {
  const n = Math.sin(index * 127.1 + 19.7) * 43758.5453;
  return n - Math.floor(n);
}

function createStarfield(canvas) {
  if(stars.has(canvas)) return;
  stars.add(canvas);
  const ctx = canvas.getContext('2d', {alpha:true});
  if(!ctx) return;
  const points = Array.from({length:57},(_,i)=>({x:seeded(i*4+1),y:seeded(i*4+2),r:.5+seeded(i*4+3)*1.4,phase:seeded(i*4+4)*Math.PI*2}));
  let width=0,height=0,visible=true,frame=0,raf=0;
  const resize=()=>{const dpr=Math.min(devicePixelRatio||1,1.7);width=canvas.clientWidth;height=canvas.clientHeight;if(!width||!height)return;canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0)};
  const resume=()=>{if(visible&&!raf&&!document.hidden&&!reduced.matches)raf=requestAnimationFrame(draw)};
  const observer=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??false;resume()},{threshold:0});
  const resizeObserver=new ResizeObserver(resize);
  function draw(){raf=0;if(!canvas.isConnected){observer.disconnect();resizeObserver.disconnect();starfieldSessions.delete(resume);return}if(!visible||document.hidden||reduced.matches)return;frame++;ctx.clearRect(0,0,width,height);const phase=frame*.004;
    for(let i=0;i<points.length;i++){const p=points[i];const x=p.x*width+Math.sin(phase+p.phase)*4;const y=p.y*height+Math.cos(phase*.8+p.phase)*3;const glow=.42+.48*(.5+.5*Math.sin(phase*1.5+p.phase));ctx.beginPath();ctx.arc(x,y,p.r,0,Math.PI*2);ctx.fillStyle=`rgba(255,224,163,${glow})`;ctx.shadowColor='#f6d49f';ctx.shadowBlur=p.r*6;ctx.fill();if(i%7===0&&i+1<points.length){const next=points[i+1];ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(next.x*width,next.y*height);ctx.strokeStyle='rgba(232,192,127,.13)';ctx.lineWidth=.6;ctx.stroke()}}
    ctx.shadowBlur=0;raf=requestAnimationFrame(draw)}
  resize();observer.observe(canvas);resizeObserver.observe(canvas);starfieldSessions.add(resume);
}

function initialize() {
  document.querySelectorAll('.atlas-starfield').forEach(createStarfield);
  motionContext?.revert();
  const gsap=window.gsap;
  const ScrollTrigger=window.ScrollTrigger;
  if(!gsap||!ScrollTrigger||reduced.matches)return;
  gsap.registerPlugin(ScrollTrigger);
  motionContext=gsap.context(()=>{
    document.querySelectorAll('.atlas-bento').forEach(stage=>{
      gsap.fromTo(stage.querySelector('.atlas-bento-main-copy'),{y:45,opacity:0},{y:0,opacity:1,duration:1.1,ease:'power3.out',scrollTrigger:{trigger:stage,start:'top 82%',once:true}});
      gsap.fromTo(stage.querySelectorAll('.atlas-bento-side'),{y:55,opacity:.35,rotate:1.8},{y:0,opacity:1,rotate:0,stagger:.13,ease:'power2.out',scrollTrigger:{trigger:stage,start:'top 85%',end:'bottom 58%',scrub:.75}});
      const img=stage.querySelector('.atlas-bento-main>img');
      if(img)gsap.to(img,{yPercent:-7,ease:'none',scrollTrigger:{trigger:stage,start:'top bottom',end:'bottom top',scrub:1}});
    });
    document.querySelectorAll('.atlas-intro h3').forEach(heading=>gsap.fromTo(heading,{clipPath:'inset(0 100% 0 0)',y:18},{clipPath:'inset(0 0% 0 0)',y:0,ease:'none',scrollTrigger:{trigger:heading,start:'top 90%',end:'top 40%',scrub:.8}}));
    document.querySelectorAll('.atlas-facts>div').forEach((item,i)=>gsap.fromTo(item,{y:28,opacity:0},{y:0,opacity:1,duration:.75,delay:i*.09,ease:'power2.out',scrollTrigger:{trigger:item,start:'top 87%',once:true}}));
    document.querySelectorAll('.milestone--atlas,.post-card--atlas,.article-card--atlas .article-chapter').forEach(section=>gsap.fromTo(section,{y:38,opacity:.45},{y:0,opacity:1,duration:.9,ease:'power2.out',scrollTrigger:{trigger:section,start:'top 87%',once:true}}));
    document.querySelectorAll('.article-card--atlas .article-figure').forEach(figure=>gsap.fromTo(figure,{clipPath:'inset(0 0 100% 0)',y:25},{clipPath:'inset(0 0 0% 0)',y:0,ease:'none',scrollTrigger:{trigger:figure,start:'top 90%',end:'top 45%',scrub:.7}}));
  });
  document.querySelectorAll('.atlas-bento-main,.post-art--atlas,.atlas-now-art').forEach(stage=>{
    if(stage.dataset.atlasPointer)return;stage.dataset.atlasPointer='true';
    const art=stage.querySelector('img');if(!art)return;
    stage.addEventListener('pointermove',event=>{if(event.pointerType==='touch')return;const box=stage.getBoundingClientRect();const x=(event.clientX-box.left)/box.width-.5;const y=(event.clientY-box.top)/box.height-.5;gsap.to(art,{x:x*13,y:y*13,duration:.9,ease:'power2.out',overwrite:true})},{passive:true});
    stage.addEventListener('pointerleave',()=>gsap.to(art,{x:0,y:0,duration:1,ease:'power2.out',overwrite:true}),{passive:true});
  });
}

document.addEventListener('atlas:render',()=>requestAnimationFrame(initialize));
document.addEventListener('visibilitychange',()=>{if(!document.hidden){starfieldSessions.forEach(resume=>resume());initialize()}});
reduced.addEventListener('change',()=>{starfieldSessions.forEach(resume=>resume());initialize()});
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initialize,{once:true});else requestAnimationFrame(initialize);
