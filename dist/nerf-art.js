import { fieldMarkup } from './nerf-field.js';
import { getLanguage } from './i18n.js';
import { nerfAsset, nerfLinks } from './nerf-content.js';

export const nc = (zh, en) => getLanguage() === 'en' ? en : zh;
export function fieldArt(options={}) { return fieldMarkup({...options,language:getLanguage()}); }

export function nerfCabinet() {
  return `<article class="nerf-cabinet" id="project-nerf" aria-labelledby="nerf-cabinet-title">
    <div class="nerf-cabinet-header"><span>THE COMPUTATIONAL SPECIMEN</span><span>${nc('学校研究 / 2026.09','SCHOOL RESEARCH / 2026.09')}</span></div>
    <a class="nerf-cabinet-stage" href="${nerfLinks.project}" aria-label="${nc('打开 NeRF 计算标本','Open the NeRF specimen')}">${fieldArt({ shared: true })}<div class="nerf-cabinet-word" aria-hidden="true">NeRF<span>_</span></div><span class="nerf-side-inscription" aria-hidden="true">NEURAL RADIANCE FIELDS / RESEARCH CONSOLE</span></a>
    <div class="nerf-cabinet-editorial"><div><span class="nerf-overline">A WORLD, MADE OF NUMBERS.</span><h2 id="nerf-cabinet-title">${nc('让数学，<br>长出一个世界。','Let the numbers<br> become a world.')}</h2></div><div class="nerf-cabinet-note"><p>${nc('照片成为射线，坐标成为频率，密度与颜色重新汇成一幅图像。一个关于机器怎样看见空间的研究，也是一台让过程可以被看见的本地工作台。','Images become rays. Coordinates become frequencies. Density and colour return as an image. A study of how a machine sees space, and a local workstation that makes the process visible.')}</p><div class="nerf-actions"><a class="nerf-button" href="${nerfLinks.project}">${nc('进入计算空间','Enter the field')} <span aria-hidden="true">↗</span></a><a class="nerf-text-link" href="${nerfLinks.source}" target="_blank" rel="noopener noreferrer">GitHub <span aria-hidden="true">↗</span></a></div></div></div>
    <div class="nerf-cabinet-footer"><span>PYTORCH · NEURAL RENDERING · LOCAL RESEARCH</span><a href="${nerfLinks.post}">${nc('读研究日志','Read the research log')} ↗</a></div>
  </article>`;
}
export function nerfPostArt() {
  return `<div class="post-art post-art--nerf" aria-hidden="true"><span class="nerf-overline">RESEARCH LOG / 014</span>${fieldArt({ miniature: true, caption: false })}<div class="nerf-post-word">NeRF<span>_</span></div><div class="nerf-post-art-foot"><span>FROM COORDINATES. TO REALITY.</span><span>2026 / LEGO</span></div></div>`;
}

export function pipelineDiagram() {
  const steps = [['INPUT VIEWS', 'I + K + R + t'], ['ENCODING', 'γ(x), γ(d)'], ['MLP', 'Fθ'], ['DENSITY / COLOR', 'σ, c'], ['VOLUME', 'Σ Ti αi ci'], ['SCENE', 'Ĉ(r)']];
  return `<div class="nerf-pipeline-diagram" role="img" aria-label="${nc('管线：输入视角、位置编码、神经网络、密度与颜色、体渲染、重建场景','Pipeline: input views, positional encoding, MLP, density and colour, volume rendering, reconstructed scene')}">${steps.map(([name, value], i) => `<div><span>${name}</span><strong>${value}</strong>${i < 5 ? '<i aria-hidden="true">→</i>' : ''}</div>`).join('')}</div>`;
}
