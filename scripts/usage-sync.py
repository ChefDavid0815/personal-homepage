"""Read-only incremental Codex and Claude Code accounting. Only hourly numeric aggregates leave this PC."""
import argparse
import datetime as dt
import hashlib
import json
import os
from pathlib import Path
import re
import sqlite3
import time
import threading
import urllib.request

FIELDS = ('input_tokens','cached_input_tokens','cache_write_input_tokens','output_tokens','reasoning_output_tokens','total_tokens')
UTC = dt.timezone.utc
DUBAI = dt.timezone(dt.timedelta(hours=4))
DEFAULT_STATE = Path(os.environ.get('LOCALAPPDATA', str(Path.home()))) / 'ChefZC' / 'UsageSync'

def stamp():
    return dt.datetime.now(UTC).isoformat(timespec='milliseconds').replace('+00:00','Z')

class Ledger:
    def __init__(self, path):
        self.db = sqlite3.connect(path)
        self.db.execute('PRAGMA journal_mode=WAL')
        self.db.execute('CREATE TABLE IF NOT EXISTS files (path TEXT PRIMARY KEY, offset INTEGER, model TEXT, previous TEXT)')
        self.db.execute('CREATE TABLE IF NOT EXISTS events (fingerprint TEXT PRIMARY KEY, at TEXT, hour TEXT, model TEXT, context TEXT, input INTEGER, cached INTEGER, write INTEGER, output INTEGER, reasoning INTEGER, total INTEGER)')
        # Claude prices 1-hour cache writes differently from 5-minute ones; older ledgers gain the column in place.
        if 'write1h' not in {row[1] for row in self.db.execute('PRAGMA table_info(events)')}:
            self.db.execute('ALTER TABLE events ADD COLUMN write1h INTEGER NOT NULL DEFAULT 0')

    def scan(self, files):
        added = 0
        for path in files:
            record = self.db.execute('SELECT offset,model,previous FROM files WHERE path=?',(str(path),)).fetchone()
            offset, model, previous = (record[0],record[1],json.loads(record[2])) if record else (0,'unknown',[0]*6)
            try:
                if path.stat().st_size < offset: offset, model, previous = 0,'unknown',[0]*6
                if path.stat().st_size == offset: continue
                with path.open('rb') as stream:
                    stream.seek(offset)
                    while True:
                        start = stream.tell()
                        line = stream.readline()
                        if not line or not line.endswith(b'\n'):
                            offset = start
                            break
                        if b'"turn_context"' not in line and b'"token_count"' not in line: continue
                        try: record = json.loads(line)
                        except (ValueError, UnicodeError): continue
                        payload = record.get('payload',{})
                        if record.get('type') == 'turn_context':
                            candidate = payload.get('model','unknown')
                            model = candidate if re.fullmatch(r'[a-zA-Z0-9._-]{1,80}',candidate) else 'unknown'
                        if record.get('type') != 'event_msg' or payload.get('type') != 'token_count': continue
                        info = payload.get('info') or {}
                        total = info.get('total_token_usage')
                        if not total: continue
                        current = [total.get(key,0) for key in FIELDS]
                        if any(not isinstance(x,int) or x < 0 for x in current): continue
                        delta = [a-b for a,b in zip(current,previous)]
                        # A reset starts a fresh counter. Duplicate snapshots contribute nothing.
                        if delta[-1] < 0: delta = current
                        previous = current
                        if delta[-1] <= 0: continue
                        i,c,w,o,r,t = delta
                        if min(delta) < 0 or c+w > i or r > o or t != i+o: continue
                        try: at = dt.datetime.fromisoformat(record['timestamp'].replace('Z','+00:00')).astimezone(UTC)
                        except (KeyError,ValueError): continue
                        hourly = at.astimezone(DUBAI).replace(minute=0,second=0,microsecond=0).isoformat()
                        last = info.get('last_token_usage') or {}
                        # Never infer request length from the configured context-window capacity.
                        context = ('long' if i > 272000 else 'short') if last.get('total_tokens') == t else 'unknown'
                        fingerprint = hashlib.sha256(json.dumps([record['timestamp'],model,current],separators=(',',':')).encode()).hexdigest()
                        result = self.db.execute('INSERT OR IGNORE INTO events (fingerprint,at,hour,model,context,input,cached,write,output,reasoning,total) VALUES (?,?,?,?,?,?,?,?,?,?,?)',(fingerprint,at.isoformat(),hourly,model,context,*delta))
                        added += result.rowcount
                self.db.execute('INSERT OR REPLACE INTO files VALUES (?,?,?,?)',(str(path),offset,model,json.dumps(previous)))
            except (FileNotFoundError,PermissionError): continue
        self.db.commit()
        return added

    def scan_claude(self, files):
        """Claude Code transcripts: one usage record per assistant message, repeated on each content block."""
        added = 0
        for path in files:
            record = self.db.execute('SELECT offset FROM files WHERE path=?',(str(path),)).fetchone()
            offset = record[0] if record else 0
            try:
                size = path.stat().st_size
                if size < offset: offset = 0
                if size == offset: continue
                with path.open('rb') as stream:
                    stream.seek(offset)
                    while True:
                        start = stream.tell()
                        line = stream.readline()
                        if not line or not line.endswith(b'\n'):
                            offset = start
                            break
                        if b'"usage"' not in line or b'"assistant"' not in line: continue
                        try: record = json.loads(line)
                        except (ValueError, UnicodeError): continue
                        if record.get('type') != 'assistant': continue
                        message = record.get('message') or {}
                        usage = message.get('usage') or {}
                        model = message.get('model') or 'unknown'
                        if not re.fullmatch(r'[a-zA-Z0-9._-]{1,80}',model): continue  # skips '<synthetic>' placeholders
                        fresh, write, cached, output = (usage.get(k) or 0 for k in ('input_tokens','cache_creation_input_tokens','cache_read_input_tokens','output_tokens'))
                        write1h = (usage.get('cache_creation') or {}).get('ephemeral_1h_input_tokens') or 0
                        reasoning = (usage.get('output_tokens_details') or {}).get('thinking_tokens') or 0
                        if any(not isinstance(x,int) or x < 0 for x in (fresh,write,cached,output,write1h,reasoning)): continue
                        total_input = fresh + write + cached
                        total = total_input + output
                        if total <= 0: continue
                        write1h = min(write1h, write); reasoning = min(reasoning, output)
                        try: at = dt.datetime.fromisoformat(record['timestamp'].replace('Z','+00:00')).astimezone(UTC)
                        except (KeyError,ValueError): continue
                        hourly = at.astimezone(DUBAI).replace(minute=0,second=0,microsecond=0).isoformat()
                        # Claude Haiku 5.5 bills prompts above 100K tokens at its higher tier; other current models have one tier.
                        context = 'long' if model.startswith('claude-haiku-5-5') and total_input > 100000 else 'short'
                        identity = [message.get('id'), record.get('requestId')] if message.get('id') else [record.get('uuid')]
                        fingerprint = hashlib.sha256(json.dumps(['claude',*identity],separators=(',',':')).encode()).hexdigest()
                        # The same message appears once per content block; keep its largest (final) count.
                        result = self.db.execute('''INSERT INTO events (fingerprint,at,hour,model,context,input,cached,write,output,reasoning,total,write1h) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
                            ON CONFLICT(fingerprint) DO UPDATE SET input=excluded.input,cached=excluded.cached,write=excluded.write,output=excluded.output,reasoning=excluded.reasoning,total=excluded.total,write1h=excluded.write1h,context=excluded.context
                            WHERE excluded.total > events.total''',(fingerprint,at.isoformat(),hourly,model,context,total_input,cached,write,output,reasoning,total,write1h))
                        added += result.rowcount
                self.db.execute('INSERT OR REPLACE INTO files VALUES (?,?,?,?)',(str(path),offset,'claude','[]'))
            except (FileNotFoundError,PermissionError): continue
        self.db.commit()
        return added

    def snapshot(self):
        first,last = self.db.execute('SELECT MIN(at),MAX(at) FROM events').fetchone()
        if not first: return None
        rows = self.db.execute('SELECT hour,model,context,SUM(input),SUM(cached),SUM(write),SUM(output),SUM(reasoning),SUM(total),COUNT(*),SUM(write1h) FROM events GROUP BY hour,model,context ORDER BY hour,model,context').fetchall()
        fields = ['hour','model','context','input','cached','write','output','reasoning','total','events','write1h']
        return {'version':1,'scope':'local-agent-records','timezone':'Asia/Dubai','collectedAt':stamp(),'firstEventAt':first,'lastEventAt':last,'sourceCount':self.db.execute('SELECT COUNT(*) FROM files').fetchone()[0], 'hours':[dict(zip(fields,row)) for row in rows]}

