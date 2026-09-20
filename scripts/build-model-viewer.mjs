import { build } from 'esbuild';
await build({ entryPoints: ['scripts/model-viewer.js'], outfile: 'dist/model-viewer.bundle.js', bundle: true, minify: true, format: 'esm', target: 'es2022', legalComments: 'eof' });
