import { t, onLanguageChange } from './i18n.js';
function renderCopy(){document.querySelectorAll('[data-model-html]').forEach(el=>el.innerHTML=t(el.dataset.modelHtml));}
renderCopy();onLanguageChange(renderCopy);
const tabs=[...document.querySelectorAll('[data-view]')];
function selectView(tab, focus=false){
 tabs.forEach(item=>{const selected=item===tab;item.setAttribute('aria-selected',String(selected));item.tabIndex=selected?0:-1;document.getElementById(item.getAttribute('aria-controls')).hidden=!selected;});
 if(focus)tab.focus();
}
tabs.forEach((tab,index)=>{tab.addEventListener('click',()=>selectView(tab));tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight'||event.key==='ArrowLeft')next=tabs[1-index];if(event.key==='Home')next=tabs[0];if(event.key==='End')next=tabs.at(-1);if(next){event.preventDefault();selectView(next,true);}});});
if(location.hash==='#model-exterior')selectView(tabs[1]);
import('./model-viewer.bundle.js').catch(()=>{document.querySelectorAll('.model-status').forEach(el=>el.textContent='3D unavailable / 请查看模型渲染图');});
