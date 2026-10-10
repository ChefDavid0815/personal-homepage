// Fictional, deterministic showcase choreography. No combat or Steam telemetry.
const clamp=v=>Math.max(0,Math.min(1,v));
export function ambientEnemies(clock,narrow=false){
 const t=Math.max(0,Number.isFinite(clock)?clock:0),latest=Math.floor((t+5.6)/2.8),jets=[];
 for(let id=Math.max(0,latest-8);id<=latest;id++){
  const age=t-(id*2.8-5.6);if(age>=0&&age<22.2)jets.push({id,age});
 }
 return jets.slice(narrow?-4:-8);
}
export function enemyPose({id,age}){
 const p=clamp(age/22.2),phase=id*.73;
 return{x:1.08-p*1.3,y:.18+(id%4)*.105+Math.sin(p*Math.PI)*.13+Math.sin(age*.35+phase)*.012,
  heading:Math.atan2(Math.cos(p*Math.PI)*.13*Math.PI,-1.3)*180/Math.PI,
  opacity:Math.min(1,age/.7,(22.2-age)/1.4),size:62+(id%3)*9};
}
const mountains=[[185,380,155,1.1],[430,170,120,.84],[745,465,190,.95],[1030,200,175,.78]];
export function contourPaths(clock){
 const t=Number.isFinite(clock)?clock:0,paths=[];
 for(let m=0;m<mountains.length;m++)for(let level=0;level<5;level++){
  const [cx,cy,r,stretch]=mountains[m],radius=r+level*24,points=[];
  for(let i=0;i<48;i++){
   const a=i*Math.PI/24,wave=1+.075*Math.sin(a*3+t*.24+m)+.045*Math.cos(a*5-t*.17+level*.25);
   const x=cx+Math.sin(t*.13+m)*16+Math.cos(a)*radius*wave;
   const y=cy+Math.cos(t*.11+m)*13+Math.sin(a)*radius*stretch*wave;
   points.push([x,y]);
  }
  // A closed cardinal curve has the same control topology at every sample.
  let d=`M${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for(let i=0;i<48;i++){
   const a=points[(i+47)%48],b=points[i],c=points[(i+1)%48],e=points[(i+2)%48];
   d+=`C${(b[0]+(c[0]-a[0])/6).toFixed(1)} ${(b[1]+(c[1]-a[1])/6).toFixed(1)} ${(c[0]-(e[0]-b[0])/6).toFixed(1)} ${(c[1]-(e[1]-b[1])/6).toFixed(1)} ${c[0].toFixed(1)} ${c[1].toFixed(1)}`;
  }
  paths.push(d+'Z');
 }
 return paths;
}
export function emitCountermeasures(s,geometry){
 const flareSerial=(s.flareSerial||0)+1;
 return{...s,flareSerial,flares:[...(s.flares||[]),{id:flareSerial,start:s.clock,geometry}].slice(-2)};
}
export const expireCountermeasures=s=>({...s,flares:(s.flares||[]).filter(f=>s.clock-f.start<4.8)});
export function countermeasureAt(progress,index,geometry){
 const p=clamp(progress),fan=(index-3)*16.5,angle=(geometry.heading+180+fan)*Math.PI/180;
 const distance=geometry.distanceScale??1,travel=190*(1-Math.exp(-2.7*p))*distance,fall=65*p*p*distance;
 return{x:geometry.origin[0]+Math.cos(angle)*travel,y:geometry.origin[1]+Math.sin(angle)*travel+fall,
  angle:Math.atan2(Math.sin(angle)*513*Math.exp(-2.7*p)+130*p,Math.cos(angle)*513*Math.exp(-2.7*p))*180/Math.PI,
  width:38+65*p,opacity:Math.min(1,p*16,Math.max(0,1-p)*2),glow:1-p*.5};
}
