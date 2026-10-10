// NBA After Hours: shoot around after hours. Click the court (or press the button) and a ball
// arcs toward the rim with simple projectile physics: swish, rim-out or a bank off the glass.
// With motion off the shot resolves instantly and only the board updates.
import {getLanguage} from './i18n.js';
import {isMotionPaused} from './motion-state.js';

const en=()=>getLanguage()==='en';
function mount(room){
  if(room.dataset.shoot)return;room.dataset.shoot='on';
  const canvas=document.createElement('canvas');canvas.className='nba-court-fx';canvas.setAttribute('aria-hidden','true');room.prepend(canvas);
  const board=document.createElement('div');board.className='nba-shoot';
  board.innerHTML=`<p aria-live="polite"><b data-made>0</b><span>/</span><b data-taken>0</b><small></small></p><button type="button"></button>`;
  room.append(board);
  const made=board.querySelector('[data-made]'),taken=board.querySelector('[data-taken]'),small=board.querySelector('small'),button=board.querySelector('button');
  const label=()=>{small.textContent=en()?'makes / shots':'命中 / 出手';button.textContent=en()?'Take a shot':'投一球';room.dataset.shootHint=en()?'Tap the court to shoot':'点一下球场，投一球';};label();
  const ctx=canvas.getContext('2d');let w=0,h=0,dpr=1,raf=0,last=0;const balls=[];let nMade=0,nTaken=0;
  const size=()=>{const b=room.getBoundingClientRect();w=b.width;h=b.height;dpr=Math.min(devicePixelRatio||1,2);canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);draw(0);};
  new ResizeObserver(size).observe(room);
  const rim=()=>({x:w*(w<700?.78:.86),y:h*(w<700?.84:.7),r:w<700?17:24});
  function shoot(x0,y0){
    nTaken++;taken.textContent=nTaken;
    const R=rim(),make=Math.random()<.58,err=make?0:(Math.random()<.5?-1:1)*(.05+Math.random()*.06);
    if(isMotionPaused()){if(make){nMade++;made.textContent=nMade;}return;}
    const dist=Math.hypot(R.x-x0,R.y-y0),T=Math.max(34,38+dist/22),g=.42;
    balls.push({x:x0,y:y0,vx:(R.x-x0)/T*(1+err),vy:(R.y-y0-.5*g*T*T)/T,g,a:0,life:0,scored:false,passed:false,make});
    if(balls.length>5)balls.shift();if(!raf)raf=requestAnimationFrame(tick);
  }
  function step(b,k){
    const R=rim(),br=w<700?8:11,py=b.y;
    b.vy+=b.g*k;b.x+=b.vx*k;b.y+=b.vy*k;b.a+=b.vx*.04*k;b.life+=k;
    // backboard
    const bx=R.x+R.r+8;if(b.x+br>bx&&b.x<bx+6&&b.y>R.y-70&&b.y<R.y+6){b.x=bx-br;b.vx*=-.55;}
    // rim: crossing the rim plane while falling
    if(!b.passed&&py<R.y&&b.y>=R.y&&b.vy>0){
      const dx=b.x-R.x;
      if(Math.abs(dx)<R.r-br*.55){b.passed=true;b.vx*=.35;b.vy*=.55;if(!b.scored){b.scored=true;nMade++;made.textContent=nMade;b.swish=1;}}
      else if(Math.abs(dx)<R.r+br){b.vy*=-.48;b.vx=(dx>0?1:-1)*Math.abs(b.vx)*.6+(dx>0?1.2:-1.2);b.y=R.y-1;}
    }
    // floor
    const floor=h-18;if(b.y>floor){b.y=floor;b.vy*=-.52;b.vx*=.8;if(Math.abs(b.vy)<1.2)b.vy=0;}
  }
  function drawBall(b){
    const br=w<700?8:11;ctx.save();ctx.translate(b.x,b.y);ctx.rotate(b.a);ctx.globalAlpha=Math.max(0,Math.min(1,(200-b.life)/40));
    ctx.fillStyle='#e7782f';ctx.beginPath();ctx.arc(0,0,br,0,6.283);ctx.fill();
    ctx.strokeStyle='#3a1d0c';ctx.lineWidth=1.2;ctx.beginPath();ctx.moveTo(-br,0);ctx.lineTo(br,0);ctx.moveTo(0,-br);ctx.lineTo(0,br);ctx.stroke();
    ctx.beginPath();ctx.arc(-br*1.25,0,br*.95,-.9,.9);ctx.stroke();ctx.beginPath();ctx.arc(br*1.25,0,br*.95,Math.PI-.9,Math.PI+.9);ctx.stroke();ctx.restore();
  }
  function draw(dt){
    ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);if(!w)return;
    const R=rim(),k=dt/16;
    // backboard + rim + net
    ctx.fillStyle='rgba(233,240,255,.08)';ctx.strokeStyle='rgba(233,240,255,.55)';ctx.lineWidth=1.5;
    ctx.beginPath();ctx.rect(R.x+R.r+8,R.y-74,6,84);ctx.fill();ctx.stroke();
    ctx.strokeStyle='rgba(233,240,255,.35)';ctx.lineWidth=1;
    for(let i=0;i<=6;i++){const t=i/6,x=R.x-R.r+t*2*R.r;ctx.beginPath();ctx.moveTo(x,R.y);ctx.lineTo(R.x-R.r*.55+t*1.1*R.r,R.y+R.r*1.5);ctx.stroke();}
    balls.forEach(b=>{if(dt)step(b,k);if(b.y>R.y)drawBall(b);});
    ctx.strokeStyle='#ff6b2e';ctx.lineWidth=3;ctx.beginPath();ctx.ellipse(R.x,R.y,R.r,R.r*.28,0,0,6.283);ctx.stroke();
    balls.forEach(b=>{if(b.y<=R.y)drawBall(b);if(b.swish){ctx.strokeStyle=`rgba(212,255,72,${b.swish})`;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(R.x,R.y,R.r*(2.4-b.swish),R.r*.6*(2.4-b.swish),0,0,6.283);ctx.stroke();b.swish=Math.max(0,b.swish-.03*k);}});
    for(let i=balls.length-1;i>=0;i--)if(balls[i].life>200)balls.splice(i,1);
  }
  function tick(t){raf=0;const dt=last?Math.min(40,t-last):16;last=t;draw(dt);if(balls.length)raf=requestAnimationFrame(tick);else last=0;}
  room.addEventListener('click',e=>{
    if(e.target.closest('a,button,figure,input,summary,details,[role=dialog]'))return;
    const b=canvas.getBoundingClientRect();shoot(e.clientX-b.left,e.clientY-b.top);
  });
  button.addEventListener('click',()=>shoot(w*.62,h*.9));
  size();
}
const scan=()=>document.querySelectorAll('#project-nba-after-hours').forEach(mount);
let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;scan();});}).observe(document.documentElement,{childList:true,subtree:true});
requestAnimationFrame(scan);
