import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../api/reset-post.js';

function response(){return {code:null,body:null,headers:{},setHeader(key,value){this.headers[key]=value;return this;},status(code){this.code=code;return this;},json(body){this.body=body;return this;}};}

test('post lookup API rejects an arbitrary URL before fetching',async()=>{
  const res=response();
  await handler({method:'GET',query:{url:'https://example.com/private'}},res);
  assert.equal(res.code,400);
  assert.equal(res.body.error,'invalid_url');
});
