import { festivalJourneyArt } from './festival-journey.js';
import { t, getLanguage } from './i18n.js';
import { currentFestival, festivalReleases, festivalReleaseUrl } from './festival-releases.js';

const seasons = ['summer','autumn','winter','spring'];
const marks = [
  '<circle cx="24" cy="24" r="9"/><path d="M24 3v6m0 30v6M3 24h6m30 0h6M9 9l4 4m22 22 4 4M9 39l4-4m22-22 4-4"/>',
  '<path d="M10 38C-1 12 26 19 38 6c7 27-7 37-25 29M8 42l22-22"/>',
  '<path d="M24 3v42M6 13l36 22M6 35l36-22M18 7l6 6 6-6M18 41l6-6 6 6M7 20l8-1-2-8M41 28l-8 1 2 8M7 28l8 1-2 8M41 20l-8-1 2-8"/>',
  '<circle cx="24" cy="22" r="4"/><path d="M24 18c-15-20 15-20 0 0m4 4c20-15 20 15 0 0m-4 4c15 20-15 20 0 0m-4-4c-20 15-20-15 0 0M24 35v10m0-3c-13 0-14-9-14-9 8 0 14 3 14 9"/>'
];
export const festivalIcon = index => `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${marks[index]}</svg>`;
export function festivalTicket(garage = false) {
  return `<div class="festival-ticket" aria-hidden="true"><div class="festival-ticket-top"><span>H / 06</span><span>FESTIVAL PASS</span></div><div class="festival-ticket-title">FOUR<br>SEASONS<span>↗</span></div><div class="festival-ticket-seasons">${seasons.map((s,i)=>`<span class="festival-stamp stamp-${s}">${festivalIcon(i)}<small>0${i+1}</small></span>`).join('')}</div><div class="festival-ticket-stub"><span>${garage ? "THE NEXT CAR.<br>THE NEXT CHAPTER." : "YOUR FESTIVAL.<br>YOUR WAY."}</span><i class="festival-barcode"></i><b>${garage ? "647" : "020"}</b></div></div>`;
}
export function festivalArtwork() {
  return `<div class="festival-stage festival-journey-stage" aria-hidden="true"><div class="festival-orbit"></div><span class="festival-pink-label">THE JOURNEY<br>EDITION / 03</span>${festivalJourneyArt()}<div class="festival-weather"><span class="festival-season-icon">${festivalIcon(0)}</span><div><small>SEASON / <span class="festival-season-index">01</span></small><b class="festival-season-name">SUMMER</b></div><span>↗</span></div><div class="festival-track"><svg viewBox="0 0 440 70"><path d="M0 48H48C92 48 98 18 150 18H235C285 18 278 54 330 54H440"/></svg><span>KEEP A LITTLE OF THE JOURNEY.</span></div></div>`;
}
const stats = () => `<dl class="festival-stats"><div><dt>647</dt><dd>${t('festival.cars')}</dd></div><div><dt>2,833</dt><dd>${t('festival.journalCount')}</dd></div><div><dt>7</dt><dd>${t('festival.wristbandCount')}</dd></div></dl>`;
const actions = p => `<footer class="festival-actions"><span>${t('festival.platform')}</span><div><a href="${p.repoUrl}" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a class="festival-download" href="${p.downloadUrl}" target="_blank" rel="noopener noreferrer">${t('festival.download')} <span>↓</span></a></div></footer>`;
export function festivalCard(project) {
  return `<article class="exhibit exhibit--festival" id="project-festival-toolkit" data-season="summer"><header class="festival-masthead"><span><b>⚑</b> THE FESTIVAL COLLECTION</span><span>NO. 04 <i>/</i> V${currentFestival.version}</span></header><button class="festival-open" data-project="festival-toolkit" aria-label="${t('project.viewAria',{name:'Festival Toolkit'})}"><div class="festival-intro"><span class="festival-overline">YOUR FESTIVAL. YOUR WAY.</span><h3>FESTIVAL<br><span>TOOLKIT</span><i>6</i></h3><p class="festival-product-name">${t('festival.name')}</p><h4>${t('festival.headline')}</h4><p class="festival-description">${t('festival.description')}</p><span class="festival-inspect">${t('festival.explore')} <b>↗</b></span></div>${festivalArtwork()}</button><div class="festival-palette"><div><span>${t('festival.palette')}</span><small>${t('festival.paletteNote')}</small></div><div class="festival-season-controls" role="group" aria-label="${t('festival.paletteLabel')}">${seasons.map((s,i)=>`<button type="button" data-festival-season="${s}" aria-pressed="${i===0}">${festivalIcon(i)}<span>${t('festival.'+s)}</span></button>`).join('')}</div></div>${stats()}${festivalHistory("festival-history")}${actions(project)}</article>`;
}
export function festivalHistory(id) {
  return `<details class="festival-history" id="${id}"><summary><span class="festival-history-stamp" aria-hidden="true">${String(festivalReleases.length).padStart(2,"0")}<small>ISSUES</small></span><span class="festival-history-heading"><small>THE FESTIVAL ARCHIVE</small><strong>${t('festival.history')}</strong><span>${t('festival.historyHint')}</span></span><span class="festival-history-route" aria-hidden="true">0.1.1 <i>→</i> ${currentFestival.version}</span><span class="festival-history-plus" aria-hidden="true">＋</span></summary><div class="festival-history-pages">${festivalReleases.map((release,index)=>{
    const copy=release[getLanguage()];
    return `<article class="festival-chapter ${index===0?'festival-chapter--current':''}"><div class="festival-chapter-rail"><span>PASS / ${release.edition}</span><b>${release.version}</b><time datetime="${release.date}">${release.date.replaceAll('-','.')}</time><span class="festival-release-status">${t(index===0?'festival.current':'festival.previous')}</span><i class="festival-barcode" aria-hidden="true"></i></div><div class="festival-chapter-copy"><h4>${copy.name}</h4><p>${copy.intro}</p><ul>${copy.changes.map(([label,body])=>`<li><b>${label}</b><span>${body}</span></li>`).join('')}</ul><p class="festival-chapter-note">${copy.note}</p><a href="${festivalReleaseUrl(release.version)}" target="_blank" rel="noopener noreferrer">${t('festival.releaseLink')} ${release.version} ↗</a></div></article>`;
  }).join('')}<p class="festival-archive-foot"><span>YOUR FESTIVAL. STILL GROWING.</span><span>${t('festival.archiveFoot')}</span></p></div></details>`;
}
const captures = { journey: 'journey-v0.3.png', wristbands: 'wristbands-v0.3.png', playlist: 'workspace-v0.3.png', garage: 'garage-v0.3.png' };
export function changeFestivalView(root, view) {
  if(!Object.hasOwn(captures,view)) return;
  const figure=root.querySelector('.festival-capture');
  if(!figure) return;
  figure.querySelector('img').src=`./assets/projects/festival-toolkit/${captures[view]}`;
  figure.querySelector('img').alt=t('festival.capture')+' · '+t('festival.'+view);
  root.querySelectorAll('[data-festival-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.festivalView===view)));
}
export function festivalDetail(project, view = 'journey') {
  return `<header class="festival-detail-head"><span class="festival-overline">CHEFZC / PROJECT 04 / VERSION ${currentFestival.version}</span><h2 id="dialog-title">FESTIVAL <span>TOOLKIT</span><i>6</i></h2><p>${t('festival.headline')}</p></header><div class="festival-view-controls" role="group" aria-label="${t('festival.views')}">${Object.keys(captures).map(key=>`<button type="button" data-festival-view="${key}" aria-pressed="${view===key}">${t('festival.'+key)} <span>↗</span></button>`).join('')}</div><figure class="festival-capture"><div><span>THE ACTUAL WORKSPACE</span><span>WINDOWS / ${currentFestival.version}</span></div><img src="./assets/projects/festival-toolkit/${captures[view]}" width="2139" height="1356" alt="${t('festival.capture')} · ${t('festival.'+view)}"><figcaption>${t('festival.capture')}</figcaption></figure>${stats()}<div class="festival-detail-copy"><section><span class="festival-overline">01 / THE JOURNEY</span><h3>${t('festival.journeyTitle')}</h3><p>${t('festival.journeyText')}</p></section><section><span class="festival-overline">02 / KEEP GROWING</span><h3>${t('festival.detailTitle')}</h3><p>${t('festival.detailText')}</p></section><section><span class="festival-overline">03 / THE WAY BACK</span><h3>${t('festival.restoreTitle')}</h3><p>${t('festival.restoreText')}</p></section><p class="festival-boundary">${t('festival.boundary')}</p></div>${festivalHistory('festival-detail-history')}${actions(project)}`;
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
