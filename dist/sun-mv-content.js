// 《没了我你依然拥有太阳》 code-rendered music video (F:\短片): facts, film map, excerpts, Now and Post copy.
// The song's recording and lyrics belong to their authors; this site shows only muted excerpts of the
// picture and the film's original silent opening (brush sound design by ChefZC). No lyrics are reproduced.
export const sunMvAsset='./assets/projects/sun-mv/';
export const sunMvLinks={repo:'https://github.com/ChefDavid0815/the-sun-mv',room:'./gallery.html#code-films',post:'./post.html?article=sun-mv',now:'./now.html#milestone-sun-mv'};

export const sunMvSong={
  title:'没了我你依然拥有太阳',titleEn:'The Sun Will Illuminate Your World',
  artist:'黄霄雲',artistEn:'Huang Xiaoyun',
  credits:[['作词 / 作曲','Words / music','黄霄雲、施牧辰','Huang Xiaoyun, Shi Muchen'],['编曲 / 演唱','Arrangement / vocals','黄霄雲','Huang Xiaoyun'],['专辑','Album','《没语季节》','Meiyu Jijie'],['写于 / 发行','Written / released','2019 / 2024.08.16','2019 / 16 Aug 2024']]
};

export const sunMvSpecs=[['2560 × 1440','分辨率','resolution'],['60 fps','帧率','frame rate'],['17,558','帧','frames'],['4:53','片长','running time'],['10','每帧子帧采样','sub-frames per frame'],['53','标题笔画','title strokes']];

// Video time = song time + 18 s (the silent opening). Scene names follow app/src/scenes.
export const sunMvFilm=[
  {id:'open',t0:0,t1:20,zh:['开场','标题被一笔一笔刮成光，只有毛笔声。'],en:['Opening','The title scratched to light stroke by stroke, with only the sound of the brush.']},
  {id:'sheet',t0:20,t1:52,zh:['习字','字在习字本的格子里随歌声写下，纸开始颤抖、错印、被墨淹没。'],en:['Sheet','Characters written into practice-book columns as they are sung; the sheet trembles, misprints and floods with ink.']},
  {id:'tear',t0:52,t1:56,zh:['撕','整张纸沿一行字被撕开、撕碎。'],en:['Tear','The whole sheet torn along one line, then shredded.']},
  {id:'sun',t0:56,t1:80,zh:['印日','虚空里，一枚朱砂印做成的太阳。'],en:['Seal-sun','A sun made of a cinnabar seal, alone in the void.'],you:true},
  {id:'verse',t0:80,t1:106,zh:['层纸','半透明的纸一层层叠起，裂纹爬满，折进黑暗。'],en:['Layers','Translucent sheets stacked, crazed, folded into the dark.']},
  {id:'drop',t0:106,t1:113,zh:['墨滴','墨池、倒影，一滴墨落下，溅起冠。'],en:['Drop','An ink pond, a reflection, a falling drop and its crown.']},
  {id:'field',t0:113,t1:140,zh:['字野','一直铺到地平线的纸，字铺成的路，世界翻转。'],en:['Field','An endless sheet to the horizon, a road of words, the world turning over.']},
  {id:'tear2',t0:140,t1:143,zh:['再撕','这片原野也被撕开。'],en:['Tear again','The field is torn as well.']},
  {id:'sun2',t0:143,t1:166,zh:['近日','太阳再次出现，更近，镜头绕着它走。'],en:['Sun, closer','The sun again, nearer, the camera circling.'],you:true},
  {id:'wander',t0:166,t1:196,zh:['行卷','卷轴与没寄出的信之间穿行，低音进来时纸边开始燃烧。'],en:['Scrolls','Walking a hall of scrolls and unsent letters; the edges burn when the bass enters.']},
  {id:'night',t0:196,t1:224,zh:['夜信','灯下的信纸，黑白翻转；对称的墨迹、眼睑、声音的圆环与日食。'],en:['Night letter','Black ink on a lamp-lit letter: mirrored blots, eyelids, rings of voice, an eclipse.'],you:true},
  {id:'sheet3',t0:224,t1:249,zh:['定格','最后的副歌被按住，撕裂停在半空，细纹蔓延。'],en:['Held','The last chorus held, the tear arrested, hairline cracks spreading.']},
  {id:'shatter',t0:249,t1:263,zh:['碎','碎片、冲击波、坠落，所有字卷成漩涡。'],en:['Shatter','Shards, a shockwave, the fall, every line drawn into a vortex.']},
  {id:'climax',t0:263,t1:270,zh:['星','印章龟裂脱落，露出一颗真正的星，标题被烙在上面。'],en:['Star','The seal crazes and falls away to a real star, with the title burnt onto it.'],you:true},
  {id:'ash',t0:270,t1:293,zh:['灰','余烬、落灰，标题慢慢渗回墨里，只剩一个朱砂点。'],en:['Ash','Embers and falling ash; the title soaks back into the ink until one cinnabar point is left.']}
];

