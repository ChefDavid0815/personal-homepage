// Game room hall: the save-select index and the room's own bilingual copy.
// Reads the published aggregates only; it never invents or increments a value.
import {getLanguage,onLanguageChange,t} from './i18n.js';
import {gameSnapshot} from './games-data.js';
import {f1Snapshot} from './games-f1-data.js';
import {initialAc8Record} from './ac8-initial-record.js';

const roomMessages={
  'room.worlds':['四个世界，','Four worlds.'],
  'room.player':['一个玩家。','One player.'],
  'room.edition':['ChefZC 个人版','ChefZC, personal edition'],
  'room.otherSide':['我的另一面。','The other side of me.']
};
const pick=key=>roomMessages[key][getLanguage()==='en'?1:0];
const locale=()=>getLanguage()==='en'?'en-GB':'zh-CN';
const duration=minutes=>Number.isFinite(minutes)?t('game.timeValue',{hours:Math.floor(minutes/60),minutes:minutes%60}):'—';
const day=iso=>iso?new Intl.DateTimeFormat(locale(),{timeZone:'Asia/Dubai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date(iso)):'—';
const slot=name=>document.querySelector(`[data-hall="${name}"]`);
function setTime(name,iso){const node=slot(name);if(!node)return;node.textContent=day(iso);if(iso)node.dateTime=iso;else node.removeAttribute('datetime');}
function setText(name,value){const node=slot(name);if(node)node.textContent=value;}

// AC8 has a live record: mirror whatever the flight log currently shows, so the hall never disagrees with it.
let ac8={total:duration(initialAc8Record.playtimeMinutes),last:initialAc8Record.lastPlayedAt};
function readAc8(){
  const log=document.querySelector('.ac8-flight-log');if(!log)return;
  const total=log.querySelector('[data-ac8-total]')?.textContent?.trim();
  const last=log.querySelector('[data-ac8-last]')?.getAttribute('datetime');
  if(total&&total!=='—')ac8.total=total;
  if(last)ac8.last=last;
}
function render(){
  document.querySelectorAll('[data-room-i18n]').forEach(node=>{node.textContent=pick(node.dataset.roomI18n);});
  readAc8();
  setText('ac8-total',ac8.total);setTime('ac8-last',ac8.last);
  setText('f1-total',duration(f1Snapshot.playtimeMinutes));setTime('f1-last',f1Snapshot.lastPlayedAt);
  const cars=gameSnapshot.fh6.garageCars;
  setText('fh-cars',Number.isFinite(cars)?new Intl.NumberFormat(locale()).format(cars):'—');setTime('fh-save',gameSnapshot.fh6.latestSaveAt);
  setText('nba-total',duration(gameSnapshot.nba2k27.playtimeMinutes));setTime('nba-save',gameSnapshot.nba2k27.latestSaveAt);
}
function watchAc8(){
  let observed=null;
  const attach=()=>{
    const log=document.querySelector('.ac8-flight-log');if(!log||log===observed)return;observed=log;
    new MutationObserver(()=>{readAc8();setText('ac8-total',ac8.total);setTime('ac8-last',ac8.last);}).observe(log,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['datetime']});
    render();
  };
  attach();
  if(!observed){const root=document.querySelector('#ac8-exhibit-root');if(root){const mo=new MutationObserver(()=>{attach();if(observed)mo.disconnect();});mo.observe(root,{childList:true,subtree:true});}}
}
onLanguageChange(render);
render();
watchAc8();
