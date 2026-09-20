const numeric = ['input','cached','write','output','reasoning','total','events'];
const integer = value => Number.isSafeInteger(value) && value >= 0 && value <= 1e15;
const iso = value => typeof value === 'string' && /^\d{4}-\d\d-\d\dT/.test(value) && Number.isFinite(Date.parse(value));
// Rebuild an allowlisted object: conversation text, paths and credentials cannot be stored.
export function validateSnapshot(data, now = Date.now()) {
  if (!data || data.version !== 1 || !iso(data.collectedAt) || Date.parse(data.collectedAt) > now + 300000) throw new Error('Invalid snapshot');
  if (!iso(data.firstEventAt) || !iso(data.lastEventAt) || !integer(data.sourceCount)) throw new Error('Invalid coverage');
  if (!Array.isArray(data.hours) || data.hours.length > 30000) throw new Error('Invalid buckets');
  const keys = new Set();
  const hours = data.hours.map(row => {
    if (!iso(row.hour) || !/^[a-zA-Z0-9._-]{1,80}$/.test(row.model) || !['short','long','unknown'].includes(row.context)) throw new Error('Invalid bucket');
    if (!numeric.every(key => integer(row[key]))) throw new Error('Invalid count');
    if (row.cached + row.write > row.input || row.reasoning > row.output || row.total !== row.input + row.output) throw new Error('Overlapping counts');
    const key = `${row.hour}/${row.model}/${row.context}`;
    if (keys.has(key)) throw new Error('Duplicate bucket'); keys.add(key);
    return Object.fromEntries(['hour','model','context',...numeric].map(key => [key,row[key]]));
  });
  return { version:1, scope:'local-codex-records', timezone:'Asia/Dubai', collectedAt:data.collectedAt, firstEventAt:data.firstEventAt, lastEventAt:data.lastEventAt, sourceCount:data.sourceCount, hours };
}
