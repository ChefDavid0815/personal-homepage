// School Lab signatures: NABAT's NFC tag answers a tap with ripples; NeRF casts camera rays from the
// pointer and samples along them toward the scene; STRIDE sweeps a perception sonar under the pointer.
// Pointer-led, paused off-screen and with motion off.
import {isMotionPaused} from './motion-state.js';

/* NABAT: NFC ripples from the specimen tag */
function nabat(host){
  if(host.dataset.sig)return;host.dataset.sig='1';
  const tag=document.createElement('span');tag.className='nabat-nfc';tag.setAttribute('aria-hidden','true');tag.innerHTML='<i></i><i></i><i></i><b></b>';host.append(tag);
  const ping=()=>{if(isMotionPaused())return;tag.classList.remove('is-ping');void tag.offsetWidth;tag.classList.add('is-ping');};
  host.addEventListener('pointerenter',ping);
  new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){setTimeout(ping,600);o.disconnect();}},{threshold:.5}).observe(host);
}

/* NeRF: rays from the camera (pointer) through the scene, with volume samples */
function nerf(room){
  if(room.dataset.sig)return;room.dataset.sig='1';
  const well=room.querySelector('.nerf-image-well');if(!well)return;
  const canvas=document.createElement('canvas');canvas.className='nerf-rays';canvas.setAttribute('aria-hidden','true');room.append(canvas);
  const ctx=canvas.getContext('2d');let w=0,h=0,dpr=1,cx=-1,cy=-1,tx=-1,ty=-1,raf=0,visible=false;
  const targets=Array.from({length:22},(_,i)=>({u:.12+((i*37)%76)/100,v:.1+((i*53)%80)/100,ph:i*1.7}));
  const size=()=>{const b=room.getBoundingClientRect();w=b.width;h=b.height;dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);if(cx<0){cx=tx=w*.12;cy=ty=h*.2;}draw();};
  new ResizeObserver(size).observe(room);
  function draw(){
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
    const rb=room.getBoundingClientRect(),wb=well.getBoundingClientRect(),x0=wb.left-rb.left,y0=wb.top-rb.top,t=performance.now()/1000;
    for(const p of targets){
      const ex=x0+p.u*wb.width,ey=y0+p.v*wb.height,len=Math.hypot(ex-cx,ey-cy);
      const g=ctx.createLinearGradient(cx,cy,ex,ey);g.addColorStop(0,'rgba(198,245,90,0)');g.addColorStop(1,'rgba(198,245,90,.42)');
      ctx.strokeStyle=g;ctx.lineWidth=.8;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(ex,ey);ctx.stroke();
      const n=Math.max(6,Math.round(len/28));
      for(let k=1;k<=n;k++){const f=k/n,near=Math.max(0,(f-.62)/.38),jit=isMotionPaused()?0:Math.sin(t*2+p.ph+k)*.004;
        ctx.fillStyle=`rgba(${near>0?'232,255,170':'198,245,90'},${.12+near*.75})`;ctx.beginPath();ctx.arc(cx+(ex-cx)*(f+jit),cy+(ey-cy)*(f+jit),.8+near*1.8,0,6.283);ctx.fill();}
    }
    ctx.strokeStyle='rgba(198,245,90,.9)';ctx.lineWidth=1.2;ctx.strokeRect(cx-7,cy-5,14,10);ctx.beginPath();ctx.moveTo(cx+7,cy);ctx.lineTo(cx+12,cy-4);ctx.lineTo(cx+12,cy+4);ctx.closePath();ctx.stroke();
  }
  function tick(){raf=0;cx+=(tx-cx)*.18;cy+=(ty-cy)*.18;draw();if(visible&&!isMotionPaused()&&(Math.abs(tx-cx)+Math.abs(ty-cy)>.5))raf=requestAnimationFrame(tick);}
  room.addEventListener('pointermove',e=>{const b=room.getBoundingClientRect(),wb=well.getBoundingClientRect();const x=e.clientX-b.left,y=e.clientY-b.top;
    if(e.clientX>wb.left-20&&e.clientX<wb.right+20&&e.clientY>wb.top-20&&e.clientY<wb.bottom+20)return;
    tx=x;ty=y;if(isMotionPaused()){cx=tx;cy=ty;draw();return;}if(!raf)raf=requestAnimationFrame(tick);},{passive:true});
  new IntersectionObserver(es=>{visible=es[0].isIntersecting;if(visible)draw();}).observe(room);
}

/* STRIDE: a perception sonar under the pointer that lights what it reaches */
function stride(cover){
  if(cover.dataset.sig)return;cover.dataset.sig='1';
  const canvas=document.createElement('canvas');canvas.className='wis-sonar';canvas.setAttribute('aria-hidden','true');cover.append(canvas);
  const ctx=canvas.getContext('2d');let w=0,h=0,dpr=1,raf=0,last=0,px=-1,py=-1;const pulses=[];
  const marks=Array.from({length:16},(_,i)=>({u:.08+((i*41)%84)/100,v:.48+((i*29)%46)/100,lit:0}));
  const size=()=>{const b=cover.getBoundingClientRect();w=b.width;h=b.height;dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);};
  new ResizeObserver(size).observe(cover);size();
  function frame(now){
    raf=0;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
    if(px>=0&&now-last>850){pulses.push({x:px,y:py,t:now});last=now;}
    for(let i=pulses.length-1;i>=0;i--){const p=pulses[i],age=(now-p.t)/1400;if(age>1){pulses.splice(i,1);continue;}
      const R=age*Math.min(260,w*.3);ctx.strokeStyle=`rgba(214,236,196,${(1-age)*.7})`;ctx.lineWidth=1.5;ctx.beginPath();ctx.arc(p.x,p.y,R,0,6.283);ctx.stroke();
      for(const m of marks){const d=Math.hypot(m.u*w-p.x,m.v*h-p.y);if(Math.abs(d-R)<10)m.lit=1;}}
    for(const m of marks){if(m.lit<=.01)continue;const x=m.u*w,y=m.v*h;ctx.fillStyle=`rgba(255,220,120,${m.lit})`;ctx.beginPath();ctx.arc(x,y,3.5,0,6.283);ctx.fill();
      ctx.strokeStyle=`rgba(255,220,120,${m.lit*.6})`;ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,9+(1-m.lit)*10,0,6.283);ctx.stroke();m.lit*=.965;}
    if(px>=0||pulses.length||marks.some(m=>m.lit>.01))raf=requestAnimationFrame(frame);
  }
  cover.addEventListener('pointermove',e=>{if(isMotionPaused()||e.pointerType==='touch')return;const b=cover.getBoundingClientRect();px=e.clientX-b.left;py=e.clientY-b.top;if(!raf)raf=requestAnimationFrame(frame);},{passive:true});
  cover.addEventListener('pointerleave',()=>{px=py=-1;});
}

function scan(){
  document.querySelectorAll('#project-nabat .nabat-specimen-breathe').forEach(nabat);
  document.querySelectorAll('#project-nerf').forEach(nerf);
  document.querySelectorAll('#project-wis-tech-tank .wis-cover').forEach(stride);
}
let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;scan();});}).observe(document.documentElement,{childList:true,subtree:true});
requestAnimationFrame(scan);
