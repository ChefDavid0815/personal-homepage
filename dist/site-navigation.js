import {getLanguage,onLanguageChange} from './i18n.js';
import {projects} from './projects.js';
import {routeFor,routeTrail,collectionDestinations,articleReturnHref} from './site-routes.js';
const c=pair=>pair[getLanguage()==='en'?1:0];
const esc=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
function renderBreadcrumb(){
  const trail=routeTrail(location.href);if(trail.length<2)return;
  let breadcrumb=document.querySelector('.flow-breadcrumb');
  if(!breadcrumb){breadcrumb=document.querySelector('.nerf-breadcrumb')||document.createElement('nav');const meta=breadcrumb.querySelector('span')?.textContent;if(meta)breadcrumb.dataset.originalMeta=meta;breadcrumb.classList.add('flow-breadcrumb');if(!breadcrumb.isConnected)document.querySelector('main')?.prepend(breadcrumb);}
  const signature=trail.map(r=>r.id).join('/')+getLanguage();if(breadcrumb.dataset.trail===signature)return;breadcrumb.dataset.trail=signature;
  breadcrumb.setAttribute('aria-label',c(['页面位置','Page location']));
  breadcrumb.innerHTML=trail.map((route,index)=>index===trail.length-1?`<span aria-current="page">${esc(c(route.label))}</span>`:`<a href="./${route.file}">${esc(c(route.label))}</a><i aria-hidden="true">/</i>`).join('');
  if(breadcrumb.dataset.originalMeta)breadcrumb.insertAdjacentHTML('beforeend','<span class="flow-breadcrumb-meta">'+esc(breadcrumb.dataset.originalMeta)+'</span>');
}
function enhance(){
  const current=routeFor(location.href);
  const pageHero=document.querySelector('.gallery-header,.posts-heading,.school-header,.models-header,.now-header,.usage-hero');
  if(pageHero&&!pageHero.querySelector('.flow-stream-signature')){const signature=document.createElement('div');signature.className='flow-stream-signature';signature.innerHTML='<svg viewBox="0 0 84 50" aria-hidden="true"><path d="M42 25C22 -5 3 0 3 25S22 55 42 25 81 -5 81 25 62 55 42 25Z"/></svg><span>川流不息</span><small>EVERYTHING IN FLOW</small>';pageHero.prepend(signature);}
  document.querySelectorAll('.page-nav a').forEach(link=>{const route=routeFor(link.href);if(route?.id===current?.section)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
  const tools=document.querySelector('.header-tools,.aer-landing-top');
  if(tools&&!tools.querySelector('[data-site-index]')){const link=document.createElement('a');link.href='./explore.html';link.className='flow-index-link';link.dataset.siteIndex='';link.textContent='∞';tools.append(link);}
  document.querySelectorAll('[data-site-index]').forEach(link=>{link.setAttribute('aria-label',c(['流域索引：浏览全部入口','Flow index: browse every destination']));link.title=c(['流域索引','Flow index']);});
  document.querySelectorAll('[data-site-index]').forEach(link=>{if(current?.id==='explore')link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
  const footer=document.querySelector('.site-footer,.aer-landing-footer');
  if(footer&&!footer.querySelector('.flow-footer-index')){const link=document.createElement('a');link.href='./explore.html';link.className='flow-footer-index';footer.append(link);}
  const footerLink=document.querySelector('.flow-footer-index');if(footerLink){const text=c(['流域索引 ↗','Flow index ↗']);if(footerLink.textContent!==text)footerLink.textContent=text;}
  for(const nav of document.querySelectorAll('.collection-navigation')){
    const destinations=collectionDestinations(projects.length);
    if(!nav.dataset.flowRooms){const label=nav.querySelector('.gallery-room-label');nav.replaceChildren();if(label)nav.append(label);destinations.forEach(room=>{const link=document.createElement('a');link.dataset.roomId=room.id;link.href=room.href;link.innerHTML='<span></span><small></small>';nav.append(link);});nav.dataset.flowRooms='ready';}
    destinations.forEach((room,index)=>{const link=nav.querySelector(`[data-room-id="${room.id}"]`);const label=link.querySelector(':scope > span');const count=link.querySelector(':scope > small');const value=`${String(index+1).padStart(2,'0')} / ${String(room.count).padStart(2,'0')}`;if(label.textContent!==c(room.label))label.textContent=c(room.label);if(count.textContent!==value)count.textContent=value;const living=current?.id==='gallery'&&location.hash==='#living-sites';const active=room.id==='live'?living:room.id==='main'?current?.id==='gallery'&&!living:room.id===current?.id;if(active)link.setAttribute('aria-current','page');else link.removeAttribute('aria-current');});
  }
  const bridge=document.querySelector('.bridge-note');
  if(bridge){const raw=bridge.textContent;if(getLanguage()==='zh'&&raw.includes('八件作品'))bridge.textContent=raw.replace('八件作品',(['零','一','二','三','四','五','六','七','八','九','十'][projects.length]||String(projects.length))+'件作品').replace('展厅里还有 Roseraie','展厅里还有 DOT/AIR、Roseraie');if(getLanguage()==='en'&&raw.includes('Eight projects'))bridge.textContent=raw.replace('Eight projects',String(projects.length)+' projects').replace('The gallery also holds Roseraie','The gallery also holds DOT/AIR, Roseraie');}
  const article=new URLSearchParams(location.search).get('article');
  if(current?.id==='post'&&article&&/^[-\w]{1,100}$/.test(article)){const back=document.querySelector('.reader-topline a');if(back)back.setAttribute('href',articleReturnHref(article));}
  renderBreadcrumb();
}
enhance();
const observer=new MutationObserver(()=>{enhance();});const main=document.querySelector('main');if(main)observer.observe(main,{childList:true,subtree:true});
onLanguageChange(()=>queueMicrotask(enhance));
window.addEventListener('popstate',enhance);
window.addEventListener('hashchange',enhance);
window.addEventListener('pagehide',event=>{if(!event.persisted)observer.disconnect();});
