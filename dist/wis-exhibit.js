import { getLanguage } from './i18n.js';
export const wisLinks = { app: './stride/', source: 'https://github.com/ChefDavid0815/wis-tech-tank' };
export const wisAsset = './assets/projects/wis-tech-tank/';
export const wisCopy = (zh, en) => getLanguage() === 'en' ? en : zh;
export const wisMark = '<svg viewBox="0 0 40 40" aria-hidden="true"><g fill="currentColor" transform="rotate(-20 20 20)"><rect x="7" y="22" width="5" height="12" rx="2.5"/><rect x="18" y="13" width="5" height="21" rx="2.5"/><rect x="29" y="5" width="5" height="29" rx="2.5"/></g></svg>';
export function wisAtmosphere() { return '<div class="wis-atmosphere" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>'; }
// Post cover / hero, series plate (flow-windows-b.css): the woodland path beside a forest-green ground,
// the STRIDE wordmark, one line, one data line.
export function wisPostArt() {
  return `<div class="post-art wb wb--wide wb--wis" aria-hidden="true"><div class="wb-motif wb-motif--bleed"><img src="${wisAsset}woodland.webp" width="1536" height="1024" alt="" loading="lazy" decoding="async"></div><div class="wb-type"><strong class="wb-mark">stride<i>.</i></strong><span class="wb-line">A little awareness. A better next step.</span></div><div class="wb-data"><span>WIS Tech Tank<em class="wb-more"> / field notes</em> / 006<em class="wb-more"> / a study in perception</em></span><span>0.2.0</span></div></div>`;
}
