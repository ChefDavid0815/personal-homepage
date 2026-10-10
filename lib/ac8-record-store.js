const pathname='game-records/ac8.json';
export function createAc8BlobStore({getBlob,putBlob}){return{
 async read(){const result=await getBlob(pathname,{access:'private',useCache:false});if(!result||result.statusCode===404)return null;return{snapshot:JSON.parse(await new Response(result.stream).text()),etag:result.blob.etag};},
 async write(snapshot,etag){try{await putBlob(pathname,JSON.stringify(snapshot),{access:'private',addRandomSuffix:false,contentType:'application/json',allowOverwrite:etag!=='0',...(etag==='0'?{}:{ifMatch:etag})});}catch(error){if(/Precondition|AlreadyExists|Conflict/.test(error.name))error.code='ETAG_CONFLICT';throw error;}}
};}
