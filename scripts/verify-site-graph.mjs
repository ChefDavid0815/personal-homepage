import {readFile,writeFile} from 'node:fs/promises';
const graph=JSON.parse(await readFile('design/flow-route-graph.json','utf8'));
const base='http://127.0.0.1:4173/';
function pageKey(url){return url.pathname+(url.pathname==='/post.html'?'?article='+url.searchParams.get('article'):'');}
const pages=new Map(graph.map(page=>[pageKey(new URL(page.route,base)),page]));
const paths=new Set(),errors=[];let fragmentChecks=0,links=0;
for(const page of graph){for(const link of page.links){
  let url;try{url=new URL(link.href,new URL(page.route,base));}catch{errors.push({from:page.route,href:link.href,reason:'invalid URL'});continue;}
  if(!['http:','https:'].includes(url.protocol)||!['127.0.0.1','chefzc.dev','www.chefzc.dev'].includes(url.hostname))continue;
  links++;paths.add(url.pathname);
  const target=pages.get(pageKey(url));
  if(url.hash&&target){fragmentChecks++;let id;try{id=decodeURIComponent(url.hash.slice(1));}catch{id=url.hash.slice(1);}if(id&&!target.ids.includes(id))errors.push({from:page.route,href:link.href,reason:'missing target #'+id});}
}}
const queue=[...paths];const requests=[];
async function worker(){while(queue.length){const pathname=queue.shift();try{const response=await fetch(new URL(pathname,base),{method:'HEAD',signal:AbortSignal.timeout(10000)});requests.push({pathname,status:response.status});if(response.status!==200)errors.push({pathname,reason:'HTTP '+response.status});}catch(error){errors.push({pathname,reason:error.message});}}}
await Promise.all(Array.from({length:5},worker));
const report={pages:graph.length,internalLinks:links,fragmentChecks,paths:requests.length,errors};
await writeFile('design/flow-route-verification.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));process.exitCode=errors.length?1:0;
