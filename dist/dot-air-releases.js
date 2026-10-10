import {dotAirAsset,dotAirLinks} from './dot-air-content.js';
export const dotAirReleases=[
  {version:'1.1.0',label:'1.1',date:'2026-10-09',current:true,
    title:['同一颗地球，两种打开世界的方式。','ONE EARTH. TWO WAYS TO OPEN THE WORLD.'],
    intro:['Orbital Earth 让 Windows 的巨型地平线与 Web 的完整球面，各自找到适合自己的空间。更大的红白波点、真实机场节点与同一段行程，让“下一程”在球面上连起来。','Orbital Earth gives Windows an enormous horizon and Web its own full-sphere composition. Larger red-and-white dots, real airport nodes and a connected itinerary give the next journey a place on the same Earth.'],
    changes:[
      {title:['球面有了空间关系','A SPHERE WITH A SENSE OF SPACE'],copy:['原生 WPF 从窗口底部升起地球；Web 使用真正的球面深度与批量点云。探索和航班视图沿当前姿态接续，导航离开后收起球体。','Native WPF raises the Earth from below the window; Web uses real depth and batched points. Discover and Flights continue from the current pose, and utility navigation puts the sphere away.']},
      {title:['圆点更大，也更清楚','BIGGER DOTS. CLEARER GEOGRAPHY.'],copy:['球面点从 35,859 个调整为 19,717 个，放大圆点以保留整体覆盖。7,918 个真实机场节点继续保留；标签避让、背面遮挡与机场联动，让地理关系更好读。','Surface samples move from 35,859 to 19,717, with larger discs retaining the overall coverage. All 7,918 airport references remain, with label avoidance, back-side culling and linked selection.']},
      {title:['把下一程连起来','CONNECT THE NEXT JOURNEY'],copy:['出发地、目的地与行程共用状态。理论大圆路径支持播放、暂停、拖动进度和 1 / 2 / 4 倍模拟速度；最新机场选择从当前角度和速度继续。','Departure, destination and itinerary share their state. Theoretical great-circle paths support playback, pause, scrubbing and 1 / 2 / 4× simulation. A new airport continues from the current angle and velocity.']}
    ],image:dotAirAsset+'native-v1.1.png',imageAlt:['DOT/AIR 1.1 原生 WPF 地平线首页的实际界面','Actual DOT/AIR 1.1 native WPF horizon opening'],caption:['真实原生 WPF 内容截图 / 机场与日期为界面示例，不代表可售行程。','Actual native WPF content capture / airports and dates are interface examples, not purchasable offers.'],
    secondImage:dotAirAsset+'route-v1.1.png',secondAlt:['DOT/AIR 1.1 原生界面的 DXB 到 PEK 理论大圆路径','Actual native DOT/AIR 1.1 DXB–PEK great-circle illustration'],secondCaption:['理论大圆航线与模拟 / 非实时航迹，不代表航司提交的实际航路。','Theoretical great-circle route and simulation / not a live track or an airline’s filed flight route.'],
    note:['1.1 不新增航空库存或票价授权。机队参考来源沿用原档案；目前没有预订、付款或出票。','1.1 adds no inventory or fare entitlement. Fleet provenance remains unchanged; there is no booking, payment or ticketing.'],href:dotAirLinks.site
  },
  {version:'0.1.0',label:'0.1',date:'2026-10-09',current:false,
    title:['从一个点，打开自己的天空。','ONE DOT. A SKY OF YOUR OWN.'],
    intro:['公共资料版的起点：波点视觉、机场探索、机队与注册号参考、Flight DNA、收藏和飞行日志。Web 与独立 Windows 客户端共用账户和 API，私人本地档案保持独立。','The public-data beginning: dotted graphics, airport discovery, fleet and registration references, Flight DNA, collections and a flight journal. Web and independent Windows share an account and API; private local records remain separate.'],
    changes:[{title:['兴趣有了自己的档案','A RECORD FOR AVIATION CURIOSITY'],copy:['机场、航司、机身与涂装资料保留来源和时间；参考记录与真实未来执飞安排分开呈现。','Airport, airline, aircraft and livery references keep their sources and dates, separate from future assignments.']},{title:['偏好由自己决定','PREFERENCES ON YOUR TERMS'],copy:['四步 Flight DNA、可调权重、排序、收藏与有上限的学习反馈，让个人偏好可以继续保存，也可以关闭或重置。','Four-step Flight DNA, adjustable weights, sorting, collections and bounded learning can be saved, turned off or reset.']}],
    image:dotAirAsset+'software.png',imageAlt:['首版阶段的实际本地 Web 开发预览','Actual local Web development preview from the first-edition stage'],caption:['首版阶段的本地开发预览 / 球面视觉继续迭代到 1.1。','Local development preview from the first-edition stage / the spherical visuals continued into 1.1.'],
    note:['公共资料可以探索；指定日期的可售航班与票价尚未接入供应商。','Public references are available; purchasable flights and fares for specific dates await a provider.'],href:dotAirLinks.post
  }
];
export const dotAirReleaseMessages={
  'now.dotAir11Label':['软件 / 版本更新','SOFTWARE / RELEASE'],
  'now.dotAir11Kicker':['同一颗地球，接着转下去','THE SAME EARTH. THE NEXT ORBIT.'],
  'now.dotAir11Title':['DOT/AIR 1.1，让下一程沿着地球展开。','DOT/AIR 1.1. THE NEXT JOURNEY, ON THE SAME EARTH.'],
  'now.dotAir11Text':['Orbital Earth 1.1 已上线。Windows 让巨型红色地平线从窗口底部升起，Web 保留自己的完整球面；19,717 个更大的波点和 7,918 个机场节点，让目的地有了真实坐标。出发、到达与行程沿同一颗地球连接，理论大圆航线支持播放、暂停、拖动进度和模拟速度；换一个机场，从当前姿态继续。','Orbital Earth 1.1 is live. Windows raises a giant red horizon from below the window, while Web keeps its own complete sphere. 19,717 larger dots and 7,918 airport nodes give destinations real coordinates. Departure, destination and itinerary connect on the same Earth, with great-circle playback, pause, scrubbing and simulation speed. A new airport continues from the current pose.'],
  'now.dotAir11Note':['航线为理论地理示意，模拟不是真实航迹；航空库存、可售票价与出票仍未开放。','Routes are theoretical geography and simulations are not live tracks. Inventory, purchasable fares and ticketing remain unavailable.'],
  'now.dotAir11History':['翻开 1.1 版本手记','OPEN THE 1.1 EDITION LOG'],
  'now.dotAir11Web':['进入 DOT/AIR 1.1','OPEN DOT/AIR 1.1'],
  'now.dotAir11ArtLabel':['打开 DOT/AIR 1.1 版本历史','Open the DOT/AIR 1.1 edition log'],
  'now.meta':['ChefZC 的近况。2026 年 10 月 9 日，DOT/AIR 1.1 Orbital Earth 上线，展柜加入版本手记。','Updates from ChefZC. October 9, 2026: DOT/AIR 1.1 Orbital Earth is live, with an edition log in its exhibit.']
};
