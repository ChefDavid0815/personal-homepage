import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const base=process.argv[2]||'https://chefzc.dev/';
const current=JSON.parse(await readFile('design/dot-air-code-manifest.json','utf8'));
const before=JSON.parse(await readFile('design/nabat-code-manifest.json','utf8'));
const queue=Object.entries(current.files).filter(([file,hash])=>file.slice(5).split('/').length===1||file.startsWith('dist/assets/projects/dot-air/')||before.files[file]!==hash);
const checks=[],errors=[];
async function worker(){while(queue.length){const [file,expected]=queue.shift();try{
  const response=await fetch(new URL(file.slice(5),base),{signal:AbortSignal.timeout(25000)});
  if(!response.ok)throw new Error('HTTP '+response.status);
  const actual=createHash('sha256').update(Buffer.from(await response.arrayBuffer())).digest('hex');
  checks.push({file,match:actual===expected});if(actual!==expected)errors.push({file,expected,actual});
}catch(error){errors.push({file,error:error.message});}}}
await Promise.all(Array.from({length:6},worker));
for(const file of ['aer-content.js','aer-post.js','assets/projects/aer/cover-v11.png']){
  try{const response=await fetch(new URL(file,base),{signal:AbortSignal.timeout(20000)});checks.push({retired:file,status:response.status});if(response.status!==404)errors.push({retired:file,expected:404,actual:response.status});}
  catch(error){errors.push({retired:file,error:error.message});}
}
const report={base,sourceFingerprint:current.fingerprint,sourceFiles:Object.keys(current.files).length,verifiedPublicFiles:checks.length,selection:'All root runtime files, all Dot Air assets and every added/changed dist file since the NABAT release; retired AER resources must return 404.',checks,errors};
await writeFile('design/dot-air-production-http-verification.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({base,verifiedPublicFiles:checks.length,errors},null,2));process.exitCode=errors.length?1:0;
