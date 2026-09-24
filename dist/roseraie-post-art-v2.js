const asset = './assets/projects/roseraie/';

export function roseraiePostArt() {
  const petals = Array.from({ length: 13 }, (_, index) =>
    `<i style="--left:${(index * 31 + 9) % 96}%;--drift:${(index - 6) * 14}px;--delay:-${(index * 1.37).toFixed(2)}s;--duration:${12 + index % 5 * 2}s"></i>`
  ).join('');

  return `<div class="post-art post-art--roseraie rose-post-v2" aria-hidden="true">
    <div class="rose-post-v2-orbit"></div>
    <div class="rose-petals">${petals}</div>
    <div class="rose-post-v2-top"><span>ROSERAIE / THE VIOLET ATELIER</span><span>2026</span></div>
    <div class="rose-post-v2-wordmark"><img src="${asset}mark-0.2.0.svg" width="92" height="92" alt=""><strong>Roseraie<i>.</i></strong><span>蔷薇工坊</span></div>
    <img class="rose-post-v2-botanical" src="${asset}violet-botanical.webp" width="768" height="768" alt="" loading="lazy" decoding="async">
    <div class="rose-post-v2-capture"><img src="${asset}home-0.2.0.png" width="2304" height="1517" alt="" loading="lazy" decoding="async"></div>
    <div class="rose-post-v2-bottom"><span>LE SALON DES POSSIBLES</span><span>VIOLET PORCELAIN / SILVER FILIGREE</span></div>
  </div>`;
}
