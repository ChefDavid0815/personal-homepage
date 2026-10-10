// Current 2.0: the homepage's own streamline field, here flowing around the version number.
// Shared by the Now entry and the post (cover + article hero). Each window mounts one field; the
// title glyphs are the obstacle, the pointer parts the current, and everything pauses with motion off.
import {getLanguage,onLanguageChange} from './i18n.js';
import {mountCurrentField} from './current-field.js';
import {onFontsActive} from './flow-current.js';

const zh=()=>getLanguage()!=='en';
export const currentReleaseArt=(serial='')=>`<div class="wa wa--current" data-current-window aria-hidden="true"><div class="wa-motif"><canvas></canvas></div><div class="wa-type"><p class="wa-data"><span>ChefZC / Current 2.0${serial?` / ${serial}`:''}</span><span>10 Oct 2026</span></p><div class="wa-head"><strong class="wa-title wa-current-mark" data-current-title><span data-char>2</span><span data-char class="wa-current-dot">.</span><span data-char>0</span></strong><span class="wa-line${zh()?' wa-zh':''}">${zh()?'同一条河，第二程。':'The same river, a second run.'}</span></div></div></div>`;

const fields=new Map();
function glyphsFor(win){
  return ()=>[...win.querySelectorAll('[data-current-title] [data-char]')].map(s=>{const r=s.getBoundingClientRect(),cs=getComputedStyle(s);return {char:s.textContent,x:r.left+r.width/2,y:r.top+r.height/2,size:parseFloat(cs.fontSize),family:cs.fontFamily,weight:cs.fontWeight};});
}
function mount(win){
  if(fields.has(win))return;
  const motif=win.querySelector('.wa-motif');if(!motif)return;
  fields.set(win,mountCurrentField(motif,{glyphs:glyphsFor(win),background:'#0b0d26',density:win.closest('.jr-hero,.article-art')?1.6:2.8}));
}
function sweep(){
  for(const [win,field] of fields)if(!win.isConnected){field.destroy();fields.delete(win);}
  document.querySelectorAll('[data-current-window]').forEach(mount);
}
// The Now entry is static HTML; render its window here so both languages stay in step.
function renderNow(){document.querySelectorAll('[data-current-now]').forEach(host=>{host.innerHTML=currentReleaseArt('030');});}
let queued=false;
new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;sweep();});}).observe(document.documentElement,{childList:true,subtree:true});
onLanguageChange(()=>{renderNow();});
// Cesso arrives from Adobe Fonts after first paint; the current re-reads the numerals when it does.
let timer=0;onFontsActive(()=>{clearTimeout(timer);timer=setTimeout(()=>{for(const f of fields.values())f.refresh?.();},160);});
(document.fonts?.ready||Promise.resolve()).then(()=>{for(const f of fields.values())f.refresh?.();});
renderNow();sweep();
