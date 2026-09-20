#!/usr/bin/env bash
# Renders Blagoj_Simonovski_Resume.pdf from the site's print stylesheet using headless Chrome.
# Usage: ./make-pdf.sh            (serves the repo on :8765, renders, stops the server)
set -euo pipefail
cd "$(dirname "$0")"

CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
[ -x "$CHROME" ] || CHROME="/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"
[ -x "$CHROME" ] || { echo "No Chrome/Edge found; set CHROME=/path/to/binary" >&2; exit 1; }

OUT="${1:-Blagoj_Simonovski_Resume.pdf}"
PORT=8765
STARTED=0
if ! curl -sf "http://127.0.0.1:$PORT/" >/dev/null; then
  python3 -m http.server "$PORT" --bind 127.0.0.1 >/dev/null 2>&1 &
  SERVER=$!; STARTED=1
  for _ in $(seq 1 30); do curl -sf "http://127.0.0.1:$PORT/" >/dev/null && break; sleep 0.2; done
fi

"$CHROME" --headless=new --disable-gpu --hide-scrollbars \
  --no-pdf-header-footer --virtual-time-budget=6000 \
  --print-to-pdf="$OUT" "http://127.0.0.1:$PORT/?print=1" 2>/dev/null

if [ "$STARTED" = 1 ]; then { kill "$SERVER" && wait "$SERVER"; } 2>/dev/null || true; fi
echo "Wrote $OUT ($(du -h "$OUT" | cut -f1))"
