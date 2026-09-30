import { canAnimate, onMotionChange } from './motion-state.js';

const pieces = [...document.querySelectorAll('.ai-stage,.ai-now-art,.ai-post-art')];
const visible = new WeakMap();
const update = () => {
  for (const piece of pieces) piece.dataset.aiActive = String(Boolean(visible.get(piece)) && canAnimate());
};
const observer = new IntersectionObserver(entries => {
  for (const entry of entries) visible.set(entry.target, entry.isIntersecting);
  update();
}, { rootMargin: '120px 0px' });
for (const piece of pieces) { visible.set(piece, false); piece.dataset.aiActive = 'false'; observer.observe(piece); }
const unsubscribe = onMotionChange(update);
document.addEventListener('visibilitychange', update);
const history = document.querySelector('#afterimage-history');
const openHistoryTarget = () => { if (history && location.hash === '#afterimage-history') history.open = true; };
openHistoryTarget();
window.addEventListener('hashchange', openHistoryTarget);

const stage = document.querySelector('[data-afterimage-stage]');
const pointer = matchMedia('(hover:hover) and (pointer:fine)');
const move = event => {
  if (!stage || !pointer.matches || !canAnimate()) return;
  const box = stage.getBoundingClientRect();
  const x = Math.max(0, Math.min(1, (event.clientX - box.left) / box.width));
  const y = Math.max(0, Math.min(1, (event.clientY - box.top) / box.height));
  stage.style.setProperty('--ai-x', `${(x * 100).toFixed(1)}%`);
  stage.style.setProperty('--ai-y', `${(y * 100).toFixed(1)}%`);
  stage.style.setProperty('--ai-parallax-x', `${((x - .5) * -12).toFixed(1)}px`);
  stage.style.setProperty('--ai-parallax-y', `${((y - .5) * -10).toFixed(1)}px`);
};
const reset = () => {
  if (!stage) return;
  stage.style.removeProperty('--ai-x'); stage.style.removeProperty('--ai-y');
  stage.style.removeProperty('--ai-parallax-x'); stage.style.removeProperty('--ai-parallax-y');
};
stage?.addEventListener('pointermove', move, { passive: true });
stage?.addEventListener('pointerleave', reset);
window.addEventListener('pagehide', () => {
  observer.disconnect(); unsubscribe();
  document.removeEventListener('visibilitychange', update);
  window.removeEventListener('hashchange', openHistoryTarget);
  stage?.removeEventListener('pointermove', move); stage?.removeEventListener('pointerleave', reset);
}, { once: true });
