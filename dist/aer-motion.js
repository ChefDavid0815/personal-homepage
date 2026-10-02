import {canAnimate,onMotionChange} from './motion-state.js';

// A real ray-marched glass torus; artwork behind it remains the original livery.
const vertex=`attribute vec2 aPosition;void main(){gl_Position=vec4(aPosition,0.,1.);}`;
const fragment=`precision highp float;
uniform vec2 uResolution;uniform vec2 uPointer;uniform float uTime;
mat2 turn(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
float field(vec3 p){p.xz=turn(.30+sin(uTime*.19)*.24+uPointer.x*.15)*p.xz;p.yz=turn(-.28+cos(uTime*.15)*.16+uPointer.y*.12)*p.yz;p.xy=turn(-.22+sin(uTime*.11)*.09)*p.xy;return length(vec2(length(p.xy)-.83,p.z))-.09;}
vec3 normal(vec3 p){vec2 e=vec2(.0015,0.);return normalize(vec3(field(p+e.xyy)-field(p-e.xyy),field(p+e.yxy)-field(p-e.yxy),field(p+e.yyx)-field(p-e.yyx)));}
vec3 sky(vec3 d){vec3 c=mix(vec3(.79,.85,.92),vec3(.98,.99,.96),smoothstep(-.7,.6,d.y));float strip=pow(max(0.,dot(d,normalize(vec3(-.4,.8,.5)))),45.);float edge=pow(max(0.,dot(d,normalize(vec3(.8,-.1,.6)))),70.);c+=strip*.52+edge*vec3(.23,.21,.27);float ribbon=exp(-pow((d.x+d.y*.55+sin(uTime*.21)*.14)*13.,2.));c+=ribbon*.14;return c;}
void main(){vec2 q=(gl_FragCoord.xy-uResolution*.5)/uResolution.y;vec3 ro=vec3(0.,0.,3.4),rd=normalize(vec3(q*2.0,-2.5));float t=0.;vec3 p;bool hit=false;
for(int i=0;i<64;i++){p=ro+rd*t;float d=field(p);if(d<.0013){hit=true;break;}t+=d*.85;if(t>6.)break;}
if(!hit){gl_FragColor=vec4(0.);return;}
vec3 n=normal(p);float facing=clamp(dot(-rd,n),0.,1.);float fresnel=.04+.96*pow(1.-facing,5.);vec3 reflected=sky(reflect(rd,n));vec3 r1=refract(rd,n,1./1.45),r2=refract(rd,n,1./1.46),r3=refract(rd,n,1./1.48);vec3 transmitted=vec3(sky(r1).r,sky(r2).g,sky(r3).b);float spec=pow(max(0.,dot(reflect(-normalize(vec3(-.6,.8,1.5)),n),-rd)),80.);vec3 colour=mix(transmitted,reflected,fresnel);colour=mix(colour,vec3(.73,.85,.93),.10*(1.-facing));colour+=spec*.62;float rim=pow(1.-facing,3.);colour+=rim*vec3(.07,.09,.13);gl_FragColor=vec4(colour,.55+.39*fresnel);}`;
const fields=new Map(),roots=new Set();
let frame=0,last=0,clock=0,lastTick=0;
const observer=new IntersectionObserver(entries=>{
  for(const e of entries){const c=fields.get(e.target);if(c)c.visible=e.isIntersecting;else e.target.dataset.aerVisible=String(e.isIntersecting);}
  sync();
},{rootMargin:'80px 0px'});
function compile(gl,type,source){const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){gl.deleteShader(shader);return null;}return shader;}
function createField(stage){
  const canvas=stage.querySelector('[data-aer-optics]');if(!canvas)return null;
  let gl,program,buffer,shaders=[],uniforms,disposed=false,lost=false,bounds;
  const state={stage,visible:false,pointer:[0,0],target:[0,0],draw,dispose};
  function initialise(){
    gl=canvas.getContext('webgl',{alpha:true,antialias:false,premultipliedAlpha:false,powerPreference:'low-power'});
    if(!gl){stage.dataset.aerRender='fallback';return;}
    const vs=compile(gl,gl.VERTEX_SHADER,vertex),fs=compile(gl,gl.FRAGMENT_SHADER,fragment);
    if(!vs||!fs){if(vs)gl.deleteShader(vs);if(fs)gl.deleteShader(fs);stage.dataset.aerRender='fallback';return;}
    shaders=[vs,fs];program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);
    if(!gl.getProgramParameter(program,gl.LINK_STATUS)){stage.dataset.aerRender='fallback';release();return;}
    buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
    const position=gl.getAttribLocation(program,'aPosition');gl.useProgram(program);gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
    uniforms={size:gl.getUniformLocation(program,'uResolution'),time:gl.getUniformLocation(program,'uTime'),pointer:gl.getUniformLocation(program,'uPointer')};
    stage.dataset.aerRender='webgl';lost=false;resize();draw(clock);
  }
  function resize(){if(disposed||lost||!program)return;const box=stage.getBoundingClientRect();if(box.width<1||box.height<1)return;const dpr=Math.min(devicePixelRatio||1,1.25),scale=Math.min(1,720/Math.max(box.width,box.height));const w=Math.max(1,Math.round(box.width*dpr*scale)),h=Math.max(1,Math.round(box.height*dpr*scale));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h);}draw(clock);}
  function draw(time){if(disposed||lost||!program)return;state.pointer[0]+=(state.target[0]-state.pointer[0])*.08;state.pointer[1]+=(state.target[1]-state.pointer[1])*.08;gl.useProgram(program);gl.uniform2f(uniforms.size,canvas.width,canvas.height);gl.uniform1f(uniforms.time,time);gl.uniform2f(uniforms.pointer,...state.pointer);gl.drawArrays(gl.TRIANGLE_STRIP,0,4);}
  function enter(){bounds=stage.getBoundingClientRect();}
  function move(event){if(!canAnimate()||event.pointerType!=='mouse'||!bounds)return;const x=Math.max(-1,Math.min(1,(event.clientX-bounds.left)/bounds.width*2-1)),y=Math.max(-1,Math.min(1,(event.clientY-bounds.top)/bounds.height*2-1));state.target=[x,y];stage.style.setProperty('--aer-px',`${(x+1)*50}%`);stage.style.setProperty('--aer-py',`${(y+1)*50}%`);stage.style.setProperty('--aer-tilt-x',`${-y*7}deg`);stage.style.setProperty('--aer-tilt-y',`${x*9}deg`);}
  function leave(){state.target=[0,0];bounds=null;for(const key of ['--aer-px','--aer-py','--aer-tilt-x','--aer-tilt-y'])stage.style.removeProperty(key);}
  function release(){if(!gl)return;if(buffer)gl.deleteBuffer(buffer);if(program)gl.deleteProgram(program);shaders.forEach(s=>gl.deleteShader(s));buffer=null;program=null;shaders=[];}
  function contextLost(event){event.preventDefault();lost=true;stage.dataset.aerRender='fallback';sync();}
  function restored(){release();initialise();sync();}
  function dispose(){disposed=true;resizeObserver.disconnect();observer.unobserve(stage);stage.removeEventListener('pointerenter',enter);stage.removeEventListener('pointermove',move);stage.removeEventListener('pointerleave',leave);canvas.removeEventListener('webglcontextlost',contextLost);canvas.removeEventListener('webglcontextrestored',restored);release();gl?.getExtension('WEBGL_lose_context')?.loseContext();}
  const resizeObserver=new ResizeObserver(resize);resizeObserver.observe(stage);
  stage.addEventListener('pointerenter',enter,{passive:true});stage.addEventListener('pointermove',move,{passive:true});stage.addEventListener('pointerleave',leave);
  canvas.addEventListener('webglcontextlost',contextLost);canvas.addEventListener('webglcontextrestored',restored);initialise();
  return state;
}
function tick(time){frame=0;if(!canAnimate())return;const active=[...fields.values()].filter(c=>c.visible&&c.stage.isConnected&&c.stage.dataset.aerRender==='webgl');if(!active.length)return;if(!lastTick||time-lastTick>=32){clock+=last?Math.min((time-last)/1000,.08):0;last=time;lastTick=time;active.forEach(c=>c.draw(clock));}frame=requestAnimationFrame(tick);}
function sync(){const moving=canAnimate();for(const [stage,c] of fields)stage.dataset.aerActive=String(moving&&c.visible);for(const root of roots)root.dataset.aerActive=String(moving&&root.dataset.aerVisible==='true');const active=moving&&[...fields.values()].some(c=>c.visible&&c.stage.isConnected&&c.stage.dataset.aerRender==='webgl');if(active&&!frame){last=0;lastTick=0;frame=requestAnimationFrame(tick);}else if(!active&&frame){cancelAnimationFrame(frame);frame=0;last=0;}if(!moving)for(const c of fields.values()){c.target=[0,0];c.draw(clock);}}
function scan(){
  for(const [stage,c] of fields)if(!stage.isConnected){c.dispose();fields.delete(stage);}
  for(const root of roots)if(!root.isConnected){observer.unobserve(root);roots.delete(root);}
  document.querySelectorAll('[data-aer-scene]').forEach(stage=>{if(!fields.has(stage)){const c=createField(stage);if(c){fields.set(stage,c);observer.observe(stage);}}});
  document.querySelectorAll('.aer-exhibit,.aer-reader').forEach(root=>{if(!roots.has(root)){roots.add(root);observer.observe(root);}});
  sync();
}
const unsubscribe=onMotionChange(sync);
document.addEventListener('aer:render',scan);document.addEventListener('visibilitychange',sync);
window.addEventListener('pagehide',()=>{cancelAnimationFrame(frame);observer.disconnect();for(const c of fields.values())c.dispose();fields.clear();roots.clear();unsubscribe();document.removeEventListener('aer:render',scan);document.removeEventListener('visibilitychange',sync);},{once:true});
scan();
