export const axiomPost = {
  id: 'axiom', theme: 'axiom', number: '04', date: '2026-09-18',
  cover: './assets/projects/axiom/experiment.svg', image: './assets/projects/axiom/workspace.png',
  link: './axiom/',
  zh: {
    category: '制作手记 / AXIOM 1.0', title: '给好奇心，一张自己的工作台。',
    summary: 'AXIOM · 格物上线了。从一列实验数据，到拟合线、误差棒和新的问题，把我对数学、物理与代码的兴趣，放进同一个空间。',
    lead: '有些问题，需要先把它画出来。数字排成一列时像记录，落到坐标里时，却开始显露关系。AXIOM · 格物，就是我为这个过程做的一张工作台。',
    quote: '让数据，形成观点。\n也给每一个结论，留一点被追问的空间。',
    imageAlt: 'AXIOM 真实工作台截图，使用内置胡克定律示例展示散点、误差棒和线性拟合',
    caption: 'FIGURE 01 / 真实软件界面。图中为内置胡克定律教学示例，不是新的实验测量。',
    sections: [
      {title:'从课堂里的问题出发', paragraphs:['我正在读 IB，也向往计算机工程和空气动力学。数学、物理和代码，对我来说并不是完全分开的几件事：一个帮助描述问题，一个帮助理解世界，还有一个让想法变成可以亲手操作的东西。','做完篮球游戏和模组管理工具之后，这次想做一件更靠近学习的作品。AXIOM 的起点很直接：把数据放进来，看清关系，试试不同的模型，再把结果带走。不只是得到一个数字，也能看见它是怎样出现的。']},
      {title:'先看见，再理解', paragraphs:['在 AXIOM 里，可以导入 CSV、TSV、XLSX 或 JSON，也可以直接粘贴表格。指定变量之后，散点图、折线图、柱状图和其他图表就有了各自的用途。九种图表不是为了堆数量，而是想给不同的问题，留不同的观察角度。','我给工作台做了研究、IB 学生和专业三种模式。拟合、误差棒、残差、适用条件下的置信带，都可以放回图里一起看。旁边的公式库则收进了 22 条数学与物理公式，改变变量时，计算结果会跟着变化。'], image:'./assets/projects/axiom/experiment.svg',imageAlt:'根据软件内置十二个示例观测值绘制的胡克定律图版',caption:'FIGURE 02 / 同一组内置示例数据。蓝色描出关系，黄绿色标记斜率的几何意义。'},
      {title:'科学工具，也可以有自己的样子', paragraphs:['这一次的颜色更清晰：冷白和墨黑搭起结构，荧光黄绿点亮操作，钴蓝留给图上的线和点。粗体字、坐标网格、细分隔线，组成它的视觉语言。它和 Folio 的手帖气质不一样，但我希望它们都有认真做过细节的感觉。','Gallery 里的展柜沿用了这套语言。图表像一张实验图版，旁边放真实的工作台；Now 的小窗也接上同一段视觉。代码、软件和展示页面，应该能被认出是同一件作品。']},
      {title:'第一版，保持清楚，也保持好奇', paragraphs:['网页版已经可以直接打开，不需要注册。计算和数据处理都在当前浏览器里，草稿也留在本地；重要的实验要记得导出项目文件。Windows 和网页版使用同一份绘图代码，项目文件可以互通。','不过，一条好看的拟合线不是结论的全部。模型有假设，置信带有适用范围，数值采样也有看不到的地方。AXIOM 不是符号代数系统，也不替任何实验保证答案。把这些边界写清楚，和把界面做好看一样，是这件作品的一部分。','1.0 先走到这里。以后还能继续完善，但今天，它已经从一个想法变成一个真正能打开的工作台。下一步，就拿新的问题来用它。']}
    ],
    cta:'打开 AXIOM · 开始探索', afterword:'写于 AXIOM 1.0 网页版上线的这一天。保持好奇，保持热爱。'
  },
  en: {
    category:'BUILD NOTES / AXIOM 1.0',title:'A workspace of my own, for curiosity.',
    summary:'AXIOM is live. From a column of measurements to a fitted line, error bars and another question: a place for my interests in maths, physics and code to meet.',
    lead:'Some questions become clearer when you draw them. A column of numbers looks like a record; on a set of axes, relationships start to appear. AXIOM is a workspace I made for that process.',
    quote:'From data to discovery.\nWith room to question the conclusion.',
    imageAlt:'The actual AXIOM workspace, using the bundled Hooke’s law example with scatter points, error bars and a linear fit',
    caption:'FIGURE 01 / Actual application. The built-in Hooke’s law teaching example, not a new experimental measurement.',
    sections:[
      {title:'Starting with a classroom question',paragraphs:['I’m studying the IB, with an interest in computer engineering and aerodynamic design. Maths, physics and code do not feel entirely separate to me: one helps describe a question, another helps understand the world, and another turns an idea into something I can use.','After a basketball game and a mod manager, I wanted to build something closer to learning. AXIOM starts with a simple task: bring in data, see the relationship, try a model and take the result away. I want to see how a number came about, as well as the number itself.']},
      {title:'See it, then understand it',paragraphs:['AXIOM imports CSV, TSV, XLSX and JSON, or a pasted table. Map the variables and explore scatter plots, lines, bars and other views. The nine chart types give different questions different ways to be seen.','The workspace has Research, IB Student and Professional modes. Fits, error bars, residuals and supported confidence bands can sit alongside the data. A library of 22 maths and physics calculators lets you change variables and see the result update.'],image:'./assets/projects/axiom/experiment.svg',imageAlt:'A Hooke’s law figure based on the twelve observations bundled with AXIOM',caption:'FIGURE 02 / The same example observations. Cobalt traces the relationship; lime marks the geometry of a gradient.'},
      {title:'A scientific tool with its own character',paragraphs:['The palette is clear: cool white and ink black for structure, electric lime for action, cobalt for lines and observations. Bold lettering, coordinate grids and thin rules give the studio its character. It feels different from Folio’s paper journal, but I want both to show care in the details.','The Gallery exhibition follows that language. A chart becomes an experimental plate, next to the real workspace. The small window on Now carries it too. The software and the pages around it should feel like parts of the same work.']},
      {title:'Version one. Stay clear, stay curious.',paragraphs:['The web edition opens without an account. Data processing happens in the current browser, and drafts stay there too; important experiments should be exported as project files. The Windows and web editions share plotting code and exchange the same project format.','A convincing fitted line is only part of an answer. Models have assumptions, confidence bands have conditions and numerical sampling can miss things. AXIOM is not a symbolic algebra system and cannot guarantee an experiment’s conclusions. Explaining those limits is part of the work, alongside the visual details.','That is where 1.0 begins. There is more to refine, but today an idea has become a workspace you can actually open. Next comes a new question to try in it.']}
    ],cta:'Open AXIOM · Start exploring',afterword:'Written on the day AXIOM 1.0 went live on the web. Stay curious. Keep loving life.'
  }
};
