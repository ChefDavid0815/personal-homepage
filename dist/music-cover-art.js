import { songs, favouriteAlbums, artists } from './music-data.js';
import { getLanguage, onLanguageChange } from './i18n.js';
import { canAnimate, onMotionChange } from './motion-state.js';

// Each treatment follows the inspected cover composition, not the song title.
// The original artwork remains the texture. These are procedural cinemagraphs,
// not official animated covers, AI-generated performances, or music videos.
const treatments={
  '003DFRzD192KKD':['garden',4,'#baca95'], '002N4fUq1kRST2':['earth',5,'#e7caa7'],
  '002Neh8l0uciQZ':['ember',3,'#e6bd75'], '001L7UIu3GXVtT':['mist',1,'#c5d8db'],
  '003y8dsH2wBHlo':['mist',1,'#d7dbe2'], '000QgFcm0v8WaF':['water',1,'#9ecee4'],
  '000K9Zp13TZp5s':['chroma',2,'#ef9bdc'], '000dcZ9I1nzO62':['chroma',2,'#af89ec'],
  '002YFufr4bXZyI':['chroma',2,'#fc7b92'], '0049MVh824D7bM':['etching',5,'#d5bbdf'],
  '002F059l1kCcdr':['chroma',2,'#ef99d2'], '003ROVwj4PqLPa':['water',1,'#80aaf2'],
  '002PjDkE14OUkV':['print',5,'#edcd67'], '001mvhPh0qevad':['silver',0,'#e6dec9'],
  '000GDz8k03UOaI':['silver',0,'#cab8ea'], '003J6fvc0bVJon':['garden',4,'#bad8a3'],
  '002X5NAN24f6TQ':['etching',5,'#eec9a5'], '001uaPM93kxk1R':['mist',1,'#bbd9ab'],
  '000VYwco34rVYK':['print',5,'#ced8bb'], '0029eCfb2nbbVm':['water',1,'#91b3d0'],
  '004JTrIH0sTFo8':['ember',3,'#dac18b'], '0035f8nw11cjkf':['garden',4,'#d9e8b9'],
  '002CJON012PxwU':['mist',1,'#cfecf1'], '0011dW8j0CePOv':['paper',0,'#d7c098'],
  '000LfSb70Ewn3w':['ember',3,'#d6b981'], '0048UsY21HmoMU':['mist',1,'#b9cecf'],
  '004045x24ewU7g':['etching',5,'#c6a96e'], '002JsU5q10jUBt':['stars',3,'#bba6ed'],
  '002JALay3zCS22':['mist',1,'#9fbfc9'], '001gqOnU3DTg2S':['silver',0,'#cad1df'],
  '002C0kX720gMQi':['garden',4,'#ccd4b4'], '003nbc0602Tgfx':['ember',3,'#e9bd93'],
  '0024bjiL2aocxT':['silver',0,'#d7c9bd'], '000MkMni19ClKG':['paper',0,'#d9c797'],
};
const descriptions={
  portrait:['肖像 · 柔光','PORTRAIT / SOFT LIGHT','让光缓慢经过画面。人物保持原来的神情，镜头带来细微景深。','Slow light across the portrait; a quiet shift in perspective.'],
  garden:['庭院 · 风迹','GARDEN / IN THE BREEZE','沿着草木的方向，让微小光点和风的痕迹轻轻流过。','Drifting light follows the garden, like a breeze through the frame.'],
  earth:['枝条 · 尘光','EARTH / TRACES OF LIGHT','土壤的颗粒、枝条的线，沿着画面慢慢浮动，像一阵刚刚经过的风。','Dust and delicate currents move around the branches, as if a breeze just passed.'],
  mist:['薄雾 · 浮动','MIST / SLOWLY DRIFTING','雾气轻轻穿过背景，让静止的空间多一层呼吸。','A veil of mist drifts through the background, giving stillness a little breath.'],
  water:['水面 · 涟漪','WATER / QUIET RIPPLES','水与空气之间，细小涟漪和冷色微光慢慢展开。','Cool light and small ripples unfold between water and air.'],
  chroma:['色彩 · 折射','CHROMA / REFRACTED LIGHT','沿着封面原有的色彩，让彩色光带缓慢交错。','Ribbons of light move through the colors already in the cover.'],
  ember:['暖光 · 微尘','AMBER / SUSPENDED DUST','暖色尘粒悬浮在画面里，像一束光照进了唱片的世界。','Warm particles hang in the air, as if light entered the record’s world.'],
  stars:['夜色 · 星屑','NIGHT / A LITTLE STARDUST','星点缓慢漂移，紫色微光留在夜色里。','Slowly drifting stars and violet light linger in the night.'],
  etching:['线条 · 回响','LINES / AN ECHO','让纤细的光纹沿图案流动，画面依然保留原来的轮廓。','Fine threads of light travel across the pattern without losing its shape.'],
  print:['套色 · 光影','PRINT / LAYERS OF LIGHT','印刷色块与纹理之间，有缓慢变化的光影层次。','Slowly changing light between printed colors and textures.'],
  silver:['银盐 · 光幕','SILVER / A VEIL OF LIGHT','黑白层次、胶片颗粒与柔和的掠光，让画面安静地动起来。','Soft light and fine grain bring quiet movement to the monochrome image.'],
  paper:['旧照 · 日光','MEMORY / AFTERNOON LIGHT','让温暖的光慢慢移过旧照片，把时间留在画面里。','Warm light passes over the photograph, leaving time inside the frame.']
};
const metadata=new Map([...songs,...favouriteAlbums].map(s=>[s.cover.split('/').pop(),{cover:s.cover,title:s.album||s.title,artist:s.artist}]));
export function coverDirection(cover){return treatments[cover.split('/').pop().replace(/\.[^.]+$/,'')]||['portrait',0,'#dfc8de'];}
const c=(zh,en)=>getLanguage()==='en'?en:zh;

