import {getLanguage,onLanguageChange} from './i18n.js';
function translate(){const english=getLanguage()==='en';const description=document.getElementById('reset-entry-description');const action=document.getElementById('reset-entry-action');if(description)description.textContent=english?"Out of tokens, not out of hope. Reset today?":'额度用完了，希望还没有。今天会重置吗？';if(action)action.textContent=english?'Read the signals ↗':'查看线索 ↗';}
translate();onLanguageChange(translate);
