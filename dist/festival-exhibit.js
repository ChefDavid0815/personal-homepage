import { t, getLanguage } from './i18n.js';

const seasons = ['summer','autumn','winter','spring'];
const marks = [
  '<circle cx="24" cy="24" r="9"/><path d="M24 3v6m0 30v6M3 24h6m30 0h6M9 9l4 4m22 22 4 4M9 39l4-4m22-22 4-4"/>',
  '<path d="M10 38C-1 12 26 19 38 6c7 27-7 37-25 29M8 42l22-22"/>',
  '<path d="M24 3v42M6 13l36 22M6 35l36-22M18 7l6 6 6-6M18 41l6-6 6 6M7 20l8-1-2-8M41 28l-8 1 2 8M7 28l8 1-2 8M41 20l-8-1 2-8"/>',
  '<circle cx="24" cy="22" r="4"/><path d="M24 18c-15-20 15-20 0 0m4 4c20-15 20 15 0 0m-4 4c15 20-15 20 0 0m-4-4c-20 15-20-15 0 0M24 35v10m0-3c-13 0-14-9-14-9 8 0 14 3 14 9"/>'
];
export const festivalIcon = index => `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${marks[index]}</svg>`;
export function festivalTicket() {
  return `<div class="festival-ticket" aria-hidden="true"><div class="festival-ticket-top"><span>H / 06</span><span>FESTIVAL PASS</span></div><div class="festival-ticket-title">FOUR<br>SEASONS<span>↗</span></div><div class="festival-ticket-seasons">${seasons.map((s,i)=>`<span class="festival-stamp stamp-${s}">${festivalIcon(i)}<small>0${i+1}</small></span>`).join('')}</div><div class="festival-ticket-stub"><span>YOUR FESTIVAL.<br>YOUR WAY.</span><i class="festival-barcode"></i><b>020</b></div></div>`;
}
export function festivalArtwork() {
  return `<div class="festival-stage" aria-hidden="true"><div class="festival-orbit"></div><span class="festival-pink-label">A NEW SEASON<br>OF MAKING.</span><div class="festival-ticket-wrap">${festivalTicket()}</div><div class="festival-weather"><span class="festival-season-icon">${festivalIcon(0)}</span><div><small>SEASON / <span class="festival-season-index">01</span></small><b class="festival-season-name">SUMMER</b></div><span>↗</span></div><div class="festival-track"><svg viewBox="0 0 440 70"><path d="M0 48H48C92 48 98 18 150 18H235C285 18 278 54 330 54H440"/></svg><span>START SOMETHING GOOD.</span></div></div>`;
}
const stats = () => `<dl class="festival-stats"><div><dt>05</dt><dd>${t('festival.series')}</dd></div><div><dt>20</dt><dd>${t('festival.weeks')}</dd></div><div><dt>↶</dt><dd>${t('festival.recovery')}</dd></div></dl>`;
const actions = p => `<footer class="festival-actions"><span>${t('festival.platform')}</span><div><a href="${p.repoUrl}" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a class="festival-download" href="${p.downloadUrl}" target="_blank" rel="noopener noreferrer">${t('festival.download')} <span>↓</span></a></div></footer>`;
export function festivalCard(project) {
  return `<article class="exhibit exhibit--festival" id="project-festival-toolkit" data-season="summer"><header class="festival-masthead"><span><b>⚑</b> THE FESTIVAL COLLECTION</span><span>NO. 04 <i>/</i> V0.1.1</span></header><button class="festival-open" data-project="festival-toolkit" aria-label="${t('project.viewAria',{name:'Festival Toolkit'})}"><div class="festival-intro"><span class="festival-overline">YOUR FESTIVAL. YOUR WAY.</span><h3>FESTIVAL<br><span>TOOLKIT</span><i>6</i></h3><p class="festival-product-name">${t('festival.name')}</p><h4>${t('festival.headline')}</h4><p class="festival-description">${t('festival.description')}</p><span class="festival-inspect">${t('festival.explore')} <b>↗</b></span></div>${festivalArtwork()}</button><div class="festival-palette"><div><span>${t('festival.palette')}</span><small>${t('festival.paletteNote')}</small></div><div class="festival-season-controls" role="group" aria-label="${t('festival.paletteLabel')}">${seasons.map((s,i)=>`<button type="button" data-festival-season="${s}" aria-pressed="${i===0}">${festivalIcon(i)}<span>${t('festival.'+s)}</span></button>`).join('')}</div></div>${stats()}${actions(project)}</article>`;
}
export function festivalDetail(project) {
  const capture=getLanguage()==='en'?'workspace-en.png':'workspace.png';
  return `<header class="festival-detail-head"><span class="festival-overline">CHEFZC / PROJECT 04 / VERSION 0.1.1</span><h2 id="dialog-title">FESTIVAL <span>TOOLKIT</span><i>6</i></h2><p>${t('festival.headline')}</p></header><figure class="festival-capture"><div><span>THE ACTUAL WORKSPACE</span><span>WINDOWS / 0.1.1</span></div><img src="./assets/projects/festival-toolkit/${capture}" width="2139" height="1356" alt="${t('festival.capture')}"><figcaption>${t('festival.capture')}</figcaption></figure>${stats()}<div class="festival-detail-copy"><section><span class="festival-overline">01 / THE PLAYLIST</span><h3>${t('festival.detailTitle')}</h3><p>${t('festival.detailText')}</p></section><section><span class="festival-overline">02 / THE WAY BACK</span><h3>${t('festival.restoreTitle')}</h3><p>${t('festival.restoreText')}</p></section><p class="festival-boundary">${t('festival.boundary')}</p></div>${actions(project)}`;
}
export function changeFestivalSeason(root, season) {
  const index=seasons.indexOf(season);
  if(index<0) return;
  const card=root.querySelector('#project-festival-toolkit');
  if(!card) return;
  card.dataset.season=season;
  card.querySelectorAll('[data-festival-season]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.festivalSeason===season)));
  card.querySelector('.festival-season-name').textContent=season.toUpperCase();
  card.querySelector('.festival-season-index').textContent=String(index+1).padStart(2,'0');
  card.querySelector('.festival-season-icon').innerHTML=festivalIcon(index);
}
