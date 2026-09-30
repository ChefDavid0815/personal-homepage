import { heroMarkup } from './nerf-hero.js';
import { getLanguage, onLanguageChange } from './i18n.js';
import { fieldArt, nc } from './nerf-art.js';
import { nerfLinks, nerfAsset } from './nerf-content.js';
import './nerf-motion.js';

const root = document.querySelector('#nerf-project');
const checkpoints = [
  { iteration: 500, psnr: 17.614442750388363, loss: .0360831692814827 },
  { iteration: 2000, psnr: 19.3050979922303, loss: .021930690854787827 },
  { iteration: 10000, psnr: 22.045797115414636, loss: .01749704545363784 },
  { iteration: 50000, psnr: 27.309116924312747, loss: .0046847478952258825 }
];
let selected = 50000, view = 0, evidence, opener;
const pad = n => String(n).padStart(6, '0');
const external = 'target="_blank" rel="noopener noreferrer"';
const readLink = () => `<a class="nerf-button" href="${nerfLinks.post}">${nc('翻开研究日志','Read the research log')} <span aria-hidden="true">↗</span></a>`;
export function evidenceTable() {
  return `<table class="nerf-evidence-ledger"><caption class="visually-hidden">${nc('50,000 次 checkpoint 的选定视角评估','Selected-view evaluation at checkpoint 50,000')}</caption><thead><tr><th scope="col">SPLIT / VIEWS</th><th scope="col">PSNR ↑</th><th scope="col">SSIM ↑</th><th scope="col">LPIPS ↓</th></tr></thead><tbody><tr><td>VAL / 0, 1, 2</td><td>27.333 dB</td><td>0.88850</td><td>0.08770</td></tr><tr><td>TEST / 0, 1, 2, 66, 133</td><td>26.055 dB</td><td>0.89022</td><td>0.09240</td></tr></tbody></table>`;
}
function graphic(kind) {
  if (kind === 'input') return `<img src="${nerfAsset}input-view.webp" width="800" height="800" alt="${nc('官方 Lego 训练参考视角 000','Official Lego training reference view 000')}" loading="lazy"><img src="${nerfAsset}input-view-001.webp" width="800" height="800" alt="${nc('官方 Lego 训练参考视角 001','Official Lego training reference view 001')}" loading="lazy">`;
  if (kind === 'encoding') return '<svg viewBox="0 0 380 90" aria-hidden="true"><path d="M0 45Q23 0 47 45T94 45T141 45T188 45T235 45T282 45T329 45T376 45" fill="none" stroke="#b4ff7d" stroke-width="1"/><path d="M0 45Q12 12 24 45T48 45T72 45T96 45T120 45T144 45T168 45T192 45T216 45T240 45T264 45T288 45T312 45T336 45T360 45" fill="none" stroke="#7fa56c" stroke-width=".6"/><path d="M0 45H380" stroke="#739963" stroke-opacity=".25"/></svg>';
  if (kind === 'mlp') return '<svg viewBox="0 0 380 95" aria-hidden="true"><g fill="none" stroke="#719963" stroke-width=".5" opacity=".55"><path d="M25 25L120 15L215 25L320 35M25 25L120 45L215 65L320 35M25 65L120 15L215 65L320 70M25 65L120 75L215 25L320 70M120 15L215 65M120 45L215 25M120 75L215 65"/></g><g fill="#071008" stroke="#b4ff7d" stroke-width=".8"><circle cx="25" cy="25" r="5"/><circle cx="25" cy="65" r="5"/><circle cx="120" cy="15" r="5"/><circle cx="120" cy="45" r="5"/><circle cx="120" cy="75" r="5"/><circle cx="215" cy="25" r="5"/><circle cx="215" cy="65" r="5"/><circle cx="320" cy="35" r="5"/><circle cx="320" cy="70" r="5"/></g></svg>';
  if (kind === 'density') return '<code>Fθ(x, d) → σ, c<br>αᵢ = 1 − exp(−σᵢδᵢ)</code>';
  if (kind === 'volume') return '<code>Ĉ(r) = Σ Tᵢ αᵢ cᵢ</code>';
  return `<img src="${nerfAsset}reconstruction.webp" width="800" height="800" loading="lazy" alt="${nc('50,000 次 checkpoint 的实际重建','Actual reconstruction from checkpoint 50,000')}"><code>xyz → reality.</code>`;
}
function steps() {
  return [
    ['INPUT VIEWS', nc('从看见的东西开始。','Begin with what is seen.'), nc('图像、相机内参与位姿。已知的视角，给每条射线一个起点和方向。','Images, intrinsics and camera poses. Known views give every ray an origin and a direction.'), 'input'],
    ['POSITIONAL ENCODING', nc('让坐标拥有频率。','Give coordinates a frequency.'), nc('正弦与余弦展开空间位置。这里显式保留原始输入，位置 L=10 是 63 维，方向 L=4 是 27 维。','Sines and cosines expand spatial coordinates. Raw inputs are retained: position L=10 is 63-dimensional; direction L=4 is 27-dimensional.'), 'encoding'],
    ['MULTILAYER PERCEPTRON', nc('一个连续的场。','A continuous field.'), nc('位置分支学习密度与特征，观察方向参与颜色预测。不是一个装着网格的文件，而是一种连续的场景表达。','The position branch learns density and features; viewing direction informs colour. A continuous representation rather than a stored polygon mesh.'), 'mlp'],
    ['DENSITY / COLOR', nc('光在空间里留下答案。','Light leaves an answer in space.'), nc('在每个采样位置查询密度与颜色。coarse 权重引导 fine 采样，把更多查询送到重要的射线区间。','Query density and colour at each sampled location. Coarse weights guide fine sampling toward important intervals along the ray.'), 'density'],
    ['VOLUME RENDERING', nc('沿一条射线，累积一个像素。','Along a ray, accumulate a pixel.'), nc('透射率、alpha 与颜色共同积分。未归一化射线的参数间隔，会乘以方向长度转换成世界距离。','Transmittance, alpha and colour combine. Parameter intervals along unnormalised rays are multiplied by direction length to recover world distance.'), 'volume'],
    ['RECONSTRUCTED SCENE', nc('数学终于变成图像。','The mathematics becomes an image.'), nc('可微渲染连接 RGB 损失与网络参数。训练让视角逐渐稳定；新相机可以从同一个场查询新的图像。','Differentiable rendering connects RGB loss to the network. Training stabilises the views; a new camera queries a new image from the same field.'), 'scene']
  ].map(([label,title,text,kind],i)=>`<section class="nerf-pipeline-step"><span class="nerf-step-number">0${i+1}</span><div><span class="nerf-overline">${label}</span><div class="nerf-step-graphic">${graphic(kind)}</div><h3>${title}</h3><p>${text}</p></div></section>`).join('');
}
function render() {
  document.title = nc('NeRF — 数学长出一个世界 / ChefZC','NeRF — A world, made of numbers / ChefZC');
  root.innerHTML = `<nav class="nerf-breadcrumb" aria-label="${nc('项目导航','Project navigation')}"><a href="${nerfLinks.exhibition}">← ${nc('学校实验室','THE SCHOOL LAB')}</a><span>CHEFZC / COMPUTATIONAL RESEARCH</span></nav>
    <article class="nerf-project" aria-labelledby="nerf-title">
      ${heroMarkup(getLanguage())}
      <section class="nerf-section" id="reconstruction" aria-labelledby="nerf-memory-title"><div class="nerf-section-heading"><div><span class="nerf-overline">THE RECORDED RECONSTRUCTION</span><h2 id="nerf-memory-title">${nc('从模糊，到可辨认的现实。','From uncertainty to a recognisable world.')}</h2></div><p>${nc('沿着真正保存下来的训练时刻，回看场景怎样形成。每张图像来自同一运行的实际预览。','Revisit the moments that were actually saved. Every image is a recorded preview from the same run.')}</p></div><div class="nerf-reconstruction-deck"><div class="nerf-recorded-frame"><div class="nerf-frame-label"><span>LEGO / VALIDATION VIEW 000</span><span data-memory-iteration>050000</span></div><figure><img data-memory-image src="${nerfAsset}iteration-050000.webp" width="100" height="100" alt="" loading="lazy"><figcaption data-memory-caption></figcaption></figure></div><div class="nerf-memory-console"><span class="nerf-overline">SAVED CHECKPOINTS / 256 RAYS</span><h3>${nc('选一个时刻。','Choose a moment.')}</h3><div class="nerf-checkpoints" role="group" aria-label="${nc('选择历史 checkpoint','Choose a recorded checkpoint')}">${checkpoints.map(cp=>`<button type="button" data-checkpoint="${cp.iteration}" aria-pressed="${cp.iteration===selected}">${cp.iteration.toLocaleString('en')}<span class="visually-hidden"> ${nc('次迭代','iterations')}</span></button>`).join('')}</div><div class="nerf-memory-reading"><div><small>TRAIN BATCH / PSNR</small><strong data-memory-psnr></strong></div><div><small>COARSE + FINE / MSE</small><strong data-memory-loss></strong></div></div><svg class="nerf-curve" viewBox="0 0 300 70" role="img" aria-label="${nc('实际训练批次 PSNR 曲线，250 次间隔采样','Recorded training-batch PSNR curve, sampled every 250 iterations')}"><line x1="0" y1="69" x2="300" y2="69"/><polyline data-memory-curve></polyline></svg><p>${nc('数值来自该时刻的真实训练批次；图像是 100 × 100 验证预览。两者不是同一组测量，预览也不是全图评估。','Numbers describe that recorded training batch; the image is a 100 × 100 validation preview. These are different measurements, and the preview is not a full-image evaluation.')}</p><span class="nerf-overline">RECORDED / NOT LIVE TRAINING</span></div></div></section>
      <section class="nerf-narrative" id="pipeline" aria-labelledby="nerf-pipeline-title"><div class="nerf-narrative-heading"><span class="nerf-overline">THE PATH THROUGH THE FIELD</span><h2 id="nerf-pipeline-title">${nc('一次看见，<br>经过六次转化。','One image.<br>Six transformations.')}</h2><p>${nc('从相机到像素，沿着光走一遍。这里展示的是实现的概念管线；空间粒子和线束是为阅读设计的图解。','Follow the light from a camera to a pixel. This is the implemented conceptual pipeline; spatial particles and ray bundles are editorial diagrams.')}</p><span>r(t) = o + td<br>Fθ : (x, d) → (σ, c)</span></div><div class="nerf-pipeline-steps">${steps()}</div></section>
      <section class="nerf-section" id="evidence" aria-labelledby="nerf-evidence-title"><div class="nerf-section-heading"><div><span class="nerf-overline">THE ENGINEERING EVIDENCE</span><h2 id="nerf-evidence-title">${nc('每一个数字，都有来处。','Every number has a source.')}</h2></div><p>${nc('50,000 次 checkpoint · 官方 Lego · 白底<br>800 × 800 全分辨率 · 选定视角的平均值','Checkpoint 50,000 · official Lego · white background<br>800 × 800 full-resolution · means over selected views')}</p></div>${evidenceTable()}<div class="nerf-evidence-foot"><p>${nc('这是从 500 次工程 smoke run 续训的 256-ray 运行，不是 configs/baseline.yaml 的 4096-ray 配置。只评估了列出的视角，不代表完整数据集 benchmark，也不能据此得出位置编码带宽的研究结论。','This 256-ray run continues a 500-step engineering smoke run; it is not the 4096-ray configuration in configs/baseline.yaml. Only the listed views were evaluated. These are not full-dataset benchmarks or conclusions about encoding bandwidth.')}</p><div><span class="nerf-overline">CHECKPOINT / SHA-256</span><code>0e564e02fc28875a7fde02fa55682566342f06d1252fbbcab5d6581278dd3264</code><div class="nerf-source-button"><a class="nerf-text-link" href="${nerfLinks.source}/tree/main/docs/evidence" ${external}>${nc('检查原始评估记录','Inspect the evaluation records')} <span aria-hidden="true">↗</span></a></div></div></div><div class="nerf-novel-frame"><img data-novel-image src="${nerfAsset}test-000.webp" width="800" height="800" loading="lazy" alt=""><div class="nerf-novel-copy"><span class="nerf-overline">VIEW SYNTHESIS / SAVED RGB</span><h3>${nc('换一个视角，世界仍在。','A different view. The same world.')}</h3><p>${nc('查看同一 checkpoint 渲染的三个测试相机。切换的是实际保存的画面；网页里的点云没有替代模型重新计算。','Inspect three test cameras rendered by the same checkpoint. These are saved images, rather than a live inference from the webpage’s illustrative point cloud.')}</p><div class="nerf-view-buttons" role="group" aria-label="${nc('选择测试相机','Choose a test camera')}">${[0,66,133].map(v=>`<button type="button" data-test-view="${v}" aria-pressed="${v===view}">CAM ${String(v).padStart(3,'0')}</button>`).join('')}</div></div></div></section>
      <section class="nerf-section" id="workstation" aria-labelledby="nerf-workstation-title"><div class="nerf-section-heading"><div><span class="nerf-overline">INSIDE THE RESEARCH CONSOLE</span><h2 id="nerf-workstation-title">${nc('一台让过程被看见的工作台。','A workstation for seeing the process.')}</h2></div><p>${nc('PyTorch 与 FastAPI 连接真实研究链路。<br>React 与 Electron 为它留出一个本地空间。','PyTorch and FastAPI connect the research pipeline.<br>React and Electron give it a local workspace.')}</p></div><figure class="nerf-interface"><img src="${nerfAsset}workstation-${getLanguage()}.webp" width="1440" height="960" alt="${nc('实际 NeRF Research Console 本地工作台界面，训练没有运行','Actual local NeRF Research Console interface with no training running')}" loading="lazy"><button type="button" data-nerf-enlarge>${nc('放大真实界面','View actual interface')} ↗</button><figcaption><span>${nc('真实软件截图 / 2026.09.30','Actual software capture / 2026.09.30')}</span><span>${nc('本地软件 · 网页是展览','Local software · This webpage is its exhibition')}</span></figcaption></figure><div class="nerf-interface-toc">${[
        ['TRAIN',nc('冻结配置，显式启动与停止。','Freeze the configuration. Start and stop explicitly.')],
        ['RUNS',nc('运行档案、checkpoint 与可恢复状态。','Run archives, checkpoints and recoverable state.')],
        ['ANALYZE',nc('重建对照、指标、编码与逐射线诊断。','Reconstructions, metrics, encoding and per-ray diagnostics.')],
        ['SYSTEM',nc('真实遥测与日志；缺失的值继续为空。','Real telemetry and logs; missing values remain unavailable.')]
      ].map(([title,text])=>`<div><h3>${title}</h3><p>${text}</p></div>`).join('')}</div></section>
      <footer class="nerf-epilogue"><span class="nerf-overline">THE FIELD CONTINUES.</span><h2>${nc('把看见的过程，<br>也变成值得留下的作品。','Make the act of seeing<br>something worth keeping.')}</h2><div class="nerf-actions">${readLink()}<a class="nerf-text-link" href="${nerfLinks.source}" ${external}>${nc('查看源码','Explore the source')} <span aria-hidden="true">↗</span></a></div><div class="nerf-epilogue-bottom"><a href="${nerfLinks.now}">NOW / 2026.09.30 ↗</a><a href="${nerfLinks.exhibition}">← SCHOOL LAB</a><a href="./posts.html">THE JOURNAL ↗</a></div></footer>
    </article>`;
  updateCheckpoint(); updateView(); drawCurve();
  document.dispatchEvent(new Event('nerf:render'));
}
function updateCheckpoint() {
  const cp = checkpoints.find(row=>row.iteration===selected);
  root.querySelectorAll('[data-checkpoint]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.checkpoint)===selected)));
  root.querySelector('[data-memory-iteration]').textContent = pad(selected);
  const image = root.querySelector('[data-memory-image]');
  image.src = `${nerfAsset}iteration-${pad(selected)}.webp`;
  image.alt = nc(`Lego 验证视角 000 的实际 ${selected.toLocaleString('en')} 次预览，100 × 100`,`Recorded Lego validation view 000 at iteration ${selected.toLocaleString('en')}, 100 × 100`);
  root.querySelector('[data-memory-psnr]').textContent = `${cp.psnr.toFixed(2)} dB`;
  root.querySelector('[data-memory-loss]').textContent = cp.loss.toFixed(5);
  root.querySelector('[data-memory-caption]').textContent = nc(`ITER ${pad(selected)} / 真实保存的验证预览 / 100 × 100`,`ITER ${pad(selected)} / Recorded validation preview / 100 × 100`);
}
function updateView() {
  const image = root.querySelector('[data-novel-image]');
  image.src = `${nerfAsset}test-${String(view).padStart(3,'0')}.webp`;
  image.alt = nc(`50,000 次 checkpoint 实际渲染的 Lego 测试相机 ${view}，800 × 800`,`Actual 800 × 800 Lego test camera ${view} from checkpoint 50,000`);
  root.querySelectorAll('[data-test-view]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.testView)===view)));
}
function drawCurve() {
  if (!evidence?.training_curve) return;
  const rows = evidence.training_curve;
  const min = Math.min(...rows.map(r=>r.psnr)), max = Math.max(...rows.map(r=>r.psnr));
  const points = rows.map(r=>`${((r.iteration-1)/49999*300).toFixed(2)},${(65-(r.psnr-min)/(max-min)*60).toFixed(2)}`).join(' ');
  root.querySelector('[data-memory-curve]')?.setAttribute('points',points);
}
const dialog = document.querySelector('#nerf-dialog');
function closeDialog() { dialog.close(); }
root.addEventListener('click',event=>{
  const checkpoint = event.target.closest('[data-checkpoint]');
  if (checkpoint) { selected = Number(checkpoint.dataset.checkpoint); updateCheckpoint(); }
  const camera = event.target.closest('[data-test-view]');
  if (camera) { view = Number(camera.dataset.testView); updateView(); }
  const enlarge = event.target.closest('[data-nerf-enlarge]');
  if (enlarge) {
    opener = enlarge;
    dialog.querySelector('img').src = `${nerfAsset}workstation-${getLanguage()}.webp`;
    dialog.querySelector('img').alt = nc('实际 NeRF Research Console 本地界面','Actual local NeRF Research Console interface');
    dialog.querySelector('button').textContent = nc('关闭 ×','Close ×');
    dialog.showModal(); document.body.classList.add('dialog-open');
  }
});
dialog.querySelector('button').addEventListener('click',closeDialog);
dialog.addEventListener('click',event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)closeDialog();}});
dialog.addEventListener('close',()=>{document.body.classList.remove('dialog-open');if(opener?.isConnected)opener.focus();else root.querySelector('[data-nerf-enlarge]')?.focus();});
render(); onLanguageChange(render);
fetch(nerfLinks.evidence).then(response=>{if(!response.ok)throw new Error('Evidence unavailable');return response.json();}).then(data=>{evidence=data;drawCurve();}).catch(()=>{root.querySelector('.nerf-curve')?.remove();});
