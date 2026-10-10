// Typography and layout audit. Usage: node audit.mjs <url> <width> <height> [scopeSelector]
// Prints JSON: horizontal overflow, clipped/overflowing text, negative CJK tracking, overlapping text blocks,
// tiny text, font families used for CJK and Latin text, console errors. Env LANG_EN=1 for English.
import {spawn} from 'node:child_process';
import {mkdtemp} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
const [,, url, w='1440', h='900', scope='main'] = process.argv;
const chrome='C:/Program Files/Google/Chrome/Application/chrome.exe';
const port=20000+Math.floor(Math.random()*30000);
const profile=await mkdtemp(path.join(tmpdir(),'cz-audit-'));
const proc=spawn(chrome,['--headless=new',`--remote-debugging-port=${port}`,`--user-data-dir=${profile}`,'--hide-scrollbars',`--window-size=${w},${h}`,'about:blank'],{stdio:'ignore'});
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let target;for(let i=0;i<50;i++){try{const l=await (await fetch(`http://127.0.0.1:${port}/json`)).json();target=l.find(t=>t.type==='page');if(target)break;}catch{}await sleep(200);}
const ws=new WebSocket(target.webSocketDebuggerUrl);await new Promise(r=>ws.addEventListener('open',r));
let id=0;const pend=new Map(),logs=[];
ws.addEventListener('message',e=>{const m=JSON.parse(e.data);if(m.id&&pend.has(m.id)){pend.get(m.id)(m);pend.delete(m.id);}else if(m.method==='Runtime.exceptionThrown')logs.push('EXC '+(m.params.exceptionDetails.exception?.description||m.params.exceptionDetails.text).slice(0,200));else if(m.method==='Runtime.consoleAPICalled'&&m.params.type==='error')logs.push('ERR '+m.params.args.map(a=>a.value??a.description).join(' ').slice(0,200));});
const send=(method,params={})=>new Promise(r=>{const i=++id;pend.set(i,r);ws.send(JSON.stringify({id:i,method,params}));});
await send('Runtime.enable');await send('Page.enable');
await send('Emulation.setDeviceMetricsOverride',{width:+w,height:+h,deviceScaleFactor:1,mobile:+w<700});
if(process.env.LANG_EN)await send('Page.addScriptToEvaluateOnNewDocument',{source:"try{localStorage.setItem('chefzc.language','en')}catch{}"});
await send('Page.navigate',{url});await sleep(+(process.env.WAIT||7000));
const ev=async x=>(await send('Runtime.evaluate',{expression:x,returnByValue:true,awaitPromise:true})).result?.result?.value;
// Scroll through so lazy content renders, then back to top.
await ev(`(async()=>{for(let y=0;y<document.documentElement.scrollHeight;y+=innerHeight){scrollTo(0,y);await new Promise(r=>setTimeout(r,120));}scrollTo(0,0);await new Promise(r=>setTimeout(r,400));})()`);
const report=await ev(`(()=>{
const CJK=/[\\u3400-\\u9fff\\uf900-\\ufaff]/;
const root=document.querySelector(${JSON.stringify(scope)})||document.body;
const out={url:location.pathname+location.search,width:innerWidth,hOverflow:document.documentElement.scrollWidth-innerWidth,wf:document.documentElement.className.match(/wf-\\w+/g),negCJK:[],overflow:[],tiny:[],overlap:[],fontsCJK:{},fontsLatin:{}};
const label=el=>{let s=el.tagName.toLowerCase();if(el.id)s+='#'+el.id;if(el.classList.length)s+='.'+[...el.classList].slice(0,2).join('.');return s;};
const vis=el=>{const r=el.getBoundingClientRect();const cs=getComputedStyle(el);return r.width>0&&r.height>0&&cs.visibility!=='hidden'&&cs.display!=='none'&&+cs.opacity>0.05;};
const textEls=[];
for(const el of root.querySelectorAll('*')){
  if(el.closest('svg,script,style,noscript,.visually-hidden,.sr-only,.site-header,.h-chapters,.cz-cursor'))continue;
  let fixed=false;for(let a=el;a;a=a.parentElement){const p=getComputedStyle(a).position;if(p==='fixed'||p==='sticky'){fixed=true;break;}}if(fixed)continue;
  const decorative=!!el.closest('[aria-hidden=true]');
  const own=[...el.childNodes].filter(n=>n.nodeType===3).map(n=>n.textContent).join('').trim();
  if(!own||!vis(el))continue;
  const cs=getComputedStyle(el);const fs=parseFloat(cs.fontSize);const ls=cs.letterSpacing==='normal'?0:parseFloat(cs.letterSpacing);
  const fam=cs.fontFamily.split(',')[0].replace(/["']/g,'').trim();
  const isCJK=CJK.test(own);
  (isCJK?out.fontsCJK:out.fontsLatin)[fam]=((isCJK?out.fontsCJK:out.fontsLatin)[fam]||0)+1;
  if(isCJK&&ls/fs<-0.015)out.negCJK.push({el:label(el),ls:(ls/fs).toFixed(3)+'em',text:own.slice(0,24)});
  if(fs<11&&own.length>1)out.tiny.push({el:label(el),fs,text:own.slice(0,24)});
  if(el.scrollWidth>el.clientWidth+3&&cs.overflowX!=='visible'&&cs.textOverflow!=='ellipsis'&&el.clientWidth>0)out.overflow.push({el:label(el),sw:el.scrollWidth,cw:el.clientWidth,text:own.slice(0,24)});
  const r=el.getBoundingClientRect();
  if(r.right>innerWidth+2||r.left<-2)out.overflow.push({el:label(el),offscreen:[Math.round(r.left),Math.round(r.right)],text:own.slice(0,24)});
  if(!decorative)textEls.push({el,r,own});
}
// overlapping text blocks: compare text-bearing leaves with each other (not ancestors)
const leaves=textEls.filter(a=>!textEls.some(b=>b!==a&&a.el.contains(b.el)));
for(let i=0;i<leaves.length;i++)for(let j=i+1;j<leaves.length;j++){
  const a=leaves[i].r,b=leaves[j].r;
  const ix=Math.min(a.right,b.right)-Math.max(a.left,b.left),iy=Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top);
  if(ix>4&&iy>4&&ix*iy>Math.min(a.width*a.height,b.width*b.height)*0.25){
    const pa=getComputedStyle(leaves[i].el).position,pb=getComputedStyle(leaves[j].el).position;
    out.overlap.push({a:label(leaves[i].el)+':'+leaves[i].own.slice(0,14),b:label(leaves[j].el)+':'+leaves[j].own.slice(0,14),pos:pa+'/'+pb});
  }
}
for(const k of ['negCJK','overflow','tiny','overlap'])out[k+'Count']=out[k].length,out[k]=out[k].slice(0,25);
return out;})()`);
report.logs=logs.slice(0,15);
console.log(JSON.stringify(report,null,1));
ws.close();proc.kill();
