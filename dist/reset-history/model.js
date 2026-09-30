const observed = signal => signal?.kind === 'confirmed' || (signal?.kind === 'banked' && signal.stage === 'announced');

export function mergeHistory(reviewed, signals = [], now = Date.now()) {
  const knownPosts = new Set(reviewed.flatMap(event => event.sources.map(source => source.postId).filter(Boolean)));
  const added = new Set();
  const fresh = [];
  for (const signal of signals) {
    if (!observed(signal) || signal.handle?.toLowerCase() !== 'thsottiaux' || !/^\d{10,25}$/.test(signal.id)) continue;
    const at = Date.parse(signal.createdAt);
    if (!Number.isFinite(at) || at > now || knownPosts.has(signal.id) || added.has(signal.id)) continue;
    added.add(signal.id);
    const banked = signal.kind === 'banked';
    fresh.push({
      id: `live-${signal.id}`, type: banked ? 'banked' : 'automatic', at: new Date(at).toISOString(),
      basis: banked ? 'announcement' : 'completion', state: 'unreviewed',
      title: banked ? {en: 'A new banked-reset post.', zh: '发现新的重置卡动态。'} : {en: 'A new reset report.', zh: '发现新的普通重置报告。'},
      summary: banked
        ? {en: 'Automatically detected from Tibo’s latest posts. Read the original for scope and whether the card has actually arrived in your account.', zh: '从 Tibo 最新帖子自动识别。请阅读原帖确认适用范围，以及你的账号是否真的收到重置卡。'}
        : {en: 'Automatically detected from Tibo’s latest posts. Read the original to confirm which users and limits were affected.', zh: '从 Tibo 最新帖子自动识别。请阅读原帖确认具体影响哪些用户和额度。'},
      scope: {en: 'Check the original post', zh: '请查看原帖'},
      sources: [{postId: signal.id, label: {en: 'Tibo · original post', zh: 'Tibo · 原帖'}}]
    });
  }
  return [...reviewed, ...fresh].sort((a, b) => Date.parse(b.at) - Date.parse(a.at));
}

export function historyStats(events) {
  return {
    total: events.length,
    banked: events.filter(event => event.type === 'banked').length,
    automatic: events.filter(event => event.type === 'automatic').length,
    earliest: events.reduce((at, event) => !at || Date.parse(event.at) < Date.parse(at) ? event.at : at, null),
    latest: events.reduce((at, event) => !at || Date.parse(event.at) > Date.parse(at) ? event.at : at, null)
  };
}

export function sourceUrl(source) {
  if (source.postId && /^\d{10,25}$/.test(source.postId)) return `https://x.com/thsottiaux/status/${source.postId}`;
  if (source.url === 'https://help.openai.com/en/articles/20001498-how-banked-codex-resets-work') return source.url;
  return null;
}
