// The owned pages form one hierarchy. Embedded applications keep their own interfaces.
import {schoolProjects} from './school-projects.js';
export const siteRoutes=[
  {id:'profile',file:'profile.html',section:'profile',label:['个人介绍','Profile'],description:['认识作品背后的人。','The person behind the work.']},
  {id:'gallery',file:'gallery.html',section:'gallery',label:['作品集','Gallery'],description:['持续运营的网站与个人项目。','Living sites and personal projects.']},
  {id:'game',file:'game.html',section:'game',label:['游戏房间','Game room'],description:['球场、赛道、开放世界与天空。AC8 / F1 / FH6 / NBA 2K。','The court, the track, the open world and the sky. AC8 / F1 / FH6 / NBA 2K.']},
  {id:'now',file:'now.html',section:'now',label:['近况','Now'],description:['按时间回看每一次开始。','Every beginning, in chronological order.']},
  {id:'posts',file:'posts.html',section:'posts',label:['随笔','Posts'],description:['生活与作品的制作手记。','Notes on making and living.']},
  {id:'usage',file:'usage.html',section:'usage',label:['用量观测站','Pulse'],description:['真实用量记录与创作的节奏。','Recorded usage and the rhythm of making.']},
  {id:'explore',file:'explore.html',section:'explore',label:['流域索引','Flow index'],description:['从一个入口，找到整座个人空间。','Find your way through the whole space.']},
  {id:'school',file:'school-gallery.html',section:'gallery',parent:'gallery',label:['校园实验室','School lab'],description:['INJAZ 商赛作品 NABAT、NeRF 研究与 STRIDE 环境模拟。','NABAT for the INJAZ competition, NeRF research and STRIDE simulation.']},
  {id:'models',file:'models-gallery.html',section:'gallery',parent:'gallery',label:['建模作品','Models'],description:['Chase Center 与 Curry 的建模作品。','Chase Center and Curry model studies.']},
  {id:'films',file:'films.html',section:'gallery',parent:'gallery',label:['影像作品','Films'],description:['用代码渲染的音乐 MV：《周旋》与《没了我你依然拥有太阳》。','Code-rendered music videos: 周旋 and 没了我你依然拥有太阳.']},
  {id:'nerf',file:'nerf.html',section:'gallery',parent:'school',label:['NeRF','NeRF'],description:['神经辐射场的独立研究专题。','An independent radiance-field research project.']},
  {id:'radar',file:'when-to-reset/',section:'explore',parent:'explore',label:['Reset Radar','Reset Radar'],description:['带公开来源的重置线索。','Reset clues with public sources.']},
  {id:'archive',file:'reset-history/',section:'explore',parent:'radar',label:['重置档案','Reset archive'],description:['按时间查阅公开重置记录。','Public reset reports, with timestamps.']},
  {id:'post',file:'post.html',section:'posts',parent:'posts',label:['阅读随笔','Read a note'],description:['一篇随笔的阅读页面。','An individual journal entry.']}
];
const routesById=new Map(siteRoutes.map(route=>[route.id,route]));
export function routeFor(value){
  const url=new URL(value,'https://chefzc.local/');
  let path=url.pathname.replace(/^\/+|\/+$/g,'');
  if(!path||path==='index.html')path='profile.html';
  return siteRoutes.find(route=>route.file.replace(/\/$/,'')===path)||null;
}
export function routeTrail(value){
  const trail=[];let route=routeFor(value);const seen=new Set();
  while(route){if(seen.has(route.id))throw new Error('Cyclic site hierarchy');seen.add(route.id);trail.unshift(route);route=routesById.get(route.parent);}
  return trail;
}
function validId(id){if(typeof id!=='string'||!/^[-\w]{1,100}$/.test(id))throw new TypeError('Invalid content identifier');return id;}
export const projectHref=id=>'./gallery.html?project='+encodeURIComponent(validId(id));
export const articleHref=id=>'./post.html?article='+encodeURIComponent(validId(id));
export const articleReturnHref=id=>'./posts.html#post-'+encodeURIComponent(validId(id));
export function projectLocation(current,id){const url=new URL(current,'https://chefzc.local/');if(id===null)url.searchParams.delete('project');else url.searchParams.set('project',validId(id));return url;}
export function collectionDestinations(projectCount){return[
  {id:'live',href:'./gallery.html#living-sites',label:['持续运营','Living sites'],count:1},
  {id:'main',href:'./gallery.html#projects',label:['主展厅','Main collection'],count:projectCount},
  {id:'school',href:'./school-gallery.html',label:['校园实验室','School lab'],count:schoolProjects.length},
  {id:'models',href:'./models-gallery.html',label:['建模作品','Models'],count:2},
  {id:'films',href:'./films.html',label:['影像作品','Films'],count:2}
];}
