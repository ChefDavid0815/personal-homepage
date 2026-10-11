// 《周旋》 code-rendered music video (F:\短片\zhouxuan): facts, film map, excerpts, Now and Post copy.
// The recording and the lyrics belong to their authors. Every lyric line is written into the film's
// picture, so the site shows only lyric-free muted excerpts and the film's original cold open (the crayon
// title with its scratching sound, made by ChefZC). No lyrics are reproduced anywhere.
export const zxAsset='./assets/projects/zhouxuan/';
export const zxLinks={room:'./films.html#zhouxuan',post:'./post.html?article=zhouxuan',now:'./now.html#milestone-zhouxuan'};

export const zxSong={
  title:'周旋',titleEn:'Zhouxuan',
  credits:[['演唱','Performed by','王以太 & 艾热AIR','Yitai Wang & AIR'],['作词 / 作曲','Words / music','王以太、艾热AIR','Yitai Wang, AIR'],['收录','Released on','EP《太热爱》，2026','the EP 太热爱, 2026'],['出品','Label','1520Vandal / 种梦音乐','1520Vandal / Dream Music Group']]
};

export const zxSpecs=[['2560 × 1440','分辨率','resolution'],['60 fps','帧率','frame rate'],['18,291','帧','frames'],['5:05','片长','running time'],['123','BPM，切点都落在八分音符上','BPM, every cut on an eighth note'],['19','笔，冷开场写出的「周旋」','strokes in the crayon title']];

// Video time = song time + 12 s (the silent cold open). Sections follow 分镜.md.
// heart: the coloured crayon heart from the cover is on screen.
export const zxFilm=[
  {id:'open',t0:0,t1:12,zh:['冷开场','还没有音乐。一根蜡笔线按笔顺写出「周旋」十九笔，每笔一种颜色，只有沙沙声。'],en:['Cold open','No music yet. One crayon line writes the nineteen strokes of 周旋 in stroke order, each in its own colour, with only the scratch of the crayon.'],heart:true},
  {id:'prelude',t0:12,t1:33.7,zh:['前奏','每个琴音射进一根线，绕着一颗看不见的心缠；第十二小节的重拍上，定格成封面那颗心。'],en:['Prelude','Every piano note shoots in a line that winds round an invisible heart; on the downbeat of bar twelve it freezes into the cover’s heart.'],heart:true},
  {id:'verse1',t0:33.7,t1:98.9,zh:['主歌一','胶片、药板、账本、答题卡、修订痕迹、熄灯的高楼：每一句换一种材料。'],en:['Verse one','Film stock, blister packs, a ledger, an answer sheet, tracked changes, a tower whose lights go out: every line is a new material.']},
  {id:'chorus1',t0:98.9,t1:131.9,zh:['副歌一','两根线绕着心转，只有他的那根在动；然后是冰、半调网点、金框与神经网、收据纸带、变平的心电图。'],en:['Chorus one','Two lines circle the heart and only his is moving; then ice, halftone dots, gilt frames and a neural net, a ribbon of receipts, a flat-lining monitor.'],heart:true},
  {id:'interlude',t0:131.9,t1:150.3,zh:['间奏','唱针困在封闭的沟槽里打转；一封没寄出的长信一页页翻过。'],en:['Interlude','A stylus caught circling a locked groove; a long unsent letter turning page by page.']},
  {id:'verse2',t0:150.3,t1:215.9,zh:['主歌二','烟花、路口的光迹、赌桌和提线木偶、剪纸鱼、万花筒、融化的钟、轮盘、翻牌屏。'],en:['Verse two','Fireworks, light trails at a crossing, a gaming table and a marionette, paper-cut fish, a kaleidoscope, melting clocks, a roulette wheel, a split-flap board.']},
  {id:'chorus2',t0:215.9,t1:248.1,zh:['副歌二','更冷的一遍：心在巨大的空间里很小，冻住的画面龟裂，大理石的手结了霜。'],en:['Chorus two','A colder pass: the heart is tiny in a vast space, the frozen picture crazes, a marble hand frosts over.']},
  {id:'finale',t0:248.1,t1:279.8,zh:['终段','灰天压着还没落的雨；所有意象绕心周旋成星系，第三颗心炸成蜡笔雨，湖里的倒影被打碎。'],en:['Finale','A grey sky holding back its rain; every image circles the heart like a galaxy, the third heart bursts into crayon rain, the reflection in the lake breaks.'],heart:true},
  {id:'outro',t0:279.8,t1:304.85,zh:['尾声','一根线又从画外伸进来，开始缠。周旋没有结束。'],en:['Outro','One line reaches in from outside the frame and starts to wind again. The circling does not end.'],heart:true}
];
export const zxFilmEnd=304.85;

