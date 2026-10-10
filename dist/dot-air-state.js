// Spherical geography and a retargetable orbit. Degrees, milliseconds; no DOM owner.
import {advanceSpring} from './flow-state.js';
const rad=Math.PI/180;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const dot=(a,b)=>a.reduce((sum,v,i)=>sum+v*b[i],0);
const norm=v=>v.map(x=>x/Math.hypot(...v));
export const unit=(lon,lat)=>[Math.cos(lat*rad)*Math.sin(lon*rad),Math.sin(lat*rad),Math.cos(lat*rad)*Math.cos(lon*rad)];
export function arc(a,b,t){
  t=clamp(t,0,1);if(t===0)return a;if(t===1)return b;
  const d=clamp(dot(a,b),-1,1);
  if(d>.999999)return norm(a.map((v,i)=>v*(1-t)+b[i]*t));
  if(d<-.999999){const axis=Math.abs(a[1])<.9?[0,1,0]:[1,0,0],projection=dot(axis,a),tangent=norm(axis.map((v,i)=>v-a[i]*projection));return norm(a.map((v,i)=>v*Math.cos(Math.PI*t)+tangent[i]*Math.sin(Math.PI*t)));}
  const theta=Math.acos(d);return norm(a.map((v,i)=>(v*Math.sin((1-t)*theta)+b[i]*Math.sin(t*theta))/Math.sin(theta)));
}
export const initialOrbit=()=>({yaw:55.37,tilt:18,velocity:0,tiltVelocity:0,targetYaw:55.37,targetTilt:18,code:'DXB',phase:'spin',hold:0,clock:0});
export function selectAirport(s,airport){
  if(s.code===airport.code)return s;
  const delta=((airport.lon-s.yaw)%360+540)%360-180;
  return {...s,code:airport.code,targetYaw:s.yaw+delta,targetTilt:airport.lat*.65,phase:'focus',hold:0};
}
export function advanceOrbit(s,milliseconds,{paused=false,reduced=false}={}){
  if(reduced)return {...s,yaw:s.targetYaw,tilt:s.targetTilt,velocity:0,tiltVelocity:0,phase:'hold'};
  if(paused)return s;
  const dt=clamp(milliseconds,0,50)/1000;let next={...s,clock:s.clock+dt};
  if(s.phase==='focus'){
    const yaw=advanceSpring({position:s.yaw,velocity:s.velocity,target:s.targetYaw},dt*1000,5.5);
    const tilt=advanceSpring({position:s.tilt,velocity:s.tiltVelocity,target:s.targetTilt},dt*1000,5.5);
    next={...next,yaw:yaw.position,velocity:yaw.velocity,tilt:tilt.position,tiltVelocity:tilt.velocity};
    if(Math.abs(next.yaw-s.targetYaw)<.04&&Math.abs(next.velocity)<.1)next={...next,yaw:s.targetYaw,tilt:s.targetTilt,velocity:0,tiltVelocity:0,phase:'hold',hold:1.8};
  }else if(s.phase==='hold')next={...next,hold:Math.max(0,s.hold-dt),phase:s.hold<=dt?'spin':'hold'};
  else{next.velocity=s.velocity+(360/72-s.velocity)*(1-Math.exp(-dt*3));next.yaw=s.yaw+next.velocity*dt;}
  return next;
}
