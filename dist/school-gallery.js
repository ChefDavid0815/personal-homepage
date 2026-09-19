import { getLanguage, onLanguageChange } from './i18n.js';
import { wisLinks, wisAsset, wisMark, wisAtmosphere, wisCopy as c } from './wis-exhibit.js';

const root = document.querySelector('#school-exhibition');
const states = [
  { id:'path', number:'01', title:['平整路面','Smooth pavement'], note:['平稳的节奏，留意脚下的路。','A steady rhythm for the ground below.'], signal:['平稳路面 · 缓慢脉冲','Smooth terrain · Slow pulses'], wave:'M0 24H18V12H42V24H76V12H100V24H134V12H158V24H192V12H216V24H250', label:['路面变化','TERRAIN'], value:'03', unit:['mm · 模拟','mm · mock'] },
  { id:'stairs', number:'05', title:['下行楼梯','Downward stairs'], note:['距离变成倒计时，危险提示先于路面提示。','Distance becomes a countdown; urgent warnings come first.'], signal:['下行楼梯 · 长 + 双短脉冲','Stairs ahead · Long + two short'], wave:'M0 24H12V8H77V24H96V8H110V24H127V8H141V24H188V8H250', label:['场景初始距离','SCENE START DISTANCE'], value:'3.8', unit:['m · 模拟','m · mock'] },
  { id:'unknown', number:'09', title:['传感器失效','Sensor uncertainty'], note:['读数不可靠时，先停下来，而不是猜测前路。','When the signal is uncertain, stop before making an assumption.'], signal:['信号不确定 · 停下确认','Signal uncertain · Stop and check'], wave:'M0 24H14V8H61V24H81V8H128V24H148V8H195V24H215V8H250', label:['感知状态','SENSOR STATE'], value:'?', unit:['未知 · 模拟','Unknown · mock'] }
];
let active = 'path';
let motionPaused = false;
const local = pair => pair[getLanguage() === 'en' ? 1 : 0];

function scanDiagram() {
  return `<svg class="wis-map" viewBox="0 0 360 255" aria-hidden="true"><defs><pattern id="wis-grid" width="24" height="24" patternUnits="userSpaceOnUse"><path d="M24 0H0V24" fill="none" stroke="currentColor" stroke-opacity=".1"/></pattern><linearGradient id="wis-cone" x1="0" y1="1" x2="0" y2="0"><stop stop-color="#547b50" stop-opacity=".35"/><stop offset="1" stop-color="#bcd4a8" stop-opacity=".05"/></linearGradient></defs><rect width="360" height="255" fill="url(#wis-grid)"/><path class="wis-path-line" d="M113 255C127 178 151 131 153 0M233 255C212 177 218 113 216 0" fill="none" stroke="currentColor" stroke-opacity=".22"/><g class="wis-canopy" fill="#b8c6a4"><circle cx="80" cy="62" r="30"/><circle cx="278" cy="75" r="35"/><circle cx="63" cy="186" r="37"/><circle cx="300" cy="191" r="29"/></g><path d="M180 213L106 71Q180 28 254 71Z" fill="url(#wis-cone)" stroke="currentColor" stroke-opacity=".15"/><g class="wis-rings" fill="none" stroke="currentColor"><path d="M143 143Q180 122 217 143"/><path d="M122 103Q180 69 238 103"/><path d="M106 71Q180 28 254 71"/></g><path class="wis-stairs" d="M143 97H220V107H143V117H220V127H143" fill="none" stroke="#ba7d4b" stroke-width="2"/><g class="wis-unknown"><circle cx="183" cy="105" r="23" fill="#f7efe0" stroke="#a47b3d"/><text x="183" y="113" text-anchor="middle" fill="#876336" font-family="Georgia,serif" font-size="25">?</text></g><circle class="wis-position" cx="180" cy="212" r="15" fill="none" stroke="#648260"/><circle cx="180" cy="212" r="5" fill="#2b6248"/><path d="M178 202L180 198L182 202" fill="none" stroke="#2b6248"/></svg>`;
}

