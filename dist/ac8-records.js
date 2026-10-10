import {getLanguage,onLanguageChange,t} from './i18n.js';
import {initialAc8Record} from './ac8-initial-record.js';
import {beginRecord,acceptRecord,failRecord,recordFreshness} from './ac8-record-state.js';
const root=document.querySelector('.ac8-flight-log');
if(root){
 let state={request:0,status:'snapshot',sourceKind:'snapshot',lastGood:initialAc8Record},controller=null,timer=0,visible=false,closed=false;
 const button=root.querySelector('[data-ac8-refresh]');
 const locale=()=>getLanguage()==='en'?'en-GB':'zh-CN';
 const duration=value=>value===null?t('ac8.unknown'):getLanguage()==='en'?`${Math.floor(value/60)}h ${value%60}m`:`${Math.floor(value/60)} 小时 ${value%60} 分钟`;
 const date=value=>value?new Intl.DateTimeFormat(locale(),{timeZone:'Asia/Dubai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date(value))+' · UTC+4':t('ac8.unknown');
 function time(selector,value){const node=root.querySelector(selector);node.textContent=date(value);if(value)node.dateTime=value;else node.removeAttribute('datetime');}
 function render(){
  const record=state.lastGood;root.querySelector('[data-ac8-total]').textContent=duration(record?.playtimeMinutes??null);root.querySelector('[data-ac8-recent]').textContent=duration(record?.recentPlaytimeMinutes??null);
  time('[data-ac8-last]',record?.lastPlayedAt);time('[data-ac8-source]',record?.sourceUpdatedAt);time('[data-ac8-synced]',record?.collectedAt);
  const globalTime=document.querySelector('[data-ac8-global-sync]');if(globalTime){globalTime.textContent=date(record?.collectedAt);if(record?.collectedAt)globalTime.dateTime=record.collectedAt;}
  root.querySelector('[data-ac8-collected-label]').textContent=t(state.sourceKind==='snapshot'?'ac8.snapshotTime':'ac8.syncTime');
  const status=state.status==='synced'?recordFreshness(record):state.status;root.dataset.ac8RecordStatus=status;root.querySelector('[data-ac8-status]').textContent=t('ac8.'+status);button.setAttribute('aria-busy',String(status==='connecting'));
 }
 async function refresh(){
  if(closed)return;controller?.abort();controller=new AbortController();const current=controller;
  state=beginRecord(state);const request=state.request;render();const timeout=setTimeout(()=>current.abort(),10000);
  try{const response=await fetch('/api/ac8-record',{signal:current.signal,cache:'no-store'});if(!response.ok)throw Error('Record unavailable');const value=await response.json();if(closed)return;state=acceptRecord(state,value,request);}
  catch{if(!closed)state=failRecord(state,request);}finally{clearTimeout(timeout);if(controller===current)controller=null;if(!closed)render();}
 }
 function polling(){clearInterval(timer);timer=0;if(!closed&&visible&&!document.hidden)timer=setInterval(()=>{if(!controller)refresh();},60000);}
 const observer=new IntersectionObserver(([entry])=>{const was=visible;visible=entry.isIntersecting;polling();if(visible&&!was&&!controller)refresh();},{threshold:.01});observer.observe(root);
 const visibility=()=>{if(document.hidden){controller?.abort();controller=null;}else if(visible)refresh();polling();};
 document.addEventListener('visibilitychange',visibility);button.addEventListener('click',refresh);const stopLanguage=onLanguageChange(render);render();refresh();
 window.addEventListener('pagehide',event=>{clearInterval(timer);timer=0;controller?.abort();controller=null;if(event.persisted)return;closed=true;observer.disconnect();stopLanguage();document.removeEventListener('visibilitychange',visibility);button.removeEventListener('click',refresh);});
 window.addEventListener('pageshow',event=>{if(event.persisted){render();polling();if(visible)refresh();}});
}
