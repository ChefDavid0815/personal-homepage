import './build-motion.mjs';
import { readFile, writeFile } from 'node:fs/promises';

const output = 'dist/midautumn-moon.bundle.js';
// Three.js embeds GLSL with a few trailing spaces; keep the checked-in bundle clean.
await writeFile(output, (await readFile(output, 'utf8')).replace(/[\t ]+$/gm, ''));
