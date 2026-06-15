#!/usr/bin/env bash
# Import .webp frames from designer folders into assets/home-film/.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
P1_SRC="${1:-$HOME/Downloads/Telegram Desktop/Анімація - 1-2 екран}"
P2_SRC="${2:-$HOME/Downloads/Telegram Desktop/Анімація - 2-3 екран}"
OUT_P1="$ROOT/assets/home-film/p1"
OUT_P2="$ROOT/assets/home-film/p2"
MANIFEST="$ROOT/assets/home-film/manifest.json"

python3 - "$P1_SRC" "$P2_SRC" "$OUT_P1" "$OUT_P2" "$MANIFEST" <<'PY'
import json
import re
import shutil
import sys
from pathlib import Path

p1_src, p2_src, out_p1, out_p2, manifest = map(Path, sys.argv[1:6])

def import_phase(src: Path, dest: Path, phase_key: str, source_label: str) -> dict:
    if not src.is_dir():
        raise SystemExit(f"Missing folder: {src}")

    files = sorted(
        [p for p in src.glob("*.webp") if p.is_file()],
        key=lambda p: int(re.search(r"(\d+)", p.stem).group(1)),
    )

    if not files:
        raise SystemExit(f"No .webp files in {src}")

    if dest.exists():
        for old in dest.glob("*.webp"):
            old.unlink()
    else:
        dest.mkdir(parents=True, exist_ok=True)

    for index, src_file in enumerate(files, start=1):
        target = dest / f"frame-{index:04d}.webp"
        shutil.copy2(src_file, target)

    last_index = len(files) - 1
    return {
        "count": len(files),
        "lastIndex": last_index,
        "source": source_label,
    }

p1_meta = import_phase(p1_src, out_p1, "p1", "Анімація - 1-2 екран")
p2_meta = import_phase(p2_src, out_p2, "p2", "Анімація - 2-3 екран")

data = {
    "version": 2,
    "fps": 24,
    "pad": 4,
    "ext": ".webp",
    "p1": p1_meta,
    "p2": p2_meta,
}

manifest.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
print(f"p1: {p1_meta['count']} frames")
print(f"p2: {p2_meta['count']} frames")
PY