// Muted, lyric-free excerpts (the cold open keeps its original crayon sound).
export const zxReel=[
  {id:'opening',file:'opening',t:0,scene:'open',sound:true,zh:'冷开场：蜡笔写出「周旋」',en:'Cold open: 周旋 in crayon'},
  {id:'prelude',file:'prelude',t:22,scene:'prelude',zh:'前奏：线把心撑起来',en:'Prelude: the lines hold the heart up'},
  {id:'record',file:'record',t:133.5,scene:'interlude',zh:'间奏：困在沟槽里的唱针',en:'Interlude: a stylus in a locked groove'},
  {id:'outro',file:'outro',t:285,scene:'outro',zh:'尾声：线又开始缠',en:'Outro: the thread winds again'}
];

export const zxPipeline=[
  ['拆歌','Separate','Demucs（htdemucs_ft）把歌拆成人声、鼓、贝斯和其余声部，每一层的能量各自驱动画面。','Demucs (htdemucs_ft) splits the song into vocals, drums, bass and the rest; each layer drives its own part of the picture.'],
  ['对齐','Align','Whisper 和 stable-ts 把 78 句里的每个字对齐到人声，字在被唱出的那一刻按正确笔顺写出。','Whisper with stable-ts aligns every character of all 78 lines to the vocal, so each is written in correct stroke order at the moment it is sung.'],
  ['节拍','Beat','123 BPM 的拍网加上实测鼓谱（底鼓、拍手、踩镲、钢琴起音）：切点量化到八分音符，物件按拍一顿一顿地动。','A 123 BPM beat grid plus a measured drum map (kick, clap, hats, piano onsets): cuts snap to eighth notes and objects move in on-beat steps.'],
  ['写字','Write','歌词里每个字的标准笔画来自 Make Me a Hanzi，全片只用一种手写字体，粗细、挤出和描边都从它变出来。','Standard stroke data for every character comes from Make Me a Hanzi; the whole film uses one handwritten face, and every weight, extrusion and outline is made from it.'],
  ['成画','Render','一百多个 TypeScript + three.js（WebGL2）镜头：平涂的立体物件、彩色的影子、手绘勾线和排线，最后压一层油画笔触。','More than a hundred TypeScript + three.js (WebGL2) shots: flat-shaded 3D objects with coloured shadows, hand-drawn outlines and hatching, under a final layer of oil-paint strokes.'],
  ['出片','Export','无头 Chrome 逐帧渲染，每帧 8 个子帧、180° 快门；分 16 段、每段 20 秒，断点续渲，约三个小时。','Headless Chrome renders frame by frame with 8 sub-frames and a 180° shutter, in 16 resumable segments of 20 seconds, about three hours in all.']
];

export const zxMessages={
  'now.zxLabel':['影像 / 第二支 MV','FILM / SECOND MUSIC VIDEO'],
  'now.zxKicker':['一颗被线撑着的心','A HEART HELD UP BY LINES'],
  'now.zxTitle':['第二支代码 MV：《周旋》。','A second code music video: 周旋.'],
  'now.zxText':['为王以太和艾热AIR的《周旋》写了第二支完全用代码渲染的 MV：2560 × 1440、60 帧、5 分 05 秒。封面上那团彩色乱线缠成的心变成立体的，被四面八方的线撑在半空；全片所有的线都从它来，又回到它。画面踩着 123 BPM 的拍子切，78 句歌词每个字都按笔顺写进画面。和 Claude 一起完成。','I made a second music video rendered entirely in code, for 周旋 by Yitai Wang and AIR: 2560 × 1440, 60 fps, 5 min 05 s. The cover’s tangle of coloured crayon becomes a 3D heart held up in mid-air by lines from every direction; every line in the film comes out of it and goes back. Cuts land on the 123 BPM grid, and every character of all 78 lines is written into the picture in stroke order. Made with Claude.'],
  'now.zxNote':['歌曲录音与歌词版权归原作者；网站只放不含歌词的静音节选和原创的冷开场。','The recording and lyrics belong to their authors; the site shows only lyric-free muted excerpts and the original cold open.'],
  'now.zxRoom':['走进影像作品展厅','Enter the Films hall'],
  'now.zxPost':['读这支 MV 的手记','Read the note on the film'],
  'now.zxArtLabel':['打开《周旋》的影像展柜','Open the 周旋 film room']
};

