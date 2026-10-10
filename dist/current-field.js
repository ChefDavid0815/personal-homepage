// 川流 / The current field.
// Thousands of streamlines run left to right. They part around the title glyphs (a blurred
// distance field) and around the visitor's pointer (exact potential flow past a cylinder).
// One rAF loop, paused off-screen, in background tabs and by the site-wide motion switch.
import {canAnimate,isMotionPaused,onMotionChange} from './motion-state.js';

const LANES=['#3d5cff','#3d5cff','#e7ebf2','#ff5c9a','#3d5cff','#7a5cff','#ffd23f','#e7ebf2','#3d5cff','#ff6b3d','#35d49a','#ff5c9a'];
const CELL=4,TAIL=44,EVERY=3;

function boxBlur(src,w,h,r){
  const tmp=new Float32Array(src.length),out=new Float32Array(src.length),d=2*r+1;
  for(let y=0;y<h;y++){let acc=0;const row=y*w;
    for(let x=-r;x<=r;x++)acc+=src[row+Math.min(w-1,Math.max(0,x))];
    for(let x=0;x<w;x++){tmp[row+x]=acc/d;acc+=src[row+Math.min(w-1,x+r+1)]-src[row+Math.max(0,x-r)];}}
  for(let x=0;x<w;x++){let acc=0;
    for(let y=-r;y<=r;y++)acc+=tmp[Math.min(h-1,Math.max(0,y))*w+x];
    for(let y=0;y<h;y++){out[y*w+x]=acc/d;acc+=tmp[Math.min(h-1,y+r+1)*w+x]-tmp[Math.max(0,y-r)*w+x];}}
  return out;
}

