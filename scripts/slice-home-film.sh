#!/usr/bin/env bash
# Slice homepage scroll-film MP4s into webp frames (24 fps).
# Requires: ffmpeg, cwebp (brew install ffmpeg webp)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_P1="$ROOT/assets/home-film/p1"
OUT_P2="$ROOT/assets/home-film/p2"
TMP_P1="$ROOT/assets/home-film/.tmp-p1"
TMP_P2="$ROOT/assets/home-film/.tmp-p2"
MANIFEST="$ROOT/assets/home-film/manifest.json"

P1_URL="${HOME_FILM_P1_URL:-https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/06/%D0%92%D1%96%D0%B4%D0%B5%D0%BE-1-2-%D0%B5%D0%BA%D1%80%D0%B0%D0%BD.mp4}"
P2_URL="${HOME_FILM_P2_URL:-https://lavenderblush-bat-855084.hostingersite.com/wp-content/uploads/2026/06/%D0%92%D1%96%D0%B4%D0%B5%D0%BE-2-3-%D0%B5%D0%BA%D1%80%D0%B0%D0%BD.mp4}"
FPS="${HOME_FILM_FPS:-24}"
QUALITY="${HOME_FILM_WEBP_QUALITY:-82}"

command -v ffmpeg >/dev/null 2>&1 || { echo "ffmpeg not found"; exit 1; }
command -v cwebp >/dev/null 2>&1 || { echo "cwebp not found (brew install webp)"; exit 1; }

slice_phase() {
  local url="$1"
  local tmp="$2"
  local out="$3"
  local label="$4"

  mkdir -p "$tmp" "$out"
  rm -f "$tmp"/*.png "$out"/*.webp

  echo "→ $label: download + png @ ${FPS}fps"
  ffmpeg -y -i "$url" -vf "fps=${FPS}" "$tmp/frame-%04d.png"

  echo "→ $label: png → webp (q=${QUALITY})"
  for f in "$tmp"/frame-*.png; do
    cwebp -q "$QUALITY" "$f" -o "$out/$(basename "${f%.png}.webp")"
  done

  rm -f "$tmp"/*.png
  echo "→ $label: $(ls "$out" | wc -l | tr -d ' ') frames"
}

slice_phase "$P1_URL" "$TMP_P1" "$OUT_P1" "phase 1"
slice_phase "$P2_URL" "$TMP_P2" "$OUT_P2" "phase 2"

P1_COUNT=$(ls "$OUT_P1" | wc -l | tr -d ' ')
P2_COUNT=$(ls "$OUT_P2" | wc -l | tr -d ' ')
P1_LAST=$((P1_COUNT - 1))
P2_LAST=$((P2_COUNT - 1))

cat > "$MANIFEST" <<EOF
{
  "version": 1,
  "fps": ${FPS},
  "pad": 4,
  "ext": ".webp",
  "p1": {
    "count": ${P1_COUNT},
    "lastIndex": ${P1_LAST},
    "source": "Відео-1-2-екран.mp4"
  },
  "p2": {
    "count": ${P2_COUNT},
    "lastIndex": ${P2_LAST},
    "source": "Відео-2-3-екран.mp4"
  }
}
EOF

echo "Done. manifest: p1=${P1_COUNT} p2=${P2_COUNT}"
