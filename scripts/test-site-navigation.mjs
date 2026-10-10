import test from 'node:test';
import assert from 'node:assert/strict';
import {siteRoutes,routeFor,routeTrail,projectHref,projectLocation,articleHref,articleReturnHref,collectionDestinations} from '../dist/site-routes.js';
import {buildCatalog,filterCatalog} from '../dist/site-catalog.js';
test('every owned page has one identity and an acyclic route to its parent',()=>{
  assert.equal(new Set(siteRoutes.map(r=>r.id)).size,siteRoutes.length);
  assert.equal(new Set(siteRoutes.map(r=>r.file)).size,siteRoutes.length);
  for(const route of siteRoutes){const trail=routeTrail('/'+route.file);assert.equal(trail.at(-1).id,route.id);assert.equal(new Set(trail.map(r=>r.id)).size,trail.length);}
  assert.deepEqual(routeTrail('/nerf.html').map(r=>r.id),['gallery','school','nerf']);
  assert.deepEqual(routeTrail('/reset-history/').map(r=>r.id),['explore','radar','archive']);
  assert.equal(routeFor('/').id,'profile');assert.equal(routeFor('/missing.html'),null);
});
test('project sharing preserves unrelated URL state and can close back to the same collection',()=>{
  const original='https://chefzc.dev/gallery.html?edition=2026#project-nba-after-hours';
  const opened=projectLocation(original,'nba-after-hours');
  assert.equal(opened.searchParams.get('project'),'nba-after-hours');assert.equal(opened.searchParams.get('edition'),'2026');assert.equal(opened.hash,'#project-nba-after-hours');
  assert.equal(projectLocation(opened,null).href,original);assert.equal(projectHref('nba-after-hours'),'./gallery.html?project=nba-after-hours');
  assert.throws(()=>projectHref('../not-a-project'),TypeError);
});
test('an article returns to its stable card identity instead of the top of the list',()=>{
  assert.equal(articleHref('nerf'),'./post.html?article=nerf');assert.equal(articleReturnHref('nerf'),'./posts.html#post-nerf');
});
test('every collection uses the same order and the actual current project count',()=>{
  const rooms=collectionDestinations(9);assert.deepEqual(rooms.map(r=>r.id),['live','main','school','models']);assert.equal(rooms[1].count,9);assert.equal(collectionDestinations(12)[1].count,12);assert.equal(rooms[1].href,'./gallery.html#projects');
});
const projects=[{id:'test-work',name:'Color Lab',description:'彩色工具',translations:{en:{description:'A colorful tool'}},tags:['TypeScript']}];
const posts=[{id:'nerf-note',date:'2026-10-07',zh:{title:'神经网络手记',summary:'看见一个世界',category:'研究'},en:{title:'NeRF study',summary:'A world appears',category:'Research'}}];
test('catalogue keeps each work and note and gives every entry a unique identity and destination',()=>{
  const catalog=buildCatalog(projects,posts);assert.equal(catalog.filter(r=>r.group==='works').length,7);assert.equal(catalog.filter(r=>r.group==='notes').length,1);assert.equal(new Set(catalog.map(r=>r.id)).size,catalog.length);assert.equal(new Set(catalog.map(r=>r.href)).size,catalog.length);
  assert.ok(catalog.some(r=>r.href==='./models-gallery.html#project-curry-head'));assert.ok(catalog.some(r=>r.href==='./post.html?article=nerf-note'));
});
test('search supports both languages, normalized characters, conjunctive terms and a recoverable empty state',()=>{
  const catalog=buildCatalog(projects,posts);
  assert.equal(filterCatalog(catalog,{query:'神经',group:'notes'}).length,1);
  assert.equal(filterCatalog(catalog,{query:'ＮｅＲＦ',group:'works'}).length,1);
  assert.equal(filterCatalog(catalog,{query:'NeRF 2026',group:'notes'}).length,1);
  assert.equal(filterCatalog(catalog,{query:'not-an-existing-result'}).length,0);
  assert.equal(filterCatalog(catalog,{query:''}).length,catalog.length);
});