export function mountCurrentField(root,{glyphs,background='#0b0d26'}={}){
  const canvas=root.querySelector('canvas');
  const ctx=canvas?.getContext('2d',{alpha:false});
  if(!ctx)return {destroy(){}};
  let W=0,H=0,dpr=1,gw=0,gh=0,mask,phi,gx,gy,particles=[],raf=0,visible=true,disposed=false,last=0,frame=0;
  const pointer={x:-9999,y:-9999,tx:-9999,ty:-9999,r:0,tr:0,inside:false};
  let flow=1,flowTarget=1;

  function buildField(){
    gw=Math.ceil(W/CELL);gh=Math.ceil(H/CELL);
    const off=document.createElement('canvas');off.width=gw;off.height=gh;
    const o=off.getContext('2d',{willReadFrequently:true});
    o.fillStyle='#fff';o.textAlign='center';o.textBaseline='middle';
    const host=root.getBoundingClientRect();
    for(const g of glyphs?.()||[]){
      o.font=`${g.weight||900} ${g.size/CELL}px ${g.family}`;
      o.fillText(g.char,(g.x-host.left)/CELL,(g.y-host.top)/CELL+(g.dy||0)/CELL);
    }
    const data=o.getImageData(0,0,gw,gh).data;
    mask=new Float32Array(gw*gh);
    for(let i=0;i<mask.length;i++)mask[i]=data[i*4+3]/255;
    // Two passes approximate a gaussian: a soft shoulder the current can read from afar.
    // A broad, faint shoulder bends the current early; a tight near-field makes it hug each stroke.
    const near=boxBlur(boxBlur(mask,gw,gh,3),gw,gh,2),far=boxBlur(boxBlur(mask,gw,gh,14),gw,gh,10);
    phi=new Float32Array(mask.length);
    for(let i=0;i<phi.length;i++)phi[i]=Math.min(1,near[i]*.85+far[i]*.9+mask[i]*.5);
    gx=new Float32Array(gw*gh);gy=new Float32Array(gw*gh);
    for(let y=1;y<gh-1;y++)for(let x=1;x<gw-1;x++){const i=y*gw+x;gx[i]=(phi[i+1]-phi[i-1])*.5;gy[i]=(phi[i+gw]-phi[i-gw])*.5;}
  }
  function laneColor(y){const n=y/H*LANES.length*.72+Math.sin(y*.0042+1.3)*.85+(Math.random()-.5)*.5;return ((Math.floor(n)%LANES.length)+LANES.length)%LANES.length;}
  function blocked(x,y){const cx=x/CELL|0,cy=y/CELL|0;if(cx<0||cy<0||cx>=gw||cy>=gh)return false;return mask[cy*gw+cx]>.35;}
  function spawn(p,edge){
    for(let tries=0;tries<12;tries++){
      p.x=edge?-Math.random()*60:Math.random()*W;p.y=Math.random()*H;
      if(!blocked(p.x,p.y))break;
    }
    p.h||(p.h=new Float32Array(TAIL*2));p.n=0;p.k=0;p.tick=(Math.random()*EVERY)|0;
    p.y0=p.y;p.life=240+Math.random()*560;p.c=laneColor(p.y);p.v=.75+Math.random()*.6;
  }
  function record(p){p.h[p.k*2]=p.x;p.h[p.k*2+1]=p.y;p.k=(p.k+1)%TAIL;if(p.n<TAIL)p.n++;}
  function seed(){
    const count=Math.min(1700,Math.round(W*H/760));
    particles=Array.from({length:count},()=>{const p={};spawn(p,false);return p;});
  }
  function resize(){
    const r=root.getBoundingClientRect();
    W=Math.max(1,Math.round(r.width));H=Math.max(1,Math.round(r.height));
    dpr=Math.min(1.75,devicePixelRatio||1);
    canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);
    canvas.style.width=W+'px';canvas.style.height=H+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
    ctx.fillStyle=background;ctx.fillRect(0,0,W,H);
    buildField();seed();
  }
  function step(dt){
    const t=performance.now();
    flow+=(flowTarget-flow)*.06;flowTarget+=(1-flowTarget)*.04;
    pointer.x+=(pointer.tx-pointer.x)*.18;pointer.y+=(pointer.ty-pointer.y)*.18;pointer.r+=(pointer.tr-pointer.r)*.12;
    const R=pointer.r,R2=R*R,reach=R2*30;
    for(const p of particles){
      if(++p.tick>=EVERY){p.tick=0;record(p);}
      const U=1.3*p.v*flow;
      let ux=U,uy=U*.22*Math.sin(p.y*.0055+t*.00035+p.x*.0021)+U*.08*Math.sin(p.x*.011-t*.0007);
      const cx=p.x/CELL|0,cy=p.y/CELL|0;
      let ph=0;
      if(cx>0&&cy>0&&cx<gw-1&&cy<gh-1){
        const i=cy*gw+cx;ph=phi[i];
        if(ph>.002){
          const nx0=gx[i],ny0=gy[i],l=Math.hypot(nx0,ny0)+1e-6,nx=nx0/l,ny=ny0/l,dot=ux*nx+uy*ny,k=Math.min(1,ph*3.4);
          if(dot>0){ux-=dot*nx*k;uy-=dot*ny*k;}
          ux-=nx*ph*U*.32;uy-=ny*ph*U*.32;
          const boost=1+ph*1.6;ux*=boost;uy*=boost;
        }
      }
      // Streamlines close again behind a body: each particle drifts back toward its own lane.
      uy+=(p.y0-p.y)*.014*U*(1-Math.min(1,ph*2.2));
      if(R>2){
        const dx=p.x-pointer.x,dy=p.y-pointer.y,r2=dx*dx+dy*dy;
        if(r2<reach){
          if(r2<R2){const r=Math.sqrt(r2)+1e-3;ux+=dx/r*U*2.2;uy+=dy/r*U*2.2;}
          else{const r4=r2*r2;ux+=U*(-R2*(dx*dx-dy*dy)/r4);uy+=U*(-2*R2*dx*dy/r4);}
        }
      }
      p.x+=ux*dt;p.y+=uy*dt;p.life-=dt;
      if(p.x>W+8||p.y<-12||p.y>H+12||p.life<=0||blocked(p.x,p.y))spawn(p,p.life>0&&Math.random()<.7);
    }
  }
  // Each streamline is redrawn from its own short history: crisp, tapered, no residue.
  const TIERS=[[0,.3,.06],[.3,.62,.2],[.62,1,.6]];
  function draw(){
    ctx.globalAlpha=1;ctx.fillStyle=background;ctx.fillRect(0,0,W,H);
    ctx.lineWidth=1.1;ctx.lineCap='round';ctx.lineJoin='round';
    for(const [a,b,alpha] of TIERS){
      ctx.globalAlpha=alpha;
      for(let c=0;c<LANES.length;c++){
        ctx.strokeStyle=LANES[c];ctx.beginPath();
        for(const p of particles){
          if(p.c!==c||p.n<2)continue;
          const n=p.n,from=Math.floor(a*(n-1)),to=b===1?n:Math.ceil(b*(n-1));
          const start=(p.k-n+TAIL)%TAIL;
          let i=(start+from)%TAIL;ctx.moveTo(p.h[i*2],p.h[i*2+1]);
          for(let j=from+1;j<to;j++){i=(start+j)%TAIL;ctx.lineTo(p.h[i*2],p.h[i*2+1]);}
          if(b===1)ctx.lineTo(p.x,p.y);
        }
        ctx.stroke();
      }
    }
    ctx.globalAlpha=1;
  }
  function still(){
    // Paused or reduced-motion viewing holds one frame of the same flow.
    for(let i=0;i<160;i++)step(1);
    draw();
  }
  function loop(time){
    raf=0;if(disposed||!visible||!canAnimate()){last=0;return;}
    const dt=last?Math.min(2.4,(time-last)/16.67):1;last=time;frame++;
    step(dt);draw();
    raf=requestAnimationFrame(loop);
  }
  const start=()=>{if(!raf&&!disposed&&visible&&canAnimate())raf=requestAnimationFrame(loop);};
  const stop=()=>{cancelAnimationFrame(raf);raf=0;last=0;};

  const move=e=>{const r=root.getBoundingClientRect();pointer.tx=e.clientX-r.left;pointer.ty=e.clientY-r.top;if(!pointer.inside){pointer.x=pointer.tx;pointer.y=pointer.ty;}pointer.inside=true;if(!pointer.down)pointer.tr=e.pointerType==='touch'?0:58;};
  const leave=()=>{pointer.inside=false;pointer.tr=0;};
  const down=e=>{pointer.down=true;move(e);pointer.tr=118;flowTarget=2.4;};
  const up=e=>{pointer.down=false;pointer.tr=e.pointerType==='touch'?0:58;};
  root.addEventListener('pointermove',move,{passive:true});
  root.addEventListener('pointerleave',leave);
  root.addEventListener('pointerdown',down,{passive:true});
  window.addEventListener('pointerup',up,{passive:true});
  let lastY=scrollY;
  const onScroll=()=>{const v=Math.abs(scrollY-lastY);lastY=scrollY;flowTarget=Math.min(4.5,flowTarget+v*.012);};
  addEventListener('scroll',onScroll,{passive:true});

  let resizeTimer=0;
  const ro=new ResizeObserver(()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{resize();if(!canAnimate())still();},140);});
  const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;visible?start():stop();},{rootMargin:'60px'});
  const offMotion=onMotionChange(()=>{if(canAnimate())start();else{stop();if(isMotionPaused())still();}});

  resize();
  if(canAnimate()){for(let i=0;i<140;i++)step(1);draw();start();}else still();
  ro.observe(root);io.observe(root);

  return {
    refresh(){resize();if(!canAnimate())still();},
    destroy(){disposed=true;stop();ro.disconnect();io.disconnect();offMotion();
      root.removeEventListener('pointermove',move);root.removeEventListener('pointerleave',leave);root.removeEventListener('pointerdown',down);
      removeEventListener('pointerup',up);removeEventListener('scroll',onScroll);}
  };
}
