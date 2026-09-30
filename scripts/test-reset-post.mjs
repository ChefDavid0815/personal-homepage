import test from 'node:test';
import assert from 'node:assert/strict';
import * as lookup from '../lib/reset-post.js';

test('X post lookup accepts a post link and rejects arbitrary hosts and paths',()=>{
  assert.deepEqual(lookup.parseXPostUrl('https://x.com/codexfan/status/2103911959544610829?s=20'),{id:'2103911959544610829'});
  assert.deepEqual(lookup.parseXPostUrl('https://twitter.com/OpenAI/status/2103911959544610829'),{id:'2103911959544610829'});
  for(const value of ['https://x.com.evil.test/codexfan/status/2103911959544610829','http://127.0.0.1/status/2103911959544610829','https://x.com/search?q=reset'])assert.throws(()=>lookup.parseXPostUrl(value));
});
test('lookup fetches by validated ID and trusts the returned author instead of the URL handle',async()=>{
  let requested;
  const fetchPost=async url=>{requested=url;return {ok:true,json:async()=>({code:200,status:{id:'2103911959544610829',author:{screen_name:'codexfan',name:'Codex fan'},text:'My Codex usage reset landed today.',created_at:'2026-09-26T18:17:54Z'}})};};
  const post=await lookup.getRelatedPost('https://x.com/OpenAI/status/2103911959544610829',fetchPost);
  assert.equal(requested,'https://api.fxtwitter.com/2/status/2103911959544610829');
  assert.equal(post.authority,'community');
  assert.equal(post.url,'https://x.com/codexfan/status/2103911959544610829');
});
test('lookup does not add a Tibo post that has no reset content',async()=>{
  const post=await lookup.getRelatedPost('https://x.com/thsottiaux/status/2103620061156290622',async()=>({ok:true,json:async()=>({code:200,status:{id:'2103620061156290622',author:{screen_name:'thsottiaux'},text:'We are aware that Codex is down and are working hard to bring back normal service.',created_at:'2026-09-25T22:58:00Z'}})}));
  assert.equal(post,null);
});
