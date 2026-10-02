export const aerAsset = './assets/projects/aer/';
export const aerLinks = {
  site: 'https://aer-personal-journeys.workspace-298846.chatgpt.site',
  gallery: './gallery.html#project-aer',
  post: './post.html?article=aer',
  now: './now.html#milestone-aer'
};
export const aerCarriers = {
  EK: {name:'Emirates',zh:'阿联酋航空',image:'emirates-tail.webp',code:'UAE',colour:'#67998d'},
  QR: {name:'Qatar Airways',zh:'卡塔尔航空',image:'qatar-tail.webp',code:'QTR',colour:'#8b647b'},
  SQ: {name:'Singapore Airlines',zh:'新加坡航空',image:'singapore-tail.webp',code:'SIA',colour:'#808fba'}
};
export const aerProject = {
  id:'aer',name:'AER',subtitle:'让下一程，更像你。',layout:'aer',category:'透明玻璃 / 航班探索',number:'09',color:'optical',tags:['React','TypeScript','Cloudflare D1'],
  description:'AER 1.0。以无色光学玻璃、航司尾翼与旅人星图，探索路线、比较行程，并留下自己的旅行偏好。',
  demo:false,version:'1.0.0',repoUrl:'',liveUrl:aerLinks.site,
  translations:{en:{subtitle:'A little closer to your kind of journey.',category:'OPTICAL GLASS / FLIGHT EXPLORATION',description:'AER 1.0 brings colourless optical glass, airline tails and a traveller constellation to route exploration, comparisons and personal preferences.'}}
};
export const aerMessages = {
  'now.meta':['ChefZC 的近况。2026 年 10 月 2 日，将 AER 航班探索网站带进个人作品集。','Updates from ChefZC. On 2 October 2026, AER joins the personal collection.'],
  'gallery.meta':['ChefZC 的数字作品陈列室：AER 透明玻璃航班探索、AfterImage 赛车影像档案，以及九件主展厅作品。','ChefZC’s digital collection: AER flight exploration in optical glass, the AFTERIMAGE archive, and nine works in the main room.'],
  'now.aerLabel':['网站 / 新作品','WEBSITE / NEW WORK'],
  'now.aerKicker':['给远方，一座透明的候机室','A CLEARER ROOM FOR THE NEXT HORIZON'],
  'now.aerTitle':['AER 1.0，让下一程，更像你。','AER 1.0. A journey that feels like you.'],
  'now.aerText':['做了一座透明玻璃里的航班探索空间。路线搜索、筛选与比较，连接旅人偏好、历史选择和可解释的推荐；航司尾翼、精确机型插画与机队参考，让每一次抬头都有自己的方向。今天把它带进 Gallery，也写下这次关于出发与光的制作手记。','A flight exploration space in colourless glass. Search, filters and comparisons meet traveller preferences, saved choices and explainable recommendations. Airline tails, model-specific artwork and fleet references give each horizon its own character. Today it joins the Gallery, with a note about departure and light.'],
  'now.aerNote':['当前为授权访问的私人站点；航班与票价是演示数据，选择保存为意向记录，不创建机票或订单。','The current site requires authorised access. Flights and fares are demonstrative; selecting one saves a choice, without creating a ticket or reservation.'],
  'now.aerGallery':['走进玻璃展柜','Enter the glass exhibit'],
  'now.aerPost':['阅读出发手记','Read the departure notes'],
  'now.aerMini':['AER 光学玻璃艺术小窗','AER optical glass miniature']
};
