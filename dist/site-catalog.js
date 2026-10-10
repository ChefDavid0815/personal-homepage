import {siteRoutes,projectHref,articleHref} from './site-routes.js';
import {schoolProjects} from './school-projects.js';
const plain=value=>String(value??'').replace(/<[^>]*>/g,' ');
export function buildCatalog(projects,posts){
  const pages=siteRoutes.filter(r=>!['post','explore','nerf'].includes(r.id)).map(r=>({id:'page:'+r.id,group:'pages',href:'./'+r.file,title:r.label,description:r.description,tags:[]}));
  const works=projects.map(project=>({id:'project:'+project.id,group:'works',href:projectHref(project.id),title:[project.name,project.name],description:[project.description,project.translations?.en?.description||project.description],tags:project.tags||[]}));
  const additions=[
    ...schoolProjects.map(work=>({id:'work:'+work.catalogId,title:work.title,href:work.href,description:work.description})),
    {id:'work:sun-mv',title:['没了我你依然拥有太阳 MV','The Sun MV'],href:'./gallery.html#code-films',description:['第一支代码渲染的音乐 MV，每一帧都由歌曲算出。','A first code-rendered music video, every frame computed from the song.']},
    {id:'work:afterimage',title:['AfterImage','AfterImage'],href:'./gallery.html#living-sites',description:['持续运营的赛车影像档案。','The living motorsport archive.']},
    {id:'work:chase-center',title:['Chase Center','Chase Center'],href:'./models-gallery.html#project-chase-center',description:['球馆内场与建筑外部的建模作品。','Interior and exterior model studies of the arena.']},
    {id:'work:curry',title:['Stephen Curry','Stephen Curry'],href:'./models-gallery.html#project-curry-head',description:['Curry 球员头像的建模作品。','A Curry player-head model study.']}
  ].map(item=>({...item,group:'works',tags:[]}));
  const notes=posts.map(post=>({id:'note:'+post.id,group:'notes',href:articleHref(post.id),title:[plain(post.zh.title),plain(post.en.title)],description:[plain(post.zh.summary),plain(post.en.summary)],tags:[post.date,post.zh.category,post.en.category]}));
  const catalog=[...pages,...works,...additions,...notes];
  if(new Set(catalog.map(item=>item.id)).size!==catalog.length)throw new Error('Duplicate catalogue identity');
  return catalog;
}
export function filterCatalog(catalog,{query='',group='all'}={}){
  const terms=String(query).normalize('NFKC').toLocaleLowerCase().trim().split(/\s+/).filter(Boolean);
  return catalog.filter(item=>(group==='all'||item.group===group)&&terms.every(term=>[...item.title,...item.description,...item.tags].join(' ').normalize('NFKC').toLocaleLowerCase().includes(term)));
}
