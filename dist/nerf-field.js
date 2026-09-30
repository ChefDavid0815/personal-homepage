import { nerfAsset } from './nerf-content.js';
let specimen = 0;
export function fieldMarkup({ miniature = false, shared = false, image = 'reconstruction.webp', caption = true, language = 'zh' } = {}) {
  const nc = (zh,en) => language === 'en' ? en : zh;
  const id = `nerf-beam-${++specimen}`;
  return `<div class="nerf-space${miniature ? ' nerf-space--mini' : ''}" data-nerf-space>
    <canvas data-nerf-field aria-hidden="true"></canvas>
    <div class="nerf-plane nerf-plane--back" aria-hidden="true"></div><div class="nerf-plane nerf-plane--floor" aria-hidden="true"></div>
    <svg class="nerf-ray-map" viewBox="0 0 1000 640" preserveAspectRatio="none" aria-hidden="true">
      <defs><linearGradient id="${id}"><stop stop-color="#b4ff7d" stop-opacity=".65"/><stop offset="1" stop-color="#b4ff7d" stop-opacity=".02"/></linearGradient></defs>
      <g fill="none" stroke="url(#${id})" stroke-width=".8">
        <path d="M120 390L700 150M120 390L810 270M120 390L780 430M120 390L670 530M120 390L590 280"/>
        <path d="M105 380L105 400L125 408L125 373Z"/><path d="M125 373L174 350L174 430L125 408M174 350L105 380M174 430L105 400"/>
      </g><g class="nerf-svg-samples" fill="#b4ff7d"><circle cx="338" cy="300" r="2"/><circle cx="525" cy="223" r="1.5"/><circle cx="396" cy="342" r="2"/><circle cx="621" cy="306" r="1.4"/><circle cx="434" cy="409" r="2"/><circle cx="584" cy="415" r="1.5"/></g>
      <g fill="none" stroke="#b4ff7d" stroke-opacity=".22" stroke-width=".6"><path d="M52 564H950M75 543V590M924 543V590M50 77V46H82M949 77V46H915"/><circle cx="120" cy="390" r="28"/></g>
    </svg>
    <div class="nerf-floating-label nerf-origin" aria-hidden="true">o + td<br><span>CAMERA ORIGIN</span></div>
    <div class="nerf-floating-label nerf-coordinate" aria-hidden="true">x · y · z<br><span>CONTINUOUS / FIELD</span></div>
    <div class="nerf-plate${shared ? ' nerf-shared-plate' : ''}">
      <div class="nerf-plate-top"><span>LEGO / VAL 000</span><span>RGB</span></div>
      <div class="nerf-image-well"><img src="${nerfAsset}${image}" width="800" height="800" alt="${nc('50,000 次训练后实际渲染的 Lego 验证视角，保留白色背景','Recorded Lego validation view after 50,000 iterations, with its white background retained')}" decoding="async" data-nerf-preview><div class="nerf-reconstruction-grain" aria-hidden="true"></div><div class="nerf-acquisition" aria-hidden="true"></div></div>
      <div class="nerf-plate-bottom"><span data-nerf-iteration>ITER 050000</span><span>${nc('已记录','RECORDED')}</span></div>
    </div>
    <span class="nerf-field-index" aria-hidden="true">F<sub>θ</sub> (x, d) → (σ, c)</span>
    <span class="nerf-space-status" aria-hidden="true"><i></i>NEURAL SPACE / ${miniature ? 'MEMORY' : 'SPECIMEN'}</span>
    ${caption ? `<span class="nerf-space-caption">${nc('真实输出 · 空间射线为视觉示意','Recorded output · Spatial rays are illustrative')}</span>` : ''}
  </div>`;
}
