import { t, onLanguageChange } from './i18n.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const motionButton = document.querySelector('[data-pop-motion]');
let paused = reduced.matches;
function renderCopy() {
  document.querySelectorAll('[data-model-html]').forEach(el => el.innerHTML = t(el.dataset.modelHtml));
  motionButton.querySelector('[data-pop-motion-label]').textContent = t(paused ? 'models.motionOff' : 'models.motionOn');
}
function setMotion(value) {
  paused = value;
  document.body.dataset.motion = paused ? 'paused' : 'running';
  motionButton.setAttribute('aria-pressed', String(paused));
  renderCopy();
  document.dispatchEvent(new CustomEvent('courtside:motion', { detail: { paused } }));
}
setMotion(paused);
onLanguageChange(renderCopy);
motionButton.addEventListener('click', () => setMotion(!paused));
reduced.addEventListener('change', event => { if (event.matches) setMotion(true); });

const tabs = [...document.querySelectorAll('[data-view]')];
function selectView(tab, focus = false) {
  tabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !selected;
  });
  if (focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectView(tab));
  tab.addEventListener('keydown', event => {
    if (event.altKey || event.ctrlKey || event.metaKey) return;
    let next;
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') next = tabs[1 - index];
    if (event.key === 'Home') next = tabs[0];
    if (event.key === 'End') next = tabs.at(-1);
    if (next) { event.preventDefault(); selectView(next, true); }
  });
});
function followHash() { if (location.hash === '#model-exterior') selectView(tabs[1]); }
followHash();
window.addEventListener('hashchange', followHash);

// Content stays visible without JS; reveal is an enhancement.
const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  entry.target.classList.add('pop-visible');
  reveal.unobserve(entry.target);
}), { threshold: .04 });
document.querySelectorAll('.pop-reveal').forEach(el => reveal.observe(el));
document.body.classList.add('pop-motion-ready');

const visibleArt = new IntersectionObserver(entries => entries.forEach(entry => {
  entry.target.classList.toggle('pop-offscreen', !entry.isIntersecting);
}), { rootMargin: '60px' });
document.querySelectorAll('.models-header, .pop-ticker, .model-stage').forEach(el => visibleArt.observe(el));

document.querySelectorAll('.model-stage').forEach(stage => {
  let frame = 0;
  let timeout;
  stage.addEventListener('pointermove', event => {
    if (paused || reduced.matches || event.pointerType !== 'mouse' || frame) return;
    frame = requestAnimationFrame(() => {
      const rect = stage.getBoundingClientRect();
      stage.style.setProperty('--pointer-x', `${((event.clientX - rect.left) / rect.width - .5) * 16}px`);
      stage.style.setProperty('--pointer-y', `${((event.clientY - rect.top) / rect.height - .5) * 16}px`);
      frame = 0;
    });
  }, { passive: true });
  stage.addEventListener('pointerleave', () => {
    stage.style.setProperty('--pointer-x', '0px');
    stage.style.setProperty('--pointer-y', '0px');
  });
  stage.addEventListener('pointerdown', event => {
    if (paused || reduced.matches || event.target.closest('button')) return;
    stage.classList.remove('pop-interacting');
    requestAnimationFrame(() => stage.classList.add('pop-interacting'));
    clearTimeout(timeout);
    timeout = setTimeout(() => stage.classList.remove('pop-interacting'), 600);
  }, { passive: true });
});

import('./model-viewer.bundle.js').catch(() => {
  document.querySelectorAll('.model-status').forEach(el => el.textContent = '3D unavailable / 请查看模型渲染图');
});
