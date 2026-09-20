import { get } from '@vercel/blob';
import { setTimeout as delay } from 'node:timers/promises';

// A short, automatically renewed event stream. No tokens or conversation data are accepted here.
export default async function handler(request,response) {
  if (request.method !== 'GET') return response.status(405).end();
  response.setHeader('Content-Type','text/event-stream');
  response.setHeader('Cache-Control','no-store, no-transform');
  response.setHeader('X-Accel-Buffering','no');
  response.flushHeaders();
  response.write('retry: 1000\n\n');
  let closed=false, etag;
  response.on('close',()=>{closed=true;});
  const until=Date.now()+23000;
  try {
    while (!closed && Date.now()<until) {
      const blob=await get('codex-usage/latest.json',{access:'private',useCache:false,abortSignal:AbortSignal.timeout(4000),...(etag?{ifNoneMatch:etag}:{})});
      if (closed) break;
      if (blob?.statusCode===200) {
        const data=JSON.parse(await new Response(blob.stream).text());
        etag=blob.blob.etag;
        response.write(`data: ${JSON.stringify({...data,serverTime:new Date().toISOString()})}\n\n`);
      } else response.write(': heartbeat\n\n');
      await delay(1000);
    }
  } catch { if(!closed) response.write('event: unavailable\ndata: {}\n\n'); }
  if (!closed) response.end();
}
