import test from 'node:test';
import assert from 'node:assert/strict';
import {costOf,selectRange} from '../dist/usage-math.js';
import {validateSnapshot} from '../lib/usage-schema.js';
import handler from '../api/usage.js';
const row={hour:'2026-09-20T23:00:00+04:00',model:'gpt-6-astra',context:'short',input:1000000,cached:600000,write:100000,output:100000,reasoning:80000,total:1100000,events:1};
const snapshot={version:1,collectedAt:'2026-09-20T19:30:00Z',firstEventAt:'2026-09-20T19:00:00Z',lastEventAt:'2026-09-20T19:00:00Z',sourceCount:1,hours:[row]};
test('cost separates cache reads/writes and never adds reasoning twice',()=>{assert.equal(costOf(row),9.85);assert.equal(costOf({...row,context:'long'}),17.2);assert.equal(costOf({...row,model:'unknown'}),null);assert.equal(costOf({...row,context:'unknown'}),null);});
test('Dubai day boundary, rolling calendar windows and uncovered history',()=>{
  assert.equal(selectRange(snapshot,'today',Date.parse('2026-09-20T19:30:00Z')).total.total,1100000);
  assert.equal(selectRange(snapshot,'today',Date.parse('2026-09-20T20:01:00Z')).total.total,0);
  const week=selectRange(snapshot,'7d',Date.parse('2026-09-20T20:01:00Z'));
  assert.equal(week.bins.length,7);assert.equal(week.total.total,1100000);assert.equal(week.bins[0].covered,false);
});
test('public schema strips private material and rejects overlapping/duplicate counts',()=>{
  const clean=validateSnapshot({...snapshot,prompt:'secret',apiKey:'secret',hours:[{...row,path:'C:/private'}]});
  assert.equal(JSON.stringify(clean).includes('secret'),false);assert.equal('path' in clean.hours[0],false);
  assert.throws(()=>validateSnapshot({...snapshot,hours:[{...row,cached:1000001}]}));
  assert.throws(()=>validateSnapshot({...snapshot,hours:[row,row]}));
});
test('ingestion rejects an unauthenticated writer before storage',async()=>{
  let code,body;const response={setHeader(){},status(value){code=value;return this;},json(value){body=value;}};
  await handler({method:'POST',headers:{},body:snapshot},response);assert.equal(code,401);assert.equal(body.error,'Unauthorized');
});
