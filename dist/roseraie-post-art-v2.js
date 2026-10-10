import {roseFiligree} from './roseraie-atelier.js';
const asset = './assets/projects/roseraie/';

// Posts cover and article hero, series plate (flow-windows-b.css): the porcelain arch and its bouquet,
// the wordmark, one line, one data line. The 0.2.0 interface itself is shown in the article's figures.
export function roseraiePostArt() {
  return `<div class="post-art wb wb--wide wb--roseraie" aria-hidden="true"><div class="wb-motif"><div class="rose-petal-host" data-rose-petal-host data-petals="14"></div><div class="wb-arch"><img src="${asset}violet-botanical.webp" width="768" height="768" alt="" loading="lazy" decoding="async"></div></div><div class="wb-type"><strong class="wb-mark">Roseraie<i>.</i></strong><span class="wb-line">蔷薇工坊 / The violet atelier</span></div><div class="wb-data"><span>Le salon des possibles</span><span>0.2.0<em class="wb-more"> / 2026</em></span></div></div>`;
}
