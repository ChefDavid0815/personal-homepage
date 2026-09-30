import test from 'node:test';
import assert from 'node:assert/strict';
import {HISTORY_EVENTS} from '../dist/reset-history/data.js';
import {historyStats, mergeHistory, sourceUrl} from '../dist/reset-history/model.js';

test('reviewed archive keeps distinct, attributable milestones', () => {
  assert.equal(new Set(HISTORY_EVENTS.map(event => event.id)).size, HISTORY_EVENTS.length);
  assert.deepEqual(historyStats(HISTORY_EVENTS), {
    total: 10, banked: 5, automatic: 5,
    earliest: '2026-08-22T00:50:36Z', latest: '2026-09-26T18:17:54Z'
  });
  const postIds=HISTORY_EVENTS.flatMap(event => event.sources.map(source => source.postId).filter(Boolean));
  assert.deepEqual(HISTORY_EVENTS[0].sources.map(source=>source.postId),['2103637477760311522','2103911959544610829']);
  assert.equal(new Set(postIds).size, postIds.length, 'one Tibo post should belong to only one milestone');
  for(const event of HISTORY_EVENTS){
    assert.ok(Number.isFinite(Date.parse(event.at)),event.id);
    assert.ok(['announcement','completion'].includes(event.basis),event.id);
    assert.ok(['banked','automatic'].includes(event.type),event.id);
    assert.ok(event.title.en&&event.title.zh&&event.summary.en&&event.summary.zh,event.id);
    assert.ok(event.sources.length>0,event.id);
    assert.ok(event.sources.every(sourceUrl),event.id);
  }
});

test('banked-grant dates and the global reset retain official corroboration', () => {
  for(const id of ['2026-09-03-banked','2026-09-04-banked','2026-09-07-automatic']){
    assert.ok(HISTORY_EVENTS.find(event => event.id===id)?.sources.some(source => source.url?.startsWith('https://help.openai.com/')),id);
  }
  assert.equal(HISTORY_EVENTS.find(event => event.id==='2026-09-22-banked').basis,'announcement');
  assert.equal(HISTORY_EVENTS.find(event => event.id==='2026-09-09-banked-replacement').state,'targeted');
});

test('live additions include observed reports only and do not duplicate reviewed sources', () => {
  const at='2026-09-22T19:30:00Z';
  const signal=(id,kind,stage)=>({id,kind,stage,handle:'thsottiaux',createdAt:at});
  const events=mergeHistory(HISTORY_EVENTS,[
    signal('2102463847714247142','banked','announced'),
    signal('2102500000000000001','banked','planned'),
    signal('2102500000000000002','hint'),
    signal('2102500000000000003','banked','announced'),
    signal('2102500000000000004','confirmed'),
    signal('2102500000000000004','confirmed'),
    {...signal('2102500000000000005','confirmed'),handle:'someone_else'},
    {...signal('2102500000000000006','confirmed'),createdAt:'2026-09-23T19:30:00Z'}
  ],Date.parse('2026-09-22T20:00:00Z'));
  assert.equal(events.length,HISTORY_EVENTS.length+2);
  assert.equal(events.filter(event=>event.state==='unreviewed').length,2);
  assert.equal(events[0].id,'2026-09-26-automatic');
  assert.equal(events[1].type,'banked');
  assert.equal(events[2].type,'automatic');
  assert.equal(events.at(-1).id,'2026-08-21-banked');
});
