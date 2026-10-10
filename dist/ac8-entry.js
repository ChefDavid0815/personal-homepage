import {ac8Exhibit} from './ac8-art.js';
import {t} from './i18n.js';
const root=document.querySelector('#ac8-exhibit-root');
if(root){root.innerHTML=ac8Exhibit();root.querySelectorAll('[data-i18n]').forEach(node=>node.textContent=t(node.dataset.i18n));root.querySelectorAll('[data-i18n-label]').forEach(node=>node.setAttribute('aria-label',t(node.dataset.i18nLabel)));root.querySelectorAll('[data-i18n-alt]').forEach(node=>node.alt=t(node.dataset.i18nAlt));await import('./ac8-motion.js');await import('./ac8-records.js');}
