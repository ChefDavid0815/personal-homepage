import { getLanguage } from './i18n.js';
export const wisLinks = { app: 'https://chefzc-wis-tech-tank.vercel.app', source: 'https://github.com/ChefDavid0815/wis-tech-tank' };
export const wisAsset = './assets/projects/wis-tech-tank/';
export const wisCopy = (zh, en) => getLanguage() === 'en' ? en : zh;
export const wisMark = '<svg viewBox="0 0 40 40" aria-hidden="true"><g fill="currentColor" transform="rotate(-20 20 20)"><rect x="7" y="22" width="5" height="12" rx="2.5"/><rect x="18" y="13" width="5" height="21" rx="2.5"/><rect x="29" y="5" width="5" height="29" rx="2.5"/></g></svg>';
export function wisAtmosphere() { return '<div class="wis-atmosphere" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i><i></i><i></i></div>'; }
export function wisPostArt() {
  return `<div class="post-art post-art--wis" aria-hidden="true"><img src="${wisAsset}woodland.webp" width="1536" height="1024" alt=""><div class="post-art-top"><span>WIS TECH TANK / FIELD NOTES</span><span>006</span></div><div class="wis-post-word">${wisMark}<strong>stride<span>.</span></strong><em>A little awareness.<br>A better next step.</em></div>${wisAtmosphere()}<span class="post-art-foot">A STUDY IN PERCEPTION &nbsp; / &nbsp; 0.2.0</span></div>`;
}
