import {getLanguage,onLanguageChange} from './i18n.js';
import {canAnimate,isMotionPaused,onMotionChange} from './motion-state.js';
import {advanceSpring,springSettled} from './flow-state.js';
import './site-navigation.js';
import './flow-current.js';

const c=(zh,en)=>getLanguage()==='en'?en:zh;
const stage=document.querySelector('[data-flow-stage]');
const button=stage?.querySelector('.flow-turn');
let disposed=false,visible=true,raf=0,last=0,inspection=false;
const states={x:{position:0,velocity:0,target:0},y:{position:0,velocity:0,target:0},turn:{position:0,velocity:0,target:0}};
const cleanups=[];
function render(){
  if(!stage)return;
  stage.style.setProperty('--flow-x',`${states.x.position.toFixed(2)}px`);
  stage.style.setProperty('--flow-y',`${states.y.position.toFixed(2)}px`);
  stage.style.setProperty('--flow-turn',`${(states.turn.position*42).toFixed(2)}deg`);
  stage.style.setProperty('--flow-scale',(1+states.turn.position*.055).toFixed(4));
}
function step(time){
  raf=0;
  if(disposed||!stage||!visible||!canAnimate()){last=0;return;}
  const dt=last?time-last:16;last=time;
  for(const key of Object.keys(states))states[key]=advanceSpring(states[key],dt,key==='turn'?7:11);
  render();
  if(!Object.values(states).every(springSettled))raf=requestAnimationFrame(step);else last=0;
}
function schedule(){if(!raf&&!disposed&&visible&&canAnimate())raf=requestAnimationFrame(step);}
function snap(){for(const key of Object.keys(states))states[key]={...states[key],position:states[key].target,velocity:0};render();}
function labels(){
  const theme=document.querySelector('[data-flow-copy=theme]');if(theme)theme.textContent=c('万物流动不止，世间万物皆有轮回因果。','All things flow. Every beginning carries a return.');
  if(button){button.setAttribute('aria-label',c(inspection?'回到汇流姿态':'观察回环姿态',inspection?'Return to convergence':'Explore the returning current'));button.querySelector('[data-flow-turn-label]').textContent=c(inspection?'回到汇流':'让万物流转',inspection?'Back to the flow':'Set things in flow');}
  if(stage){stage.querySelector('.flow-sculpture').alt=c('蓝色、粉色与金色的流线，环绕篮球汇成一件流动雕塑','Blue, pink and gold currents loop around a basketball in an interlocking sculpture');}
  const note=document.querySelector('.flow-return-note');if(note){note.querySelector('strong').textContent=c('流向远方，也回到自己。','OUTWARD. AND HOME.');note.querySelector('span').textContent=c('每一次热爱都是起点，每一次创造都是回响。川流不息。','Every passion is a beginning. Every creation, an echo. Everything in flow.');}
}
if(button){
  const turn=()=>{inspection=!inspection;button.setAttribute('aria-pressed',String(inspection));states.turn.target=inspection?1:0;labels();if(isMotionPaused())snap();else schedule();};
  button.addEventListener('click',turn);cleanups.push(()=>button.removeEventListener('click',turn));
  const move=event=>{
    if(!canAnimate()||event.pointerType==='touch'||!matchMedia('(hover:hover) and (pointer:fine)').matches)return;
    const r=stage.getBoundingClientRect();states.x.target=((event.clientX-r.left)/r.width-.5)*22;states.y.target=((event.clientY-r.top)/r.height-.5)*18;schedule();
  };
  const leave=()=>{states.x.target=0;states.y.target=0;schedule();};
  stage.addEventListener('pointermove',move,{passive:true});stage.addEventListener('pointerleave',leave);
  cleanups.push(()=>{stage.removeEventListener('pointermove',move);stage.removeEventListener('pointerleave',leave);});
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;stage.classList.toggle('flow-asleep',!visible);if(visible)schedule();else{cancelAnimationFrame(raf);raf=0;last=0;}},{rootMargin:'40px'});observer.observe(stage);cleanups.push(()=>observer.disconnect());
}
// Pause freezes ambient time. Reduced motion still accepts every viewing selection immediately.
cleanups.push(onMotionChange(()=>{if(!canAnimate()){cancelAnimationFrame(raf);raf=0;last=0;if(isMotionPaused()){states.x.target=0;states.y.target=0;snap();}}else schedule();}));
function addReturn(){
  const finale=document.querySelector('.atelier-finale');if(!finale||finale.querySelector('.flow-return-note'))return;
  const note=document.createElement('div');note.className='flow-return-note';note.innerHTML='<strong></strong><span></span>';finale.prepend(note);labels();
}
addReturn();
const footerObserver=new MutationObserver(addReturn);footerObserver.observe(document.querySelector('.site-shell')||document.body,{childList:true,subtree:true});
cleanups.push(()=>footerObserver.disconnect());
cleanups.push(onLanguageChange(labels));labels();render();
function destroy(){disposed=true;cancelAnimationFrame(raf);raf=0;for(const cleanup of cleanups)cleanup();}
// A bfcache navigation keeps controllers; a full unload releases all resources.
window.addEventListener('pagehide',event=>{if(!event.persisted)destroy();else{cancelAnimationFrame(raf);raf=0;last=0;}});
window.addEventListener('pageshow',event=>{if(event.persisted&&!disposed){labels();schedule();}});
