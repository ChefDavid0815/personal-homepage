import {onLanguageChange} from './i18n.js';
import {ac,aerNowArt} from './aer-art.js';
import './aer-motion.js';
function render(){
  const miniature=document.querySelector('[data-aer-now]');
  if(miniature){miniature.innerHTML=aerNowArt();miniature.setAttribute('aria-label',ac('打开 AER 玻璃展柜','Open the AER optical-glass exhibit'));}
  document.dispatchEvent(new Event('aer:render'));
}
render();onLanguageChange(render);
