// 《没了我你依然拥有太阳》 code-film room: a live WebGL2 port of the film's own language.
// A practice sheet written over into night; light follows the pointer and raises the old ink's sheen;
// the cinnabar seal-sun breathes; the title calligraphy is scratched to light stroke by stroke from the
// film's per-pixel writing time (title-time.png) and SDF (title-sdf.png), held, then soaks back into the
// ink; embers fall; a click cracks the sheet. Paused off-screen, in hidden tabs and with motion off.
import {isMotionPaused,onMotionChange} from './motion-state.js';
import {sunMvAsset} from './sun-mv-content.js';

const CYCLE=27,WRITE=15,HOLD_END=21.5,DISSOLVE_END=24.5;
const VERT=`#version 300 es
in vec2 a;out vec2 v;void main(){v=a*.5+.5;gl_Position=vec4(a,0.,1.);}`;
const FRAG=`#version 300 es
precision highp float;precision highp int;
in vec2 v;out vec4 o;
uniform vec2 uRes;uniform float uTime,uTitleT,uDissolve,uPulse,uScale;
uniform vec2 uPtr;uniform float uPtrOn;uniform vec4 uCrack;
uniform sampler2D uSdf;uniform highp sampler2D uTimeTex;uniform vec2 uTimeSize;
uniform vec4 uTitle;uniform vec3 uSun;
const vec3 INK0=vec3(.0015,.0018,.0030),INK1=vec3(.0060,.0070,.0103),INK2=vec3(.0232,.0263,.0356),INK3=vec3(.147,.159,.188);
const vec3 PAPER=vec3(.847,.791,.672),CINNABAR=vec3(.540,.042,.016),GOLD=vec3(1.0,.62,.25);
float h1(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n2(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h1(i),h1(i+vec2(1,0)),f.x),mix(h1(i+vec2(0,1)),h1(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float s=0.,a=.5;for(int i=0;i<4;i++){s+=a*n2(p);p=mat2(1.6,1.2,-1.2,1.6)*p;a*=.5;}return s;}
float decodeT(ivec2 p){vec2 c=texelFetch(uTimeTex,clamp(p,ivec2(0),ivec2(uTimeSize)-1),0).rg*255.;return (c.x*256.+c.y)/1000.;}
float timeAt(vec2 uv){vec2 p=uv*uTimeSize-.5;ivec2 i=ivec2(floor(p));vec2 f=fract(p);
  float a=decodeT(i),b=decodeT(i+ivec2(1,0)),c=decodeT(i+ivec2(0,1)),d=decodeT(i+ivec2(1,1));float m=min(min(a,b),min(c,d));
  a=a>60.?m:a;b=b>60.?m:b;c=c>60.?m:c;d=d>60.?m:d;return mix(mix(a,b,f.x),mix(c,d,f.x),f.y);}
vec2 vor(vec2 p){vec2 i=floor(p),f=fract(p);float d1=8.,d2=8.;for(int y=-1;y<=1;y++)for(int x=-1;x<=1;x++){vec2 g=vec2(x,y);vec2 r=g+vec2(h1(i+g),h1(i+g+19.1))-f;float d=dot(r,r);if(d<d1){d2=d1;d1=d;}else if(d<d2)d2=d;}return vec2(sqrt(d1),sqrt(d2));}
void main(){
  vec2 q=vec2(gl_FragCoord.x,uRes.y-gl_FragCoord.y)/uScale; // css px from top-left
  vec2 R=uRes/uScale;
  // the sheet: night ink, old characters' oil-smoke sheen under a raking light, rice-paper fibres
  vec3 col=INK0;
  float mott=fbm(q*.004+3.1);col=mix(col,INK1,smoothstep(.35,.85,mott));
  vec2 lp=uPtrOn>.5?uPtr:vec2(R.x*.18,R.y*.12);
  float light=exp(-length(q-lp)/(R.x*.32));
  float old=0.;
  for(int k=0;k<3;k++){float fk=float(k);vec2 s=q*(.010+fk*.004)+vec2(fk*7.3,fk*3.1);
    float w=abs(fbm(vec2(s.x*.7,s.y*2.2))-.5);old+=smoothstep(.022,.0,w)*(.5-fk*.14)*smoothstep(.3,.7,n2(s*.6+fk));}
  col+=INK2*old*(.10+1.15*light);
  col+=INK3*old*.08*light*light;
  float fib=n2(vec2(q.x*.9,q.y*.045)+fbm(q*.02))*n2(vec2(q.x*.045,q.y*.9));
  col+=INK2*smoothstep(.6,.95,fib)*(.12+.7*light);
  // a real sun: granulated photosphere with limb darkening, rotating sunspots, a thin chromosphere,
  // prominences licking the limb and coronal streamers; the brightest thing in the night
  float sunM=0.;vec2 sp=(q-uSun.xy)/uSun.z;float d=length(sp);vec2 dir=sp/max(d,1e-3);
  float flick=.94+.06*uPulse;
  // outer glow and corona streamers (radial structure from the angle, slowly drifting outward)
  float glow=exp(-max(d-1.,0.)*2.6)*.55+exp(-max(d-1.,0.)*7.)*.9;
  float streak=pow(fbm(dir*2.3+vec2(uTime*.015,0.))*fbm(dir*5.1-vec2(0.,uTime*.02)),1.4);
  float corona=streak*exp(-max(d-1.,0.)*1.5)*smoothstep(.98,1.06,d)*2.2;
  col+=vec3(1.0,.62,.30)*glow*flick*.55+vec3(1.0,.80,.55)*corona*flick*.5;
  // prominences: hot tongues rising off the limb
  if(d>.97&&d<1.25){float h=(d-1.)/.25;
    float tongue=fbm(dir*7.+vec2(-uTime*.08,h*3.2))*fbm(dir*13.+vec2(uTime*.05,-h*2.));
    float prom=smoothstep(.17,.32,tongue)*(1.-smoothstep(.0,1.,h))*smoothstep(-.2,.05,h);
    col+=vec3(1.0,.28,.08)*prom*2.2*flick;}
  // chromosphere: a thin pink-red rim
  col+=vec3(1.0,.32,.18)*smoothstep(.035,.0,abs(d-1.008))*1.6;
  if(d<1.){
    float mu=sqrt(max(1.-d*d,0.));
    // sphere coordinates so granules foreshorten toward the limb; the surface turns slowly
    vec2 surf=vec2(asin(clamp(sp.x/max(sqrt(1.-sp.y*sp.y),1e-3),-1.,1.))+uTime*.012,asin(clamp(sp.y,-1.,1.)));
    vec2 g1=vor(surf*22.+vec2(0.,uTime*.03)),g2=vor(surf*55.-uTime*.02);
    float cellA=smoothstep(.75,.05,g1.x)*smoothstep(.0,.16,g1.y-g1.x),cellB=smoothstep(.7,.05,g2.x);float gran=cellA*.7+cellB*.3;
    float super=fbm(surf*4.+uTime*.01);
    // limb darkening (quadratic law) and colour temperature from white-hot centre to orange edge
    float ld=1.-.62*(1.-mu)-.18*(1.-mu)*(1.-mu);
    vec3 hot=mix(vec3(1.0,.09,.01),vec3(1.0,.34,.06),pow(mu,.5));hot=mix(hot,vec3(1.0,.56,.20),pow(mu,5.)*.55);
    float I=ld*(.66+.34*gran+.10*super);
    // faculae: bright patches near the limb
    I+=smoothstep(.55,.85,fbm(surf*9.+3.))*(1.-mu)*.35;
    // sunspots: umbra and penumbra, carried round by the rotation
    float spots=0.;
    for(int k=0;k<3;k++){float fk=float(k);vec2 c=vec2(mod(.5*fk-.6+uTime*.012+1.6,3.2)-1.6,-.25+.32*fk);
      float r=length((surf-c)*vec2(1.,1.15))*(1.+.35*(fbm(surf*18.+fk)-.5));float sz=.045+.03*h1(vec2(fk,2.));
      float pen=smoothstep(sz*1.9,sz*1.2,r)*(.75+.25*n2(surf*80.));float umb=smoothstep(sz*.75,sz*.35,r);
      spots=max(spots,pen*.55+umb*.4);}
    I*=1.-spots;
    vec3 photo=hot*I*(2.0*flick);
    float edge=smoothstep(1.,.992,d);
    col=mix(col,photo,edge);sunM=edge;
  }
  // the title, scratched to light in stroke order
  vec2 tu=(q-uTitle.xy)/uTitle.zw;
  if(tu.x>0.&&tu.y>0.&&tu.x<1.&&tu.y<1.&&uTitleT>-.5){
    float sv=texture(uSdf,tu).r*255.;
    float sd=(sv-128.)/4.;
    float tm=timeAt(tu),age=uTitleT-tm;
    float written=smoothstep(-.02,.03,age);
    float erode=uDissolve*(1.2+22.*(1.-smoothstep(.4,.9,fib))+7.*(n2(q*.03)-.3));
    float wpx=max(fwidth(sd),1e-3)*(1.+2.*uDissolve);
    float ink=smoothstep(-wpx,wpx,sd-erode)*written;
    float halo=exp(-max(-sd,0.)/5.)*written*(1.-uDissolve);
    float fresh=exp(-max(age,0.)/.55)*written;
    vec3 lit=PAPER*(1.05+.35*light)+GOLD*fresh*1.4;
    col=mix(col,lit,ink);
    col+=PAPER*halo*.16+GOLD*fresh*halo*.35;
  }
  // embers
  for(int i=0;i<34;i++){float fi=float(i);
    float sx=h1(vec2(fi,1.3)),sy=h1(vec2(fi,7.7)),spd=.012+.02*h1(vec2(fi,3.1));
    float y=fract(sy+uTime*spd)*(R.y+40.)-20.;float x=sx*R.x+sin(uTime*.4+fi)*18.;
    float rr=.8+1.8*h1(vec2(fi,9.2));float e=exp(-dot(q-vec2(x,y),q-vec2(x,y))/(rr*rr));
    float fl=.5+.5*sin(uTime*(1.5+h1(vec2(fi,5.))*3.)+fi);
    col+=mix(CINNABAR*2.2,GOLD*1.6,h1(vec2(fi,2.2)))*e*(.35+.65*fl);}
  // a click cracks the sheet: hairlines spread from the point, lit from behind, then close
  if(uCrack.w>0.){float age=uCrack.z;vec2 cp=q-uCrack.xy;float dc=length(cp);
    float reach=age*900.;vec2 vv=vor(q*.018+uCrack.xy*.001);float edge=smoothstep(.06,.0,vv.y-vv.x);
    float m=smoothstep(reach,reach-120.,dc)*exp(-age*1.6);
    col+=PAPER*edge*m*1.6+CINNABAR*edge*m*.6;}
  // tone: keep ink black, whiten extremes toward paper; vignette; paper tooth; grain
  vec2 vc=v-.5;col*=1.-.55*dot(vc,vc)*1.6;
  col=col/(1.+col*.42);
  col=mix(col,PAPER,smoothstep(1.,2.2,max(col.r,max(col.g,col.b)))*.4*(1.-sunM));
  col+=(h1(gl_FragCoord.xy+fract(uTime)*91.)-.5)*.012;
  o=vec4(pow(max(col,0.),vec3(1./2.2)),1.);
}`;

