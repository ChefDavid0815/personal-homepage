import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// A procedural optical instrument, not a scan visualisation of visitor files.
export function mountLens(host,motion){
 let renderer;try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});}catch{return ()=>{};}
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setClearColor(0,0);renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;
 renderer.domElement.setAttribute('aria-hidden','true');host.append(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(33,1,.1,40);camera.position.set(0,.15,8.8);
 const pmrem=new THREE.PMREMGenerator(renderer),room=new RoomEnvironment(),env=pmrem.fromScene(room,.04);scene.environment=env.texture;room.dispose();pmrem.dispose();
 scene.add(new THREE.HemisphereLight(0xc6fff3,0x123449,2));const key=new THREE.DirectionalLight(0xe9fff9,5);key.position.set(-2,3,4);scene.add(key);const blue=new THREE.PointLight(0x57baff,45,14);blue.position.set(3,-1,3);scene.add(blue);
 const group=new THREE.Group();scene.add(group);
 const metal=new THREE.MeshPhysicalMaterial({color:0x224e50,metalness:.9,roughness:.24,clearcoat:1,envMapIntensity:2.4});
 const chrome=new THREE.MeshStandardMaterial({color:0xc6e9ed,metalness:.95,roughness:.18});
 const glow=new THREE.MeshStandardMaterial({color:0x91ffca,emissive:0x30d4aa,emissiveIntensity:1.4,metalness:.3,roughness:.23});
 const glass=new THREE.MeshPhysicalMaterial({color:0x65ccad,transmission:.8,thickness:.4,roughness:.12,metalness:.1,ior:1.46,transparent:true,opacity:.6,side:THREE.DoubleSide,depthWrite:false});
 const front=new THREE.Group();group.add(front);
 const ring=(radius,tube,z,mat,parent=front)=>{const mesh=new THREE.Mesh(new THREE.TorusGeometry(radius,tube,20,112),mat);mesh.position.z=z;parent.add(mesh);return mesh;};
 ring(1.32,.16,.32,metal);ring(1.35,.022,.49,chrome);ring(1.12,.025,.38,glow);ring(1.3,.11,-.06,metal);ring(1.47,.018,-.22,chrome);ring(.98,.014,-.42,glow);
 const lens=new THREE.Mesh(new THREE.SphereGeometry(1.095,48,32),glass);lens.scale.z=.17;lens.position.z=.24;front.add(lens);
 const screws=new THREE.Group();front.add(screws);for(let i=0;i<8;i++){const a=i*Math.PI/4;const s=new THREE.Mesh(new THREE.CylinderGeometry(.041,.041,.05,8),chrome);s.rotation.x=Math.PI/2;s.position.set(Math.cos(a)*1.32,Math.sin(a)*1.32,.493);screws.add(s);}
 const ticks=new THREE.Group();front.add(ticks);for(let i=0;i<56;i++){const a=i/56*Math.PI*2;const t=new THREE.Mesh(new THREE.BoxGeometry(.012,i%7===0?.09:.038,.018),i%7===0?glow:chrome);t.position.set(Math.sin(a)*1.58,Math.cos(a)*1.58,-.12);t.rotation.z=-a;ticks.add(t);}
 const planes=new THREE.Group();group.add(planes);for(let i=0;i<3;i++){const card=new THREE.Group();card.position.set(-.25+i*.18,-.16+i*.13,-.65-i*.32);card.rotation.z=-.11+i*.075;planes.add(card);const geo=new THREE.BoxGeometry(2.34,1.66,.025);const plate=new THREE.Mesh(geo,new THREE.MeshPhysicalMaterial({color:i===1?0x235555:0x122935,metalness:.5,roughness:.24,transparent:true,opacity:.9,clearcoat:1}));card.add(plate);const edge=new THREE.LineSegments(new THREE.EdgesGeometry(geo),new THREE.LineBasicMaterial({color:i===0?0x72edc0:0x498795,transparent:true,opacity:.8}));card.add(edge);for(let j=0;j<6;j++){const line=new THREE.Mesh(new THREE.BoxGeometry(.42+(j%3)*.24,.022,.008),j%3===0?glow:chrome);line.position.set(-.58+(j%2)*.18,.48-j*.18,.022);card.add(line);}}
 const sweep=new THREE.Mesh(new THREE.PlaneGeometry(2.12,.025),new THREE.MeshBasicMaterial({color:0xadffdc,transparent:true,opacity:.65,blending:THREE.AdditiveBlending,depthWrite:false}));sweep.position.z=.02;front.add(sweep);
 let frame=0,visible=false,disposed=false,elapsed=0,last=0,targetX=0,targetY=0,rotX=0,rotY=0;
 function draw(time){frame=0;if(disposed)return;if(!host.isConnected){dispose();return;}if(time-last>=40||!motion.canAnimate()){const dt=Math.min(.08,Math.max(0,(time-last)/1000));last=time;if(motion.canAnimate())elapsed+=dt;rotX+=(targetX-rotX)*.08;rotY+=(targetY-rotY)*.08;group.rotation.set(-.22+rotY,.38+Math.sin(elapsed*.28)*.16+rotX,-.19);group.position.y=Math.sin(elapsed*.55)*.09;front.position.z=Math.sin(elapsed*.44)*.09;ticks.rotation.z=elapsed*.022;planes.position.z=Math.sin(elapsed*.4)*.08;sweep.position.y=Math.sin(elapsed*.68)*.74;renderer.render(scene,camera);host.classList.add('is-rendered');}if(visible&&motion.canAnimate())frame=requestAnimationFrame(draw);}
 const resume=()=>{cancelAnimationFrame(frame);frame=0;last=performance.now()-41;if(visible)draw(performance.now());};
 const resize=new ResizeObserver(()=>{const r=host.getBoundingClientRect();if(r.width&&r.height){renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.position.z=camera.aspect<.85?10:8.8;camera.updateProjectionMatrix();resume();}});resize.observe(host);
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;resume();},{rootMargin:'40px'});observer.observe(host);
 const unsubscribe=motion.onMotionChange(resume);
 const move=e=>{if(e.pointerType==='touch'||!motion.canAnimate())return;const r=host.getBoundingClientRect();targetX=((e.clientX-r.left)/r.width-.5)*.42;targetY=((e.clientY-r.top)/r.height-.5)*.25;};
 const leave=()=>{targetX=targetY=0;};host.addEventListener('pointermove',move,{passive:true});host.addEventListener('pointerleave',leave);
 const exhibit=host.closest('.exhibit--lens');const mode=e=>{const colors={structure:0x91ffca,signals:0x80bfff,report:0xd0afff};glow.color.setHex(colors[e.detail]||colors.structure);glow.emissive.setHex(colors[e.detail]||colors.structure);resume();};exhibit?.addEventListener('lens-mode',mode);
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();dispose();});
 function dispose(){if(disposed)return;disposed=true;cancelAnimationFrame(frame);resize.disconnect();observer.disconnect();unsubscribe();host.removeEventListener('pointermove',move);host.removeEventListener('pointerleave',leave);exhibit?.removeEventListener('lens-mode',mode);window.removeEventListener('pagehide',onHide);scene.traverse(n=>{n.geometry?.dispose();if(n.material)n.material.dispose();});env.dispose();renderer.dispose();renderer.domElement.remove();host.classList.remove('is-rendered');}
 const onHide=e=>{if(!e.persisted)dispose();};window.addEventListener('pagehide',onHide);
 return dispose;
}
