import test from 'node:test';
import assert from 'node:assert/strict';
import {costOf,selectRange} from '../dist/usage-math.js';
import {validateSnapshot} from '../lib/usage-schema.js';
import handler from '../api/usage.js';
const row={hour:'2026-09-20T23:00:00+04:00',model:'gpt-6-astra',context:'short',input:1000000,cached:600000,write:100000,output:100000,reasoning:80000,total:1100000,events:1};
const snapshot={version:1,collectedAt:'2026-09-20T19:30:00Z',firstEventAt:'2026-09-20T19:00:00Z',lastEventAt:'2026-09-20T19:00:00Z',sourceCount:1,hours:[row]};
test('cost separates cache reads/writes and never adds reasoning twice',()=>{assert.equal(costOf(row),9.85);assert.equal(costOf({...row,context:'long'}),17.2);assert.equal(costOf({...row,model:'unknown'}),null);assert.equal(costOf({...row,context:'unknown'}),null);});
test('GPT-6 Sol and Luna use published Standard prices, including long context',()=>{
  for(const [model,short,long] of [['gpt-6-sol',1.97,3.44],['gpt-6-luna',.0985,.172]]) {
    assert.ok(Math.abs(costOf({...row,model})-short)<1e-10);
    assert.ok(Math.abs(costOf({...row,model,context:'long'})-long)<1e-10);
    const result=selectRange({...snapshot,hours:[{...row,model}]},'lifetime',Date.parse('2026-09-20T19:30:00Z'));
    assert.equal(result.total.unpriced,0);
    assert.ok(Math.abs(result.total.cost-short)<1e-10);
  }
});
test('GPT-6.1 Sol prices cached reads separately and reprices retained records in every range',()=>{
  const model='gpt-6.1-sol';
  assert.ok(Math.abs(costOf({...row,model})-1.91)<1e-10);
  assert.ok(Math.abs(costOf({...row,model,context:'long'})-3.32)<1e-10);
  for(const range of ['today','7d','30d','lifetime']) {
    const result=selectRange({...snapshot,hours:[{...row,model}]},range,Date.parse('2026-09-20T19:30:00Z'));
    assert.equal(result.total.total,row.total);
    assert.equal(result.total.unpriced,0);
    assert.ok(Math.abs(result.total.cost-1.91)<1e-10);
    assert.equal(result.models[0].model,model);
    assert.equal(result.models[0].unpriced,0);
    assert.equal(result.bins.reduce((sum,bin)=>sum+bin.total,0),row.total);
  }
  assert.equal(costOf({...row,model,context:'unknown'}),null);
  assert.equal(costOf({...row,model:'gpt-6.1-unpublished'}),null);
});
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

test('Claude rows price 5-minute and 1-hour cache writes separately', async () => {
  const {costOf} = await import('../dist/usage-math.js');
  const row = {model:'claude-opus-5-5',context:'short',input:1_000_000+2_000_000+3_000_000,cached:3_000_000,write:2_000_000,write1h:500_000,output:1_000_000};
  // 1M uncached x $4 + 3M reads x $0.20 + 1.5M 5-min writes x $5 + 0.5M 1-hour writes x $8 + 1M output x $20
  assert.equal(Math.round(costOf(row)*100)/100, 4+0.6+7.5+4+20);
  const haiku = {model:'claude-haiku-5-5',context:'long',input:200_000,cached:0,write:0,write1h:0,output:0};
  assert.equal(Math.round(costOf(haiku)*1e4)/1e4, 0.1);
});
