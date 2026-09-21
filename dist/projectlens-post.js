export const lensPost={
 id:'projectlens',theme:'lens',number:'08',date:'2026-09-21',version:'0.1.0',
 cover:'./assets/projects/projectlens/cover.svg',image:'./assets/projects/projectlens/workspace.jpg',link:'./gallery.html#project-projectlens',
 zh:{
  category:'BUILD NOTES / PROJECTLENS',title:'给代码，换一副眼镜。',
  summary:'项目越做越多，文件夹也越来越热闹。ProjectLens 是我做的一枚本地项目透镜：顺着文件、规则和证据，找一找下一步从哪里开始。',
  lead:'最近做了不少东西。写的时候注意力全在“把它做出来”，回头再看，文件夹已经长成一片小树林：代码、配置、依赖，还有几句准备以后再处理的 TODO。我想给这种时刻做一个工具——打开项目，先看看里面是什么样。',
  quote:'让文件之间的线索，\n变成清楚的下一步。',
  imageAlt:'ProjectLens 的真实初始界面：选择本地项目文件夹，开始静态检查',
  caption:'FRAME 01 / 真实软件前端，尚未选择文件夹。此图来自浏览器渲染；目录扫描在 Windows 桌面版运行。',
  sections:[
   {title:'文件夹里的小树林',paragraphs:['这个新工具叫 ProjectLens，中文是“项目透镜”。它看起来像文件探索工具，不过更关心一个项目的轮廓：哪些语言在里面，入口可能在哪里，依赖和文档有没有准备好。','选择文件夹后，它会读取代码、配置和文档，用本地静态规则找出值得留意的线索。它不会替我写完项目，也不会把分数当作答案。对我来说，能把“有点乱，但不知道从哪开始”变成几个可以逐项看的问题，就已经很有用了。']},
   {title:'提醒最好带着地址',paragraphs:['只说“这里可能有问题”，很难让人知道下一步该做什么。所以我更在意的是路径、行号、证据，以及一段能看懂的建议。问题清单可以搜文件、规则或描述，也能按严重程度筛选。','第一版会看疑似凭据、一些常见代码维护信号、缺失的工程文件和重复内容。疑似密钥的证据会脱敏；整个默认扫描过程留在本机，不需要远程 AI，也没有接漏洞数据库。需要带走的结果，可以导出 Markdown 或 JSON。']},
   {title:'把代码当作一片可以观察的风景',paragraphs:['这次我想要硬核一点，但不想把展柜做成另一张密密麻麻的表。石墨黑是底色，薄荷绿和冰蓝像仪器边缘的光。悬浮镜圈、半透明玻璃、叠起来的代码板，让“看得更清楚”变成一个能看到的东西。','你可以在展柜里切换结构、线索和报告三个视角。光会变化，透镜会轻轻转动。这些是我给作品做的视觉表达，展柜不会扫描访问者的文件。工具负责把事情讲明白，展柜负责让人愿意走近一点。'],image:'./assets/projects/projectlens/cover.svg',imageAlt:'ProjectLens 视觉海报：石墨黑背景、薄荷玻璃透镜与层叠代码板',caption:'OPTICAL STUDY / 005。为 ProjectLens 绘制的视觉作品，不是扫描结果。'},
   {title:'第一枚透镜，先走到这里',paragraphs:['现在是 0.1.0，一个 Windows 桌面 MVP。基础规则测试和构建通过了，但这还不意味着它能找出所有问题。静态启发式规则会误报，也会漏掉东西；编译、测试和真正的安全审查，仍然要各自认真做。','界面可以在中文和 English 之间切换，也能跟随系统语言。选择会留在本机，扫描提示、问题建议和导出的报告也跟着切换。项目说明和这篇文章同样有英文版。Windows 便携包已经放到 GitHub，当前没有代码签名。它还没有可独立扫描目录的网页版，所以网页里保留的是展柜和介绍。','喜欢做工具，大概就是因为这种小小的满足感：前几天还在想“要是有一个就好了”，今天它已经有了名字，也有了自己的位置。下一次打开一个项目，就从这里再看一眼。']}
  ],cta:'走进 ProjectLens 展柜',afterword:'写于 ProjectLens 0.1.0 加入作品集的这一天。保持好奇，把线索看清楚。'
 },
 en:{
  image:'./assets/projects/projectlens/workspace-en.jpg',
  category:'BUILD NOTES / PROJECTLENS',title:'A clearer lens for the code I make.',
  summary:'More projects, more crowded folders. ProjectLens is a local lens for code, configuration and documentation, following files and evidence towards a clearer next step.',
  lead:'I have been making quite a few things lately. While building, all my attention goes towards getting an idea working. Looking back, the folders have become little forests: code, configuration, dependencies and a few TODOs waiting for another day. I wanted a tool for that moment: open a project and get a sense of what is inside.',
  quote:'A quieter folder.\nA clearer next step.',
  imageAlt:'The actual ProjectLens initial interface, ready to select a local project folder',
  caption:'FRAME 01 / Actual frontend before folder selection, rendered in a browser. Directory scanning runs in the Windows desktop app.',
  sections:[
   {title:'The little forest inside a folder',paragraphs:['The new tool is called ProjectLens. It has something of a file explorer about it, but it is interested in the shape of a project: its languages, possible entry points, dependencies and documentation.','Select a folder and it reads code, configuration and documentation using local static rules. It cannot finish a project for me, and a score is not an answer. But turning “this is a bit messy” into a few things I can inspect one at a time is a useful place to start.']},
   {title:'A finding should come with an address',paragraphs:['“Something might be wrong here” is hard to act on. I care more about a path, a line number, evidence and a suggestion I can understand. The findings list can be searched by file, rule or description, and filtered by severity.','The first version looks for possible credentials, common maintenance signals, missing project foundations and duplicate content. Potential secrets are redacted in the evidence. The default scan stays on the device, without remote AI or a vulnerability database. Reports can leave the app as Markdown or JSON.']},
   {title:'Code as a landscape to explore',paragraphs:['I wanted a more technical identity this time, with enough room for art. Graphite black holds the composition together. Mint and ice blue trace the edges like light on an instrument. A floating metal ring, translucent glass and layered code plates turn the idea of looking closer into something visible.','The exhibit offers three perspectives: structure, signals and report. The light changes and the lens turns gently. This is artwork for the project; the exhibit does not read visitors’ files. The tool makes the details clearer, and its little exhibition invites people closer.'],image:'./assets/projects/projectlens/cover.svg',imageAlt:'ProjectLens art poster with a mint optical lens and layered code plates on graphite black',caption:'OPTICAL STUDY / 005. Artwork made for ProjectLens, not a scan result.'},
   {title:'The first lens, for now',paragraphs:['Version 0.1.0 is a Windows desktop MVP. Its basic rule tests and build pass, but that does not mean it finds every problem. Static heuristics can miss issues and raise false positives. Compilation, testing and proper security review still have their own jobs to do.','The interface switches between Chinese and English, or follows the system language. It remembers the choice locally, and scan messages, recommendations and exported reports follow along. The project documentation and this note are bilingual too. A Windows portable build is on GitHub and is currently unsigned. There is no independent browser-based directory scanner yet, so the website presents the exhibition and introduction.','That small satisfaction is part of why I like making tools. A few days ago, it was “I wish I had something for this.” Today, it has a name and a place of its own. Next time I open a project, I can take another look.']}
  ],cta:'Explore the ProjectLens exhibit',afterword:'Written as ProjectLens 0.1.0 joins the collection. Stay curious. Follow the signal.'
 }
};
