import {getLanguage} from './i18n.js';
import {nabatAsset} from './nabat-content.js';
export const n = (zh,en) => getLanguage()==='en' ? en : zh;
export const nabatMark = '<svg class="nabat-mark" viewBox="0 0 48 56" aria-hidden="true"><path d="M23 4C4 16 2 38 23 49c21-11 19-33 0-45Z M23 5v44 M8 20l15 17 15-17 M12 11l11 15 11-15 M39 28q8-9 0-18 M43 33q13-13 0-27" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';
export function nabatCircuit(){
  return '<svg class="nabat-circuit" viewBox="0 0 640 640" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-linecap="round"><path class="nabat-circuit-outline" d="M308 30C58 193 44 422 308 600 572 422 558 193 308 30Z"/><path class="nabat-circuit-veins" d="M308 35V591M101 225L308 443 515 225M157 126L308 331 459 126M220 495L308 551 396 495"/><path class="nabat-circuit-radio" d="M523 306Q603 223 523 132M566 370Q680 233 566 63"/><path class="nabat-circuit-current" d="M308 591V331L157 126M308 443L515 225" pathLength="1"/></g></svg>';
}
export function nabatPostArt(){
  return `<div class="post-art nabat-art" data-nabat-ambient aria-hidden="true"><div class="nabat-art-specimen"><img src="${nabatAsset}monstera.webp" width="1536" height="1024" alt="" loading="lazy"></div><div class="nabat-art-lines">${nabatCircuit()}</div><div class="nabat-art-top"><span>CHEFZC / INJAZ</span><span>1.1 / OPERATIONS</span></div><div class="nabat-art-brand">${nabatMark}<strong>NABAT<span>.</span></strong><span lang="ar" dir="rtl">نبات</span></div><p class="nabat-art-words">Every plant<br>has a history.</p><div class="nabat-art-foot"><span>A LIVING RECORD</span><span>09 OCT / 2026</span></div></div>`;
}
export function nabatNowArt(){
  return `<a class="milestone-art nabat-now-art" data-nabat-ambient href="./school-gallery.html#project-nabat" aria-label="${n('打开 NABAT：我的 INJAZ 商赛作品展柜','Open NABAT: my INJAZ business competition exhibit')}"><img src="${nabatAsset}monstera.webp" width="1536" height="1024" alt="" loading="lazy"><div class="nabat-now-label">${nabatMark}<strong>NABAT.</strong><span>INJAZ / A LIVING RECORD</span></div><div class="nabat-now-circuit">${nabatCircuit()}</div><span class="nabat-now-foot">Every plant, known. <b>↗</b></span></a>`;
}