const vertex=`attribute vec2 a_position; varying vec2 v_uv; void main(){v_uv=a_position*.5+.5;gl_Position=vec4(a_position,0.,1.);}`;
const fragment=`precision highp float;
uniform sampler2D u_image; uniform float u_time; uniform float u_mode; uniform vec2 u_pointer; uniform vec3 u_tint; varying vec2 v_uv;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
void main(){
 vec2 uv=v_uv;float t=u_time;float edge=smoothstep(0.,.13,uv.x)*smoothstep(0.,.13,1.-uv.x)*smoothstep(0.,.16,uv.y)*smoothstep(0.,.16,1.-uv.y);
 float background=smoothstep(.17,.49,length((uv-vec2(.51,.55))*vec2(1.,.72)));
 vec2 drift=vec2(sin(t*.12),cos(t*.09))*.003+u_pointer*.007;
 vec2 sampleUV=uv+drift*edge*(.28+background*.72);
 if(u_mode>0.5&&u_mode<1.5)sampleUV.x+=sin(uv.y*34.-t*.3)*.004*background*edge;
 if(u_mode>4.5)sampleUV+=vec2(sin(uv.y*19.+t*.15),cos(uv.x*22.-t*.12))*.0018*edge;
 vec3 col=texture2D(u_image,clamp(sampleUV,0.001,0.999)).rgb;
 float beam=exp(-pow((uv.x+uv.y*.27-sin(t*.13)*.7-.48)*2.4,2.));
 col+=u_tint*beam*.035*edge;
 if(u_mode>.5&&u_mode<1.5){float mist=noise(uv*3.+vec2(t*.018,-t*.008))*.7+noise(uv*7.-vec2(t*.012,0.))*.3;float veil=smoothstep(.4,.83,mist)*(.15+.5*background)*edge;col=mix(col,u_tint,veil*.22);}
 if(u_mode>1.5&&u_mode<2.5){float ribbon=pow(.5+.5*sin(uv.x*5.+uv.y*3.-t*.23),4.);vec3 spectral=.5+.5*cos(vec3(0.,2.,4.)+uv.y*3.+t*.15);col+=spectral*ribbon*.105*background*edge;}
 if(u_mode>2.5&&u_mode<4.5){
   vec2 p=uv*vec2(18.,22.);p+=vec2(t*.12,t*(u_mode>3.5?.17:.08));vec2 cell=floor(p),f=fract(p)-.5;float rnd=hash(cell);f.x+=sin(t*.2+rnd*8.)*.15;
   float dust=(1.-smoothstep(.012,.065,length(f)))*step(.64,rnd)*(.45+.45*sin(t*.8+rnd*18.));
   float halo=(1.-smoothstep(.015,.19,length(f)))*step(.85,rnd)*.045;
   col+=u_tint*(dust*.4+halo)*edge*(.15+.85*background);
 }
 if(u_mode>4.5){float thread=sin(uv.x*15.+sin(uv.y*11.+t*.18)*1.5-t*.12);float filament=pow(max(thread,0.),32.);col+=u_tint*filament*.048*edge;float dust=noise(uv*90.+t*.018);col+=u_tint*step(.81,dust)*.04*edge;}
 float grain=(hash(uv*vec2(913.,697.)+floor(t*5.))-.5)*.008;col+=grain*edge;
 gl_FragColor=vec4(col,1.);
}`;

