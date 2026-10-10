import {getLanguage} from './i18n.js';
import {nabatAsset} from './nabat-content.js';
export const n = (zh,en) => getLanguage()==='en' ? en : zh;
export const nabatMark = '<svg class="nabat-mark" viewBox="0 0 48 56" aria-hidden="true"><path d="M23 4C4 16 2 38 23 49c21-11 19-33 0-45Z M23 5v44 M8 20l15 17 15-17 M12 11l11 15 11-15 M39 28q8-9 0-18 M43 33q13-13 0-27" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
export function nabatCircuit(){
  return '<svg class="nabat-circuit" viewBox="0 0 640 640" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-linecap="round"><path class="nabat-circuit-outline" d="M308 30C58 193 44 422 308 600 572 422 558 193 308 30Z"/><path class="nabat-circuit-veins" d="M308 35V591M101 225L308 443 515 225M157 126L308 331 459 126M220 495L308 551 396 495"/><path class="nabat-circuit-radio" d="M523 306Q603 223 523 132M566 370Q680 233 566 63"/><path class="nabat-circuit-current" d="M308 591V331L157 126M308 443L515 225" pathLength="1"/></g></svg>';
}
// Window series A (flow-windows-a.css): plant paper, the leaf circuit, the wordmark.
const nabatWindow=(data,line)=>`<div class="wa-motif">${nabatCircuit()}</div><div class="wa-type"><p class="wa-data"><span>${data[0]}</span><span>${data[1]}</span></p><div class="wa-head"><strong class="wa-title">NABAT<b>.</b></strong><span class="wa-line">${line}</span></div></div>`;
export function nabatPostArt(){
  return `<div class="wa wa--nabat" data-nabat-ambient aria-hidden="true">${nabatWindow(['INJAZ / A living record','1.1 / Operations'],'Every plant has a history.')}</div>`;
}
export function nabatNowArt(){
  return `<a class="milestone-art nabat-now-art wa-win" data-nabat-ambient href="./school-gallery.html#project-nabat" aria-label="${n('打开 NABAT：我的 INJAZ 商赛作品展柜','Open NABAT: my INJAZ business competition exhibit')}"><div class="wa wa--nabat" aria-hidden="true">${nabatWindow(['INJAZ / A living record','<span lang="ar" dir="rtl">نبات</span>'],'Every plant, known.')}</div></a>`;
}
