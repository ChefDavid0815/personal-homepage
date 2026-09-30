import {HISTORY_EVENTS, ARCHIVE_REVIEWED_AT} from './data.js';
import {mergeHistory, historyStats, sourceUrl} from './model.js';

const $ = id => document.getElementById(id);
const make = (tag, className, value) => {const el=document.createElement(tag);if(className)el.className=className;if(value!==undefined)el.textContent=value;return el;};
let lang='en';try{lang=localStorage.getItem('chefzc.language')||(navigator.language.startsWith('zh')?'zh':'en');}catch{}
let filter='all',newestFirst=true,events=mergeHistory(HISTORY_EVENTS),lastCheck=null,sourceState='checking',refreshing=false;
const words={
  back:['← Live radar','← 实时雷达'],kicker:['THE RECEIPTS DRAWER IS OPEN','重置凭据抽屉已打开'],intro:['Every “it’s landing” deserves a timestamp.','每一次“快到了”，都值得一个时间戳。'],stampTop:['PUBLIC POSTS','公开记录'],stampBottom:['little moments<br>of renewed hope','一次次<br>重新燃起的希望'],
  overviewKicker:['01 / THE RECEIPTS SO FAR','01 / 目前找到的依据'],overviewTitle:['Public reset moments<span>.</span>','公开重置节点<span>.</span>'],overviewDescription:["A selected history of Tibo’s posts and OpenAI’s documented dates. One event can have several posts; the timeline keeps them together.",'从 Tibo 帖子及 OpenAI 官方日期整理的精选历史。同一次事件的多条帖子会归在一起。'],
  bankedKicker:['02 / SAVE IT FOR LATER','02 / 存起来，稍后再用'],bankedTitle:['Banked resets','重置卡'],bankedDescription:['A card saved for eligible accounts. You choose when to use it.','发到符合条件的账号里，什么时候用由你决定。'],automaticKicker:['03 / PRESS IT NOW','03 / 直接刷新额度'],automaticTitle:['Automatic resets','自动重置'],automaticDescription:['The extra usage reset applies directly to eligible limits.','额外重置直接作用于符合条件的额度。'],
  disclaimer:["Times below are when Tibo posted or reported completion, not the exact second your account changed. This is a selected public archive, not a complete account log.",'下面是 Tibo 发帖或报告完成的时间，不是你的账号额度变化的精确时刻。这是一份精选公开档案，不是完整账号日志。'],
  timelineKicker:['SCROLL BACK. CLICK THE RECEIPTS.','往前翻翻，每条都有出处。'],timelineTitle:['The reset timeline<span>.</span>','重置时间线<span>.</span>'],all:['All moments','全部节点'],bankedFilter:['Banked','重置卡'],automaticFilter:['Automatic','自动重置'],connecting:["Checking Tibo’s latest posts…",'正在检查 Tibo 的最新帖子…'],timezone:['Show times in','显示时区'],newest:['Newest first ↓','最新在前 ↓'],oldest:['Oldest first ↑','最早在前 ↑'],
  roomTitle:['TWO KINDS OF “RESET”','两种不同的“重置”'],roomBanked:['Banked card','重置卡'],roomBankedText:['Saved to an eligible account. It does not refill limits until you apply it.','存入符合条件的账号。由你使用后，额度才会刷新。'],roomAuto:['Automatic reset','自动重置'],roomAutoText:['Applied directly to eligible usage limits. Nothing to redeem.','直接应用于符合条件的额度，无需手动领取。'],roomSource:["Posts and replies come from the public FxEmbed mirror. Newly detected items are labelled and should be checked against the original post. The reviewed archive stays visible if live checks fail.",'通过 FxEmbed 公开镜像读取帖子与回复。新识别的节点会单独标记，请结合原帖判断。实时检查失败时，已核对的档案仍可查看。'],officialGuide:["OpenAI’s reset guide",'OpenAI 重置说明'],reviewed:['REVIEWED SEP 26, 2026','2026.09.26 已核对'],
  methodTitle:['How did a post become a time node?','一条帖子如何成为时间节点？'],methodOne:["Reviewed milestones group Tibo’s posts about one reset, with each original linked. An announcement is labelled as an announcement; a completion report is labelled as a report. OpenAI’s help article confirms the September 3 and 4 banked grants and the September 7 global reset date.",'人工核对的节点把同一次重置的多条 Tibo 帖子归在一起，并保留原帖链接。预告仍标作预告，完成报告仍标作报告。OpenAI 官方说明确认 9 月 3、4 日的重置卡发放和 9 月 7 日的全局重置日期。'],methodTwo:["The live radar also checks Tibo’s latest posts for explicit banked-reset rollout language or automatic-reset completion reports. New matches appear with an “auto-detected” label until reviewed. Questions, vague hints and future promises stay off this history.",'实时雷达也检查 Tibo 最新帖子里的明确重置卡发放公告或自动重置完成报告。新匹配会标注“自动识别”，等待人工核对。提问、模糊暗示和未来承诺不会进入这份历史。'],methodThree:["All clocks use the selected timezone. The exact timestamp comes from the public post, not from an account-level delivery feed. Missing or deleted posts and third-party mirror delays can make this selected archive incomplete.",'所有时钟都使用你选择的时区。精确时间来自公开帖子，不是账号到账数据。缺失或删除的帖子，以及第三方镜像延迟，都可能使这份精选档案不完整。'],modelLink:['Read the classification rules ↗','查看分类规则 ↗'],footer:['Built while waiting for the button.','等按钮的时候，把记录整理好了。'],backFooter:['Back to the forecast ↗','返回概率预测 ↗']
};
const say=(en,zh)=>lang==='zh'?zh:en;
function localized(value){return value?.[lang]||value?.en||'';}
function dateFormat(at,options){return new Intl.DateTimeFormat(lang==='zh'?'zh-CN':'en-US',{timeZone:$('timezone').value,...options}).format(new Date(at));}
function dateLabel(at){return dateFormat(at,{year:'numeric',month:'short',day:'numeric'});}
function clockLabel(at){return dateFormat(at,{hour:'2-digit',minute:'2-digit',second:'2-digit',timeZoneName:'short'});}
function timeLabel(at){return dateFormat(at,{hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'});}
function zoneLabel(at){return dateFormat(at,{timeZoneName:'short'}).split(' ').at(-1);}
function basisLabel(event){return event.basis==='completion'?say('Public completion report','公开完成报告'):say('Public announcement','公开发帖预告');}
function stateLabel(event){
  if(event.state==='unreviewed')return say('AUTO-DETECTED · CHECK SOURCE','自动识别 · 请核对原帖');
  if(event.state==='rolling')return say('ROLLOUT ANNOUNCED','已宣布发放');
  if(event.state==='targeted')return say('TARGETED REMEDY','定向补发');
  if(event.state==='documented')return say('OFFICIAL DATE CONFIRMED','官方日期已确认');
  return event.type==='banked'?say('LANDED · REPORTED','据报告已到账'):say('COMPLETE · REPORTED','据报告已完成');
}
function renderTimeline(){
  const list=$('timeline');list.replaceChildren();
  const visible=events.filter(event=>filter==='all'||event.type===filter);
  if(!newestFirst)visible.reverse();
  if(!visible.length){list.append(make('li','timeline-empty',say('No matching reset moments yet.','目前没有符合筛选条件的节点。')));return;}
  visible.forEach((event,index)=>{
    const item=make('li',`timeline-item ${event.type}`);
    const rail=make('div','timeline-rail');rail.append(make('span','timeline-index',String(index+1).padStart(2,'0')));
    const railDate=make('time','timeline-day',dateLabel(event.at));railDate.dateTime=event.at;rail.append(railDate);
    const card=make('article','timeline-card');const badges=make('div','timeline-badges');
    badges.append(make('span','timeline-tag',event.type==='banked'?say('▣ BANKED RESET','▣ 重置卡'):say('↻ AUTOMATIC RESET','↻ 自动重置')));
    if(event.state==='unreviewed'){badges.append(make('span','review-tag',stateLabel(event)));}else{badges.append(make('span','state-tag',stateLabel(event)));}
    card.append(badges,make('h3','',localized(event.title)),make('p','',localized(event.summary)));
    const scope=make('p','scope');scope.append(make('span','',say('WHO /','对象 /')),make('strong','',localized(event.scope)));card.append(scope);
    const time=make('div','time-box');const timestamp=make('time','');timestamp.dateTime=event.at;timestamp.append(make('strong','',timeLabel(event.at)));time.append(timestamp,make('span','',`${zoneLabel(event.at)} · ${basisLabel(event)}`));card.append(time);
    const sources=make('div','timeline-sources');for(const source of event.sources){const url=sourceUrl(source);if(!url)continue;const link=make('a','',localized(source.label)+' ↗');link.href=url;link.target='_blank';link.rel='noopener noreferrer';sources.append(link);}card.append(sources);item.append(rail,card);list.append(item);
  });
}
function renderStatus(){
  const dot=make('span','status-dot '+(sourceState==='available'?'connected':'partial'));
  const message=sourceState==='available'
    ?say(`LIVE · latest posts checked ${clockLabel(lastCheck)} · auto-sync ~10s`,`实时 · ${clockLabel(lastCheck)} 已检查新帖 · 约 10 秒同步`)
    :sourceState==='checking'?say('Checking Tibo’s latest posts…','正在检查 Tibo 的最新帖子…')
    :say('Latest post check unavailable · reviewed archive still shown','最新帖子暂时无法检查 · 已核对的档案仍可查看');
  $('connection').replaceChildren(dot,make('span','',message));
}
function render(){
  const counts=historyStats(events);
  $('stamp-total').textContent=String(counts.total).padStart(2,'0');$('total').textContent=String(counts.total).padStart(2,'0');
  $('banked-total').textContent=String(counts.banked).padStart(2,'0');$('automatic-total').textContent=String(counts.automatic).padStart(2,'0');
  $('order').textContent=newestFirst?localized({en:words.newest[0],zh:words.newest[1]}):localized({en:words.oldest[0],zh:words.oldest[1]});
  renderTimeline();renderStatus();
}
function setLanguage(){
  document.documentElement.lang=lang==='zh'?'zh-CN':'en';document.body.lang=lang;
  $('language').textContent=lang==='zh'?'EN':'中文';$('language').setAttribute('aria-label',lang==='zh'?'Switch to English':'切换中文');
  document.title=lang==='zh'?'重置档案 — When to Reset':'Reset Archive — When to Reset';
  document.querySelectorAll('[data-copy]').forEach(el=>{const pair=words[el.dataset.copy];if(pair)el.innerHTML=pair[lang==='zh'?1:0];});
  $('refresh').title=say('Refresh new posts','刷新最新帖子');$('refresh').setAttribute('aria-label',$('refresh').title);
  document.querySelector('.filters').setAttribute('aria-label',say('Event type filter','事件类型筛选'));
  render();
}
async function refresh(){
  if(refreshing)return;refreshing=true;$('refresh').disabled=true;$('refresh').classList.add('busy');
  try{
    const response=await fetch('/api/reset-radar',{cache:'no-store',signal:AbortSignal.timeout(25000)});
    if(!response.ok)throw new Error('source unavailable');
    const data=await response.json();if(!Array.isArray(data.signals)||!data.sources?.x)throw new Error('invalid source');
    events=mergeHistory(HISTORY_EVENTS,data.signals);
    sourceState=data.sources.x.state==='available'?'available':'unavailable';lastCheck=data.checkedAt||new Date().toISOString();
    render();
  }catch{sourceState='unavailable';renderStatus();}
  finally{refreshing=false;$('refresh').disabled=false;$('refresh').classList.remove('busy');}
}

$('language').addEventListener('click',()=>{lang=lang==='en'?'zh':'en';try{localStorage.setItem('chefzc.language',lang);}catch{}setLanguage();});
$('timezone').addEventListener('change',render);$('refresh').addEventListener('click',refresh);
$('order').addEventListener('click',()=>{newestFirst=!newestFirst;render();});
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{filter=button.dataset.filter;document.querySelectorAll('[data-filter]').forEach(other=>other.setAttribute('aria-pressed',String(other===button)));renderTimeline();}));
document.querySelector('.archive-room .room-footer span:first-child').title=say(`Reviewed ${ARCHIVE_REVIEWED_AT}`,`核对日期 ${ARCHIVE_REVIEWED_AT}`);
setLanguage();refresh();setInterval(()=>{if(!document.hidden)refresh();},10000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)refresh();});window.addEventListener('online',refresh);
