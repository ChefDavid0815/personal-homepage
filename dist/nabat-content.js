export const nabatAsset = './assets/projects/nabat/';
export const nabatLinks = {repo:'https://github.com/ChefDavid0815/nabat-injaz',app:'https://nabat-injaz.vercel.app/',exhibit:'./school-gallery.html#project-nabat',post:'./post.html?article=nabat'};
export const nabatScreens = [
  {id:'home',file:'home-native.png',title:['照护工作台','Operations home'],note:['把优先事项、今日照护与地点风险，留在同一张工作桌上。','Priorities, today’s care and location risk share one operational desk.']},
  {id:'plants',file:'plants-native.png',title:['植物目录','Plant explorer'],note:['可筛选的原生目录；从一株植物，走到整座空间。','A filterable native collection, from one plant to the whole workspace.']},
  {id:'tags',file:'tags-native.png',title:['标签工坊','Tag studio'],note:['NFC / QR 指向稳定身份，替换标签也保留植物的历史。','NFC / QR points to a stable identity. Replacing a tag preserves the plant history.']},
  {id:'compare',file:'compare-native.png',title:['观察对照','Observation comparison'],note:['并排看前后影像；光线、视角与分析来源一起说明。','Compare observations with lighting, viewpoint and analysis provenance in view.']}
];
export const nabatViews = [
  {id:'identity',label:['身份','Identity'],title:['一株植物，一个名字。','A plant. An identity.'],copy:['轻触标签或扫描 QR，回到同一株植物的档案。花盆、地点和照护者可以变化，历史继续跟着它。','Tap a tag or scan its QR to return to the same living record. Pots, places and caretakers can change; its history follows.'],stamp:'NAB-004 / IDENTITY',events:[['登记植物','Plant registered'],['绑定标签','Tag linked'],['打开档案','Record opened']]},
  {id:'history',label:['记录','History'],title:['每一次照护，都留下回响。','Small care. Lasting context.'],copy:['照片与照护先成为可靠的记录，再等待可用的分析。观察有日期，变化有来处，也给不确定留一栏位置。','Photos and care become reliable records before any available analysis. Observations carry dates and changes carry context, including uncertainty.'],stamp:'NAB-004 / LIVING HISTORY',events:[['加入观察','Observation saved'],['记下照护','Care recorded'],['比较前后','Changes compared']]},
  {id:'operations',label:['工作台','Operations'],title:['从一片叶子，到一座空间。','One leaf. A shared workspace.'],copy:['移动端负责现场照护，原生 Windows 工作台负责目录、任务、地点与标签。交接时，把历史也一起交给下一双手。','Mobile handles field care. Native Windows brings together plants, tasks, locations and tags. Each handover carries the history forward.'],stamp:'NABAT 1.1 / OPERATIONS',events:[['安排任务','Work scheduled'],['现场照护','Field care'],['完成交接','Context carried on']]}
];
export const nabatMessages = {
  'now.nabatLabel':['校园 / INJAZ 商赛','SCHOOL / INJAZ COMPETITION'],
  'now.nabatKicker':['给每一株植物，留一本生长手账','A LIVING RECORD FOR EVERY PLANT'],
  'now.nabatTitle':['NABAT，让每一株植物，都有来处与往后。','NABAT. Every plant, known.'],
  'now.nabatText':['今天把我的 INJAZ 商赛作品 NABAT 放进校园实验室。一个 NFC / QR 身份，连接植物的照片、观察与照护历史；现场的移动端和 NABAT 1.1 原生 Windows 工作台，让目录、任务、地点、标签与影像对照继续围着同一株植物生长。象牙白、植物绿和编辑式字形，像一本安静但一直在更新的生长手账。','Today my INJAZ business competition work joins the School Lab. A stable NFC / QR identity links plant photos, observations and care history. Mobile field care and the NABAT 1.1 native Windows workspace keep plants, tasks, locations, tags and comparisons connected. Ivory, botanical green and editorial type give the record its own quiet character.'],
  'now.nabatNote':['展柜植物与软件演示数据为合成样例；物理 NFC 写入和可信签名安装尚未验证。观察保存与外部分析可用性分别处理。','Plants and software demo records are synthetic examples. Physical NFC writing and trusted signed installation remain unverified. Saving an observation is separate from external analysis availability.'],
  'now.nabatExplore':['走进生长档案','Explore the living record'],
  'now.nabatRead':['翻开植物手记','Read the botanical note'],
  'now.nabatArtLabel':['打开 NABAT：我的 INJAZ 商赛作品展柜','Open NABAT: my INJAZ business competition exhibit'],
  'school.meta':['ChefZC 的校园作品：INJAZ 商赛作品 NABAT、NeRF 研究与 STRIDE 环境模拟。','ChefZC’s school collection: NABAT for the INJAZ business competition, NeRF research and STRIDE simulation.'],
  'now.meta':['ChefZC 的近况。2026 年 10 月 9 日，INJAZ 商赛作品 NABAT 加入校园实验室。','Updates from ChefZC. October 9, 2026: NABAT, my INJAZ business competition work, joins the School Lab.']
};
export const nabatPost = {
  id:'nabat',theme:'nabat',number:'16',date:'2026-10-09',version:'1.1.0',edition:'INJAZ / A LIVING RECORD',
  cover:nabatAsset+'monstera.webp',image:nabatAsset+'monstera.webp',link:nabatLinks.exhibit,
  zh:{
    title:'给植物办张“身份证”，再留一本生长手账。',category:'校园手记 / INJAZ · NABAT',
    summary:'一枚小标签，一段慢慢长大的历史。我的 INJAZ 商赛作品 NABAT，今天住进校园实验室：从现场照护，到原生 Windows 工作台。',
    lead:'校园实验室今天添了一盆数字植物。它叫 NABAT，是我的 INJAZ 商赛作品。想做的事情很简单：别让一次照护，变成下一次路过就忘了的小事。',
    quote:'Every plant has a history.\nGive it an identity.\n每一株，都值得被记得。',
    imageAlt:'NABAT 原有的龟背竹合成植物样图，带有一枚身份标签',caption:'NABAT 的原有品牌样图。植物与标签场景为合成插画，用来说明身份与档案的关系。',
    sections:[
      {title:'先给这一株，一个名字。',paragraphs:['一枚 NFC 或 QR 标签，把“这盆植物”连到一个稳定身份。名字、品种、地点、照片和照护记录，都有了共同的落点。换一张标签，不必顺便丢掉它以前的故事。','这也是 NABAT 的起点：一株植物可以搬家，可以换照护者，档案却应该知道自己一直在记录谁。']},
      {title:'别只留下照片，也留下前后。',paragraphs:['浇过水，记一下；看见变化，拍一张。下一次再看，就有了“之前是什么样”的上下文。影像对照会把光线、视角与分析来源一起摆出来，帮助理解差异。','照片和照护先保存，分析是否可用是另一件事。数字要说明来处，不确定就留着不确定。植物生长已经够有耐心了，软件也不必急着假装无所不知。'],image:nabatAsset+'compare-native.png',imageAlt:'NABAT 原生 Windows 影像对照工作区，明确标注合成观察样例',caption:'真实 WinUI 工作区的 XAML 渲染截图。这里的照片、记录和信号为合成演示样例，不能视作真实植物测量。'},
      {title:'现场轻一点，工作台完整一点。',paragraphs:['移动端留给现场：找到植物、加入观察、记下照护。NABAT 1.1 的原生 Windows 工作台，把优先队列、任务、植物目录、地点、标签与报告安排在一张稳定的工作桌上。','最近的档案和待提交的照护，可以在本机继续保留；恢复连接，再把记录接回去。桌面与移动端说的是同一株植物，不需要重新讲一遍故事。'],image:nabatAsset+'home-native.png',imageAlt:'NABAT 1.1 原生 Windows 照护工作台的真实渲染界面',caption:'真实 NABAT 1.1 原生界面，NABAT Demo Hotel 合成样例工作区。截图显示 XAML 内容，不包含系统窗口框。'},
      {title:'给这个校园作品，留一片自己的绿。',paragraphs:['这次展柜沿用软件的象牙白、深植物绿和一点藏红花色。叶脉、身份标签与时间记录连成同一条线，植物留在场上，观察它的方式慢慢变化。Now 和这篇手记也一起带上了这股安静的绿意。','这是我的 INJAZ 商赛作品，也是一段还在继续生长的尝试。物理 NFC 设备和可信签名安装还留给下一步；今天先把已经做出来的东西认真摆好。照顾一株植物，也照顾每一次小小的创造。']}
    ],
    afterword:'2026.10.09 / 写在迪拜。小小的照护，也能慢慢长成一件事。',cta:'走进 NABAT 的生长档案'
  },
  en:{
    title:'An identity for a plant. A notebook for what grows.',category:'SCHOOL NOTES / INJAZ · NABAT',
    summary:'A small tag and a history that keeps growing. My INJAZ business competition work joins the School Lab, from field care to native Windows operations.',
    lead:'A digital plant joins the School Lab today. NABAT is my INJAZ business competition work. The idea is simple: let a small act of care remain useful the next time someone walks past.',
    quote:'Every plant has a history.\nGive it an identity.\nEvery little life deserves to be remembered.',
    imageAlt:'NABAT’s original synthetic Monstera brand image with an identity tag',caption:'The original NABAT brand specimen. This plant and tag scene is a synthetic illustration of a living identity.',
    sections:[
      {title:'Start with a name for this one.',paragraphs:['An NFC or QR tag leads to a stable plant identity. A name, species, place, photos and care events share the same home. A replacement tag should carry the earlier story along.','That is where NABAT begins. A plant can move and its caretaker can change; the record should still know whose story it is keeping.']},
      {title:'Keep the context around the photograph.',paragraphs:['Record a watering. Add a photo when something changes. The next observation now has an earlier one to return to. Comparison keeps lighting, viewpoint and analysis provenance in view.','A photo or care record can be saved independently of analysis availability. Numbers need a source; uncertainty deserves to stay visible. Plants take their time. Software can be patient too.'],image:nabatAsset+'compare-native.png',imageAlt:'Actual NABAT native Windows observation comparison with synthetic samples clearly labelled',caption:'A rendered XAML capture of the running WinUI workspace. Photographs, records and signals are synthetic demonstration examples, not measured plant data.'},
      {title:'A lighter field flow. A complete desk.',paragraphs:['Mobile is for finding the plant, adding an observation and recording care. NABAT 1.1 brings priorities, tasks, plants, locations, tags and reports together in a native Windows workspace.','Recent records and pending care can remain on the device and reconnect later. Desktop and mobile work with the same plant identity, so the story does not need to start again.'],image:nabatAsset+'home-native.png',imageAlt:'Actual rendered NABAT 1.1 native Windows operations home',caption:'Actual NABAT 1.1 native UI with the synthetic NABAT Demo Hotel workspace. The capture shows XAML content, excluding the operating system window frame.'},
      {title:'A little green of its own.',paragraphs:['The exhibit keeps the software’s ivory, deep botanical green and a little saffron. Leaf veins, a tag and a timeline form one connected record. The plant stays while the way we observe it changes. Now and this note share the same identity.','This is my INJAZ business competition work, still growing. Physical NFC hardware and trusted signed installation remain next steps. Today is for showing what exists, and giving each small act of care a place to continue.']}
    ],
    afterword:'2026.10.09 / Written in Dubai. Small care can grow into something lasting.',cta:'Explore NABAT’s living record'
  }
};
