import {getLanguage,onLanguageChange} from './i18n.js';
import {isMotionPaused,systemReducesMotion,onMotionChange} from './motion-state.js';
import {nabatViews,nabatScreens,nabatAsset} from './nabat-content.js';
import {selectNabatView,advanceNabatView,settledNabatView,nabatPose} from './nabat-state.js';

const copy=pair=>pair[getLanguage()==='en'?1:0];
let presentation={selected:'identity',position:0,velocity:0,target:0};
let selectedScreen='home';
let screenRequest=0,scene=null,frame=0,lastTime=0,dialog=null,opener=null,dialogScreen='home';
const ambient=new Set();
const inView=new WeakSet();
let closed=false;
let coverSeen=false;
let entranceCover=null;
const entrances=new Set();
function enterCover(cover){
  if(coverSeen)return;coverSeen=true;entranceCover=cover;
  if(isMotionPaused())return;
  const parts=[
    [cover.querySelector('.nabat-cover-brand'),[{transform:'translateY(24px)',opacity:.35},{transform:'translateY(0)',opacity:1}],0,1100],
    [cover.querySelector('.nabat-cover-photo'),[{clipPath:'inset(10% 0 0 32%)',transform:'translateX(24px)'},{clipPath:'inset(0)',transform:'translateX(0)'}],100,1500],
    [cover.querySelector('.nabat-specimen-code'),[{transform:'translateY(18px)',opacity:.35},{transform:'translateY(0)',opacity:1}],450,1000]
  ];
  for(const [node,keys,delay,duration] of parts){
    if(!node)continue;
    const animation=node.animate(keys,{duration,delay,easing:'cubic-bezier(.16,1,.3,1)',fill:'backwards'});
    entrances.add(animation);animation.finished.then(()=>entrances.delete(animation)).catch(()=>entrances.delete(animation));
  }
}
const observer=new IntersectionObserver(entries=>{
  for(const entry of entries){
    entry.target.classList.toggle('nabat-visible',entry.isIntersecting);
    if(entry.isIntersecting){inView.add(entry.target);if(entry.target.classList.contains('nabat-cover'))enterCover(entry.target);}else inView.delete(entry.target);
    if(entry.target===entranceCover)for(const animation of entrances){if(entry.isIntersecting&&!isMotionPaused()&&!document.hidden)animation.play();else animation.pause();}
  }
  schedule();
},{threshold:.02});
function paint(){
  if(!scene)return;
  const pose=nabatPose(presentation.position);
  const sheet=scene.querySelector('.nabat-record-sheet');
  sheet.style.setProperty('--nb-history',pose.history.toFixed(5));
  sheet.style.setProperty('--nb-operations',pose.operations.toFixed(5));
}
function reserveCopy(){
  if(!scene?.isConnected||closed)return;
  const parent=scene.querySelector('.nabat-record-copy');
  const heading=parent.querySelector('[data-nabat-view-title]');
  const paragraph=parent.querySelector('[data-nabat-view-copy]');
  const fragment=document.createDocumentFragment(),samples=[];
  for(const data of nabatViews){
    for(const [source,text,kind] of [[heading,copy(data.title),'heading'],[paragraph,copy(data.copy),'copy']]){
      const clone=source.cloneNode(false);
      clone.removeAttribute('data-nabat-view-title');clone.removeAttribute('data-nabat-view-copy');
      clone.setAttribute('aria-hidden','true');clone.textContent=text;
      Object.assign(clone.style,{position:'absolute',visibility:'hidden',pointerEvents:'none',width:source.getBoundingClientRect().width+'px',height:'auto',minHeight:'0',margin:'0'});
      fragment.append(clone);samples.push({clone,kind});
    }
  }
  parent.append(fragment);
  const measured=samples.map(item=>({...item,height:item.clone.getBoundingClientRect().height}));
  samples.forEach(item=>item.clone.remove());
  heading.style.minHeight=Math.ceil(Math.max(...measured.filter(item=>item.kind==='heading').map(item=>item.height)))+'px';
  paragraph.style.minHeight=Math.ceil(Math.max(...measured.filter(item=>item.kind==='copy').map(item=>item.height)))+'px';
}
function running(){return scene?.isConnected&&inView.has(scene)&&!document.hidden&&!isMotionPaused()&&!closed;}
function tick(time){
  frame=0;
  if(!running()){lastTime=0;return;}
  const elapsed=lastTime?Math.min(50,time-lastTime):16.67;
  lastTime=time;presentation=advanceNabatView(presentation,elapsed);paint();
  if(!settledNabatView(presentation))schedule();else lastTime=0;
}
function schedule(){if(!frame&&running()&&!settledNabatView(presentation))frame=requestAnimationFrame(tick);}
function view(id){
  presentation=selectNabatView(presentation,id);
  if(!scene)return;
  const data=nabatViews.find(item=>item.id===id);
  scene.querySelectorAll('[data-nabat-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.nabatView===id)));
  scene.querySelector('[data-nabat-view-title]').textContent=copy(data.title);
  scene.querySelector('[data-nabat-view-copy]').textContent=copy(data.copy);
  scene.querySelector('[data-nabat-stamp]').textContent=data.stamp;
  scene.querySelectorAll('[data-nabat-event]').forEach((node,index)=>node.textContent=copy(data.events[index]));
  if(isMotionPaused()){presentation={...presentation,position:presentation.target,velocity:0};paint();}
  schedule();
}
function setScreenSemantics(root,id){
  root.querySelectorAll('[data-nabat-shot]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.nabatShot===id)));
}
async function chooseScreen(root,id){
  const data=nabatScreens.find(item=>item.id===id);if(!data)return;
  selectedScreen=id;const request=++screenRequest;
  setScreenSemantics(root,id);
  const status=root.querySelector('[data-nabat-image-status]');
  const image=new Image();image.src=nabatAsset+data.file;
  status.textContent=copy(['正在载入真实界面…','Loading the actual interface…']);
  try{
    await image.decode();
    if(request!==screenRequest||!root.isConnected||closed)return;
    const current=root.querySelector('[data-nabat-screen]');
    current.src=image.src;current.width=image.naturalWidth;current.height=image.naturalHeight;
    current.alt=copy(data.title)+copy([' · 真实 WinUI 渲染界面，合成演示工作区',' · Actual WinUI capture, synthetic demo workspace']);
    root.dataset.nabatDisplayedScreen=id;
    root.querySelector('[data-nabat-screen-note]').textContent=copy(data.note);
    status.textContent='';
  }catch{
    if(request!==screenRequest||!root.isConnected||closed)return;
    status.textContent=copy(['这张界面暂时没载入，保留当前画面。请再选一次重试。','This screen did not load. The current image remains; select again to retry.']);
  }
}
function ensureDialog(){
  if(dialog)return;
  dialog=document.createElement('dialog');dialog.className='nabat-dialog';
  dialog.setAttribute('aria-labelledby','nabat-dialog-title');
  dialog.innerHTML='<div class="nabat-dialog-top"><div><h2 id="nabat-dialog-title"></h2><a data-nabat-original target="_blank" rel="noopener noreferrer"></a></div><button type="button" class="nabat-dialog-close" autofocus>×</button></div><img alt=""><p></p>';
  document.body.append(dialog);
  dialog.querySelector('button').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{
    if(event.target!==dialog)return;
    const box=dialog.getBoundingClientRect();
    if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();
  });
  dialog.addEventListener('close',()=>{
    if(!document.querySelector('dialog[open]'))document.body.classList.remove('dialog-open');
    if(opener?.isConnected)opener.focus();else document.querySelector('[data-nabat-enlarge]')?.focus();
  });
}
function dialogCopy(){
  if(!dialog)return;
  const data=nabatScreens.find(item=>item.id===dialogScreen)||nabatScreens[0];
  dialog.querySelector('h2').textContent='NABAT / '+copy(data.title);
  dialog.querySelector('button').setAttribute('aria-label',copy(['关闭 NABAT 大图','Close the NABAT image']));
  const image=dialog.querySelector('img');
  image.alt=copy(data.title)+copy([' · 真实 WinUI 渲染界面，合成演示工作区',' · Actual WinUI capture, synthetic demo workspace']);
  dialog.querySelector('[data-nabat-original]').textContent=copy(['查看原尺寸图像','OPEN ORIGINAL IMAGE'])+(image.naturalWidth?' / '+image.naturalWidth+' × '+image.naturalHeight:'');
  dialog.querySelector('p').textContent=copy(['真实 WinUI XAML 渲染截图；植物、照片和演示记录为合成样例。不包含操作系统窗口框。','Actual WinUI XAML capture with synthetic plants, photos and demo records. The OS window frame is not included.']);
}
async function enlarge(button){
  const root=button.closest('.nabat-exhibit');const current=root?.querySelector('[data-nabat-screen]');
  if(!current)return;
  const request=screenRequest;button.setAttribute('aria-busy','true');
  try{if(!current.complete||!current.naturalWidth)await current.decode();}
  catch{if(root.isConnected)root.querySelector('[data-nabat-image-status]').textContent=copy(['图片暂时无法载入，请重新选择界面后再试。','The image did not load. Select a screen and try again.']);return;}
  finally{button.removeAttribute('aria-busy');}
  if(request!==screenRequest||!root.isConnected||closed)return;
  ensureDialog();opener=button;dialogScreen=root.dataset.nabatDisplayedScreen||'home';
  const image=dialog.querySelector('img');image.src=current.src;image.alt=current.alt;image.width=current.naturalWidth;image.height=current.naturalHeight;
  dialog.querySelector('[data-nabat-original]').href=current.src;dialogCopy();
  dialog.showModal();document.body.classList.add('dialog-open');
  dialog.querySelector('button').focus();
}
function mount(){
  if(closed)return;
  ++screenRequest;
  if(frame)cancelAnimationFrame(frame);frame=0;lastTime=0;
  for(const animation of entrances)animation.cancel();entrances.clear();
  for(const node of ambient){observer.unobserve(node);node.classList.remove('nabat-visible');}
  ambient.clear();
  scene=document.querySelector('[data-nabat-stage]');
  document.querySelectorAll('[data-nabat-ambient]').forEach(node=>{ambient.add(node);observer.observe(node);});
  if(scene){view(presentation.selected);paint();}
  document.fonts.ready.then(reserveCopy);
  const exhibit=document.querySelector('.nabat-exhibit');
  if(exhibit)exhibit.dataset.nabatDisplayedScreen='home';
  if(exhibit&&selectedScreen!=='home')chooseScreen(exhibit,selectedScreen);
}
function click(event){
  const viewButton=event.target.closest('[data-nabat-view]');
  if(viewButton){view(viewButton.dataset.nabatView);return;}
  const screenButton=event.target.closest('[data-nabat-shot]');
  if(screenButton){chooseScreen(screenButton.closest('.nabat-exhibit'),screenButton.dataset.nabatShot);return;}
  const enlargeButton=event.target.closest('[data-nabat-enlarge]');
  if(enlargeButton)enlarge(enlargeButton);
}
function visibility(){
  if(document.hidden){if(frame)cancelAnimationFrame(frame);frame=0;lastTime=0;for(const animation of entrances)animation.pause();}
  else{for(const animation of entrances)if(!isMotionPaused()&&inView.has(entranceCover))animation.play();schedule();}
}
const stopMotion=onMotionChange(()=>{
  if(frame)cancelAnimationFrame(frame);frame=0;lastTime=0;
  if(systemReducesMotion()){presentation={...presentation,position:presentation.target,velocity:0};paint();}
  if(isMotionPaused()){for(const animation of entrances){animation.finish();animation.cancel();}entrances.clear();}
  schedule();
});
const stopLanguage=onLanguageChange(()=>{dialogCopy();queueMicrotask(mount);});
document.addEventListener('nabat:render',mount);
document.addEventListener('click',click);
document.addEventListener('visibilitychange',visibility);
window.addEventListener('resize',reserveCopy,{passive:true});
window.addEventListener('pagehide',event=>{
  if(frame)cancelAnimationFrame(frame);frame=0;lastTime=0;
  if(event.persisted)return;
  closed=true;++screenRequest;observer.disconnect();stopMotion();stopLanguage();
  for(const animation of entrances)animation.cancel();entrances.clear();
  document.removeEventListener('nabat:render',mount);document.removeEventListener('click',click);document.removeEventListener('visibilitychange',visibility);
  window.removeEventListener('resize',reserveCopy);
});
window.addEventListener('pageshow',event=>{if(event.persisted)mount();});
mount();
