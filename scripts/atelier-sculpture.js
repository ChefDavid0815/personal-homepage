import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// A small, local, procedural object. No remote model, tracking, or video dependency.
export function mountSculpture(host, motion) {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ alpha:true, antialias:true, powerPreference:'low-power' }); }
  catch { return; }
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.45;
  renderer.domElement.setAttribute('aria-hidden','true');
  host.append(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, .1, 40);
  camera.position.set(0, .1, 7);
  const pmrem = new THREE.PMREMGenerator(renderer);
  const room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, .03);
  scene.environment = environment.texture;
  room.dispose(); pmrem.dispose();
  scene.add(new THREE.HemisphereLight(0xeae3ff, 0x242743, 2));
  const pink = new THREE.PointLight(0xff76bc, 28, 15); pink.position.set(-3,1,3); scene.add(pink);
  const blue = new THREE.PointLight(0x68d8ff, 32, 15); blue.position.set(3,-1,2); scene.add(blue);
  const key = new THREE.DirectionalLight(0xffffff, 4); key.position.set(1,4,4); scene.add(key);
  const object = new THREE.Group(); scene.add(object);
  const pearl = new THREE.MeshPhysicalMaterial({ color:0xb3a1ef, metalness:.38, roughness:.18, clearcoat:1, clearcoatRoughness:.08, iridescence:1, iridescenceIOR:1.6, iridescenceThicknessRange:[180,480], envMapIntensity:1.8 });
  const knot = new THREE.Mesh(new THREE.TorusKnotGeometry(.87,.26,192,28,2,3), pearl);
  knot.rotation.set(.4,-.2,-.35); object.add(knot);
  const chrome = new THREE.MeshPhysicalMaterial({ color:0xd8ff7b, metalness:.55, roughness:.17, clearcoat:1, envMapIntensity:1.6 });
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.7,.028,12,160),chrome);
  ring.rotation.set(1.03,-.22,-.35); object.add(ring);
  const ring2 = new THREE.Mesh(new THREE.TorusGeometry(1.48,.012,8,144),new THREE.MeshStandardMaterial({ color:0xeee8ff,metalness:.75,roughness:.25 }));
  ring2.rotation.set(-.4,.85,.3); object.add(ring2);
  const satellite = new THREE.Mesh(new THREE.SphereGeometry(.17,24,20),chrome);
  satellite.position.set(1.56,.39,.28); object.add(satellite);
  const rose = new THREE.Mesh(new THREE.IcosahedronGeometry(.14,1),new THREE.MeshPhysicalMaterial({color:0xf48dba,metalness:.25,roughness:.15,clearcoat:1}));
  rose.position.set(-1.25,-.88,.52); object.add(rose);
  const satellites = new THREE.Group(); object.add(satellites);
  const dotGeo = new THREE.SphereGeometry(.025,8,6);
  const dotMat = new THREE.MeshBasicMaterial({color:0xe8e5ff});
  for (let i=0;i<18;i++) { const dot=new THREE.Mesh(dotGeo,dotMat), a=i*2.399963; dot.position.set(Math.cos(a)*(1.7+(i%3)*.15),Math.sin(a)*1.55,Math.sin(i*1.8)*.55); satellites.add(dot); }
  let frame=0, visible=true, disposed=false, elapsed=0, previous=0, x=0,y=0, tx=0,ty=0;
  function render(time=0) {
    frame=0;
    if(disposed) return;
    if(time-previous>=32 || !motion.canAnimate()) {
      const dt=Math.min((time-previous)/1000,.06); previous=time;
      if(motion.canAnimate()) elapsed+=dt;
      x+=(tx-x)*.055; y+=(ty-y)*.055;
      object.rotation.set(Math.sin(elapsed*.17)*.13+y,.24+elapsed*.065+x,-.12);
      object.position.y=Math.sin(elapsed*.55)*.075;
      satellites.rotation.z=elapsed*.035;
      renderer.render(scene,camera);
      host.classList.add('is-rendered');
    }
    if(visible&&motion.canAnimate()) frame=requestAnimationFrame(render);
  }
  function resume() { cancelAnimationFrame(frame); frame=0; previous=performance.now()-34; if(visible) render(performance.now()); }
  const resize=new ResizeObserver(()=>{const {width,height}=host.getBoundingClientRect();if(width&&height){renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();resume();}});
  resize.observe(host);
  const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;resume();},{rootMargin:'80px'}); observer.observe(host);
  const unsubscribe=motion.onMotionChange(resume);
  const move=event=>{if(event.pointerType==='touch'||!motion.canAnimate())return;const rect=host.getBoundingClientRect();tx=((event.clientX-rect.left)/rect.width-.5)*.35;ty=((event.clientY-rect.top)/rect.height-.5)*.2;};
  const leave=()=>{tx=ty=0;}; host.addEventListener('pointermove',move,{passive:true});host.addEventListener('pointerleave',leave);
  renderer.domElement.addEventListener('webglcontextlost',event=>{event.preventDefault();host.classList.remove('is-rendered');cancelAnimationFrame(frame);visible=false;});
  renderer.domElement.addEventListener('webglcontextrestored',()=>{visible=true;resume();});
  window.addEventListener('pagehide',event=>{if(event.persisted)return;disposed=true;cancelAnimationFrame(frame);observer.disconnect();resize.disconnect();unsubscribe();scene.traverse(node=>{node.geometry?.dispose();if(node.material)node.material.dispose();});environment.dispose();renderer.dispose();},{once:true});
  resume();
}
