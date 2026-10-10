import {getLanguage,onLanguageChange} from './i18n.js';
import {isMotionPaused,systemReducesMotion,onMotionChange} from './motion-state.js';
import {ac8Asset,ac8Views} from './ac8-content.js';
import {initialFlight,selectFlightView,launchTrail,advanceFlight,missileAt,missileCurve,flightPose} from './ac8-state.js';
import {ambientEnemies,enemyPose,contourPaths,emitCountermeasures,countermeasureAt} from './ac8-ambient-state.js';
const root=document.querySelector('[data-ac8-scene]');
if(root){
 const ns='http://www.w3.org/2000/svg',stage=root.querySelector('[data-ac8-stage]');
 let state=initialFlight(),visible=false,frame=0,last=0,closed=false,launchPeriod=0,flarePeriod=0,contourTime=-1;
 let pointer={x:0,y:0},follow={x:0,y:0},bounds={x:0,y:0,width:1200,height:800},narrow=false;
 const plane=root.querySelector('[data-ac8-aircraft]'),sticker=root.querySelector('[data-ac8-sticker]'),map=root.querySelector('.ac8-map');
 const radar=root.querySelector('.ac8-radar-sweep'),effects=root.querySelector('[data-ac8-effects]'),layer=root.querySelector('[data-ac8-launch-layer]');
 const enemyLayer=root.querySelector('[data-ac8-enemy-layer]'),flareLayer=root.querySelector('[data-ac8-flare-layer]'),contours=[...root.querySelectorAll('[data-contour]')];
 const enemyNodes=new Map(),launchNodes=new Map(),flareNodes=new Map(),animations=new Set();
 const copy=pair=>pair[getLanguage()==='en'?1:0];
 let targetPoint=[660,175],paintSamples=0,paintTotal=0;
 function svgPoint(x,y){const matrix=effects.getScreenCTM();return matrix?new DOMPoint(x,y).matrixTransform(matrix.inverse()):null;}
 function resizeScene(){
  const box=stage.getBoundingClientRect(),a=svgPoint(box.left,box.top),b=svgPoint(box.right,box.bottom);
  if(!a||!b)return;narrow=box.width<650;bounds={x:a.x,y:a.y,width:b.x-a.x,height:b.y-a.y};
  targetPoint=[bounds.x+bounds.width*(narrow?.28:.55),bounds.y+bounds.height*(narrow?.34:.22)];
  moveTarget();
 }
 function moveTarget(){root.querySelector('.ac8-target-ring').setAttribute('transform',`translate(${targetPoint[0]-876} ${targetPoint[1]-160})`);}
 function jetInChart(jet){const p=enemyPose(jet);return{...p,x:bounds.x+p.x*bounds.width,y:bounds.y+p.y*bounds.height};}
 function wingGeometry(tail=false){
  const rect=plane.getBoundingClientRect(),pose=flightPose(state),angle=pose.roll*Math.PI/180;
  const dx=plane.clientWidth*(tail?.26:-.12),dy=plane.clientHeight*(tail?-.04:.16);
  const point=svgPoint(rect.left+rect.width/2+dx*Math.cos(angle)-dy*Math.sin(angle),rect.top+rect.height/2+dx*Math.sin(angle)+dy*Math.cos(angle));
  return point?{origin:[point.x,point.y],heading:pose.roll+180,target:[...targetPoint]}:null;
 }
 function queueLaunch(){
  const candidate=ambientEnemies(state.clock,narrow).map(jetInChart).find(p=>p.x>bounds.x+bounds.width*.26&&p.x<bounds.x+bounds.width*.62);
  if(candidate)targetPoint=[candidate.x,candidate.y];moveTarget();
  const geometry=wingGeometry();if(geometry)state=launchTrail(state,geometry);
 }
 function queueFlares(){const geometry=wingGeometry(true);if(geometry)state=emitCountermeasures(state,{...geometry,distanceScale:narrow?.48:1});}
 function labels(){const view=ac8Views[state.target];root.querySelector('[data-ac8-view-title]').textContent=copy(view.title);root.querySelector('[data-ac8-view-copy]').textContent=copy(view.copy);}
 function sweepNodes(nodes,alive){for(const [id,node]of nodes)if(!alive.has(id)){node.remove();nodes.delete(id);}}
 function makeGroup(parent,id,html){const node=document.createElementNS(ns,'g');node.dataset.actor=String(id);node.innerHTML=html;parent.appendChild(node);return node;}
 function paintAmbient(){
  if(contourTime<0||Math.abs(state.clock-contourTime)>=.05){
   const paths=contourPaths(state.clock);for(let i=0;i<contours.length;i++)contours[i].setAttribute('d',paths[i]);contourTime=state.clock;
  }
  const enemies=ambientEnemies(state.clock,narrow);sweepNodes(enemyNodes,new Set(enemies.map(j=>j.id)));
  for(const jet of enemies){
   let node=enemyNodes.get(jet.id);
   if(!node){node=makeGroup(enemyLayer,jet.id,`<path class="ac8-enemy-route"/><g class="ac8-enemy-body"><image class="ac8-enemy-photo" href="${ac8Asset}f35c-cutout.png" x="-42" y="-32.6" width="84" height="65.2"/></g><path class="ac8-enemy-lock" d="M-49-34h12M-49-34v12M49-34H37M49-34v12M-49 34h12M-49 34V22M49 34H37M49 34V22"/><text class="ac8-enemy-id" x="-46" y="-43">E / ${String(jet.id+1).padStart(2,'0')}</text>`);enemyNodes.set(jet.id,node);}
   const p=jetInChart(jet),scale=p.size/84*(narrow?.78:1);
   node.setAttribute('transform',`translate(${p.x.toFixed(2)} ${p.y.toFixed(2)}) scale(${scale.toFixed(3)})`);node.style.opacity=String(Math.max(0,p.opacity)*.91);
   node.querySelector('.ac8-enemy-body').setAttribute('transform',`rotate(${(p.heading+180).toFixed(2)})`);
   node.querySelector('.ac8-enemy-route').setAttribute('d',`M55 0Q112 -18 178 ${((jet.id%3)-1)*18}`);
  }
  sweepNodes(flareNodes,new Set(state.flares.map(f=>f.id)));
  const count=narrow?4:7;
  for(const burst of state.flares){
   let node=flareNodes.get(burst.id);
   if(!node){node=makeGroup(flareLayer,burst.id,Array.from({length:7},(_,i)=>`<g data-flare="${i}"><path class="ac8-flare-smoke"/><g class="ac8-flare-photo"><image class="ac8-countermeasure-sprite" href="${ac8Asset}countermeasure.png" x="-93" y="-17" width="102" height="34.75"/></g><circle class="ac8-flare-spark" r="1.5"/></g>`).join(''));flareNodes.set(burst.id,node);}
   const progress=Math.min(1,(state.clock-burst.start)/4.8);
   [...node.children].forEach((child,i)=>{
    if(i>=count){child.style.display='none';return;}child.style.display='';
    const f=countermeasureAt(progress,narrow?i*2:i,burst.geometry),scale=f.width/102*(narrow?.7:1);
    child.style.opacity=String(f.opacity);
    child.querySelector('.ac8-flare-photo').setAttribute('transform',`translate(${f.x.toFixed(2)} ${f.y.toFixed(2)}) rotate(${f.angle.toFixed(2)}) scale(${scale.toFixed(3)})`);
    child.querySelector('.ac8-flare-smoke').setAttribute('d',`M${burst.geometry.origin[0]} ${burst.geometry.origin[1]}Q${(burst.geometry.origin[0]+f.x)/2} ${burst.geometry.origin[1]} ${f.x.toFixed(2)} ${f.y.toFixed(2)}`);
    child.querySelector('.ac8-flare-smoke').style.opacity=String((1-progress)*.5);
    const spark=child.querySelector('.ac8-flare-spark');spark.setAttribute('cx',String(f.x));spark.setAttribute('cy',String(f.y));spark.setAttribute('r',String(1.5+Math.sin(progress*Math.PI)*2.5));
   });
  }
  root.querySelector('[data-ac8-wave]').textContent=String(Math.floor(state.clock/22.4)+1).padStart(2,'0');
  root.querySelector('[data-ac8-enemy-count]').textContent=String(enemies.length).padStart(2,'0');
  root.querySelector('[data-ac8-flare-count]').textContent=String(state.flares.length*count).padStart(2,'0');
  root.dataset.enemies=String(enemies.length);root.dataset.flares=String(state.flares.length*count);
 }
 function paint(){
  const started=performance.now(),p=flightPose(state);
  root.style.setProperty('--ac8-view',p.view.toFixed(3));root.style.setProperty('--ac8-warm',Math.max(0,p.view-1).toFixed(3));root.style.setProperty('--ac8-war',Math.min(1,p.view).toFixed(3));
  plane.style.transform=`translate(${p.planeX+follow.x*.8}px,${p.planeY+follow.y*.6}px) rotate(${p.roll}deg)`;
  map.style.transform=`translate(${p.mapX+follow.x*.25+Math.sin(state.clock*.16)*5}px,${p.mapY+follow.y*.2+Math.cos(state.clock*.13)*4}px) scale(${1.025+p.view*.045})`;
  sticker.style.transform=`translate(${follow.x*.35}px,${follow.y*.3}px) rotate(${-5+follow.x*.08}deg)`;
  radar.style.transform=`rotate(${p.scan*360}deg)`;paintAmbient();
  sweepNodes(launchNodes,new Set(state.launches.map(l=>l.id)));
  for(const launch of state.launches){
   let node=launchNodes.get(launch.id);
   if(!node){
    const [a,b,c,d]=missileCurve((launch.id%3)*-12,launch.geometry),path=`M${a[0]} ${a[1]}C${b[0]} ${b[1]} ${c[0]} ${c[1]} ${d[0]} ${d[1]}`;
    node=makeGroup(layer,launch.id,`<path class="ac8-missile-vapor" d="${path}" pathLength="1"/><path class="ac8-missile-smoke" d="${path}" pathLength="1"/><g class="ac8-missile-body"><image class="ac8-missile-sprite" href="${ac8Asset}missile-sticker.png" x="-112" y="-24" width="142" height="49.6"/></g><circle class="ac8-launch-flare" cx="${a[0]}" cy="${a[1]}" r="12"/><circle class="ac8-missile-shock" cx="${d[0]}" cy="${d[1]}" r="1"/>`);launchNodes.set(launch.id,node);
   }
   const progress=Math.min(1,(state.clock-launch.start)/3.15),m=missileAt(progress,(launch.id%3)*-12,launch.geometry);
   const body=node.querySelector('.ac8-missile-body'),flare=node.querySelector('.ac8-launch-flare'),shock=node.querySelector('.ac8-missile-shock');
   body.setAttribute('transform',`translate(${m.x.toFixed(2)} ${m.y.toFixed(2)}) rotate(${m.angle.toFixed(2)}) scale(${narrow?.8:1})`);body.style.opacity=String(Math.max(0,m.opacity));
   for(const smoke of node.querySelectorAll('.ac8-missile-smoke,.ac8-missile-vapor')){smoke.style.strokeDasharray=`${Math.min(.35,progress)} 1`;smoke.style.strokeDashoffset=String(-Math.max(0,progress-.35));smoke.style.opacity=String(Math.max(0,1-progress)*.8);}
   flare.style.opacity=String(Math.max(0,1-progress*8));flare.setAttribute('r',String(8+progress*30));
   const impact=Math.max(0,(progress-.82)/.18);shock.setAttribute('r',String(4+impact*34));shock.style.opacity=String(impact*(1-impact)*2.5);
  }
  root.dataset.flightPose=state.position.toFixed(4);root.dataset.flightClock=state.clock.toFixed(3);root.dataset.launches=String(state.launches.length);
  paintTotal+=performance.now()-started;paintSamples++;if(paintSamples%120===0)root.dataset.ac8PaintMs=(paintTotal/paintSamples).toFixed(3);
 }
 function tick(time){
  frame=0;if(closed||!visible||document.hidden||isMotionPaused()){last=0;root.dataset.ac8Running='false';return;}
  const dt=last?Math.min(50,time-last):0;last=time;state=advanceFlight(state,dt);
  const missileBeat=Math.floor((state.clock+1.5)/2.2);if(missileBeat>launchPeriod){launchPeriod=missileBeat;queueLaunch();}
  const flareBeat=Math.floor((state.clock+5.35)/6.6);if(flareBeat>flarePeriod){flarePeriod=flareBeat;queueFlares();}
  follow.x+=(pointer.x-follow.x)*(1-Math.exp(-dt/110));follow.y+=(pointer.y-follow.y)*(1-Math.exp(-dt/110));
  paint();root.dataset.ac8Running='true';frame=requestAnimationFrame(tick);
 }
 function schedule(){if(frame)cancelAnimationFrame(frame);frame=0;last=0;root.dataset.ac8Running='false';if(!closed&&visible&&!document.hidden&&!isMotionPaused())frame=requestAnimationFrame(tick);}
 function enter(){
  if(isMotionPaused())return;
  root.querySelectorAll('.ac8-line-mask>span').forEach((node,i)=>{const a=node.animate([{transform:'translateY(114%)'},{transform:'translateY(0)'}],{duration:1100,delay:i*100,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});animations.add(a);a.finished.finally(()=>animations.delete(a)).catch(()=>{});});
  const a=sticker.animate([{translate:'50px 55px',opacity:.2},{translate:'0 0',opacity:1}],{duration:1550,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});animations.add(a);a.finished.finally(()=>animations.delete(a)).catch(()=>{});
 }
 let entered=false;
 const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;root.classList.toggle('ac8-visible',visible);if(visible&&!entered){entered=true;enter();}for(const a of animations)visible&&!document.hidden&&!isMotionPaused()?a.play():a.pause();schedule();},{threshold:.01});observer.observe(stage);
 function click(event){
  const button=event.target.closest('[data-ac8-view],[data-ac8-fire]');if(!button||!root.contains(button))return;
  if(button.hasAttribute('data-ac8-view')){state=selectFlightView(state,Number(button.dataset.ac8View));root.querySelectorAll('[data-ac8-view]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.ac8View)===state.target)));labels();}
  else{queueLaunch();queueFlares();root.querySelector('[data-ac8-launch-status]').textContent=getLanguage()==='en'?`TRAIL ${String(state.serial).padStart(2,'0')} / ILLUSTRATED LAUNCH`:`轨迹 ${String(state.serial).padStart(2,'0')} / 艺术化发射`;}
  if(isMotionPaused()){
   state={...state,position:state.target,velocity:0};state=advanceFlight(state,0,false,systemReducesMotion());
   if(button.hasAttribute('data-ac8-fire'))root.querySelector('[data-ac8-launch-status]').textContent=systemReducesMotion()?(getLanguage()==='en'?'Reduced motion. Target selected.':'减少动态模式，目标已选中。'):(getLanguage()==='en'?'Motion paused. Trail queued.':'动效已暂停，轨迹已排入。');
  }
  paint();schedule();
 }
 function move(event){if(event.pointerType==='touch'||isMotionPaused()||!matchMedia('(hover:hover) and (pointer:fine)').matches)return;const box=stage.getBoundingClientRect();if(event.clientY<box.top||event.clientY>box.bottom){pointer={x:0,y:0};return;}pointer={x:Math.max(-12.5,Math.min(12.5,((event.clientX-box.left)/box.width-.5)*25)),y:Math.max(-9,Math.min(9,((event.clientY-box.top)/box.height-.5)*18))};}
 const leave=()=>{pointer={x:0,y:0};};
 root.addEventListener('click',click);root.addEventListener('pointermove',move,{passive:true});root.addEventListener('pointerleave',leave);
 function visibility(){for(const a of animations)document.hidden?a.pause():visible&&!isMotionPaused()&&a.play();schedule();}
 document.addEventListener('visibilitychange',visibility);
 const stopMotion=onMotionChange(()=>{if(isMotionPaused()){for(const a of animations){a.finish();a.cancel();}animations.clear();if(systemReducesMotion())state=advanceFlight(state,0,false,true);}paint();schedule();});
 const stopLanguage=onLanguageChange(labels);
 resizeScene();labels();paint();const resize=new ResizeObserver(resizeScene);resize.observe(stage);
 window.addEventListener('pagehide',e=>{if(frame)cancelAnimationFrame(frame);frame=0;last=0;if(e.persisted)return;closed=true;observer.disconnect();resize.disconnect();stopMotion();stopLanguage();for(const a of animations)a.cancel();animations.clear();root.removeEventListener('click',click);root.removeEventListener('pointermove',move);root.removeEventListener('pointerleave',leave);document.removeEventListener('visibilitychange',visibility);enemyNodes.clear();launchNodes.clear();flareNodes.clear();});
 window.addEventListener('pageshow',e=>{if(e.persisted)schedule();});
}
