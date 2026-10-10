import {readFile,writeFile,stat,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {parseAc8Vdf,validateAc8Record} from '../lib/ac8-record-schema.js';
const ownRoot=fileURLToPath(new URL('../',import.meta.url));
const configFile=process.env.AC8_SYNC_CONFIG||path.join(process.env.LOCALAPPDATA||'','ChefZC','SteamSync','config.json');
const once=process.argv.includes('--once'),snapshotOnly=process.argv.includes('--snapshot-only');
const sha=data=>createHash('sha256').update(data).digest('hex');
export async function readAc8Snapshot(source,now=Date.now()){
 const before=await readFile(source);const info=await stat(source);const fields=parseAc8Vdf(before.toString('utf8'));const after=await readFile(source);
 if(sha(before)!==sha(after))throw Error('Steam updated its record during inspection');
 return validateAc8Record({version:1,appId:2288340,scope:'steam-local',collectedAt:new Date(now).toISOString(),sourceUpdatedAt:info.mtime.toISOString(),...fields},now);
}
function unprotect(file){
 // The command line contains only our private config path; the key stays in memory.
 return execFileSync('powershell.exe',['-NoProfile','-NonInteractive','-File',fileURLToPath(new URL('./ac8-unprotect.ps1',import.meta.url)),'-ConfigPath',file],{encoding:'utf8',windowsHide:true,stdio:['ignore','pipe','pipe']}).trim();
}
async function main(){
 const directory=path.dirname(configFile);await mkdir(directory,{recursive:true});
 const settings=snapshotOnly?{source:'E:/Steam/userdata/796657407/config/localconfig.vdf'}:JSON.parse((await readFile(configFile,'utf8')).replace(/^\uFEFF/,''));
 if(!snapshotOnly&&new URL(settings.endpoint).origin!=='https://chefzc.dev')throw Error('Unexpected sync destination');
 const key=snapshotOnly?null:unprotect(configFile);let previous='',lastSent=0,backoff=30000,stopped=false;
 const stop=()=>{stopped=true;};process.on('SIGINT',stop);process.on('SIGTERM',stop);
 async function cycle(){
  const value=await readAc8Snapshot(settings.source);await writeFile(path.join(directory,'snapshot.json'),JSON.stringify(value));
  if(snapshotOnly){await writeFile(path.join(ownRoot,'dist/ac8-initial-record.js'),'// Dated allowlisted local Steam aggregates; no automatic time increments.\nexport const initialAc8Record = '+JSON.stringify(value,null,2)+';\n');console.log(JSON.stringify({snapshot:true,appId:value.appId,playtimeMinutes:value.playtimeMinutes,recentPlaytimeMinutes:value.recentPlaytimeMinutes,collectedAt:value.collectedAt}));return;}
  const signature=JSON.stringify([value.sourceUpdatedAt,value.playtimeMinutes,value.recentPlaytimeMinutes,value.lastPlayedAt]);
  if(!once&&signature===previous&&Date.now()-lastSent<300000)return;
  const response=await fetch(settings.endpoint,{method:'POST',headers:{Authorization:'Bearer '+key,'Content-Type':'application/json'},body:JSON.stringify(value),signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw Error('Sync returned HTTP '+response.status);
  previous=signature;lastSent=Date.now();backoff=30000;
  await writeFile(path.join(directory,'status.json'),JSON.stringify({ok:true,appId:2288340,lastSuccessAt:new Date(lastSent).toISOString(),collectedAt:value.collectedAt}));
  console.log('AC8 aggregates synchronized at '+value.collectedAt);
 }
 do{try{await cycle();}catch(error){await writeFile(path.join(directory,'status.json'),JSON.stringify({ok:false,appId:2288340,lastSuccessAt:lastSent?new Date(lastSent).toISOString():null,error:String(error.message).slice(0,140)}));console.error('AC8 sync unavailable; latest record is retained.');if(once||snapshotOnly){process.exitCode=1;break;}backoff=Math.min(backoff*2,300000);}
  if(once||snapshotOnly||stopped)break;await new Promise(resolve=>setTimeout(resolve,backoff));
 }while(!stopped);
}
if(process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url))await main();
