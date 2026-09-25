import { build } from 'esbuild';
import { readFile, writeFile } from 'node:fs/promises';

const output = 'dist/midautumn-moon.bundle.js';
await build({
  entryPoints: ['dist/midautumn-moon-source.js'],
  outfile: output,
  bundle: true,
  format: 'esm',
  target: 'es2022',
  minify: true,
  external: ['./motion-state.js'],
  legalComments: 'eof'
});
// Three.js embeds GLSL with a few trailing spaces; keep the checked-in bundle clean.
await writeFile(output, (await readFile(output, 'utf8')).replace(/[\t ]+$/gm, ''));
