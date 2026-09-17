// 只需在这里添加项目，主页就会自动生成对应卡片。
// 接入真实项目后，将 demo 设为 false，并填写 repoUrl / liveUrl。
export const projects = [
  {
    id: 'neon', name: 'NEON', subtitle: '让灵感，多一个回声。',
    layout: 'feature', headline: '把一闪而过的灵感，\n变成下一步。',
    description: '一个 AI 灵感工作台的概念设计，将零散的念头整理为清晰的下一步。',
    category: 'AI EXPERIMENT', number: '01', color: 'lime', tags: ['AI', 'Web App'],
    detail: '这个示例展示了 AI 类项目在主页上的呈现方式：鲜明的产品预览、简短介绍，以及未来可以直接访问的项目和源码入口。当前仅为作品集视觉演示，尚未连接真实 AI 服务。',
    demo: true, repoUrl: '', liveUrl: '',
    translations: {
      zh: { category: 'AI 灵感实验', tags: ['AI', '网页应用'] },
      en: {
        subtitle: 'Give your ideas a sounding board.', headline: 'From a passing spark\nto a clear next step.',
        description: 'An AI workspace concept that turns scattered thoughts into a clear next step.',
        detail: 'This concept explores how an AI workspace could appear in a portfolio: a distinct product preview, a short introduction, and space for future demo and source links. It is a visual prototype and is not connected to an AI service.'
      }
    }
  },
  {
    id: 'flow', name: 'FLOW STATE', subtitle: '给专注，留一点频率。', layout: 'sound',
    description: '一个专注与环境声音应用的概念设计，让工作进入自己的节奏。',
    category: 'DIGITAL EXPERIENCE', number: '02', color: 'purple', tags: ['Experience', 'Creative'],
    detail: '这个示例展示了体验类项目的视觉卡片。波形、播放状态和时间在封面中仅用于展示界面设计，当前未接入音频播放或专注计时功能。',
    demo: true, repoUrl: '', liveUrl: '',
    translations: {
      zh: { category: '数字体验', tags: ['体验', '创意'] },
      en: {
        subtitle: 'Find your frequency for focus.',
        description: 'A focus and ambient sound app concept, designed around your own rhythm.',
        detail: 'A visual concept for a focus experience. The waveform, playback state, and timer illustrate the interface design. Audio playback and a working focus timer are not connected.'
      }
    }
  },
  {
    id: 'devkit', name: 'TINY TOOLS', subtitle: '小工具，大有用处。', layout: 'utility',
    description: '一个开发者工具箱的概念设计，把重复的小事交给顺手的工具。',
    category: 'DEVELOPER TOOLS', number: '03', color: 'orange', tags: ['Tools', 'Open Source'],
    detail: '这个示例展示了工具类项目的呈现方式。以后可以在这里放入自己的 JSON 格式化工具、自动化脚本或任何小作品，并配置真实的 GitHub 仓库和在线体验链接。',
    demo: true, repoUrl: '', liveUrl: '',
    translations: {
      zh: { category: '开发者工具', tags: ['工具', '开源'] },
      en: {
        subtitle: 'Small tools. A big difference.',
        description: 'A developer toolbox concept that makes repetitive little tasks easier.',
        detail: 'This concept shows how small utilities can be presented in the collection. It could become a home for JSON formatters, automation scripts, and other small projects, with links to real GitHub repositories and live demos.'
      }
    }
  }
];
