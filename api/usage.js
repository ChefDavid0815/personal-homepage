import { get, put } from '@vercel/blob';
import { createHash, timingSafeEqual } from 'node:crypto';
import { validateSnapshot } from '../lib/usage-schema.js';

const pathname = 'codex-usage/latest.json';
const digest = text => createHash('sha256').update(text).digest();
export default async function handler(request, response) {
  response.setHeader('Cache-Control','no-store');
  response.setHeader('X-Content-Type-Options','nosniff');
  if (!['GET','HEAD','POST'].includes(request.method)) { response.setHeader('Allow','GET, HEAD, POST'); return response.status(405).json({error:'Method not allowed'}); }
  if (request.method === 'POST') {
    const key = process.env.USAGE_SYNC_SECRET;
    const supplied = (request.headers.authorization || '').replace(/^Bearer /,'');
    if (!key || !timingSafeEqual(digest(supplied),digest(key))) return response.status(401).json({error:'Unauthorized'});
    if (Number(request.headers['content-length']) > 2_000_000) return response.status(413).json({error:'Payload too large'});
    let clean;
    try { clean = validateSnapshot(typeof request.body === 'string' ? JSON.parse(request.body) : request.body); }
    catch { return response.status(400).json({error:'Invalid aggregate snapshot'}); }
    try {
      await put(pathname, JSON.stringify({...clean,receivedAt:new Date().toISOString()}), {access:'private',allowOverwrite:true,addRandomSuffix:false,contentType:'application/json'});
      return response.status(200).json({ok:true,collectedAt:clean.collectedAt});
    } catch { return response.status(503).json({error:'Sync temporarily unavailable'}); }
  }
  try {
    const blob = await get(pathname,{access:'private',useCache:false});
    if (!blob || blob.statusCode === 404) return response.status(503).json({error:'Awaiting first sync'});
    const snapshot = JSON.parse(await new Response(blob.stream).text());
    response.setHeader('Content-Type','application/json; charset=utf-8');
    if (request.method === 'HEAD') return response.status(200).end();
    return response.status(200).json({...snapshot,serverTime:new Date().toISOString()});
  } catch { return response.status(503).json({error:'Usage temporarily unavailable'}); }
}
