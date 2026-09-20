import test from 'node:test';
import assert from 'node:assert/strict';
test('shared motion preference survives system and visibility changes',async()=>{
  const media={matches:false,addEventListener(_,fn){this.change=fn;}};
  const events={};const values=new Map();
  globalThis.matchMedia=()=>media;
  globalThis.document={hidden:false,documentElement:{dataset:{}},addEventListener(name,fn){events[name]=fn;}};
  globalThis.window={addEventListener(name,fn){events[name]=fn;}};
  globalThis.localStorage={getItem:key=>values.get(key),setItem:(key,value)=>values.set(key,value)};
  const motion=await import('../dist/motion-state.js');
  let observed;motion.onMotionChange(value=>{observed=value;});
  assert.equal(motion.canAnimate(),true);
  motion.setMotionPaused(true);assert.equal(observed,true);assert.equal(values.get('chefzc.motion'),'paused');
  media.matches=true;media.change();media.matches=false;media.change();assert.equal(motion.isMotionPaused(),true);
  motion.setMotionPaused(false);document.hidden=true;events.visibilitychange();assert.equal(motion.canAnimate(),false);assert.equal(document.documentElement.dataset.siteMotion,'off');
  document.hidden=false;events.visibilitychange();assert.equal(motion.canAnimate(),true);
  events.storage({key:'chefzc.motion',newValue:'paused'});assert.equal(motion.isMotionPaused(),true);
  events.storage({key:null,newValue:null});assert.equal(motion.canAnimate(),true);
});
