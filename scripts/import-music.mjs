// Build a local, immutable catalog snapshot from verified public QQ Music metadata.
// No credentials, playback URLs, audio files, or live catalog requests are stored.
import fs from 'node:fs';
import path from 'node:path';
const source = path.resolve(process.argv[2] || '../music-asset-candidates');
const target = path.resolve('dist/assets/music');
const manifest = JSON.parse(fs.readFileSync(path.join(source, 'manifest.json'), 'utf8').replace(/^\uFEFF/, ''));
fs.mkdirSync(target, { recursive:true });
function copyAsset(assetPath, folder) {
  const destination = path.join(target, folder, path.basename(assetPath));
  fs.mkdirSync(path.dirname(destination), { recursive:true });
  fs.copyFileSync(assetPath, destination);
  return `./assets/music/${folder}/${path.basename(assetPath)}`;
}
const order = ['jay-chou','joker-xue','gem','david-tao','money','eason-chan','vae','jane-zhang','jj-lin'];
const artists = manifest.artists.map(a => ({key:a.key,name:a.displayName,en:a.englishName,url:a.qqUrl,image:copyAsset(a.assetPath,'artists')})).sort((a,b)=>order.indexOf(a.key)-order.indexOf(b.key));
const songs = manifest.songs.map(s => ({id:s.songId,mid:s.songMid,title:s.songName,artist:s.artistKey,album:s.albumName,albumMid:s.albumMid,url:s.qqUrl,cover:copyAsset(s.assetPath,'covers'),duration:s.durationSeconds,credits:s.creditedArtists.map(a=>a.name).join(' / ')}));
const albums = [...manifest.favoriteAlbums].reverse().map(a=>({title:a.albumName,artist:a.artistKey,url:a.qqUrl,cover:copyAsset(a.assetPath,'covers')}));
if (artists.length !== 9 || songs.length !== 84 || new Set(songs.map(s=>s.id)).size !== 84 || albums.length !== 2) throw new Error('Unexpected catalog size');
for (const a of artists) if (songs.filter(s=>s.artist===a.key).length !== (a.key==='money'?4:10)) throw new Error(`Invalid track count: ${a.name}`);
fs.writeFileSync('dist/music-data.js', `// Public QQ Music catalog snapshot, verified ${manifest.verifiedAt}. Titles preserve official catalog names.\nexport const artists = ${JSON.stringify(artists,null,2)};\nexport const songs = ${JSON.stringify(songs,null,2)};\nexport const favouriteAlbums = ${JSON.stringify(albums,null,2)};\n`);
const publicManifest = JSON.parse(JSON.stringify(manifest, (key,value)=>key==='assetPath'?undefined:value));
fs.writeFileSync(path.join(target,'sources.json'),JSON.stringify(publicManifest,null,2)+'\n');
console.log(`Imported ${artists.length} artists, ${songs.length} songs, ${albums.length} favourite albums.`);
