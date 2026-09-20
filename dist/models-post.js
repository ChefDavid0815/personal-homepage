export const modelsPost = {
 id: 'courtside-collection', theme: 'glass', number: '07', date: '2026-09-20', version: '0.1',
 cover: './assets/models/arena-case.png', image: './assets/models/arena-case.png',
 zh: {
  category: '建模手记 / 热爱的形状', title: '把主场装进玻璃盒。',
  summary: '一座大通中心，一个库里脸模，三个可以转动的玻璃盒。今天，给我的篮球世界增加了一点体积。',
  lead: '看球的时候，我总会注意到一些比赛之外的东西：地板上反射的光、球馆顶上挂着的屏幕、镜头扫过看台的那一瞬间。以前它们只是画面里的背景，现在会忍不住想：如果把它做出来，会是什么样子？',
  quote: '喜欢一件事，\n也可以慢慢把它做成形状。',
  imageAlt: '真实大通中心剖开模型在蓝金玻璃展柜中的渲染',
  caption: 'OBJECT 01 / 大通中心内景。真实模型的展示渲染，网页中可以直接旋转。',
  sections: [
   { title: '先从自己的主场开始', paragraphs: ['大通中心对我来说，是看库里打球时最熟悉的背景之一。真正开始整理这个模型后，才发现一座球馆包含好多层次：球场、篮架、座椅、通道、灯光，还有那个很难忽略的悬挂记分牌。', '所以内景展柜选择了揭开屋顶的方式。可以从上面看球场，也可以转到另一侧，看一排排看台如何把它围起来。网页里的座椅做了轻量化，原生建模文件仍保留完整场景与实例。'] },
   { title: '球馆外面，也值得一个盒子', paragraphs: ['只看球场，似乎还不够。大通中心外面的立面、入口和广场，也有自己的轮廓。于是又加了一只独立玻璃盒：这一只看建筑，上一只看篮球。', '外景与内景属于同一份作品。它是参考公开资料制作的建模练习，不是实测图纸复原；能确认的结构认真做，还没确认的细节留着继续学习。'], image: './assets/models/exterior-case.png', imageAlt: '大通中心建筑外景模型在独立玻璃盒中的渲染', caption: 'OBJECT 02 / 从主场走到城市。外景拥有自己的展位。' },
   { title: '把镜头移近一点', paragraphs: ['库里的脸模是另一种完全不同的练习。建筑可以退远了看整体，人物却会让人盯着很小的地方：眉眼、发际线、胡须，还有皮肤和光线碰在一起的感觉。', '这份脸部资产以我购入的第三方 MNJ Mod 为基础整理与适配，保留脸部、毛发、眼睛和口腔部件。它仍是一个原型，完整表情系统还没做好。展柜使用轻量的网页材质，所以不能替代 Unreal 里对最终效果的检查。'], image: './assets/models/curry-case.png', imageAlt: '库里头部模型的蓝金玻璃展柜预览', caption: 'OBJECT 03 / Stephen Curry。脸部资产原型与网页展示材质。' },
   { title: '收藏，也想让别人打开', paragraphs: ['这次最想做好的，是“看模型”这件事本身。玻璃边缘有一点光，底座带一点勇士蓝和金色，模型在里面慢慢转。你也可以拖动、暂停，或者放大看一个细节。它们不是扁平海报，是真正在浏览器里加载的 3D。', '建模文件已整理成独立下载：保留模型、必要贴图和导入说明，不把参考资料库一起塞进去。免费指下载不收费，第三方素材、标志和人物相关权利仍按原有归属与条款处理。', '从篮球游戏，到球馆和脸模，方向好像越来越多了。但开始它们的原因其实很简单：喜欢，所以想试着做点东西。'] },
  ],
  cta: '打开三个 3D 玻璃展柜', afterword: '收藏手记 / 2026 年 9 月。主场在这里，下一件作品也会来。'
 },
 en: {
  category: 'MODEL JOURNAL / THE SHAPE OF AN INTEREST', title: 'A home court, collected in glass.',
  summary: 'Chase Center, a Curry head study, and three rotating glass cases. A little more dimension for my basketball world.',
  lead: 'When I watch basketball, I often notice things outside the game: reflections on the floor, the hanging screen, the moment a camera pans across the stands. They used to be background details. Now I catch myself wondering what it would be like to build them.',
  quote: 'Sometimes loving something\nmeans slowly giving it a shape.',
  imageAlt: 'The actual Chase Center cutaway model rendered in a blue-and-gold glass case',
  caption: 'OBJECT 01 / Chase Center interior. An actual model render; the web collection lets you rotate it.',
  sections: [
   { title: 'Start with a home court', paragraphs: ['Chase Center is one of the most familiar backdrops to watching Curry play. Working with its model made all the layers stand out: court, baskets, seats, tunnels, lighting, and that hard-to-miss scoreboard above everything.', 'The interior case opens the roof. Look down at the floor, or turn around to see the tiers enclosing it. The browser copy reduces seating density for performance; the native modeling file retains the full scenes and instances.'] },
   { title: 'Another case for the outside', paragraphs: ['The court is only part of the place. Cladding, entrances and a plaza give the building its own silhouette. So there is a second glass case: one for the architecture, one for basketball.', 'Both belong to the same modeling work. It is a study informed by public references, not a surveyed reconstruction. Confirmed structure gets careful attention; uncertain details remain things to learn.'], image: './assets/models/exterior-case.png', imageAlt: 'Chase Center exterior in a separate glass display case', caption: 'OBJECT 02 / From home court to city. A case for the exterior.' },
   { title: 'Bring the camera closer', paragraphs: ['The Curry head is a different kind of study. A building invites you to stand back. A face makes you look at small things: brows, hairline, beard, and the way skin catches the light.', 'This asset is prepared and adapted from a third-party MNJ mod I purchased. It includes the face, hair, eyes and mouth components. It is still a prototype without a complete facial animation system. Lightweight web shaders are for presentation; final appearance still needs checking in Unreal.'], image: './assets/models/curry-case.png', imageAlt: 'The Curry head prototype in a blue-and-gold glass case', caption: 'OBJECT 03 / Stephen Curry. Head-asset prototype with web presentation materials.' },
   { title: 'A collection you can open', paragraphs: ['The experience of looking at a model mattered this time. A little light along the glass. Warriors blue and gold around the base. A slow turn inside. Drag it yourself, pause, or zoom into a detail. These are real 3D models loaded in the browser.', 'Downloads keep the modeling files, required textures and import notes together. The reference library stays out. Free means no download charge; third-party materials, trademarks and likeness rights keep their original ownership and terms.', 'A basketball game, an arena, a head study: the directions keep growing. But they start with the same simple reason. I like something, so I want to try making something with it.'] },
  ],
  cta: 'Explore the three 3D glass cases', afterword: 'Collection notes / September 2026. The home court is here. There is room for what comes next.'
 },
 link: './models-gallery.html'
};
