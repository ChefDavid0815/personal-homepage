import * as THREE from 'three';
import { canAnimate, onMotionChange } from './motion-state.js';

function initializeMoon() {
  const stage = document.querySelector('.moon-stage');
  const canvas = stage?.querySelector('.moon-canvas');
  if (!stage || !canvas) return;
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch {
    // The textured CSS sphere remains visible when WebGL is unavailable.
  }
  if (renderer) {
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 20);
    camera.position.z = 3.8;
    const geometry = new THREE.SphereGeometry(1.18, 80, 56);
    const material = new THREE.MeshStandardMaterial({ color: 0xffedd5, roughness: 1, metalness: 0 });
    const moon = new THREE.Mesh(geometry, material);
    moon.rotation.y = -0.7;
    moon.rotation.x = 0.14;
    scene.add(moon);
    scene.add(new THREE.AmbientLight(0xb8d3ff, 0.65));
    const key = new THREE.DirectionalLight(0xffedce, 3.3);
    key.position.set(-2.6, 2.8, 4.4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0x7de4ff, 2);
    rim.position.set(2.5, -0.9, -2.3);
    scene.add(rim);

    let frame = 0;
    let visible = true;
    let disposed = false;
    let previous = 0;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)');
    const size = () => {
      const rect = stage.getBoundingClientRect();
      const edge = Math.max(1, Math.round(Math.min(rect.width, rect.height)));
      renderer.setSize(edge, edge, false);
      camera.aspect = 1;
      camera.updateProjectionMatrix();
      renderer.render(scene, camera);
    };
    const run = () => !disposed && visible && !document.hidden && canAnimate() && !reduce.matches;
    const tick = now => {
      frame = 0;
      if (!run()) return;
      const delta = Math.min(50, Math.max(0, now - (previous || now)));
      previous = now;
      moon.rotation.y += delta * 0.00014;
      currentX += (targetX - currentX) * 0.045;
      currentY += (targetY - currentY) * 0.045;
      moon.rotation.x = 0.14 + currentY;
      moon.rotation.z = currentX * 0.18;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(tick);
    };
    const sync = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      previous = 0;
      if (run()) frame = requestAnimationFrame(tick);
      else if (!disposed) renderer.render(scene, camera);
    };
    const move = event => {
      const rect = stage.getBoundingClientRect();
      targetX = ((event.clientX - rect.left) / rect.width - .5) * .18;
      targetY = ((event.clientY - rect.top) / rect.height - .5) * .16;
    };
    const reset = () => { targetX = 0; targetY = 0; };
    const observer = new IntersectionObserver(entries => {
      visible = entries.some(entry => entry.isIntersecting);
      sync();
    }, { rootMargin: '90px' });
    const resize = new ResizeObserver(size);
    const unsubscribeMotion = onMotionChange(sync);
    const leave = () => {
      if (disposed || document.documentElement.dataset.midautumn === 'on') return;
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
      stage.removeEventListener('pointermove', move);
      stage.removeEventListener('pointerleave', reset);
      document.removeEventListener('visibilitychange', sync);
      document.removeEventListener('midautumn:change', leave);
      reduce.removeEventListener('change', sync);
      unsubscribeMotion();
      geometry.dispose();
      material.map?.dispose();
      material.dispose();
      renderer.dispose();
    };
    stage.addEventListener('pointermove', move, { passive: true });
    stage.addEventListener('pointerleave', reset, { passive: true });
    document.addEventListener('visibilitychange', sync);
    document.addEventListener('midautumn:change', leave);
    reduce.addEventListener('change', sync);
    observer.observe(stage);
    resize.observe(stage);
    size();
    const texture = new THREE.TextureLoader().load('./assets/midautumn-moon-albedo.webp', map => {
      if (disposed) { map.dispose(); return; }
      map.colorSpace = THREE.SRGBColorSpace;
      map.wrapS = THREE.RepeatWrapping;
      map.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
      material.map = map;
      material.bumpMap = map;
      material.bumpScale = .028;
      material.needsUpdate = true;
      renderer.render(scene, camera);
      stage.classList.add('moon-ready');
      sync();
    });
    texture.colorSpace = THREE.SRGBColorSpace;
  }
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initializeMoon, { once: true });
else initializeMoon();
