// Published versions, newest first. Each entry describes the edition as shipped.
export const roseraieReleases = [
  {
    version: '0.2.0', date: '2026-09-24',
    zh: {
      name: '紫罗兰工坊',
      intro: '给真正工作的 Agent，换上一间紫罗兰瓷釉与植物画交织的工坊。',
      changes: [
        ['视觉与空间', '紫罗兰瓷釉、银色花饰、植物画、分层光影和缓缓飘动的花瓣重塑沙龙。窄窗口保留侧栏入口，减弱动态时内容和操作仍完整。'],
        ['任务模型选择', '每次任务可选择 GPT-6 Sol、Astra 或 Luna 与推理强度；支持的官方 CLI 和 API 连接可选各自可用的模型，选择按连接保存在本机。'],
        ['织思审阅', '质询阶段可以选择另一连接及其模型、推理强度；同一连接则沿用执行阶段的选择。构思、只读质询与定稿仍围绕同一个目标。']
      ],
      note: '13 项后端测试及生产构建通过。Windows 安装版与便携版未签名；本机 Codex CLI 的 Sol、Astra、Luna 已分别验证，其他服务商能力取决于账户与连接。'
    },
    en: {
      name: 'The violet atelier',
      intro: 'A violet porcelain room, silver filigree and botanical art for an agent that can actually work.',
      changes: [
        ['A new room', 'Violet porcelain, silver filigree, botanical art, layered light and drifting petals reshape the salon. Narrow windows retain access to the journal; reduced motion keeps every control available.'],
        ['Choose the task model', 'Select GPT-6 Sol, Astra or Luna and reasoning effort for a task. Supported official CLIs and API connections expose their available models, with choices saved locally per connection.'],
        ['Weave review', 'The read-only challenge can use another connection with its own model and effort. Using the same connection keeps the task selection. Frame, challenge and refine remain one traceable workflow.']
      ],
      note: 'All 13 backend tests and the production build passed. Windows packages are unsigned. Sol, Astra and Luna were each exercised through the local Codex CLI; other providers depend on account access.'
    }
  },
  {
    version: '0.1.0', date: '2026-09-23',
    zh: {
      name: '第一朵蔷薇',
      intro: '本地 Agent 工作台的第一版，让想法有了可以执行、审阅与回看的地方。',
      changes: [
        ['沙龙与工具', '在所选工作空间阅读、搜索、写入文本，执行获准的 PowerShell 命令，保存笔记与上下文胶囊。'],
        ['审批与检查点', '写文件和运行命令前由人确认；受控文件写入建立可恢复检查点。'],
        ['织思初版', '执行、只读质询、定稿三个阶段，保留本地手账。界面支持中文与英文。']
      ],
      note: '第一版通过 12 项后端测试，并完成一次 Codex CLI 受控修复。历史 Windows 包未签名。'
    },
    en: {
      name: 'The first rose',
      intro: 'The first local agent workspace: a place to act on, review and revisit an idea.',
      changes: [
        ['Salon and tools', 'Read, search and write text in a chosen workspace, run approved PowerShell commands, keep notes and export a context capsule.'],
        ['Approval and checkpoints', 'A person approves writes and commands. Approved file writes create guarded restore points.'],
        ['The first Weave', 'Execute, read-only challenge and refine in three stages, with a local journal and a Chinese/English interface.']
      ],
      note: 'The first edition passed 12 backend tests and completed one controlled repair through Codex CLI. Historical Windows packages are unsigned.'
    }
  }
];

export const roseraieReleaseUrl = version => `https://github.com/ChefDavid0815/roseraie-agent/releases/tag/v${version}`;
