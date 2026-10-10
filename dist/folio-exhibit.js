import { t, getLanguage } from './i18n.js';
import { folioReleases, currentFolio, folioReleaseUrl } from './folio-releases.js';
import { esc, icon, plusIcon, specList, tagLine, roomTitle, linkButton, insideButton, label } from './exhibit-frame.js';
const assets = './assets/projects/folio/v1.1/';
export const folioViews = [
  { id:'library', number:'01', image:'changelog.png', title:'folio.journal', caption:'folio.journalCaption' },
  { id:'discover', number:'02', image:'fh6-local.png', title:'folio.fh6', caption:'folio.fh6Caption' },
  { id:'files', number:'03', image:'nexus-browse.png', title:'folio.nexus', caption:'folio.nexusCaption' }
];
// The card's index follows the order of the original exhibit: FH6, Nexus, then the journal.
const indexOrder = ['discover','files','library'];

const actions = project => `<div class="xr-actions">${linkButton({href:project.downloadUrl,text:t('folio.download'),iconName:'arrow-down',primary:true})}${linkButton({href:project.repoUrl,text:'GitHub'})}</div>`;

// Three real screenshots, stacked like loose pages. The index below brings a page to the top.
const stack = () => `<div class="fox-stack" data-fox-front="library">${folioViews.map(v=>`<figure class="fox-page" data-fox-page="${v.id}"><img src="${assets+v.image}" width="1440" height="960" alt="${t(v.caption)}" loading="lazy" decoding="async"></figure>`).join('')}</div>`;

export function folioCard(project) {
  return `<article class="exhibit xr xr--folio" id="project-folio"><div class="xr-inner"><div class="xr-hero"><div class="xr-copy">${roomTitle('Folio<span class="fox-dot">.</span>','02')}<p class="fox-name"><span>${t('folio.name')}</span><span>${t('folio.platform')}</span><span>Mod studio, vol. ${currentFolio.edition}</span></p><p class="xr-sub">${t('folio.headline')}</p><p class="xr-lede">${t('folio.description')}</p>${specList([[label.exhibit(),'No. 02 / Est. 2026'],[label.category(),esc(project.category)],[label.version(),`<span class="xr-data">${currentFolio.version}</span>`],[label.platform(),t('folio.desktopNote')],[label.stack(),tagLine(project.tags)]])}${actions(project)}<div class="xr-actions xr-actions--inside">${insideButton('folio',t('folio.explore'),t('project.viewAria',{name:'Folio'}))}</div></div><div class="xr-stage fox-stage">${stack()}<p class="fox-margin" aria-hidden="true"><em>A little more<br>of what you love.</em></p><p class="fox-real"><span>Folio / The personal collection</span><span>${t('folio.realCapture')}</span></p></div></div><nav class="fox-index" aria-label="${t('folio.views')}">${indexOrder.map((id,i)=>{const v=folioViews.find(x=>x.id===id);return `<button type="button" data-fox-show="${id}" aria-pressed="${id==='library'}"><span class="fox-index-n">0${i+1}</span>${t(v.title)}</button>`;}).join('')}<span class="fox-index-end">Collect with care. Made for the things you love.</span></nav>${folioHistory('folio-history')}<footer class="xr-foot"><span>The considered collection</span><span>${t('folio.desktopNote')}</span><span>CHEFZC © 2026</span></footer></div></article>`;
}

