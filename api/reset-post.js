import {getRelatedPost} from '../lib/reset-post.js';

export default async function handler(request,response) {
  response.setHeader('Content-Type','application/json; charset=utf-8');
  response.setHeader('X-Content-Type-Options','nosniff');
  response.setHeader('Cache-Control','no-store');
  if(request.method!=='GET'){response.setHeader('Allow','GET');return response.status(405).json({error:'method_not_allowed'});}
  try{
    const post=await getRelatedPost(request.query?.url);
    return post?response.status(200).json({post}):response.status(422).json({error:'not_related'});
  }catch(error){
    if(error instanceof TypeError)return response.status(400).json({error:'invalid_url'});
    return response.status(error.status===404?404:503).json({error:error.status===404?'post_not_found':'source_unavailable'});
  }
}
