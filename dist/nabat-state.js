import {advanceSpring,springSettled} from './flow-state.js';
export const nabatViewIds = ['identity','history','operations'];
export function selectNabatView(state,id){
  const index=nabatViewIds.indexOf(id);
  if(index<0)throw new RangeError('Unknown NABAT exhibit view');
  return {...state,selected:id,target:index};
}
export function advanceNabatView(state,elapsed){
  return {...state,...advanceSpring(state,elapsed,10)};
}
export function settledNabatView(state){return springSettled(state);}
export function nabatPose(position){
  if(!Number.isFinite(position))throw new TypeError('NABAT pose must be finite');
  const p=Math.max(0,Math.min(2,position));
  return {history:Math.min(1,p),operations:Math.max(0,p-1)};
}
