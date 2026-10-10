// Gallery room layer: the few bilingual strings the redesigned rooms add (the AfterImage contact sheet).
// Facts come from assets/afterimage/SOURCES.md; nothing here is new information, only captions for it.
import {getLanguage,onLanguageChange} from './i18n.js';

const strings={
  sheet:['AfterImage 档案中的四帧赛道摄影','Four frames from the AfterImage archive'],
  silverstone:['银石 / George Russell 的火花','Silverstone / George Russell, sparks'],
  silverstoneCredit:['Jason Puddephatt / CC BY-SA 4.0','Jason Puddephatt / CC BY-SA 4.0'],
  norris:['铃鹿 Spoon 弯 / Lando Norris','Suzuka, Spoon Curve / Lando Norris'],
  norrisCredit:['Martin Lee / CC BY-SA 4.0','Martin Lee / CC BY-SA 4.0'],
  piastri:['铃鹿 Nissin 发夹弯 / Oscar Piastri','Suzuka, Nissin Brake Hairpin / Oscar Piastri'],
  piastriCredit:['Martin Lee / CC BY-SA 4.0','Martin Lee / CC BY-SA 4.0'],
  monaco:['摩纳哥大奖赛 2026','2026 Monaco Grand Prix'],
  monacoCredit:['Formula 1 media','Formula 1 media']
};
const alts={
  silverstone:['银石赛道上，梅赛德斯赛车擦出火花','A Mercedes car throwing sparks at Silverstone'],
  norris:['Lando Norris 驾驶迈凯伦 MCL40 驶近铃鹿 Spoon 弯','Lando Norris in the McLaren MCL40 approaching Spoon Curve at Suzuka'],
  piastri:['Oscar Piastri 驾驶迈凯伦 MCL40 进入铃鹿 Nissin 发夹弯','Oscar Piastri in the McLaren MCL40 entering the Nissin Brake Hairpin at Suzuka'],
  monaco:['2026 摩纳哥大奖赛赛道影像','Trackside image from the 2026 Monaco Grand Prix']
};
const pick=pair=>pair[getLanguage()==='en'?1:0];

export function renderRoomStrings(root=document){
  root.querySelectorAll('[data-gx]').forEach(node=>{const pair=strings[node.dataset.gx];if(pair)node.textContent=pick(pair);});
  root.querySelectorAll('[data-gx-alt]').forEach(node=>{const pair=alts[node.dataset.gxAlt];if(pair)node.setAttribute('alt',pick(pair));});
  root.querySelectorAll('[data-gx-label]').forEach(node=>{const pair=strings[node.dataset.gxLabel];if(pair)node.setAttribute('aria-label',pick(pair));});
}
renderRoomStrings();
onLanguageChange(()=>renderRoomStrings());

// The hall runs under the sticky header; it needs the header's real height (one row on desktop, two on phones).
const header=document.querySelector('.site-header');
const syncHead=()=>{if(header)document.body.style.setProperty('--gx-head',`${Math.round(header.offsetHeight)}px`);};
syncHead();
if(header&&'ResizeObserver' in window)new ResizeObserver(syncHead).observe(header);
