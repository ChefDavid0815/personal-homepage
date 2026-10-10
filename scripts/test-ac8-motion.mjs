import test from 'node:test';
import assert from 'node:assert/strict';
import {initialFlight,selectFlightView,launchTrail,advanceFlight,missileAt,flightPose} from '../dist/ac8-state.js';
import {beginRecord,acceptRecord,failRecord} from '../dist/ac8-record-state.js';
test('view reversal accepts latest intent and retains pose and velocity',()=>{
 let s=selectFlightView(initialFlight(),2);for(let i=0;i<12;i++)s=advanceFlight(s,16);
 const next=selectFlightView(s,0);assert.equal(next.position,s.position);assert.equal(next.velocity,s.velocity);
 for(let i=0;i<250;i++)s=advanceFlight(i===0?next:s,16);assert.ok(Math.abs(s.position)<.0001);
});
test('launch pressure is bounded, pause freezes and reduced motion settles safely',()=>{
 let s=initialFlight();for(let i=0;i<12;i++)s=launchTrail(s);assert.equal(s.launches.length,3);
 assert.deepEqual(advanceFlight(s,1000,true),s);assert.deepEqual(advanceFlight(s,5000),advanceFlight(s,50));
 const reduced=advanceFlight(selectFlightView(s,2),0,false,true);assert.equal(reduced.position,2);assert.equal(reduced.launches.length,0);
 for(const p of [-1,0,.5,1,3]){const m=missileAt(p);assert.ok(Object.values(m).every(Number.isFinite));assert.ok(m.opacity>=0&&m.opacity<=1);}
 assert.ok(Object.values(flightPose(s)).every(Number.isFinite));
 const geometry={origin:[330,510],heading:-40,target:[850,220]};assert.equal(missileAt(0,0,geometry).x,330);assert.equal(missileAt(0,0,geometry).y,510);assert.equal(missileAt(1,0,geometry).x,850);assert.equal(missileAt(1,0,geometry).y,220);assert.ok(Math.abs(missileAt(0,0,geometry).angle+40)<.0001);
});
test('late or failed record requests cannot replace a newer record or invent zero',()=>{
 const now=Date.parse('2026-10-09T12:00:00Z');const record={version:1,appId:2288340,scope:'steam-local',collectedAt:new Date(now).toISOString(),sourceUpdatedAt:new Date(now).toISOString(),playtimeMinutes:254,recentPlaytimeMinutes:254,lastPlayedAt:null};
 let s=beginRecord({request:0,status:'snapshot',lastGood:null});s=beginRecord(s);s=acceptRecord(s,record,2,now);
 assert.equal(acceptRecord(s,{...record,playtimeMinutes:0},1,now),s);assert.equal(failRecord(s,1),s);
 const failed=failRecord(s,2);assert.equal(failed.lastGood.playtimeMinutes,254);assert.equal(failed.status,'unavailable');
});
