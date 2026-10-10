const appId=2288340;
const stamp=(value,nullable=false)=>{if(value===null&&nullable)return null;if(typeof value!=='string'||!/^\d{4}-\d\d-\d\dT/.test(value)||!Number.isFinite(Date.parse(value)))throw Error('Invalid timestamp');return new Date(value).toISOString();};
const minutes=(value,max)=>{if(value===null)return null;if(!Number.isSafeInteger(value)||value<0||value>max)throw Error('Invalid minutes');return value;};
export function validateAc8Record(data,now=Date.now()){
 if(!data||data.version!==1||data.appId!==appId||data.scope!=='steam-local')throw Error('Invalid source');
 const collectedAt=stamp(data.collectedAt),sourceUpdatedAt=stamp(data.sourceUpdatedAt),lastPlayedAt=stamp(data.lastPlayedAt,true);
 if(Date.parse(collectedAt)>now+300000||Date.parse(sourceUpdatedAt)>now+300000||lastPlayedAt&&Date.parse(lastPlayedAt)>now+300000)throw Error('Future data');
 const playtimeMinutes=minutes(data.playtimeMinutes,50000000),recentPlaytimeMinutes=minutes(data.recentPlaytimeMinutes,20160);
 if(playtimeMinutes!==null&&recentPlaytimeMinutes!==null&&recentPlaytimeMinutes>playtimeMinutes)throw Error('Overlapping time');
 return{version:1,appId,scope:'steam-local',collectedAt,sourceUpdatedAt,playtimeMinutes,recentPlaytimeMinutes,lastPlayedAt};
}
export const recordFreshness=(record,now=Date.now())=>!record?'unavailable':now-Date.parse(record.collectedAt)<=360000?'synced':'stale';
export const beginRecord=s=>({...s,request:s.request+1,status:'connecting'});
export function acceptRecord(s,data,request,now=Date.now()){
 if(request!==s.request)return s;const value=validateAc8Record(data,now);
 if(s.sourceKind!=='snapshot'&&s.lastGood&&Date.parse(value.collectedAt)<Date.parse(s.lastGood.collectedAt))return{...s,status:recordFreshness(s.lastGood,now)};
 return{...s,lastGood:value,sourceKind:'synced',status:recordFreshness(value,now)};
}
export const failRecord=(s,request)=>request===s.request?{...s,status:'unavailable'}:s;
