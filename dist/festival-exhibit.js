import './festival-weather.js';
import { festivalJourneyArt } from './festival-journey.js';
import { t, getLanguage } from './i18n.js';
import { currentFestival, festivalReleases, festivalReleaseUrl } from './festival-releases.js';
import { esc, icon, plusIcon, specList, tagLine, roomTitle, linkButton, insideButton, label } from './exhibit-frame.js';

const seasons = ['summer','autumn','winter','spring'];
const marks = [
  '<circle cx="24" cy="24" r="9"/><path d="M24 3v6m0 30v6M3 24h6m30 0h6M9 9l4 4m22 22 4 4M9 39l4-4m22-22 4-4"/>',
  '<path d="M10 38C-1 12 26 19 38 6c7 27-7 37-25 29M8 42l22-22"/>',
  '<path d="M24 3v42M6 13l36 22M6 35l36-22M18 7l6 6 6-6M18 41l6-6 6 6M7 20l8-1-2-8M41 28l-8 1 2 8M7 28l8 1-2 8M41 20l-8-1 2-8"/>',
  '<circle cx="24" cy="22" r="4"/><path d="M24 18c-15-20 15-20 0 0m4 4c20-15 20 15 0 0m-4 4c15 20-15 20 0 0m-4-4c-20 15-20-15 0 0M24 35v10m0-3c-13 0-14-9-14-9 8 0 14 3 14 9"/>'
];
export const festivalIcon = index => `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${marks[index]}</svg>`;
// Posts still show the original pass ticket.
export function festivalTicket(garage = false) {
  return `<div class="festival-ticket" aria-hidden="true"><div class="festival-ticket-top"><span>H / 06</span><span>FESTIVAL PASS</span></div><div class="festival-ticket-title">FOUR<br>SEASONS<span>↗</span></div><div class="festival-ticket-seasons">${seasons.map((s,i)=>`<span class="festival-stamp stamp-${s}">${festivalIcon(i)}<small>0${i+1}</small></span>`).join('')}</div><div class="festival-ticket-stub"><span>${garage ? "THE NEXT CAR.<br>THE NEXT CHAPTER." : "YOUR FESTIVAL.<br>YOUR WAY."}</span><i class="festival-barcode"></i><b>${garage ? "647" : "020"}</b></div></div>`;
}
export function festivalArtwork() {
  return `<div class="festival-stage festival-journey-stage" aria-hidden="true"><div class="festival-orbit"></div><span class="festival-pink-label">THE JOURNEY<br>EDITION / 03</span>${festivalJourneyArt()}<div class="festival-weather"><span class="festival-season-icon">${festivalIcon(0)}</span><div><small>SEASON / <span class="festival-season-index">01</span></small><b class="festival-season-name">SUMMER</b></div><span>↗</span></div><div class="festival-track"><svg viewBox="0 0 440 70"><path d="M0 48H48C92 48 98 18 150 18H235C285 18 278 54 330 54H440"/></svg><span>KEEP A LITTLE OF THE JOURNEY.</span></div></div>`;
}

// Seven woven bands, in the wristband colours of the 0.3 journal artwork, run across the whole room.
const bandColours = ['#bfdcf4','#f7bbd4','#c3dbae','#f0d7a4','#bfb1df','#e99c9b','#82bcaa'];
const ribbons = () => `<svg class="fsx-ribbons" viewBox="0 0 1600 900" preserveAspectRatio="none" aria-hidden="true">${bandColours.map((colour,i)=>`<path d="M-40 ${560+i*26}C 300 ${470+i*22} 520 ${760+i*12} 860 ${640+i*18}S 1380 ${380+i*30} 1660 ${300+i*28}" stroke="${colour}" stroke-width="22" fill="none"/>`).join('')}</svg>`;
const stats = () => `<dl class="fsx-stats"><div><dt>647</dt><dd>${t('festival.cars')}</dd></div><div><dt>2,833</dt><dd>${t('festival.journalCount')}</dd></div><div><dt>7</dt><dd>${t('festival.wristbandCount')}</dd></div></dl>`;
const actions = p => `<div class="xr-actions">${linkButton({href:p.downloadUrl,text:t('festival.download'),iconName:'arrow-down',primary:true})}${linkButton({href:p.repoUrl,text:'GitHub'})}</div>`;
const spec = p => specList([[label.exhibit(),'No. 04'],[label.category(),esc(p.category)],[label.version(),`<span class="xr-data">${currentFestival.version}</span>`],[label.platform(),t('festival.platform')],[label.stack(),tagLine(p.tags)]]);
const title = (tag='h3', id='') => roomTitle('Festival<br>Toolkit<span class="fsx-six">6</span>','04',{tag,id});

