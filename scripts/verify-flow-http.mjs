import {readFile,readdir,writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=fileURLToPath(new URL('../',import.meta.url));
const base='http://127.0.0.1:4173/';const urls=new Set();
for(const name of await readdir(path.join(root,'dist'))){
  if(!name.endsWith('.html'))continue;
  urls.add(new URL(name,base).href);
  const source=await readFile(path.join(root,'dist',name),'utf8');
  for(const match of source.matchAll(/(?:href|src)="([^\"]+)"/g)){
    if(/^(data:|mailto:|https?:|#)/.test(match[1]))continue;
    urls.add(new URL(match[1],new URL(name,base)).href.split('#')[0]);
  }
}
urls.add(base+'when-to-reset/');urls.add(base+'reset-history/');
const results=[];const queue=[...urls];
async function worker(){while(queue.length){const url=queue.shift();try{const response=await fetch(url,{method:'HEAD',signal:AbortSignal.timeout(10000)});results.push({path:new URL(url).pathname,status:response.status});}catch(error){results.push({path:new URL(url).pathname,error:error.message});}}}
await Promise.all(Array.from({length:6},worker));
const errors=results.filter(r=>r.error||r.status!==200);const report={checked:results.length,errors,results};
await writeFile(path.join(root,'design/flow-http-verification.json'),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({checked:results.length,errors},null,2));process.exitCode=errors.length?1:0;
