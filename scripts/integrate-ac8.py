from pathlib import Path
import json
R=Path(__file__).resolve().parents[1]
def patch(file,find,replace):
 p=R/file;s=p.read_text(encoding='utf-8');assert s.count(find)==1,(file,find[:90]);p.write_text(s.replace(find,replace,1),encoding='utf-8',newline='')
patch('dist/game.html','03 WORLDS.<br>ONE PLAYER.','04 WORLDS.<br>ONE PLAYER.')
patch('dist/game.html','<nav class="game-jump" aria-label="Games">','<nav class="game-jump" aria-label="Games"><a href="#ace-combat-8"><span class="jump-no">04</span><span>ACE COMBAT <b>8</b></span><span aria-hidden="true">↘</span></a>')
patch('dist/game.html','<div class="game-collection" id="game-collection">','<div class="game-collection" id="game-collection">\n<div id="ac8-exhibit-root"></div>')
patch('dist/game.html','  <link rel="stylesheet" href="./flow.css">','  <link rel="stylesheet" href="./flow.css">\n  <link rel="stylesheet" href="./ac8.css" data-project-style>\n  <script type="module" src="./ac8-entry.js"></script>')
patch('dist/i18n.js',"import {dotAirReleaseMessages}","import {ac8Messages} from './ac8-content.js';\nimport {dotAirReleaseMessages}")
patch('dist/i18n.js','dotAirMessages, dotAirReleaseMessages);','dotAirMessages, dotAirReleaseMessages, ac8Messages);')
patch('scripts/build-flow.mjs',"console.log(`Built", "await transform(await readFile(path.join(dist,'ac8.css'),'utf8'),{loader:'css',target:'chrome110'});\nconsole.log(`Built")
p=R/'package.json';v=json.loads(p.read_text());v['version']='1.27.0';v['scripts']['test:ac8']='node --test scripts/test-ac8-record.mjs scripts/test-ac8-motion.mjs';v['scripts']['check:flow']+=' && node --check dist/ac8-content.js && node --check dist/ac8-art.js && node --check dist/ac8-entry.js && node --check dist/ac8-motion.js && node --check dist/ac8-record-state.js && node --check dist/ac8-records.js && node --check api/ac8-record.js && node --check lib/ac8-record-handler.js && node --check lib/ac8-record-schema.js && node --check scripts/ac8-sync.mjs';p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='')
p=R/'package-lock.json';v=json.loads(p.read_text());v['version']='1.27.0';v['packages']['']['version']='1.27.0';p.write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8',newline='')
addition={'date':'2026-10-09','intent':'User requested an AC8 game exhibit, supplied the photo and approved automatic Windows-login synchronization of AC8-only Steam records.','htmlPatches':{'dist/game.html':[{'find':'03 WORLDS.<br>ONE PLAYER.','replace':'04 WORLDS.<br>ONE PLAYER.'}]},'oldGamesPreserved':['f1-25','forza-horizon-6','nba-2k27']}
(R/'design/ac8-content-addition.json').write_text(json.dumps(addition,ensure_ascii=False,indent=2),encoding='utf-8')
p=R/'scripts/verify-flow-content.py';s=p.read_text(encoding='utf-8');s=s.replace('def approved_publication_patches(relative,text):',"ac8_path=ROOT/'design/ac8-content-addition.json'\nac8=json.loads(ac8_path.read_text(encoding='utf-8')) if ac8_path.exists() else {}\n\ndef approved_publication_patches(relative,text):");s=s.replace('    for patch in patches:',"    patches+=ac8.get('htmlPatches',{}).get(relative,[])\n    for patch in patches:");p.write_text(s,encoding='utf-8',newline='')
print('AC8 world 04 integrated; other three exhibits untouched; website 1.27.0.')