const pass = () => `<div class="fsx-pass"><div class="fsx-stub" aria-hidden="true"><p class="fsx-stub-top"><span>H / 06</span><span>Journal pass</span></p><p class="fsx-stub-word">Take the<br>long way.</p><div class="fsx-season"><span class="fsx-season-icon" data-fsx-season-icon>${festivalIcon(0)}</span><span><small>Season / <b data-fsx-season-index>01</b></small><strong data-fsx-season-name>${t('festival.summer')}</strong></span></div><p class="fsx-stub-facts">2,833 journal entries<br>38 categories<br>02 journals<br>One more adventure.</p><p class="fsx-edition"><span>Edition<br>Keep exploring</span><b>03</b></p><i class="fsx-barcode"></i></div><figure class="fsx-page"><img src="./assets/projects/festival-toolkit/journey-v0.3.png" width="2139" height="1356" alt="${t('festival.capture')} · ${t('festival.journey')}" loading="lazy" decoding="async"><figcaption>${t('festival.capture')}</figcaption></figure></div>`;

export function festivalCard(project) {
  return `<article class="exhibit xr xr--festival" id="project-festival-toolkit" data-season="summer"><div class="xr-inner"><div class="xr-hero"><div class="xr-copy">${title()}<p class="fsx-product">${t('festival.name')}</p><p class="xr-sub">${t('festival.headline')}</p><p class="xr-lede">${t('festival.description')}</p>${spec(project)}${actions(project)}<div class="xr-actions xr-actions--inside">${insideButton('festival-toolkit',t('festival.explore'),t('project.viewAria',{name:'Festival Toolkit'}))}</div></div><div class="xr-stage fsx-stage">${ribbons()}${pass()}<p class="fsx-motto" aria-hidden="true"><span>Your festival. Your way.</span><span>Keep a little of the journey.</span></p></div></div><section class="fsx-band"><div class="fsx-palette"><h4>${t('festival.palette')}</h4><p>${t('festival.paletteNote')}</p><div class="fsx-seasons" role="group" aria-label="${t('festival.paletteLabel')}">${seasons.map((s,i)=>`<button type="button" data-festival-season="${s}" aria-pressed="${i===0}">${festivalIcon(i)}<span>${t('festival.'+s)}</span></button>`).join('')}</div></div>${stats()}</section>${festivalHistory('festival-history')}<footer class="xr-foot"><span>The festival collection</span><span>Your festival. Still growing.</span><span>CHEFZC © 2026</span></footer></div></article>`;
}

