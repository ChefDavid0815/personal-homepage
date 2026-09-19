export const wisPost = {
  id:'wis-tech-tank', theme:'wis', number:'06', date:'2026-09-19', version:'0.2.0',
  cover:'./assets/projects/wis-tech-tank/woodland.webp', image:'./assets/projects/wis-tech-tank/simulation.png',
  link:'./school-gallery.html#project-wis-tech-tank',
  zh:{
    category:'校园手记 / WIS TECH TANK', title:'如果下一步，能被轻轻提醒。',
    summary:'给学校展示做了一个可以反复走进的小世界。STRIDE：九种模拟环境，一点语音、一点振动，还有把周围的路看懂的好奇心。',
    lead:'平时走路，好像没有多少事情值得停下来想。但如果前方突然多了一张桌子，路面换成碎石，或者脚下出现了向下的台阶，一个设备应该怎么把这些变化告诉我们？为了 WIS TECH TANK 的学校展示，我把这个问题做成了一个可以打开、暂停、重来的小世界。',
    quote:'先让变化被看见，\n再让提醒恰到好处。',
    imageAlt:'STRIDE 真实模拟界面：下行楼梯、三维步道、语音提示、振动波形与模拟传感器格子',
    caption:'观察图版 01 / 软件真实界面，展示下行楼梯场景。环境、距离和传感器数据均为模拟。',
    sections:[
      {title:'从一条很普通的路开始',paragraphs:['它叫 STRIDE。打开的时候，是一条安静的绿色步道，旁边有树，一个小人站在路中间。点下开始，他就向前走。屏幕右边，语音内容、振动节奏和传感器格子跟着场景变化。', '我先放进了九种情况：平路、碎石、桌子、小球、下行楼梯、坑洞、低垂树枝、被挡住的路径，还有传感器失效。它们像九张可以随时翻开的实验卡。没有真实摄像头也能玩，也不用为了重新演示，把桌子搬来搬去。']},
      {title:'同一条路，走快一点会怎样？',paragraphs:['我最喜欢的小地方，是可以调行走速度。楼梯的位置没变，但走得快了，预计到达的时间就会变短；慢下来，又能多留一点反应时间。距离除以速度，这条平时写在纸上的关系，在这里突然有了动作。', '路面反馈也可以选 10、45 或 60 秒，模拟分类置信度能调，两种视角能换。按暂停，就能停在某一个瞬间，看看刚才的判断。重置之后又是一条新的路。展示时如果忙着讲解，也可以让自动演示帮忙切换场景。']},
      {title:'让提醒，也有自己的轻重缓急',paragraphs:['碎石路和下行楼梯，不应该说同一句话，也不该用同一种节奏。于是我把语音、字幕、马达动画和波形摆在一起。短一点、长一点、连续一点，原本抽象的触觉反馈，就变成了可以比较的画面。', '危险提示会先于普通路面提示，模拟人物会在接触障碍之前停下。数据不可靠的时候，也会先停下来确认。这一幕其实很简单，却是我很在意的一点：不知道的时候，就诚实地说不知道。展开判断记录，还能顺着时间看看每一个提示为什么出现。']},
      {title:'小世界之外，留一点空间',paragraphs:['STRIDE 也有一个真实环境模式，可以尝试摄像头或图片、本地物体检测和相对远近信息。不过这篇想先把模拟讲清楚，因为它最适合课堂：变量可以控制，同一个过程可以重来，大家也更容易看懂变化从哪里来。它是一个概念原型，还不能带着人安全导航，也没有连接实体马达。', '给它做展柜时，我想起那条安静的绿色步道。森林绿、纸张白、树叶间慢慢移过的光，就成了这一页的颜色。个人网站也因此新开了一间校园实验室，和原来的作品分开陈列。以后在课堂里冒出来的新问题，也可以在这里慢慢长大。'],image:'./assets/projects/wis-tech-tank/woodland.webp',imageAlt:'原创森林步道视觉：晨光、蕨类植物与延伸进树林的浅色小路',caption:'观察图版 02 / 为展柜生成的原创环境艺术插画；并非软件摄像头画面或环境重建。'}
    ],
    cta:'走进 STRIDE 的校园展柜', afterword:'写给一次学校展示，也写给下一次好奇。'
  },
  en:{
    category:'SCHOOL NOTES / WIS TECH TANK', title:'What if the next step came with a gentle nudge?',
    summary:'A little world built for a school presentation. STRIDE brings nine simulated environments, speech and haptic patterns together — and a curiosity about understanding the path ahead.',
    lead:'Most of the time, walking does not seem to need much thought. But what if a table appeared ahead, the pavement became gravel, or the next step led down a staircase? How should a device tell us what changed? For the WIS TECH TANK presentation, I turned that question into a little world you can open, pause and try again.',
    quote:'First, make the change visible.\nThen, find the right way to respond.',
    imageAlt:'Actual STRIDE simulation interface: downward stairs, a 3D path, speech guidance, haptic waveform and simulated sensor grid',
    caption:'FIELD PLATE 01 / Actual application interface, showing the stairs scenario. The environment, distances and sensor readings are simulated.',
    sections:[
      {title:'Start with an ordinary path',paragraphs:['It is called STRIDE. When you open it, there is a quiet green walkway, a few trees and a small person standing in the middle. Press start and they move forward. On the right, speech, motor patterns and a sensor grid respond to the scene.', 'I added nine situations: smooth pavement, gravel, a table, a small ball, downward stairs, a pothole, a low branch, a blocked path and sensor failure. They feel like nine experiment cards you can turn over whenever you like. No camera is needed, and nobody has to move a real table back into place for the next demonstration.']},
      {title:'Same path. What if we walk a little faster?',paragraphs:['One of my favourite details is the speed control. The stairs stay in the same place, but walking faster shortens the estimated arrival time. Slow down and there is more time to react. Distance divided by speed, a relationship usually written on paper, suddenly has movement.', 'Terrain feedback can run for 10, 45 or 60 seconds. You can adjust simulated classification confidence and switch viewpoints. Pause on a moment to look at the decision, or reset and start again. During a presentation, the guided demo can change scenes while I explain what is happening.']},
      {title:'Every reminder needs its own weight',paragraphs:['Gravel and downward stairs should not produce the same words or the same rhythm. I put speech, captions, a motor animation and the waveform together. Shorter, longer, repeated: an abstract haptic response becomes something you can look at and compare.', 'Urgent warnings interrupt ordinary terrain feedback, and the simulated person stops before contact. Unreliable data asks for a stop and a check, too. It is a small moment, but one I care about: when you do not know, say so. The decision log lets you follow each reminder back through the session.']},
      {title:'Leave room beyond the little world',paragraphs:['STRIDE also has a real environment mode for trying camera or image input, local object detection and relative proximity. I wanted this note to focus on simulation because it is such a useful classroom format: the variables are controllable, the process repeatable, and the changes easier to understand. It is a concept prototype, not a safe navigation device, and no physical motor is connected.', 'When I designed its exhibition, I kept coming back to that quiet green path. Forest green, warm paper and light moving through leaves became the colours of this page. My website now has a separate school lab alongside the main collection. A place for the next classroom question to take root.'],image:'./assets/projects/wis-tech-tank/woodland.webp',imageAlt:'Original woodland artwork: morning light, ferns and a pale footpath winding into the trees',caption:'FIELD PLATE 02 / Original AI-generated environmental artwork for the exhibition, not a camera frame or a reconstruction made by the app.'}
    ],
    cta:'Explore the STRIDE school exhibition', afterword:'For a school presentation, and whatever makes me curious next.'
  }
};
