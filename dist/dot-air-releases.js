import {dotAirAsset,dotAirLinks} from './dot-air-content.js';
export const dotAirReleases=[
  {version:'2.0.0',label:'2.0',date:'2026-10-10',current:true,white:true,edition:'THE WHITE ROOM',
    title:['一颗红色波点星球，挂在白色的房间里。','A RED, DOTTED PLANET IN A WHITE ROOM.'],
    intro:['2.0 是一次从头到尾的视觉重置：功能、账户与数据来源规则全部保留，外观、字体、动效和每一枚垂尾都是新的。草间弥生《Dots Obsession》式的红色波点巨球，悬在瑞士网格的白色展厅里。','2.0 is a complete visual reset. Features, accounts and provenance rules stay; the look, type, motion and every tail fin are new. A Kusama-style red, dotted planet hangs in a white gallery built on a Swiss grid.'],
    changes:[
      {title:['从波点内部，退到展厅里','FROM INSIDE THE DOTS TO THE GALLERY'],copy:['首页从红底白点的内部拉出，看见整颗星球。光泽的星球有了地面投影；大圆航线是一串黑色波点，模拟飞行的黄点身后拖着渐隐的尾迹，机场标签在光标靠近时才绽开。','Discover opens inside the red dots and pulls back to reveal the planet, now glossy with a floor shadow. Great circles are strings of black dots, the simulated aircraft is a yellow dot with a fading wake, and airport labels bloom only near the cursor.']},
      {title:['7,055 家航司，一枚枚垂尾','7,055 AIRLINES, ONE FIN EACH'],copy:['每家航司都画成同一枚 DOT/AIR 垂尾：品牌色底、真实标识、尾根三排小圆点。2,064 枚印着真实标识；阵容从 3,822 家扩到 7,055 家，每条都保留来源。','Every airline is drawn as one DOT/AIR fin: field colour, real mark, belly dots. 2,064 fins carry real marks, and the roster grows from 3,822 to 7,055 identities, each keeping its source.']},
      {title:['每个房间，都是一件作品','EVERY ROOM, A WORK OF ITS OWN'],copy:['航司世界把整面墙刷成航司颜色；“我的天空”是消融房间，每收藏一样东西就贴一个红点；“我的算法”是 10×10 的波点矩阵。Windows 客户端用同一套材质和垂尾原生重做。','Airline Worlds repaint the room in the airline’s colour; My Sky is an obliteration room where every saved item adds a red dot; My Algorithm is a 10×10 dot matrix. The Windows client is rebuilt natively with the same material and fins.']}
    ],image:[dotAirAsset+'white-room-2.0-zh.webp',dotAirAsset+'white-room-2.0-en.webp'],imageSize:[1600,1000],imageAlt:['DOT/AIR 2.0 白之间的实际探索页：白色展厅里的红色波点星球与航线搜索','Actual DOT/AIR 2.0 Discover in the White Room: a red dotted planet and a route search in a white gallery'],caption:['真实 Web 界面 / 白之间的探索页。','Actual Web interface / Discover in the White Room.'],
    secondImage:dotAirAsset+'white-room-2.0-fins.webp',secondSize:[1600,1333],secondAlt:['DOT/AIR 2.0 垂尾墙，按机队规模排序','The DOT/AIR 2.0 fin wall, largest fleets first'],secondCaption:['垂尾墙 / 标识与涂装属于各航司，本项目为非商业粉丝作品。','Fin wall / marks and liveries belong to their airlines; this is a non-commercial fan project.'],
    note:['2.0 仍未接入票价供应商，不提供预订或付款。生产环境同时提供 1.2 的航司身份接口。','2.0 still has no fare supplier credentials, and no booking or payment. Production also serves the 1.2 airline identity API.'],href:dotAirLinks.site,linkText:['进入 DOT/AIR 2.0','OPEN DOT/AIR 2.0']
  },
  {version:'1.2.0',label:'1.2',date:'2026-10-09',current:false,edition:'AIRLINE IDENTITY',
    title:['每一枚垂尾，都有自己的故事。','EVERY TAIL TELLS A STORY.'],
    intro:['航司身份版：航司世界、Logo / 垂尾 / 涂装各自独立的身份、带来源与日期的航线网络、按注册号统计的机队构成。原生 Windows 换上一颗常驻的球体与三态 Orbital Horizon；Web 保留 1.1 的球面，叠加有来源的网络图层。','The airline identity edition: Airline Worlds, separate identities for logos, tails and liveries, a sourced and dated network, and fleet composition counted by registration. Native Windows gains a persistent sphere and a three-state Orbital Horizon; Web keeps the 1.1 sphere and layers sourced networks on top.'],
    changes:[
      {title:['走进一家航司的世界','STEP INTO AN AIRLINE WORLD'],copy:['从垂尾到运营方、机队、机身与涂装，再到带日期的航班查询。整页铺满航司品牌色与透明标识；对比、关注、动态与已读状态按账户保存。','From a tail to its operator, fleet, airframe and livery, then on to a dated search. Pages carry the airline’s full colour and transparent mark; comparison, follows, activity and read state are saved to the account.']},
      {title:['中国的天空，一个不少','CHINA’S SKIES, ENTITY BY ENTITY'],copy:['新增 12 个国内法人身份，民航局 65 家运输航空公司逐一对应中文名称与来源记录；另加 8 张 CC 授权的历史垂尾照片和 2 条带日期的中国涂装细节。','Twelve domestic legal identities join, and the checked list of 65 CAAC transport carriers maps one by one to Chinese names and source records. Eight CC-licensed historical tail photographs and two dated Chinese livery details are added.']},
      {title:['数据有边界，界面也克制','HONEST DATA, A QUIETER INTERFACE'],copy:['复用的历史代码、未知与零、运营与销售身份、生效日期都有防护。视觉上，糖果色圆盘和胶囊按钮换成克制的同色系波点、编辑式留白和直角软件命令。','Guards cover recycled codes, unknown versus zero, operating versus marketing identity and effective dates. Visually, candy-coloured discs and pill buttons give way to tonal dot scales, editorial spacing and straight software commands.']}
    ],image:dotAirAsset+'identity-1.2-airline-world.webp',imageSize:[1425,902],imageAlt:['DOT/AIR 1.2 原生 Windows 的中国国际航空航司世界','The Air China airline world in the native DOT/AIR 1.2 Windows client'],caption:['真实原生 WPF 截图 / 机队数为带日期的注册参考，不代表认证的现役机队。','Actual native WPF capture / fleet figures are dated registry references, not a certified active fleet.'],
    secondImage:dotAirAsset+'identity-1.2-liveries.webp',secondSize:[1425,902],secondAlt:['DOT/AIR 1.2 原生 Windows 的涂装画廊','The livery gallery in the native DOT/AIR 1.2 Windows client'],secondCaption:['涂装画廊 / 照片保留署名，并不代表新的媒体授权。','Livery gallery / photographs keep their attribution and imply no new media clearance.'],
    note:['1.2 没有获得授权的时刻表、现役机队或票价数据，这些缺口在产品里明确标出。本版本以 Windows 本地便携版发布。','1.2 has no licensed timetable, current-fleet or fare data; those gaps are stated in the product. This edition ships as a local portable Windows build.'],href:dotAirLinks.site,linkText:['打开 DOT/AIR 网页版','OPEN DOT/AIR ON THE WEB']
  },
  {version:'1.1.0',label:'1.1',date:'2026-10-09',current:false,edition:'ORBITAL EARTH',
    title:['同一颗地球，两种打开世界的方式。','ONE EARTH. TWO WAYS TO OPEN THE WORLD.'],
    intro:['Orbital Earth 让 Windows 的巨型地平线与 Web 的完整球面，各自找到适合自己的空间。更大的红白波点、真实机场节点与同一段行程，让“下一程”在球面上连起来。','Orbital Earth gives Windows an enormous horizon and Web its own full-sphere composition. Larger red-and-white dots, real airport nodes and a connected itinerary give the next journey a place on the same Earth.'],
    changes:[
      {title:['球面有了空间关系','A SPHERE WITH A SENSE OF SPACE'],copy:['原生 WPF 从窗口底部升起地球；Web 使用真正的球面深度与批量点云。探索和航班视图沿当前姿态接续，导航离开后收起球体。','Native WPF raises the Earth from below the window; Web uses real depth and batched points. Discover and Flights continue from the current pose, and utility navigation puts the sphere away.']},
      {title:['圆点更大，也更清楚','BIGGER DOTS. CLEARER GEOGRAPHY.'],copy:['球面点从 35,859 个调整为 19,717 个，放大圆点以保留整体覆盖。7,918 个真实机场节点继续保留；标签避让、背面遮挡与机场联动，让地理关系更好读。','Surface samples move from 35,859 to 19,717, with larger discs retaining the overall coverage. All 7,918 airport references remain, with label avoidance, back-side culling and linked selection.']},
      {title:['把下一程连起来','CONNECT THE NEXT JOURNEY'],copy:['出发地、目的地与行程共用状态。理论大圆路径支持播放、暂停、拖动进度和 1 / 2 / 4 倍模拟速度；最新机场选择从当前角度和速度继续。','Departure, destination and itinerary share their state. Theoretical great-circle paths support playback, pause, scrubbing and 1 / 2 / 4× simulation. A new airport continues from the current angle and velocity.']}
    ],image:dotAirAsset+'native-v1.1.png',imageAlt:['DOT/AIR 1.1 原生 WPF 地平线首页的实际界面','Actual DOT/AIR 1.1 native WPF horizon opening'],caption:['真实原生 WPF 内容截图 / 机场与日期为界面示例，不代表可售行程。','Actual native WPF content capture / airports and dates are interface examples, not purchasable offers.'],
    secondImage:dotAirAsset+'route-v1.1.png',secondAlt:['DOT/AIR 1.1 原生界面的 DXB 到 PEK 理论大圆路径','Actual native DOT/AIR 1.1 DXB–PEK great-circle illustration'],secondCaption:['理论大圆航线与模拟 / 非实时航迹，不代表航司提交的实际航路。','Theoretical great-circle route and simulation / not a live track or an airline’s filed flight route.'],
    imageSize:[1425,902],secondSize:[1425,902],linkText:['打开 DOT/AIR 网页版','OPEN DOT/AIR ON THE WEB'],note:['1.1 不新增航空库存或票价授权。机队参考来源沿用原档案；目前没有预订、付款或出票。','1.1 adds no inventory or fare entitlement. Fleet provenance remains unchanged; there is no booking, payment or ticketing.'],href:dotAirLinks.site
  },
  {version:'0.1.0',label:'0.1',date:'2026-10-09',current:false,edition:'PUBLIC-DATA EDITION',imageSize:[1265,712],linkText:['读第一篇制作手记','READ THE FIRST BUILD NOTE'],
    title:['从一个点，打开自己的天空。','ONE DOT. A SKY OF YOUR OWN.'],
    intro:['公共资料版的起点：波点视觉、机场探索、机队与注册号参考、Flight DNA、收藏和飞行日志。Web 与独立 Windows 客户端共用账户和 API，私人本地档案保持独立。','The public-data beginning: dotted graphics, airport discovery, fleet and registration references, Flight DNA, collections and a flight journal. Web and independent Windows share an account and API; private local records remain separate.'],
    changes:[{title:['兴趣有了自己的档案','A RECORD FOR AVIATION CURIOSITY'],copy:['机场、航司、机身与涂装资料保留来源和时间；参考记录与真实未来执飞安排分开呈现。','Airport, airline, aircraft and livery references keep their sources and dates, separate from future assignments.']},{title:['偏好由自己决定','PREFERENCES ON YOUR TERMS'],copy:['四步 Flight DNA、可调权重、排序、收藏与有上限的学习反馈，让个人偏好可以继续保存，也可以关闭或重置。','Four-step Flight DNA, adjustable weights, sorting, collections and bounded learning can be saved, turned off or reset.']}],
    image:dotAirAsset+'software.png',imageAlt:['首版阶段的实际本地 Web 开发预览','Actual local Web development preview from the first-edition stage'],caption:['首版阶段的本地开发预览 / 球面视觉继续迭代到 1.1。','Local development preview from the first-edition stage / the spherical visuals continued into 1.1.'],
    note:['公共资料可以探索；指定日期的可售航班与票价尚未接入供应商。','Public references are available; purchasable flights and fares for specific dates await a provider.'],href:dotAirLinks.post
  }
];
export const dotAirReleaseMessages={
  'now.dotAir12Label':['软件 / 版本更新','SOFTWARE / RELEASE'],
  'now.dotAir12Kicker':['每一枚垂尾，都有自己的故事','EVERY TAIL TELLS A STORY'],
  'now.dotAir12Title':['DOT/AIR 1.2，让每家航司都有自己的世界。','DOT/AIR 1.2. EVERY AIRLINE, A WORLD OF ITS OWN.'],
  'now.dotAir12Text':['航司身份版完成。航司世界把整页铺满品牌色和透明标识；Logo、垂尾与涂装有了各自独立的身份，机队按注册号统计，航线网络带来源与日期。民航局 65 家运输航空公司逐一对应中文名称，另加 8 张 CC 授权的历史垂尾照片。原生 Windows 换上常驻球体与三态 Orbital Horizon。','The airline identity edition is done. Airline Worlds fill the page with each brand’s colour and transparent mark; logos, tails and liveries have separate identities, fleets are counted by registration and networks carry sources and dates. The 65 CAAC transport carriers map to Chinese names, with eight CC-licensed historical tail photographs. Native Windows gains a persistent sphere and a three-state Orbital Horizon.'],
  'now.dotAir12Note':['机队数是带日期的注册参考；时刻表、现役机队与票价仍未获得授权数据。','Fleet figures are dated registry references; licensed timetable, current-fleet and fare data remain absent.'],
  'now.dotAir12History':['翻开 1.2 版本手记','OPEN THE 1.2 EDITION LOG'],
  'now.dotAir12ArtLabel':['打开 DOT/AIR 1.2 版本手记','Open the DOT/AIR 1.2 edition log'],
  'now.dotAir20Label':['软件 / 大版本','SOFTWARE / MAJOR RELEASE'],
  'now.dotAir20Kicker':['白之间 The White Room','THE WHITE ROOM'],
  'now.dotAir20Title':['DOT/AIR 2.0，把红色波点星球挂进白色房间。','DOT/AIR 2.0. A RED, DOTTED PLANET IN A WHITE ROOM.'],
  'now.dotAir20Text':['从头到尾的视觉重置。草间弥生《Dots Obsession》式的红色波点星球，悬在瑞士网格的白色展厅里；首页从波点内部拉出，大圆航线变成一串黑色波点。7,055 家航司各画成一枚垂尾，2,064 枚印着真实标识；“我的天空”是每收藏一样就贴一个红点的消融房间。Web 与原生 Windows 一起重做。','A complete visual reset. A Kusama-style red, dotted planet hangs in a white gallery on a Swiss grid; Discover opens inside the dots and great circles become strings of black dots. All 7,055 airlines are drawn as fins, 2,064 with real marks, and My Sky is an obliteration room that gains a red dot for every saved item. Web and native Windows are rebuilt together.'],
  'now.dotAir20Note':['功能、账户与数据来源规则全部保留；仍不提供预订或付款。标识与涂装属于各航司，本项目为非商业粉丝作品。','Features, accounts and provenance rules are kept; there is still no booking or payment. Marks and liveries belong to their airlines; this is a non-commercial fan project.'],
  'now.dotAir20History':['翻开 2.0 版本手记','OPEN THE 2.0 EDITION LOG'],
  'now.dotAir20Web':['进入 DOT/AIR 2.0','OPEN DOT/AIR 2.0'],
  'now.dotAir20Windows':['下载 Windows 2.0','DOWNLOAD WINDOWS 2.0'],
  'now.dotAir20ArtLabel':['打开 DOT/AIR 2.0 版本手记','Open the DOT/AIR 2.0 edition log'],
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
