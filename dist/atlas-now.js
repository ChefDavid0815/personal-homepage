import {atlasNowArt} from './atlas-exhibit-v2.js';
document.querySelectorAll('[data-atlas-now]').forEach(element=>{element.outerHTML=atlasNowArt()});
document.dispatchEvent(new Event('atlas:render'));
