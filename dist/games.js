import { getLanguage, onLanguageChange, t } from './i18n.js';
import { gameSnapshot } from './games-data.js';
import { f1Snapshot } from './games-f1-data.js';
import { isMotionPaused, setMotionPaused, systemReducesMotion, onMotionChange, canAnimate } from './motion-state.js';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
let paused = isMotionPaused();
let scene = 0;
let selectedF1Team = 'ferrari';
const f1Teams = {
  ferrari: {
    title: 'FERRARI SF-26', copy: 'game.f1FerrariCopy',
    link: 'https://www.formula1.com/en/latest/article/gallery-check-out-every-angle-of-ferraris-2026-f1-car.7HdOPtJJwN5VHJ8XAWVtuS.7HdOPtJJwN5VHJ8XAWVtuS',
  },
  mclaren: {
    title: 'McLAREN MCL40', copy: 'game.f1MclarenCopy',
    link: 'https://www.formula1.com/en/latest/article/gallery-take-a-look-at-every-angle-of-mclarens-2026-livery.7z5YtdHeuCJaX2XMxLWgMR',
  },
  mercedes: {
    title: 'MERCEDES W17', copy: 'game.f1MercedesCopy',
    link: 'https://www.formula1.com/en/latest/article/gallery-check-out-every-angle-of-mercedes-new-livery-for-2026.70sm6Znl139u64MesOt5Vf.70sm6Znl139u64MesOt5Vf',
  },
};
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
const f1Exhibit = document.querySelector('#f1-25');

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
function formatShortDate(iso) {
  if (!iso) return t('game.f1Unavailable');
  return new Intl.DateTimeFormat(getLanguage() === 'en' ? 'en-GB' : 'zh-CN', {
    timeZone: 'Asia/Dubai', year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(new Date(iso));
}
function formatClock(iso) {
  if (!iso) return '';
  return new Intl.DateTimeFormat(getLanguage() === 'en' ? 'en-GB' : 'zh-CN', {
    timeZone: 'Asia/Dubai', hour: '2-digit', minute: '2-digit', hour12: false,
  }).format(new Date(iso)) + ' UTC+4';
}
function updateF1Team(animate = false) {
  const team = f1Teams[selectedF1Team];
  f1Exhibit.dataset.team = selectedF1Team;
  document.querySelectorAll('[data-f1-team]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.f1Team === selectedF1Team));
  });
  const title = document.querySelector('#f1-focus-title');
  const copy = document.querySelector('#f1-focus-copy');
  title.textContent = team.title;
  copy.dataset.i18n = team.copy;
  copy.textContent = t(team.copy);
  document.querySelector('#f1-focus-link').href = team.link;
  if (animate && canAnimate()) {
    for (const element of [title, copy]) {
      element.getAnimations().forEach(animation => animation.cancel());
      element.animate([
        { opacity: .45, transform: 'translateX(18px)' },
        { opacity: 1, transform: 'translateX(0)' },
      ], { duration: 360, easing: 'cubic-bezier(.16,1,.3,1)' });
    }
  }
}
function updateF1Record() {
  const formatter = new Intl.NumberFormat(getLanguage() === 'en' ? 'en-GB' : 'zh-CN');
  for (const [selector, minutes] of [
    ['#f1-playtime', f1Snapshot.playtimeMinutes],
    ['#f1-recent', f1Snapshot.recentPlaytimeMinutes],
  ]) {
    document.querySelector(selector).textContent = Number.isFinite(minutes)
      ? t('game.timeValue', { hours: Math.floor(minutes / 60), minutes: minutes % 60 })
      : t('game.f1Unavailable');
  }
  document.querySelector('#f1-highlights').textContent = Number.isInteger(f1Snapshot.highlightReplays)
    ? formatter.format(f1Snapshot.highlightReplays) : t('game.f1Unavailable');
  const lastPlayed = document.querySelector('#f1-last-played');
  lastPlayed.textContent = formatShortDate(f1Snapshot.lastPlayedAt);
  if (f1Snapshot.lastPlayedAt) lastPlayed.dateTime = f1Snapshot.lastPlayedAt;
  document.querySelector('#f1-last-played-time').textContent = formatClock(f1Snapshot.lastPlayedAt);
  const latestSave = document.querySelector('#f1-save-date');
  latestSave.textContent = f1Snapshot.latestSaveAt ? formatDate(f1Snapshot.latestSaveAt) : t('game.f1NoSave');
  if (f1Snapshot.latestSaveAt) latestSave.dateTime = f1Snapshot.latestSaveAt;
  setTime('#f1-snapshot-checked', f1Snapshot.checkedAt);
  document.querySelector('#f1-data-asof').textContent = t('game.f1AsOf', { date: formatDate(f1Snapshot.checkedAt) });
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
  updateF1Record();
  updateF1Team();
  updateMotion();
}

document.querySelectorAll('[data-f1-team]').forEach(button => {
  button.addEventListener('click', () => {
    selectedF1Team = button.dataset.f1Team;
    updateF1Team(true);
  });
});
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
    if (entry.isIntersecting) entry.target.dataset.entered = 'true';
  }), { rootMargin: '100px' });
  document.querySelectorAll('.game-exhibit').forEach(element => observer.observe(element));
}
if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
  for (const exhibit of [f1Exhibit, fhExhibit, nbaExhibit]) {
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
