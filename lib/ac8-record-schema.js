const appId=2288340;
export {validateAc8Record,recordFreshness} from '../dist/ac8-record-state.js';
export function parseAc8Vdf(text){
 const tokens=text.matchAll(/"((?:\\.|[^"\\])*)"|([{}])/g),stack=[];
 const result={playtimeMinutes:null,recentPlaytimeMinutes:null,lastPlayedAt:null};let key=null;
 for(const match of tokens){const quoted=match[1],brace=match[2];
  if(brace==='{'){stack.push(key);key=null;}
  else if(brace==='}'){if(!stack.length)throw Error('Malformed Steam VDF');stack.pop();key=null;}
  else if(key===null)key=quoted;
  else{
   if(stack.at(-2)==='apps'&&stack.at(-1)===String(appId)&&/^\d+$/.test(quoted)){
    const value=Number(quoted);
    if(key==='Playtime')result.playtimeMinutes=value;
    if(key==='Playtime2wks')result.recentPlaytimeMinutes=value;
    if(key==='LastPlayed'&&value>0)result.lastPlayedAt=new Date(value*1000).toISOString();
   }key=null;
  }
 }
 if(stack.length)throw Error('Incomplete Steam VDF');return result;
}