function render() {
  root.innerHTML = `<article class="wis-exhibit" id="project-wis-tech-tank" aria-labelledby="wis-title">
    <div class="wis-cover"><img class="wis-cover-photo" src="${wisAsset}woodland.webp" width="1536" height="1024" alt="${c('晨光穿过绿意盎然的林间步道，原创环境艺术插画','Original environmental artwork of morning light on a green woodland path')}"><div class="wis-cover-shade"></div>${wisAtmosphere()}
      <div class="wis-cover-top"><span>WIS TECH TANK</span><span class="wis-tag">${c('校园展览 / 001','SCHOOL EXHIBITION / 001')}</span></div>
      <div class="wis-cover-copy"><span class="wis-eyebrow">A STUDY IN PERCEPTION</span><h2 id="wis-title">${wisMark}stride<span>.</span></h2><p>${c('感知多一点，<br>下一步更从容。','A little awareness.<br>A better next step.')}</p></div>
      <div class="wis-cover-bottom"><span>FIELD NOTES<br>SEPTEMBER 2026</span><span class="wis-orbit" aria-hidden="true">↗</span><span>ENVIRONMENT<br>SIMULATION / 0.2.0</span></div>
    </div>
    <div class="wis-editorial"><div class="wis-introduction"><div class="wis-eyebrow"><span>${c('在课堂里，种下一个想法','A CLASSROOM IDEA TAKES ROOT')}</span><span>01 — 09</span></div><h3>${c('把周围的世界，<br>变成温柔的提醒。','The world around us.<br>A gentler kind of signal.')}</h3><p>${c('为 WIS TECH TANK 制作的环境感知模拟工具。让虚拟人物走过九种场景，观察距离、风险、语音与振动怎样一起变化。一个可以暂停、重来，也可以慢慢理解的小世界。','An environmental perception simulator made for WIS TECH TANK. Walk through nine scenarios and see distance, risk, speech and haptic patterns respond together. A little world you can pause, reset and take time to understand.')}</p><div class="wis-actions"><a class="wis-button" href="${wisLinks.app}" target="_blank" rel="noopener noreferrer">${c('打开模拟实验室','Open the simulation lab')} <span>↗</span></a><a class="wis-text-link" href="${wisLinks.source}" target="_blank" rel="noopener noreferrer">GitHub ↗</a></div><div class="wis-specs"><span><b>09</b>${c('模拟环境','ENVIRONMENTS')}</span><span><b>中 / EN</b>${c('双语体验','BILINGUAL')}</span><span><b>Web</b>${c('无需安装','NO INSTALL')}</span></div></div>
    <div class="wis-fieldbook" data-scene="${active}"><div class="wis-fieldbook-head"><span>PERCEPTION FIELD BOOK</span><span>FIG. 01</span></div><div class="wis-fieldbook-visual">${scanDiagram()}<div class="wis-reading"><small data-reading-label></small><b data-reading-value></b><span data-reading-unit></span></div></div><div class="wis-wave"><svg viewBox="0 0 250 38" aria-hidden="true"><path data-wave></path></svg><span data-signal></span></div><div class="wis-scene-buttons" role="group" aria-label="${c('选择展柜示意场景','Choose an illustrated exhibition scene')}">${states.map(s=>`<button type="button" data-scene-choice="${s.id}" aria-pressed="${s.id===active}"><span>${s.number}</span>${local(s.title)}</button>`).join('')}</div><p class="wis-scene-note" data-scene-note role="status" aria-live="polite"></p><p class="wis-caption">${c('展柜示意互动 · 完整的九种模拟请打开实验室','Illustrative exhibit · Open the lab for all nine simulations')}</p></div></div>
    <section class="wis-studio" aria-labelledby="wis-studio-title"><div class="wis-studio-heading"><div><span class="wis-eyebrow">INSIDE THE LAB / 02</span><h3 id="wis-studio-title">${c('让每一个反馈，都看得见。','Make every response visible.')}</h3></div><button class="wis-text-link" type="button" data-wis-enlarge>${c('放大真实界面','View the actual interface')} ↗</button></div><button type="button" class="wis-screenshot" data-wis-enlarge aria-label="${c('放大 STRIDE 真实模拟界面','Enlarge the actual STRIDE simulation interface')}"><span class="wis-window-bar"><i></i><i></i><i></i><span>STRIDE / SIMULATION STUDIO</span><span>↗</span></span><img src="${wisAsset}simulation.png" width="1440" height="1292" loading="lazy" alt="${c('STRIDE 中文界面，下行楼梯的三维示意场景，右侧为语音、振动与传感器反馈','Actual Chinese STRIDE interface: a 3D stairs scenario with speech, haptic and sensor feedback')}"></button><p class="wis-caption">${c('真实软件截图 · 模拟环境与模拟传感器读数','Actual application capture · Simulated environment and sensor readings')}</p></section>
    <div class="wis-observations"><div><span>01 / SENSE</span><h4>${c('先观察。','Start by observing.')}</h4><p>${c('路面、楼梯、障碍与未知信号。调整行走速度，换一个角度，再看看会发生什么。','Terrain, stairs, obstacles and unknown signals. Change walking speed, try another angle and see what follows.')}</p></div><div><span>02 / UNDERSTAND</span><h4>${c('再理解。','Make sense of it.')}</h4><p>${c('距离变成预计到达时间，风险有自己的优先级。判断记录，让过程也能被看懂。','Distance becomes estimated arrival time; risks get priorities. The decision log opens up the process behind each response.')}</p></div><div><span>03 / RESPOND</span><h4>${c('然后回应。','Then respond.')}</h4><p>${c('语音、字幕、波形与马达动画。把抽象的反馈，变成一段能看到、能比较的节奏。','Speech, captions, waveforms and a motor animation turn abstract feedback into patterns you can see and compare.')}</p></div></div>
    <div class="wis-exhibit-foot"><p>${c('课堂概念原型。真实环境模式另有本地视觉模型；不代表经过验证的现实导航设备。','A classroom concept prototype. Real environment mode adds local vision models; this is not a validated real-world navigation device.')}</p><a href="./post.html?article=wis-tech-tank">${c('翻开观察手记','Read the field notes')} <span>↗</span></a></div>
  </article><div class="school-end"><span>GROWING, AT MY OWN PACE.</span><a href="./gallery.html">← ${c('回到主展厅','Back to the personal collection')}</a></div>`;
  updateScene();
  const motionButton=document.createElement('button');
  motionButton.type='button';
  motionButton.className='wis-motion-toggle';
  motionButton.dataset.wisMotion='';
  root.querySelector('.wis-cover').append(motionButton);
  updateMotion();
  if (dialog.open) renderDialog();
}

