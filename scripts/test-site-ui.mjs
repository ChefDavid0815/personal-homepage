import test from 'node:test';
import assert from 'node:assert/strict';
import {advanceSpring,springSettled,resolveSiteLanguage,createCopyTransaction} from '../dist/flow-state.js';
globalThis.document = {querySelectorAll:()=>[], readyState:'loading', addEventListener:()=>{}};

test('first visit follows the system language without a stored preference', async () => {
  Object.defineProperty(globalThis, 'navigator', {value:{language:'en-US'}, configurable:true});
  globalThis.localStorage = {getItem:()=>null};
  const module = await import(`../dist/i18n.js?test=english`);
  assert.equal(module.getLanguage(), 'en');
});

test('system Chinese, invalid storage and non-Chinese systems resolve predictably',()=>{
  assert.equal(resolveSiteLanguage(null,'zh-CN'),'zh');
  assert.equal(resolveSiteLanguage('garbage','zh-Hant'),'zh');
  assert.equal(resolveSiteLanguage(null,'fr-FR'),'en');
  assert.equal(resolveSiteLanguage('en','zh-CN'),'en');
});

test('reversing the current retains pose and velocity, then settles at latest intent',()=>{
  let state={position:0,velocity:0,target:1};
  for(let i=0;i<18;i++)state=advanceSpring(state,16);
  assert.ok(state.position>.2&&state.position<1);assert.ok(state.velocity>0);
  const before={...state};state.target=0;
  assert.equal(state.position,before.position);assert.equal(state.velocity,before.velocity);
  state=advanceSpring(state,16);assert.ok(Math.abs(state.position-before.position)<.1);
  for(let i=0;i<180;i++)state=advanceSpring(state,16);
  assert.ok(springSettled(state));assert.ok(Math.abs(state.position)<.001);
});

test('large background time deltas cannot skip the entire scene',()=>{
  const state={position:0,velocity:0,target:1};
  assert.deepEqual(advanceSpring(state,50000),advanceSpring(state,50));
});

test('copy handles reentry, a failure and a successful retry',async()=>{
  let release;const calls=[],states=[];
  const transaction=createCopyTransaction({write:value=>{calls.push(value);return new Promise((resolve,reject)=>{release={resolve,reject};});},onState:state=>states.push(state)});
  const pending=transaction.copy('me@example.com');
  assert.equal(await transaction.copy('duplicate@example.com'),false);
  assert.deepEqual(calls,['me@example.com']);assert.deepEqual(states,['pending']);
  release.reject(new Error('denied'));assert.equal(await pending,false);assert.deepEqual(states,['pending','error','idle']);
  const retry=transaction.copy('me@example.com');release.resolve();assert.equal(await retry,true);
  assert.deepEqual(states.slice(-3),['pending','success','idle']);
});

test('a stale copy response cannot announce after language change or teardown',async()=>{
  let complete;const states=[];
  const transaction=createCopyTransaction({write:()=>new Promise(resolve=>{complete=resolve;}),onState:state=>states.push(state)});
  const pending=transaction.copy('me@example.com');transaction.invalidate();complete();await pending;
  assert.deepEqual(states,['pending','idle']);
  const next=transaction.copy('me@example.com');transaction.dispose();complete();await next;
  assert.deepEqual(states,['pending','idle','pending']);assert.equal(await transaction.copy('x'),false);
});

test('saved Chinese preference overrides an English system', async () => {
  Object.defineProperty(globalThis, 'navigator', {value:{language:'en-US'}, configurable:true});
  globalThis.localStorage = {getItem:()=> 'zh'};
  const module = await import(`../dist/i18n.js?test=chinese`);
  assert.equal(module.getLanguage(), 'zh');
});

test('choosing the already active system language still records a manual override',async()=>{
  const writes=[];
  Object.defineProperty(globalThis,'navigator',{value:{language:'en-US'},configurable:true});
  globalThis.localStorage={getItem:()=>null,setItem:(key,value)=>writes.push([key,value])};
  const module=await import('../dist/i18n.js?test=persist-same-language');
  module.setLanguage('en');
  assert.deepEqual(writes,[['chefzc.language','en']]);
});
