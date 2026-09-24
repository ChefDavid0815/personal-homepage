export const roseraiePost = {
  id: 'roseraie', theme: 'roseraie', number: '11', date: '2026-09-24', version: '0.2.0',
  cover: './assets/projects/roseraie/home-0.2.0.png',
  image: './assets/projects/roseraie/home-0.2.0.png',
  link: './gallery.html#project-roseraie',
  zh: {
    category: '工坊手记 / 紫罗兰版', title: '给灵感，换一间紫罗兰工坊。',
    summary: 'Roseraie 0.2.0 来了。紫罗兰色的洛可可沙龙里，模型和推理强度可以当场选择；织思也有了自己的审阅视角。',
    lead: '蔷薇工坊开门之后，我总觉得它还缺少一点属于自己的气息。现在，0.2.0 把粉色的第一朵蔷薇，养成了一间有紫罗兰瓷釉、银色花饰和植物画的工作室。外貌变了，想让 Agent 真正做事、也让每一步都看得清楚的心思没有变。',
    quote: '让灵感，在此盛放。\n让每个选择，都留在眼前。',
    imageAlt: 'Roseraie 0.2.0 的真实 Windows 桌面沙龙界面',
    caption: '真实桌面界面。紫罗兰瓷釉、植物画与任务模型选择，构成新版工坊的入口。',
    sections: [
      {
        title: '工坊换上了紫罗兰色',
        paragraphs: [
          '新版的颜色像一层薄薄的紫罗兰瓷釉。银丝花饰沿着窗格生长，植物画和柔光把沙龙围起来，花瓣慢慢从画面里飘过。我想让它看起来像一个愿意久坐的创作空间，而不是把装饰贴在工具外面。',
          '窄窗口里，工作区与手账仍然能找到；打开减弱动态时，内容和操作也不会被藏起来。好看的外壳应该让人更愿意开始，而不是成为使用它的条件。'
        ]
      },
      {
        title: '这一次，模型就在手边',
        paragraphs: [
          '我最想改变的是开始一项任务时的感觉。现在在沙龙里就能为任务选模型和推理强度。本机的 Codex CLI 跑过 GPT-6 Sol、Astra 和 Luna；支持的其他 CLI 与 API 连接会列出各自可用的选项。每条连接的选择留在本机，下次回来不用从头找。',
          '这不是一张宣称所有模型都一样可用的菜单。可选项取决于连接和账户，真实任务仍会走对应的提供方。把决定放在眼前，是为了让开始、调整和回看都更清楚。'
        ],
        image: './assets/projects/roseraie/models-0.2.0.png',
        imageAlt: 'Roseraie 0.2.0 在沙龙内选择任务模型与推理强度的真实界面',
        caption: '模型花园。任务模型与推理强度直接留在创作现场。'
      },
      {
        title: '织思，多了一双眼睛',
        paragraphs: [
          '“织思”原本就是先执行、再用只读的质询阶段换一个角度看，最后定稿。0.2.0 让审阅阶段也能选择自己的连接、模型和推理强度。想让另一种视角来提问，就给它另一条连接；如果沿用同一条连接，它会继承任务阶段的选择。',
          '文件写入与命令执行仍需确认，检查点和手账继续记录过程。这一版通过了 13 项后端测试和生产构建；Windows 安装版与便携版尚未签名，其他提供方还要看各自账户与连接状态。我喜欢它现在的样子，也知道工坊还会继续生长。'
        ]
      }
    ],
    cta: '走进紫罗兰工坊的展柜',
    afterword: '第一朵蔷薇还在。只是现在，整间工坊都开始开花了。'
  },
  en: {
    category: 'ATELIER NOTES / THE VIOLET EDITION', title: 'A violet atelier for ideas in bloom.',
    summary: 'Roseraie 0.2.0 opens a violet Rococo salon. Choose a task model and effort in the room, then give the Weave its own perspective for review.',
    lead: 'After opening the first Roseraie atelier, I kept feeling that it needed a room with a character of its own. Version 0.2.0 turns that first pink rose into violet porcelain, silver filigree and botanical art. The room has changed. The wish to build an agent that can actually work, while keeping each step visible, has not.',
    quote: 'A little grace for every great idea.\nA clear view of every choice.',
    imageAlt: 'Actual Roseraie 0.2.0 Windows desktop salon',
    caption: 'The actual desktop interface. Violet porcelain, botanical art and task model choice shape the new entrance.',
    sections: [
      {
        title: 'The room turns violet',
        paragraphs: [
          'The new colour feels like a thin layer of violet porcelain. Silver filigree grows along the frames; botanical art and soft light surround the salon while petals drift slowly through it. I wanted a place where you might enjoy staying, with the decoration belonging to the work rather than sitting on top of it.',
          'The workspace and journal remain reachable in a narrow window. Reduced motion keeps the content and controls intact. A beautiful surface should make it easier to begin, never become the price of entry.'
        ]
      },
      {
        title: 'A model close at hand',
        paragraphs: [
          'The moment I most wanted to change was the start of a task. You can now choose its model and reasoning effort in the salon. GPT-6 Sol, Astra and Luna have each run through my local Codex CLI. Other supported CLI and API connections show the choices available to them, and the selection stays on this machine for each connection.',
          'This is not a promise that every model works with every account. Availability follows the connection and provider. Keeping the choice in view makes it easier to begin, adjust and later understand what happened.'
        ],
        image: './assets/projects/roseraie/models-0.2.0.png',
        imageAlt: 'Actual Roseraie 0.2.0 interface for choosing a task model and reasoning effort in the salon',
        caption: 'The model garden. Task model and reasoning effort stay in the room where the work begins.'
      },
      {
        title: 'A second pair of eyes for the Weave',
        paragraphs: [
          'The Weave moves from action through a read-only challenge and into refinement. In 0.2.0, that challenge can use a different connection, model and effort. Give it another connection when you want a different perspective; keep the same one and it inherits the task choice.',
          'File writes and commands still wait for approval, and checkpoints and the journal keep a record. This edition passed 13 backend tests and a production build. Its Windows setup and portable packages are unsigned, and other providers still depend on their accounts and connections. I like the shape of this room today, and I know it will keep growing.'
        ]
      }
    ],
    cta: 'Enter the violet atelier exhibit',
    afterword: 'The first rose is still here. Now the whole atelier has started to bloom.'
  }
};
