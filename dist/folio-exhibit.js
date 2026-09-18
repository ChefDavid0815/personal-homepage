import { t, getLanguage } from './i18n.js';

import { folioReleases, currentFolio, folioReleaseUrl } from './folio-releases.js';
const assets = './assets/projects/folio/v1.1/';
export const folioViews = [
  { id:'library', number:'01', image:'changelog.png', title:'folio.journal', caption:'folio.journalCaption' },
  { id:'discover', number:'02', image:'fh6-local.png', title:'folio.fh6', caption:'folio.fh6Caption' },
  { id:'files', number:'03', image:'nexus-browse.png', title:'folio.nexus', caption:'folio.nexusCaption' }
];

// A project-specific exhibition, built around real screenshots of the desktop app.
export function folioCard(project) {
  return `<article class="exhibit exhibit--folio" id="project-folio">
    <div class="folio-masthead"><span>THE CONSIDERED COLLECTION</span><span>NO. 02 <i>—</i> EST. 2026</span></div>
    <button class="folio-open" data-project="folio" aria-label="${t('project.viewAria',{name:'Folio'})}">
      <div class="folio-intro"><div class="folio-brand-line"><span class="folio-wordmark">Folio<span>.</span></span><span class="folio-edition">MOD STUDIO<br><b>VOL. ${currentFolio.edition}</b></span></div>
        <div class="folio-title-line"><h3>${t('folio.name')}</h3><span>${t('folio.platform')}</span></div>
        <h4>${t('folio.headline')}</h4><p>${t('folio.description')}</p>
        <span class="folio-explore">${t('folio.explore')} <span aria-hidden="true">↗</span></span>
      </div>
      <div class="folio-stage" aria-hidden="true"><div class="folio-stage-heading"><span>MADE FOR THE THINGS YOU LOVE.</span><span class="folio-asterisk">✳</span></div>
        <div class="folio-window"><div class="folio-window-bar"><span>Folio <i>/</i> The personal collection</span><span>01—03</span></div><img src="${assets}changelog.png" width="1440" height="960" alt="" decoding="async"><span class="folio-light"></span></div>
        <div class="folio-margin-note"><em>A little more<br>of what you love.</em><span>${t('folio.realCapture')}</span></div>
      </div>
    </button>
    <div class="folio-index"><span><b>01</b> ${t('folio.fh6')}</span><span><b>02</b> ${t('folio.nexus')}</span><span><b>03</b> ${t('folio.journal')}</span><span class="folio-index-end">COLLECT WITH CARE.</span></div>
    ${folioHistory("folio-history")}
    <div class="folio-actions"><p>${t('folio.desktopNote')}</p><div><a class="folio-source" href="${project.repoUrl}" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a><a class="folio-download" href="${project.downloadUrl}" target="_blank" rel="noopener noreferrer">${t('folio.download')} <span aria-hidden="true">↓</span></a></div></div>
  </article>`;
}

export function folioDetail(project, selected = 'library') {
  const view = folioViews.find(v => v.id === selected) || folioViews[0];
  return `<div class="folio-detail-heading"><span class="folio-overline">CHEFZC / PROJECT NO. 02 / V${currentFolio.edition}</span><h2 id="dialog-title">Folio<span>.</span><small>${t('folio.name')}</small></h2><p>${t('folio.headline')}</p></div>
    <div class="folio-reader"><div class="folio-tabs" role="group" aria-label="${t('folio.views')}">${folioViews.map(v=>`<button type="button" data-folio-view="${v.id}" aria-pressed="${v.id === view.id}" aria-controls="folio-view"><span>${v.number}</span>${t(v.title)}</button>`).join('')}</div>
      <figure id="folio-view"><div class="folio-view-frame"><img src="${assets+view.image}" alt="${t(view.caption)}" width="1440" height="960"></div><figcaption aria-live="polite"><span>${view.number} / 03</span><span>${t(view.caption)}</span></figcaption></figure>
    </div>
    <div class="folio-detail-copy"><div><span class="folio-overline">A CONSIDERED HOME FOR YOUR MODS</span><h3>${t('folio.detailTitle')}</h3><p>${t('folio.detailText')}</p></div><dl><div><dt>${t('folio.system')}</dt><dd>Windows x64</dd></div><div><dt>${t('folio.edition')}</dt><dd>${currentFolio.version}</dd></div><div><dt>${t('folio.builtWith')}</dt><dd>Electron · React<br>TypeScript</dd></div></dl></div>
    ${folioHistory("folio-detail-history")}
    <div class="folio-detail-note">${t('folio.boundary')}</div>
    <div class="folio-actions"><p>${t('folio.downloadNote')}</p><div><a class="folio-source" href="${project.repoUrl}" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a class="folio-download" href="${project.downloadUrl}" target="_blank" rel="noopener noreferrer">${t('folio.download')} ↓</a></div></div>`;
}

export function changeFolioView(container, viewId) {
  const view = folioViews.find(v=>v.id===viewId);
  if(!view) return;
  container.querySelectorAll('[data-folio-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.folioView===viewId)));
  const figure=container.querySelector('#folio-view');
  const picture=document.createElement('img');
  picture.src=assets+view.image; picture.alt=t(view.caption); picture.width=1440; picture.height=960;
  figure.querySelector('.folio-view-frame').replaceChildren(picture);
  figure.querySelector('figcaption span:first-child').textContent=view.number+' / 03';
  figure.querySelector('figcaption span:last-child').textContent=t(view.caption);
}

export function folioHistory(id) {
  const language = getLanguage();
  const labels = language === 'en'
    ? {title:'The version journal', hint:'Two editions. One growing story.', latest:'LATEST', notes:'Release notes & downloads', change:'What changed'}
    : {title:'版本手记', hint:'两个版本，一本慢慢生长的手帖。', latest:'当前版本', notes:'发布说明与下载', change:'这一页的新变化'};
  return `<details class="folio-history" id="${id}"><summary><span class="folio-history-seal" aria-hidden="true">f.</span><span class="folio-history-label"><span class="folio-overline">THE EDITION ARCHIVE</span><strong>${labels.title}</strong><small>${labels.hint}</small></span><span class="folio-history-count">1.1 <span>←</span> 1.0</span><span class="folio-history-plus" aria-hidden="true">＋</span></summary><div class="folio-history-pages">${folioReleases.map((release,index)=>{
    const copy=release[language];
    return `<article class="folio-chapter"><header><div><span class="folio-overline">EDITION / ${String(folioReleases.length-index).padStart(2,'0')}</span><h4>${release.edition}<span>${index === 0 ? labels.latest : 'ARCHIVE'}</span></h4></div><time datetime="${release.date}">${release.date.replaceAll('-','.')}</time></header><div class="folio-chapter-intro"><h5>${copy.name}</h5><p>${copy.introduction}</p></div><ul aria-label="${labels.change}">${copy.changes.map(([title,body],i)=>`<li><span aria-hidden="true">0${i+1}</span><div><h6>${title}</h6><p>${body}</p></div></li>`).join('')}</ul><footer><p>${copy.note}</p><a href="${folioReleaseUrl(release.version)}" target="_blank" rel="noopener noreferrer">${labels.notes} <span aria-hidden="true">↗</span><span class="sr-only"> v${release.version}</span></a></footer></article>`;
  }).join('')}</div></details>`;
}
