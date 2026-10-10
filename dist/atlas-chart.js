// Atlas: the real Diploma constellation (7 groups, 33 subjects, 241 topics, 20 relations from Atlas 0.3),
// charted like an engraved star map. Hover or focus a subject to light its topics. Ledger figures count up.
import {getLanguage} from './i18n.js';
import {isMotionPaused,onMotionChange} from './motion-state.js';
import {atlasGroups,atlasSubjects,atlasRelations} from './atlas-sky-data.js';

const TAU=Math.PI*2;
const hash=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v);};

function layout(){
  // groups on an ellipse around the core; subjects fanned toward their group; topics as dust around subjects
  const ring=[0,1,2,3,4,5].map(i=>-Math.PI/2+i*TAU/6+.18);
  const groups=atlasGroups.map((g,i)=>i===6?{x:0,y:0,g:i}:{x:Math.cos(ring[i])*.62,y:Math.sin(ring[i])*.62,g:i,a:ring[i]});
  const byGroup={};atlasSubjects.forEach((s,i)=>(byGroup[s[2]]??=[]).push(i));
  const subjects=[];
  for(const [gid,list] of Object.entries(byGroup)){
    const G=groups[gid];
    list.forEach((si,k)=>{
      const n=list.length,spread=gid==='6'?TAU:1.05,base=gid==='6'?-Math.PI/2:G.a,
        a=base+(n===1?0:(k/(n-(gid==='6'?0:1))-.5)*spread)+(gid==='6'?.4:0),r=gid==='6'?.2:.2+hash(si)*.07;
      subjects[si]={x:G.x+Math.cos(a)*r,y:G.y+Math.sin(a)*r,g:+gid,s:si};
    });
  }
  const topics=[];
  atlasSubjects.forEach((s,si)=>{const S=subjects[si];for(let t=0;t<s[3];t++){const a=hash(si*97+t)*TAU,r=.025+Math.sqrt(hash(si*31+t*7))*(.035+Math.min(.06,s[3]*.0016));topics.push({x:S.x+Math.cos(a)*r,y:S.y+Math.sin(a)*r,s:si,t,tw:hash(t*13+si)*TAU});}});
  const topicAt=(si,ti)=>topics.find(p=>p.s===si&&p.t===ti);
  const relations=atlasRelations.map(([a,b,c,d])=>[topicAt(a,b),topicAt(c,d)]).filter(([p,q])=>p&&q);
  return {groups,subjects,topics,relations};
}
const MAP=layout();

