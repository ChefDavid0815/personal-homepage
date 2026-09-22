import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = path.resolve(fileURLToPath(new URL('../dist/', import.meta.url)));
const port = Number(process.env.PORT || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.wasm': 'application/wasm', '.json': 'application/json', '.woff': 'font/woff', '.woff2': 'font/woff2', '.png': 'image/png', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml' };
http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://127.0.0.1:${port}`);
    const pathname = decodeURIComponent(url.pathname);
    if (pathname === '/axiom' || pathname === '/stride') {
      response.writeHead(308, {Location: pathname + '/' + url.search}); response.end(); return;
    }
    if (pathname === '/api/usage' || pathname === '/api/usage-stream') {
      if (request.method !== 'GET') { response.writeHead(405); response.end(); return; }
      const snapshotPath = path.join(process.env.LOCALAPPDATA || '', 'ChefZC','UsageSync','snapshot.json');
      const readSnapshot = async () => ({ ...JSON.parse(await readFile(snapshotPath,'utf8')), serverTime:new Date().toISOString() });
      if (pathname === '/api/usage') {
        response.writeHead(200,{'Content-Type':'application/json','Cache-Control':'no-store'});
        response.end(JSON.stringify(await readSnapshot())); return;
      }
      response.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-store'});
      let last='';
      const send=async()=>{try{const data=await readSnapshot();if(data.collectedAt!==last){last=data.collectedAt;response.write(`data: ${JSON.stringify(data)}\n\n`);}else response.write(': heartbeat\n\n');}catch{response.write('event: unavailable\ndata: {}\n\n');}};
      await send(); const interval=setInterval(send,1000);
      response.on('close',()=>clearInterval(interval)); return;
    }
    const relative = (pathname.endsWith('/') ? pathname + 'index.html' : pathname).replace(/^\/+/, '');
    const target = path.resolve(root, relative);
    if (target !== root && !target.startsWith(root + path.sep)) { response.writeHead(403); response.end('Forbidden'); return; }
    const content = await readFile(target);
    response.writeHead(200, { 'Content-Type': types[path.extname(target)] || 'application/octet-stream', 'Cache-Control': 'no-store' });
    response.end(request.method === 'HEAD' ? undefined : content);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  }
}).listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}`));
