"""Read-only, offline importer. Publishes an allowlist of aggregates, never saves or IDs."""
import argparse
from datetime import datetime, timezone
import hashlib
import json
from pathlib import Path
import re
import sqlite3
import struct
import tempfile


def iso(timestamp):
    return datetime.fromtimestamp(timestamp, timezone.utc).isoformat(timespec='seconds')


def steam_app_metrics(text, app_id):
    # Tokenize VDF so braces inside quoted JSON/tokens cannot change nesting.
    tokens = re.findall(r'"((?:\\.|[^"\\])*)"|([{}])', text)
    stack, pending, result = [], None, {}
    for quoted, brace in tokens:
        if brace == '{':
            stack.append(pending)
            pending = None
        elif brace == '}':
            if not stack:
                raise ValueError('Invalid VDF nesting')
            stack.pop()
            pending = None
        elif pending is None:
            pending = quoted
        else:
            if len(stack) >= 2 and stack[-2:] == ['apps', app_id]:
                if pending in ('Playtime', 'Playtime2wks', 'LastPlayed') and quoted.isdigit():
                    result[pending] = int(quoted)
            pending = None
    return result


def fh6_snapshot_metrics(path):
    data = Path(path).read_bytes()
    cursor, records = 0, []
    while cursor + 8 <= len(data):
        tag, size = struct.unpack_from('<II', data, cursor)
        end = cursor + 8 + size
        if end > len(data):
            raise ValueError('Truncated FH6 section')
        records.append((tag, data[cursor + 8:end]))
        cursor = end
    if cursor != len(data) or not records or records[0][0] != 0x4a8bf2b6:
        raise ValueError('Expected a locally decrypted FH6 snapshot')
    databases = [b for tag, b in records if tag == 0xa9f1f729 and b.startswith(b'SQLite format 3\x00')]
    if len(databases) != 1:
        raise ValueError('Expected exactly one embedded profile database')
    with tempfile.TemporaryDirectory(prefix='chefzc-game-read-') as temp:
        db = Path(temp) / 'snapshot.sqlite'
        db.write_bytes(databases[0])
        con = sqlite3.connect(db.as_uri() + '?mode=ro&immutable=1', uri=True)
        try:
            if con.execute('PRAGMA quick_check').fetchone()[0] != 'ok':
                raise ValueError('Snapshot database failed integrity check')
            return {
                'garageCars': con.execute('SELECT count(*) FROM Career_Garage').fetchone()[0],
                'uniqueCars': con.execute('SELECT count(DISTINCT CarId) FROM Career_Garage').fetchone()[0],
                'photoCars': con.execute('SELECT count(DISTINCT CarOrdinal) FROM PhotoCaptures').fetchone()[0],
            }
        finally:
            con.close()


def build_snapshot(fh6_save, fh6_snapshot, extracted_at, steam_config, nba_remote):
    paths = [Path(p).resolve(strict=True) for p in (fh6_save, fh6_snapshot, steam_config)]
    remote = Path(nba_remote).resolve(strict=True)
    tracked = paths + [p for p in remote.iterdir() if p.is_file()]
    before = {p: hashlib.sha256(p.read_bytes()).digest() for p in tracked}
    metrics = steam_app_metrics(paths[2].read_text(encoding='utf-8'), '4356430')
    careers = [p for p in remote.iterdir() if re.fullmatch(r'MyCAREER\d+', p.name) and p.is_file()]
    rosters = [p for p in remote.iterdir() if re.fullmatch(r'RosterNBA\d+', p.name) and p.is_file()]
    result = {
        'schemaVersion': 1,
        'checkedAt': datetime.now(timezone.utc).isoformat(timespec='seconds'),
        'fh6': {
            'latestSaveAt': iso(paths[0].stat().st_mtime),
            'snapshotExtractedAt': datetime.fromisoformat(extracted_at).isoformat(timespec='seconds'),
            'snapshotKind': 'historical',
            **fh6_snapshot_metrics(paths[1]),
        },
        'nba2k27': {
            'latestSaveAt': iso(max(p.stat().st_mtime for p in careers)) if careers else None,
            'lastPlayedAt': iso(metrics['LastPlayed']) if 'LastPlayed' in metrics else None,
            'playtimeMinutes': metrics.get('Playtime'),
            'recentPlaytimeMinutes': metrics.get('Playtime2wks'),
            'careerSaveSlots': len(careers), 'rosterSaveSlots': len(rosters),
        },
    }
    if any(hashlib.sha256(p.read_bytes()).digest() != before[p] for p in tracked):
        raise RuntimeError('Source changed during inspection; snapshot was not published')
    return result


def main():
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('--fh6-save', required=True)
    p.add_argument('--fh6-snapshot', required=True)
    p.add_argument('--snapshot-extracted-at', required=True, help='ISO timestamp of the historical export, with timezone')
    p.add_argument('--steam-config', required=True)
    p.add_argument('--nba-remote', required=True)
    p.add_argument('--output', required=True)
    args = p.parse_args()
    if datetime.fromisoformat(args.snapshot_extracted_at).tzinfo is None:
        p.error('snapshot-extracted-at needs an explicit timezone')
    output = Path(args.output).resolve()
    # The importer can only write this public JS artifact, never overwrite a game file.
    if output.name != 'games-data.js' or output.exists() and output.is_symlink():
        p.error('Output must be games-data.js, not a link')
    result = build_snapshot(args.fh6_save, args.fh6_snapshot, args.snapshot_extracted_at,
                            args.steam_config, args.nba_remote)
    output.write_text('// Public aggregates only. Generated by scripts/import-game-snapshot.py.\n'
                      + 'export const gameSnapshot = ' + json.dumps(result, indent=2) + ';\n', encoding='utf-8')
    print(json.dumps(result, indent=2))


if __name__ == '__main__':
    main()
