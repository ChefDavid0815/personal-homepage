import {normalizePost,normalizeRelatedPost} from '../dist/when-to-reset/model.js';

export function parseXPostUrl(input) {
  if(typeof input!=='string'||input.length>300)throw new TypeError('Invalid X post URL');
  let url;
  try{url=new URL(input.trim());}catch{throw new TypeError('Invalid X post URL');}
  if(url.protocol!=='https:'||!['x.com','www.x.com','twitter.com','www.twitter.com','mobile.twitter.com'].includes(url.hostname.toLowerCase()))throw new TypeError('Invalid X post URL');
  const match=url.pathname.match(/^\/[A-Za-z0-9_]{1,15}\/status\/(\d{10,20})\/?$/);
  if(!match)throw new TypeError('Invalid X post URL');
  return {id:match[1]};
}

export async function getRelatedPost(input,fetchPost=fetch) {
  const {id}=parseXPostUrl(input);
  const response=await fetchPost(`https://api.fxtwitter.com/2/status/${id}`,{signal:AbortSignal.timeout(11000),headers:{Accept:'application/json','User-Agent':'WhenToReset/1.0 (+https://chefzc.dev/when-to-reset/)'}});
  if(!response.ok){const error=new Error('X post unavailable');error.status=response.status===404?404:503;throw error;}
  const data=await response.json();
  if(data.code!==200||!data.status||String(data.status.id)!==id){const error=new Error('X post unavailable');error.status=503;throw error;}
  if(data.status.author?.screen_name?.toLowerCase()==='thsottiaux')return /\breset(?:s|ting|ted)?\b/i.test(data.status.text||'')?normalizePost(data.status):null;
  return normalizeRelatedPost(data.status);
}
