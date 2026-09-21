import { getLanguage, onLanguageChange } from './i18n.js';
import { canAnimate, isMotionPaused, setMotionPaused, systemReducesMotion, onMotionChange } from './motion-state.js';

const c = (zh, en) => getLanguage() === 'en' ? en : zh;
const header = document.querySelector('.site-header');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
const motionButton = document.createElement('button');
motionButton.type = 'button';
motionButton.className = 'atelier-motion';
motionButton.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 12h2l3-7 4 14 4-14 3 7h2"/></svg>';
document.querySelector('.header-tools')?.append(motionButton);
motionButton.addEventListener('click', () => setMotionPaused(!isMotionPaused()));

const progress = document.createElement('div');
progress.className = 'atelier-progress';
progress.setAttribute('aria-hidden', 'true');
progress.innerHTML = '<i></i>';
document.body.append(progress);
const toTop = document.createElement('button');
toTop.type = 'button'; toTop.className = 'atelier-top'; toTop.hidden = true;
toTop.innerHTML = '<svg viewBox="0 0 40 40" aria-hidden="true"><circle class="top-track" cx="20" cy="20" r="17"/><circle class="top-progress" cx="20" cy="20" r="17" pathLength="100"/><path d="M14 22l6-6 6 6M20 16v12"/></svg>';
document.body.append(toTop);
toTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: canAnimate() ? 'smooth' : 'instant' });
  document.querySelector('.brand')?.focus({ preventScroll: true });
});
function renderControls() {
  const paused = isMotionPaused();
  const label = systemReducesMotion() ? c('已跟随系统减少动态效果', 'Motion reduced by your system preference')
    : c(paused ? '开启动效' : '暂停全站动效', paused ? 'Enable motion' : 'Pause site motion');
  motionButton.title = label;
  motionButton.setAttribute('aria-label', label);
  motionButton.setAttribute('aria-pressed', String(!paused));
  motionButton.disabled = systemReducesMotion();
  toTop.setAttribute('aria-label', c('回到顶部', 'Back to top'));
}
onMotionChange(renderControls); onLanguageChange(renderControls); renderControls();

// A consistent ending for long pages, with the same five destinations as the header.
const footer = document.querySelector('.site-footer');
if (footer) {
  const directory = document.createElement('nav'); directory.className = 'atelier-directory';
  const items = [['profile.html','Profile','关于我'],['gallery.html','Gallery','作品集'],['game.html','Game','游戏房间'],['now.html','Now','近况'],['posts.html','Posts','随笔'],['usage.html','Pulse','用量']];
  const page = location.pathname.split('/').at(-1);
  function renderDirectory() {
    directory.setAttribute('aria-label', c('浏览个人空间', 'Explore my space'));
    directory.innerHTML = '<div class="directory-label"><span>THE PERSONAL UNIVERSE</span><b>c<span>_</span></b></div>' + items.map(([path, en, zh], i) => `<a href="./${path}"${page === path ? ' aria-current="page"' : ''}><small>0${i + 1}</small><strong>${en}</strong><span>${c(zh, 'EXPLORE')} <i aria-hidden="true">↗</i></span></a>`).join('');
  }
  renderDirectory(); onLanguageChange(renderDirectory); footer.before(directory);
}

let scrollFrame = 0, lastPercent = -1;
function updateScroll() {
  scrollFrame = 0;
  const max = document.documentElement.scrollHeight - innerHeight;
  const ratio = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
  const percent = Math.round(ratio * 1000) / 10;
  if (percent !== lastPercent) {
    progress.style.setProperty('--read', ratio.toFixed(4));
    toTop.style.setProperty('--read-percent', String(percent)); lastPercent = percent;
  }
  toTop.hidden = scrollY < Math.max(650, innerHeight * .75);
  header?.classList.toggle('header-scrolled', scrollY > 18);
}
function scheduleScroll() { if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScroll); }
window.addEventListener('scroll', scheduleScroll, { passive: true });
window.addEventListener('resize', scheduleScroll, { passive: true });
document.addEventListener('load', scheduleScroll, true);
document.addEventListener('toggle', scheduleScroll, true);
updateScroll();

