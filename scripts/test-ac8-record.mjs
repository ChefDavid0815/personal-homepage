import test from 'node:test';
import assert from 'node:assert/strict';
import {parseAc8Vdf,validateAc8Record,recordFreshness} from '../lib/ac8-record-schema.js';
import {createAc8RecordHandler} from '../lib/ac8-record-handler.js';
import {createAc8BlobStore} from '../lib/ac8-record-store.js';

const now=Date.parse('2026-10-09T12:00:00Z');
const good={version:1,appId:2288340,scope:'steam-local',collectedAt:new Date(now).toISOString(),sourceUpdatedAt:'2026-10-09T11:49:40Z',playtimeMinutes:254,recentPlaytimeMinutes:254,lastPlayedAt:'2026-10-09T11:49:40Z'};
test('VDF selects only AC8 aggregates despite quoted braces and other games',()=>{
 const vdf='"root" { "token" "private{credential}" "apps" { "2288340" { "Playtime" "254" "Playtime2wks" "254" "LastPlayed" "1791546580" "secret" "DO_NOT_EXPORT" } "4356430" { "Playtime" "9999" } } }';
 assert.deepEqual(parseAc8Vdf(vdf),{playtimeMinutes:254,recentPlaytimeMinutes:254,lastPlayedAt:'2026-10-09T11:49:40.000Z'});
 assert.deepEqual(parseAc8Vdf('"apps" { "7" { "Playtime" "400" } }'),{playtimeMinutes:null,recentPlaytimeMinutes:null,lastPlayedAt:null});
});
test('validated records rebuild an allowlist and preserve unknown instead of inventing zero',()=>{
 const cleaned=validateAc8Record({...good,token:'secret',path:'private',playtimeMinutes:null},now);
 assert.equal(cleaned.playtimeMinutes,null);assert.equal('token' in cleaned,false);assert.equal('path' in cleaned,false);
 for(const patch of [{appId:502500},{playtimeMinutes:-1},{playtimeMinutes:'254'},{recentPlaytimeMinutes:300},{collectedAt:'2026-10-10T12:00:00Z'},{lastPlayedAt:'not a date'}])assert.throws(()=>validateAc8Record({...good,...patch},now));
 assert.equal(recordFreshness(good,now),'synced');assert.equal(recordFreshness(good,now+600000),'stale');
});
const response=()=>({code:200,body:null,headers:{},setHeader(k,v){this.headers[k]=v;},status(c){this.code=c;return this;},json(b){this.body=b;return this;},end(){return this;}});
function store(){let saved=null,etag=0;return{read:async()=>saved?{snapshot:saved,etag:String(etag)}:null,write:async(value,condition)=>{if(condition!==String(etag))throw Object.assign(new Error('Conflict'),{code:'ETAG_CONFLICT'});saved=value;etag++;},snapshot:()=>saved};}
test('writer rejects unauthorized and malformed input, keeps newer data and reports storage failure',async()=>{
 const db=store(),handler=createAc8RecordHandler({store:db,secret:()=> 'test-key',now:()=>now});
 let res=response();await handler({method:'POST',headers:{},body:good},res);assert.equal(res.code,401);assert.equal(db.snapshot(),null);
 res=response();await handler({method:'POST',headers:{authorization:'Bearer test-key'},body:{...good,appId:7}},res);assert.equal(res.code,400);assert.equal(db.snapshot(),null);
 res=response();await handler({method:'POST',headers:{authorization:'Bearer test-key'},body:good},res);assert.equal(res.code,200);
 const older={...good,collectedAt:'2026-10-09T11:59:00Z'};res=response();await handler({method:'POST',headers:{authorization:'Bearer test-key'},body:older},res);assert.equal(res.code,409);assert.equal(db.snapshot().collectedAt,good.collectedAt);
 res=response();await handler({method:'GET',headers:{}},res);assert.equal(res.code,200);assert.equal(res.body.playtimeMinutes,254);assert.equal(res.body.freshness,'synced');
 const failure=createAc8RecordHandler({store:{read:async()=>{throw new Error('network');}},secret:()=> 'test-key',now:()=>now});res=response();await failure({method:'GET',headers:{}},res);assert.equal(res.code,503);
});
test('private Blob metadata provides the ETag for a conditional replacement',async()=>{
 let options=null;const db=createAc8BlobStore({getBlob:async()=>({statusCode:200,blob:{etag:'real-shape-etag'},stream:new Response(JSON.stringify(good)).body}),putBlob:async(path,data,opts)=>{assert.equal(path,'game-records/ac8.json');options=opts;}});
 const current=await db.read();assert.equal(current.etag,'real-shape-etag');await db.write(good,current.etag);assert.equal(options.ifMatch,'real-shape-etag');assert.equal(options.allowOverwrite,true);
 await db.write(good,'0');assert.equal(options.allowOverwrite,false);assert.equal('ifMatch' in options,false);
});
