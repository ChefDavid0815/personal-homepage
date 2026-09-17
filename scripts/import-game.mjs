// Import an already-built NBA After Hours release into this static website.
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const source = process.argv[2] && resolve(process.argv[2]);
if (!source || !existsSync(join(source, 'dist/index.html'))) {
  throw new Error('Usage: node scripts/import-game.mjs <game-source-directory>. Run npm run build in the game first.');
}
const pkg = JSON.parse(readFileSync(join(source, 'package.json'), 'utf8'));
if (pkg.name !== 'nba-after-hours') throw new Error('Expected the nba-after-hours project.');
const destination = fileURLToPath(new URL('../dist/play/nba-after-hours/', import.meta.url));
mkdirSync(destination, { recursive: true });
// Explicit reads/writes also work on Windows filesystems where cpSync cannot
// reliably overwrite an existing destination. No files are deleted here.
function copyDirectory(from, to) {
  mkdirSync(to, { recursive: true });
  for (const entry of readdirSync(from, { withFileTypes: true })) {
    const input = join(from, entry.name), output = join(to, entry.name);
    if (entry.isDirectory()) copyDirectory(input, output);
    else if (entry.isFile()) writeFileSync(output, readFileSync(input));
  }
}
copyDirectory(join(source, 'dist'), destination);
copyDirectory(join(source, 'licenses'), join(destination, 'licenses'));
writeFileSync(join(destination, 'THIRD_PARTY_NOTICES.md'), readFileSync(join(source, 'THIRD_PARTY_NOTICES.md')));
const commit = execFileSync('git', ['rev-parse', 'HEAD'], { cwd: source, encoding: 'utf8' }).trim();
writeFileSync(join(destination, 'release.json'), JSON.stringify({
  name: pkg.name, version: pkg.version,
  source: 'https://github.com/ChefDavid0815/nba-after-hours', commit
}, null, 2) + '\n');
console.log(`Imported ${pkg.name} v${pkg.version} (${commit.slice(0, 7)})`);
