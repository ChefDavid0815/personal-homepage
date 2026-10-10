import {build} from 'esbuild';
import {readFile,writeFile} from 'node:fs/promises';
// A single graph gives all physical scenes one Three.js instance and shared global preferences.
const result=await build({
  entryPoints:{
    'model-viewer.bundle':'scripts/model-viewer.js',
    'atelier-sculpture.bundle':'scripts/atelier-sculpture.js',
    'midautumn-moon.bundle':'dist/midautumn-moon-source.js',
    'nerf-page.bundle':'dist/nerf-page.entry.js',
    'dot-air-globe.bundle':'dist/dot-air-globe-source.js'
  },
  outdir:'dist',chunkNames:'motion-vendor-[hash]',bundle:true,splitting:true,minify:true,
  format:'esm',target:'es2022',legalComments:'eof',metafile:true,
  plugins:[{name:'shared-site-state',setup(builder){
    builder.onResolve({filter:/(?:^|\/)(?:i18n|motion-state|atelier)\.js$/},args=>({path:'./'+args.path.split('/').at(-1),external:true}));
    builder.onResolve({filter:/\.bundle\.js$/},args=>args.kind==='entry-point'?undefined:({path:'./'+args.path.split('/').at(-1),external:true}));
  }}]
});
for(const [file,metadata] of Object.entries(result.metafile.outputs)){
  if(!file.endsWith('.js'))continue;
  const content=(await readFile(file,'utf8')).replace(/[\t ]+$/gm,'');
  await writeFile(file,content);metadata.bytes=new TextEncoder().encode(content).length;
}
await writeFile('design/flow-motion-build.json',JSON.stringify(result.metafile,null,2)+'\n');
console.log('Built five scenes with shared engine chunks and one language/motion state owner.');
