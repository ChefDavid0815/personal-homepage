import { canAnimate, onMotionChange } from './motion-state.js';
import { setLensMode, lensNowArt } from './projectlens-exhibit.js';
const now=document.querySelector('[data-lens-now]');if(now)now.outerHTML=lensNowArt();
const hosts=new Map();let scheduled=false;
const observer=new IntersectionObserver(entries=>{for(const entry of entries){if(!entry.isIntersecting)continue;observer.unobserve(entry.target);const host=entry.target;import('./atelier-sculpture.bundle.js').then(module=>{if(host.isConnected&&hosts.has(host))hosts.set(host,module.mountLens(host,{canAnimate,onMotionChange}));}).catch(()=>{});}},{rootMargin:'200px'});
function enhance(){scheduled=false;for(const [host,dispose] of hosts)if(!host.isConnected){observer.unobserve(host);dispose?.();hosts.delete(host);}document.querySelectorAll('[data-lens-object]').forEach(host=>{if(hosts.has(host))return;hosts.set(host,null);observer.observe(host);});}
new MutationObserver(()=>{if(!scheduled){scheduled=true;queueMicrotask(enhance);}}).observe(document.body,{childList:true,subtree:true});
document.addEventListener('click',event=>{const button=event.target.closest('[data-lens-mode-button]');if(button)setLensMode(button);});
enhance();
