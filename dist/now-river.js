// Now / the river. One current runs down the timeline; each milestone is a landing on its bank.
// The line draws itself as the reader travels upstream (newest at the top, the spring at the bottom).
// With motion paused the whole river is simply there, every landing already reached.
import {canAnimate,onMotionChange} from './motion-state.js';

const section=document.querySelector('.now-page .now-timeline');
const list=section?.querySelector('.timeline-list');
if(section&&list){
  const NS='http://www.w3.org/2000/svg';
  const make=(tag,attrs={})=>{const el=document.createElementNS(NS,tag);for(const [k,v] of Object.entries(attrs))el.setAttribute(k,v);return el;};
  const svg=make('svg',{class:'now-river','aria-hidden':'true',focusable:'false',preserveAspectRatio:'none'});
  const grad=make('linearGradient',{id:'now-river-current',gradientUnits:'userSpaceOnUse',x1:'0',y1:'0',x2:'0',y2:'1600',spreadMethod:'reflect'});
  [['0','#3d5cff'],['.2','#7a5cff'],['.42','#ff5c9a'],['.62','#ff6b3d'],['.82','#ffd23f'],['1','#35d49a']].forEach(([o,c])=>grad.append(make('stop',{offset:o,'stop-color':c})));
  const defs=make('defs');defs.append(grad);
  const bed=make('path',{class:'now-river-bed'});
  const flow=make('path',{class:'now-river-flow',stroke:'url(#now-river-current)'});
  svg.append(defs,bed,flow);
  section.append(svg);
  section.classList.add('has-river');

  const entries=[...list.children].filter(li=>li.matches('.timeline-entry'));
  let marks=[],total=1,height=0,frame=0;

  const px=(el,name,fallback)=>{const v=parseFloat(getComputedStyle(el).getPropertyValue(name));return Number.isFinite(v)?v:fallback;};

  function build(){
    const top=list.offsetTop,start=Math.max(0,top-px(section,'--river-lead',56));
    // The river ends at the spring: the origin line under the oldest landing.
    const spring=section.querySelector('.timeline-origin');
    const end=spring&&spring.offsetParent===section?spring.offsetTop+px(section,'--spring-y',spring.offsetHeight/2):top+list.offsetHeight+72;
    height=Math.max(1,end-start);
    const x=list.offsetLeft+px(list,'--river-x',200),nodeY=px(list,'--node-y',22),swing=px(list,'--river-swing',10);
    svg.style.top=start+'px';svg.style.height=height+'px';
    svg.setAttribute('viewBox',`0 0 ${Math.max(1,section.clientWidth)} ${Math.max(1,height)}`);
    grad.setAttribute('y2',String(Math.min(height,Math.max(1100,innerHeight*1.6))));
    // Landing points, in svg space.
    const points=[0,...entries.map(li=>li.offsetTop+top-start+nodeY),height];
    let d=`M${x} 0`;const segs=[];
    for(let i=1;i<points.length;i++){
      const y0=points[i-1],y1=points[i],dy=y1-y0,side=i%2?1:-1,a=Math.min(swing,dy*.08)*side;
      const seg=`C${x+a} ${(y0+dy*.38).toFixed(1)} ${x+a} ${(y0+dy*.62).toFixed(1)} ${x} ${y1.toFixed(1)}`;
      d+=seg;segs.push({y0,y1,d:`M${x} ${y0.toFixed(1)}`+seg});
    }
    bed.setAttribute('d',d);flow.setAttribute('d',d);
    // Arc length at every landing, so the stroke can stop exactly at the reader's line.
    let acc=0;marks=[{y:0,l:0}];
    const probe=make('path');svg.append(probe);
    for(const s of segs){probe.setAttribute('d',s.d);acc+=probe.getTotalLength();marks.push({y:s.y1,l:acc});}
    probe.remove();
    total=acc||1;
    flow.style.strokeDasharray=`${total} ${total}`;
    update();
  }

  function lengthAt(y){
    if(y<=0)return 0;
    for(let i=1;i<marks.length;i++){const a=marks[i-1],b=marks[i];if(y<=b.y)return a.l+(b.l-a.l)*((y-a.y)/((b.y-a.y)||1));}
    return total;
  }

  function update(){
    frame=0;
    const animate=canAnimate();
    const rect=svg.getBoundingClientRect();
    const line=innerHeight*.58;
    const y=animate?line-rect.top:height;
    flow.style.strokeDashoffset=String(total-lengthAt(y));
    for(const li of entries){
      const r=li.getBoundingClientRect();
      li.classList.toggle('is-reached',!animate||r.top+px(list,'--node-y',22)<line);
    }
  }
  const queue=()=>{if(!frame)frame=requestAnimationFrame(update);};

  addEventListener('scroll',queue,{passive:true});
  addEventListener('resize',()=>requestAnimationFrame(build),{passive:true});
  if('ResizeObserver' in window){let t=0;new ResizeObserver(()=>{cancelAnimationFrame(t);t=requestAnimationFrame(build);}).observe(list);}
  onMotionChange(()=>{section.classList.toggle('river-still',!canAnimate());update();});
  section.classList.toggle('river-still',!canAnimate());
  build();
  document.fonts?.ready.then(build);
}
