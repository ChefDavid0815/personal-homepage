import { getLanguage, onLanguageChange } from './i18n.js';
import { selectRange, prices, priceDate, priceSource } from './usage-math.js';

const $=id=>document.getElementById(id);
const c=(zh,en)=>getLanguage()==='en'?en:zh;
const number=value=>new Intl.NumberFormat(getLanguage()==='en'?'en-US':'zh-CN').format(value);
const short=value=>value>=1e9?(value/1e9).toFixed(2)+'B':value>=1e6?(value/1e6).toFixed(2)+'M':value>=1e3?(value/1e3).toFixed(1)+'K':number(value);
const money=value=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',minimumFractionDigits:2,maximumFractionDigits:2}).format(value);
const esc=value=>String(value).replace(/[&<>"']/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
const date=(value,options={})=>new Intl.DateTimeFormat(getLanguage()==='en'?'en-GB':'zh-CN',{timeZone:'Asia/Dubai',month:'short',day:'numeric',...options}).format(new Date(value));
const names={'gpt-6-astra':'GPT-6 Astra','gpt-5.6-sol':'GPT-5.6 Sol','gpt-5.6-terra':'GPT-5.6 Terra','gpt-5.6-luna':'GPT-5.6 Luna'};
const colors=['#c4fa5a','#a890fc','#78d9f1','#f091bb','#ffcd89'];
let snapshot=null,range='today',selection=null,stream=null,retry=null,offline=false,offset=0,lastRender='',currentDay='';
const now=()=>Date.now()+offset;
const period=()=>({today:c('今日','Today'),'7d':c('近 7 天','7 days'),'30d':c('近 30 天','30 days'),lifetime:c('累计','Lifetime')})[range];

function labels() {
  document.title=c('Pulse — ChefZC 的 Codex 用量','Pulse — ChefZC’s Codex usage');
  document.querySelector('.skip-link').textContent=c('跳到用量统计','Skip to usage');
  $('usage-intro').innerHTML=c('让每一次探索，<br><span>留下刻度。</span>','Every token.<br> <span>A little progress.</span>');
  const ranges={today:c('今日','Today'),'7d':c('近 7 天','7 days'),'30d':c('近 30 天','30 days'),lifetime:c('累计','Lifetime')};
  document.querySelectorAll('[data-range]').forEach(b=>{b.textContent=ranges[b.dataset.range];b.setAttribute('aria-pressed',String(range===b.dataset.range));});
  $('usage-ranges').setAttribute('aria-label',c('统计时间范围','Usage period'));
  $('usage-refresh').setAttribute('aria-label',c('刷新用量','Refresh usage'));
  $('usage-metrics').setAttribute('aria-label',c('用量概览','Usage overview'));
  $('usage-chart-title').textContent=c('探索的节奏','The rhythm of making');
  $('usage-model-title').textContent=c('一起创造的模型','The models behind it');
  $('usage-cost-title').textContent=c('如果按 API 计价','At API prices');
  $('usage-chart-legend').innerHTML=`<span><i class="is-input"></i>${c('普通输入','Input')}</span><span><i class="is-cached"></i>${c('缓存读取','Cached')}</span><span><i class="is-output"></i>${c('输出','Output')}</span>`;
  $('usage-method-title').innerHTML=c('统计口径、价格与同步方式 <span>+</span>','About the numbers, prices & sync <span>+</span>');
  $('usage-closing').textContent=c('数字记录投入，好奇心决定去向。','Numbers measure effort. Curiosity chooses the direction.');
  $('usage-method-body').innerHTML=`<div><h3>${c('真实记录，清楚边界','Real records, a clear scope')}</h3><p>${c('统计来自这台电脑上保留的 Codex 本地与归档记录，包括子任务。累计从最早可追溯记录开始，不代表账号在其他设备、云任务、ChatGPT 聊天或已删除记录中的全部使用。','Includes preserved local and archived Codex records on this computer, including subagents. Lifetime begins with the earliest available record; it is not an account-wide total for other devices, cloud tasks, ChatGPT chats or deleted history.')}</p><p>${c('输入包含缓存读取与缓存写入；输出已包含推理 Token。总量 = 输入 + 输出，缓存与推理不再加一次。重复快照和分支复制的历史会去重。','Input includes cache reads and writes. Output includes reasoning. Total = input + output; cached and reasoning tokens are not added a second time. Repeated snapshots and copied fork history are deduplicated.')}</p></div><div><h3>${c('每次调用后的精确更新','Exact updates after each model call')}</h3><p>${c('本机同步器持续追踪原始用量事件，只上传按小时、模型汇总的数字。云端通过事件流推送变化。模型调用尚未报告精确用量时，数字保持上次实值；不模拟逐 Token 增长。电脑关机或离线时保留最后记录。','A local collector follows original usage events and uploads only hourly model aggregates. The server streams changes to this page. Until a model call reports its precise usage, the last actual count remains; there is no simulated token counter. Offline computers retain their last synced record.')}</p><p>${c('今日、近 7 天、近 30 天按迪拜日历日统计，均包含今天。用量记录落地后通常数秒内更新，具体延迟取决于 Codex 上报与网络。','Today, 7 days and 30 days use Dubai calendar days, including today. New recorded usage normally appears within seconds; actual latency depends on Codex reporting and the network.')}</p></div><div><h3>${c('等额估算，不是账单','An equivalent, not a bill')}</h3><p>${c('使用当前公开的 Standard API 美元单价重新计算，不等于 Pro 订阅支出。普通输入 = 总输入 − 缓存读取 − 缓存写入；四类 Token 分别按各模型单价计费。超过 272K 输入的单次请求按长上下文单价计算。未知模型或无法确定请求长度的记录单列为未计价。','Repriced at published Standard API rates in USD; this is not Pro subscription spending. Uncached input = total input − cache reads − cache writes. Each category uses its model rate. Requests above 272K input tokens use long-context rates. Unknown models or ambiguous request lengths remain unpriced.')}</p><p>${c('不含图片、语音、工具调用附加费用、税费和地区加价。价格核对日期：','Excludes images, audio, tool fees, taxes and regional uplifts. Rates checked: ')}${priceDate} · <a href="${priceSource}" target="_blank" rel="noopener noreferrer">${c('OpenAI 官方价格 ↗','Official OpenAI pricing ↗')}</a></p><div id="usage-rate-table"></div></div>`;
  updateStatus(); render(true);
}

function updateStatus() {
  const age=snapshot?Math.max(0,now()-Date.parse(snapshot.collectedAt)):Infinity;
  const fresh=age<90000 && !offline;
  $('usage-connection').dataset.state=fresh?'live':snapshot?'stale':'loading';
  $('usage-status').textContent=!snapshot?c('连接用量记录…','Connecting…'):offline?c('重连中 · 已保留记录','Reconnecting · records retained'):fresh?c('云端同步已连接','Cloud sync connected'):c('同步器离线 · 最后记录','Collector offline · last record');
  if(snapshot) $('usage-scope').textContent=`${period()} · ${c('本机记录自','Local records since')} ${date(snapshot.firstEventAt,{year:'numeric'})} · ${c('最后同步','Synced')} ${date(snapshot.collectedAt,{hour:'2-digit',minute:'2-digit',second:'2-digit'})}`;
  else $('usage-scope').textContent=c('只展示真实用量。正在读取云端汇总…','Actual usage only. Reading the cloud aggregate…');
}

function render(force=false) {
  if(!snapshot) {
    $('usage-metrics').innerHTML=Array.from({length:4},()=>'<div class="usage-metric usage-skeleton"><span>···</span><strong>—</strong><small>CODEX / PULSE</small></div>').join('');
    return;
  }
  const key=snapshot.lastEventAt+range+getLanguage()+new Date(now()+14400000).toISOString().slice(0,13);
  if(!force && key===lastRender) return;
  lastRender=key;
  selection=selectRange(snapshot,range,now());
  const {total,models,bins}=selection;
  const cachePercent=total.input?total.cached/total.input*100:0;
  const metrics=[
    ['total',c('Token 总量','TOTAL TOKENS'),short(total.total),number(total.total)+' '+c('个 Token','tokens')],
    ['input',c('输入 Token','INPUT TOKENS'),short(total.input),`${cachePercent.toFixed(1)}% ${c('来自缓存读取','cache reads')}`],
    ['output',c('输出 Token','OUTPUT TOKENS'),short(total.output),`${short(total.reasoning)} ${c('推理 Token · 已包含','reasoning · included')}`],
    ['price',c('等额 API 估算','API EQUIVALENT'),money(total.cost),total.unpriced?`${short(total.unpriced)} ${c('Token 未计价','tokens unpriced')}`:c('Standard 单价 · 非实际账单','Standard rates · not a bill')]
  ];
  $('usage-metrics').innerHTML=metrics.map(([id,label,value,note],i)=>`<article class="usage-metric metric-${id}"><span>${label}<small>0${i+1}</small></span><strong>${value}</strong><small>${note}</small></article>`).join('');
  const max=Math.max(...bins.map(b=>b.total),1),activeIndex=document.activeElement?.dataset.bin;
  $('usage-chart').innerHTML=`<div class="usage-y-axis"><span>${short(max)}</span><span>${short(max/2)}</span><span>0</span></div><div class="usage-plot" style="--columns:${bins.length}">${bins.map((b,i)=>{
    const label=range==='today'?date(b.time,{hour:'2-digit',minute:'2-digit'}).split(' ').at(-1):date(b.time);
    const title=b.covered?`${date(b.time,range==='today'?{hour:'2-digit',minute:'2-digit'}:{})} · ${number(b.total)} tokens`:c('无历史记录','No recorded history');
    return `<div class="usage-column"><button type="button" class="usage-bar${b.covered?'':' is-uncovered'}" data-bin="${i}" aria-label="${esc(title)}" style="--height:${Math.max(b.total?1:0,b.total/max*100)}%"><span class="bar-stack"><i class="is-input" style="flex:${b.input-b.cached-b.write}"></i><i class="is-cached" style="flex:${b.cached}"></i><i class="is-write" style="flex:${b.write}"></i><i class="is-output" style="flex:${b.output}"></i></span></button><span class="usage-x-label">${bins.length>12&&i%Math.ceil(bins.length/8)!==0&&i!==bins.length-1?'':esc(label)}</span></div>`;
  }).join('')}</div>`;
  if(activeIndex!==undefined) document.querySelector(`[data-bin="${activeIndex}"]`)?.focus({preventScroll:true});
  $('usage-chart-detail').textContent=c('悬停或选中柱形，查看输入与输出的分布。','Hover or select a bar to explore the token mix.');
  let angle=0;
  const gradient=models.map((m,i)=>{const start=angle;angle+=m.total/(total.total||1)*360;return `${colors[i%colors.length]} ${start}deg ${angle}deg`;}).join(',')||'#304137 0deg 360deg';
  $('usage-models').innerHTML=`<div class="usage-orbit" style="--model-gradient:conic-gradient(${gradient})"><div><strong>${models.length}</strong><span>${c('模型','MODELS')}</span></div></div><div class="usage-model-list">${models.length?models.map((m,i)=>`<div><i style="background:${colors[i%colors.length]}"></i><span><b>${esc(names[m.model]||m.model)}</b><small>${number(m.total)} tokens</small></span><strong>${(m.total/(total.total||1)*100).toFixed(2)}%</strong></div>`).join(''):`<p>${c('这个时段暂无记录。','No records in this period.')}</p>`}</div>`;
  const categories=[['input',c('普通输入','Uncached input'),total.input-total.cached-total.write],['cached',c('缓存读取','Cache reads'),total.cached],['write',c('缓存写入','Cache writes'),total.write],['output',c('输出 · 含推理','Output · reasoning included'),total.output]];
  $('usage-cost').innerHTML=`<div class="usage-cost-number">${money(total.cost)}<span>${c('等额估算','EQUIVALENT')}</span></div><div class="usage-flow">${categories.map(([id,,n])=>`<i class="is-${id}" style="flex:${n}"></i>`).join('')}</div><dl class="usage-cost-breakdown">${categories.filter(([, ,n])=>n>0).map(([id,label,n])=>`<div><dt><i class="is-${id}"></i>${label}</dt><dd>${short(n)} <small>tokens</small></dd></div>`).join('')}</dl><p class="usage-cost-caption">${total.unpriced?short(total.unpriced)+' '+c('个 Token 缺少可靠价格，未纳入金额。','tokens lack a reliable price and are excluded.'):c('为好奇心记账。这里只计算 Token 的等额价格。','A ledger for curiosity. Token-equivalent pricing only.')}</p>`;
  const rateModels=models.filter(m=>prices[m.model]);
  $('usage-rate-table').innerHTML=`<div class="usage-table-scroll"><table><caption>${c('USD / 每百万 Token · 短上下文','USD / million tokens · short context')}</caption><thead><tr><th>${c('模型','Model')}</th><th>${c('输入','Input')}</th><th>${c('缓存','Cached')}</th><th>${c('写入','Write')}</th><th>${c('输出','Output')}</th></tr></thead><tbody>${rateModels.map(m=>`<tr><td>${esc(names[m.model]||m.model)}</td>${['input','cached','write','output'].map(k=>`<td>${prices[m.model][k]===null?'—':'$'+prices[m.model][k]}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
  updateStatus();
}

function detail(index) {
  const b=selection?.bins[index];if(!b)return;
  $('usage-chart-detail').textContent=b.covered?`${date(b.time,range==='today'?{hour:'2-digit',minute:'2-digit'}:{})} · ${c('输入','Input')} ${short(b.input-b.cached-b.write)} / ${c('缓存','Cached')} ${short(b.cached)} / ${c('输出','Output')} ${short(b.output)} · ${number(b.total)} tokens`:c('该日期早于最早可追溯记录，无法统计。','This date precedes the earliest available record.');
}
$('usage-chart').addEventListener('pointerover',event=>{const b=event.target.closest('[data-bin]');if(b)detail(Number(b.dataset.bin));});
  $('usage-chart').addEventListener('focusin',event=>{if(event.target.dataset.bin!==undefined)detail(Number(event.target.dataset.bin));});
$('usage-chart').addEventListener('click',event=>{const b=event.target.closest('[data-bin]');if(b)detail(Number(b.dataset.bin));});
$('usage-chart').addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;const i=Number(event.target.dataset.bin);if(!Number.isInteger(i))return;event.preventDefault();const end=selection.bins.length-1;const next=event.key==='Home'?0:event.key==='End'?end:Math.max(0,Math.min(end,i+(event.key==='ArrowRight'?1:-1)));document.querySelector(`[data-bin="${next}"]`)?.focus();});
$('usage-ranges').addEventListener('click',event=>{const b=event.target.closest('[data-range]');if(!b)return;range=b.dataset.range;labels();});

function accept(data) {
  if(!data?.hours || !data.collectedAt)return;
  snapshot=data;offline=false;
  if(data.serverTime)offset=Date.parse(data.serverTime)-Date.now();
  $('usage-error').hidden=true;render();updateStatus();
}
async function fetchSnapshot() {
  try {const response=await fetch('/api/usage',{cache:'no-store',signal:AbortSignal.timeout(10000)});if(!response.ok)throw Error('Unavailable');accept(await response.json());}
  catch {offline=true;$('usage-error').hidden=false;$('usage-error').textContent=c('暂时无法连接用量服务，正在自动重试。已有记录会继续保留。','The usage service is temporarily unavailable. Retrying automatically; existing records are retained.');updateStatus();}
}
function connect() {
  stream?.close();clearTimeout(retry);
  if(document.hidden)return;
  stream=new EventSource('/api/usage-stream');
  stream.onmessage=event=>{try{accept(JSON.parse(event.data));}catch{/* Ignore incomplete event. */}};
  stream.addEventListener('unavailable',()=>{offline=true;updateStatus();});
  stream.onerror=()=>{stream?.close();retry=setTimeout(()=>{fetchSnapshot();connect();},2000);};
}
$('usage-refresh').addEventListener('click',()=>{fetchSnapshot();connect();});
document.addEventListener('visibilitychange',()=>{if(document.hidden){stream?.close();clearTimeout(retry);}else{fetchSnapshot();connect();}});
window.addEventListener('pagehide',()=>{stream?.close();clearTimeout(retry);});
window.addEventListener('online',()=>{fetchSnapshot();connect();});
onLanguageChange(labels);labels();fetchSnapshot();connect();
setInterval(()=>{if(document.hidden)return;updateStatus();const day=new Date(now()+14400000).toISOString().slice(0,13);if(day!==currentDay){currentDay=day;render();}},5000);
