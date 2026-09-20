export const priceSource = 'https://developers.openai.com/api/docs/pricing';
export const priceDate = '2026-09-20';
// USD / million tokens, Standard tier. Cache writes are separate from cache reads.
export const prices = {
  'gpt-6-astra': {input:10,cached:1,write:12.5,output:50},
  'gpt-5.6-sol': {input:4,cached:.4,write:5,output:20},
  'gpt-5.6-terra': {input:2,cached:.2,write:2.5,output:12},
  'gpt-5.6-luna': {input:.2,cached:.02,write:.25,output:1.2},
  'gpt-5.5': {input:5,cached:.5,write:null,output:30},
};
export const empty = () => ({input:0,cached:0,write:0,output:0,reasoning:0,total:0,events:0,cost:0,unpriced:0});
export function costOf(row) {
  const p=prices[row.model];
  if(!p || row.context==='unknown' || (row.write && p.write===null)) return null;
  const long=row.context==='long';
  return ((row.input-row.cached-row.write)*p.input*(long?2:1)+row.cached*p.cached*(long?2:1)+row.write*(p.write||0)*(long?2:1)+row.output*p.output*(long?1.5:1))/1e6;
}
export function accumulate(target,row) {
  for(const key of ['input','cached','write','output','reasoning','total','events']) target[key]+=row[key]||0;
  const cost=costOf(row);
  if(cost===null) target.unpriced+=row.total; else target.cost+=cost;
  return target;
}
export function dayKey(time) { return new Date(new Date(time).getTime()+4*3600000).toISOString().slice(0,10); }
export function selectRange(snapshot,range,now=Date.now()) {
  const today=dayKey(now);
  const midnight=Date.parse(today+'T00:00:00+04:00');
  const start=range==='lifetime'?Date.parse(dayKey(snapshot.firstEventAt)+'T00:00:00+04:00'):midnight-(range==='7d'?6:range==='30d'?29:0)*86400000;
  const rows=snapshot.hours.filter(r=>Date.parse(r.hour)>=start && Date.parse(r.hour)<=now);
  const total=rows.reduce(accumulate,empty());
  const models=new Map();
  for(const row of rows) {if(!models.has(row.model)) models.set(row.model,{...empty(),model:row.model});accumulate(models.get(row.model),row);}
  const step=range==='today'?3600000:86400000;
  const end=range==='today'?Math.floor((now-midnight)/step)*step+midnight:midnight;
  const bins=[];
  for(let time=start;time<=end;time+=step) bins.push({...empty(),time,covered:time+step>Date.parse(snapshot.firstEventAt)});
  for(const row of rows) {const index=Math.floor((Date.parse(row.hour)-start)/step);if(bins[index])accumulate(bins[index],row);}
  return {total,models:[...models.values()].sort((a,b)=>b.total-a.total),bins,start,end};
}
