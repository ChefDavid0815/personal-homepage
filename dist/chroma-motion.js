import {changeChromaView,changeChromaChannel,chromaNowArt} from './chroma-exhibit.js';
document.querySelectorAll('[data-chroma-now]').forEach(root=>{root.outerHTML=chromaNowArt();});
document.addEventListener('click',event=>{
 const view=event.target.closest?.('[data-chroma-view]');if(view)changeChromaView(view);
 const channel=event.target.closest?.('[data-chroma-channel-button]');if(channel)changeChromaChannel(channel);
});
