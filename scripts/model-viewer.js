import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)');
const viewers = new Set();
const labels = {
  loading: ['正在打开玻璃盒…', 'Opening the display case…'],
  ready: ['实时 3D · 拖动旋转', 'LIVE 3D · DRAG TO ROTATE'],
  fallback: ['3D 暂时不可用，正在展示真实模型渲染图。', '3D is unavailable. Showing a render of the actual model.'],
  pause: ['暂停转台', 'Pause rotation'], play: ['启动转台', 'Start rotation'],
};
const say = key => labels[key][document.documentElement.lang === 'en' ? 1 : 0];
function announce(v, key) { v.statusKey = key; v.status.textContent = say(key); }

async function openCase(el) {
  const v = { el, status: el.querySelector('.model-status'), running: !reduced.matches, visible: true, frame: 0, ready: false };
  viewers.add(v);
  announce(v, 'loading');
  try {
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'default' });
    v.renderer = renderer;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.setAttribute('aria-label', `${el.closest('.model-exhibit').querySelector('h2').textContent} · 3D`);
    renderer.domElement.setAttribute('role', 'img');
    el.querySelector('.model-canvas').append(renderer.domElement);
    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const env = pmrem.fromScene(room, .04);
    scene.environment = env.texture; room.dispose(); pmrem.dispose();
    v.env = env;
    const kind = el.dataset.model;
    const tall = kind === 'curry';
    const height = tall ? 3.1 : 1.85;
    const camera = new THREE.PerspectiveCamera(37, 1, .1, 100);
    const initial = tall ? new THREE.Vector3(3.8, 3.5, 8.8) : new THREE.Vector3(4.5, 6.2, 7.7);
    camera.position.copy(initial);
    const controls = new OrbitControls(camera, renderer.domElement);
    v.controls = controls;
    controls.target.set(0, height * .47, 0);
    controls.enablePan = false; controls.enableZoom = false;
    controls.enableDamping = true; controls.dampingFactor = .07;
    controls.minPolarAngle = .2; controls.maxPolarAngle = Math.PI * .53;
    controls.autoRotate = v.running; controls.autoRotateSpeed = .35;
    controls.update();
    const cold = new THREE.HemisphereLight(0xdfeeff, 0x15233b, 1.2); scene.add(cold);
    [[0xd9eaff, 2.2, 4, 7, 4], [0x5f8cff, .9, -5, 3, -1], [0xffd891, 1.6, 3, 5, -4]].forEach(([color, intensity, x, y, z], index) => {
      const light = new THREE.DirectionalLight(color, intensity); light.position.set(x, y, z);
      if (index === 0) { light.castShadow = true; light.shadow.mapSize.set(1024, 1024); Object.assign(light.shadow.camera, { left: -4, right: 4, top: 4, bottom: -4, near: .1, far: 25 }); light.shadow.bias = -.0002; light.shadow.normalBias = .008; }
      scene.add(light);
    });
    const baseMat = new THREE.MeshPhysicalMaterial({ color: 0x061124, metalness: .25, roughness: .4, clearcoat: .12, envMapIntensity: .04 });
    const gold = new THREE.MeshStandardMaterial({ color: 0xcda654, metalness: .8, roughness: .25 });
    const glass = new THREE.MeshPhysicalMaterial({ color: 0xbdd7ff, metalness: .05, roughness: .06, transmission: 0, ior: 1.45, transparent: true, opacity: .022, depthWrite: false, side: THREE.DoubleSide, clearcoat: .3, envMapIntensity: .12 });
    function box(w, h, d, x, y, z, material) {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material); m.position.set(x, y, z); scene.add(m); return m;
    }
    box(4.2, .17, 3.5, 0, .03, 0, baseMat).receiveShadow = true;
    box(4.23, .025, 3.53, 0, -.045, 0, gold);
    [-2.06, 2.06].forEach(x => [-1.71, 1.71].forEach(z => box(.012, height, .012, x, height / 2 + .12, z, gold)));
    [-1.71, 1.71].forEach(z => box(4.12, .012, .012, 0, height + .12, z, gold));
    [-2.06, 2.06].forEach(x => box(.012, .012, 3.42, x, height + .12, 0, gold));
    [-2.05, 2.05].forEach(x => box(.012, height, 3.4, x, height / 2 + .12, 0, glass));
    [-1.7, 1.7].forEach(z => box(4.1, height, .012, 0, height / 2 + .12, z, glass));
    box(4.1, .012, 3.4, 0, height + .12, 0, glass);
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.8, .009, 5, 100), new THREE.MeshBasicMaterial({ color: 0x416bce, transparent: true, opacity: .5 }));
    ring.rotation.x = -Math.PI / 2; ring.position.y = -.13; scene.add(ring);
    const draco = new DRACOLoader().setDecoderPath('./assets/models/draco/').setWorkerLimit(1);
    const loader = new GLTFLoader().setDRACOLoader(draco);
    v.draco = draco;
    const gltf = await loader.loadAsync(`./assets/models/${kind}.glb`);
    const model = gltf.scene;
    const bounds = new THREE.Box3().setFromObject(model);
    const size = bounds.getSize(new THREE.Vector3()); const center = bounds.getCenter(new THREE.Vector3());
    const scale = Math.min(3.55 / size.x, (height - .25) / size.y, 2.85 / size.z);
    const assembly = new THREE.Group(); assembly.add(model);
    // Geometry stays in its source coordinate system until the complete display copy is normalised.
    if (kind === 'arena') {
      const [seat, response] = await Promise.all([loader.loadAsync('./assets/models/seat.glb'), fetch('./assets/models/seats.json')]);
      if (!response.ok) throw new Error('Chair placement data unavailable');
      const seats = await response.json();
      const conversion = new THREE.Matrix4().makeRotationX(-Math.PI / 2);
      const inverse = conversion.clone().invert();
      seat.scene.traverse(mesh => {
        if (!mesh.isMesh) return;
        const material = mesh.material.clone(); material.color.set(mesh.material.name.includes('Navy') ? 0x172d4c : 0x101820); material.roughness = .7;
        // One in two chairs in the browser copy; all 13,332 instances remain in the native source.
        const count = Math.ceil(seats.length / 2);
        const instances = new THREE.InstancedMesh(mesh.geometry, material, count);
        const matrix = new THREE.Matrix4();
        for (let i = 0; i < count; i++) {
          matrix.fromArray(seats[i * 2].matrix).transpose(); matrix.premultiply(conversion).multiply(inverse);
          instances.setMatrixAt(i, matrix);
        }
        instances.instanceMatrix.needsUpdate = true; instances.computeBoundingSphere(); assembly.add(instances);
      });
    }
    assembly.scale.setScalar(scale);
    assembly.position.set(-center.x * scale, .14 - bounds.min.y * scale, -center.z * scale);
    scene.add(assembly);
    model.traverse(mesh => { if (mesh.isMesh) { mesh.frustumCulled = true; mesh.castShadow = true; mesh.receiveShadow = true; for (const mat of (Array.isArray(mesh.material) ? mesh.material : [mesh.material])) mat.envMapIntensity = .38; } });
    v.scene = scene; v.camera = camera; v.ready = true;
    const pause = el.querySelector('[data-control="pause"]');
    function updatePause() { pause.textContent = say(v.running ? 'pause' : 'play'); pause.setAttribute('aria-pressed', String(!v.running)); }
    v.updatePause = updatePause; updatePause();
    function paint() { controls.update(); renderer.render(scene, camera); }
    function loop() {
      v.frame = 0;
      if (!v.visible || document.hidden || !v.ready) return;
      paint();
      if (v.running || v.interacting || v.settling > 0) { v.settling = Math.max(0, (v.settling || 0) - 1); v.frame = requestAnimationFrame(loop); }
    }
    v.wake = () => { if (!v.frame) v.frame = requestAnimationFrame(loop); };
    pause.addEventListener('click', () => { v.running = !v.running; controls.autoRotate = v.running; updatePause(); v.wake(); });
    controls.addEventListener('start', () => { v.interacting = true; v.wake(); });
    controls.addEventListener('end', () => { v.interacting = false; v.settling = 40; v.wake(); });
    el.querySelector('[data-control="reset"]').addEventListener('click', () => { camera.position.copy(initial); controls.target.set(0, height * .47, 0); v.settling = 40; v.wake(); });
    for (const [action, factor] of [['in', .82], ['out', 1.22]]) el.querySelector(`[data-control="${action}"]`).addEventListener('click', () => {
      const offset = camera.position.clone().sub(controls.target); offset.setLength(THREE.MathUtils.clamp(offset.length() * factor, 4.8, 14)); camera.position.copy(controls.target).add(offset); v.settling = 40; v.wake();
    });
    const visibility = new IntersectionObserver(entries => { v.visible = entries[0].isIntersecting; if (v.visible) v.wake(); }, { threshold: .02 }); visibility.observe(el); v.visibility = visibility;
    const resize = new ResizeObserver(() => { const rect = el.querySelector('.model-canvas').getBoundingClientRect(); if (!rect.width || !rect.height) return; renderer.setSize(rect.width, rect.height, false); camera.aspect = rect.width / rect.height; camera.updateProjectionMatrix(); v.wake(); });
    resize.observe(el.querySelector('.model-canvas')); v.resize = resize;
    el.classList.add('model-ready'); el.querySelectorAll('.model-controls button').forEach(button => button.disabled = false);
    announce(v, 'ready'); v.wake();
    renderer.domElement.addEventListener('webglcontextlost', event => { event.preventDefault(); v.ready = false; el.classList.remove('model-ready'); el.querySelectorAll('.model-controls button').forEach(button => button.disabled = true); announce(v, 'fallback'); });
    renderer.domElement.addEventListener('webglcontextrestored', () => { v.ready = true; el.classList.add('model-ready'); el.querySelectorAll('.model-controls button').forEach(button => button.disabled = false); announce(v, 'ready'); v.wake(); });
  } catch (error) { console.warn('Model display unavailable:', el.dataset.model, error.message); announce(v, 'fallback'); v.renderer?.dispose(); }
}

