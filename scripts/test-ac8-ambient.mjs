import test from 'node:test';
import assert from 'node:assert/strict';
import {ambientEnemies,enemyPose,contourPaths,emitCountermeasures,expireCountermeasures,countermeasureAt} from '../dist/ac8-ambient-state.js';
import {initialFlight,advanceFlight} from '../dist/ac8-state.js';

test('persistent formations grow, recycle stable identities and stay bounded over hours',()=>{
 assert.ok(ambientEnemies(0).length>=2);
 assert.ok(ambientEnemies(12).length>ambientEnemies(0).length);
 for(const t of [0,2,9,22,28,60,3600,86400]){
  const jets=ambientEnemies(t);assert.ok(jets.length<=8 && jets.length>=2);
  assert.ok(ambientEnemies(t,true).length<=4);
  assert.equal(new Set(jets.map(j=>j.id)).size,jets.length);
  for(const jet of jets)assert.ok(Object.values(enemyPose(jet)).every(Number.isFinite));
 }
 const a=ambientEnemies(13),b=ambientEnemies(13.016);
 for(const jet of a){const next=b.find(j=>j.id===jet.id);if(next){assert.ok(Math.abs(enemyPose(next).x-enemyPose(jet).x)<.01);}}
});
test('contours really change shape with stable topology and deterministic samples',()=>{
 const a=contourPaths(0),b=contourPaths(9);assert.equal(a.length,20);assert.equal(b.length,20);
 assert.deepEqual(a,contourPaths(0));assert.notDeepEqual(a,b);
 for(let i=0;i<a.length;i++){assert.equal(a[i].replace(/[-\d.]+/g,''),b[i].replace(/[-\d.]+/g,''));assert.ok(!/NaN|Infinity/.test(b[i]));}
});
test('flare bursts retain launch geometry, decay and freeze with the shared flight clock',()=>{
 const geometry={origin:[340,510],heading:128};let s=initialFlight();
 for(let i=0;i<20;i++)s=emitCountermeasures(s,geometry);
 assert.equal(s.flares.length,2);assert.equal(s.flareSerial,20);
 assert.deepEqual(advanceFlight(s,50,true),s);
 const changed={origin:[900,50],heading:-10};s=emitCountermeasures(s,changed);
 assert.deepEqual(s.flares[0].geometry,geometry);assert.deepEqual(s.flares[1].geometry,changed);
 for(const p of [0,.1,.5,1])for(let i=0;i<7;i++){const f=countermeasureAt(p,i,geometry);assert.ok(Object.values(f).every(Number.isFinite));assert.ok(f.opacity>=0&&f.opacity<=1);}
 const desktop=countermeasureAt(.7,3,geometry),mobile=countermeasureAt(.7,3,{...geometry,distanceScale:.48});
 assert.ok(Math.hypot(mobile.x-340,mobile.y-510)<Math.hypot(desktop.x-340,desktop.y-510)*.5);
 assert.equal(expireCountermeasures({...s,clock:6}).flares.length,0);
 const reduced=advanceFlight(s,16,false,true);assert.equal(reduced.flares.length,0);
});
