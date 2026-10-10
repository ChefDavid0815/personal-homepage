import {readFile,writeFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const hash=data=>createHash('sha256').update(data).digest('hex');
const files={};
async function walk(directory){for(const entry of await readdir(directory,{withFileTypes:true})){const file=directory+'/'+entry.name;if(entry.isDirectory())await walk(file);else files[file]=hash(await readFile(file));}}
await walk('dist');
const backend={};for(const file of ['api/ac8-record.js','lib/ac8-record-handler.js','lib/ac8-record-schema.js','lib/ac8-record-store.js','scripts/ac8-sync.mjs','scripts/setup-ac8-sync.ps1','scripts/ac8-unprotect.ps1','package.json','package-lock.json','vercel.json'])backend[file]=hash(await readFile(file));
const fingerprint=hash(JSON.stringify({files:Object.fromEntries(Object.entries(files).sort()),backend:Object.fromEntries(Object.entries(backend).sort())}));
await writeFile('design/ac8-code-manifest.json',JSON.stringify({fingerprint,files,backend},null,2)+'\n');
console.log('AC8 source fingerprint:',fingerprint,'static files:',Object.keys(files).length);
