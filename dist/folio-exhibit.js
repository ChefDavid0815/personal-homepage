import { t } from './i18n.js';

const assets = './assets/projects/folio/';
export const folioViews = [
  { id:'library', number:'01', image:'library.png', title:'folio.library', caption:'folio.libraryCaption' },
  { id:'discover', number:'02', image:'discover.png', title:'folio.discover', caption:'folio.discoverCaption' },
  { id:'files', number:'03', image:'files.png', title:'folio.files', caption:'folio.filesCaption' }
];

// A project-specific exhibition, built around real screenshots of the desktop app.
export function folioCard(project) {
  return `<article class="exhibit exhibit--folio" id="project-folio">
    <div class="folio-masthead"><span>THE CONSIDERED COLLECTION</span><span>NO. 02 <i>—</i> EST. 2026</span></div>
    <button class="folio-open" data-project="folio" aria-label="${t('project.viewAria',{name:'Folio'})}">
      <div class="folio-intro"><div class="folio-brand-line"><span class="folio-wordmark">Folio<span>.</span></span><span class="folio-edition">MOD STUDIO<br><b>VOL. 1.0</b></span></div>
        <div class="folio-title-line"><h3>${t('folio.name')}</h3><span>${t('folio.platform')}</span></div>
        <h4>${t('folio.headline')}</h4><p>${t('folio.description')}</p>
        <span class="folio-explore">${t('folio.explore')} <span aria-hidden="true">↗</span></span>
      </div>
      <div class="folio-stage" aria-hidden="true"><div class="folio-stage-heading"><span>MADE FOR THE THINGS YOU LOVE.</span><span class="folio-asterisk">✳</span></div>
        <div class="folio-window"><div class="folio-window-bar"><span>Folio <i>/</i> The personal collection</span><span>01—03</span></div><img src="${assets}library.png" width="1426" height="924" alt="" decoding="async"><span class="folio-light"></span></div>
        <div class="folio-margin-note"><em>A little more<br>of what you love.</em><span>${t('folio.realCapture')}</span></div>
      </div>
    </button>
    <div class="folio-index"><span><b>01</b> ${t('folio.library')}</span><span><b>02</b> ${t('folio.organise')}</span><span><b>03</b> ${t('folio.restore')}</span><span class="folio-index-end">COLLECT WITH CARE.</span></div>
    <div class="folio-actions"><p>${t('folio.desktopNote')}</p><div><a class="folio-source" href="${project.repoUrl}" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a><a class="folio-download" href="${project.downloadUrl}" target="_blank" rel="noopener noreferrer">${t('folio.download')} <span aria-hidden="true">↓</span></a></div></div>
  </article>`;
}

export function folioDetail(project, selected = 'library') {
  const view = folioViews.find(v => v.id === selected) || folioViews[0];
  return `<div class="folio-detail-heading"><span class="folio-overline">CHEFZC / PROJECT NO. 02 / V1.0</span><h2 id="dialog-title">Folio<span>.</span><small>${t('folio.name')}</small></h2><p>${t('folio.headline')}</p></div>
    <div class="folio-reader"><div class="folio-tabs" role="group" aria-label="${t('folio.views')}">${folioViews.map(v=>`<button type="button" data-folio-view="${v.id}" aria-pressed="${v.id === view.id}" aria-controls="folio-view"><span>${v.number}</span>${t(v.title)}</button>`).join('')}</div>
      <figure id="folio-view"><div class="folio-view-frame"><img src="${assets+view.image}" alt="${t(view.caption)}" width="1426" height="924"></div><figcaption aria-live="polite"><span>${view.number} / 03</span><span>${t(view.caption)}</span></figcaption></figure>
    </div>
    <div class="folio-detail-copy"><div><span class="folio-overline">A CONSIDERED HOME FOR YOUR MODS</span><h3>${t('folio.detailTitle')}</h3><p>${t('folio.detailText')}</p></div><dl><div><dt>${t('folio.system')}</dt><dd>Windows x64</dd></div><div><dt>${t('folio.edition')}</dt><dd>1.0.0</dd></div><div><dt>${t('folio.builtWith')}</dt><dd>Electron · React<br>TypeScript</dd></div></dl></div>
    <div class="folio-detail-note">${t('folio.boundary')}</div>
    <div class="folio-actions"><p>${t('folio.downloadNote')}</p><div><a class="folio-source" href="${project.repoUrl}" target="_blank" rel="noopener noreferrer">GitHub ↗</a><a class="folio-download" href="${project.downloadUrl}" target="_blank" rel="noopener noreferrer">${t('folio.download')} ↓</a></div></div>`;
}

export function changeFolioView(container, viewId) {
  const view = folioViews.find(v=>v.id===viewId);
  if(!view) return;
  container.querySelectorAll('[data-folio-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.folioView===viewId)));
  const figure=container.querySelector('#folio-view');
  const picture=document.createElement('img');
  picture.src=assets+view.image; picture.alt=t(view.caption); picture.width=1426; picture.height=924;
  figure.querySelector('.folio-view-frame').replaceChildren(picture);
  figure.querySelector('figcaption span:first-child').textContent=view.number+' / 03';
  figure.querySelector('figcaption span:last-child').textContent=t(view.caption);
}
