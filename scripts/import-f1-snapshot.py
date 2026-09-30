"""Read F1 25 Steam metadata locally and publish only a dated aggregate module."""
import argparse
import importlib.util
import json
from pathlib import Path


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--steam-config', required=True)
    parser.add_argument('--f1-remote', required=True)
    parser.add_argument('--output', required=True)
    args = parser.parse_args()

    source = Path(__file__).with_name('import-game-snapshot.py')
    spec = importlib.util.spec_from_file_location('game_import', source)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    result = module.export_f1_25_snapshot(args.steam_config, args.f1_remote, args.output)
    print(json.dumps(result, indent=2))


if __name__ == '__main__':
    main()
