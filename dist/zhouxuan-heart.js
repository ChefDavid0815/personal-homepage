// 《周旋》: the crayon-thread heart, held up by taut lines. Canvas 2D, projected by hand.
// Ported from the film's own heart (F:\短片\zhouxuan\app\src\scenes\lib\heart.ts): the implicit heart
// (x² + 9/4·y² + z² − 1)³ − x²z³ − 9/80·y²z³ = 0 (z up), every thread a loop wound round its surface whose
// winding axis precesses along its length, at slightly different depths so the ball has volume.
// The heart beats at the song's 123 BPM; the lines that hold it thrum on the beat, sag when it sways,
// can be plucked by sweeping across them, and a click throws one more thread in to wind around it.
// The title 周旋 is written in crayon in its real stroke order (the film's cold open, 19 strokes).
import {isMotionPaused,onMotionChange} from './motion-state.js';

export const CRAYON=['#e8503f','#ee8240','#f2bd3b','#52c07a','#3e9dcb','#e2659b','#8d6bd8'];
const WEIGHTS=[.2,.2,.13,.09,.16,.14,.08];
const BG=[23,23,27];
export const BEAT=60/123;
const TAU=Math.PI*2;

function mulberry32(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
const dot=(a,b)=>a[0]*b[0]+a[1]*b[1]+a[2]*b[2];
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const norm=a=>{const l=Math.hypot(a[0],a[1],a[2])||1;return[a[0]/l,a[1]/l,a[2]/l];};
function rot(v,k,t){const c=Math.cos(t),s=Math.sin(t),kv=cross(k,v),d=dot(k,v)*(1-c);return[v[0]*c+kv[0]*s+k[0]*d,v[1]*c+kv[1]*s+k[1]*d,v[2]*c+kv[2]*s+k[2]*d];}
// radius of the heart surface along a unit direction (bisection on the implicit function)
function heartR(x,y,z){
  let lo=0,hi=2.2;
  for(let i=0;i<24;i++){const m=(lo+hi)/2,X=x*m,Y=y*m,Z=z*m,a=X*X+2.25*Y*Y+Z*Z-1,f=a*a*a-X*X*Z*Z*Z-.1125*Y*Y*Z*Z*Z;if(f<0)lo=m;else hi=m;}
  return lo;
}
function pickColor(r){let x=r(),i=0;for(;i<WEIGHTS.length-1;i++){x-=WEIGHTS[i];if(x<0)break;}return i;}
function unit(r){const z=r()*2-1,a=r()*TAU,s=Math.sqrt(1-z*z);return[s*Math.cos(a),s*Math.sin(a),z];}

function makeThread(r,turns){
  const b=unit(r);let a=unit(r);while(Math.abs(dot(a,b))>.72)a=unit(r);
  const T=turns??(1.05+r()*1.7),pr=(.3+r()*.8)*(r()<.5?-1:1),depth=.8+r()*.2,n=Math.max(28,Math.round(T*66)),ph=r()*TAU;
  const p=new Float32Array(n*3);
  for(let j=0;j<n;j++){
    const s=j/(n-1)*T,ax=rot(a,b,s*pr*TAU),u=norm(cross(ax,b)),v=cross(ax,u),th=s*TAU+ph,c=Math.cos(th),sn=Math.sin(th);
    const d=[u[0]*c+v[0]*sn,u[1]*c+v[1]*sn,u[2]*c+v[2]*sn];
    const rr=heartR(d[0],d[1],d[2])*depth*(1+(r()-.5)*.018);
    p[j*3]=d[0]*rr;p[j*3+1]=d[1]*rr;p[j*3+2]=d[2]*rr-.12;
  }
  return{p,n,c:pickColor(r),w:.75+r()*.85};
}
// a line that runs through the heart and on past the frame: the heart hangs on these
function makeLine(r,i,count){
  const az=(i/count)*Math.PI+r()*.5,el=(r()-.5)*1.1;
  const D=norm([Math.cos(az)*Math.cos(el),Math.sin(az)*Math.cos(el)*.55,Math.sin(el)+(r()-.5)*.4]);
  const P=[(r()-.5)*.7,(r()-.5)*.5,(r()-.5)*.8];
  const fore=i>=count-2;if(fore){P[1]-=1.5+r()*.6;}
  return{P,D,W:norm(cross(D,unit(r))),A:0,om:11+r()*8,ph:r()*TAU,c:pickColor(r),w:fore?4.2+r()*2.4:1.5+r()*2,fore};
}
// crayon tooth: speckles knocked out of every stroke, fixed to the paper
function toothPattern(ctx){
  const c=document.createElement('canvas');c.width=c.height=96;const g=c.getContext('2d');const d=g.createImageData(96,96);const r=mulberry32(11);
  for(let i=0;i<d.data.length;i+=4){const v=r();d.data[i+3]=v<.2?Math.round(130+r()*110):v<.3?50:0;}
  g.putImageData(d,0,0);return ctx.createPattern(c,'repeat');
}
const hex=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
const SHADES=CRAYON.map(h=>{const c=hex(h);return Array.from({length:8},(_,k)=>{const t=k/7*.5;return`rgb(${c.map((v,j)=>Math.round(v+(BG[j]-v)*t)).join(',')})`;});});
const LIGHT=CRAYON.map(h=>{const c=hex(h);return`rgba(${c.map(v=>Math.round(v+(255-v)*.45)).join(',')},.5)`;});

let titleData=null;
function loadTitle(){titleData??=fetch('./assets/projects/zhouxuan/title-strokes.json').then(r=>r.ok?r.json():null).catch(()=>null);return titleData;}

export function mountHeart(host,opt={}){
  const o={threads:100,lines:15,title:true,interactive:true,seed:7,layout:'stage',...opt};
  const canvas=host.querySelector('canvas');const ctx=canvas.getContext('2d');
  const r=mulberry32(o.seed);
  const threads=Array.from({length:o.threads},()=>makeThread(r));
  const lines=Array.from({length:o.lines},(_,i)=>makeLine(r,i,o.lines));
  const flying=[];
  let W=0,H=0,dpr=1,cx=0,cy=0,R=1,pattern=toothPattern(ctx),raf=0,visible=true,start=performance.now(),last=start;
  let title=null,titleBox=null,titleStart=-1,titleDone=false;
  const ptr={x:.5,y:.5,sx:.5,sy:.5,px:-1,py:-1,on:false};
  const body={ox:0,oz:0,vx:0,vz:0,spin:0};
  let lineScreen=lines.map(()=>[]);
  const CAM=5.2;

  function layout(){
    const b=host.getBoundingClientRect();W=b.width;H=b.height;dpr=Math.min(devicePixelRatio||1,o.layout==='stage'?1.6:2);
    canvas.width=Math.round(W*dpr);canvas.height=Math.round(H*dpr);
    if(o.layout==='stage'){
      const portrait=H>W*.9;
      cx=portrait?W*.52:W*.64;cy=portrait?H*.6:H*.52;R=portrait?Math.min(W*.38,H*.23):Math.min(H*.31,W*.21);
      const tw=portrait?Math.min(W*.62,320):Math.min(W*.34,H*.9,560);titleBox={x:portrait?W*.08:W*.07,y:portrait?H*.1:H*.2,w:tw};
    }else{cx=W*.56;cy=H>W?H*.65:H*.58;R=Math.min(W*.32,H*.26);titleBox=null;}
  }
  layout();
  const ro=new ResizeObserver(()=>{layout();if(!loopOn())draw(stillTime());});ro.observe(host);
  if(o.title)loadTitle().then(d=>{title=d;if(!loopOn()){titleDone=true;draw(stillTime());}});

  const stillTime=()=>3.2;
  const loopOn=()=>visible&&!isMotionPaused()&&!document.hidden;

  // view transform state per frame
  let cy_=1,sy_=0,cp=1,sp=0,scale=1;
  function view(x,y,z,out){
    const x1=x*cy_-y*sy_,y1=x*sy_+y*cy_;const y2=y1*cp-z*sp,z2=y1*sp+z*cp;
    out[0]=x1*scale;out[1]=y2*scale;out[2]=z2*scale;
  }
  const tmp=[0,0,0];
  function project(v,out){const f=CAM/(CAM+v[1]);out[0]=cx+v[0]*f*R;out[1]=cy-v[2]*f*R;out[2]=f;return f;}

  function launch(sx,sy){
    const t=makeThread(r,1.3+r()*1.1);
    // the leader flies in from beyond the click point, in the heart's own frame
    const vx=(sx-cx)/R,vz=(cy-sy)/R,l=Math.hypot(vx,vz)||1;
    const S=[vx+vx/l*3.4,-1.4,vz+vz/l*3.4];
    // inverse of the view rotation
    const y1=S[1]*cp+S[2]*sp,z1=-S[1]*sp+S[2]*cp;const x=S[0]*cy_+y1*sy_,y=-S[0]*sy_+y1*cy_;
    flying.push({...t,S:[x/scale,y/scale,z1/scale],born:performance.now()});
    if(flying.length>28)flying.shift();
    body.spin+=.6;
  }

  function strokePath(pts,n,upto){
    ctx.beginPath();const k=Math.min(n,upto);
    for(let j=0;j<k;j++){const x=pts[j*2],y=pts[j*2+1];if(j)ctx.lineTo(x,y);else ctx.moveTo(x,y);}
  }
  const scr=new Float32Array(2048);
  function drawThread(t,now,reveal=1){
    let dsum=0;const n=t.n,k=Math.max(2,Math.floor(n*reveal));
    for(let j=0;j<k;j++){view(t.p[j*3],t.p[j*3+1],t.p[j*3+2],tmp);tmp[0]+=body.ox;tmp[2]+=body.oz;dsum+=tmp[1];const f=project(tmp,tmp);scr[j*2]=tmp[0];scr[j*2+1]=tmp[1];}
    return dsum/k;
  }

  function draw(time){
    const now=time;
    // pose: slow turntable, pointer parallax, beat
    ptr.sx+=(ptr.x-ptr.sx)*.06;ptr.sy+=(ptr.y-ptr.sy)*.06;
    const yaw=Math.sin(now*.21)*.62+body.spin+(ptr.sx-.5)*.7,pitch=.1+(ptr.sy-.5)*.28;
    cy_=Math.cos(yaw);sy_=Math.sin(yaw);cp=Math.cos(pitch);sp=Math.sin(pitch);
    const ph=(now%BEAT)/BEAT;const pulse=Math.exp(-ph*9)+.55*(ph>.2?Math.exp(-(ph-.2)*11):0);
    scale=1+.03*pulse;
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,W,H);ctx.lineCap='round';ctx.lineJoin='round';
    const px=R/300;

    // lines: sampled, displaced by their vibration and by the heart's sway (ends stay fixed)
    const back=[],front=[];lineScreen=[];
    lines.forEach((L,i)=>{
      const N=40,Lh=6.5;let prev=null,run=null;const scr2=[];
      for(let j=0;j<=N;j++){
        const u=-Lh+j/N*2*Lh,a=Math.abs(u)/Lh,vib=L.A*Math.sin(Math.PI*a)*Math.cos(L.om*now+L.ph)+.012*Math.sin(Math.PI*a)*Math.sin(now*1.3+i);
        const x=L.P[0]+L.D[0]*u+L.W[0]*vib,y=L.P[1]+L.D[1]*u+L.W[1]*vib,z=L.P[2]+L.D[2]*u+L.W[2]*vib;
        view(x,y,z,tmp);const tie=1-a;tmp[0]+=body.ox*tie;tmp[2]+=body.oz*tie;
        const depth=tmp[1];if(CAM+depth<.9){prev=null;run=null;scr2.push(null);continue;}
        project(tmp,tmp);const pt=[tmp[0],tmp[1],depth];scr2.push(pt);
        if(prev){const side=(prev[2]+depth)/2>0?back:front;if(run&&run.side===side)run.pts.push(pt);else{run={side,pts:[prev,pt],L};side.push(run);}}
        prev=pt;
      }
      lineScreen.push(scr2);
    });
    // each visible run of a line is one stroke, so translucent foreground lines don't bead at the joints
    const drawLineSegs=(list)=>{
      for(const {L,pts} of list){
        let d=0;for(const q of pts)d+=q[2];d/=pts.length;
        const f=CAM/(CAM+d),lvl=Math.max(0,Math.min(7,Math.round((d+1.6)/3.2*7)));
        ctx.strokeStyle=SHADES[L.c][L.fore?0:lvl];ctx.lineWidth=Math.max(.8,L.w*px*f);ctx.globalAlpha=L.fore?.5:1;
        ctx.beginPath();pts.forEach((q,j)=>j?ctx.lineTo(q[0],q[1]):ctx.moveTo(q[0],q[1]));ctx.stroke();
      }
      ctx.globalAlpha=1;
    };
    drawLineSegs(back);

    // threads back to front
    const order=[];
    for(let i=0;i<threads.length;i++){const t=threads[i];let d=0;const st=Math.max(1,t.n>>3);for(let j=0;j<t.n;j+=st){view(t.p[j*3],t.p[j*3+1],t.p[j*3+2],tmp);d+=tmp[1];}order.push([d/Math.ceil(t.n/st),i]);}
    order.sort((a,b)=>b[0]-a[0]);
    for(const [d,i] of order){
      const t=threads[i];drawThread(t,now);const lvl=Math.max(0,Math.min(7,Math.round((d+1.1)/2.2*7)));
      ctx.strokeStyle=SHADES[t.c][lvl];ctx.lineWidth=Math.max(.9,t.w*px*2.7*(1.1-lvl*.05));
      strokePath(scr,t.n,t.n);ctx.stroke();
      if(lvl<3){ctx.strokeStyle=LIGHT[t.c];ctx.lineWidth=Math.max(.4,t.w*px*.6);ctx.translate(-.5*px,-.6*px);ctx.stroke();ctx.setTransform(dpr,0,0,dpr,0,0);}
    }
    // threads thrown in by clicks: a leader flies in, winds round, then the leader is drawn back
    const tnow=performance.now();
    for(const f of flying){
      const age=(tnow-f.born)/1000,wind=Math.min(1,Math.max(0,(age-.35)/1.5)),lead=age<.35?age/.35:1,retract=Math.min(1,Math.max(0,(age-1.7)/.6));
      if(wind>0){drawThread(f,now,wind);ctx.strokeStyle=SHADES[f.c][1];ctx.lineWidth=Math.max(.8,f.w*px*2);strokePath(scr,f.n,Math.max(2,Math.floor(f.n*wind)));ctx.stroke();}
      if(retract<1){
        view(f.S[0],f.S[1],f.S[2],tmp);tmp[0]+=body.ox;tmp[2]+=body.oz;if(CAM+tmp[1]>.9){project(tmp,tmp);const sx=tmp[0],sy=tmp[1];
        view(f.p[0],f.p[1],f.p[2],tmp);tmp[0]+=body.ox;tmp[2]+=body.oz;project(tmp,tmp);
        const ex=sx+(tmp[0]-sx)*lead,ey=sy+(tmp[1]-sy)*lead,bx=sx+(tmp[0]-sx)*retract,by=sy+(tmp[1]-sy)*retract;
        ctx.strokeStyle=SHADES[f.c][0];ctx.lineWidth=Math.max(1,f.w*px*2.4);ctx.beginPath();ctx.moveTo(bx,by);ctx.lineTo(ex,ey);ctx.stroke();}
      }
    }
    drawLineSegs(front);

    // the title, written in crayon in stroke order; then its last stroke throws a line to the heart
    if(title&&titleBox){
      if(titleStart<0&&!titleDone)titleStart=now;
      const tt=titleDone?99:(now-titleStart)*1.15;const k=titleBox.w/title.w;
      title.strokes.forEach((s,i)=>{
        const p=Math.min(1,Math.max(0,(tt-s.t0)/Math.max(.05,s.t1-s.t0)));if(p<=0)return;
        const n=s.p.length/2,m=Math.max(2,Math.ceil(n*p));
        ctx.strokeStyle=CRAYON[(i*3)%7];ctx.lineWidth=Math.max(2.6,12*k);
        ctx.beginPath();for(let j=0;j<m;j++){const x=titleBox.x+s.p[j*2]*k,y=titleBox.y+s.p[j*2+1]*k;if(j)ctx.lineTo(x,y);else ctx.moveTo(x,y);}ctx.stroke();
        if(p<1){const x=titleBox.x+s.p[(m-1)*2]*k,y=titleBox.y+s.p[(m-1)*2+1]*k;ctx.fillStyle='#fff6e6';ctx.beginPath();ctx.arc(x,y,Math.max(2,5*k),0,TAU);ctx.fill();}
      });
      const end=title.strokes.at(-1),T=end.t1;
      if(tt>T){
        const q=Math.min(1,(tt-T)/1.3),e=1-Math.pow(1-q,3);
        const n=end.p.length/2,ex=titleBox.x+end.p[(n-1)*2]*k,ey=titleBox.y+end.p[(n-1)*2+1]*k;
        view(-.55,0,.35,tmp);tmp[0]+=body.ox;tmp[2]+=body.oz;project(tmp,tmp);
        const hx=ex+(tmp[0]-ex)*e,hy=ey+(tmp[1]-ey)*e,mx=(ex+hx)/2,my=Math.max(ey,hy)+Math.abs(hx-ex)*.12*(1+.4*Math.sin(now*1.7));
        ctx.strokeStyle=CRAYON[(18*3)%7];ctx.lineWidth=Math.max(1.4,4*k);ctx.beginPath();ctx.moveTo(ex,ey);ctx.quadraticCurveTo(mx,my,hx,hy);ctx.stroke();
        if(q>=1)titleDone=true;
      }
      host.style.setProperty('--title-progress',Math.min(1,tt/(T+1.3)).toFixed(3));
    }

    // crayon tooth
    ctx.globalCompositeOperation='destination-out';ctx.globalAlpha=.38;ctx.fillStyle=pattern;ctx.fillRect(0,0,W,H);
    ctx.globalAlpha=1;ctx.globalCompositeOperation='source-over';
    host.style.setProperty('--beat',pulse.toFixed(3));
  }

  function step(t){
    raf=0;if(!loopOn())return;
    const now=(t-start)/1000,dt=Math.min(.05,(t-last)/1000);last=t;
    // the suspended heart: spring back to rest; the lines decay; every beat kicks them a little
    body.vx+=(-34*body.ox-4.2*body.vx)*dt;body.vz+=(-34*body.oz-4.2*body.vz)*dt;body.ox+=body.vx*dt;body.oz+=body.vz*dt;
    body.spin*=Math.pow(.25,dt);
    const beatNow=Math.floor(now/BEAT);
    if(beatNow!==step.b){step.b=beatNow;lines.forEach(L=>{L.A=Math.min(.22,L.A+.014);});body.vz+=.035;}
    lines.forEach(L=>{L.A*=Math.exp(-2.4*dt);});
    draw(now);
    raf=requestAnimationFrame(step);
  }
  const kick=()=>{if(!raf&&loopOn()){last=performance.now();raf=requestAnimationFrame(step);}};

  // pluck: sweeping the pointer across a line sets it ringing and nudges the heart
  function cross2(ax,ay,bx,by,cx2,cy2,dx,dy){const d=(bx-ax)*(dy-cy2)-(by-ay)*(dx-cx2);if(!d)return false;const u=((cx2-ax)*(dy-cy2)-(cy2-ay)*(dx-cx2))/d,v=((cx2-ax)*(by-ay)-(cy2-ay)*(bx-ax))/d;return u>=0&&u<=1&&v>=0&&v<=1;}
  function onMove(e){
    const b=host.getBoundingClientRect();const x=e.clientX-b.left,y=e.clientY-b.top;
    ptr.x=x/b.width;ptr.y=y/b.height;
    if(ptr.px>=0&&!isMotionPaused()){
      const sp2=Math.hypot(x-ptr.px,y-ptr.py);
      lineScreen.forEach((pts,i)=>{for(let j=1;j<pts.length;j++){const a=pts[j-1],c=pts[j];if(!a||!c)continue;
        if(cross2(ptr.px,ptr.py,x,y,a[0],a[1],c[0],c[1])){const L=lines[i];L.A=Math.min(.32,L.A+Math.min(.2,.03+sp2*.004));body.vx+=(x-ptr.px)/R*.9;body.vz-=(y-ptr.py)/R*.9;break;}}});
    }
    ptr.px=x;ptr.py=y;
  }
  const onLeave=()=>{ptr.x=.5;ptr.y=.5;ptr.px=-1;};
  const onClick=e=>{if(isMotionPaused())return;if(e.target.closest('a,button'))return;const b=host.getBoundingClientRect();launch(e.clientX-b.left,e.clientY-b.top);kick();};
  if(o.interactive){host.addEventListener('pointermove',onMove);host.addEventListener('pointerleave',onLeave);host.addEventListener('click',onClick);}

  const io=new IntersectionObserver(es=>{visible=es.some(e=>e.isIntersecting);if(visible)kick();},{threshold:.05});io.observe(host);
  const offMotion=onMotionChange(()=>{if(isMotionPaused()){titleDone=true;draw(stillTime());host.dataset.stage='still';}else{host.dataset.stage='live';kick();}});
  const onVis=()=>{if(!document.hidden)kick();};document.addEventListener('visibilitychange',onVis);
  if(isMotionPaused()){titleDone=true;host.dataset.stage='still';draw(stillTime());}else{host.dataset.stage='live';kick();}

  return{
    pluckAll(amount=.12){lines.forEach(L=>{L.A=Math.min(.3,L.A+amount);});body.vz+=.2;kick();},
    destroy(){cancelAnimationFrame(raf);raf=0;ro.disconnect();io.disconnect();document.removeEventListener('visibilitychange',onVis);if(typeof offMotion==='function')offMotion();
      host.removeEventListener('pointermove',onMove);host.removeEventListener('pointerleave',onLeave);host.removeEventListener('click',onClick);}
  };
}
