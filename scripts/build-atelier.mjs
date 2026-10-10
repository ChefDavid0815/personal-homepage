import './build-motion.mjs';
import { readFile, writeFile } from 'node:fs/promises';
// Normalize insignificant trailing whitespace in Three.js's embedded GLSL chunks.
const output='dist/atelier-sculpture.bundle.js';
await writeFile(output,(await readFile(output,'utf8')).replace(/[\t ]+$/gm,''));
