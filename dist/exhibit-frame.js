// Shared frame for the six project rooms (CHROMA, ProjectLens, Festival Toolkit, AXIOM, Folio, NBA After Hours).
// Every room keeps its own world; the title, the spec list and the actions always sit in the same place.
import { getLanguage } from './i18n.js';

export const c = (zh, en) => getLanguage() === 'en' ? en : zh;
export const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

export const icon = name => `<svg class="ic" aria-hidden="true" focusable="false"><use href="./assets/flow/current-icons.svg#${name}"></use></svg>`;
export const plusIcon = '<svg class="ic" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>';

// Bilingual labels introduced by the redesigned frame.
export const label = {
  exhibit: () => c('展品', 'Exhibit'),
  category: () => c('类别', 'Category'),
  version: () => c('版本', 'Version'),
  platform: () => c('平台', 'Platform'),
  stack: () => c('技术', 'Built with'),
  status: () => c('状态', 'Status'),
  history: () => c('版本档案', 'Release history'),
  open: () => c('展开', 'Open'),
  close: () => c('收起', 'Close')
};

// Strip a trailing Unicode arrow from an existing string so a drawn icon can stand in for it.
export const bare = text => String(text).replace(/\s*[↗↓→＋+]\s*$/u, '');

export function specList(rows) {
  return `<dl class="xr-spec">${rows.filter(Boolean).map(([term, value, cls = '']) => `<div${cls ? ` class="${cls}"` : ''}><dt>${term}</dt><dd>${value}</dd></div>`).join('')}</dl>`;
}

export const tagLine = tags => (tags || []).map(esc).join('<i aria-hidden="true">·</i>');

// One title voice: the name in Cesso, the exhibit number set small beside it.
export function roomTitle(name, number, { tag = 'h3', id = '' } = {}) {
  return `<${tag} class="xr-title"${id ? ` id="${id}"` : ''}><span class="xr-name">${name}</span><span class="xr-no" aria-hidden="true">${esc(number)}</span></${tag}>`;
}

export function linkButton({ href, text, iconName = 'arrow-up-right', primary = false, external = true, cls = '' }) {
  if (!href) return '';
  return `<a class="xr-btn${primary ? ' xr-btn--primary' : ''}${cls ? ' ' + cls : ''}" href="${esc(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ''}><span>${text}</span>${icon(iconName)}</a>`;
}

export function insideButton(projectId, text, aria) {
  return `<button type="button" class="xr-btn xr-btn--inside" data-project="${esc(projectId)}"${aria ? ` aria-label="${esc(aria)}"` : ''}><span>${text}</span>${plusIcon}</button>`;
}
