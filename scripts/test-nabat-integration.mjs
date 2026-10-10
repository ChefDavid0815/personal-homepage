import test from 'node:test';
import assert from 'node:assert/strict';
import { collectionDestinations } from '../dist/site-routes.js';
import { buildCatalog, filterCatalog } from '../dist/site-catalog.js';
import {selectNabatView,advanceNabatView,nabatPose} from '../dist/nabat-state.js';
import {nabatPost} from '../dist/nabat-content.js';

test('school collection count includes NABAT without changing the other rooms', () => {
  const rooms = collectionDestinations(9);
  assert.equal(rooms.find(room => room.id === 'school').count, 3);
  assert.equal(rooms.find(room => room.id === 'main').count, 9);
  assert.equal(rooms.find(room => room.id === 'models').count, 2);
});

test('reversing a view retains its current pose and velocity while accepting the latest intent', () => {
  let state=selectNabatView({selected:'identity',position:0,velocity:0,target:0},'operations');
  for(let i=0;i<12;i++)state=advanceNabatView(state,16);
  assert.ok(state.position>0 && state.position<2);
  const reversed=selectNabatView(state,'identity');
  assert.equal(reversed.position,state.position);
  assert.equal(reversed.velocity,state.velocity);
  assert.equal(reversed.target,0);
  assert.equal(reversed.selected,'identity');
  const latest=selectNabatView(reversed,'history');
  for(let i=0;i<240;i++)state=advanceNabatView(i===0?latest:state,16);
  assert.ok(Math.abs(state.position-1)<.001);
  assert.throws(()=>selectNabatView(state,'missing'),RangeError);
  assert.equal(state.selected,'history');
});

test('scene geometry is finite and bounded, and both authored notes retain the INJAZ identity', () => {
  assert.deepEqual(nabatPose(-5),{history:0,operations:0});
  assert.deepEqual(nabatPose(5),{history:1,operations:1});
  assert.throws(()=>nabatPose(Infinity),TypeError);
  assert.equal(nabatPost.date,'2026-10-09');
  assert.equal(nabatPost.link,'./school-gallery.html#project-nabat');
  for(const lang of ['zh','en']){
    assert.ok(nabatPost[lang].category.includes('INJAZ'));
    assert.equal(nabatPost[lang].sections.length,4);
  }
});

test('the real catalogue exposes NABAT through a stable school exhibit link', () => {
  const catalog = buildCatalog([], []);
  const result = filterCatalog(catalog, {query: 'NABAT', group: 'works'});
  assert.equal(result.length, 1);
  assert.equal(result[0].href, './school-gallery.html#project-nabat');
  assert.ok(catalog.some(item => item.href === './nerf.html'));
  assert.ok(catalog.some(item => item.href === './school-gallery.html#project-wis-tech-tank'));
});
