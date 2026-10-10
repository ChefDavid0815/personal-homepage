import {dotAirNowArt} from './dot-air-art.js';
import './dot-air-globe.bundle.js';
function mount(){document.querySelectorAll('[data-dot-air-now]').forEach(node=>{if(!node.querySelector('[data-dot-air-globe]'))node.innerHTML=dotAirNowArt(node.dataset.dotAirNow);});document.dispatchEvent(new Event('dot-air:render'));}
mount();