// Content remains visible without enhancement. Only below-fold content gets an entrance.
const revealed = new WeakSet(), scenes = new WeakSet(), surfaces = new WeakSet();
const revealSelector = '[data-reveal],.exhibit,.post-card,.article-chapter,.article-figure,.model-exhibit,.wis-observations>div,.wis-studio,.game-exhibit,.game-sources';
const sceneSelector = '.pulse-object,.identity-wrap,.curiosity-panel,.sport-visual,.interest-card,.music-feature,.device-card,.exhibit,.milestone-art,.post-art,.model-stage,.models-header,.wis-cover,.wis-fieldbook,.game-exhibit,.game-pass';
const surfaceSelector = '.identity-card,.curiosity-panel,.interest-card,.device-card,.music-feature,.post-card,.exhibit,.game-exhibit';
const revealObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  for (const entry of entries) if (entry.isIntersecting) {
    if (canAnimate()) entry.target.classList.add('atelier-arrive');
    revealObserver.unobserve(entry.target);
  }
}, { threshold: .035, rootMargin: '0px 0px -16px 0px' }) : null;
const sceneObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  for (const entry of entries) entry.target.classList.toggle('atelier-sleep', !entry.isIntersecting);
}, { rootMargin: '100px' }) : null;
function matching(container, selector) {
  return [...(container.matches?.(selector) ? [container] : []), ...container.querySelectorAll(selector)];
}
function enhance(container = document) {
  for (const element of matching(container, revealSelector)) {
    if (revealed.has(element)) continue; revealed.add(element);
    if (element.getBoundingClientRect().top > innerHeight * .92) revealObserver?.observe(element);
  }
  for (const element of matching(container, sceneSelector)) {
    if (scenes.has(element)) continue; scenes.add(element); sceneObserver?.observe(element);
  }
  for (const element of matching(container, surfaceSelector)) {
    if (surfaces.has(element)) continue; surfaces.add(element); element.classList.add('atelier-surface');
  }
  container.querySelectorAll('img:not([decoding])').forEach(img => { img.decoding = 'async'; });
  scheduleScroll();
}
enhance();
document.addEventListener('animationend', event => {
  if (event.animationName === 'atelier-arrival') event.target.classList.remove('atelier-arrive');
});
const mutation = new MutationObserver(records => {
  const added = records.flatMap(record => [...record.addedNodes]).filter(node => node.nodeType === Node.ELEMENT_NODE);
  for (const node of added) if (node.isConnected) enhance(node);
});
const main = document.querySelector('main');
if (main) mutation.observe(main, { childList: true, subtree: true });

// One pointer listener and one queued frame; no idle animation loop.
let pointerFrame = 0, pointerSurface = null, pointerPosition = null;
function clearSurface() {
  if (pointerSurface) {
    pointerSurface.style.removeProperty('--light-x'); pointerSurface.style.removeProperty('--light-y');
    pointerSurface.classList.remove('atelier-lit');
  }
  pointerSurface = null;
}
document.addEventListener('pointermove', event => {
  if (!canAnimate() || !finePointer.matches || event.pointerType === 'touch') return;
  const surface = event.target.closest?.('.atelier-surface');
  if (surface !== pointerSurface) { clearSurface(); pointerSurface = surface; }
  if (!surface) return;
  pointerPosition = [event.clientX, event.clientY];
  if (pointerFrame) return;
  pointerFrame = requestAnimationFrame(() => {
    pointerFrame = 0;
    if (!pointerSurface?.isConnected || !canAnimate()) return;
    const rect = pointerSurface.getBoundingClientRect();
    pointerSurface.style.setProperty('--light-x', `${((pointerPosition[0] - rect.left) / rect.width * 100).toFixed(1)}%`);
    pointerSurface.style.setProperty('--light-y', `${((pointerPosition[1] - rect.top) / rect.height * 100).toFixed(1)}%`);
    pointerSurface.classList.add('atelier-lit');
  });
}, { passive: true });
document.addEventListener('pointerleave', clearSurface);
onMotionChange(() => { if (!canAnimate()) clearSurface(); });

// Keep the active chapter visible without imposing another palette on an article.
let chapterObserver;
function observeChapters() {
  chapterObserver?.disconnect();
  const chapters = [...document.querySelectorAll('.article-chapter')];
  if (!chapters.length || !('IntersectionObserver' in window)) return;
  const active = new Set();
  chapterObserver = new IntersectionObserver(entries => {
    for (const entry of entries) entry.isIntersecting ? active.add(entry.target.id) : active.delete(entry.target.id);
    const first = chapters.find(chapter => active.has(chapter.id));
    if (!first) return;
    document.querySelectorAll('.article-index a').forEach(link => {
      if (link.getAttribute('href') === `#${first.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }, { rootMargin: '-22% 0px -48% 0px' });
  chapters.forEach(chapter => chapterObserver.observe(chapter));
}
observeChapters();
onLanguageChange(() => { queueMicrotask(() => { enhance(); observeChapters(); }); });
window.addEventListener('pageshow', () => { scheduleScroll(); renderControls(); });

// Load the scene layer after the shared frame has been constructed.
import('./atelier-scenes.js');
