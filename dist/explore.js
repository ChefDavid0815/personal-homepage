import {projects} from './projects.js';
import {posts} from './posts-data.js';
import {getLanguage,onLanguageChange} from './i18n.js';
import {buildCatalog,filterCatalog} from './site-catalog.js';
import './site-navigation.js';
const root=document.querySelector('#flow-index');
const catalog=buildCatalog(projects,posts);const params=new URLSearchParams(location.search);
let query=(params.get('q')||'').slice(0,200),group=['all','pages','works','notes'].includes(params.get('type'))?params.get('type'):'all';
const c=(zh,en)=>getLanguage()==='en'?en:zh;
const esc=value=>String(value).replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const groupCopy={pages:['个人空间','Spaces'],works:['作品与实验','Works & experiments'],notes:['随笔与记录','Notes & journals']};
// Dates are shown as 2026.09.30 but stored as 2026-09-30: accept what the reader sees (dots or slashes).
const searchable=text=>text.replace(/(\d{4})[./](\d{1,2})(?:[./](\d{1,2}))?/g,(match,year,month,day)=>[year,month.padStart(2,'0'),day&&day.padStart(2,'0')].filter(Boolean).join('-'));
function renderResults(){
  const results=filterCatalog(catalog,{query:searchable(query),group});const language=getLanguage()==='en'?1:0;
  const columns=Object.entries(groupCopy).map(([key,names])=>{const items=results.filter(item=>item.group===key);return items.length?`<section class="flow-index-stream flow-index-stream--${key}"><div class="flow-stream-heading"><h2>${esc(names[language])}</h2><span>${String(items.length).padStart(2,'0')}</span></div>${items.map(item=>{const date=key==='notes'&&/^\d{4}-\d{2}-\d{2}$/.test(item.tags?.[0]||'')?item.tags[0]:'';return `<a class="flow-destination" href="${esc(item.href)}">${date?`<time datetime="${esc(date)}">${esc(date.replaceAll('-','.'))}</time>`:''}<h3>${esc(item.title[language])}</h3><p>${esc(item.description[language])}</p><svg class="ic flow-destination-arrow" aria-hidden="true"><use href="./assets/flow/current-icons.svg#arrow-up-right"></use></svg></a>`;}).join('')}</section>`:'';}).join('');
  // Empty state: when a type filter hides matches that exist elsewhere, say so and offer the way out.
  const elsewhere=!results.length&&group!=='all'&&query?filterCatalog(catalog,{query:searchable(query),group:'all'}).length:0;
  root.querySelector('#flow-results').innerHTML=columns||`<div class="flow-index-empty"><h2>${c('这条流，暂时没有找到。','No destination on this stream yet.')}</h2><p>${elsewhere?c(`其他类型里有 ${elsewhere} 个结果。`,`${elsewhere} ${elsewhere===1?'match':'matches'} in other types.`):c('试试一个作品名、关键词或日期。','Try a project name, a keyword or a date.')}</p><div class="flow-index-empty-actions">${elsewhere?`<button type="button" data-index-group="all">${c('查看全部类型','Show all types')}</button>`:''}<button type="button" data-clear-index>${c('清空搜索','Clear search')}</button></div></div>`;
  root.querySelector('#flow-result-count').textContent=c(`${results.length} 个入口 / 共 ${catalog.length} 个`,`${results.length} destinations / ${catalog.length} total`);
  root.querySelectorAll('[data-index-group]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.indexGroup===group)));
}
function reflectUrl(){const url=new URL(location.href);query?url.searchParams.set('q',query):url.searchParams.delete('q');group==='all'?url.searchParams.delete('type'):url.searchParams.set('type',group);history.replaceState(history.state,'',url);}
function render(){
  document.title=c('流域索引 — ChefZC','Flow index — ChefZC');
  root.innerHTML=`<header class="flow-index-hero"><h1>${c('川流的<br><span>方向。</span>','FIND YOUR<br><span>FLOW.</span>')}</h1><p class="flow-index-intro">${c('从热爱到作品，从作品到记录。<br>每一条流，都有来处与去向。','From passion to projects. From projects to notes.<br>Every stream has an origin, and somewhere to go.')}</p><p class="flow-index-meta">ChefZC / Everything in flow</p><svg class="flow-index-map" viewBox="0 0 560 350" aria-hidden="true"><path class="index-river-yellow" d="M280 175C140 -35 20 0 20 175C20 350 140 385 280 175C420 -35 540 0 540 175C540 350 420 385 280 175Z"/><path class="index-river-pink" d="M70 320C350 320 390 60 550 60"/><path class="index-river-blue" d="M280 175C140 -35 20 0 20 175C20 350 140 385 280 175C420 -35 540 0 540 175C540 350 420 385 280 175Z"/></svg></header><section class="flow-index-controls" aria-label="${c('入口搜索','Destination search')}"><label class="flow-index-search" for="flow-search"><svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.6-3.6"/></svg><input type="search" id="flow-search" maxlength="200" autocomplete="off" value="${esc(query)}" placeholder="${c('搜索作品、随笔、关键词…','Search work, notes, keywords…')}" aria-label="${c('搜索网站入口','Search site destinations')}"></label><div class="flow-index-filters" role="group" aria-label="${c('入口类型','Destination type')}">${[['all','全部','All'],['pages','空间','Spaces'],['works','作品','Works'],['notes','随笔','Notes']].map(([key,zh,en])=>`<button type="button" data-index-group="${key}" aria-pressed="${group===key}">${c(zh,en)}</button>`).join('')}</div><p id="flow-result-count" role="status" aria-live="polite"></p></section><div id="flow-results" class="flow-index-results"></div>`;
  renderResults();
}
root.addEventListener('input',event=>{if(event.target.id==='flow-search'){query=event.target.value;renderResults();reflectUrl();}});
root.addEventListener('click',event=>{const filter=event.target.closest('[data-index-group]');if(filter){group=filter.dataset.indexGroup;renderResults();reflectUrl();if(!filter.isConnected)root.querySelector(`.flow-index-filters [data-index-group="${group}"]`)?.focus();}if(event.target.closest('[data-clear-index]')){query='';group='all';root.querySelector('#flow-search').value='';renderResults();reflectUrl();root.querySelector('#flow-search').focus();}});
render();onLanguageChange(render);
