import {getLanguage} from './i18n.js';
import {aerAsset,aerCarriers} from './aer-content.js';
export const ac=(zh,en)=>getLanguage()==='en'?en:zh;
export const aerBrand=`<svg viewBox="0 0 34 32" fill="none" aria-hidden="true"><path d="M4 26L15 5Q17 1 19 5L30 26M9 19Q17 14 25 19" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/><path d="M11 28Q17 24 23 28" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>`;
export function aerTail(code='EK',main=false){
  const c=aerCarriers[code]||aerCarriers.EK;
  return `<span class="aer-tail${main?' aer-tail--main':''}" style="--tail-source:url('${aerAsset+c.image}')"><i class="aer-tail-depth"></i><img ${main?'data-tail-image':''} src="${aerAsset+c.image}" width="430" height="360" alt="" loading="lazy"><i class="aer-tail-light"></i><i class="aer-tail-edge"></i></span>`;
}
const orbits=`<svg class="aer-orbits" viewBox="0 0 600 500" fill="none" aria-hidden="true"><ellipse cx="300" cy="270" rx="247" ry="101" transform="rotate(-22 300 270)"/><ellipse cx="300" cy="270" rx="219" ry="113" transform="rotate(19 300 270)"/><path d="M64 358Q143 78 501 171"/><path class="aer-orbit-trace" d="M64 358Q143 78 501 171"/><circle cx="64" cy="358" r="4"/><circle cx="501" cy="171" r="4"/><circle class="aer-orbit-bead" cx="187" cy="170" r="3"/></svg>`;
export function aerScene({kind='hero',carrier='EK'}={}){
  const others=Object.keys(aerCarriers).filter(code=>code!==carrier);
  return `<div class="aer-scene aer-scene--${kind}" data-aer-scene data-aer-active="false" aria-hidden="true"><div class="aer-sky-light"></div><div class="aer-sky-ribbon"></div><canvas class="aer-optics" data-aer-optics></canvas><div class="aer-optical-fallback"><i></i><i></i></div>${orbits}<div class="aer-specular-sheet aer-specular-sheet--back"></div><div class="aer-fin-assembly"><div class="aer-fin-floating aer-main-fin">${aerTail(carrier,true)}</div></div><div class="aer-satellite aer-satellite--left">${aerTail(others[0])}</div><div class="aer-satellite aer-satellite--right">${aerTail(others[1])}</div><div class="aer-glass-plinth"></div><div class="aer-specular-sheet aer-specular-sheet--front"></div><div class="aer-scene-coordinate"><span>25°15′ N</span><i></i><span>ABOVE THE EVERYDAY</span></div><span class="aer-scene-annotation">${ac('光，经过一片玻璃。','LIGHT, THROUGH A CLEARER SKY.')}</span><span class="aer-scene-edition">AER / OPTICAL STUDY</span></div>`;
}
export function aerPostArt(){
  return `<div class="post-art post-art--aer" aria-hidden="true">${aerScene({kind:'cover'})}<div class="aer-cover-top"><span>CHEFZC / DEPARTURE NOTES</span><span>01</span></div><div class="aer-cover-word">aer<span>®</span><small>${ac('让下一程，更像你。','A LITTLE CLOSER.')}</small></div><div class="aer-cover-foot"><span>FLIGHT, THOUGHTFULLY</span><span>V 1.0 / 2026</span></div></div>`;
}
export function aerNowArt(){
  return `<span class="aer-now-top">THE DEPARTURE COLLECTION <span>01</span></span>${aerScene({kind:'mini'})}<strong class="aer-now-word">aer<span>®</span></strong><div class="aer-now-foot"><span>GLASS / SKY / JOURNEY</span><b>1.0</b></div>`;
}
