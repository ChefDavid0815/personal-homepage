import {getResetData} from '../lib/reset-data.js';
export default async function handler(request,response) {
  response.setHeader('Content-Type','application/json; charset=utf-8');
  response.setHeader('X-Content-Type-Options','nosniff');
  response.setHeader('Cache-Control','no-store');
  if(!['GET','HEAD'].includes(request.method)) { response.setHeader('Allow','GET, HEAD'); return response.status(405).json({error:'Method not allowed'}); }
  try {
    const data=await getResetData();
    response.setHeader('Cache-Control','public, max-age=0, s-maxage=5, must-revalidate');
    return request.method==='HEAD'?response.status(200).end():response.status(200).json(data);
  } catch {return response.status(503).json({error:'Sources are temporarily unavailable'});}
}
