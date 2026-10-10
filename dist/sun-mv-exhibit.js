// 代码影像 / Code films: the room for 《没了我你依然拥有太阳》.
// Stage (live WebGL title writing, sun-mv-stage.js), a torn-paper theater with the opening and muted
// excerpts that change through a paper tear, a 15-scene film map with a running playhead, the song,
// the making-of. Renders into [data-sun-mv]; re-renders on language change, keeping the current clip.
import {getLanguage,onLanguageChange} from './i18n.js';
import {isMotionPaused,onMotionChange} from './motion-state.js';
import {sunMvAsset,sunMvLinks,sunMvSong,sunMvSpecs,sunMvFilm,sunMvReel,sunMvPipeline} from './sun-mv-content.js';
import {mountSunStage} from './sun-mv-stage.js';

const en=()=>getLanguage()==='en';
const t=(zh,e)=>en()?e:zh;
const ic=id=>`<svg class="ic" aria-hidden="true"><use href="./assets/flow/current-icons.svg#${id}"></use></svg>`;
const FILM_END=293;
const tc=s=>`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
// a ragged rice-paper edge for the screen, regenerated per render (seeded so it stays put)
function tornEdge(seed=7){
  let r=seed;const rnd=()=>{r=(r*16807)%2147483647;return r/2147483647;};
  const pts=[],j=(a)=>(rnd()-.5)*a;
  for(let x=0;x<=100;x+=2.5)pts.push(`${(x+j(.8)).toFixed(2)}% ${(1.1+j(1.6)).toFixed(2)}%`);
  for(let y=0;y<=100;y+=3.5)pts.push(`${(99+j(1.2)).toFixed(2)}% ${(y+j(.8)).toFixed(2)}%`);
  for(let x=100;x>=0;x-=2.5)pts.push(`${(x+j(.8)).toFixed(2)}% ${(98.6+j(1.8)).toFixed(2)}%`);
  for(let y=100;y>=0;y-=3.5)pts.push(`${(.9+j(1.2)).toFixed(2)}% ${(y+j(.8)).toFixed(2)}%`);
  return `polygon(${pts.join(',')})`;
}

function markup(){
  const song=sunMvSong;
  return `<div class="smv-head"><h2 id="smv-title">${t('用代码，写一支 MV。','A music video, written in code.')}</h2><p>${t('第一个代码视频，也是第一支 MV。没有一个镜头是拍的：每个字在被唱出的那一刻写下，太阳是一枚朱砂印，撕裂是唯一的转场。','My first code video and my first music video. No shot was filmed: every character is written as it is sung, the sun is a cinnabar seal, and tearing is the only transition.')}</p></div>
  <div class="smv-stage" data-smv-stage><canvas aria-hidden="true"></canvas>
    <div class="smv-stage-top"><span>ChefZC / Code film 01</span><span>${song.titleEn}</span></div>
    <div class="smv-stage-foot">
      <div class="smv-name"><h3 lang="zh-CN">${song.title}</h3><p>${t(`黄霄雲 演唱 / 词曲 黄霄雲、施牧辰`,`Sung by Huang Xiaoyun / words and music by Huang Xiaoyun and Shi Muchen`)}</p></div>
      <div class="smv-actions"><button type="button" class="smv-btn smv-btn--main" data-smv-play="opening">${t('看开场，带毛笔声','Watch the opening, with the brush')} ${ic('arrow-down')}</button><a class="smv-btn" href="${sunMvLinks.repo}" target="_blank" rel="noopener noreferrer">GitHub ${ic('arrow-up-right')}</a></div>
    </div>
    <div class="smv-progress" aria-hidden="true"><i></i></div>
    <p class="smv-hint">${t('移动光标，光会照亮旧墨；点一下，纸会裂开。','Move the cursor and light raises the old ink; click and the sheet cracks.')}</p>
  </div>
  <dl class="smv-specs">${sunMvSpecs.map(([v,zh,e])=>`<div><dt>${v}</dt><dd>${t(zh,e)}</dd></div>`).join('')}</dl>
  <div class="smv-theater" id="smv-theater">
    <div class="smv-screen-wrap"><div class="smv-screen-rim" aria-hidden="true" style="clip-path:${tornEdge(11)}"></div><div class="smv-screen" data-smv-screen style="clip-path:${tornEdge(7)}">
      <video class="smv-video is-front" playsinline muted loop preload="metadata" aria-label="${t('MV 片段','Film excerpt')}"></video><video class="smv-video" playsinline muted loop preload="none" aria-hidden="true"></video>
      <span class="smv-seam" aria-hidden="true"></span>
    </div>
      <div class="smv-screen-meta"><span data-smv-now></span><span data-smv-tc>0:00</span><button type="button" class="smv-sound" data-smv-sound aria-pressed="false">${t('开声音','Sound on')}</button></div>
    </div>
    <ol class="smv-reel" aria-label="${t('选择片段','Choose an excerpt')}">${sunMvReel.map((c,i)=>`<li><button type="button" data-smv-clip="${c.id}" aria-pressed="${i===0}"><b>${tc(c.t)}</b><span>${t(c.zh,c.en)}</span>${c.sound?`<em>${t('有声','sound')}</em>`:''}</button></li>`).join('')}</ol>
  </div>
  <div class="smv-map"><div class="smv-map-head"><h3>${t('十五个场景，四分五十三秒','Fifteen scenes, four minutes fifty-three')}</h3><p>${t('朱砂色的场景里，有歌中的“你”。','Cinnabar scenes hold the song’s “you”.')}</p></div>
    <div class="smv-map-bar" role="list">${sunMvFilm.map(s=>`<button type="button" role="listitem" class="smv-seg${s.you?' is-you':''}" style="flex:${s.t1-s.t0}" data-smv-seg="${s.id}" aria-label="${tc(s.t0)} ${t(s.zh[0],s.en[0])}"><span>${t(s.zh[0],s.en[0])}</span></button>`).join('')}<i class="smv-head-line" data-smv-playhead aria-hidden="true"></i></div>
    <p class="smv-map-info" data-smv-info aria-live="polite"></p>
  </div>
  <div class="smv-notes">
    <section class="smv-song"><h3>${t('这首歌','The song')}</h3>
      <dl>${song.credits.map(([zh,e,vz,ve])=>`<div><dt>${t(zh,e)}</dt><dd>${t(vz,ve)}</dd></div>`).join('')}</dl>
      <p>${t('歌名本身就是不对称的：离开的是“我”，太阳留给“你”。我听到的是放手：从一个人的世界里退出来，同时相信那里的光并不取决于自己。这首歌在 2019 年写下，五年后才发行。','The title is itself asymmetric: “I” am the one who leaves, and the sun stays with “you”. What I hear is letting go: stepping out of someone’s world while trusting that the light there never depended on you. It was written in 2019 and released five years later.')}</p>
      <p>${t('所以画面里，朱砂只属于“你”：印做成的太阳、习字格、伤口一样的碎片。冷、墨和距离属于“我”。破碎是转场的语法，安静是一种材料。','So in the picture cinnabar belongs only to “you”: the seal-sun, the practice grid, the wound-like shard. Cold, ink and distance belong to “me”. Fracture is the grammar of every transition, and silence is a material.')}</p>
      <p class="smv-rights">${t('歌曲录音与歌词版权归原作者。这里只放静音的画面节选，以及没有原曲的原创开场。','The recording and lyrics belong to their authors. This room shows only muted excerpts of the picture and the original opening, which has no song in it.')}</p>
    </section>
    <section class="smv-make"><h3>${t('它是怎么做出来的','How it was made')}</h3><p>${t('和 Claude 一起，用 TypeScript、three.js、Python 音频分析和 ffmpeg 完成。','Made with Claude, in TypeScript, three.js, Python audio analysis and ffmpeg.')}</p>
      <ol>${sunMvPipeline.map(([zh,e,dz,de])=>`<li><b>${t(zh,e)}</b><p>${t(dz,de)}</p></li>`).join('')}</ol>
    </section>
  </div>
  <div class="smv-foot"><a href="${sunMvLinks.repo}" target="_blank" rel="noopener noreferrer">${t('GitHub：源码与做法','GitHub: source and method')} ${ic('arrow-up-right')}</a><a href="${sunMvLinks.post}">${t('读这支 MV 的手记','Read the note on the film')} ${ic('arrow-up-right')}</a><a href="${sunMvLinks.now}">${t('这次的 Now','The Now entry')} ${ic('arrow-up-right')}</a></div>`;
}

let stage=null,current='opening',root=null;
function clipSrc(c){return `${sunMvAsset}${c.file}.mp4`;}
function setInfo(id){
  const s=sunMvFilm.find(x=>x.id===id);const info=root.querySelector('[data-smv-info]');if(!s||!info)return;
  info.innerHTML=`<b>${tc(s.t0)}–${tc(s.t1)}</b> <span>${t(s.zh[0],s.en[0])}</span> ${t(s.zh[1],s.en[1])}`;
  root.querySelectorAll('[data-smv-seg]').forEach(b=>b.classList.toggle('is-active',b.dataset.smvSeg===id));
}
function show(id,{tear=true}={}){
  const clip=sunMvReel.find(c=>c.id===id)||sunMvReel[0];current=clip.id;
  const screen=root.querySelector('[data-smv-screen]');const [a,b]=screen.querySelectorAll('video');
  const front=a.classList.contains('is-front')?a:b,back=front===a?b:a;
  back.src=clipSrc(clip);back.poster=`${sunMvAsset}${clip.file}.jpg`;back.muted=!(clip.sound&&root.querySelector('[data-smv-sound]').getAttribute('aria-pressed')==='true');
  back.currentTime=0;const p=back.play();p?.catch(()=>{});
  const seam=screen.querySelector('.smv-seam');
  const swap=()=>{front.pause();front.classList.remove('is-front');back.classList.add('is-front');back.removeAttribute('aria-hidden');front.setAttribute('aria-hidden','true');back.style.clipPath='';};
  if(tear&&!isMotionPaused()){
    // a paper tear sweeps right to left: the new picture shows through the ragged line
    const line=(x)=>{const pts=[];for(let y=0;y<=100;y+=5){const jx=x+Math.sin(y*1.7+x)*2.2+((y*37)%7-3)*.6;pts.push(`${jx.toFixed(2)}% ${y}%`);}return pts;};
    const poly=x=>`polygon(${line(x).join(',')},100% 100%,100% 0%)`;
    const frames=[110,70,30,-10].map(x=>({clipPath:poly(x)}));
    back.style.clipPath=poly(110);back.classList.add('is-tearing');
    const anim=back.animate(frames,{duration:900,easing:'cubic-bezier(.65,0,.2,1)'});
    seam.animate([{left:'105%',opacity:1},{left:'-8%',opacity:1}],{duration:900,easing:'cubic-bezier(.65,0,.2,1)'});
    anim.finished.then(()=>{back.classList.remove('is-tearing');swap();}).catch(swap);
  }else swap();
  root.querySelectorAll('[data-smv-clip]').forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.smvClip===clip.id)));
  root.querySelector('[data-smv-now]').textContent=t(clip.zh,clip.en);
  const sound=root.querySelector('[data-smv-sound]');sound.hidden=!clip.sound;
  setInfo(clip.scene);
}
let headRaf=0;
function playhead(){
  headRaf=0;if(!root?.isConnected)return;
  const clip=sunMvReel.find(c=>c.id===current);const v=root.querySelector('.smv-video.is-front');
  const time=clip.t+(v&&!isNaN(v.currentTime)?v.currentTime:0);
  const bar=root.querySelector('[data-smv-playhead]');if(bar)bar.style.left=`${(time/FILM_END*100).toFixed(3)}%`;
  const tcEl=root.querySelector('[data-smv-tc]');if(tcEl)tcEl.textContent=tc(time);
  if(!document.hidden)headRaf=requestAnimationFrame(playhead);
}
function render(){
  root=document.querySelector('[data-sun-mv]');if(!root)return;
  stage?.destroy();
  root.innerHTML=markup();
  stage=mountSunStage(root.querySelector('[data-smv-stage]'));
  const v=root.querySelector('.smv-video.is-front'),clip=sunMvReel.find(c=>c.id===current)||sunMvReel[0];
  v.src=clipSrc(clip);v.poster=`${sunMvAsset}${clip.file}.jpg`;
  const io=new IntersectionObserver(es=>{for(const e of es){const vid=root.querySelector('.smv-video.is-front');if(!vid)continue;if(e.isIntersecting&&!isMotionPaused())vid.play().catch(()=>{});else vid.pause();}},{threshold:.25});
  io.observe(root.querySelector('[data-smv-screen]'));
  show(current,{tear:false});
  if(!headRaf)headRaf=requestAnimationFrame(playhead);
}
document.addEventListener('click',e=>{
  if(!root)return;
  const clip=e.target.closest('[data-smv-clip]');if(clip&&root.contains(clip)){show(clip.dataset.smvClip);return;}
  const seg=e.target.closest('[data-smv-seg]');if(seg&&root.contains(seg)){const c=sunMvReel.find(r=>r.scene===seg.dataset.smvSeg);if(c)show(c.id);else setInfo(seg.dataset.smvSeg);return;}
  const play=e.target.closest('[data-smv-play]');if(play&&root.contains(play)){const s=root.querySelector('[data-smv-sound]');s.setAttribute('aria-pressed','true');s.textContent=t('关声音','Sound off');show('opening');const v=root.querySelector('.smv-video.is-front');v.muted=false;v.currentTime=0;v.play().catch(()=>{});root.querySelector('#smv-theater').scrollIntoView({behavior:isMotionPaused()?'auto':'smooth',block:'center'});return;}
  const sound=e.target.closest('[data-smv-sound]');if(sound&&root.contains(sound)){const on=sound.getAttribute('aria-pressed')!=='true';sound.setAttribute('aria-pressed',String(on));sound.textContent=on?t('关声音','Sound off'):t('开声音','Sound on');const v=root.querySelector('.smv-video.is-front');v.muted=!on;if(on)v.play().catch(()=>{});}
});
document.addEventListener('pointerover',e=>{const seg=e.target.closest?.('[data-smv-seg]');if(seg&&root?.contains(seg))setInfo(seg.dataset.smvSeg);});
document.addEventListener('focusin',e=>{const seg=e.target.closest?.('[data-smv-seg]');if(seg&&root?.contains(seg))setInfo(seg.dataset.smvSeg);});
onMotionChange(()=>{const v=root?.querySelector('.smv-video.is-front');if(!v)return;if(isMotionPaused())v.pause();else v.play().catch(()=>{});});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!headRaf)headRaf=requestAnimationFrame(playhead);});
onLanguageChange(render);
render();
