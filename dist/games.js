import { getLanguage, onLanguageChange, t } from './i18n.js';
import { gameSnapshot } from './games-data.js';
import { isMotionPaused, setMotionPaused, systemReducesMotion, onMotionChange } from './motion-state.js';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let paused = isMotionPaused();
let scene = 0;
const scenes = [
  { file: 'fh6-keyart.jpg', width: 3840, height: 2160 },
  { file: 'fh6-tokyo.webp', width: 1000, height: 563 },
  { file: 'fh6-drive.webp', width: 1000, height: 563 },
];
const body = document.body;
const motionButton = document.querySelector('#game-motion');
const fhImage = document.querySelector('#fh-scene-image');
const fhExhibit = document.querySelector('#forza-horizon-6');
const nbaExhibit = document.querySelector('#nba-2k27');

function formatDate(iso) {
  if (!iso) return '';
  return new Intl.DateTimeFormat(getLanguage() === 'en' ? 'en-GB' : 'zh-CN', {
    timeZone: 'Asia/Dubai', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(new Date(iso)) + ' · UTC+4';
}
function setTime(selector, iso) {
  const element = document.querySelector(selector);
  element.textContent = formatDate(iso);
  if (iso) element.dateTime = iso;
}
function updateMotion() {
  motionButton.disabled = systemReducesMotion();
  body.dataset.motion = paused || document.hidden ? 'off' : 'on';
  motionButton.setAttribute('aria-pressed', String(paused));
  document.querySelector('#motion-text').textContent = t(paused ? 'game.resume' : 'game.pause');
  motionButton.querySelector('.motion-icon').textContent = paused ? '▷' : 'Ⅱ';
}
function updateLanguage() {
  document.title = t('game.title');
  document.querySelector('meta[name="description"]').content = t('game.meta');
  const formatter = new Intl.NumberFormat(getLanguage() === 'en' ? 'en-GB' : 'zh-CN');
  document.querySelectorAll('[data-metric]').forEach(element => {
    const [game, key] = element.dataset.metric.split('.');
    const value = gameSnapshot[game]?.[key];
    // Unknown values have no public tile. Never coerce null to a numeric zero.
    if (Number.isFinite(value)) element.textContent = formatter.format(value);
  });
  for (const [selector, value] of [
    ['#nba-playtime', gameSnapshot.nba2k27.playtimeMinutes],
    ['#nba-recent', gameSnapshot.nba2k27.recentPlaytimeMinutes],
  ]) {
    const element = document.querySelector(selector);
    if (Number.isFinite(value)) element.textContent = t('game.timeValue', { hours: Math.floor(value / 60), minutes: value % 60 });
    else element.closest('div').hidden = true;
  }
  setTime('#fh-save-date', gameSnapshot.fh6.latestSaveAt);
  setTime('#nba-save-date', gameSnapshot.nba2k27.latestSaveAt);
  setTime('#snapshot-checked', gameSnapshot.checkedAt);
  document.querySelector('#fh-snapshot-date').textContent = t('game.fhDate', { date: formatDate(gameSnapshot.fh6.snapshotExtractedAt) });
  fhImage.alt = t(`game.fhAlt${scene}`);
  updateMotion();
}

document.querySelectorAll('[data-scene-choice]').forEach(button => {
  button.addEventListener('click', () => {
    scene = Number(button.dataset.sceneChoice);
    const next = scenes[scene];
    fhImage.src = `./assets/games/${next.file}`;
    fhImage.width = next.width;
    fhImage.height = next.height;
    fhImage.alt = t(`game.fhAlt${scene}`);
    fhExhibit.dataset.scene = String(scene);
    document.querySelector('#fh-scene-number').textContent = `FRAME / 0${scene + 1}`;
    document.querySelectorAll('[data-scene-choice]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  });
});
document.querySelectorAll('[data-light-choice]').forEach(button => {
  button.addEventListener('click', () => {
    nbaExhibit.dataset.light = button.dataset.lightChoice;
    document.querySelectorAll('[data-light-choice]').forEach(item => item.setAttribute('aria-pressed', String(item === button)));
  });
});
motionButton.addEventListener('click', () => setMotionPaused(!paused));
onMotionChange(value => { paused = value; updateMotion(); });
document.addEventListener('visibilitychange', updateMotion);

// Offscreen art sleeps; no continuous JavaScript render loop or remote trackers.
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    entry.target.dataset.offscreen = String(!entry.isIntersecting);
  }), { rootMargin: '100px' });
  document.querySelectorAll('.game-exhibit').forEach(element => observer.observe(element));
}
if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
  for (const exhibit of [fhExhibit, nbaExhibit]) {
    let frame = 0;
    exhibit.addEventListener('pointermove', event => {
      if (paused || reducedMotion.matches || frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const rect = exhibit.getBoundingClientRect();
        exhibit.style.setProperty('--mx', ((event.clientX - rect.left) / rect.width - .5).toFixed(3));
        exhibit.style.setProperty('--my', ((event.clientY - rect.top) / rect.height - .5).toFixed(3));
      });
    });
    exhibit.addEventListener('pointerleave', () => {
      cancelAnimationFrame(frame); frame = 0;
      exhibit.style.setProperty('--mx', '0'); exhibit.style.setProperty('--my', '0');
    });
  }
}
onLanguageChange(updateLanguage);
updateLanguage();