export function festivalHistory(id) {
  const language = getLanguage();
  const route = [...festivalReleases].reverse().map(r=>`<span>${r.version}</span>`).join('<i></i>');
  return `<details class="xr-history fsx-history festival-history" id="${id}"><summary><span class="xr-history-count"><b>${String(festivalReleases.length).padStart(2,'0')}</b><small>Issues</small></span><span class="xr-history-title"><strong>${t('festival.history')}</strong><small>${t('festival.historyHint')}</small></span><span class="xr-history-route" aria-hidden="true">${route}</span><span class="xr-history-toggle" aria-hidden="true">${plusIcon}</span></summary><div class="xr-history-body">${festivalReleases.map((release,index)=>{
    const copy=release[language];
    return `<article class="xr-release${index===0?' is-current':''}"><div class="xr-release-rail"><b class="xr-release-v">${release.version}</b><time datetime="${release.date}">${release.date.replaceAll('-','.')}</time><span class="xr-release-status">${t(index===0?'festival.current':'festival.previous')}</span><span class="xr-release-ed">Pass / ${release.edition}</span><i class="fsx-barcode" aria-hidden="true"></i></div><div class="xr-release-copy"><h4>${copy.name}</h4><p>${copy.intro}</p><ul>${copy.changes.map(([name,body])=>`<li><b>${name}</b><span>${body}</span></li>`).join('')}</ul><p class="xr-release-note">${copy.note}</p><a href="${festivalReleaseUrl(release.version)}" target="_blank" rel="noopener noreferrer"><span>${t('festival.releaseLink')} ${release.version}</span>${icon('arrow-up-right')}</a></div></article>`;
  }).join('')}<p class="xr-history-foot"><span>The festival archive</span><span>Your festival. Still growing.</span><span>${t('festival.archiveFoot')}</span></p></div></details>`;
}

const captures = { journey: 'journey-v0.3.png', wristbands: 'wristbands-v0.3.png', playlist: 'workspace-v0.3.png', garage: 'garage-v0.3.png' };
export function changeFestivalView(root, view) {
  if(!Object.hasOwn(captures,view)) return;
  const figure=root.querySelector('.fsx-capture');
  if(!figure) return;
  figure.querySelector('img').src=`./assets/projects/festival-toolkit/${captures[view]}`;
  figure.querySelector('img').alt=t('festival.capture')+' · '+t('festival.'+view);
  root.querySelectorAll('[data-festival-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.festivalView===view)));
}
export function festivalDetail(project, view = 'journey') {
  return `<div class="xd xd--festival">${ribbons()}<header class="xd-head">${title('h2','dialog-title')}<p class="xr-sub">${t('festival.headline')}</p>${specList([[label.exhibit(),'ChefZC / Project 04'],[label.version(),`<span class="xr-data">${currentFestival.version}</span>`],[label.platform(),t('festival.platform')]])}</header><div class="xd-views" role="group" aria-label="${t('festival.views')}">${Object.keys(captures).map(key=>`<button type="button" data-festival-view="${key}" aria-pressed="${view===key}">${t('festival.'+key)}</button>`).join('')}</div><figure class="xd-shot fsx-capture"><div class="xd-shot-bar"><span>The actual workspace</span><span class="xr-data">Windows / ${currentFestival.version}</span></div><img src="./assets/projects/festival-toolkit/${captures[view]}" width="2139" height="1356" alt="${t('festival.capture')} · ${t('festival.'+view)}"><figcaption>${t('festival.capture')}</figcaption></figure>${stats()}<div class="xd-copy"><section><span class="xd-step">01 / The journey</span><div><h3>${t('festival.journeyTitle')}</h3><p>${t('festival.journeyText')}</p></div></section><section><span class="xd-step">02 / Keep growing</span><div><h3>${t('festival.detailTitle')}</h3><p>${t('festival.detailText')}</p></div></section><section><span class="xd-step">03 / The way back</span><div><h3>${t('festival.restoreTitle')}</h3><p>${t('festival.restoreText')}</p></div></section></div><p class="xd-note">${t('festival.boundary')}</p>${festivalHistory('festival-detail-history')}<div class="xd-actions">${actions(project)}</div></div>`;
}
export function changeFestivalSeason(root, season) {
  const index=seasons.indexOf(season);
  if(index<0) return;
  const card=root.querySelector('#project-festival-toolkit');
  if(!card) return;
  card.dataset.season=season;
  card.querySelectorAll('[data-festival-season]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.festivalSeason===season)));
  const name=card.querySelector('[data-fsx-season-name]'); if(name) name.textContent=t('festival.'+season);
  const number=card.querySelector('[data-fsx-season-index]'); if(number) number.textContent=String(index+1).padStart(2,'0');
  const mark=card.querySelector('[data-fsx-season-icon]'); if(mark) mark.innerHTML=festivalIcon(index);
}
