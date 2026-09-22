// Import the existing browser releases without changing their UI or bundles.
// Usage: node scripts/import-web-projects.mjs <AXIOM source> <STRIDE source>
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { resolve, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const publicRoot = fileURLToPath(new URL('../dist/', import.meta.url));
const projects = [
  { name:'axiom-studio', folder:'axiom', repo:'axiom-studio', source:process.argv[2] },
  { name:'stride-device-simulator', folder:'stride', repo:'wis-tech-tank', source:process.argv[3] }
];
async function files(root, prefix='') {
  const result=[];
  for(const entry of await readdir(join(root,prefix),{withFileTypes:true})) {
    const path=join(prefix,entry.name);
    if(entry.isSymbolicLink()) throw new Error(`Symlinks are not imported: ${path}`);
    if(entry.isDirectory()) result.push(...await files(root,path));
    else if(entry.isFile()) result.push(path);
  }
  return result;
}
for(const project of projects) {
  if(!project.source) throw new Error('Provide both AXIOM and STRIDE source directories.');
  const source=resolve(project.source), build=join(source,'dist');
  const pkg=JSON.parse(await readFile(join(source,'package.json'),'utf8'));
  if(pkg.name!==project.name) throw new Error(`Expected ${project.name} at ${source}`);
  const html=await readFile(join(build,'index.html'),'utf8');
  if(/(?:src|href)=["']\/(?!\/)/.test(html)) throw new Error('Root-absolute entry assets require an explicit subpath build.');
  const destination=resolve(publicRoot,project.folder);
  if(!destination.startsWith(resolve(publicRoot)+sep)) throw new Error('Invalid output location.');
  const checksums={};
  for(const path of await files(build)) {
    const bytes=await readFile(join(build,path)), target=join(destination,path);
    await mkdir(resolve(target,'..'),{recursive:true});
    await writeFile(target,bytes);
    checksums[path.replaceAll('\\','/')]=createHash('sha256').update(bytes).digest('hex');
  }
  if(project.folder==='stride') {
    for(const path of await files(join(source,'licenses'))) {
      const target=join(destination,'licenses',path);
      await mkdir(resolve(target,'..'),{recursive:true});
      await writeFile(target,await readFile(join(source,'licenses',path)));
    }
    await writeFile(join(destination,'THIRD-PARTY.md'),await readFile(join(source,'THIRD-PARTY.md')));
  }
  const commit=execFileSync('git',['rev-parse','HEAD'],{cwd:source,encoding:'utf8'}).trim();
  await writeFile(join(destination,'release.json'),JSON.stringify({name:pkg.name,version:pkg.version,source:`https://github.com/ChefDavid0815/${project.repo}`,commit,path:`/${project.folder}/`,files:checksums},null,2)+'\n');
  console.log(`Imported ${pkg.name} ${pkg.version} -> ${relative(publicRoot,destination)} (${Object.keys(checksums).length} unchanged files)`);
}
