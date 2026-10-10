import { t, onLanguageChange } from './i18n.js';
import './motion.js';
import './music.js';
import './reset-entrance.js';
import {createCopyTransaction} from './flow-state.js';

const copyButton = document.querySelector('[data-copy-email]');
const announcement = document.querySelector('#copy-announcement');
const copy = createCopyTransaction({
  write:value=>navigator.clipboard.writeText(value),
  onState:state=>{
    if(copyButton){copyButton.disabled=state==='pending';copyButton.setAttribute('aria-busy',String(state==='pending'));}
    if(announcement&&state==='success')announcement.textContent=t('contact.copied');
    if(announcement&&state==='error')announcement.textContent=t('contact.copyFailed');
  }
});
copyButton?.addEventListener('click',()=>copy.copy(copyButton.dataset.copyEmail));
onLanguageChange(()=>{copy.invalidate();if(announcement)announcement.textContent='';});
window.addEventListener('pagehide',event=>{if(!event.persisted)copy.dispose();});
