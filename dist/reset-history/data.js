// Selected, source-backed public milestones. Times are post/report times, never
// account-level delivery times. Events with several posts are grouped manually.
export const ARCHIVE_REVIEWED_AT = '2026-09-26';
export const HISTORY_EVENTS = [
  {
    id: '2026-09-26-automatic', type: 'automatic', at: '2026-09-26T18:17:54Z', basis: 'completion', state: 'reported',
    title: {en: 'The outage reset propagated.', zh: '故障补偿重置已同步。'},
    summary: {en: 'After promising a usage-limit reset for paid Codex and ChatGPT Work users, Tibo reported that the resets had propagated. The post does not verify a particular account.', zh: 'Tibo 先承诺为付费 Codex 和 ChatGPT Work 用户重置额度，后报告全部重置已同步。公开帖子无法核实某个账号的实际状态。'},
    scope: {en: 'Paid Codex and ChatGPT Work users in the announcement', zh: '预告帖所指的付费 Codex 与 ChatGPT Work 用户'},
    sources: [
      {postId: '2103637477760311522', label: {en: 'Tibo · commitment', zh: 'Tibo · 重置承诺'}},
      {postId: '2103911959544610829', label: {en: 'Tibo · completion report', zh: 'Tibo · 完成报告'}}
    ]
  },
  {
    id: '2026-09-22-banked', type: 'banked', at: '2026-09-22T18:23:37Z', basis: 'announcement', state: 'rolling',
    title: {en: 'A new card enters the chat.', zh: '新的一张重置卡，入场。'},
    summary: {en: 'Tibo said a banked reset was being loaded into Plus, Pro and Business accounts. The post confirms the rollout announcement, not delivery to a particular account.', zh: 'Tibo 宣布正向 Plus、Pro、Business 账号存入重置卡。这里记录的是公开发帖时间，不代表某个账号已经到账。'},
    scope: {en: 'Plus · Pro · Business', zh: 'Plus · Pro · Business'},
    sources: [{postId: '2102463847714247142', label: {en: 'Tibo · rollout post', zh: 'Tibo · 发放公告'}}]
  },
  {
    id: '2026-09-12-automatic', type: 'automatic', at: '2026-09-12T08:09:17Z', basis: 'completion', state: 'reported',
    title: {en: '“All propagated.”', zh: '“全部同步完成。”'},
    summary: {en: 'After telling Astra users that another reset was landing, Tibo reported that the reset had propagated. The audience and actual account timing can differ.', zh: '在对 Astra 用户预告重置后，Tibo 发帖称重置已同步完成。适用范围和个人账号到账时间仍可能不同。'},
    scope: {en: 'Astra users mentioned in the announcement', zh: '预告帖所指的 Astra 用户'},
    sources: [
      {postId: '2098612714704891959', label: {en: 'Tibo · announcement', zh: 'Tibo · 预告'}},
      {postId: '2098685367058612394', label: {en: 'Tibo · completion report', zh: 'Tibo · 完成报告'}}
    ]
  },
  {
    id: '2026-09-09-banked-replacement', type: 'banked', at: '2026-09-09T18:23:34Z', basis: 'announcement', state: 'targeted',
    title: {en: 'A replacement card for a rough morning.', zh: '一次故障，一张补发卡。'},
    summary: {en: 'Tibo said users whose banked reset had not fully applied in the affected window would receive another one. This was a targeted remedy, not a general grant.', zh: 'Tibo 表示，受故障影响、使用重置卡却未完整生效的用户将再收到一张。这是定向补发，不是全体发放。'},
    scope: {en: 'Affected users only', zh: '仅受影响用户'},
    sources: [{postId: '2097752790177370535', label: {en: 'Tibo · remedy announcement', zh: 'Tibo · 补发公告'}}]
  },
  {
    id: '2026-09-07-automatic', type: 'automatic', at: '2026-09-08T04:05:53Z', basis: 'completion', state: 'reported',
    title: {en: 'The Astra week global reset.', zh: 'Astra 周的全局重置。'},
    summary: {en: 'Tibo promised a global usage reset for paid subscriptions, then reported that everyone had been reset. OpenAI’s guide dates the global reset to September 7, Pacific time.', zh: 'Tibo 先预告付费订阅的全局重置，随后发帖称已完成。OpenAI 官方说明将这次全局重置记为太平洋时间 9 月 7 日。'},
    scope: {en: 'Paid subscriptions; see offer for eligibility', zh: '付费订阅；具体资格以活动说明为准'},
    sources: [
      {postId: '2097043464538264003', label: {en: 'Tibo · plan', zh: 'Tibo · 预告'}},
      {postId: '2097174560412246215', label: {en: 'Tibo · completion report', zh: 'Tibo · 完成报告'}},
      {url: 'https://help.openai.com/en/articles/20001498-how-banked-codex-resets-work', label: {en: 'OpenAI · date confirmation', zh: 'OpenAI · 日期确认'}}
    ]
  },
  {
    id: '2026-09-04-banked', type: 'banked', at: '2026-09-04T20:57:17Z', basis: 'announcement', state: 'documented',
    title: {en: 'One more banked reset for Astra day.', zh: 'Astra 上线日，再存一张。'},
    summary: {en: 'Tibo first announced cover for users waiting on Astra, then widened the announcement to Plus, Pro and Business. OpenAI’s guide confirms eligible accounts received a banked reset on September 4.', zh: 'Tibo 先为等待 Astra 的用户预告重置卡，后扩展为 Plus、Pro、Business。OpenAI 官方说明确认符合条件的账号在 9 月 4 日获得一张。'},
    scope: {en: 'Eligible Plus · Pro · Business', zh: '符合条件的 Plus · Pro · Business'},
    sources: [
      {postId: '2095979536043401428', label: {en: 'Tibo · first announcement', zh: 'Tibo · 首次预告'}},
      {postId: '2096035437299237298', label: {en: 'Tibo · expanded scope', zh: 'Tibo · 扩大发放范围'}},
      {url: 'https://help.openai.com/en/articles/20001498-how-banked-codex-resets-work', label: {en: 'OpenAI · grant date', zh: 'OpenAI · 发放日期'}}
    ]
  },
  {
    id: '2026-09-03-banked', type: 'banked', at: '2026-09-03T23:12:09Z', basis: 'announcement', state: 'documented',
    title: {en: 'The first Astra banked reset.', zh: 'Astra 的第一张重置卡。'},
    summary: {en: 'Tibo said a banked reset would be given for each day paid-plan users lacked Astra access. OpenAI’s guide confirms a grant to eligible accounts on September 3.', zh: 'Tibo 表示，付费用户每少一天 Astra 使用权限就会获得一张重置卡。OpenAI 官方说明确认符合条件的账号在 9 月 3 日获得一张。'},
    scope: {en: 'Eligible paid-plan accounts', zh: '符合条件的付费账号'},
    sources: [
      {postId: '2095651088502591861', label: {en: 'Tibo · announcement', zh: 'Tibo · 预告'}},
      {url: 'https://help.openai.com/en/articles/20001498-how-banked-codex-resets-work', label: {en: 'OpenAI · grant date', zh: 'OpenAI · 发放日期'}}
    ]
  },
  {
    id: '2026-08-30-automatic', type: 'automatic', at: '2026-08-31T02:34:27Z', basis: 'completion', state: 'reported',
    title: {en: '25 million users. One big reset.', zh: '2500 万用户，一次大重置。'},
    summary: {en: 'After two public posts about timing, Tibo reported that usage had been reset for paid Codex and ChatGPT Work subscriptions.', zh: '两次公开说明时间安排后，Tibo 发帖称付费 Codex 与 ChatGPT Work 订阅的用量已被重置。'},
    scope: {en: 'Paid Codex · ChatGPT Work subscriptions', zh: '付费 Codex · ChatGPT Work 订阅'},
    sources: [
      {postId: '2093801758665715784', label: {en: 'Tibo · initial post', zh: 'Tibo · 首次预告'}},
      {postId: '2094144275957350900', label: {en: 'Tibo · timing', zh: 'Tibo · 时间安排'}},
      {postId: '2094252447271366730', label: {en: 'Tibo · completion report', zh: 'Tibo · 完成报告'}}
    ]
  },
  {
    id: '2026-08-23-automatic', type: 'automatic', at: '2026-08-24T00:46:51Z', basis: 'completion', state: 'reported',
    title: {en: 'Fixes shipped. Limits refreshed.', zh: '修好了，也重置了。'},
    summary: {en: 'Tibo planned a full reset alongside Codex usage fixes and later reported that it had propagated to accounts.', zh: 'Tibo 预告在修复 Codex 用量问题时进行完整重置，之后发帖称已同步到账号。'},
    scope: {en: 'Paid subscriptions in the announcement', zh: '预告帖所指的付费订阅'},
    sources: [
      {postId: '2091407991736332689', label: {en: 'Tibo · plan', zh: 'Tibo · 计划'}},
      {postId: '2091688655828246890', label: {en: 'Tibo · completion report', zh: 'Tibo · 完成报告'}}
    ]
  },
  {
    id: '2026-08-21-banked', type: 'banked', at: '2026-08-22T00:50:36Z', basis: 'completion', state: 'reported',
    title: {en: 'The 20 million user thank-you card.', zh: '2000 万用户的感谢卡。'},
    summary: {en: 'Tibo announced a banked reset for Codex and ChatGPT Work users, gave a delivery window, then reported that the card had landed.', zh: 'Tibo 为 Codex 和 ChatGPT Work 用户宣布发放重置卡，随后给出时间窗口，并发帖称重置卡已到账。'},
    scope: {en: 'Paid Codex · ChatGPT Work users', zh: '付费 Codex · ChatGPT Work 用户'},
    sources: [
      {postId: '2090766694897619318', label: {en: 'Tibo · announcement', zh: 'Tibo · 预告'}},
      {postId: '2090947196107764189', label: {en: 'Tibo · timing', zh: 'Tibo · 时间安排'}},
      {postId: '2090964822422949999', label: {en: 'Tibo · landed report', zh: 'Tibo · 到账报告'}}
    ]
  }
];