// Muted picture excerpts (and the opening, which keeps its brush sound).
export const sunMvReel=[
  {id:'opening',file:'opening',t:0,scene:'open',sound:true,zh:'开场：标题被写出',en:'Opening: the title is written'},
  {id:'tear-sun',file:'tear-sun',t:54,scene:'sun',zh:'撕开之后，印日浮现',en:'After the tear, the seal-sun'},
  {id:'star',file:'star',t:262,scene:'climax',zh:'星与烙上的标题',en:'The star and the burnt title'},
  {id:'ash',file:'ash',t:284,scene:'ash',zh:'灰：只剩一个朱砂点',en:'Ash: one cinnabar point left'}
];

export const sunMvPipeline=[
  ['分离','Separate','Demucs 把歌曲拆成人声、鼓、贝斯和其他声部，每一层的能量驱动不同的画面。','Demucs splits the song into vocals, drums, bass and the rest; each stem’s energy drives a different part of the picture.'],
  ['对齐','Align','Whisper large-v3 和 stable-ts 把每个字对齐到人声，精确到它被唱出的那一刻。','Whisper large-v3 with stable-ts aligns every character to the vocal, down to the moment it is sung.'],
  ['写字','Write','126 个字渲染成图集：距离场让字在任何尺寸都清晰，另一个通道记录笔顺，让字按笔画写出来。','126 characters become an atlas: a distance field keeps them crisp at any size, another channel stores stroke order so each one is written stroke by stroke.'],
  ['题字','Title','海报书法被抠出，53 笔按标准笔顺排好，烘焙成每个像素的书写时间。','The poster calligraphy is matted out, its 53 strokes put into standard stroke order and baked into a per-pixel writing time.'],
  ['成画','Render','TypeScript + three.js（WebGL2）的 15 个场景，每一帧都是歌曲时间的纯函数；撕裂是唯一的转场。','Fifteen TypeScript + three.js (WebGL2) scenes, every frame a pure function of song time; tearing is the only transition.'],
  ['出片','Export','无头 Chrome 逐帧渲染，每帧平均 10 个抖动子帧、180° 快门，直接把原始画面送进 ffmpeg。','Headless Chrome renders frame by frame, averaging 10 jittered sub-frames over a 180° shutter, streaming raw frames into ffmpeg.']
];

export const sunMvMessages={
  'collection.film':['代码影像','Code films'],
  'now.sunMvLabel':['影像 / 第一支 MV','FILM / FIRST MUSIC VIDEO'],
  'now.sunMvKicker':['每一帧，都由这首歌算出来','EVERY FRAME COMPUTED FROM THE SONG'],
  'now.sunMvTitle':['第一支代码 MV：《没了我你依然拥有太阳》。','My first code music video: 没了我你依然拥有太阳.'],
  'now.sunMvText':['为黄霄雲的《没了我你依然拥有太阳》写了一支完全用代码渲染的 MV。2560 × 1440、60 帧、4 分 53 秒，没有一个镜头是拍的：每个字在被唱出的那一刻一笔一笔写下，标题按笔顺被刮成光，朱砂印做成的太阳只属于“你”，撕裂是唯一的转场。和 Claude 一起，用 three.js、Python 音频分析和 ffmpeg 做完。','I made a music video for Huang Xiaoyun’s 没了我你依然拥有太阳, rendered entirely in code: 2560 × 1440, 60 fps, 4 min 53 s, with no filmed shot. Each character is written stroke by stroke at the moment it is sung, the title is scratched to light in stroke order, a sun made of a cinnabar seal belongs only to “you”, and tearing is the only transition. Made with Claude, using three.js, Python audio analysis and ffmpeg.'],
  'now.sunMvNote':['歌曲录音与歌词版权归原作者；网站只放静音画面节选和原创的开场。','The recording and lyrics belong to their authors; the site shows only muted excerpts and the original opening.'],
  'now.sunMvRoom':['走进代码影像展厅','Enter the Code films room'],
  'now.sunMvPost':['读这支 MV 的手记','Read the note on the film'],
  'now.sunMvRepo':['GitHub 上的源码','Source on GitHub'],
  'now.sunMvArtLabel':['打开《没了我你依然拥有太阳》代码影像展厅','Open the Code films room for 没了我你依然拥有太阳']
};

