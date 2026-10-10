const port=Number(process.env.PORT||4173);
const url=`http://127.0.0.1:${port}/profile.html`;
let running=false;
try{
  const response=await fetch(url,{signal:AbortSignal.timeout(1500)});
  if(response.ok&&(await response.text()).includes('flow.css'))running=true;
  else throw new Error(`Port ${port} belongs to another service.`);
}catch(error){if(error.cause?.code!=='ECONNREFUSED'){console.error(error.message);process.exitCode=1;throw error;}}
console.log(`Flow preview: ${url}`);
console.log(`Site index: http://127.0.0.1:${port}/explore.html`);
if(!running)await import('./serve.mjs');
