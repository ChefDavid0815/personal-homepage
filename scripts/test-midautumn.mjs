import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import { posts } from '../dist/posts-data.js';

const source = await readFile(new URL('../dist/midautumn-season.js', import.meta.url), 'utf8');

function seasonAt(instant) {
  let current = Date.parse(instant);
  let interval;
  const attributes = {};
  const html = {
    lang: 'zh-CN', dataset: {},
    removeAttribute(name) {
      if (name === 'data-midautumn') delete this.dataset.midautumn;
      delete attributes[name];
    }
  };
  const theme = { content: '#101112' };
  const document = {
    documentElement: html, body: null, readyState: 'loading',
    querySelector: selector => selector === 'meta[name="theme-color"]' ? theme : null,
    querySelectorAll: () => [], addEventListener: () => {}
  };
  class ClockDate extends Date {
    constructor(...args) { super(...(args.length ? args : [current])); }
    static now() { return current; }
  }
  const window = { setInterval: callback => { interval = callback; } };
  class MutationObserver { observe() {} }
  runInNewContext(source, { document, window, Date: ClockDate, Intl, MutationObserver, Event });
  return {
    html, theme, schedule: window.ChefZCSeason,
    advance(instantToUse) { current = Date.parse(instantToUse); interval(); }
  };
}

test('the one-day skin follows Dubai time, including both midnight boundaries', () => {
  const state = seasonAt('2026-09-24T19:59:59Z');
  assert.equal(state.html.dataset.midautumn, undefined);
  assert.equal(state.schedule.isActive(new Date('2026-09-24T19:59:59Z')), false);
  state.advance('2026-09-24T20:00:00Z');
  assert.equal(state.html.dataset.midautumn, 'on');
  assert.equal(state.theme.content, '#0b1126');
  assert.equal(state.schedule.isActive(new Date('2026-09-25T19:59:59Z')), true);
  state.advance('2026-09-25T20:00:00Z');
  assert.equal(state.html.dataset.midautumn, undefined);
  assert.equal(state.theme.content, '#101112');
});

test('the festival note stays first and has full copy in both languages', () => {
  assert.equal(posts[0].id, 'midautumn');
  assert.equal(posts[0].zh.title, '欢度中秋佳节');
  assert.equal(posts[0].en.title, 'Happy Mid-Autumn Festival');
  for (const language of ['zh', 'en']) {
    assert.equal(posts[0][language].sections.length, 3);
    assert.ok(posts[0][language].sections.every(section => section.paragraphs.length >= 2));
  }
});
