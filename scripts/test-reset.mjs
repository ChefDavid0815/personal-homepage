import test from 'node:test';
import assert from 'node:assert/strict';
import * as resetModel from '../dist/when-to-reset/model.js';
const {classify,excerpt,forecast,midnight,normalizePost,normalizeRelatedPost,sortSignals,mergeSnapshot}=resetModel;
import {statusSignals} from '../lib/reset-data.js';
const now='2026-09-22T17:00:00Z';
const make=(text,id='2102254445082116335',createdAt='2026-09-22T04:31:32Z')=>({id,createdAt,...classify(text,createdAt)});
test('a first-party commitment to reset all paid Codex users remains a strong open signal',()=>{
  const post={...make('o yes… we’re back in action and we’ll reset usage limits for all paid users across codex and ChatGPT work', '2103637477760311522', '2026-09-26T00:07:13Z'),authority:'first-party'};
  assert.equal(post.kind,'promise');
  assert.equal(post.stage,'committed');
  const f=forecast({signals:[post]},'2026-09-26T18:10:00Z','Asia/Dubai');
  assert.ok(f.today.probability>=75,`Expected a strong same-day forecast, got ${f.today.probability}%`);
  assert.equal(f.today.observed,null);
});
test('a propagated-resets completion post confirms the event and retires its earlier promise',()=>{
  const promise={...make('We’ll reset usage limits for all paid users across Codex and ChatGPT Work','promise','2026-09-26T00:07:13Z'),authority:'first-party'};
  const done={...make('Resets all propagated. That will be all. Have a fantastic weekend.','2103911959544610829','2026-09-26T18:17:54Z'),authority:'first-party'};
  assert.equal(done.kind,'confirmed');
  const f=forecast({signals:[promise,done]},'2026-09-26T18:19:00Z','Asia/Dubai');
  assert.equal(f.today.probability,100);
  assert.equal(f.today.observed?.id,done.id);
  assert.equal(f.today.commitment,null);
  assert.equal(f.factors.find(s=>s.id===promise.id).currentWeight,0);
});
test('a completed reset remains visible as the latest event after the local day rolls over',()=>{
  const done={...make('Resets all propagated.','2103911959544610829','2026-09-26T18:17:54Z'),authority:'first-party'};
  const nextDay=forecast({signals:[done]},'2026-09-26T21:00:00Z','Asia/Dubai');
  assert.equal(nextDay.today.observed,null);
  assert.equal(nextDay.latestObserved?.id,done.id);
  assert.ok(nextDay.today.probability<100);
});
test('a community reset claim is visible but cannot confirm or promise a global reset',()=>{
  const post=normalizeRelatedPost({author:{screen_name:'codexfan',name:'Codex fan'},id:'2103637477760311523',text:'We have reset all Codex usage limits!',created_at:'2026-09-26T01:00:00Z'});
  assert.equal(post.authority,'community');
  assert.equal(post.handle,'codexfan');
  const f=forecast({signals:[post]},'2026-09-26T18:10:00Z','Asia/Dubai');
  assert.equal(f.today.observed,null);
  assert.equal(f.today.commitment,null);
  assert.equal(f.today.probability,forecast({signals:[]},'2026-09-26T18:10:00Z','Asia/Dubai').today.probability);
});
test('Chinese Codex reset posts can be inspected as community context',()=>{
  const post=normalizeRelatedPost({author:{screen_name:'codexfan',name:'Codex fan'},id:'2103637477760311526',text:'Codex 额度已重置，大家可以继续用了。',created_at:'2026-09-26T18:00:00Z'});
  assert.equal(post?.authority,'community');
  assert.equal(post?.handle,'codexfan');
  assert.equal(post?.related,true);
});
test('a save-resets feature announcement is not a promise of an automatic reset today',()=>{
  const post=classify('Starting today, we are rolling out the ability to save Codex rate limit resets to use later.','2026-09-26T18:00:00Z');
  assert.equal(post.kind,'policy');
  assert.equal(post.weight,0);
});
test('an explicit completed reset remains a confirmation when the same post mentions a save feature',()=>{
  const post=classify('We have reset Codex usage limits for all users and added the ability to save resets for later.','2026-09-26T18:00:00Z');
  assert.equal(post.kind,'confirmed');
});
test('the clue desk places fresh first-party confirmation ahead of promises and community posts',()=>{
  const published='2026-09-26T18:00:00Z';
  const items=[
    {...make('I will reset Codex usage limits', 'promise',published),authority:'first-party',currentWeight:2.9},
    {...make('My Codex reset is here', 'community',published),authority:'community',currentWeight:0},
    {...make('Resets all propagated', 'done',published),authority:'first-party',currentWeight:0}
  ];
  assert.deepEqual(sortSignals(items,'relevant','2026-09-26T19:00:00Z').map(s=>s.id),['done','promise','community']);
});
test('Tuesday promise is grounded in publication date in Pacific time',()=>{const p=make('I promised a reset for Tuesday.');assert.equal(p.kind,'promise');assert.equal(p.targetDay,'2026-09-22');const f=forecast({signals:[p]},now);assert.ok(f.today.probability>50);assert.equal(f.tomorrow.probability,12);});
test('same ID and related duplicate promises do not inflate probability',()=>{const p=make('I promised a reset for Tuesday.');const one=forecast({signals:[p]},now).today.probability;assert.equal(forecast({signals:[p,p,{...p,id:'another'}]},now).today.probability,one);});
test('old dated promises never carry forward to a new day',()=>{const p=make('Reset is landing tomorrow.','id','2026-09-10T23:00:00Z');assert.equal(forecast({signals:[p]},now).today.probability,forecast({signals:[]},now).today.probability);});
test('a banked reset grant counts as an observed reset event without claiming an automatic refill',()=>{
  const post=make('We are loading a banked reset into all accounts of our Plus, Pro and Business users.','banked','2026-09-22T18:23:37Z');
  assert.equal(post.kind,'banked');assert.equal(post.stage,'announced');
  const f=forecast({signals:[post]},'2026-09-22T19:00:00Z','Asia/Dubai');
  assert.equal(f.today.probability,100);assert.equal(f.today.observed.id,'banked');
  assert.equal(f.tomorrow.probability,12);
  assert.equal(forecast({signals:[post]},'2026-09-22T21:00:00Z','Asia/Dubai').today.observed,null);
});
test('banked plans increase odds but questions and bare mentions are not confirmations',()=>{
  const plan=make('We will load a banked reset tomorrow.','plan','2026-09-22T18:00:00Z');
  assert.equal(plan.stage,'planned');assert.equal(plan.targetDay,'2026-09-23');
  const f=forecast({signals:[plan]},'2026-09-22T19:00:00Z','UTC');
  assert.equal(f.today.observed,null);assert.ok(f.tomorrow.probability>12);
  assert.equal(make('Will there be a banked reset?').weight,0);
  assert.equal(make('We discussed banked resets.').stage,'mentioned');
  assert.equal(make('The banked reset has landed.').stage,'announced');
  assert.equal(make('The banked reset will land by 8pm.').stage,'mentioned');
  assert.equal(make('No banked reset today.').kind,'negative');
  assert.equal(make('👀').weight,0);
});
test('banked excerpts include the account eligibility rather than cutting off at usage',()=>{
  const text='We are improving usage for subscriptions. And one more thing. We are loading a banked reset into all accounts of our Plus, Pro and Business users.';
  assert.match(excerpt(text),/Plus, Pro and Business users/);
});
test('a completed shared reset is observed and retires previous promise',()=>{const p=make('I promised a reset for Tuesday.');const done=make("I have reset everyone's Codex usage limits.",'done','2026-09-22T16:00:00Z');const f=forecast({signals:[p,done]},now);assert.equal(f.today.probability,100);assert.ok(f.today.observed);assert.equal(f.factors.find(s=>s.id===p.id).currentWeight,0);assert.equal(f.tomorrow.probability,12);});
test('cancellations reduce rather than raise the forecast',()=>{const base=forecast({signals:[]},now);const f=forecast({signals:[make('No reset today.','no','2026-09-22T16:00:00Z')]},now);assert.ok(f.today.probability<base.today.probability);assert.equal(make('No reset today.').kind,'negative');});
test('unrelated outages do not become reset evidence',()=>{assert.equal(statusSignals({incidents:[{name:'Image API down',created_at:now}]},Date.parse(now)).length,0);assert.equal(statusSignals({incidents:[{id:'a',name:'Codex errors',created_at:now,impact:'major'}]},Date.parse(now))[0].weight,.55);});
test('DST day boundaries have the actual 23 and 25 hour durations',()=>{assert.equal((midnight('2026-03-09','America/Los_Angeles')-midnight('2026-03-08','America/Los_Angeles'))/3600000,23);assert.equal((midnight('2026-11-02','America/Los_Angeles')-midnight('2026-11-01','America/Los_Angeles'))/3600000,25);});
test('reposts from other authors are ignored and display excerpts are bounded',()=>{assert.equal(normalizePost({author:{screen_name:'random'},id:'2102254445082116335',text:'reset',created_at:now}),null);const p=normalizePost({author:{screen_name:'thsottiaux'},id:'2102254445082116335',text:'word '.repeat(200),created_at:now});assert.ok(p.excerpt.split(/\s+/).length<=25);assert.equal(p.url,'https://x.com/thsottiaux/status/2102254445082116335');});
test('future events are not used and forecasts remain bounded',()=>{const p=make('I promised a reset for Tuesday.','future','2026-09-23T04:00:00Z');assert.equal(forecast({signals:[p]},now).today.probability,forecast({signals:[]},now).today.probability);for(const zone of ['UTC','Asia/Dubai','America/Los_Angeles']){const f=forecast({signals:[]},now,zone);assert.ok(f.today.probability>=0&&f.today.probability<=95);assert.equal(f.tomorrow.probability,12);}});
test('the radar includes relevant posts from official accounts besides Tibo',async()=>{
  const oldFetch=globalThis.fetch,oldNow=Date.now;
  const clock=Date.parse('2026-09-26T18:00:00Z');Date.now=()=>clock;
  globalThis.fetch=async url=>({ok:true,json:async()=>String(url).includes('/profile/openai/')?{code:200,results:[{author:{screen_name:'OpenAI',name:'OpenAI'},id:'2103637477760311524',text:'Codex usage limits have been reset for paid users.',created_at:'2026-09-26T01:00:00Z'}]}:String(url).includes('fxtwitter')?{code:200,results:[]}:{incidents:[]}});
  try{
    const {getResetData}=await import(`../lib/reset-data.js?other-official-test=${clock}`);
    const data=await getResetData();
    assert.equal(data.signals.find(s=>s.handle==='openai')?.authority,'first-party');
    assert.equal(data.sources.discovery.count,1);
  }finally{globalThis.fetch=oldFetch;Date.now=oldNow;}
});
test('a failed official feed keeps its last known posts and marks discovery partial',async()=>{
  const oldFetch=globalThis.fetch,oldNow=Date.now;
  let clock=Date.parse('2026-09-26T18:00:00Z'),failDevelopers=false;Date.now=()=>clock;
  globalThis.fetch=async url=>{
    const path=String(url);
    if(path.includes('/profile/openaidevs/')&&failDevelopers)return {ok:false,status:503};
    const handle=path.includes('/profile/openaidevs/')?'OpenAIDevs':path.includes('/profile/openai/')?'OpenAI':null;
    return {ok:true,json:async()=>handle?{code:200,results:[{author:{screen_name:handle,name:handle},id:handle==='OpenAI'?'2103637477760311524':'2103637477760311525',text:'Codex reset cards are being issued.',created_at:'2026-09-26T17:00:00Z'}]}:path.includes('fxtwitter')?{code:200,results:[]}:{incidents:[]}};
  };
  try{
    const {getResetData}=await import(`../lib/reset-data.js?partial-official-test=${clock}`);
    assert.equal((await getResetData()).signals.filter(s=>s.handle==='openaidevs').length,1);
    clock+=5001;failDevelopers=true;
    const data=await getResetData();
    assert.equal(data.sources.discovery.state,'partial');
    assert.deepEqual(data.sources.discovery.availableAccounts,['openai']);
    assert.equal(data.signals.filter(s=>s.handle==='openaidevs').length,1);
  }finally{globalThis.fetch=oldFetch;Date.now=oldNow;}
});
test('a cold source outage still exposes the reviewed completion report',async()=>{
  const oldFetch=globalThis.fetch,oldNow=Date.now;
  const clock=Date.parse('2026-09-26T19:00:00Z');Date.now=()=>clock;
  globalThis.fetch=async()=>({ok:false,status:503});
  try{
    const {getResetData}=await import(`../lib/reset-data.js?cold-outage-test=${clock}`);
    const data=await getResetData();
    assert.equal(data.sources.x.state,'unavailable');
    const completion=data.signals.find(s=>s.id==='2103911959544610829');
    assert.equal(completion?.kind,'confirmed');
    assert.equal(completion?.archived,true);
  }finally{globalThis.fetch=oldFetch;Date.now=oldNow;}
});
test('a browser keeps recent verified posts during an upstream outage but expires old snapshots',()=>{
  const oldAt='2026-09-26T18:00:00Z',freshAt='2026-09-26T19:00:00Z';
  const oldPost={...make('We will reset Codex usage limits','old','2026-09-26T17:00:00Z'),handle:'thsottiaux',authority:'first-party'};
  const previous={checkedAt:oldAt,sources:{x:{state:'available',lastSuccess:oldAt,count:1,latestPostAt:oldPost.createdAt},discovery:{state:'unavailable'},status:{state:'unavailable'}},signals:[oldPost]};
  const incoming={checkedAt:freshAt,sources:{x:{state:'unavailable',lastSuccess:null,count:0},discovery:{state:'unavailable'},status:{state:'unavailable'}},signals:[]};
  const merged=mergeSnapshot(previous,incoming,freshAt);
  assert.equal(merged.sources.x.state,'stale');
  assert.equal(merged.signals[0].id,'old');
  assert.equal(mergeSnapshot(previous,incoming,'2026-09-27T19:00:00Z').signals.length,0);
  assert.equal(mergeSnapshot(previous,{...incoming,sources:{...incoming.sources,x:{state:'available',lastSuccess:freshAt,count:0}}},freshAt).signals.length,0);
});
test('radar refreshes posts after five seconds and coalesces concurrent readers',async()=>{
  const oldFetch=globalThis.fetch,oldNow=Date.now;
  let clock=Date.parse('2026-09-22T18:00:00Z'),xCalls=0,version=1;
  Date.now=()=>clock;
  globalThis.fetch=async url=>{const isX=String(url).includes('/profile/thsottiaux/');if(isX)xCalls++;return {ok:true,json:async()=>isX
    ? {code:200,results:Array.from({length:version},(_,i)=>({author:{screen_name:'thsottiaux'},id:String(2102460000000000000n+BigInt(i)),text:'Codex usage is improving',created_at:new Date(clock-i*1000).toISOString()}))}
    : String(url).includes('fxtwitter')?{code:200,results:[]}:{incidents:[]}};};
  try {
    const {getResetData}=await import(`../lib/reset-data.js?live-test=${clock}`);
    const first=await getResetData();assert.equal(first.refreshSeconds,10);assert.equal(first.signals.filter(s=>!s.archived).length,1);assert.equal(xCalls,1);
    clock+=4000;assert.strictEqual(await getResetData(),first);assert.equal(xCalls,1);
    clock+=1001;version=2;const [second,third]=await Promise.all([getResetData(),getResetData()]);
    assert.strictEqual(second,third);assert.equal(second.signals.filter(s=>!s.archived).length,2);assert.notEqual(second.checkedAt,first.checkedAt);assert.equal(xCalls,2);
  } finally {globalThis.fetch=oldFetch;Date.now=oldNow;}
});
