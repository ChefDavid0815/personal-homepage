"""Tests for the only private-data boundary: offline aggregate extraction."""
import hashlib
import importlib.util
import json
from pathlib import Path
import sqlite3
import struct
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('game_import', Path(__file__).with_name('import-game-snapshot.py'))
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)


class SnapshotTests(unittest.TestCase):
    def test_vdf_only_reads_correct_app_and_handles_quoted_braces(self):
        vdf = r'''"UserLocalConfigStore" { "Software" { "Valve" { "Steam" { "apps" {
          "123" { "Playtime" "777" }
          "4356430" { "Playtime" "3627" "Playtime2wks" "2361" "LastPlayed" "1789915171"
            "unrelated" "{\"Playtime\":999999}" "nested" { "Playtime" "1000" } }
        } } } } "Playtime" "9000" }'''
        self.assertEqual(module.steam_app_metrics(vdf, '4356430'),
                         {'Playtime': 3627, 'Playtime2wks': 2361, 'LastPlayed': 1789915171})
        self.assertEqual(module.steam_app_metrics(vdf, '2483190'), {})

    def test_rejects_encrypted_and_truncated_input(self):
        with tempfile.TemporaryDirectory() as temp:
            p = Path(temp) / 'save.bin'
            for data in (b'encrypted-data', struct.pack('<II', 0x4a8bf2b6, 100) + b'xx'):
                p.write_bytes(data)
                with self.assertRaises(ValueError):
                    module.fh6_snapshot_metrics(p)

    def test_aggregates_are_correct_private_and_read_only(self):
        with tempfile.TemporaryDirectory() as temp:
            root = Path(temp)
            db = root / 'input.sqlite'
            con = sqlite3.connect(db)
            con.executescript('''CREATE TABLE Career_Garage(CarId INT, OriginalOwner TEXT);
                INSERT INTO Career_Garage VALUES (1, 'PRIVATE_OWNER'), (1, 'PRIVATE_OWNER'), (2, 'PRIVATE_OWNER');
                CREATE TABLE PhotoCaptures(CarOrdinal INT); INSERT INTO PhotoCaptures VALUES(1),(1),(2);''')
            con.close()
            snapshot = root / 'decrypted.bin'
            data = db.read_bytes()
            snapshot.write_bytes(struct.pack('<II', 0x4a8bf2b6, 0) + struct.pack('<II', 0xa9f1f729, len(data)) + data)
            save = root / 'C_ProfileData'
            save.write_bytes(b'PRIVATE_SAVE')
            config = root / 'localconfig.vdf'
            config.write_text('"Steam" { "apps" { "4356430" { "Playtime" "3627" } } }', encoding='utf-8')
            remote = root / 'remote'
            remote.mkdir()
            for name in ['MyCAREER0001', 'MyCAREER0001PhotosLoose', 'RosterNBA0001', 'UserData']:
                (remote / name).write_bytes(b'PRIVATE_ACCOUNT_DATA')
            tracked = [save, snapshot, config, *remote.iterdir()]
            before = {p: hashlib.sha256(p.read_bytes()).digest() for p in tracked}
            result = module.build_snapshot(save, snapshot, '2026-09-18T15:14:24+04:00', config, remote)
            self.assertEqual(result['fh6']['garageCars'], 3)
            self.assertEqual(result['fh6']['uniqueCars'], 2)
            self.assertEqual(result['fh6']['photoCars'], 2)
            self.assertEqual(result['nba2k27']['careerSaveSlots'], 1)
            self.assertEqual(result['nba2k27']['rosterSaveSlots'], 1)
            self.assertEqual(result['nba2k27']['playtimeMinutes'], 3627)
            self.assertEqual(set(result['fh6']), {'latestSaveAt','snapshotExtractedAt','snapshotKind','garageCars','uniqueCars','photoCars'})
            public = json.dumps(result)
            self.assertNotIn('PRIVATE', public)
            self.assertNotIn(str(root), public)
            self.assertNotIn('credits', public)
            self.assertEqual(before, {p: hashlib.sha256(p.read_bytes()).digest() for p in tracked})


if __name__ == '__main__':
    unittest.main()