const charts=new Map();
function mount(plate){
  if(charts.has(plate))return;
  const canvas=document.createElement('canvas');canvas.className='atlas-chart';canvas.setAttribute('aria-hidden','true');
  plate.querySelector('.atlas-v2-network')?.remove();
  plate.querySelector('.atlas-v2-sky-title')?.before(canvas);
  const legend=document.createElement('p');legend.className='atlas-chart-legend';plate.append(legend);
  const c={plate,canvas,legend,ctx:canvas.getContext('2d'),w:0,h:0,dpr:1,hover:-1,born:0,visible:false,raf:0,px:0,py:0,tx:0,ty:0,glow:new Float32Array(MAP.subjects.length)};
  charts.set(plate,c);
  c.ro=new ResizeObserver(()=>{size(c);draw(c,performance.now());});c.ro.observe(plate);
  plate.addEventListener('pointermove',e=>{const b=canvas.getBoundingClientRect(),x=e.clientX-b.left,y=e.clientY-b.top;c.tx=(x/b.width-.5);c.ty=(y/b.height-.5);c.hover=nearest(c,x,y);wake(c);},{passive:true});
  plate.addEventListener('pointerleave',()=>{c.hover=-1;c.tx=c.ty=0;wake(c);});
  io.observe(plate);legendText(c);
}
function size(c){const b=c.plate.getBoundingClientRect();c.w=b.width;c.h=b.height;c.dpr=Math.min(devicePixelRatio||1,2);c.canvas.width=Math.round(c.w*c.dpr);c.canvas.height=Math.round(c.h*c.dpr);}
function frame(c){
  // chart sits right of the title; on narrow plates it fills the upper area
  const narrow=c.w<640,R=narrow?Math.min(c.w*.4,c.h*.3):Math.min(c.w*.25,c.h*.37);
  return {cx:narrow?c.w*.5:c.w*.6,cy:narrow?c.h*.36:c.h*.42,R};
}
const project=(c,p,f,depth=1)=>[f.cx+p.x*f.R*1.25+c.px*18*depth,f.cy+p.y*f.R+c.py*12*depth];
function nearest(c,x,y){const f=frame(c);let best=-1,d0=30*30;MAP.subjects.forEach((s,i)=>{const [sx,sy]=project(c,s,f,.6),d=(sx-x)**2+(sy-y)**2;if(d<d0){d0=d;best=i;}});return best;}
function legendText(c){
  const en=getLanguage()==='en',s=atlasSubjects[c.hover],g=s&&atlasGroups[s[2]];
  c.legend.textContent=s?(en?`${g[0]} · ${s[1]} — ${s[3]} topics`:`${g[0]} · ${s[0]}：${s[3]} 个主题`):(en?'33 subjects and 241 topics from the Atlas 0.3 catalogue. Point at a star.':'Atlas 0.3 目录里的 33 门学科、241 个主题。指向一颗星。');
}
function draw(c,now){
  const {ctx,w,h,dpr}=c;if(!w)return false;
  ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
  const still=isMotionPaused(),f=frame(c),born=still||!c.born?1:Math.min(1,(now-c.born)/2600);
  if(!still){c.px+=(c.tx-c.px)*.08;c.py+=(c.ty-c.py)*.08;}else{c.px=c.py=0;}
  let busy=!still&&(born<1||Math.abs(c.tx-c.px)+Math.abs(c.ty-c.py)>.002);
  MAP.subjects.forEach((s,i)=>{const target=i===c.hover?1:0;c.glow[i]+=(target-c.glow[i])*(still?1:.14);if(Math.abs(target-c.glow[i])>.01)busy=true;});
  const reveal=(i,n)=>Math.min(1,Math.max(0,born*1.6-i/n*.6));
  // engraved rings
  ctx.strokeStyle='rgba(217,181,108,.22)';ctx.lineWidth=1;
  for(const k of [.62,.88]){ctx.beginPath();ctx.ellipse(f.cx+c.px*10,f.cy+c.py*7,f.R*1.25*k,f.R*k,0,0,TAU*born);ctx.stroke();}
  // subject → group spokes
  MAP.subjects.forEach((s,i)=>{const r=reveal(i,33);if(!r)return;const [x1,y1]=project(c,MAP.groups[s.g],f,.4),[x2,y2]=project(c,s,f,.6);
    ctx.strokeStyle=`rgba(232,201,154,${(.28+.5*c.glow[i])*r})`;ctx.lineWidth=.8+c.glow[i];ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x1+(x2-x1)*r,y1+(y2-y1)*r);ctx.stroke();});
  // cross-topic relations, dashed gold
  ctx.setLineDash([3,4]);
  MAP.relations.forEach(([p,q],i)=>{const r=reveal(i+10,30);if(!r)return;const [x1,y1]=project(c,p,f,.9),[x2,y2]=project(c,q,f,.9),lit=Math.max(c.glow[p.s],c.glow[q.s]);
    ctx.strokeStyle=`rgba(255,214,140,${(.35+.55*lit)*r})`;ctx.lineWidth=.9;ctx.beginPath();ctx.moveTo(x1,y1);ctx.quadraticCurveTo((x1+x2)/2+(y2-y1)*.18,(y1+y2)/2-(x2-x1)*.18,x2,y2);ctx.stroke();});
  ctx.setLineDash([]);
  // topic dust
  const t=now/1000;
  MAP.topics.forEach((p,i)=>{const r=reveal(i,241);if(!r)return;const [x,y]=project(c,p,f,.9),lit=c.glow[p.s],tw=still?.7:.55+.45*Math.sin(t*1.3+p.tw);
    if(lit>.02){const [sx,sy]=project(c,MAP.subjects[p.s],f,.6);ctx.strokeStyle=`rgba(255,226,171,${.4*lit})`;ctx.lineWidth=.6;ctx.beginPath();ctx.moveTo(sx,sy);ctx.lineTo(x,y);ctx.stroke();}
    ctx.fillStyle=`rgba(255,232,190,${(.35+.25*tw+.4*lit)*r})`;ctx.beginPath();ctx.arc(x,y,.9+lit*1.3,0,TAU);ctx.fill();});
  // subject stars
  MAP.subjects.forEach((s,i)=>{const r=reveal(i,33);if(!r)return;const [x,y]=project(c,s,f,.6),col=atlasGroups[s.g][1],g=c.glow[i],rad=2.2+Math.sqrt(atlasSubjects[i][3])*.55+g*2.5;
    ctx.fillStyle=col;ctx.globalAlpha=r;ctx.beginPath();ctx.arc(x,y,rad,0,TAU);ctx.fill();
    if(g>.02){ctx.strokeStyle=`rgba(255,226,171,${g})`;ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,rad+5+g*4,0,TAU);ctx.stroke();}
    ctx.globalAlpha=1;});
  // group seals: roman numerals
  ctx.textAlign='center';ctx.textBaseline='middle';
  MAP.groups.forEach((G,i)=>{const r=reveal(i,7);if(!r)return;const [x,y]=project(c,G,f,.4);
    ctx.globalAlpha=r;ctx.fillStyle='#0d1730';ctx.strokeStyle='#d9b56c';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,15,0,TAU);ctx.fill();ctx.stroke();
    ctx.fillStyle='#f3dfb6';ctx.font=`500 ${i===6?16:13}px "EB Garamond","Cormorant Garamond",Georgia,serif`;ctx.fillText(atlasGroups[i][0],x,y+1);ctx.globalAlpha=1;});
  if(c.hover>=0){
    const s=MAP.subjects[c.hover],[x,y]=project(c,s,f,.6),en=getLanguage()==='en',label=en?atlasSubjects[c.hover][1]:atlasSubjects[c.hover][0];
    ctx.font='500 15px "EB Garamond","Huiwen Mincho",Georgia,serif';const tw=ctx.measureText(label).width,bx=Math.min(w-tw-26,x+14),by=y-30;
    ctx.globalAlpha=c.glow[c.hover];ctx.fillStyle='rgba(9,16,36,.86)';ctx.strokeStyle='rgba(217,181,108,.7)';ctx.beginPath();ctx.roundRect(bx,by,tw+20,26,13);ctx.fill();ctx.stroke();
    ctx.fillStyle='#f3dfb6';ctx.textAlign='left';ctx.fillText(label,bx+10,by+14);ctx.globalAlpha=1;
  }
  return busy;
}
function wake(c){legendText(c);if(!c.raf&&c.visible&&!document.hidden)c.raf=requestAnimationFrame(t=>loop(c,t));}
function loop(c,t){c.raf=0;if(draw(c,t)&&c.visible&&!document.hidden)c.raf=requestAnimationFrame(n=>loop(c,n));}

