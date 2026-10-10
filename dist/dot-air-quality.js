/** Optional pure frame-pacing policy. Call from the application's ONE render loop. */
export function createQualityGovernor(options = {}) {
  const {
    targetFrameMs = 1000 / 60, windowMs = 2000, minSamples = 30,
    badWindows = 2, goodWindows = 4, cooldownMs = 8000,
    gapMs = 250, initialLevel = 'high', onChange = () => {},
  } = options;
  const levels = ['low', 'medium', 'high'];
  for (const [key, value] of Object.entries({ targetFrameMs, windowMs, minSamples,
    badWindows, goodWindows, gapMs })) {
    if (!Number.isFinite(value) || value <= 0) throw new TypeError(`${key} must be positive`);
  }
  if (!Number.isFinite(cooldownMs) || cooldownMs < 0 || !levels.includes(initialLevel)
      || typeof onChange !== 'function') throw new TypeError('Invalid quality options');
  let level = initialLevel, mode = 'auto', disposed = false;
  let previous = null, started = null, lastChange = -Infinity;
  let samples = [], bad = 0, good = 0, lastDecision = null;
  const reset = () => { previous = started = null; samples = []; bad = good = 0; };
  function snapshot() { return { level, mode, disposed, lastDecision }; }
  function change(next, reason, time, p95 = null) {
    if (next === level) return;
    const from = level;
    level = next;
    lastChange = time;
    bad = good = 0;
    lastDecision = { from, level, reason, timestamp: time, p95 };
    onChange({ ...lastDecision });
  }
  return {
    snapshot,
    reset,
    setMode(next, timestamp = 0) {
      if (disposed) return snapshot();
      if (!['auto', ...levels].includes(next) || !Number.isFinite(timestamp)) {
        throw new TypeError('Mode must be auto, low, medium or high; timestamp finite');
      }
      mode = next;
      reset();
      // Returning to auto begins a fresh cooldown in the caller's clock domain.
      lastChange = timestamp;
      if (next !== 'auto') change(next, 'manual', timestamp);
      return snapshot();
    },
    sample(timestamp, { active = true } = {}) {
      if (disposed) return snapshot();
      if (!Number.isFinite(timestamp)) throw new TypeError('Timestamp must be finite');
      if (!active || mode !== 'auto') { reset(); return snapshot(); }
      if (previous === null) { previous = started = timestamp; return snapshot(); }
      const dt = timestamp - previous;
      previous = timestamp;
      // Hidden tabs, debugger stops and clock reversal are not slow GPU samples.
      if (dt <= 0 || dt > gapMs) {
        reset(); previous = started = timestamp; return snapshot();
      }
      samples.push(dt);
      if (timestamp - started < windowMs) return snapshot();
      if (samples.length < minSamples) {
        samples = []; started = timestamp; bad = good = 0; return snapshot();
      }
      const ordered = [...samples].sort((a, b) => a - b);
      const p95 = ordered[Math.ceil(ordered.length * 0.95) - 1];
      samples = []; started = timestamp;
      const poor = p95 > targetFrameMs * 1.5;
      const healthy = p95 <= targetFrameMs * 1.12;
      bad = poor ? bad + 1 : 0;
      good = healthy ? good + 1 : 0;
      if (timestamp - lastChange < cooldownMs) return snapshot();
      const index = levels.indexOf(level);
      if (bad >= badWindows && index > 0) change(levels[index - 1], 'sustained-slow-frames', timestamp, p95);
      else if (good >= goodWindows && index < levels.length - 1) {
        change(levels[index + 1], 'sustained-headroom', timestamp, p95);
      }
      return snapshot();
    },
    destroy() { disposed = true; reset(); },
  };
}
