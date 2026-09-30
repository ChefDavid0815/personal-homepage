import { onLanguageChange } from './i18n.js';
import { nc, fieldArt } from './nerf-art.js';
import { nerfLinks } from './nerf-content.js';
import './nerf-motion.js';
function render() {
  const art = document.querySelector('[data-nerf-now]');
  if (art) {
    art.setAttribute('aria-label', nc('进入 NeRF 项目，小窗显示已记录的 Lego 重建','Enter the NeRF project; miniature shows a recorded Lego reconstruction'));
    art.innerHTML = `<header>NEURAL RENDERER / MEMORY</header>${fieldArt({miniature:true,caption:false})}<strong aria-hidden="true">NeRF_</strong><div class="nerf-now-reading"><span><small>ITER / SAVED</small>050000</span><span><small>VAL / 3 VIEWS</small>27.33 dB</span></div>`;
  }
  const discovery = document.querySelector('[data-nerf-discovery]');
  if(discovery) discovery.innerHTML = `<span>SCHOOL LAB / NeRF</span><div><h3>${nc('一个隐藏的计算世界。','A hidden computational world.')}</h3><p>${nc('从相机射线到真实重建，学校实验室的新作品。','From camera rays to recorded reconstruction, new in the School Lab.')}</p></div><a href="${nerfLinks.exhibition}">${nc('去看看','Explore')} ↗</a>`;
  document.dispatchEvent(new Event('nerf:render'));
}
render(); onLanguageChange(render);
