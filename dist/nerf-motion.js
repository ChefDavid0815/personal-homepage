import { canAnimate, onMotionChange } from './motion-state.js';

// One renderer per visible specimen. No DOM particles or persistent timers.
const sessions = new Map();
const finePointer = matchMedia('(hover:hover) and (pointer:fine)');
const constrained = (navigator.hardwareConcurrency || 4) <= 4 || navigator.connection?.saveData;
let context, resizeTimer;
const random = seed => { const n = Math.sin(seed * 127.1 + 13.17) * 43758.5453; return n - Math.floor(n); };

function createField(stage) {
  const canvas = stage.querySelector('[data-nerf-field]');
  const ctx = canvas?.getContext('2d', { alpha: true });
  if (!ctx || sessions.has(stage)) return;
  let width = 0, height = 0, visible = false, frame = 0, last = 0, painted = 0, pointed = 0, time = 0, bounds;
  let pointer = { x: 0, y: 0 }, target = { x: 0, y: 0 }, focus = 0;
  let reconstruction = null, reconstructionPlayed = false;
  const image = stage.querySelector('[data-nerf-preview]');
  const iteration = stage.querySelector('[data-nerf-iteration]');
  const finalSource = image?.getAttribute('src');
  const finalAlt = image?.getAttribute('alt');
  const finalIteration = iteration?.textContent;
  const mini = stage.classList.contains('nerf-space--mini');
  const count = mini ? 72 : constrained ? 130 : 260;
  const points = Array.from({ length: count }, (_, i) => {
    // An illustrative volume, separate from the recorded RGB plate.
    const theta = random(i * 5 + 1) * Math.PI * 2;
    const radius = .35 + random(i * 5 + 2) * .65;
    return { x: Math.cos(theta) * radius, y: (random(i * 5 + 3) - .5) * 1.15, z: Math.sin(theta) * radius, phase: random(i * 5 + 4) * 6.28, depth: random(i * 5 + 5) };
  });
  function draw() {
    if (!width || !height) return;
    ctx.clearRect(0, 0, width, height);
    const cx = width * .68, cy = height * .48, scale = Math.min(width, height) * (mini ? .27 : .29);
    const turn = time * .045 + pointer.x * .16, cos = Math.cos(turn), sin = Math.sin(turn);
    const mobileCount = width < 500 ? Math.min(count, 95) : count;
    const projected = [];
    for (let i = 0; i < mobileCount; i++) {
      const p = points[i], x = p.x * cos - p.z * sin, z = p.x * sin + p.z * cos;
      const depth = 2.8 / (3.1 + z);
      projected.push({ x: cx + x * scale * depth + pointer.x * (8 + p.depth * 11), y: cy + p.y * scale * depth + pointer.y * (6 + p.depth * 8), z, p });
    }
    for (let i = 0; i < projected.length; i++) {
      const v = projected[i];
      const life = (time * (.08 + v.p.depth * .05) + v.p.phase / 6.28) % 1;
      const alpha = (.12 + .22 * Math.sin(Math.PI * life)) * (1 - (v.z + 1) * .27) + focus * .06;
      ctx.fillStyle = `rgba(174,255,143,${alpha.toFixed(3)})`;
      ctx.fillRect(v.x, v.y, v.p.depth > .88 ? 2 : 1, v.p.depth > .88 ? 2 : 1);
      if (i % 15 === 0 && projected[i + 2]) {
        const n = projected[i + 2];
        ctx.beginPath(); ctx.moveTo(v.x, v.y); ctx.lineTo(n.x, n.y);
        ctx.strokeStyle = 'rgba(157,240,138,.075)'; ctx.lineWidth = .5; ctx.stroke();
      }
    }
    if (!mini) {
      // Sampling pulses move along illustrative camera trajectories.
      for(let ray=0;ray<5;ray++) {
        const point=projected[(ray*37)%projected.length];
        const age=(time*.19+ray*.17)%1;
        const alpha=Math.sin(age*Math.PI)*.55;
        ctx.fillStyle=`rgba(185,255,152,${alpha.toFixed(3)})`;
        ctx.fillRect(width*.12+(point.x-width*.12)*age,height*.61+(point.y-height*.61)*age,1.5,1.5);
      }
      ctx.font = '9px Consolas,monospace';
      const cols = width < 500 ? 4 : 10;
      for (let i = 0; i < cols; i++) {
        const age = (time * (.021 + random(i + 27) * .017) + random(i + 20)) % 1;
        const x = width * (.04 + random(i + 11) * .9), y = height * age;
        for (let j = 0; j < 4; j++) {
          const alpha = Math.sin(age * Math.PI) * .13 * (1 - j / 4) * (.55 + focus * .45);
          ctx.fillStyle = `rgba(163,232,141,${alpha.toFixed(3)})`;
          ctx.fillText((i + j) % 2 ? '1' : '0', x, y - j * 13);
        }
      }
      ctx.fillStyle = 'rgba(175,225,163,.28)';
      ctx.fillText('[ 0.214  -0.681   1.000 ]', width * .7, height * .19);
      ctx.fillText('σ(x)  ·  c(x,d)', width * .17, height * .8);
    }
  }
  function resize() {
    width = canvas.clientWidth; height = canvas.clientHeight;
    const dpr = Math.min(devicePixelRatio || 1, mini || width < 500 || constrained ? 1 : 1.5);
    canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    bounds = stage.getBoundingClientRect(); draw();
  }
  function tick(now) {
    frame = 0;
    if (!stage.isConnected) { destroy(); return; }
    if (!visible || !canAnimate()) return;
    const dt = last ? Math.min((now - last) / 1000, .05) : .016; last = now; time += dt;
    const damping = 1 - Math.exp(-9 * dt);
    pointer.x += (target.x - pointer.x) * damping;
    pointer.y += (target.y - pointer.y) * damping;
    const interactive = Math.abs(pointer.x - target.x) + Math.abs(pointer.y - target.y) > .002;
    const interval = 1000 / (width < 500 || constrained ? 24 : 30);
    if (now - painted >= interval) {
      painted = now; draw();
      if(!interactive) {
        stage.style.setProperty('--nerf-x', pointer.x.toFixed(4));
        stage.style.setProperty('--nerf-y', pointer.y.toFixed(4));
      }
    }
    if(interactive && now-pointed >= (constrained || width<500 ? 1000/60 : 0)) {
      pointed=now;
      stage.style.setProperty('--nerf-x', pointer.x.toFixed(4));
      stage.style.setProperty('--nerf-y', pointer.y.toFixed(4));
    }
    frame = requestAnimationFrame(tick);
  }
  function resume() {
    cancelAnimationFrame(frame); frame = 0; last = 0;
    stage.classList.toggle('nerf-is-visible', visible && canAnimate());
    stage.dataset.nerfActive = String(visible && canAnimate());
    if(!visible || !canAnimate()) stopReconstruction();
    else playReconstruction();
    if (visible && canAnimate()) frame = requestAnimationFrame(tick);
    else { pointer = { x: 0, y: 0 }; stage.style.removeProperty('--nerf-x'); stage.style.removeProperty('--nerf-y'); draw(); }
  }
  function stopReconstruction() {
    reconstruction?.kill(); reconstruction=null;
    if(image&&finalSource){image.src=finalSource;image.alt=finalAlt;}
    if(iteration)iteration.textContent=finalIteration;
    stage.querySelector('.nerf-reconstruction-grain')?.style.removeProperty('opacity');
  }
  function playReconstruction() {
    if(mini||reconstructionPlayed||!image||!window.gsap||!finalSource)return;
    reconstructionPlayed=true;
    const base=finalSource.slice(0,finalSource.lastIndexOf('/')+1);
    const grain=stage.querySelector('.nerf-reconstruction-grain');
    reconstruction=window.gsap.timeline({onComplete:()=>{stopReconstruction();}});
    reconstruction.set(grain,{opacity:.75});
    [500,2000,10000].forEach((step,index)=>{
      reconstruction.call(()=>{
        image.src=base+'iteration-'+String(step).padStart(6,'0')+'.webp';
        image.alt=document.documentElement.lang.startsWith('zh')?'Lego 验证视角 000 / 已保存的 '+step+' 次预览 / 100 × 100':'Lego / recorded validation preview / iteration '+step+' / 100 × 100';
        if(iteration)iteration.textContent='ITER '+String(step).padStart(6,'0');
      },[],index*.26);
    });
    reconstruction.to(grain,{opacity:0,duration:.65,ease:'power2.out'},.16);
    reconstruction.call(()=>{image.src=finalSource;image.alt=finalAlt;if(iteration)iteration.textContent=finalIteration;},[],.88);
  }
  const abort = new AbortController();
  stage.addEventListener('pointerenter', () => { bounds = stage.getBoundingClientRect(); focus = 1; }, { signal: abort.signal, passive: true });
  stage.addEventListener('pointermove', event => {
    if (!finePointer.matches || event.pointerType === 'touch' || !canAnimate() || !bounds?.width) return;
    target = { x: (event.clientX - bounds.left) / bounds.width - .5, y: (event.clientY - bounds.top) / bounds.height - .5 };
  }, { signal: abort.signal, passive: true });
  stage.addEventListener('pointerleave', () => { target = { x: 0, y: 0 }; focus = 0; }, { signal: abort.signal, passive: true });
  const intersection = new IntersectionObserver(entries => { visible = entries[0]?.isIntersecting ?? false; resume(); }, { threshold: .01 });
  const resizing = new ResizeObserver(resize);
  function destroy() { stopReconstruction(); cancelAnimationFrame(frame); intersection.disconnect(); resizing.disconnect(); abort.abort(); sessions.delete(stage); }
  sessions.set(stage, { resume, destroy });
  intersection.observe(stage); resizing.observe(stage); resize();
}
function scrollMotion() {
  context?.revert(); context = undefined;
  const gsap = window.gsap, ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger || !canAnimate()) return;
  gsap.registerPlugin(ScrollTrigger);
  context = gsap.context(() => {
    document.querySelectorAll('.nerf-cabinet-stage,.nerf-hero-field').forEach(stage => {
      gsap.fromTo(stage.querySelector('.nerf-space'), { opacity: .7, y: 26 }, { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: stage, start: 'top 85%', once: true } });
      gsap.to(stage.querySelector('[data-nerf-preview]'), { scale: 1.025, ease: 'none', scrollTrigger: { trigger: stage, start: 'top bottom', end: 'bottom top', scrub: .7 } });
      gsap.to(stage.querySelector('.nerf-ray-map'), { yPercent: -4, ease: 'none', scrollTrigger: { trigger: stage, start: 'top bottom', end: 'bottom top', scrub: .7 } });
    });
    const narrative = document.querySelector('.nerf-narrative');
    if (narrative && matchMedia('(min-width:1000px)').matches) {
      ScrollTrigger.create({ trigger: narrative, start: 'top 120px', end: 'bottom 68%', pin: narrative.querySelector('.nerf-narrative-heading'), pinSpacing: false });
    }
    document.querySelectorAll('.nerf-pipeline-step').forEach(step => {
      gsap.fromTo(step.querySelector('.nerf-step-graphic'), { opacity: .3, scale: .94 }, { opacity: 1, scale: 1, ease: 'none', scrollTrigger: { trigger: step, start: 'top 85%', end: 'center 55%', scrub: .5 } });
    });
  });
}
export function refreshNeRF() {
  for (const [stage, session] of sessions) if (!stage.isConnected) session.destroy();
  document.querySelectorAll('[data-nerf-space]').forEach(createField);
  scrollMotion();
}
onMotionChange(() => { for (const session of sessions.values()) session.resume(); scrollMotion(); });
document.addEventListener('nerf:render', refreshNeRF);
window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(scrollMotion, 180); }, { passive: true });
window.addEventListener('pagehide', () => { clearTimeout(resizeTimer); context?.revert(); for (const session of [...sessions.values()]) session.destroy(); });
window.addEventListener('pageshow', refreshNeRF);
if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', refreshNeRF, { once: true }); else refreshNeRF();
