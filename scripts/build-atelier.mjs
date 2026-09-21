import { build } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';
await build({ entryPoints:['scripts/atelier-sculpture.js'], outfile:'dist/atelier-sculpture.bundle.js', bundle:true, minify:true, format:'esm', target:'es2022', legalComments:'eof' });
// Normalize insignificant trailing whitespace in Three.js's embedded GLSL chunks.
const output='dist/atelier-sculpture.bundle.js';
await writeFile(output,(await readFile(output,'utf8')).replace(/[\t ]+$/gm,''));