const lazy = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { lazy.unobserve(entry.target); openCase(entry.target); } }), { rootMargin: '120px' });
document.querySelectorAll('.model-stage').forEach(el => lazy.observe(el));
document.addEventListener('visibilitychange', () => { if (!document.hidden) viewers.forEach(v => v.wake?.()); });
new MutationObserver(() => viewers.forEach(v => { announce(v, v.statusKey); v.updatePause?.(); v.renderer?.domElement.setAttribute('aria-label', `${v.el.closest('.model-exhibit').querySelector('h2').textContent} · 3D`); })).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
reduced.addEventListener('change', () => { if (reduced.matches) viewers.forEach(v => { v.running = false; if (v.controls) v.controls.autoRotate = false; v.updatePause?.(); }); });
window.addEventListener('pagehide', event => { if (event.persisted) return; viewers.forEach(v => { cancelAnimationFrame(v.frame); v.resize?.disconnect(); v.visibility?.disconnect(); v.controls?.dispose(); v.draco?.dispose(); v.scene?.traverse(o => { o.geometry?.dispose(); const materials = Array.isArray(o.material) ? o.material : o.material ? [o.material] : []; materials.forEach(m => { Object.values(m).forEach(x => { if (x?.isTexture) x.dispose(); }); m.dispose(); }); }); v.env?.dispose(); v.renderer?.dispose(); }); });