function updateMotion(){
  root.querySelector('.wis-exhibit').classList.toggle('wis-motion-paused',motionPaused);
  const button=root.querySelector('[data-wis-motion]');
  button.setAttribute('aria-pressed',String(motionPaused));
  button.textContent=motionPaused?c('继续环境动效','Resume motion'):c('暂停环境动效','Pause motion');
}
document.addEventListener('visibilitychange',()=>document.body.classList.toggle('wis-tab-hidden',document.hidden));

function updateScene() {
  const state = states.find(s=>s.id===active);
  const field = root.querySelector('.wis-fieldbook');
  field.dataset.scene = active;
  root.querySelectorAll('[data-scene-choice]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.sceneChoice===active)));
  root.querySelector('[data-reading-label]').textContent=local(state.label);
  root.querySelector('[data-reading-value]').textContent=state.value;
  root.querySelector('[data-reading-unit]').textContent=local(state.unit);
  root.querySelector('[data-wave]').setAttribute('d',state.wave);
  root.querySelector('[data-signal]').textContent=local(state.signal);
  root.querySelector('[data-scene-note]').textContent=local(state.note);
}
const dialog=document.querySelector('#wis-dialog');
function renderDialog() {
  dialog.querySelector('h2').textContent=c('STRIDE · 真实模拟界面','STRIDE · Actual simulation interface');
  dialog.querySelector('img').alt=c('下行楼梯场景的 STRIDE 完整界面','Full STRIDE interface showing the downward-stairs scenario');
  dialog.querySelector('button').setAttribute('aria-label',c('关闭大图','Close image'));
}
let opener=null;
root.addEventListener('click',event=>{
  if(event.target.closest('[data-wis-motion]')){motionPaused=!motionPaused;updateMotion();}
  const scene=event.target.closest('[data-scene-choice]');
  if(scene){active=scene.dataset.sceneChoice;updateScene();}
  const enlarge=event.target.closest('[data-wis-enlarge]');
  if(enlarge){opener=enlarge;renderDialog();dialog.showModal();document.body.classList.add('dialog-open');}
});
dialog.querySelector('button').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
dialog.addEventListener('close',()=>{document.body.classList.remove('dialog-open');if(opener?.isConnected)opener.focus();else root.querySelector('[data-wis-enlarge]')?.focus();});
render();
onLanguageChange(render);
