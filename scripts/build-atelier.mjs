import { build } from 'esbuild';
await build({ entryPoints:['scripts/atelier-sculpture.js'], outfile:'dist/atelier-sculpture.bundle.js', bundle:true, minify:true, format:'esm', target:'es2022', legalComments:'eof' });
