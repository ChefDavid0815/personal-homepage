import test from 'node:test';
import assert from 'node:assert/strict';
import {initialOrbit,selectAirport,advanceOrbit,unit,arc} from '../dist/dot-air-state.js';
import {dotAirAirports,dotAirPost,dotAirProject} from '../dist/dot-air-content.js';
import {buildCatalog} from '../dist/site-catalog.js';
import {siteRoutes} from '../dist/site-routes.js';
import {createQualityGovernor} from '../dist/dot-air-quality.js';
import {dotAirReleases} from '../dist/dot-air-releases.js';
import {readFile} from 'node:fs/promises';

test('geography stays on the sphere, including an antipodal journey',()=>{
  assert.deepEqual(unit(0,0),[0,0,1]);
  for(const t of [0,.25,.5,.75,1])assert.ok(Math.abs(Math.hypot(...arc(unit(0,0),unit(180,0),t))-1)<1e-9);
});
test('airport changes choose the short turn and preserve pose and velocity',()=>{
  const state={...initialOrbit(),yaw:350,velocity:12};
  const next=selectAirport(state,{code:'TEST',lon:5,lat:20});
  assert.equal(next.yaw,350);assert.equal(next.velocity,12);assert.equal(next.targetYaw,365);
  assert.deepEqual(advanceOrbit(next,1000,{paused:true}),next);
  assert.equal(advanceOrbit(next,16,{reduced:true}).yaw,365);
});
test('focus settles, holds, resumes, and reverse input retains momentum',()=>{
  let state=selectAirport(initialOrbit(),dotAirAirports[1]);
  for(let i=0;i<350;i++)state=advanceOrbit(state,16,{});
  assert.equal(state.phase,'spin');
  const newer=selectAirport(state,dotAirAirports[3]);
  assert.equal(newer.yaw,state.yaw);assert.equal(newer.velocity,state.velocity);
  const clamped=advanceOrbit(newer,5000,{}),normal=advanceOrbit(newer,50,{});
  assert.deepEqual(clamped,normal);
});
test('new project and journal link to one discoverable exhibit without changing old ones',()=>{
  const catalogue=buildCatalog([dotAirProject],[dotAirPost]);
  assert.ok(catalogue.some(item=>item.href==='./gallery.html?project=dot-air'));
  assert.ok(catalogue.some(item=>item.href==='./post.html?article=dot-air'));
  assert.equal(dotAirPost.number,'17');assert.equal(dotAirPost.date,'2026-10-09');
  for(const language of ['zh','en'])assert.equal(dotAirPost[language].sections.length,4);
});
test('retired AER has no independent route and no remaining Now entries',async()=>{
  assert.equal(siteRoutes.some(p=>p.id==='aer'),false);
  const now=await readFile(new URL('../dist/now.html',import.meta.url),'utf8');
  assert.equal(now.includes('milestone--aer'),false);
  assert.equal((now.match(/class="timeline-entry[\s"]/g)||[]).length,32);
});
test('the exhibit follows the verified latest software release',()=>assert.equal(dotAirProject.version,'2.0.0'));
test('the edition log records both real releases, newest first, with bilingual changes',()=>{
  assert.deepEqual(dotAirReleases.map(r=>r.version),['2.0.0','1.2.0','1.1.0','0.1.0']);
  assert.equal(dotAirReleases[0].version,dotAirProject.version);
  assert.equal(dotAirReleases.filter(r=>r.current).length,1);
  for(const r of dotAirReleases){assert.equal(r.date,r.version==='2.0.0'?'2026-10-10':'2026-10-09');for(const pair of [r.title,r.intro,r.note,...r.changes.flatMap(c=>[c.title,c.copy])]){assert.equal(pair.length,2);assert.ok(pair.every(s=>s.length>0));}}
});
test('frame pacing adapts after sustained pressure, recovers more slowly and ignores inactivity',()=>{
  const q=createQualityGovernor({targetFrameMs:16.7,windowMs:200,minSamples:5,badWindows:2,goodWindows:4,cooldownMs:100});
  let time=0;q.sample(time);for(let i=0;i<8;i++)q.sample(time+=40);
  assert.equal(q.snapshot().level,'high');
  for(let i=0;i<12;i++)q.sample(time+=40);
  assert.ok(['medium','low'].includes(q.snapshot().level));
  q.sample(time+=10000,{active:false});const level=q.snapshot().level;
  q.sample(time+=10000);assert.equal(q.snapshot().level,level);
  for(let i=0;i<160;i++)q.sample(time+=16);
  assert.equal(q.snapshot().level,'high');q.destroy();
  q.sample(time+=40);assert.equal(q.snapshot().disposed,true);
});
