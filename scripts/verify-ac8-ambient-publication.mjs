import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const base='https://chefzc.dev/';
const current=JSON.parse(await readFile('design/ac8-ambient-code-manifest.json','utf8'));
const before=JSON.parse(await readFile('design/ac8-code-manifest.json','utf8'));
const queue=Object.entries(current.files).filter(([p,hash])=>p.slice(5).split('/').length===1||p.startsWith('dist/assets/games/ac8/')||before.files[p]!==hash);
const checks=[],errors=[];
async function worker(){while(queue.length){const[file,expected]=queue.shift();try{const response=await fetch(new URL(file.slice(5),base),{signal:AbortSignal.timeout(25000)});if(!response.ok)throw Error('HTTP '+response.status);const actual=createHash('sha256').update(Buffer.from(await response.arrayBuffer())).digest('hex');checks.push({file,match:actual===expected});if(actual!==expected)errors.push({file,expected,actual});}catch(error){errors.push({file,error:error.message});}}}
await Promise.all(Array.from({length:6},worker));
const response=await fetch(new URL('api/ac8-record',base),{cache:'no-store',signal:AbortSignal.timeout(20000)});
const record=await response.json();if(!response.ok||record.appId!==2288340||record.scope!=='steam-local')errors.push({api:'AC8 record not synchronized',status:response.status});
const unauthorized=await fetch(new URL('api/ac8-record',base),{method:'POST',headers:{Authorization:'Bearer invalid-check-key','Content-Type':'application/json'},body:'{}',signal:AbortSignal.timeout(20000)});
if(unauthorized.status!==401)errors.push({api:'Unauthorized write not rejected',status:unauthorized.status});
await writeFile('design/ac8-ambient-production-http.json',JSON.stringify({base,sourceFingerprint:current.fingerprint,files:checks.length,checks,record,unauthorizedStatus:unauthorized.status,errors},null,2)+'\n');
console.log(JSON.stringify({files:checks.length,playtimeMinutes:record.playtimeMinutes,unauthorizedStatus:unauthorized.status,errors},null,2));process.exitCode=errors.length?1:0;
