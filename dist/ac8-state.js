import {advanceSpring} from './flow-state.js';
import {expireCountermeasures} from './ac8-ambient-state.js';
export const initialFlight=()=>({position:0,velocity:0,target:0,clock:0,launches:[],serial:0,flares:[],flareSerial:0});
export const selectFlightView=(s,target)=>Number.isInteger(target)&&target>=0&&target<=2?{...s,target}:s;
export function launchTrail(s,geometry=null){const serial=s.serial+1;return {...s,serial,launches:[...s.launches,{id:serial,start:s.clock,geometry}].slice(-3)};}
export function advanceFlight(s,milliseconds,paused=false,reduced=false){
 if(reduced)return{...s,position:s.target,velocity:0,launches:[],flares:[]};
 if(paused)return s;
 const dt=Math.max(0,Math.min(50,milliseconds));const next=advanceSpring({...s},dt,7);const clock=s.clock+dt/1000;
 return expireCountermeasures({...s,position:next.position,velocity:next.velocity,clock,launches:s.launches.filter(l=>clock-l.start<3.4)});
}
export function missileCurve(offset=0,geometry=null){
 if(geometry){const a=geometry.origin,angle=geometry.heading*Math.PI/180,d=geometry.target;return[a,[a[0]+Math.cos(angle)*160,a[1]+Math.sin(angle)*160],[d[0]-180,d[1]+100+offset],[d[0],d[1]+offset]];}
 return[[550,400+offset],[710,430+offset],[840,190],[1130,90+offset]];
}
export function missileAt(progress,offset=0,geometry=null){
 const p=Math.max(0,Math.min(1,progress)),u=1-p;
 const [a,b,c,d]=missileCurve(offset,geometry);
 const x=u*u*u*a[0]+3*u*u*p*b[0]+3*u*p*p*c[0]+p*p*p*d[0];
 const y=u*u*u*a[1]+3*u*u*p*b[1]+3*u*p*p*c[1]+p*p*p*d[1];
 const dx=3*u*u*(b[0]-a[0])+6*u*p*(c[0]-b[0])+3*p*p*(d[0]-c[0]);
 const dy=3*u*u*(b[1]-a[1])+6*u*p*(c[1]-b[1])+3*p*p*(d[1]-c[1]);
 return{x,y,angle:Math.atan2(dy,dx)*180/Math.PI,opacity:Math.min(1,p*16,(1-p)*9)};
}
export function flightPose(s){const p=Math.max(0,Math.min(2,s.position));return{planeX:Math.sin(s.clock*.45)*7+p*14,planeY:Math.cos(s.clock*.35)*5-p*12,roll:128+p*8+Math.sin(s.clock*.5)*1.8,mapX:-p*12,mapY:p*8,scan:(s.clock%9)/9,view:p};}