const fig=(file,zhAlt,enAlt,zhCap,enCap)=>({file,zhAlt,enAlt,zhCap,enCap});
const F2=fig('prelude.jpg','前奏结束时，彩色蜡笔线缠成的立体心被几十根射进来的线撑在半空','At the end of the prelude, the 3D heart of coloured crayon thread hangs in mid-air on dozens of lines shot in from every side','FIG. 02 / 前奏的最后一拍。心被线撑着，悬在那里。','FIG. 02 / The last beat of the prelude. The heart hangs there, held up by lines.');
const F3=fig('record.jpg','间奏：俯拍的唱机，唱针困在封闭的沟槽里，红色标签上写着「周旋」','Interlude: a turntable seen from above, the stylus caught in a locked groove, 周旋 written on the red label','FIG. 03 / 间奏。唱针在同一圈沟槽里打转。','FIG. 03 / The interlude. A stylus going round the same groove.');
const F4=fig('outro.jpg','尾声：一根线伸进来重新缠成心，上方是小小的「周旋」','The outro: a line reaches in and winds the heart again, with a small 周旋 above it','FIG. 04 / 尾声。线又缠回去了。','FIG. 04 / The outro. The thread winds back.');
export const zxPost={
  id:'zhouxuan',theme:'zhouxuan',number:'20',date:'2026-10-11',edition:'CODE FILM 02 / 2026',
  cover:zxAsset+'prelude.jpg',image:zxAsset+'opening.jpg',link:zxLinks.room,
  zh:{
    category:'影像手记 / 第二支 MV',
    title:'周旋：一颗被线撑着的心。',
    summary:'第二支代码 MV。封面上那团彩色乱线缠成的心变成立体的，被四面八方的线撑在半空；画面踩着 123 BPM 切，每个字都按笔顺写进画面。',
    lead:'第一支 MV 刚导出来的那个晚上，我就开始做第二支。这一次画面的中心是一颗心：用彩色蜡笔线缠成，被四面八方射进来的线撑在半空。片名叫《周旋》，整支片子都在绕着它转。',
    quote:'所有的线都从这颗心里来，\n最后又回到它。',
    imageAlt:'冷开场：黑色粗纸上，一根蜡笔线一笔一笔写出「周旋」，每一笔一种颜色',
    caption:'FIG. 01 / 冷开场的十二秒。还没有音乐，只有蜡笔划过纸的沙沙声。',
    sections:[
      {title:'一首绕着一个人打转的歌',paragraphs:['《周旋》是王以太和艾热AIR合作的 EP《太热爱》里的一首，两人一起作词作曲。旋律说唱，副歌很大，编曲非常满。','我听到的是一个处在下风的人：他宁愿被利用、被索取，也好过现在收到的冷淡。他希望对方是在和他周旋，而他一再让步；可现实里，对方连这场周旋都不愿意参与。片子想把这种拧着的、难受的、不甘心的状态画出来。']},
      {title:'一颗心，所有的线',paragraphs:['EP 封面是一团彩色乱线缠成的心。我把它做成了立体的：每根线都是贴着心形曲面缠绕的弧，缠绕的轴随长度慢慢偏转，越缠越乱，像一团真的毛线。','它是全片的母题。歌词的笔画、电话线、红线、胶片、心电图、雨丝、烟、五线谱，所有的线都从它来，最后又回到它。前奏里，每一个琴音射进一根线；到第十二小节的重拍，线把心撑了起来，画面定格成封面。'],...F2},
      {title:'不画人，只写「我」和「你」',paragraphs:['画小人会出戏，所以全片没有人物。他是立体的墨蓝色「我」，她是立体的纸白色「你」，字站在地上，伞靠着「我」，烟夹在「我」的右上角。','风格只有一种：平涂的立体物件放进几何色块切出来的海报构图里，压上手绘勾线和排线，最后是一层油画笔触。颜色很克制，每个画面最多一个陶土红，用来点出那一点不甘：没撑开的伞、烟头、唱不上去的那个音。浓重的印象派笔触只留给间奏和终段的湖。'],...F3},
      {title:'两个空拍',paragraphs:['歌里有两个几乎静下来的空拍，我把它们做成了全片最安静的两个画面。第一个是聊天界面上的「对方正在输入…」，第二个是「消息已发出，但被对方拒收了」。','四个被唱出来的英文词各自变成一个意象：一颗碎掉的心；先搭好一整套日落布景再甩手离开；一把铲子从心里挖出金币；一颗像书一样被剖开的大脑，脑回是用反应扩散方程一点点长出来的。']},
      {title:'每一帧都踩在拍子上',paragraphs:['歌是 123 BPM。我先用 Demucs 把歌拆成几个声部，用 Whisper 把 78 句里的每个字对齐到人声，再测出一张鼓谱。镜头的切点都量化到离句首最近的八分音符上，物件按拍一顿一顿地动；唱得快的地方多切多动，唱得慢的地方就静下来。','画面是一百多个 TypeScript 和 three.js 写的镜头，每一帧都只取决于歌曲时间。导出用无头 Chrome 逐帧渲染，每帧 8 个子帧、180° 快门，分成 16 段断点续渲，一共 18,291 帧，跑了大约三个小时。和第一支一样，这支也是和 Claude 一起完成的。']},
      {title:'第二支，放进自己的展厅',paragraphs:['现在影像作品有了自己的展厅，两支 MV 都在那里，以后的视频也会放进去。展柜里放了几段不含歌词的静音节选和完整的冷开场。','这支片子的每一句歌词都写在画面里，所以完整版不在网站上公开。歌曲的录音和歌词属于原作者；想听的话，去听原曲。'],...F4}
    ].map(s=>s.file?{title:s.title,paragraphs:s.paragraphs,image:zxAsset+s.file,imageAlt:s.zhAlt,caption:s.zhCap}:s),
    cta:'走进影像作品展厅',afterword:'2026.10.11 / 写在迪拜。第二支 MV。'
  },
  en:{
    category:'FILM NOTES / SECOND MUSIC VIDEO',
    title:'周旋: a heart held up by lines.',
    summary:'A second code music video. The cover’s tangle of coloured crayon becomes a 3D heart held in mid-air by lines from every side; cuts land on 123 BPM and every character is written into the picture in stroke order.',
    lead:'The evening my first music video finished exporting, I started the second. This time the centre of the picture is a heart wound from coloured crayon thread and held up in mid-air by lines shot in from every direction. The song is called 周旋, to circle around someone, and the whole film circles around that heart.',
    quote:'Every line comes out of this heart,\nand every line goes back.',
    imageAlt:'The cold open: on black paper, one crayon line writes 周旋 stroke by stroke, each stroke in a different colour',
    caption:'FIG. 01 / Twelve seconds of cold open. No music yet, only the scratch of crayon on paper.',
    sections:[
      {title:'A song that circles one person',paragraphs:['周旋 is on 太热爱, an EP by Yitai Wang and AIR, who wrote the words and music together. It is melodic rap with an enormous chorus and a very full arrangement.','What I hear is someone on the losing side of a love: he would rather be used, asked for things, taken advantage of, than meet the coldness he gets now. He wishes she were the one manoeuvring while he kept giving way; in fact she will not even play. The film tries to draw that twisted, uncomfortable, unresigned state.']},
      {title:'One heart, every line',paragraphs:['The EP cover is a heart made of a tangle of coloured lines. I made it three-dimensional: every thread is an arc wound over a heart-shaped surface, its winding axis drifting along its length so the ball gets messier, like real yarn.','It is the film’s motif. Lyric strokes, phone cords, a red thread, film stock, an ECG trace, rain, smoke, music staves: every line comes out of it and goes back. In the prelude each piano note shoots a line in; on the downbeat of bar twelve the lines hold the heart up and the frame freezes into the cover.'],...F2},
      {title:'No figures, only 我 and 你',paragraphs:['Little people broke the spell, so the film has no characters. He is a solid ink-blue 我, “I”; she is a solid paper-white 你, “you”. The characters stand on the ground, an umbrella leaning on 我, a cigarette tucked at its corner.','There is one style: flat-shaded 3D objects set into poster compositions cut from geometric blocks of colour, with hand-drawn outlines and hatching and a final layer of oil-paint strokes. Colour is restrained, with at most one clay red per frame for the thing that will not give up: an unopened umbrella, a cigarette end, the note that cannot be reached. Heavy impressionist brushwork is kept for the interlude and the lake in the finale.'],...F3},
      {title:'Two empty beats',paragraphs:['The song has two beats where almost everything drops out, and they became the two quietest pictures in the film. The first is a chat window saying “typing…”; the second is a message that was sent and then refused.','The four English words the song sings each became one image: a heart breaking; a whole sunset set built and then walked away from; a shovel digging coins out of a heart; a brain opened like a book, its folds grown with a reaction-diffusion equation.']},
      {title:'Every frame on the beat',paragraphs:['The song runs at 123 BPM. Demucs splits it into parts, Whisper aligns every character of the 78 lines to the vocal, and a measured drum map sits on top. Every cut snaps to the eighth note nearest the start of a line, and objects move in on-beat steps; fast delivery means more cuts and motion, slow delivery means stillness.','The picture is more than a hundred TypeScript and three.js shots, each frame depending only on song time. Export runs headless Chrome frame by frame with 8 sub-frames and a 180° shutter, in 16 resumable segments: 18,291 frames in about three hours. Like the first film, it was made with Claude.']},
      {title:'A second film, in a room of its own',paragraphs:['Films now have a hall of their own. Both music videos live there, and future videos will too. The room holds a few lyric-free muted excerpts and the complete cold open.','Every lyric line is written into this film’s picture, so the full film is not published on the site. The recording and the lyrics belong to their authors; to hear the song, listen to the original.'],...F4}
    ].map(s=>s.file?{title:s.title,paragraphs:s.paragraphs,image:zxAsset+s.file,imageAlt:s.enAlt,caption:s.enCap}:s),
    cta:'Enter the Films hall',afterword:'11 October 2026 / Written in Dubai. A second music video.'
  }
};
