export const roseraiePost={
  id:'roseraie',theme:'roseraie',number:'11',date:'2026-09-23',version:'0.1.0',
  cover:'./assets/projects/roseraie/home.png',image:'./assets/projects/roseraie/home.png',link:'./gallery.html#project-roseraie',
  zh:{
    category:'工坊手记 / 一个会做事的 Agent',title:'给灵感，开一间蔷薇工坊。',
    summary:'Roseraie 0.1.0 发布了。一间粉色的洛可可工坊，里面住着会思考、会动手，也会在改动之前问你一声的 Agent。',
    lead:'我一直喜欢 Agent，但更想知道：如果它不是一块冷冰冰的命令面板，而是一间愿意陪人慢慢把想法做出来的工坊，会是什么样？Roseraie · 蔷薇工坊，就是我给出的第一版回答。',
    quote:'让灵感，在此盛放。\n让每一步，都有迹可循。',
    imageAlt:'Roseraie · 蔷薇工坊 0.1.0 的实际 Windows 桌面首页',caption:'LE SALON DES POSSIBLES / 真实桌面界面。玫瑰纸色、细线花饰与一个等待开始的输入框。',
    sections:[
      {title:'从一句念头，到一件作品',paragraphs:['首页故意留了很大的呼吸空间。我希望打开软件的时候，先看到的不是一堆设置，而是一句邀请：写下你的目标，让 Rosalie 陪你把它做完。它会在选定的本地工作空间里阅读文件、调用工具、整理过程；模型可以通过 CLI 或 API 预设接入。','“织思”是我最喜欢的部分。先构思，再质询，最后定稿。它不把第一个答案当作终点，而是让一个想法有机会被换个角度看一遍，再变成更像作品的东西。']},
      {title:'花饰背后，是清楚的边界',paragraphs:['我用了淡粉色、薰衣草紫、细线蔷薇和缓缓飘下的花瓣。它们让界面有一点洛可可的浪漫，但 Agent 真正重要的地方仍然是“动手之前先说清楚”。文件写入和命令执行都有确认关口；检查点、工作手记与上下文胶囊帮助我回看它做过什么。','这版通过了 12 项测试、构建和 Windows 桌面基本检查。在真实 Codex CLI 的受控流程里，它完成了一次小修复；文件改动确认的截图来自这次测试。这个证据说明流程确实跑过，不能代替所有模型或项目环境的完整验证。'],image:'./assets/projects/roseraie/file-approval.png',imageAlt:'Roseraie 在受控测试中显示文件改动确认，列出修改前后并要求批准',caption:'REVIEW BEFORE WRITE / 真实测试截图。每次文件改动，先让人看见。'},
      {title:'第一版，先让它开门',paragraphs:['0.1.0 已提供 Windows 安装版和免安装版，也把源代码、校验值和中英文使用说明放到了 GitHub。安装包目前未签名。Claude 的实测被服务端 403 拒绝，Gemini 在这台机器上尚未安装，其他 API 预设和跨环境表现还需要继续验证。','所以我把它叫作第一版工坊，而不是已经包办一切的助手。现在它有了形状，也真的能在有边界的条件下做事。接下来，继续让它变得更可靠，也继续让这朵玫瑰长出新的枝叶。']}
    ],cta:'走进蔷薇工坊的展柜',afterword:'写给一个新的开始。花会继续开，作品也会继续长。'
  },
  en:{
    category:'ATELIER NOTES / AN AGENT THAT ACTS',title:'A little atelier for ideas in bloom.',
    summary:'Roseraie 0.1.0 is out: a Rococo-pink atelier with an agent that can think, act and ask before it changes your files.',
    lead:'I have been fascinated by agents for a while. But what if one felt less like a wall of commands and more like a studio where an idea could take shape, slowly and carefully? Roseraie is my first answer.',
    quote:'A little grace for every great idea.\nA clear trace for every step.',
    imageAlt:'Actual Windows desktop home of Roseraie 0.1.0',caption:'LE SALON DES POSSIBLES / The real desktop interface: rose paper, fine filigree and an invitation to begin.',
    sections:[
      {title:'From a sentence to a piece of work',paragraphs:['I left room to breathe on the home screen. I wanted to open the app and meet an invitation, rather than a stack of settings: write your goal, and let Rosalie help you work through it. Inside a selected local workspace, it can read files, call tools and keep a record. Models connect through CLI or API presets.','The Weave is my favourite part. Frame, question, craft: three passes that give an idea a second look before it becomes a finished piece. The first answer is a beginning, not a finish line.']},
      {title:'An ornate surface, a visible boundary',paragraphs:['Soft pink, lavender, rose filigree and drifting petals give the interface a Rococo warmth. Underneath, the important rule is simple: be clear before acting. File writes and commands pass through approval gates; checkpoints, a journal and context capsules help me see what happened.','Version 0.1.0 passed 12 tests, a build and basic Windows desktop checks. In a controlled run through a real Codex CLI flow, it completed a small repair. The approval image here is from that run. It shows the path was exercised; it does not prove every model or workspace will behave the same way.'],image:'./assets/projects/roseraie/file-approval.png',imageAlt:'Roseraie shows a file-change approval during a controlled test, with before and after code',caption:'REVIEW BEFORE WRITE / A real test capture. See the change before allowing it.'},
      {title:'An early edition with the door open',paragraphs:['The first release includes Windows setup and portable packages, source code, checksums, and documentation in Chinese and English. The packages are unsigned. Claude testing met a provider-side 403, Gemini was not installed here, and other API presets and cross-environment behaviour need more verification.','I call this the first edition of an atelier, not a finished assistant for everything. It has its own shape, and it can already work inside a deliberate boundary. Next I want to make it more dependable—and keep seeing where this little rose can grow.']}
    ],cta:'Enter the Roseraie exhibit',afterword:'A note for a new beginning. More petals, more work, and more room to grow.'
  }
};
