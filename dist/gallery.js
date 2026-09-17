import { t, localizeProject, onLanguageChange } from './i18n.js';
import { projects } from './projects.js';

const waveHeights = [18, 31, 47, 33, 61, 79, 55, 90, 72, 100, 83, 63, 95, 77, 52, 69, 41, 58, 33, 22, 37];
const previews = {
  neon: `<div class="neon-composition">
    <div class="concept-browser"><div class="concept-browser-bar"><span class="concept-dots"><i></i><i></i><i></i></span><span>neon.space / playground</span><span>⌘ K</span></div>
      <div class="neon-workspace"><div class="neon-rail"><b>n<span>✳</span></b><span class="neon-rail-item selected">＋ New thought</span><span class="neon-rail-item">↗ Explore</span><span class="neon-rail-item">▤ My space</span><span class="neon-rail-bottom">A LITTLE SPARK<br>GOES A LONG WAY.</span></div>
        <div class="neon-canvas"><span class="neon-greeting">YOUR NEXT BIG IDEA STARTS HERE</span><span class="neon-emblem">✳</span><strong>What if<br>we made it real?</strong><div class="neon-prompt">An idea worth exploring… <span>↑</span></div><div class="neon-suggestions"><span>✧ Imagine something</span><span>⌘ Make a plan</span></div></div>
      </div>
    </div>
    <div class="neon-floating-note"><span>✳</span><div><b>Small spark. Big possibilities.</b><small>EVERY GOOD IDEA STARTS SOMEWHERE.</small></div></div>
  </div>`,
  flow: `<div class="flow-composition"><div class="flow-poster-type">TUNE IN.<br><span>ZONE OUT.</span></div><div class="focus-player"><div class="focus-player-top"><span>FLOW STATE</span><span>SESSION / 01</span></div><div class="focus-wave">${waveHeights.map((height, index) => `<i style="--bar:${height}%;--delay:${index * 35}ms"></i>`).join('')}</div><div class="focus-track"><div><strong>Somewhere, quieter.</strong><span>DEEP FOCUS / AMBIENT</span></div><span class="focus-play">Ⅱ</span></div><div class="focus-progress"><span></span></div><div class="focus-time"><span>02:48</span><span>∞</span></div></div><div class="flow-cover-foot mono"><span>LESS NOISE.</span><span>MORE YOU.</span></div></div>`,
  devkit: `<div class="tools-composition"><div class="tools-poster-heading"><span>{ }</span><div>SMALL TOOLS.<br><strong>BIG DIFFERENCE.</strong></div></div><div class="toolbox-editor"><div class="toolbox-titlebar"><span class="concept-dots"><i></i><i></i><i></i></span><span>tiny-tools / workspace</span><span>⌘</span></div><div class="toolbox-tab">{ } &nbsp; everyday.json <span>×</span></div><div class="toolbox-code"><div><span>01</span><code>{</code></div><div><span>02</span><code>&nbsp; <b>"less"</b>: <em>"repetitive work"</em>,</code></div><div><span>03</span><code>&nbsp; <b>"more"</b>: <em>"time to create"</em>,</code></div><div><span>04</span><code>&nbsp; <b>"make_it"</b>: <em>"simple"</em></code></div><div><span>05</span><code>}</code></div></div><div class="toolbox-status"><span>✓ &nbsp; A little less friction.</span><span>UTF-8</span></div></div><div class="tools-keycap mono">⌘ <span>+ a better way</span></div></div>`
};

const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const safeLink = value => {
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? escapeHtml(url.href) : ''; }
  catch { return ''; }
};
const previewFor = project => previews[project.id] || '<span class="custom-preview">'+escapeHtml(project.name)+'</span>';
const tagsFor = project => project.tags.map(tag => '<span>'+escapeHtml(tag)+'</span>').join('');
const layouts = new Set(['feature', 'sound', 'utility', 'standard']);
const grid = document.querySelector('#project-grid');
const dialog = document.querySelector('#project-dialog');
const dialogContent = document.querySelector('#dialog-content');
let selectedProjectId = null;

