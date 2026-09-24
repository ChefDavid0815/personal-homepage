// Render a seamless loop from the user-supplied photograph. Only luminous cyan
// pixels are advected; the dark human silhouette is copied unchanged per frame.
// Run with FFMPEG_PATH pointing to ffmpeg.exe (or with ffmpeg on PATH).
import { spawn, spawnSync } from 'node:child_process';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const input = resolve(root, 'dist/assets/identity-blueflame-poster.jpg');
const output = resolve(root, 'dist/assets/identity-blueflame-loop.mp4');
const ffmpeg = process.env.FFMPEG_PATH || 'ffmpeg';
const width = 768;
const height = 744;
const fps = 24;
const frames = fps * 6;
const pixels = width * height;
const size = pixels * 3;
const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const smooth = (start, end, value) => {
  const t = clamp((value - start) / (end - start), 0, 1);
  return t * t * (3 - 2 * t);
};

const decoded = spawnSync(ffmpeg, [
  '-v', 'error', '-i', input, '-vf', `scale=${width}:${height}:flags=lanczos`,
  '-f', 'rawvideo', '-pix_fmt', 'rgb24', 'pipe:1',
], { encoding: null, maxBuffer: size + 1024 * 1024 });
if (decoded.error || decoded.status !== 0 || decoded.stdout?.length !== size) {
  throw new Error(`Could not decode source image: ${decoded.error?.message || decoded.stderr?.toString() || 'unexpected frame size'}`);
}
const source = decoded.stdout;
const mask = new Float32Array(pixels);
const trailSafety = new Float32Array(pixels);
const waveA = new Float32Array(pixels);
const waveAc = new Float32Array(pixels);
const waveB = new Float32Array(pixels);
const waveBc = new Float32Array(pixels);
const waveC = new Float32Array(pixels);
const waveCc = new Float32Array(pixels);

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const pixel = y * width + x;
    const index = pixel * 3;
    const red = source[index];
    const green = source[index + 1];
    const blue = source[index + 2];
    // Chroma plus lightness catches the original cyan fire but not hair, face,
    // hands or the deep cobalt background. No subject-segmentation guesswork.
    mask[pixel] = smooth(12, 67, Math.min(green, blue) - red)
      * smooth(50, 145, Math.max(green, blue))
      * smooth(40, 100, (red + green + blue) / 3);
    trailSafety[pixel] = smooth(29, 65, (red + green + blue) / 3);
    if (mask[pixel] < .025) continue;
    const a = y * .033 - x * .014;
    const b = x * .029 + y * .017;
    const c = y * .071 + x * .028;
    waveA[pixel] = Math.sin(a); waveAc[pixel] = Math.cos(a);
    waveB[pixel] = Math.sin(b); waveBc[pixel] = Math.cos(b);
    waveC[pixel] = Math.sin(c); waveCc[pixel] = Math.cos(c);
  }
}

const encoder = spawn(ffmpeg, [
  '-v', 'error', '-f', 'rawvideo', '-pix_fmt', 'rgb24',
  '-s', `${width}x${height}`, '-r', String(fps), '-i', 'pipe:0',
  '-an', '-c:v', 'libx264', '-preset', 'medium', '-crf', '19',
  '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-y', output,
], { stdio: ['pipe', 'ignore', 'pipe'] });
let errorText = '';
encoder.stderr.on('data', chunk => { errorText += chunk.toString(); });
const encoded = new Promise((accept, reject) => {
  encoder.on('error', reject);
  encoder.on('close', code => code === 0 ? accept() : reject(new Error(errorText || `ffmpeg exited ${code}`)));
});

for (let frame = 0; frame < frames; frame++) {
  const phase = Math.PI * 2 * frame / frames;
  const sin = Math.sin(phase), cos = Math.cos(phase);
  const sin2 = Math.sin(phase * 2), cos2 = Math.cos(phase * 2);
  // Two fading passes carry sampled fire to the right. Their phases overlap,
  // so the plume visibly travels while frame 144 meets frame 0 without a cut.
  const passA = (frame / frames + .08) % 1;
  const passB = (frame / frames + .58) % 1;
  const passes = [passA, passB];
  const rendered = Buffer.allocUnsafe(size);
  for (let y = 0; y < height; y++) {
    const wake = 7 * Math.sin(y * .038 + phase);
    for (let x = 0; x < width; x++) {
      const pixel = y * width + x;
      const index = pixel * 3;
      const strength = mask[pixel];
      if (strength < .025) {
        rendered[index] = source[index];
        rendered[index + 1] = source[index + 1];
        rendered[index + 2] = source[index + 2];
      } else {
        const a = waveA[pixel] * cos + waveAc[pixel] * sin;
        const b = waveB[pixel] * cos - waveBc[pixel] * sin;
        const c = waveC[pixel] * cos2 + waveCc[pixel] * sin2;
        const reach = .48 + .7 * x / width;
        const driftX = (7 + 15 * a + 7 * c + 6 * sin) * strength * reach;
        const driftY = (8 * b + 4 * c) * strength;
        const sampleX = clamp(x - driftX, 0, width - 1);
        const sampleY = clamp(y - driftY, 0, height - 1);
        const x0 = Math.floor(sampleX), y0 = Math.floor(sampleY);
        const x1 = Math.min(width - 1, x0 + 1), y1 = Math.min(height - 1, y0 + 1);
        const fx = sampleX - x0, fy = sampleY - y0;
        const q00 = (y0 * width + x0) * 3, q10 = (y0 * width + x1) * 3;
        const q01 = (y1 * width + x0) * 3, q11 = (y1 * width + x1) * 3;
        const sample = y0 * width + x0;
        const blend = (.24 + .7 * mask[sample]) * strength;
        const pulse = (11 * a + 9 * c + 5 * sin) * strength;
        for (let channel = 0; channel < 3; channel++) {
          const top = source[q00 + channel] * (1 - fx) + source[q10 + channel] * fx;
          const bottom = source[q01 + channel] * (1 - fx) + source[q11 + channel] * fx;
          const warped = top * (1 - fy) + bottom * fy;
          const pulseWeight = channel === 0 ? .28 : channel === 1 ? 1.05 : 1.18;
          rendered[index + channel] = clamp(source[index + channel] * (1 - blend) + warped * blend + pulse * pulseWeight, 0, 255);
        }
      }
      if (x < width * .46 || y > height * .79 || trailSafety[pixel] < .03) continue;
      for (const pass of passes) {
        const reach = 12 + 112 * pass;
        const sampleX = Math.round(x - reach);
        const sampleY = Math.round(y + 7 + pass * 24 + wake);
        if (sampleX < 0 || sampleY >= height) continue;
        const sampled = sampleY * width + sampleX;
        const fade = Math.sin(Math.PI * pass);
        const alpha = .58 * fade * mask[sampled] * trailSafety[pixel] * (1 - strength * .6);
        if (alpha < .012) continue;
        const sampledIndex = sampled * 3;
        rendered[index] = clamp(rendered[index] + source[sampledIndex] * alpha * .13, 0, 255);
        rendered[index + 1] = clamp(rendered[index + 1] + source[sampledIndex + 1] * alpha * .57, 0, 255);
        rendered[index + 2] = clamp(rendered[index + 2] + source[sampledIndex + 2] * alpha * .60, 0, 255);
      }
    }
  }
  if (!encoder.stdin.write(rendered)) await once(encoder.stdin, 'drain');
  if (frame % fps === 0) process.stdout.write(`Rendered ${frame / fps}s / ${frames / fps}s\n`);
}
encoder.stdin.end();
await encoded;
process.stdout.write(`Blue-fire loop: ${output}\n`);
