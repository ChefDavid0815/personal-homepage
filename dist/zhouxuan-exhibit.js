// 影像作品 / Films: the room for 《周旋》.
// A live stage (the crayon-thread heart held up by lines, zhouxuan-heart.js), a screen hung on two crayon
// lines that swings when the excerpt changes through a circling wipe, a film map drawn as one thread with a
// knot per section, the song and the making-of. Renders into [data-zhouxuan]; re-renders on language change.
import {getLanguage,onLanguageChange} from './i18n.js';
import {isMotionPaused,onMotionChange} from './motion-state.js';
import {zxAsset,zxLinks,zxSong,zxSpecs,zxFilm,zxFilmEnd,zxReel,zxPipeline} from './zhouxuan-content.js';
import {mountHeart,CRAYON} from './zhouxuan-heart.js';

const en=()=>getLanguage()==='en';
const t=(zh,e)=>en()?e:zh;
const ic=id=>`<svg class="ic" aria-hidden="true"><use href="./assets/flow/current-icons.svg#${id}"></use></svg>`;
const tc=s=>`${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;

function markup(){
  const s=zxSong;
  return `<div class="zx-head"><h2 id="zx-title">${t('一颗被线撑着的心。','A heart held up by lines.')}</h2><p>${t('第二支代码 MV。封面上那团彩色乱线缠成的心变成立体的，被四面八方的线撑在半空；画面踩着 123 BPM 切，每个字都按笔顺写进画面。','A second code music video. The cover’s tangle of coloured crayon becomes a 3D heart held in mid-air by lines from every side; cuts land on 123 BPM and every character is written into the picture in stroke order.')}</p></div>
  <div class="zx-stage" data-zx-stage><canvas aria-hidden="true"></canvas>
    <div class="zx-stage-top"><span>ChefZC / Code film 02</span><span class="zx-bpm"><i aria-hidden="true"></i>123 BPM</span></div>
    <div class="zx-stage-foot">
      <div class="zx-name"><h3 lang="zh-CN">${s.title}</h3><p>${t('王以太 & 艾热AIR / 词曲 王以太、艾热AIR','Yitai Wang & AIR / words and music by Yitai Wang and AIR')}</p></div>
      <div class="zx-actions"><button type="button" class="zx-btn zx-btn--main" data-zx-play="opening">${t('看冷开场，带蜡笔声','Watch the cold open')} ${ic('arrow-down')}</button><a class="zx-btn" href="${zxLinks.post}">${t('读手记','Read the note')} ${ic('arrow-up-right')}</a></div>
    </div>
    <p class="zx-hint">${t('划过一根线，它会震；点一下，再抛进一根线。','Sweep across a line to pluck it; click to throw in another thread.')}</p>
  </div>
  <dl class="zx-specs">${zxSpecs.map(([v,zh,e])=>`<div><dt>${v}</dt><dd>${t(zh,e)}</dd></div>`).join('')}</dl>
  <div class="zx-theater" id="zx-theater">
    <div class="zx-hang" data-zx-hang>
      <svg class="zx-strings" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true"><path d="M1.5 30 Q26 14 50 1" stroke="${CRAYON[0]}"/><path d="M98.5 30 Q74 14 50 1" stroke="${CRAYON[4]}"/></svg><i class="zx-nail" aria-hidden="true"></i>
      <div class="zx-screen" data-zx-screen>
        <video class="zx-video is-front" playsinline muted loop preload="metadata" aria-label="${t('MV 片段','Film excerpt')}"></video><video class="zx-video" playsinline muted loop preload="none" aria-hidden="true"></video>
        <svg class="zx-wipe" viewBox="-50 -50 100 100" aria-hidden="true">${CRAYON.map((c,i)=>`<circle r="${38+i*1.6}" stroke="${c}" stroke-dasharray="${30+i*9} ${14+i*5}" transform="rotate(${i*47})"/>`).join('')}</svg>
      </div>
    </div>
    <div class="zx-meta"><span data-zx-now></span><span data-zx-tc>0:00</span><button type="button" class="zx-sound" data-zx-sound aria-pressed="false">${t('开声音','Sound on')}</button></div>
    <ol class="zx-reel" aria-label="${t('选择片段','Choose an excerpt')}">${zxReel.map((c,i)=>`<li><button type="button" data-zx-clip="${c.id}" aria-pressed="${i===0}"><b>${tc(c.t)}</b><span>${t(c.zh,c.en)}</span>${c.sound?`<em>${t('有声','sound')}</em>`:''}</button></li>`).join('')}</ol>
  </div>
  <div class="zx-map"><div class="zx-map-head"><h3>${t('一根线，九段','One thread, nine sections')}</h3><p>${t('打了彩色结的段落，封面那颗心在画面里。','Where the knot is coloured, the cover’s heart is on screen.')}</p></div>
    <div class="zx-thread" data-zx-thread><svg aria-hidden="true"></svg><div class="zx-knots" role="list">${zxFilm.map(f=>`<button type="button" role="listitem" class="zx-knot${f.heart?' is-heart':''}" data-zx-seg="${f.id}" style="left:${(f.t0/zxFilmEnd*100).toFixed(3)}%;width:${((f.t1-f.t0)/zxFilmEnd*100).toFixed(3)}%" aria-label="${tc(f.t0)} ${t(f.zh[0],f.en[0])}"><span>${t(f.zh[0],f.en[0])}</span></button>`).join('')}</div><i class="zx-bead" data-zx-bead aria-hidden="true"></i></div>
    <p class="zx-map-info" data-zx-info aria-live="polite"></p>
  </div>
  <div class="zx-notes">
    <section class="zx-song"><h3>${t('这首歌','The song')}</h3>
      <dl>${s.credits.map(([zh,e,vz,ve])=>`<div><dt>${t(zh,e)}</dt><dd>${t(vz,ve)}</dd></div>`).join('')}</dl>
      <p>${t('我听到的是一个处在下风的人：他宁愿被利用、被索取，也好过现在收到的冷淡。他希望对方在和他周旋，而他一再让步；可现实里，对方连这场周旋都不愿意参与。','What I hear is someone on the losing side of a love: he would rather be used, asked for things, taken advantage of, than meet the coldness he gets now. He wishes she were the one manoeuvring while he kept giving way; in fact she will not even play.')}</p>
      <p>${t('所以全片的母题是封面那颗彩色乱线缠成的心：所有的线都从它来，又回到它。没有人物，只有立体的墨蓝「我」和纸白「你」；每个画面最多一个陶土红，点出那一点不甘。','So the motif is the cover’s heart of tangled coloured lines: every line comes out of it and goes back. There are no figures, only a solid ink-blue 我 and a paper-white 你; each frame allows at most one clay red, for the part that will not give up.')}</p>
      <p class="zx-rights">${t('歌曲录音与歌词版权归原作者。每一句歌词都写在画面里，所以这里只放不含歌词的静音节选，以及没有原曲的原创冷开场。','The recording and lyrics belong to their authors. Every lyric line is written into the picture, so this room shows only lyric-free muted excerpts and the original cold open, which has no song in it.')}</p>
    </section>
    <section class="zx-make"><h3>${t('它是怎么做出来的','How it was made')}</h3><p>${t('和 Claude 一起，用 TypeScript、three.js、Python 音频分析和 ffmpeg 完成。','Made with Claude, in TypeScript, three.js, Python audio analysis and ffmpeg.')}</p>
      <ol>${zxPipeline.map(([zh,e,dz,de])=>`<li><b>${t(zh,e)}</b><p>${t(dz,de)}</p></li>`).join('')}</ol>
    </section>
  </div>
  <div class="zx-foot"><a href="${zxLinks.post}">${t('读这支 MV 的手记','Read the note on the film')} ${ic('arrow-up-right')}</a><a href="${zxLinks.now}">${t('这次的 Now','The Now entry')} ${ic('arrow-up-right')}</a></div>`;
}

let heart=null,current='opening',root=null,threadRo=null;
const clipSrc=c=>`${zxAsset}${c.file}.mp4`;
function setInfo(id){
  const f=zxFilm.find(x=>x.id===id);const info=root.querySelector('[data-zx-info]');if(!f||!info)return;
  info.innerHTML=`<b>${tc(f.t0)}–${tc(f.t1)}</b> <span>${t(f.zh[0],f.en[0])}</span> ${t(f.zh[1],f.en[1])}`;
  root.querySelectorAll('[data-zx-seg]').forEach(b=>b.classList.toggle('is-active',b.dataset.zxSeg===id));
}
// the film as one thread: a level line with a knot (a little loop) in the middle of every section
function drawThread(){
  const host=root?.querySelector('[data-zx-thread]');if(!host)return;const svg=host.querySelector('svg');
  const W=host.clientWidth,H=host.clientHeight||120,y=H*.62;svg.setAttribute('viewBox',`0 0 ${W} ${H}`);
  let base=`M0 ${y}`;const knots=[];
  zxFilm.forEach(f=>{
    const x0=f.t0/zxFilmEnd*W,x1=f.t1/zxFilmEnd*W,mx=(x0+x1)/2,r=Math.max(5,Math.min(H*.26,Math.sqrt(x1-x0)*2.4));
    // a real loop: the thread rises, goes all the way round and crosses itself, drifting forward as it turns
    const pts=[];for(let k=0;k<=28;k++){const th=k/28*Math.PI*2;pts.push([mx+r*Math.sin(th)+(k/28-.5)*r*1.1,y-r*(1-Math.cos(th))]);}
    const loop=pts.map(p=>`L${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(' ');
    base+=' '+loop;knots.push({f,loop:'M'+loop.slice(1)});
  });
  base+=` L${W} ${y}`;
  const colored=knots.filter(k=>k.f.heart).map(k=>CRAYON.map((c,j)=>`<path d="${k.loop}" stroke="${c}" transform="translate(${(j-3)*1.1} ${(j-3)*.8})" class="zx-knot-color"/>`).join('')).join('');
  svg.innerHTML=`<path class="zx-thread-base" d="${base}"/><path class="zx-thread-lit" d="${base}" pathLength="1000" data-zx-lit/>${colored}`;
}
function show(id,{wipe=true}={}){
  const clip=zxReel.find(c=>c.id===id)||zxReel[0];current=clip.id;
  const screen=root.querySelector('[data-zx-screen]');const [a,b]=screen.querySelectorAll('video');
  const front=a.classList.contains('is-front')?a:b,back=front===a?b:a;
  back.src=clipSrc(clip);back.poster=`${zxAsset}${clip.file}.jpg`;back.muted=!(clip.sound&&root.querySelector('[data-zx-sound]').getAttribute('aria-pressed')==='true');
  back.currentTime=0;back.play()?.catch(()=>{});
  const swap=()=>{front.pause();front.classList.remove('is-front');back.classList.add('is-front');back.removeAttribute('aria-hidden');front.setAttribute('aria-hidden','true');back.style.clipPath='';};
  if(wipe&&!isMotionPaused()){
    // the new excerpt opens in a circle while crayon rings wind round it; the hung screen swings
    const ease='cubic-bezier(.7,0,.2,1)';
    back.style.clipPath='circle(0% at 50% 50%)';back.classList.add('is-wiping');
    const anim=back.animate([{clipPath:'circle(0% at 50% 50%)'},{clipPath:'circle(75% at 50% 50%)'}],{duration:1100,easing:ease});
    screen.querySelector('.zx-wipe').animate([{opacity:0,transform:'scale(.05) rotate(-200deg)'},{opacity:1,offset:.25},{opacity:1,offset:.7},{opacity:0,transform:'scale(1.9) rotate(160deg)'}],{duration:1100,easing:ease});
    root.querySelector('[data-zx-hang]').animate([{transform:'rotate(0)'},{transform:'rotate(-2.2deg)'},{transform:'rotate(1.5deg)'},{transform:'rotate(-.8deg)'},{transform:'rotate(.35deg)'},{transform:'rotate(0)'}],{duration:1700,easing:'ease-out'});
    heart?.pluckAll(.1);
    anim.finished.then(()=>{back.classList.remove('is-wiping');swap();}).catch(swap);
  }else swap();
  root.querySelectorAll('[data-zx-clip]').forEach(btn=>btn.setAttribute('aria-pressed',String(btn.dataset.zxClip===clip.id)));
  root.querySelector('[data-zx-now]').textContent=t(clip.zh,clip.en);
  root.querySelector('[data-zx-sound]').hidden=!clip.sound;
  setInfo(clip.scene);
}
let headRaf=0;
function playhead(){
  headRaf=0;if(!root?.isConnected)return;
  const clip=zxReel.find(c=>c.id===current);const v=root.querySelector('.zx-video.is-front');
  const time=clip.t+(v&&!isNaN(v.currentTime)?v.currentTime:0),p=time/zxFilmEnd;
  const bead=root.querySelector('[data-zx-bead]');if(bead)bead.style.left=`${(p*100).toFixed(3)}%`;
  const lit=root.querySelector('[data-zx-lit]');if(lit)lit.style.strokeDashoffset=String(1000-p*1000);
  const tcEl=root.querySelector('[data-zx-tc]');if(tcEl)tcEl.textContent=tc(time);
  if(!document.hidden)headRaf=requestAnimationFrame(playhead);
}
function render(){
  root=document.querySelector('[data-zhouxuan]');if(!root)return;
  heart?.destroy();threadRo?.disconnect();
  root.innerHTML=markup();
  heart=mountHeart(root.querySelector('[data-zx-stage]'),{threads:matchMedia('(max-width: 700px)').matches?70:100});
  const v=root.querySelector('.zx-video.is-front'),clip=zxReel.find(c=>c.id===current)||zxReel[0];
  v.src=clipSrc(clip);v.poster=`${zxAsset}${clip.file}.jpg`;
  const io=new IntersectionObserver(es=>{for(const e of es){const vid=root.querySelector('.zx-video.is-front');if(!vid)continue;if(e.isIntersecting&&!isMotionPaused())vid.play().catch(()=>{});else vid.pause();}},{threshold:.25});
  io.observe(root.querySelector('[data-zx-screen]'));
  threadRo=new ResizeObserver(drawThread);threadRo.observe(root.querySelector('[data-zx-thread]'));drawThread();
  show(current,{wipe:false});
  if(!headRaf)headRaf=requestAnimationFrame(playhead);
}
document.addEventListener('click',e=>{
  if(!root)return;
  const clip=e.target.closest('[data-zx-clip]');if(clip&&root.contains(clip)){show(clip.dataset.zxClip);return;}
  const seg=e.target.closest('[data-zx-seg]');if(seg&&root.contains(seg)){const c=zxReel.find(r=>r.scene===seg.dataset.zxSeg);if(c)show(c.id);else setInfo(seg.dataset.zxSeg);return;}
  const play=e.target.closest('[data-zx-play]');if(play&&root.contains(play)){const s=root.querySelector('[data-zx-sound]');s.setAttribute('aria-pressed','true');s.textContent=t('关声音','Sound off');show('opening');const v=root.querySelector('.zx-video.is-front');v.muted=false;v.currentTime=0;v.play().catch(()=>{});root.querySelector('#zx-theater').scrollIntoView({behavior:isMotionPaused()?'auto':'smooth',block:'center'});return;}
  const sound=e.target.closest('[data-zx-sound]');if(sound&&root.contains(sound)){const on=sound.getAttribute('aria-pressed')!=='true';sound.setAttribute('aria-pressed',String(on));sound.textContent=on?t('关声音','Sound off'):t('开声音','Sound on');const v=root.querySelector('.zx-video.is-front');v.muted=!on;if(on)v.play().catch(()=>{});}
});
document.addEventListener('pointerover',e=>{const seg=e.target.closest?.('[data-zx-seg]');if(seg&&root?.contains(seg))setInfo(seg.dataset.zxSeg);});
document.addEventListener('focusin',e=>{const seg=e.target.closest?.('[data-zx-seg]');if(seg&&root?.contains(seg))setInfo(seg.dataset.zxSeg);});
onMotionChange(()=>{const v=root?.querySelector('.zx-video.is-front');if(!v)return;if(isMotionPaused())v.pause();else v.play().catch(()=>{});});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&!headRaf)headRaf=requestAnimationFrame(playhead);});
onLanguageChange(render);
render();