function renderCards() {
  grid.innerHTML = projects.map(localizeProject).map(project => {
    const layout = layouts.has(project.layout) ? project.layout : 'standard';
    const headline = escapeHtml(project.headline || project.subtitle).replace(/\n/g, '<br>');
    const featured = t(project.demo ? 'project.featuredConcept' : 'project.featuredProject');
    return '<article class="exhibit exhibit--'+layout+' exhibit--'+escapeHtml(project.color)+'" id="project-'+escapeHtml(project.id)+'">'+
      '<button class="exhibit-button" data-project="'+escapeHtml(project.id)+'" aria-label="'+escapeHtml(t('project.viewAria',{name:project.name}))+'">'+
      '<div class="exhibit-preview"><div class="exhibit-cover-meta mono"><span>'+escapeHtml(project.category)+'</span><span>'+t(project.demo?'project.concept':'project.project')+' / '+escapeHtml(project.number)+'</span></div><div class="exhibit-visual" aria-hidden="true">'+previewFor(project)+'</div><span class="preview-open" aria-hidden="true">↗</span></div>'+
      '<div class="exhibit-info"><div class="exhibit-kicker mono"><span>'+(layout==='feature'?featured:escapeHtml(project.category))+'</span><span class="exhibit-number">/'+escapeHtml(project.number)+'</span></div><div class="exhibit-title-row"><h3>'+escapeHtml(project.name)+'</h3><span class="exhibit-title-arrow" aria-hidden="true">↗</span></div><p class="exhibit-subtitle">'+headline+'</p><p class="exhibit-description">'+escapeHtml(project.description)+'</p><div class="exhibit-tags">'+tagsFor(project)+'</div><div class="exhibit-bottom"><span class="demo-stamp">'+t(project.demo?'project.demo':'project.work')+'</span><span class="exhibit-action">'+t('project.view')+' <span aria-hidden="true">↗</span></span></div></div></button></article>';
  }).join('');
  document.querySelectorAll('[data-project-count]').forEach(element => { element.textContent=String(projects.length).padStart(2,'0'); });
}

function renderDetail(projectId) {
  const original=projects.find(project=>project.id===projectId);
  if(!original) return;
  const project=localizeProject(original);
  const live=safeLink(project.liveUrl);
  const repo=safeLink(project.repoUrl);
  dialogContent.innerHTML='<div class="detail-heading"><p class="eyebrow mono">'+t('project.exhibit')+' '+escapeHtml(project.number)+' / '+escapeHtml(project.category)+'</p><h2 id="dialog-title">'+escapeHtml(project.name)+'<span aria-hidden="true">↗</span></h2><p>'+escapeHtml(project.subtitle)+'</p></div>'+
    '<div class="detail-art exhibit--'+escapeHtml(project.color)+'" aria-hidden="true">'+previewFor(project)+'</div><div class="detail-body"><div class="detail-description"><h3>'+t(project.demo?'project.aboutConcept':'project.aboutProject')+'</h3><p>'+escapeHtml(project.detail||project.description)+'</p></div>'+
    '<dl class="detail-facts"><div><dt>'+t('project.type')+'</dt><dd>'+escapeHtml(project.category)+'</dd></div><div><dt>'+t('project.status')+'</dt><dd>'+t(project.demo?'project.demoStatus':'project.work')+'</dd></div><div><dt>'+t('project.tags')+'</dt><dd class="exhibit-tags">'+tagsFor(project)+'</dd></div></dl></div>'+
    (live||repo?'<div class="project-links">'+(live?'<a class="primary-button" href="'+live+'" target="_blank" rel="noopener noreferrer">'+t('project.live')+'</a>':'')+(repo?'<a class="source-link" href="'+repo+'" target="_blank" rel="noopener noreferrer">'+t('project.source')+'</a>':'')+'</div>':'');
}

renderCards();
onLanguageChange(() => {
  renderCards();
  if(dialog.open&&selectedProjectId) renderDetail(selectedProjectId);
});
grid.addEventListener('click',event=>{
  const button=event.target.closest('[data-project]');
  if(!button) return;
  selectedProjectId=button.dataset.project;
  renderDetail(selectedProjectId);
  dialog.showModal();
  document.body.classList.add('dialog-open');
});
dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{
  if(event.target!==dialog) return;
  const bounds=dialog.getBoundingClientRect();
  if(event.clientX<bounds.left||event.clientX>bounds.right||event.clientY<bounds.top||event.clientY>bounds.bottom) dialog.close();
});
dialog.addEventListener('close',()=>{
  document.body.classList.remove('dialog-open');
  const opener=[...grid.querySelectorAll('[data-project]')].find(button=>button.dataset.project===selectedProjectId);
  opener?.focus({preventScroll:true});
  selectedProjectId=null;
});
