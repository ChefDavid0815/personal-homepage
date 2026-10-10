export const dotAirAsset='./assets/projects/dot-air/';
export const dotAirLinks={site:'https://dot-air-zzichuan0808-3165s-projects.vercel.app',exhibit:'./gallery.html#project-dot-air',detail:'./gallery.html?project=dot-air',post:'./post.html?article=dot-air',now:'./now.html#milestone-dot-air'};
export const dotAirAirports=[
  {code:'DXB',name:['迪拜','Dubai'],lon:55.37,lat:25.25},
  {code:'LHR',name:['伦敦','London'],lon:-.46,lat:51.47},
  {code:'HND',name:['东京','Tokyo'],lon:139.78,lat:35.55},
  {code:'JFK',name:['纽约','New York'],lon:-73.78,lat:40.64},
  {code:'SIN',name:['新加坡','Singapore'],lon:103.99,lat:1.36}
];
export const dotAirProject={id:'dot-air',name:'DOT/AIR',subtitle:'无限的点，属于你的航线。',layout:'dot-air',category:'A PERSONAL FLIGHT ATLAS',number:'09',color:'vermilion',tags:['React','Three.js','Native WPF'],description:'DOT/AIR 1.1。Orbital Earth 波点地球、机场与行程联动、真实公共航空资料、机队图鉴与 Flight DNA。Web 与原生 Windows 工作台，连接同一个账户与偏好。',demo:false,version:'1.1.0',repoUrl:'',liveUrl:dotAirLinks.site,translations:{zh:{category:'个人航空探索与航班搜索'},en:{subtitle:'Infinite dots. Your own way through the sky.',description:'DOT/AIR 1.1. Orbital Earth, linked airports and itineraries, a dotted Earth, public aviation references, Fleet Atlas and Flight DNA. Web and a native Windows workspace connect to the same account and preferences.'}}};
export const dotAirMessages={
  'gallery.meta':['ChefZC 的数字作品陈列室：DOT/AIR 波点地球、AfterImage 赛车影像档案，以及九件主展厅作品。','ChefZC’s digital collection: DOT/AIR’s dotted Earth, the AFTERIMAGE archive, and nine works in the main room.'],
  'now.dotAirLabel':['个人作品 / 航空探索','PERSONAL WORK / AVIATION'],
  'now.dotAirKicker':['每个点，都可以是出发点','EVERY DOT, A DEPARTURE'],
  'now.dotAirTitle':['DOT/AIR，让世界沿着波点转起来。','DOT/AIR. A world in dots, a sky of your own.'],
  'now.dotAirText':['今天让 DOT/AIR 飞进 Gallery。沿用软件的朱红、黑白波点和宽体字，把真实地理点云做成一颗持续自转的地球：选择机场，同一颗球转向新的坐标。机队图鉴、公共空域资料与 Flight DNA，让航空兴趣和个人偏好都有自己的位置；Web 与原生 Windows 工作台共用账户。','Today DOT/AIR lands in the Gallery. Its vermilion, black-and-white dots and wide lettering frame a rotating Earth built from actual geography. Pick an airport and the same sphere turns to its coordinates. Fleet Atlas, public airspace references and Flight DNA make room for aviation interests and personal preferences; Web and native Windows share an account.'],
  'now.dotAirNote':['公共航空资料版 0.1.0；可售航班与票价尚未接入供应商，不提供预订或出票。','Public-data edition 0.1.0. Live flight inventory and fares await a provider; no booking or ticketing.'],
  'now.dotAirExplore':['走进波点天空','EXPLORE THE DOTTED SKY'],
  'now.dotAirRead':['读这篇出发手记','READ THE DEPARTURE NOTE'],
  'now.dotAirArtLabel':['打开 DOT/AIR 的波点地球展柜','Open the DOT/AIR dotted Earth exhibit'],
  'now.meta':['ChefZC 的近况。2026 年 10 月 9 日，DOT/AIR 的波点地球飞进 Gallery。','Updates from ChefZC. October 9, 2026: DOT/AIR and its dotted Earth land in the Gallery.']
};
export const dotAirPost={
  id:'dot-air',theme:'dot-air',number:'17',date:'2026-10-09',version:'1.1.0',edition:'INFINITE SKY / INDIVIDUAL FLIGHT',cover:dotAirAsset+'globe.svg',image:dotAirAsset+'software.png',link:dotAirLinks.exhibit,
  zh:{category:'制作手记 / DOT/AIR',title:'把世界点成一颗球，然后想想下一程。',summary:'草间弥生的波点给了我一个出发的念头：如果每个点都是一个坐标，航空软件也能有一点无限的想象。DOT/AIR，今天飞进我的 Gallery。',lead:'最近，我把世界“点”了一遍。严格来说，是先用 35,859 个地理采样点，再在 1.1 里调整成 19,717 个更大的波点，在屏幕上组成一颗会转的地球。软件叫 DOT/AIR。听起来很像准备出发，其实我先在自己的展柜里绕了一圈。',quote:'Infinite dots. A real sky.\n每个点，都可以是出发点。',imageAlt:'DOT/AIR 最新本地 Web 软件的真实界面，朱红波点背景与三维地球',caption:'实际 DOT/AIR 本地 Web 界面 / Orbital Earth 1.1 视觉版本。未登录公开视图，不包含私人账户数据。',sections:[
    {title:'从一个圆点，开始想象无限。',paragraphs:['我喜欢草间弥生波点艺术那种越看越没有边界的感觉。一个点很小，重复之后却可以铺满一整个空间。这次借的是这种视觉节奏，再把它变成航空软件自己的语言：圆点是经纬度，也是出发点。','于是有了朱红的大块背景、黑白的点、厚厚的宽体字，和一张有点歪的 YOUR WAY。界面可以有艺术的脾气，但常用按钮和要读的文字，还是得待在好找的位置。']},
    {title:'地球真的转，目的地真的有坐标。',paragraphs:['这颗球沿用 DOT/AIR 自己的地理点云。陆地和海洋用不同的点色，转到边缘时，点会随着球面的深度缩小、遮挡，再绕到背面。','展柜可以换机场。不是切换一张背景图，而是同一颗地球转到新的方向，停一会儿，再继续自转。Now 只露出半颗，像刚刚升起的一段地平线。世界没有换一个，看的角度换了。']},
    {title:'喜欢飞机，也想认真地挑下一程。',paragraphs:['DOT/AIR 里有机队图鉴、公共空域观测、机身与涂装参考，也有记录偏好、收藏和飞行经历的地方。Flight DNA 则留给那些很个人的选择：预算、时间、航空兴趣，怎么平衡，由我来定。','Web 和原生 Windows 工作台共用账户与偏好，但操作节奏各有安排。网页版先把天空打开；Windows 是一张固定导航、局部列表和机身检查器组成的工作桌。']},
    {title:'先把真实的天空，留在这里。',paragraphs:['现在是公共资料版 1.1，Orbital Earth。指定日期的可售航班和票价还没有接入供应商，所以暂时不会列出可以购买的报价，也不能预订或出票。公开机队、照片和涂装，都是带来源与时间的参考。','我想让它漂亮，也想让它说实话。于是今天先把这颗波点地球放进 Gallery，给它留一条 Now，再写下这一页。下一程未必已经确定，但出发点已经有了。']}],afterword:'暂时还没订机票，地球倒是已经转了好几圈。',cta:'去看看我的波点天空'},
  en:{category:'BUILD JOURNAL / DOT/AIR',title:'A world in dots. A thought about the next flight.',summary:'Kusama’s polka dots suggested a point of departure: if every dot has coordinates, a flight app can make room for infinite imagination. DOT/AIR lands in my Gallery.',lead:'Lately, I have been connecting the world in dots. More precisely, 35,859 geographic samples became a rotating Earth on my screen; 1.1 now uses 19,717 larger dots. The app is DOT/AIR. It sounds ready to depart; first, I took a little trip around my own exhibit.',quote:'Infinite dots. A real sky.\nEvery dot, a departure.',imageAlt:'Actual current local DOT/AIR Web interface with a vermilion dotted background and a three-dimensional Earth',caption:'Actual local DOT/AIR Web interface / Orbital Earth 1.1 visual edition. Public signed-out view; no private account data.',sections:[
    {title:'One dot, and a little infinity.',paragraphs:['I like the feeling of a Kusama dotted space: the longer you look, the harder it is to find its edges. One dot is small; repetition can fill a room. I borrowed that rhythm and gave it an aviation meaning: dots as coordinates and places to begin.','So there is vermilion, black and white, heavy wide lettering, and a slightly tilted YOUR WAY. The interface can have an artistic temperament. Frequently used controls and readable text still deserve reliable places.']},
    {title:'A rotating Earth. Places with coordinates.',paragraphs:['The sphere reuses DOT/AIR’s geographic dot cloud. Land and ocean have different dot colours. Near the rim, the dots recede with the surface, disappear behind it, and return on the other side.','Choose an airport in the exhibit and the same Earth turns toward it, holds, and resumes its rotation. Now shows a cropped half-sphere, like a rising horizon. The world stays the same; the viewpoint changes.']},
    {title:'Aviation curiosity, with a personal point of view.',paragraphs:['DOT/AIR has a Fleet Atlas, public airspace observation, aircraft and livery references, plus preferences, collections and a flight journal. Flight DNA makes space for individual priorities: budget, time and aviation interests, balanced on my terms.','Web and native Windows share an account and preferences, with different rhythms of use. Web opens the sky; Windows offers persistent navigation, local scrolling lists and an aircraft inspector.']},
    {title:'Leave room for the real sky.',paragraphs:['This is public-data edition 1.1, Orbital Earth. Flight inventory and fares for specific dates await a supplier, so there are no purchasable offers, bookings or tickets. Fleet, photograph and livery records remain dated references with sources.','I want it to look good and speak accurately. Today the dotted Earth joins Gallery, gets a Now entry, and becomes this note. The next journey may be undecided, but it already has a point of departure.']}],afterword:'No ticket booked yet. The Earth has already made a few turns.',cta:'STEP INTO MY DOTTED SKY'}
};
// Flight DNA questions, as asked by the DOT/AIR 1.1 onboarding wizard (web/Algorithm.tsx).
export const dotAirDna=[
  {key:'travelFrequency',name:['旅行频率','How often do you fly?'],options:[['偶尔出行','Once in a while'],['每月几次','Every month'],['经常飞行','Most weeks']],pick:1},
  {key:'budget',name:['预算取向','Your budget instinct'],options:[['总价优先','Spend less'],['平衡体验','A good balance'],['体验优先','Make it special']],pick:1},
  {key:'cabin',name:['常用舱位','Your usual cabin'],options:[['经济舱','Economy'],['高端经济舱','Premium economy'],['商务舱','Business'],['头等舱','First']],pick:0},
  {key:'directness',name:['直飞与中转','How do connections feel?'],options:[['尽量直飞','Keep it nonstop'],['合适即可','One can be fine'],['可以多转机','Happy to connect']],pick:0},
  {key:'comfort',name:['舒适度取向','Comfort matters'],options:[['简单就好','Keep it simple'],['适度舒适','A good balance'],['很重视舒适度','A priority']],pick:1},
  {key:'agePreference',name:['机龄偏好','Airframe age'],options:[['没有限制','No preference'],['更喜欢较新机身','Prefer newer'],['喜欢经典机型','Love the classics']],pick:0},
  {key:'alliance',name:['联盟偏好','Alliance preference'],options:[['Any','Any'],['Star Alliance','Star Alliance'],['oneworld','oneworld'],['SkyTeam','SkyTeam']],pick:0},
  {key:'aircraft',name:['喜欢的机型（可多选）','Aircraft you love (pick any)'],multi:true,options:[['A380','A380'],['A350-900','A350-900'],['A350-1000','A350-1000'],['787-9','787-9'],['787-10','787-10'],['A320','A320'],['737-800','737-800']],pick:[0,1]}
];