def discover(root):
    return sorted({p for folder in ('sessions','archived_sessions') for p in (root/folder).rglob('rollout-*.jsonl')})

def discover_claude(root):
    # Main sessions and their subagent transcripts live under <claude home>/projects.
    folder = root/'projects'
    return sorted(folder.rglob('*.jsonl')) if folder.exists() else []

def publish(snapshot, config):
    data = json.dumps(snapshot,separators=(',',':')).encode()
    request = urllib.request.Request(config['endpoint'],data=data,headers={'Content-Type':'application/json','Authorization':'Bearer '+config['secret']},method='POST')
    with urllib.request.urlopen(request,timeout=20) as response:
        if response.status != 200: raise RuntimeError('Sync rejected')

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--codex-home',type=Path,default=Path(os.environ.get('CODEX_HOME',str(Path.home()/'.codex'))))
    parser.add_argument('--claude-home',type=Path,default=Path(os.environ.get('CLAUDE_CONFIG_DIR',str(Path.home()/'.claude'))))
    parser.add_argument('--state',type=Path,default=DEFAULT_STATE)
    parser.add_argument('--watch',action='store_true')
    parser.add_argument('--publish',action='store_true')
    args = parser.parse_args()
    args.state.mkdir(parents=True,exist_ok=True)
    lock = (args.state/'worker.lock').open('a+b')
    if os.name == 'nt':
        import msvcrt
        lock.seek(0); lock.write(b'0'); lock.flush(); lock.seek(0)
        try: msvcrt.locking(lock.fileno(),msvcrt.LK_NBLCK,1)
        except OSError: return
    ledger = Ledger(args.state/'ledger.sqlite')
    config = json.loads((args.state/'config.json').read_text()) if args.publish else None
    wake = threading.Event()
    observer = None
    if args.watch:
        try:
            from watchdog.observers import Observer
            from watchdog.events import FileSystemEventHandler
            class Changes(FileSystemEventHandler):
                def on_any_event(self,event):
                    if event.event_type in ('modified','created','moved') and str(event.src_path).endswith('.jsonl'): wake.set()
            observer=Observer()
            for folder in (args.codex_home/'sessions',args.codex_home/'archived_sessions',args.claude_home/'projects'):
                if folder.exists(): observer.schedule(Changes(),str(folder),recursive=True)
            observer.start()
        except ImportError: pass  # A one-second scan remains available without the optional watcher.
    published = 0; last_attempt = 0; pending = True; failed = 0
    while True:
        wake.clear()
        changed = ledger.scan(discover(args.codex_home)) + ledger.scan_claude(discover_claude(args.claude_home))
        pending = pending or changed > 0
        now = time.monotonic()
        # Emit immediately after a recorded completion; heartbeat proves the collector is alive.
        if (pending or now-published >= 30) and now-last_attempt >= min(60,2**failed):
            last_attempt=now
            snapshot = ledger.snapshot()
            if snapshot:
                temp=args.state/'snapshot.tmp'; temp.write_text(json.dumps(snapshot,separators=(',',':')),encoding='utf-8'); temp.replace(args.state/'snapshot.json')
                try:
                    if config: publish(snapshot,config)
                    published=now;pending=False;failed=0
                    (args.state/'status.json').write_text(json.dumps({'ok':True,'at':stamp(),'lastEventAt':snapshot['lastEventAt'],'newEvents':changed}),encoding='utf-8')
                except Exception as error:
                    failed=min(6,failed+1)
                    (args.state/'status.json').write_text(json.dumps({'ok':False,'at':stamp(),'error':type(error).__name__}),encoding='utf-8')
        if not args.watch: break
        wake.wait(timeout=1)

if __name__ == '__main__': main()
