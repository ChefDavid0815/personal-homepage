import {readFile,writeFile,readdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
import {transform} from 'esbuild';
const root=fileURLToPath(new URL('../',import.meta.url));
const dist=path.join(root,'dist');
const contractPath=path.join(root,'design/flow-styles.json');
let contract;
try{contract=JSON.parse(await readFile(contractPath,'utf8'));}catch{contract={};}
const tag=/<link\b[^>]*rel="stylesheet"[^>]*>/g;
for(const name of await readdir(dist)){
  if(!name.endsWith('.html')||name==='index.html')continue;
  const file=path.join(dist,name);let html=await readFile(file,'utf8');
  const tags=[...html.matchAll(tag)].map(m=>m[0]);
  const sources=tags.filter(t=>!t.includes('data-project-style')).map(t=>t.match(/href="([^\"]+)"/)?.[1]).filter(s=>s&&!s.includes('flow')&&!s.endsWith('site-navigation.css'));
  if(sources.length)contract[name]=sources;
  if(!contract[name])continue;
  const styles=await Promise.all(contract[name].map(source=>readFile(path.resolve(dist,source),'utf8')));
  // Legacy specificity is contained in one layer. Flow is the unlayered authority.
  const combined='@layer legacy {\n'+styles.join('\n')+'\n}';
  const built=await transform(combined,{loader:'css',minify:true,target:'chrome110'});
  const bundle=`flow-legacy-${name.replace('.html','')}.css`;
  await writeFile(path.join(dist,bundle),built.code);
  let first=true;
  html=html.replace(tag,t=>{
    // Current 2.x layers (flow-current, flow-home, flow-room-*) stay as their own unlayered links after the legacy bundle.
    if((t.includes('flow')&&!t.includes('flow-legacy'))||t.includes('site-navigation.css')||t.includes('data-project-style'))return t;
    if(!first)return '';first=false;return `<link rel="stylesheet" href="./${bundle}">`;
  });
  await writeFile(file,html.replace(/[\t ]+$/gm,'').replace(/\r\n/g,'\n'));
}
await writeFile(contractPath,JSON.stringify(contract,null,2)+'\n');
await transform(await readFile(path.join(dist,'flow.css'),'utf8'),{loader:'css',target:'chrome110'});
await transform(await readFile(path.join(dist,'site-navigation.css'),'utf8'),{loader:'css',target:'chrome110'});
await transform(await readFile(path.join(dist,'nabat.css'),'utf8'),{loader:'css',target:'chrome110'});
await transform(await readFile(path.join(dist,'dot-air.css'),'utf8'),{loader:'css',target:'chrome110'});
await transform(await readFile(path.join(dist,'ac8.css'),'utf8'),{loader:'css',target:'chrome110'});
console.log(`Built ${Object.keys(contract).length} scoped legacy bundles; Flow stylesheet validated.`);
