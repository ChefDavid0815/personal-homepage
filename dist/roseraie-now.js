import {onLanguageChange} from './i18n.js';
import {roseraieNowArt} from './roseraie-exhibit.js';
const render=()=>{const host=document.querySelector('[data-roseraie-now]');if(host)host.outerHTML=roseraieNowArt().replace('class="milestone-art rose-now-art"','class="milestone-art rose-now-art" data-roseraie-now');document.dispatchEvent(new Event('roseraie:render'));};
render();onLanguageChange(render);
