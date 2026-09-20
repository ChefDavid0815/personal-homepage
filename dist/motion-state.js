// One preference for every page; the OS reduced-motion setting takes precedence.
const key = 'chefzc.motion';
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let manual = false;
try { manual = localStorage.getItem(key) === 'paused'; } catch { /* Session-only fallback. */ }
const listeners = new Set();
export const systemReducesMotion = () => reduced.matches;
export const isMotionPaused = () => manual || reduced.matches;
export const canAnimate = () => !isMotionPaused() && !document.hidden;
function broadcast() {
  document.documentElement.dataset.siteMotion = canAnimate() ? 'on' : 'off';
  for (const listener of listeners) listener(isMotionPaused());
}
export function setMotionPaused(value) {
  manual = Boolean(value);
  try { localStorage.setItem(key, manual ? 'paused' : 'running'); } catch { /* Still works in memory. */ }
  broadcast();
}
export function onMotionChange(listener) { listeners.add(listener); return () => listeners.delete(listener); }
reduced.addEventListener('change', broadcast);
document.addEventListener('visibilitychange', broadcast);
window.addEventListener('storage', event => {
  if (event.key !== key && event.key !== null) return;
  manual = event.key === null ? false : event.newValue === 'paused';
  broadcast();
});
broadcast();
