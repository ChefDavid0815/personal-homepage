import * as THREE from 'three';
import {getLanguage} from './i18n.js';
import {isMotionPaused,systemReducesMotion,onMotionChange} from './motion-state.js';
import {dotAirAirports,dotAirAsset} from './dot-air-content.js';
import {initialOrbit,selectAirport,advanceOrbit,unit,arc} from './dot-air-state.js';
import {createQualityGovernor} from './dot-air-quality.js';

const copy=(zh,en)=>getLanguage()==='en'?en:zh;
const scenes=new Map(),saved=new Map(),artAnimations=new Map(),entered=new WeakSet(),artNodes=new Set();
const entranceKeys=new Set();
let frame=0,last=0,closed=false,cloudPromise;
const controller=new AbortController();
const observer=new IntersectionObserver(entries=>{
  for(const entry of entries){
    const scene=scenes.get(entry.target);
    if(scene){scene.visible=entry.isIntersecting;entry.target.dataset.visible=String(scene.visible);if(scene.visible&&!scene.loading&&!scene.renderer)initialize(scene);}
    else{
      entry.target.classList.toggle('da-visible',entry.isIntersecting);
      if(entry.isIntersecting&&!entered.has(entry.target)){entered.add(entry.target);enter(entry.target);}
      for(const animation of artAnimations.get(entry.target)||[])entry.isIntersecting&&!isMotionPaused()&&!document.hidden?animation.play():animation.pause();
    }
  }
  schedule();
},{rootMargin:'0px',threshold:.01});
function enter(art){
  const key=art.classList.contains('da-hero')?'gallery':art.classList.contains('da-art')?'post':'now';
  if(entranceKeys.has(key))return;entranceKeys.add(key);
  if(isMotionPaused())return;
  const animations=[];
  art.querySelectorAll('.da-line').forEach((line,i)=>animations.push(line.animate([{transform:'translateY(114%) rotate(2deg)'},{transform:'translateY(0) rotate(0)'}],{duration:1050,delay:i*120,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'})));
  const way=art.querySelector('.da-way');if(way)animations.push(way.animate([{transform:'translateX(-45px) rotate(-5deg)'},{transform:'translateX(0) rotate(-4deg)'}],{duration:1200,delay:180,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'}));
  artAnimations.set(art,animations);
  for(const a of animations)a.finished.catch(()=>{});
}
function permitted(scene){const dialog=document.querySelector('dialog[open]');return scene.visible&&!document.hidden&&(!dialog||dialog.contains(scene.host));}
function running(scene){return permitted(scene)&&scene.renderer&&!scene.lost&&!isMotionPaused()&&!scene.paused&&!scene.dragging;}
function schedule(){
  if(frame)cancelAnimationFrame(frame);frame=0;last=0;
  for(const s of scenes.values()){s.quality?.reset();s.host.dataset.running=String(Boolean(running(s)));if(s.renderer&&permitted(s))paint(s);}
  if(!closed&&[...scenes.values()].some(running))frame=requestAnimationFrame(tick);
}
function tick(time){
  frame=0;const interval=last?time-last:0,dt=Math.min(50,interval);last=time;
  for(const s of scenes.values())if(running(s)){
    s.quality.sample(time,{active:true});
    s.pose=advanceOrbit(s.pose,dt,{});s.entrance=Math.min(1,s.entrance+dt/1300);paint(s);
    if(interval>0)s.times.push(interval);if(s.times.length>180)s.times.shift();
    if(s.times.length===180)s.host.dataset.frameP95=String([...s.times].sort((a,b)=>a-b)[170].toFixed(1));
  }
  if(!closed&&[...scenes.values()].some(running))frame=requestAnimationFrame(tick);else last=0;
}
function status(s,message){const node=s.host.closest('[data-da-exhibit]')?.querySelector('[data-da-status]');if(node)node.textContent=message;}
async function initialize(s){
  s.loading=true;
  try{
    cloudPromise??=fetch(dotAirAsset+'orbital-points.json',{signal:controller.signal}).then(r=>{if(!r.ok)throw new Error('Geographic cloud unavailable');return r.json();});
    const rows=await cloudPromise;if(!s.host.isConnected||closed)return;
    s.renderer=new THREE.WebGLRenderer({canvas:s.canvas,antialias:true,alpha:true,powerPreference:'default'});s.renderer.setClearColor(0x000000,0);
    s.level='high';s.quality=createQualityGovernor({onChange:({level})=>{s.level=level;resize(s,false);}});
    s.scene=new THREE.Scene();s.camera=new THREE.PerspectiveCamera(38,1,.1,20);s.camera.position.z=3.5;
    s.planet=new THREE.Group();s.scene.add(s.planet);
    s.surface=new THREE.MeshPhongMaterial({color:0xee3829,shininess:32,specular:0xffb693});
    s.planet.add(new THREE.Mesh(new THREE.SphereGeometry(1,64,48),s.surface));
    s.scene.add(new THREE.HemisphereLight(0xfff4de,0x73121b,2.2));
    const light=new THREE.DirectionalLight(0xffffff,2.3);light.position.set(-2,4,5);s.scene.add(light);
    s.cloud=new THREE.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{pixelRatio:{value:1},pointScale:{value:1},night:{value:0}},vertexShader:`attribute float land; varying float terrain; varying float lightness; uniform float pixelRatio; uniform float pointScale; void main(){terrain=land; vec4 view=modelViewMatrix*vec4(position,1.0); vec3 normal=normalize(mat3(modelViewMatrix)*position);lightness=max(0.0,normal.z); gl_Position=projectionMatrix*view;gl_PointSize=(land>.5?5.8:2.9)*pixelRatio*pointScale*(3.2/-view.z);}`,fragmentShader:`varying float terrain; varying float lightness; uniform float night;void main(){vec2 p=gl_PointCoord-.5;float edge=1.0-smoothstep(.35,.5,length(p));if(edge<.05)discard;vec3 color=mix(vec3(.63,.055,.04),vec3(1.0,.97,.93),terrain);color=mix(color,mix(vec3(.91,.15,.12),vec3(1.0,.98,.94),terrain),night);gl_FragColor=vec4(color,edge*mix(.48,.8+.2*lightness,terrain));}`});
    const positions=new Float32Array(rows.length*3),terrain=new Float32Array(rows.length);rows.forEach((row,i)=>{positions.set(unit(row[0],row[1]).map(v=>v*1.002),i*3);terrain[i]=row[2];});
    const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));geometry.setAttribute('land',new THREE.BufferAttribute(terrain,1));s.planet.add(new THREE.Points(geometry,s.cloud));
    s.route=new THREE.Group();s.planet.add(s.route);
    s.traveller=new THREE.Mesh(new THREE.SphereGeometry(.013,12,8),new THREE.MeshBasicMaterial({color:0xead25a}));s.planet.add(s.traveller);
    s.host.dataset.points=String(rows.length);s.host.dataset.ready='true';s.entrance=s.remounted||isMotionPaused()?1:0;
    makeRoute(s);resize(s);status(s,copy('19,717 个地理采样点 / 球面实时旋转','19,717 GEOGRAPHIC SAMPLES / LIVE SPHERICAL ROTATION'));
  }catch(error){if(error.name!=='AbortError'&&s.host.isConnected){s.host.dataset.ready='false';status(s,copy('动态地球暂不可用，已保留静态地理图与全部入口。','Live Earth unavailable. Static geography and all links remain available.'));}}
  finally{s.loading=false;}
}
function disposeTree(object){object?.traverse(o=>{o.geometry?.dispose();const materials=Array.isArray(o.material)?o.material:[o.material];for(const material of materials)material?.dispose();});}
function makeRoute(s){
  if(!s.renderer)return;
  while(s.route.children.length){const object=s.route.children[0];s.route.remove(object);disposeTree(object);}
  const airport=dotAirAirports.find(a=>a.code===s.pose.code)||dotAirAirports[0];s.airport=airport;
  s.a=unit(55.37,25.25);s.b=unit(airport.lon,airport.lat);s.traveller.visible=airport.code!=='DXB';
  if(s.traveller.visible){const vertices=Array.from({length:101},(_,i)=>new THREE.Vector3(...arc(s.a,s.b,i/100)).multiplyScalar(1.014+.08*Math.sin(Math.PI*i/100)));s.route.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(vertices),new THREE.LineBasicMaterial({color:0xead25a,transparent:true,opacity:.9})));}
}
function paint(s){
  if(!s.renderer||s.lost||!s.width||!s.height)return;
  const rad=Math.PI/180;
  const qx=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1,0,0),s.pose.tilt*rad),qy=new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0,1,0),-s.pose.yaw*rad);s.planet.quaternion.copy(qx.multiply(qy));
  const progress=1-Math.pow(1-s.entrance,3);s.planet.position.y=(1-progress)*-.45;s.planet.scale.setScalar(.9+.1*progress);
  s.surface.color.set(s.night?0x7a151d:0xee3829);s.surface.specular.set(s.night?0xd64140:0xffb693);s.cloud.uniforms.night.value=s.night?1:0;
  if(s.traveller.visible){const t=(s.pose.clock%12)/12;s.traveller.position.set(...arc(s.a,s.b,t)).multiplyScalar(1.014+.08*Math.sin(Math.PI*t));}
  s.scene.updateMatrixWorld();const marker=new THREE.Vector3(...unit(s.airport.lon,s.airport.lat)).multiplyScalar(1.025),world=s.planet.localToWorld(marker.clone()),p=world.project(s.camera),facing=marker.applyQuaternion(s.planet.quaternion).z;
  s.pin.hidden=facing<.22;s.pin.style.transform=`translate(${((p.x*.5+.5)*s.width).toFixed(1)}px,${((-p.y*.5+.5)*s.height).toFixed(1)}px)`;
  s.renderer.render(s.scene,s.camera);s.host.dataset.rotation=s.pose.yaw.toFixed(3);s.host.dataset.phase=s.pose.phase;s.host.dataset.drawCalls=String(s.renderer.info.render.calls);s.host.dataset.entrance=s.entrance.toFixed(3);
}
function resize(s,restart=true){
  if(!s.renderer||!s.cloud)return;const box=s.host.getBoundingClientRect();if(box.width<=0||box.height<=0)return;
  s.width=box.width;s.height=box.height;s.renderer.setPixelRatio(Math.min(devicePixelRatio,{high:1.5,medium:1.15,low:.85}[s.level]));s.renderer.setSize(box.width,box.height,false);s.camera.aspect=box.width/box.height;s.camera.updateProjectionMatrix();s.cloud.uniforms.pixelRatio.value=s.renderer.getPixelRatio();s.cloud.uniforms.pointScale.value=Math.max(.38,Math.min(1.1,box.height/800));s.host.dataset.quality=s.level;s.host.dataset.dpr=String(s.renderer.getPixelRatio());if(restart)schedule();
}
function refresh(s){
  const parent=s.host.closest('[data-da-exhibit]');if(!parent)return;
  parent.querySelectorAll('[data-da-airport]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.daAirport===s.pose.code)));
  const airport=dotAirAirports.find(a=>a.code===s.pose.code)||dotAirAirports[0];s.pin.textContent=airport.code;
  parent.querySelector('[data-da-code]').textContent=airport.code;
  parent.querySelector('[data-da-coordinates]').textContent=`${Math.abs(airport.lat).toFixed(2)}° ${airport.lat<0?'S':'N'} / ${Math.abs(airport.lon).toFixed(2)}° ${airport.lon<0?'W':'E'}`;
  const pause=parent.querySelector('[data-da-pause]');pause.setAttribute('aria-pressed',String(s.paused));pause.disabled=isMotionPaused();pause.textContent=isMotionPaused()?copy('全站动效已暂停','SITE MOTION PAUSED'):s.paused?copy('继续旋转','RESUME EARTH'):copy('暂停地球','PAUSE EARTH');
  const light=parent.querySelector('[data-da-light]');light.setAttribute('aria-pressed',String(s.night));light.textContent=s.night?copy('日间灯光','DAY LIGHT'):copy('夜间灯光','NIGHT LIGHT');
  if(s.paused||isMotionPaused())s.entrance=1;
}
function install(s){
  const abort=s.events.signal;
  s.canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();s.lost=true;s.host.dataset.ready='false';status(s,copy('球面暂时失去渲染连接，静态地球仍可查看。','Rendering interrupted. Static Earth remains available.'));schedule();},{signal:abort});
  s.canvas.addEventListener('webglcontextrestored',()=>{s.lost=false;s.host.dataset.ready='true';resize(s);status(s,copy('球面渲染已恢复。','Earth rendering restored.'));},{signal:abort});
  if(s.host.dataset.interactive!=='true')return;
  s.canvas.addEventListener('pointerdown',e=>{if(e.button!==0||!s.renderer)return;s.dragging=true;s.pointer={x:e.clientX,y:e.clientY};s.canvas.setPointerCapture(e.pointerId);s.pose={...s.pose,phase:'spin',velocity:0};schedule();},{signal:abort});
  s.canvas.addEventListener('pointermove',e=>{if(!s.dragging)return;const dx=e.clientX-s.pointer.x,dy=e.clientY-s.pointer.y;s.pose={...s.pose,yaw:s.pose.yaw-dx*.2,tilt:Math.max(-70,Math.min(70,s.pose.tilt+dy*.14)),velocity:-dx};s.pointer={x:e.clientX,y:e.clientY};paint(s);},{signal:abort});
  const release=e=>{s.dragging=false;if(s.canvas.hasPointerCapture(e.pointerId))s.canvas.releasePointerCapture(e.pointerId);schedule();};
  s.canvas.addEventListener('pointerup',release,{signal:abort});s.canvas.addEventListener('pointercancel',release,{signal:abort});
  s.canvas.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown'].includes(e.key))return;e.preventDefault();s.pose={...s.pose,yaw:s.pose.yaw+(e.key==='ArrowLeft'?-8:e.key==='ArrowRight'?8:0),tilt:Math.max(-70,Math.min(70,s.pose.tilt+(e.key==='ArrowUp'?5:e.key==='ArrowDown'?-5:0))),phase:'spin'};paint(s);},{signal:abort});
}
function remove(s){
  saved.set(s.key,{pose:s.pose,paused:s.paused,night:s.night});observer.unobserve(s.host);s.resize.disconnect();s.events.abort();s.quality?.destroy();disposeTree(s.scene);s.renderer?.dispose();scenes.delete(s.host);
}
export function mountDotAir(){
  if(closed)return;
  for(const s of [...scenes.values()])if(!s.host.isConnected)remove(s);
  for(const node of artNodes)if(!node.isConnected){(artAnimations.get(node)||[]).forEach(a=>a.cancel());observer.unobserve(node);artAnimations.delete(node);artNodes.delete(node);}
  document.querySelectorAll('[data-dot-air-art]').forEach(node=>{if(!artNodes.has(node)){artNodes.add(node);observer.observe(node);}});
  document.querySelectorAll('[data-dot-air-globe]').forEach((host,i)=>{
    if(scenes.has(host))return;
    const key=host.closest('[data-da-exhibit]')?.id||host.closest('.milestone')?.getAttribute('aria-labelledby')||host.closest('.da-art')&&'post-cover'||host.closest('.da-now-inner')&&'now'||'earth-'+i;
    const state=saved.get(key);const s={host,key,pose:state?.pose||initialOrbit(),paused:state?.paused||false,night:state?.night||false,remounted:Boolean(state),canvas:host.querySelector('canvas'),pin:host.querySelector('.da-pin'),events:new AbortController(),visible:false,loading:false,entrance:1,times:[]};
    scenes.set(host,s);s.resize=new ResizeObserver(()=>resize(s));s.resize.observe(host);install(s);observer.observe(host);refresh(s);
  });schedule();
}
function click(e){
  const button=e.target.closest('[data-da-airport],[data-da-pause],[data-da-light]');if(!button)return;
  const host=button.closest('[data-da-exhibit]')?.querySelector('[data-dot-air-globe]'),s=scenes.get(host);if(!s)return;
  if(button.dataset.daAirport){s.pose=selectAirport(s.pose,dotAirAirports.find(a=>a.code===button.dataset.daAirport));if(isMotionPaused()||s.paused)s.pose=advanceOrbit(s.pose,0,{reduced:true});makeRoute(s);}
  if(button.hasAttribute('data-da-pause'))s.paused=!s.paused;
  if(button.hasAttribute('data-da-light'))s.night=!s.night;
  refresh(s);schedule();
}
function motion(){
  for(const s of scenes.values())if(isMotionPaused()){s.entrance=1;if(systemReducesMotion())s.pose=advanceOrbit(s.pose,0,{reduced:true});}
  for(const s of scenes.values())refresh(s);
  for(const [node,animations] of artAnimations)for(const a of animations){if(isMotionPaused()){a.finish();a.cancel();}else if(node.classList.contains('da-visible')&&!document.hidden)a.play();else a.pause();}
  schedule();
}
const stopMotion=onMotionChange(motion);
document.addEventListener('dot-air:render',mountDotAir);document.addEventListener('click',click);
document.addEventListener('visibilitychange',schedule);
const dialogObserver=new MutationObserver(schedule);document.querySelectorAll('dialog').forEach(d=>dialogObserver.observe(d,{attributes:true,attributeFilter:['open']}));
window.addEventListener('pagehide',e=>{if(frame)cancelAnimationFrame(frame);frame=0;last=0;if(e.persisted)return;closed=true;controller.abort();stopMotion();observer.disconnect();dialogObserver.disconnect();for(const s of [...scenes.values()])remove(s);for(const a of artAnimations.values())a.forEach(v=>v.cancel());artAnimations.clear();document.removeEventListener('dot-air:render',mountDotAir);document.removeEventListener('click',click);document.removeEventListener('visibilitychange',schedule);});
window.addEventListener('pageshow',e=>{if(e.persisted)schedule();});
mountDotAir();