const cap=(zh,en)=>({zh,en});
export const sunMvPost={
  id:'sun-mv',theme:'sun-mv',number:'19',date:'2026-10-10',edition:'CODE FILM 01 / 2026',
  cover:sunMvAsset+'opening.jpg',image:sunMvAsset+'opening.jpg',link:sunMvLinks.room,
  zh:{
    category:'影像手记 / 第一支 MV',
    title:'用代码写一支 MV：没了我，你依然拥有太阳。',
    summary:'第一个代码视频，也是第一支音乐 MV。四分五十三秒，没有一个镜头是拍的：每个字在被唱出的那一刻写下，太阳是一枚朱砂印，撕裂是唯一的转场。',
    lead:'我一直想做一支 MV，但我没有摄像机，也不会剪辑。后来想明白了：如果每一帧都能由歌本身算出来，那我需要的就只是代码。于是有了这支给《没了我你依然拥有太阳》的代码影像。',
    quote:'没有一个镜头是拍的。\n每一帧，都是这首歌。',
    imageAlt:'MV 开场：深夜般的旧习字纸上，标题书法正被一笔一笔刮成光',
    caption:'FIG. 01 / 开场的十八秒。还没有音乐，只有毛笔划过纸的声音。',
    sections:[
      {title:'一首关于放手的歌',paragraphs:['这首歌由黄霄雲和施牧辰作词作曲，2019 年写下，2024 年收进专辑《没语季节》。在我听来，它讲的是放手：从一个人的世界里退出来，同时相信那里的光并不取决于自己。','歌名本身就是不对称的：离开的是“我”，太阳留给“你”。这支 MV 想把这种不对称变成画面。']},
      {title:'字是画面本身',paragraphs:['我不想把歌词当字幕贴在画面上。每个字都在被唱出的那一刻写下，一笔一笔，墨还会继续洇开；旧的字不会消失，而是沉淀下去，慢慢把纸写成了夜。','做到这一点要先把歌拆开：Demucs 分离人声和伴奏，Whisper 把每个字对齐到人声。字体被渲染成带笔顺的距离场，标题的 53 笔也按标准笔顺排好，烘焙成每个像素的书写时间。'],image:sunMvAsset+'tear-sun.jpg',imageAlt:'整张纸被撕开，露出虚空里那枚朱砂印做成的太阳',caption:'FIG. 02 / 撕开。纸碎之后，才看见那枚印。'},
      {title:'朱砂只属于“你”',paragraphs:['整支片子几乎只有墨和纸的颜色。唯一的红是朱砂：印做成的太阳、习字格、伤口一样的碎片，都属于歌里的“你”。冷和远，属于“我”。','每一次转场都是撕裂、龟裂或者粉碎。安静也是一种材料：留白和静止，和高潮一样有分量。'],image:sunMvAsset+'ash.jpg',imageAlt:'片尾，标题渗回墨色的纸里，夜一样的纸面上只剩一个发光的朱砂点',caption:'FIG. 03 / 灰。字都沉回纸里，只剩一个朱砂点。'},
      {title:'每一帧，都是时间的函数',paragraphs:['画面用 TypeScript 和 three.js 写成，十五个场景，每一帧都只取决于歌曲时间。导出时用无头 Chrome 逐帧渲染，每帧平均十个子帧，模拟 180° 快门的运动模糊，再直接送进 ffmpeg。','2560 × 1440、60 帧，一共 17,558 帧，渲染了四十多分钟。整个过程是和 Claude 一起完成的：从音频分析、笔顺烘焙到每个着色器。'],image:sunMvAsset+'star.jpg',imageAlt:'高潮处，印章龟裂脱落，露出一颗燃烧的星，标题书法被烙在星上',caption:'FIG. 04 / 星。印章碎掉之后，下面是一颗真正的星。'},
      {title:'第一支，不会是最后一支',paragraphs:['这是我做的第一个代码视频，也是第一支 MV。展厅里放了几段静音的画面节选和完整的开场；源码和做法在 GitHub 上。整支片子的每一句歌词都写在画面里，所以完整版不在这里公开。','歌曲的录音和歌词属于原作者，所以这里不放歌词，也不放原曲。想听的话，去听原曲，再回来看这些画面。']}
    ],
    cta:'走进代码影像展厅',afterword:'2026.10.10 / 写在迪拜。第一支 MV。'
  },
  en:{
    category:'FILM NOTES / FIRST MUSIC VIDEO',
    title:'Writing a music video in code: the sun stays with you.',
    summary:'My first code video and my first music video. Four minutes fifty-three seconds with no filmed shot: every character is written as it is sung, the sun is a cinnabar seal, and tearing is the only transition.',
    lead:'I had wanted to make a music video for a long time, but I have no camera and I do not edit film. Then it clicked: if every frame could be computed from the song itself, all I needed was code. This is that film, made for 没了我你依然拥有太阳.',
    quote:'No shot was filmed.\nEvery frame is the song.',
    imageAlt:'The opening of the video: on an old practice sheet dark as night, the title calligraphy is scratched to light stroke by stroke',
    caption:'FIG. 01 / The first eighteen seconds. No music yet, only the sound of a brush on paper.',
    sections:[
      {title:'A song about letting go',paragraphs:['The song was written by Huang Xiaoyun and Shi Muchen in 2019 and released in 2024 on the album 没语季节. As I hear it, it is about letting go: stepping out of someone’s world while trusting that the light there never depended on you.','The title itself is asymmetric: “I” am the one who leaves, and the sun stays with “you”. The video tries to turn that asymmetry into images.']},
      {title:'The words are the picture',paragraphs:['I did not want the lyrics as subtitles laid over the picture. Each character is written at the moment it is sung, stroke by stroke, and the ink keeps bleeding afterwards. Old characters do not vanish; they settle, until the page has been written over into night.','That meant taking the song apart first: Demucs separates the voice from the band, Whisper aligns every character to the vocal. The font is rendered into a distance field with stroke order, and the title’s 53 strokes are put in standard stroke order and baked into a writing time for every pixel.'],image:sunMvAsset+'tear-sun.jpg',imageAlt:'The whole sheet torn open, revealing a sun made of a cinnabar seal in the void',caption:'FIG. 02 / Torn open. Only after the paper breaks do you see the seal.'},
      {title:'Cinnabar belongs to “you”',paragraphs:['The film is almost entirely the colours of ink and paper. The only red is cinnabar: the seal-sun, the practice grid, the wound-like shard, all belong to the “you” of the song. The cold and the distance belong to “me”.','Every transition is a tear, a crazing or a shattering. Silence is a material too: empty space and stillness weigh as much as the climaxes.'],image:sunMvAsset+'ash.jpg',imageAlt:'At the end, the title soaks back into the dark sheet until a single glowing cinnabar point is left',caption:'FIG. 03 / Ash. Every word sinks back into the paper; one cinnabar point remains.'},
      {title:'Every frame, a function of time',paragraphs:['The picture is written in TypeScript and three.js: fifteen scenes, each frame depending only on song time. Export runs headless Chrome frame by frame, averaging ten sub-frames per frame to imitate a 180° shutter, and streams straight into ffmpeg.','At 2560 × 1440 and 60 fps that is 17,558 frames, rendered in a little over forty minutes. All of it was made together with Claude, from audio analysis and stroke-order baking to every shader.'],image:sunMvAsset+'star.jpg',imageAlt:'At the climax the seal crazes and falls away to reveal a burning star, with the title calligraphy burnt onto it',caption:'FIG. 04 / The star. Under the broken seal there was a real star.'},
      {title:'The first, not the last',paragraphs:['This is my first code video and my first music video. The room on this site holds a few muted excerpts of the picture and the complete opening; the source and the method are on GitHub. Every lyric line is written into the picture, so the full film is not published here.','The recording and the lyrics belong to their authors, so there are no lyrics and no song here. Listen to the original, then come back to the pictures.']}
    ],
    cta:'Enter the Code films room',afterword:'10 October 2026 / Written in Dubai. A first music video.'
  }
};
