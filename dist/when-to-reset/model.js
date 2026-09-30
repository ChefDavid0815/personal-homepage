// An intentionally uncalibrated, transparent hazard model. No training claims.
export const MODEL_VERSION = 'signal-hazard-v3';
export const BASE_DAILY = 0.12;
const HOUR = 3600000;
const DAY = 24 * HOUR;
export const SOURCE_ZONE = 'America/Los_Angeles';
export function dayKey(date, zone = SOURCE_ZONE) {
  return new Intl.DateTimeFormat('en-CA', {timeZone: zone, year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(date));
}
export function shiftDay(key, n) { return new Date(Date.parse(key+'T12:00:00Z') + n*DAY).toISOString().slice(0,10); }
export function midnight(key, zone) {
  const target = Date.parse(key+'T00:00:00Z'); let guess = target;
  for (let i=0;i<4;i++) {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'}).formatToParts(new Date(guess)).map(v=>[v.type,v.value]));
    guess += target - Date.UTC(+p.year,+p.month-1,+p.day,+p.hour,+p.minute,+p.second);
  }
  return guess;
}
function targetDay(text, createdAt) {
  const key = dayKey(createdAt);
  if (/\btomorrow\b/i.test(text)) return shiftDay(key,1);
  if (/\btoday\b|\btonight\b|\bmidnight\b/i.test(text)) return key;
  const names = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  const match = text.toLowerCase().match(/(?:for|on|this|by|almost)\s+(sunday|monday|tuesday|wednesday|thursday|friday|saturday)/);
  if (match) return shiftDay(key,(names.indexOf(match[1])-new Date(key+'T12:00Z').getUTCDay()+7)%7);
  return null;
}
export function classify(text, createdAt) {
  const value = text.toLowerCase();
  const reset = /\breset(?:s|ting|ted)?\b/.test(value);
  const relevant = /codex|chatgpt work|usage|quota|rate.?limit|astra/.test(value);
  const bank = /\bbanked\s+resets?\b|\breset\s+cards?\b/.test(value);
  const globalReset = /(?:all|everyone|everybody|across).{0,55}(?:reset|usage|limits)|(?:reset|usage|limits).{0,55}(?:all|everyone|everybody|across)/s.test(value);
  if (/\?/.test(value) && /\b(?:when|will there|could|can you|should|is there)\b/.test(value) && !/\bi (?:promise|will|have)\b/.test(value)) return {kind:'context',weight:0,targetDay:null};
  if (reset && /(?:no|not|won't|will not|isn't|is not|aren't|cancelled|canceled)\s+(?:be\s+)?(?:a\s+)?(?:usage\s+|banked\s+)?resets?\b|reset.{0,25}(?:cancelled|canceled|delayed|postponed)/.test(value)) return {kind:'negative',weight:-1.6,targetDay:targetDay(text,createdAt)};
  if (bank) {
    const planned = /\b(?:will|we'll|going to|planning to|might|may)\b.{0,90}\b(?:banked\s+resets?|reset\s+cards?)\b|\b(?:banked\s+resets?|reset\s+cards?)\b.{0,35}\b(?:tomorrow|soon|next week)\b/.test(value);
    const delivering = /\b(?:loading|loaded|granting|granted|crediting|credited|issuing|issued|delivering|delivered|adding|added|providing|provided|rolling out|sending|sent)\b.{0,90}\b(?:banked\s+resets?|reset\s+cards?)\b|\b(?:banked\s+resets?|reset\s+cards?)\b.{0,60}\b(?:available|granted|credited|issued|delivered|loaded|landed|arrived|sent)\b/.test(value);
    if (planned) return {kind:'banked',stage:'planned',weight:2.2,targetDay:targetDay(text,createdAt)};
    if (delivering) return {kind:'banked',stage:'announced',weight:0,targetDay:null};
    return {kind:'banked',stage:'mentioned',weight:0,targetDay:null};
  }
  if (reset && /have (?:now )?been reset|(?:usage|limits) (?:have|are|were).{0,20}reset|(?:i|we)(?:'ve|’ve| have)? (?:now )?reset|resets? (?:all )?(?:propagated|complete|completed)|reset.{0,20}(?:is live|has landed)/.test(value) && (relevant || globalReset)) return {kind:'confirmed',weight:0,targetDay:null};
  if(reset&&/\b(?:ability|option|feature|way)\s+to\s+(?:save|bank|redeem|use)\b.{0,80}\bresets?\b|\b(?:save|bank|redeem)\b.{0,50}\bresets?\b.{0,40}\b(?:later|own time)\b/.test(value))return {kind:'policy',weight:0,targetDay:null};
  if (reset && (relevant || globalReset) && /\b(?:we|i)\s*(?:(?:'|’)(?:ll|re)|\s+(?:will|are going to|promised to))\s+reset\b|\b(?:we|i)\s+(?:will|are going to|promised to)\s+reset\b/.test(value)) return {kind:'promise',stage:'committed',weight:2.9,targetDay:targetDay(text,createdAt)};
  if (reset && /promis|will|going to|landing|incoming|give us|coming|in the next|tomorrow|tonight|today/.test(value)) return {kind:'promise',weight:2.9,targetDay:targetDay(text,createdAt)};
  if (relevant && /fix|efficien|rolled back|roll.{0,6}back|resolved|improv/.test(value)) return {kind:'repair',weight:.45,targetDay:null};
  if (reset && !/password|factory|computer|device|conversation|context|my (?:own )?(?:weekly|5h)|when (?:is|does|will)/.test(value)) return {kind:'hint',weight:.3,targetDay:null};
  if (relevant && /launch|ship|releas/.test(value)) return {kind:'release',weight:.2,targetDay:null};
  return {kind:'context',weight:0,targetDay:null};
}
export function excerpt(text) {
  const words = String(text).replace(/https?:\/\/\S+/g,'').split(/\s+/).filter(Boolean);
  const bankPivot = words.findIndex(w=>/banked|reset/i.test(w));
  const pivot = bankPivot>=0?bankPivot:words.findIndex(w=>/codex|efficien|usage|limit/i.test(w));
  const start = Math.max(0,pivot-6);
  return (start ? '… ' : '')+words.slice(start,start+24).join(' ')+(words.length>start+24?' …':'');
}
export function normalizePost(post) {
  if (post.author?.screen_name?.toLowerCase() !== 'thsottiaux' || !/^\d{10,25}$/.test(post.id) || typeof post.text !== 'string') return null;
  const time = Date.parse(post.created_at);
  if (!Number.isFinite(time)) return null;
  const createdAt = new Date(time).toISOString();
  return {id:post.id,author:'Tibo',handle:'thsottiaux',authority:'first-party',url:`https://x.com/thsottiaux/status/${post.id}`,createdAt,excerpt:excerpt(post.text),...classify(post.text,createdAt)};
}
export function normalizeRelatedPost(post) {
  const handle=post.author?.screen_name?.toLowerCase();
  if(!/^[a-z0-9_]{1,15}$/.test(handle||'')||!/^\d{10,25}$/.test(post.id)||typeof post.text!=='string'||/^RT\s+@/i.test(post.text))return null;
  if(!/\bcodex\b|\bchatgpt\s+work\b/i.test(post.text)||!/\breset(?:s|ting|ted)?\b|\bbanked\s+reset\b|重置|额度刷新/.test(post.text))return null;
  const time=Date.parse(post.created_at);
  if(!Number.isFinite(time))return null;
  const createdAt=new Date(time).toISOString();
  const authority=['thsottiaux','openai','openaidevs'].includes(handle)?'first-party':'community';
  return {id:post.id,author:String(post.author.name||`@${handle}`).slice(0,60),handle,authority,related:true,url:`https://x.com/${handle}/status/${post.id}`,createdAt,excerpt:excerpt(post.text),...classify(post.text,createdAt)};
}
function weightAt(signal, at, latestObserved) {
  const age = (at-Date.parse(signal.createdAt))/HOUR;
  if (age<0 || age>168 || signal.weight===0) return 0;
  if (signal.authority==='community') return 0;
  // A completed event retires earlier promises/hints, never raises another forecast.
  if (latestObserved && Date.parse(signal.createdAt)<=latestObserved && ['promise','hint','negative','banked'].includes(signal.kind)) return 0;
  if (signal.targetDay) return dayKey(at)===signal.targetDay ? signal.weight : 0;
  return signal.weight * 2**(-age/(['promise','banked'].includes(signal.kind)?12:24));
}
export function forecast(snapshot, now = Date.now(), zone = SOURCE_ZONE) {
  now = +new Date(now);
  const unique = [...new Map((snapshot.signals||[]).filter(s=>Number.isFinite(Date.parse(s.createdAt))&&Date.parse(s.createdAt)<=now).map(s=>[s.id,s])).values()];
  const confirmations = unique.filter(s=>s.authority!=='community'&&(s.kind==='confirmed'||(s.kind==='banked'&&s.stage==='announced')));
  const latestObserved = Math.max(0,...confirmations.map(s=>Date.parse(s.createdAt)));
  const latestDenial = Math.max(0,...unique.filter(s=>s.authority!=='community'&&s.kind==='negative').map(s=>Date.parse(s.createdAt)));
  const key = dayKey(now,zone); const todayStart = midnight(key,zone);
  const tomorrowStart = midnight(shiftDay(key,1),zone); const end = midnight(shiftDay(key,2),zone);
  function probability(start,finish) {
    let hazard=0;
    for (let time=start;time<finish;time+=HOUR/4) {
      const size=Math.min(HOUR/4,finish-time), at=time+size/2;
      const groups={};
      for (const s of unique) {
        const w=weightAt(s,at,latestObserved);
        if (Math.abs(w)>Math.abs(groups[s.kind]||0)) groups[s.kind]=w;
      }
      // Related posts count once per category, with a cap on combined positive evidence.
      const positive=Math.min(3.1,Object.values(groups).filter(x=>x>0).reduce((a,b)=>a+b,0));
      const negative=Object.values(groups).filter(x=>x<0).reduce((a,b)=>a+b,0);
      hazard += -Math.log(1-BASE_DAILY)/24 * Math.exp(positive+negative) * size/HOUR;
    }
    const base=Math.min(95,Math.round((1-Math.exp(-hazard))*100));
    const commitments=unique.filter(s=>s.authority==='first-party'&&s.kind==='promise'&&s.stage==='committed'&&Date.parse(s.createdAt)>Math.max(latestObserved,latestDenial));
    const floor=commitments.reduce((strongest,s)=>{
      const published=Date.parse(s.createdAt);
      let windowStart=published,windowEnd=published+36*HOUR;
      if(s.targetDay){windowStart=midnight(s.targetDay,SOURCE_ZONE);windowEnd=midnight(shiftDay(s.targetDay,1),SOURCE_ZONE);}
      const overlap=Math.max(0,Math.min(finish,windowEnd)-Math.max(start,windowStart));
      if(!overlap)return strongest;
      const freshness=now-published<24*HOUR?85:70;
      return Math.max(strongest,Math.round(freshness*Math.min(1,overlap/(finish-start))));
    },0);
    return Math.max(base,Math.min(95,floor));
  }
  const observed=confirmations.filter(s=>Date.parse(s.createdAt)>=todayStart).sort((a,b)=>Date.parse(b.createdAt)-Date.parse(a.createdAt))[0];
  const latestReport=confirmations.sort((a,b)=>Date.parse(b.createdAt)-Date.parse(a.createdAt))[0]||null;
  const commitment=unique.filter(s=>s.authority==='first-party'&&s.kind==='promise'&&s.stage==='committed'&&Date.parse(s.createdAt)>Math.max(latestObserved,latestDenial)&&now-Date.parse(s.createdAt)<36*HOUR).sort((a,b)=>Date.parse(b.createdAt)-Date.parse(a.createdAt))[0]||null;
  return {version:MODEL_VERSION,zone,asOf:new Date(now).toISOString(),latestObserved:latestReport,today:{start:new Date(now).toISOString(),end:new Date(tomorrowStart).toISOString(),probability:observed?100:probability(now,tomorrowStart),observed:observed||null,commitment},tomorrow:{start:new Date(tomorrowStart).toISOString(),end:new Date(end).toISOString(),probability:probability(tomorrowStart,end)},factors:unique.map(s=>({...s,currentWeight:weightAt(s,now,latestObserved)})).sort((a,b)=>Math.abs(b.currentWeight)-Math.abs(a.currentWeight)||Date.parse(b.createdAt)-Date.parse(a.createdAt))};
}
export function sortSignals(signals,mode='relevant',now=Date.now()) {
  const time=+new Date(now);
  function rank(s) {
    const recent=time-Date.parse(s.createdAt)<48*HOUR;
    if(s.authority==='first-party'&&recent&&(s.kind==='confirmed'||(s.kind==='banked'&&s.stage==='announced')))return 6;
    if(s.authority==='first-party'&&recent&&s.kind==='promise'&&s.stage==='committed'&&s.currentWeight>0)return 5;
    if(s.authority==='first-party'&&recent&&['promise','negative','banked'].includes(s.kind)&&s.currentWeight!==0)return 4;
    if(s.authority==='first-party'&&(s.kind!=='context'||s.related))return 3;
    if(s.authority==='community')return 2;
    if(s.kind==='incident')return 1;
    return 0;
  }
  return [...signals].sort((a,b)=>mode==='all'?Date.parse(b.createdAt)-Date.parse(a.createdAt):rank(b)-rank(a)||Date.parse(b.createdAt)-Date.parse(a.createdAt));
}
export function mergeSnapshot(previous,incoming,now=Date.now()) {
  if(!previous?.sources||!incoming?.sources)return incoming;
  const time=+new Date(now),oldSignals=previous.signals||[],retained=[];
  const sources={...incoming.sources};
  function recent(key) {
    const old=previous.sources[key],age=time-Date.parse(old?.lastSuccess);
    return Number.isFinite(age)&&age>=0&&age<24*HOUR&&Date.parse(old.lastSuccess)>Date.parse(incoming.sources[key]?.lastSuccess||0);
  }
  if(incoming.sources.x?.state!=='available'&&recent('x')){
    retained.push(...oldSignals.filter(s=>s.handle==='thsottiaux'));
    sources.x={...incoming.sources.x,state:'stale',lastSuccess:previous.sources.x.lastSuccess,count:previous.sources.x.count,latestPostAt:previous.sources.x.latestPostAt};
  }
  if(incoming.sources.discovery?.state!=='available'&&recent('discovery')){
    const available=new Set(incoming.sources.discovery.availableAccounts||[]);
    retained.push(...oldSignals.filter(s=>['openai','openaidevs'].includes(s.handle)&&!available.has(s.handle)));
    sources.discovery={...incoming.sources.discovery,state:incoming.sources.discovery.state==='partial'?'partial':'stale',lastSuccess:incoming.sources.discovery.state==='partial'?incoming.sources.discovery.lastSuccess:previous.sources.discovery.lastSuccess};
  }
  if(incoming.sources.status?.state!=='available'&&recent('status')){
    retained.push(...oldSignals.filter(s=>s.id.startsWith('status-')));
    sources.status={...incoming.sources.status,state:'stale',lastSuccess:previous.sources.status.lastSuccess};
  }
  return {...incoming,sources,signals:[...new Map([...(incoming.signals||[]),...retained].map(s=>[s.id,s])).values()]};
}