export function folioDetail(project, selected = 'library') {
  const view = folioViews.find(v => v.id === selected) || folioViews[0];
  return `<div class="xd xd--folio"><header class="xd-head">${roomTitle('Folio<span class="fox-dot">.</span>','02',{tag:'h2',id:'dialog-title'})}<p class="fox-name"><span>${t('folio.name')}</span></p><p class="xr-sub">${t('folio.headline')}</p>${specList([[label.exhibit(),`ChefZC / Project No. 02`],[t('folio.system'),'Windows x64'],[t('folio.edition'),`<span class="xr-data">${currentFolio.version}</span>`],[t('folio.builtWith'),'Electron · React · TypeScript']])}</header>
    <div class="xd-views" role="group" aria-label="${t('folio.views')}">${folioViews.map(v=>`<button type="button" data-folio-view="${v.id}" aria-pressed="${v.id === view.id}" aria-controls="folio-view"><span class="xr-data">${v.number}</span>${t(v.title)}</button>`).join('')}</div>
    <figure id="folio-view" class="xd-shot fox-reader"><div class="fox-view-frame"><img src="${assets+view.image}" alt="${t(view.caption)}" width="1440" height="960"></div><figcaption aria-live="polite"><span class="xr-data">${view.number} / 03</span><span>${t(view.caption)}</span></figcaption></figure>
    <div class="xd-copy"><section><span class="xd-step">A considered home for your mods</span><div><h3>${t('folio.detailTitle')}</h3><p>${t('folio.detailText')}</p></div></section></div>
    <p class="xd-note">${t('folio.boundary')}</p>
    ${folioHistory('folio-detail-history')}
    <div class="xd-actions">${actions(project)}<p class="xr-aside">${t('folio.downloadNote')}</p></div></div>`;
}

export function changeFolioView(container, viewId) {
  const view = folioViews.find(v=>v.id===viewId);
  if(!view) return;
  container.querySelectorAll('[data-folio-view]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.folioView===viewId)));
  const figure=container.querySelector('#folio-view');
  const picture=document.createElement('img');
  picture.src=assets+view.image; picture.alt=t(view.caption); picture.width=1440; picture.height=960;
  figure.querySelector('.fox-view-frame').replaceChildren(picture);
  figure.querySelector('figcaption span:first-child').textContent=view.number+' / 03';
  figure.querySelector('figcaption span:last-child').textContent=t(view.caption);
}

export function folioHistory(id) {
  const language = getLanguage();
  const labels = language === 'en'
    ? {title:'The version journal', hint:'Two editions. One growing story.', latest:'Latest', notes:'Release notes & downloads', change:'What changed', archive:'Archive'}
    : {title:'版本手记', hint:'两个版本，一本慢慢生长的手帖。', latest:'当前版本', notes:'发布说明与下载', change:'这一页的新变化', archive:'存档'};
  const route = [...folioReleases].reverse().map(r=>`<span>${r.edition}</span>`).join('<i></i>');
  return `<details class="xr-history fox-history folio-history" id="${id}"><summary><span class="xr-history-count"><b>f.</b><small>The edition archive</small></span><span class="xr-history-title"><strong>${labels.title}</strong><small>${labels.hint}</small></span><span class="xr-history-route" aria-hidden="true">${route}</span><span class="xr-history-toggle" aria-hidden="true">${plusIcon}</span></summary><div class="xr-history-body">${folioReleases.map((release,index)=>{
    const copy=release[language];
    return `<article class="xr-release${index===0?' is-current':''}"><div class="xr-release-rail"><b class="xr-release-v">${release.edition}</b><time datetime="${release.date}">${release.date.replaceAll('-','.')}</time><span class="xr-release-status">${index === 0 ? labels.latest : labels.archive}</span><span class="xr-release-ed">Edition / ${String(folioReleases.length-index).padStart(2,'0')}</span></div><div class="xr-release-copy"><h4>${copy.name}</h4><p>${copy.introduction}</p><ul aria-label="${labels.change}">${copy.changes.map(([name,body])=>`<li><b>${name}</b><span>${body}</span></li>`).join('')}</ul><p class="xr-release-note">${copy.note}</p><a href="${folioReleaseUrl(release.version)}" target="_blank" rel="noopener noreferrer"><span>${labels.notes}</span>${icon('arrow-up-right')}<span class="sr-only"> v${release.version}</span></a></div></article>`;
  }).join('')}</div></details>`;
}

// Bring a page of the stack to the top. Registered once; the stack is re-rendered on language change.
document.addEventListener('click', event => {
  const button = event.target.closest?.('[data-fox-show]');
  if(!button) return;
  const room = button.closest('.xr--folio');
  const stackNode = room?.querySelector('.fox-stack');
  if(!stackNode) return;
  stackNode.dataset.foxFront = button.dataset.foxShow;
  room.querySelectorAll('[data-fox-show]').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
});
