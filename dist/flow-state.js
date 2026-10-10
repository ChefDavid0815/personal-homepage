// Exact critically damped integration. Re-targeting keeps the current pose and velocity.
export function advanceSpring({position,velocity,target}, milliseconds, frequency=11) {
  const dt=Math.max(0,Math.min(50,milliseconds))/1000;
  const displacement=position-target;
  const impulse=velocity+frequency*displacement;
  const decay=Math.exp(-frequency*dt);
  return {position:target+(displacement+impulse*dt)*decay, velocity:(velocity-frequency*impulse*dt)*decay,target};
}
export function springSettled(state) {return Math.abs(state.position-state.target)<.001 && Math.abs(state.velocity)<.005;}
export const resolveSiteLanguage=(saved,system='en')=>saved==='zh'||saved==='en'?saved:/^zh\b/i.test(system)?'zh':'en';

// A copy transaction commits only if it is still current. It can be disposed on page exit.
export function createCopyTransaction({write,onState}) {
  let busy=false,version=0,disposed=false;
  return {
    async copy(value){
      if(busy||disposed)return false;
      busy=true;const request=++version;onState('pending');
      try{await write(value);if(request===version&&!disposed)onState('success');return true;}
      catch{if(request===version&&!disposed)onState('error');return false;}
      finally{if(request===version&&!disposed){busy=false;onState('idle');}}
    },
    invalidate(){version++;busy=false;if(!disposed)onState('idle');},
    dispose(){disposed=true;version++;busy=false;}
  };
}
