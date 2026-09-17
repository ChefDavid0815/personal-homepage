const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
let revealObserver;

function enableMotion() {
  if (reducedMotion.matches) return;
  if ('IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      }
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
    const elements = document.querySelectorAll('[data-reveal]');
    // Keep content already in view visible when enhancing a restored scroll position.
    elements.forEach(element => {
      if (element.getBoundingClientRect().top < window.innerHeight) element.classList.add('is-visible');
      else revealObserver.observe(element);
    });
    document.documentElement.classList.add('motion-ready');
  }
}

enableMotion();
reducedMotion.addEventListener('change', () => {
  if (reducedMotion.matches) {
    revealObserver?.disconnect();
    document.documentElement.classList.remove('motion-ready');
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.style.removeProperty('--tilt-x');
      card.style.removeProperty('--tilt-y');
    });
  } else enableMotion();
});

document.querySelectorAll('[data-tilt]').forEach(card => {
  let frame = null;
  card.addEventListener('pointermove', event => {
    if (reducedMotion.matches || !finePointer.matches || event.pointerType === 'touch') return;
    if (frame !== null) cancelAnimationFrame(frame);
    const { clientX, clientY } = event;
    frame = requestAnimationFrame(() => {
      const bounds = card.getBoundingClientRect();
      const x = Math.max(-1, Math.min(1, (clientX - bounds.left) / bounds.width * 2 - 1));
      const y = Math.max(-1, Math.min(1, (clientY - bounds.top) / bounds.height * 2 - 1));
      card.style.setProperty('--tilt-x', `${-y * 2}deg`);
      card.style.setProperty('--tilt-y', `${x * 2}deg`);
      frame = null;
    });
  });
  card.addEventListener('pointerleave', () => {
    if (frame !== null) cancelAnimationFrame(frame);
    frame = null;
    card.style.removeProperty('--tilt-x');
    card.style.removeProperty('--tilt-y');
  });
});