function compile(gl,type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;}
async function texture(gl,url,unit,linear){
  const blob=await (await fetch(url)).blob();
  const img=await createImageBitmap(blob,{colorSpaceConversion:'none',premultiplyAlpha:'none'});
  const t=gl.createTexture();gl.activeTexture(gl.TEXTURE0+unit);gl.bindTexture(gl.TEXTURE_2D,t);
  gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL,gl.NONE);
  gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA8,gl.RGBA,gl.UNSIGNED_BYTE,img);
  const f=linear?gl.LINEAR:gl.NEAREST;gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,f);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,f);
  gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);
  return {t,w:img.width,h:img.height};
}

export function mountSunStage(host){
  const canvas=host.querySelector('canvas');const gl=canvas?.getContext('webgl2',{antialias:false,alpha:false,powerPreference:'high-performance'});
  if(!gl){host.dataset.stage='static';return {destroy(){}};}
  let prog,loc={},raf=0,visible=false,disposed=false,start=performance.now(),crack={x:0,y:0,t:-9},ptr={x:0,y:0,on:0},scale=1,W=0,H=0,ready=false,timeTex;
  try{
    prog=gl.createProgram();gl.attachShader(prog,compile(gl,gl.VERTEX_SHADER,VERT));gl.attachShader(prog,compile(gl,gl.FRAGMENT_SHADER,FRAG));gl.linkProgram(prog);
    if(!gl.getProgramParameter(prog,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(prog));
  }catch(e){host.dataset.stage='static';console.warn(e);return {destroy(){}};}
  gl.useProgram(prog);
  for(const n of ['uRes','uTime','uTitleT','uDissolve','uPulse','uScale','uPtr','uPtrOn','uCrack','uSdf','uTimeTex','uTimeSize','uTitle','uSun'])loc[n]=gl.getUniformLocation(prog,n);
  const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),gl.STATIC_DRAW);
  const al=gl.getAttribLocation(prog,'a');gl.enableVertexAttribArray(al);gl.vertexAttribPointer(al,2,gl.FLOAT,false,0,0);
  Promise.all([texture(gl,sunMvAsset+'title-sdf.png',0,true),texture(gl,sunMvAsset+'title-time.png',1,false)]).then(([,tt])=>{timeTex=tt;gl.uniform1i(loc.uSdf,0);gl.uniform1i(loc.uTimeTex,1);gl.uniform2f(loc.uTimeSize,tt.w,tt.h);ready=true;host.dataset.stage='live';frame(performance.now());wake();}).catch(e=>{host.dataset.stage='static';console.warn(e);});
  function layout(){
    const b=host.getBoundingClientRect();W=b.width;H=b.height;scale=Math.min(devicePixelRatio||1,1.5)*(W>1200?.85:1);
    canvas.width=Math.round(W*scale);canvas.height=Math.round(H*scale);gl.viewport(0,0,canvas.width,canvas.height);
    const portrait=H>W*.9;
    const tw=portrait?W*.92:Math.min(W*.62,H*1.2*1.885),th=tw*870/1640;
    const tx=portrait?(W-tw)/2:W*.06,ty=portrait?H*.16:H*.5-th*.48;
    const sr=portrait?W*.19:Math.min(W,H)*.19;const sx=portrait?W*.64:W*.79,sy=portrait?H*.48:H*.36;
    gl.uniform4f(loc.uTitle,tx,ty,tw,th);gl.uniform3f(loc.uSun,sx,sy,sr);gl.uniform2f(loc.uRes,canvas.width,canvas.height);gl.uniform1f(loc.uScale,scale);
  }
  function frame(now){
    if(!ready)return;
    const still=isMotionPaused();const t=still?18:((now-start)/1000)%CYCLE;const tSec=(now-start)/1000;
    const titleT=t<WRITE?t:t<DISSOLVE_END?WRITE+2:-1;const dissolve=t<HOLD_END?0:Math.min(1,(t-HOLD_END)/(DISSOLVE_END-HOLD_END));
    gl.uniform1f(loc.uTime,still?40:tSec);gl.uniform1f(loc.uTitleT,titleT);gl.uniform1f(loc.uDissolve,t<DISSOLVE_END?dissolve:1);
    gl.uniform1f(loc.uPulse,still?.5:.5+.5*Math.sin(tSec*1.35));
    gl.uniform2f(loc.uPtr,ptr.x,ptr.y);gl.uniform1f(loc.uPtrOn,ptr.on);
    const ca=(now-crack.t)/1000;gl.uniform4f(loc.uCrack,crack.x,crack.y,ca,ca<3&&!still?1:0);
    gl.drawArrays(gl.TRIANGLES,0,3);
    host.style.setProperty('--title-progress',Math.max(0,Math.min(1,titleT/WRITE)).toFixed(3));
    host.dataset.phase=t<WRITE?'write':t<HOLD_END?'hold':t<DISSOLVE_END?'dissolve':'night';
  }
  const running=()=>visible&&!document.hidden&&!isMotionPaused()&&ready&&!disposed;
  function loop(now){raf=0;frame(now);if(running())raf=requestAnimationFrame(loop);}
  function wake(){if(!raf&&running())raf=requestAnimationFrame(loop);else if(!running())frame(performance.now());}
  const ro=new ResizeObserver(()=>{layout();frame(performance.now());});ro.observe(host);layout();
  const io=new IntersectionObserver(es=>{visible=es[0].isIntersecting;if(visible&&!raf)start=performance.now()-((performance.now()-start)%(CYCLE*1000));wake();},{threshold:.05});io.observe(host);
  const move=e=>{const b=host.getBoundingClientRect();ptr={x:e.clientX-b.left,y:e.clientY-b.top,on:1};};
  host.addEventListener('pointermove',move,{passive:true});host.addEventListener('pointerleave',()=>{ptr.on=0;});
  host.addEventListener('pointerdown',e=>{if(e.target.closest('a,button'))return;const b=host.getBoundingClientRect();crack={x:e.clientX-b.left,y:e.clientY-b.top,t:performance.now()};wake();});
  const offMotion=onMotionChange(wake);document.addEventListener('visibilitychange',wake);
  canvas.addEventListener('webglcontextlost',e=>{e.preventDefault();host.dataset.stage='static';});
  return {destroy(){disposed=true;cancelAnimationFrame(raf);ro.disconnect();io.disconnect();offMotion();document.removeEventListener('visibilitychange',wake);}};
}
