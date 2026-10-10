import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

spec=importlib.util.spec_from_file_location('usage_sync',Path(__file__).with_name('usage-sync.py'))
sync=importlib.util.module_from_spec(spec);spec.loader.exec_module(sync)

def event(total,last=None,at='2026-09-20T20:05:00Z'):
    counts=dict(zip(sync.FIELDS,total))
    return {'type':'event_msg','timestamp':at,'payload':{'type':'token_count','info':{'total_token_usage':counts,'last_token_usage':dict(zip(sync.FIELDS,last or total))}}}

class LedgerTest(unittest.TestCase):
    def setUp(self):
        self.tmp=tempfile.TemporaryDirectory();self.base=Path(self.tmp.name);self.path=self.base/'rollout.jsonl';self.ledger=sync.Ledger(self.base/'ledger.sqlite')
        self.write({'type':'turn_context','payload':{'model':'gpt-6-astra','private_prompt':'NEVER PUBLISH'}})
    def tearDown(self):
        self.ledger.db.close();self.tmp.cleanup()
    def write(self,*records):
        with self.path.open('a',encoding='utf-8') as f:
            for r in records:f.write(json.dumps(r)+'\n')
    def test_duplicates_replay_and_model_change(self):
        first=event([1000,700,0,100,20,1100]);self.write(first,first)
        self.assertEqual(self.ledger.scan([self.path]),1)
        copy=self.base/'fork.jsonl';copy.write_bytes(self.path.read_bytes())
        self.assertEqual(self.ledger.scan([copy]),0)
        self.write({'type':'turn_context','payload':{'model':'gpt-5.6-sol'}},event([1500,1000,0,150,25,1650],[500,300,0,50,5,550],'2026-09-20T20:06:00Z'))
        self.assertEqual(self.ledger.scan([self.path]),1)
        data=self.ledger.snapshot();self.assertEqual(sum(r['total'] for r in data['hours']),1650)
        self.assertEqual(data['hours'][0]['hour'],'2026-09-21T00:00:00+04:00')
        self.assertNotIn('NEVER',json.dumps(data));self.assertNotIn(str(self.path),json.dumps(data))
    def test_partial_append_is_retried_without_double_counting(self):
        raw=json.dumps(event([100,70,0,10,5,110]))
        with self.path.open('a') as f:f.write(raw[:40])
        self.assertEqual(self.ledger.scan([self.path]),0)
        with self.path.open('a') as f:f.write(raw[40:]+'\n')
        self.assertEqual(self.ledger.scan([self.path]),1)
        self.assertEqual(self.ledger.scan([self.path]),0)
    def test_gpt_61_usage_preserves_model_and_earlier_history(self):
        self.write(event([1000,700,0,100,20,1100]))
        self.assertEqual(self.ledger.scan([self.path]),1)
        self.write({'type':'turn_context','payload':{'model':'gpt-6.1-sol'}},event([1500,1000,0,150,25,1650],[500,300,0,50,5,550],'2026-09-20T20:06:00Z'))
        self.assertEqual(self.ledger.scan([self.path]),1)
        self.assertEqual(self.ledger.scan([self.path]),0)
        models={row['model']:row for row in self.ledger.snapshot()['hours']}
        self.assertEqual(models['gpt-6-astra']['total'],1100)
        self.assertEqual(models['gpt-6.1-sol']['total'],550)
        self.assertEqual(models['gpt-6.1-sol']['cached'],300)
        self.assertEqual(models['gpt-6.1-sol']['context'],'short')
    def test_counter_reset_and_unknown_request_length(self):
        self.write(event([400000,200000,0,100,0,400100]),event([100,0,0,10,0,110],at='2026-09-20T20:07:00Z'),event([400,100,0,50,0,450],[100,0,0,10,0,110],at='2026-09-20T20:08:00Z'))
        self.assertEqual(self.ledger.scan([self.path]),3)
        rows=self.ledger.snapshot()['hours'];self.assertEqual({r['context'] for r in rows},{'long','short','unknown'})
        self.assertEqual(sum(r['total'] for r in rows),400550)

    def test_claude_code_transcripts_dedupe_and_split_cache_writes(self):
        path=self.base/'claude.jsonl'
        usage={'input_tokens':2,'cache_creation_input_tokens':15648,'cache_read_input_tokens':44164,'output_tokens':150,'output_tokens_details':{'thinking_tokens':20},'cache_creation':{'ephemeral_1h_input_tokens':15648,'ephemeral_5m_input_tokens':0}}
        line=lambda u,block:{'type':'assistant','timestamp':'2026-10-09T19:30:00Z','requestId':'req_1','message':{'id':'msg_1','model':'claude-opus-5-5','usage':u,'content':[{'type':block,'text':'PRIVATE'}]}}
        partial=dict(usage,output_tokens=40)
        with path.open('w',encoding='utf-8') as f:
            for r in (line(partial,'thinking'),line(usage,'text'),line(usage,'tool_use'),{'type':'assistant','timestamp':'2026-10-09T19:31:00Z','message':{'id':'msg_2','model':'<synthetic>','usage':usage}}):f.write(json.dumps(r)+'\n')
        self.ledger.scan_claude([path])
        rows=[r for r in self.ledger.snapshot()['hours'] if r['model'].startswith('claude')]
        self.assertEqual(len(rows),1);row=rows[0]
        self.assertEqual(row['events'],1);self.assertEqual(row['input'],2+15648+44164);self.assertEqual(row['cached'],44164)
        self.assertEqual(row['write'],15648);self.assertEqual(row['write1h'],15648);self.assertEqual(row['output'],150);self.assertEqual(row['reasoning'],20)
        self.assertEqual(row['total'],row['input']+row['output']);self.assertEqual(row['hour'],'2026-10-09T23:00:00+04:00')
        self.assertEqual(self.ledger.scan_claude([path]),0)
        self.assertNotIn('PRIVATE',json.dumps(self.ledger.snapshot()))

if __name__=='__main__':unittest.main()
