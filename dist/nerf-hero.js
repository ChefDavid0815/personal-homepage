import { fieldMarkup } from './nerf-field.js';
import { nerfLinks } from './nerf-content.js';
export function heroMarkup(language='zh') {
  const nc=(zh,en)=>language==='en'?en:zh;
  const external='target="_blank" rel="noopener noreferrer"';
  const readLink = () => `<a class="nerf-button" href="${nerfLinks.post}">${nc('翻开研究日志','Read the research log')} <span aria-hidden="true">↗</span></a>`;
  return `<header class="nerf-hero"><span class="nerf-overline">NEURAL RADIANCE FIELDS / RESEARCH CONSOLE</span><h1 id="nerf-title">NeRF<span>_</span></h1><h2>${nc('让数学，在屏幕里长出一个世界。','A world, made of numbers.')}</h2><p>${nc('从图像、相机与一组坐标出发，<br>让一个神经网络，重新学会看见空间。','Begin with images, cameras and coordinates.<br>Let a neural network learn to see a space again.')}</p><div class="nerf-actions">${readLink()}<a class="nerf-text-link" href="${nerfLinks.source}" ${external}>GitHub <span aria-hidden="true">↗</span></a></div><div class="nerf-hero-field">${fieldMarkup({shared:true,language})}<div class="nerf-init" aria-hidden="true"><span>camera_to_world · mat4</span><span>ray origin → positional encoding → field</span><span>scene memory / reconstructed.</span></div></div></header>`;
}