const section=document.querySelector('#music');
if(section){
  const instances=new Set(), byImage=new WeakMap();let loop=0,lastFrame=0,time=0,enabled=true,dialogOpen=false,selected;
  const controls=document.createElement('div');controls.className='sleeve-controls';
  controls.innerHTML='<button type="button" class="sleeve-open"><span class="sleeve-aperture" aria-hidden="true">✳</span><span data-sleeve-open></span><b aria-hidden="true">↗</b></button><button type="button" class="sleeve-motion" aria-pressed="true"><i aria-hidden="true"></i><span></span></button>';
  section.querySelector('.music-feature-bottom').before(controls);
  const dialog=document.createElement('dialog');dialog.className='sleeve-theatre';dialog.setAttribute('aria-labelledby','sleeve-title');
  dialog.innerHTML='<button type="button" class="sleeve-close">×</button><header><span class="mono">THE LIVING SLEEVES / CHEFZC</span><span class="mono" data-sleeve-edition></span></header><div class="sleeve-theatre-body"><div class="sleeve-frame"><div class="sleeve-theatre-stage"><img width="640" height="640" alt=""></div><span class="sleeve-frame-corner" aria-hidden="true">+</span><div class="sleeve-frame-caption"><span>ORIGINAL ARTWORK</span><span>MOTION STUDY / 01</span></div></div><div class="sleeve-theatre-copy"><span class="sleeve-scene-label mono"></span><h2 id="sleeve-title"></h2><p class="sleeve-artist"></p><div class="sleeve-rule"></div><p class="sleeve-description"></p><p class="sleeve-disclosure"></p><div class="sleeve-editions"></div><button type="button" class="sleeve-theatre-motion"><span></span><b aria-hidden="true">Ⅱ</b></button></div></div>';
  document.body.append(dialog);const theatreImage=dialog.querySelector('img');
  function renderLabels(){
    controls.querySelector('[data-sleeve-open]').textContent=c('打开封面剧场','Open cover theatre');
    const active=enabled&&canAnimate();
    controls.querySelector('.sleeve-motion').setAttribute('aria-pressed',String(enabled));
    controls.querySelector('.sleeve-motion span').textContent=c(active?'封面动效 · 开':'封面动效 · 关',active?'MOTION / ON':'MOTION / OFF');
    controls.querySelector('.sleeve-motion').setAttribute('aria-label',c(enabled?'暂停封面动效':'开启动效封面',enabled?'Pause cover animation':'Animate covers'));
    dialog.querySelector('.sleeve-close').setAttribute('aria-label',c('关闭封面剧场','Close cover theatre'));
    dialog.querySelector('.sleeve-theatre-motion span').textContent=c(active?'暂停这一刻':'让封面动起来',active?'Hold this moment':'Let it move');
    dialog.querySelector('.sleeve-theatre-motion b').textContent=active?'Ⅱ':'▷';
    dialog.querySelector('.sleeve-theatre-motion').setAttribute('aria-pressed',String(enabled));
    dialog.querySelector('[data-sleeve-edition]').textContent=c('原画面的另一种呼吸','A LITTLE LIFE INSIDE THE FRAME');
    dialog.querySelector('.sleeve-disclosure').textContent=c('基于原封面设计的动态视觉演绎，非官方动态封面或 MV。人物微动与光影不代表真实表演。','A motion study of the original artwork, not an official animated cover or music video. Portrait motion is a visual treatment, not a recorded performance.');
    const editions=dialog.querySelector('.sleeve-editions');
    if(!editions.children.length)editions.innerHTML=favouriteAlbums.map(a=>`<button type="button" data-sleeve-cover="${a.cover}"><span>${a.title}</span><span>↗</span></button>`).join('');
    editions.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(selected?.cover===button.dataset.sleeveCover)));
    if(selected){const direction=coverDirection(selected.cover),description=descriptions[direction[0]];dialog.querySelector('.sleeve-scene-label').textContent=c(description[0],description[1]);dialog.querySelector('.sleeve-description').textContent=c(description[2],description[3]);dialog.querySelector('#sleeve-title').textContent=selected.title;const artist=artists.find(a=>a.key===selected.artist);dialog.querySelector('.sleeve-artist').textContent=getLanguage()==='en'?artist.en:artist.name;}
  }
  function shouldRun(item){return enabled&&canAnimate()&&item.visible&&item.ready&&(!dialogOpen||item.theatre);}
  function frame(now){loop=0;const delta=Math.min((now-lastFrame)/1000,.05);if(now-lastFrame>40){lastFrame=now;time+=delta;for(const item of instances)if(shouldRun(item))item.draw(time);}
    if([...instances].some(shouldRun))loop=requestAnimationFrame(frame);
  }
  function schedule(){if(!loop&&[...instances].some(shouldRun)){lastFrame=performance.now();loop=requestAnimationFrame(frame);}else if(![...instances].some(shouldRun)){cancelAnimationFrame(loop);loop=0;}renderLabels();}
  function compile(gl,type,source){const shader=gl.createShader(type);gl.shaderSource(shader,source);gl.compileShader(shader);if(!gl.getShaderParameter(shader,gl.COMPILE_STATUS)){gl.deleteShader(shader);throw new Error('Cover shader unavailable');}return shader;}
  function enhanceImage(image,theatre=false){
    if(byImage.has(image))return;
    const parent=image.parentElement;parent.classList.add('living-sleeve');
    const canvas=document.createElement('canvas');canvas.className='sleeve-canvas';canvas.setAttribute('aria-hidden','true');parent.append(canvas);
    const gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power',preserveDrawingBuffer:false});
    if(!gl){canvas.remove();return;}
    let program,vs,fs;
    try{vs=compile(gl,gl.VERTEX_SHADER,vertex);fs=compile(gl,gl.FRAGMENT_SHADER,fragment);program=gl.createProgram();gl.attachShader(program,vs);gl.attachShader(program,fs);gl.linkProgram(program);if(!gl.getProgramParameter(program,gl.LINK_STATUS))throw new Error('Cover shader unavailable');}
    catch{canvas.remove();gl.getExtension('WEBGL_lose_context')?.loseContext();return;}
    gl.useProgram(program);gl.deleteShader(vs);gl.deleteShader(fs);
    const buffer=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buffer);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
    const position=gl.getAttribLocation(program,'a_position');gl.enableVertexAttribArray(position);gl.vertexAttribPointer(position,2,gl.FLOAT,false,0,0);
    const texture=gl.createTexture();gl.bindTexture(gl.TEXTURE_2D,texture);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
    const locations=Object.fromEntries(['u_time','u_mode','u_pointer','u_tint'].map(name=>[name,gl.getUniformLocation(program,name)]));
    const item={image,parent,canvas,visible:false,ready:false,theatre,px:0,py:0,revision:0,draw(t){if(!this.ready)return;gl.uniform1f(locations.u_time,t);gl.uniform2f(locations.u_pointer,this.px,this.py);gl.drawArrays(gl.TRIANGLES,0,6);}};
    byImage.set(image,item);instances.add(item);
    const resize=new ResizeObserver(()=>{const width=image.clientWidth,height=image.clientHeight;if(!width||!height)return;const dpr=Math.min(devicePixelRatio,theatre?1.5:1.2);canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);canvas.style.width=width+'px';canvas.style.height=height+'px';gl.viewport(0,0,canvas.width,canvas.height);item.draw(time);});resize.observe(image);
    const visibility=new IntersectionObserver(entries=>{item.visible=entries[0].isIntersecting;schedule();},{rootMargin:'40px'});visibility.observe(image);
    async function load(){const revision=++item.revision;item.ready=false;parent.classList.remove('sleeve-rendered');try{await image.decode();if(revision!==item.revision||!image.isConnected)return;const [name,mode,tint]=coverDirection(image.getAttribute('src'));const hex=tint.slice(1);gl.bindTexture(gl.TEXTURE_2D,texture);gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,image);gl.uniform1f(locations.u_mode,mode);gl.uniform3f(locations.u_tint,parseInt(hex.slice(0,2),16)/255,parseInt(hex.slice(2,4),16)/255,parseInt(hex.slice(4,6),16)/255);parent.dataset.coverScene=name;parent.style.setProperty('--sleeve-tint',tint);item.ready=true;item.draw(time);parent.classList.add('sleeve-rendered');schedule();}catch{/* The original cover remains visible if decode or WebGL fails. */}}
    const change=new MutationObserver(load);change.observe(image,{attributes:true,attributeFilter:['src']});load();
    const move=e=>{if(!enabled||!canAnimate()||e.pointerType==='touch')return;const rect=parent.getBoundingClientRect();item.px=((e.clientX-rect.left)/rect.width-.5)*.55;item.py=((e.clientY-rect.top)/rect.height-.5)*.55;};
    const leave=()=>{item.px=item.py=0;};parent.addEventListener('pointermove',move,{passive:true});parent.addEventListener('pointerleave',leave);
    canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();item.ready=false;parent.classList.remove('sleeve-rendered');schedule();});
    item.dispose=()=>{resize.disconnect();visibility.disconnect();change.disconnect();parent.removeEventListener('pointermove',move);parent.removeEventListener('pointerleave',leave);gl.deleteBuffer(buffer);gl.deleteTexture(texture);gl.deleteProgram(program);instances.delete(item);canvas.remove();parent.classList.remove('sleeve-rendered');};
  }
  function inspect(){for(const item of [...instances])if(!item.image.isConnected)item.dispose();section.querySelectorAll('#music-cover,#music-album-list img').forEach(img=>enhanceImage(img));}
  const observer=new MutationObserver(inspect);observer.observe(section.querySelector('#music-album-list'),{childList:true});inspect();
  const toggle=()=>{enabled=!enabled;schedule();};controls.querySelector('.sleeve-motion').addEventListener('click',toggle);dialog.querySelector('.sleeve-theatre-motion').addEventListener('click',toggle);
  function choose(cover){selected=metadata.get(cover.split('/').pop());if(!selected)return;theatreImage.src=selected.cover;theatreImage.alt=selected.title;dialog.style.setProperty('--sleeve-tint',coverDirection(selected.cover)[2]);renderLabels();}
  controls.querySelector('.sleeve-open').addEventListener('click',()=>{choose(section.querySelector('#music-cover').getAttribute('src'));dialog.showModal();dialogOpen=true;document.body.classList.add('dialog-open');enhanceImage(theatreImage,true);schedule();});
  dialog.querySelector('.sleeve-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{const button=event.target.closest('[data-sleeve-cover]');if(button)choose(button.dataset.sleeveCover);if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  dialog.addEventListener('close',()=>{dialogOpen=false;document.body.classList.remove('dialog-open');controls.querySelector('.sleeve-open').focus({preventScroll:true});schedule();});
  onMotionChange(schedule);onLanguageChange(renderLabels);renderLabels();
}
