import {onLanguageChange} from './i18n.js';
import {roseraieNowArt} from './roseraie-exhibit-v2.js';
const render=()=>{document.querySelectorAll('[data-roseraie-now]').forEach(host=>{host.outerHTML=roseraieNowArt(host.dataset.roseraieNow)});document.dispatchEvent(new Event('roseraie:render'));};
render();onLanguageChange(render);
