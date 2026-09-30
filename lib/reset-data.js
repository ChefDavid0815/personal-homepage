import {normalizePost,normalizeRelatedPost} from '../dist/when-to-reset/model.js';
import {HISTORY_EVENTS} from '../dist/reset-history/data.js';

let cache;
let inFlight;
const TTL=5000;
const OFFICIAL_HANDLES=['openai','openaidevs'];
const TIBO_URL='https://api.fxtwitter.com/2/profile/thsottiaux/statuses?count=100&with_replies=true';
const reviewed=HISTORY_EVENTS.reduce((latest,event)=>!latest||Date.parse(event.at)>Date.parse(latest.at)?event:latest,null);
const reviewedPost=reviewed.sources.findLast(source=>source.postId);
const reviewedSignal={id:reviewedPost.postId,author:'Tibo',handle:'thsottiaux',authority:'first-party',archived:true,url:`https://x.com/thsottiaux/status/${reviewedPost.postId}`,createdAt:reviewed.at,excerpt:reviewed.summary.en,kind:reviewed.type==='banked'?'banked':'confirmed',stage:reviewed.type==='banked'?'announced':undefined,weight:0,targetDay:null};

async function json(url) {
  const response=await fetch(url,{signal:AbortSignal.timeout(11000),headers:{Accept:'application/json','User-Agent':'WhenToReset/1.0 (+https://chefzc.dev/when-to-reset/)'}});
  if(!response.ok)throw new Error(`HTTP ${response.status}`);
  const data=await response.json();
  if(data.code&&data.code!==200)throw new Error('Upstream unavailable');
  return data;
}

export function statusSignals(data,now=Date.now()) {
  return (data.incidents||[]).filter(i=>/codex|chatgpt work/i.test(i.name)&&now-Date.parse(i.created_at)<72*3600000).map(i=>({id:'status-'+i.id,author:'OpenAI Status',handle:'OpenAI',authority:'first-party',url:`https://status.openai.com/incidents/${i.id}`,createdAt:i.created_at,excerpt:i.name.slice(0,240),kind:'incident',weight:i.impact==='major'?.55:.3,targetDay:null,status:i.status}));
}

function sourceState(fresh,old) {
  return fresh?'available':old?.lastSuccess?'stale':'unavailable';
}

export async function getResetData() {
  if(cache&&Date.now()-Date.parse(cache.checkedAt)<TTL)return cache;
  if(inFlight)return inFlight;
  inFlight=(async()=>{
    const [tiboResult,...rest]=await Promise.allSettled([
      json(TIBO_URL),
      ...OFFICIAL_HANDLES.map(handle=>json(`https://api.fxtwitter.com/2/profile/${handle}/statuses?count=100&with_replies=true`)),
      json('https://status.openai.com/api/v2/incidents.json')
    ]);
    const statusResult=rest.pop();
    const now=new Date(Date.now()).toISOString();
    const old=cache;
    const tibo=tiboResult.status==='fulfilled'&&Array.isArray(tiboResult.value.results)?tiboResult.value.results.map(normalizePost).filter(Boolean):null;
    const officialResults=rest.map(result=>result.status==='fulfilled'&&Array.isArray(result.value.results)?result.value.results.map(normalizeRelatedPost).filter(Boolean):null);
    const officialAvailable=officialResults.some(Boolean);
    const official=OFFICIAL_HANDLES.flatMap((handle,index)=>officialResults[index]??old?.signals.filter(s=>s.handle===handle)??[]);
    const incidents=statusResult.status==='fulfilled'&&Array.isArray(statusResult.value.incidents)?statusSignals(statusResult.value):null;
    const tiboSignals=tibo??old?.signals.filter(s=>s.handle==='thsottiaux')??[];
    const officialSignals=official;
    const statusEntries=incidents??old?.signals.filter(s=>s.id.startsWith('status-'))??[];
    const signals=[...new Map([reviewedSignal,...tiboSignals,...officialSignals,...statusEntries].map(s=>[s.id,s])).values()];
    cache={
      checkedAt:now,refreshSeconds:10,
      sources:{
        x:{state:sourceState(tibo!==null,old?.sources.x),provider:'FxEmbed public X mirror',url:'https://x.com/thsottiaux',lastSuccess:tibo!==null?now:old?.sources.x.lastSuccess||null,latestPostAt:tibo?.reduce((latest,p)=>p.createdAt>latest?p.createdAt:latest,'')||old?.sources.x.latestPostAt||null,count:tibo?.length??old?.sources.x.count??0},
        discovery:{state:officialAvailable?officialResults.every(Boolean)?'available':'partial':old?.sources.discovery?.lastSuccess?'stale':'unavailable',provider:'FxEmbed public X mirror',accounts:OFFICIAL_HANDLES,availableAccounts:OFFICIAL_HANDLES.filter((_,index)=>officialResults[index]!==null),url:'https://x.com/search?q=%28Codex%20OR%20%22ChatGPT%20Work%22%29%20reset&f=live',lastSuccess:officialAvailable?now:old?.sources.discovery?.lastSuccess||null,count:officialAvailable?official.length:old?.sources.discovery?.count||0},
        status:{state:sourceState(incidents!==null,old?.sources.status),provider:'OpenAI Status',url:'https://status.openai.com',lastSuccess:incidents!==null?now:old?.sources.status.lastSuccess||null}
      },
      signals
    };
    return cache;
  })().finally(()=>{inFlight=null;});
  return inFlight;
}
