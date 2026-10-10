import {createHash,timingSafeEqual} from 'node:crypto';
import {validateAc8Record,recordFreshness} from './ac8-record-schema.js';
const digest=s=>createHash('sha256').update(s).digest();
export function createAc8RecordHandler({store,secret,now=Date.now}){
 return async(req,res)=>{
  res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
  if(!['GET','HEAD','POST'].includes(req.method)){res.setHeader('Allow','GET, HEAD, POST');return res.status(405).json({error:'Method not allowed'});}
  if(req.method==='POST'){
   const expected=secret(),supplied=String(req.headers.authorization||'').replace(/^Bearer /,'');
   if(!expected||!timingSafeEqual(digest(expected),digest(supplied)))return res.status(401).json({error:'Unauthorized'});
   let value;try{
    const raw=typeof req.body==='string'?req.body:JSON.stringify(req.body);
    if(!raw||Buffer.byteLength(raw)>2048)throw Error('Too large');value=validateAc8Record(JSON.parse(raw),now());
   }catch{return res.status(400).json({error:'Invalid AC8 aggregate'});}
   try{
    const current=await store.read();
    if(current&&Date.parse(current.snapshot.collectedAt)>Date.parse(value.collectedAt))return res.status(409).json({error:'Newer record already stored'});
    await store.write({...value,receivedAt:new Date(now()).toISOString()},current?.etag||'0');
    return res.status(200).json({ok:true,collectedAt:value.collectedAt});
   }catch(error){return res.status(error.code==='ETAG_CONFLICT'?409:503).json({error:error.code==='ETAG_CONFLICT'?'Record changed; retry latest':'Sync unavailable'});}
  }
  try{
   const stored=await store.read();if(!stored)return res.status(503).json({error:'Awaiting first AC8 sync'});
   const value=validateAc8Record(stored.snapshot,now());
   res.setHeader('Content-Type','application/json; charset=utf-8');if(req.method==='HEAD')return res.status(200).end();
   return res.status(200).json({...value,receivedAt:stored.snapshot.receivedAt||null,serverTime:new Date(now()).toISOString(),freshness:recordFreshness(value,now())});
  }catch{return res.status(503).json({error:'Record temporarily unavailable'});}
 };
}
