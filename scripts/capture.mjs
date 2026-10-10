// Usage: node shot.mjs <url> <outPrefix> [width] [height] [scrollStops comma list in px or 'full'] [waitMs]
import {spawn} from 'node:child_process';
import {writeFile, mkdtemp} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import path from 'node:path';
const [,, url, out, w='1440', h='900', stops='0', wait='2500'] = process.argv;
const chrome = 'C:/Program Files/Google/Chrome/Application/chrome.exe';
const port = 20000 + Math.floor(Math.random()*30000);
const profile = await mkdtemp(path.join(tmpdir(), 'cz-shot-'));
const proc = spawn(chrome, ['--headless=new', `--remote-debugging-port=${port}`, `--user-data-dir=${profile}`, '--hide-scrollbars', '--enable-webgl', `--window-size=${w},${h}`, 'about:blank'], {stdio: 'ignore'});
const sleep = ms => new Promise(r => setTimeout(r, ms));
let target;
for (let i = 0; i < 50; i++) { try { const list = await (await fetch(`http://127.0.0.1:${port}/json`)).json(); target = list.find(t => t.type === 'page'); if (target) break; } catch {} await sleep(200); }
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise(r => ws.addEventListener('open', r));
let id = 0; const pending = new Map(); const logs = [];
ws.addEventListener('message', e => { const m = JSON.parse(e.data); if (m.id && pending.has(m.id)) { pending.get(m.id)(m); pending.delete(m.id); } else if (m.method === 'Runtime.exceptionThrown') logs.push('EXC ' + (m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text)); else if (m.method === 'Runtime.consoleAPICalled' && ['error','warning'].includes(m.params.type)) logs.push(m.params.type + ' ' + m.params.args.map(a => a.value ?? a.description).join(' ')); else if (m.method === 'Log.entryAdded' && m.params.entry.level === 'error') logs.push('LOG ' + m.params.entry.text + ' ' + (m.params.entry.url||'')); });
const send = (method, params = {}) => new Promise(r => { const i = ++id; pending.set(i, r); ws.send(JSON.stringify({id: i, method, params})); });
await send('Runtime.enable'); await send('Log.enable'); await send('Page.enable');
const mobile = Number(w) < 700;
await send('Emulation.setDeviceMetricsOverride', {width: +w, height: +h, deviceScaleFactor: 1, mobile});
if (process.env.REDUCED) await send('Emulation.setEmulatedMedia', {features: [{name: 'prefers-reduced-motion', value: 'reduce'}]});
if (process.env.LANG_EN) await send('Page.addScriptToEvaluateOnNewDocument', {source: "try{localStorage.setItem('chefzc.language','en')}catch{}"});
await send('Page.navigate', {url});
await sleep(+wait);
const evaluate = async expr => (await send('Runtime.evaluate', {expression: expr, returnByValue: true, awaitPromise: true})).result?.result?.value;
if(process.env.PRE){await evaluate(process.env.PRE);await sleep(800);}
let list;
if (stops === 'full') { const H = await evaluate('document.documentElement.scrollHeight'); list = []; for (let y = 0; y < H; y += +h) list.push(y); }
else list = stops.split(',').map(Number);
const heightTotal = await evaluate('document.documentElement.scrollHeight');
for (const [i, y] of list.entries()) {
  await evaluate(`window.scrollTo({top:${y},behavior:'instant'})`);
  await sleep(+(process.env.STEP || 900));
  const shot = await send('Page.captureScreenshot', {format: 'jpeg', quality: 72});
  await writeFile(`${out}-${String(i).padStart(2,'0')}.jpg`, Buffer.from(shot.result.data, 'base64'));
}
if(process.env.EVAL){console.log('EVAL',JSON.stringify(await evaluate(process.env.EVAL)));}
console.log(JSON.stringify({height: heightTotal, shots: list.length, logs: logs.slice(0, 30)}));
ws.close(); proc.kill();
