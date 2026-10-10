// NBA After Hours: the first project, as a night court. Rendered by gallery.js for the 'nba-after-hours' project.
import { t } from './i18n.js';
import { esc, specList, tagLine, roomTitle, linkButton, insideButton, label, bare, c } from './exhibit-frame.js';

const safe = value => {
  if (!value) return '';
  try { const url = new URL(value, location.href); return ['https:', 'http:'].includes(url.protocol) ? value : ''; }
  catch { return ''; }
};
const shot = './assets/projects/nba-after-hours/gameplay.png';
const scoreboard = () => `<dl class="ctx-board"><div><dt>30</dt><dd>${t('court.teams')}</dd></div><div><dt>3v3<span>/</span>5v5</dt><dd>${t('court.modes')}</dd></div><div><dt>02</dt><dd>${t('court.local')}</dd></div></dl>`;
// The floor: hardwood planks under painted lines, seen from the stands.
const floor = () => `<div class="ctx-arena" aria-hidden="true"><div class="ctx-light"></div><div class="ctx-floor"><svg viewBox="0 0 940 500" preserveAspectRatio="none"><g fill="none" stroke="currentColor" stroke-width="3"><rect x="10" y="10" width="920" height="480"/><path d="M470 10v480"/><circle cx="470" cy="250" r="60"/><circle cx="470" cy="250" r="20"/><path d="M10 170h190v160H10M930 170H740v160h190"/><path d="M200 190a60 60 0 0 1 0 120M740 190a60 60 0 0 0 0 120"/><path d="M10 30h140a220 220 0 0 1 0 440H10M930 30H790a220 220 0 0 0 0 440h140"/></g></svg><span class="ctx-floor-word">AFTER HOURS.</span></div></div>`;

export function courtCard(project) {
  const live = safe(project.liveUrl), repo = safe(project.repoUrl);
  const headline = esc(project.headline || project.subtitle).replace(/\n/g, '<br>');
  return `<article class="exhibit xr xr--court" id="project-nba-after-hours" data-theme="dark">${floor()}<div class="xr-inner"><div class="xr-hero"><div class="xr-copy">${roomTitle('NBA<br>After Hours','01')}<p class="ctx-first">${t('court.first')}</p><p class="xr-sub">${headline}</p><p class="xr-lede">${esc(project.description)}</p>${scoreboard()}${specList([[label.exhibit(),`${t('project.project')} / ${esc(project.number)}`],[label.category(),esc(project.category)],[label.status(),t(project.demo ? 'project.demo' : 'project.work')],[label.stack(),tagLine(project.tags)]])}<div class="xr-actions">${linkButton({href:live,text:t('court.play'),primary:true,external:false})}${linkButton({href:repo,text:t('court.source')})}</div><p class="xr-aside">${t('court.noInstall')}</p><div class="xr-actions xr-actions--inside">${insideButton('nba-after-hours',t('project.view'),t('project.viewAria',{name:project.name}))}</div></div><div class="xr-stage ctx-stage"><figure class="ctx-jumbotron"><div class="ctx-jumbo-bar"><span>${t('court.capture')}</span><b>GSW × BOS</b></div><img src="${shot}" width="1440" height="900" alt="${t('court.capture')} · GSW × BOS" loading="lazy" decoding="async"><figcaption><span>ChefZC original / 2026</span><span>Release <b class="xr-data">V1.0</b></span><code>&gt; tipoff.ready()<i></i></code></figcaption></figure></div></div><footer class="xr-foot"><span>${esc(project.subtitle)}</span><span>${esc(project.category)} / ${esc(project.number)}</span><span>CHEFZC © 2026</span></footer></div></article>`;
}

export function courtDetail(project) {
  const live = safe(project.liveUrl), repo = safe(project.repoUrl);
  return `<div class="xd xd--court"><header class="xd-head">${roomTitle(esc(project.name),esc(project.number),{tag:'h2',id:'dialog-title'})}<p class="xr-sub">${esc(project.subtitle)}</p>${specList([[label.exhibit(),`${t('project.exhibit')} ${esc(project.number)}`],[t('project.type'),esc(project.category)],[t('project.status'),t(project.demo?'project.demoStatus':'project.work')],[t('project.tags'),tagLine(project.tags)]])}</header><figure class="xd-shot ctx-detail-shot"><img src="${shot}" width="1440" height="900" alt="${t('court.capture')} · GSW × BOS"><figcaption>${t('court.capture')} · GSW × BOS</figcaption></figure>${scoreboard()}<div class="xd-copy"><section><span class="xd-step">${t(project.demo?'project.aboutConcept':'project.aboutProject')}</span><div><h3>${esc(project.headline || project.subtitle).replace(/\n/g,'<br>')}</h3><p>${esc(project.detail || project.description)}</p></div></section><section><span class="xd-step">${c('操作与存档','Controls & saves')}</span><div><p class="ctx-help">${t('court.controls')}</p><p>${t('court.browserSave')}</p></div></section></div><div class="xd-actions"><div class="xr-actions">${linkButton({href:live,text:bare(t('project.live')),primary:true})}${linkButton({href:repo,text:bare(t('project.source'))})}</div></div></div>`;
}
