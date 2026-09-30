import { canAnimate, onMotionChange } from './motion-state.js';

const scenes = [...document.querySelectorAll('.gallery-header,.ai-sites-section,.gallery-section-prologue,.gallery-colophon')];
const sceneObserver = new IntersectionObserver(entries => {
  for (const entry of entries) entry.target.classList.toggle('gallery-is-visible', entry.isIntersecting);
}, { rootMargin: '80px 0px' });
scenes.forEach(scene => sceneObserver.observe(scene));

const art = document.querySelector('.gallery-hero-art');
if (art) {
  let frame = 0;
  let pointer = null;
  const reset = () => {
    pointer = null;
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    art.style.removeProperty('--gallery-shift-x');
    art.style.removeProperty('--gallery-shift-y');
  };
  const move = event => {
    if (!canAnimate() || event.pointerType === 'touch' || !matchMedia('(hover:hover)').matches) return;
    const bounds = art.getBoundingClientRect();
    pointer = {
      x: ((event.clientX - bounds.left) / bounds.width - .5) * 16,
      y: ((event.clientY - bounds.top) / bounds.height - .5) * 13
    };
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (!pointer || !canAnimate()) return;
      art.style.setProperty('--gallery-shift-x', `${pointer.x.toFixed(1)}px`);
      art.style.setProperty('--gallery-shift-y', `${pointer.y.toFixed(1)}px`);
    });
  };
  art.addEventListener('pointermove', move, { passive: true });
  art.addEventListener('pointerleave', reset);
  onMotionChange(paused => { if (paused) reset(); });
}