/* ledger count-up */
function countUp(el){
  const target=el.textContent.trim(),n=+target.replace(/,/g,'');if(!n||isMotionPaused())return;
  const start=performance.now(),dur=1600;
  const step=now=>{const p=Math.min(1,(now-start)/dur),v=Math.round(n*(1-(1-p)**4));el.textContent=v.toLocaleString('en-US');if(p<1)requestAnimationFrame(step);else el.textContent=target;};
  requestAnimationFrame(step);
}

const io=new IntersectionObserver(entries=>{for(const e of entries){
  const c=charts.get(e.target);
  if(c){c.visible=e.isIntersecting;if(c.visible&&!c.born)c.born=performance.now();if(c.visible)wake(c);continue;}
  if(e.isIntersecting){e.target.querySelectorAll('b').forEach(countUp);io.unobserve(e.target);}
}},{threshold:.2});

export function mountAtlasChart(){
  for(const [p,c] of charts)if(!p.isConnected){c.ro.disconnect();io.unobserve(p);cancelAnimationFrame(c.raf);charts.delete(p);}
  document.querySelectorAll('.atlas-v2-plate--sky').forEach(mount);
  document.querySelectorAll('.atlas-v2-ledger:not([data-counted])').forEach(l=>{l.dataset.counted='1';io.observe(l);});
}
onMotionChange(()=>{for(const c of charts.values()){draw(c,performance.now());wake(c);}});
document.addEventListener('visibilitychange',()=>{for(const c of charts.values())wake(c);});
document.addEventListener('atlas:render',()=>requestAnimationFrame(mountAtlasChart));
requestAnimationFrame(mountAtlasChart);
