#!/usr/bin/env bash
# Renders the résumé PDF from the site's print stylesheet using headless Chrome.
# Usage: ./make-pdf.sh [output.pdf]     (default: Blagoj_Simonovski_Resume.pdf in the repo)
# The pre-commit hook in .githooks runs this whenever index.html/style.css are staged;
# enable it once per clone with:  git config core.hooksPath .githooks
set -euo pipefail

OUT="${1:-Blagoj_Simonovski_Resume.pdf}"
case "$OUT" in /*) ;; *) OUT="$PWD/$OUT" ;; esac   # resolve against the caller's cwd before cd
cd "$(dirname "$0")"

CHROME="${CHROME:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
[ -x "$CHROME" ] || CHROME="/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge"
[ -x "$CHROME" ] || { echo "No Chrome/Edge found; set CHROME=/path/to/binary" >&2; exit 1; }

# Web fonts are fetched at render time; refuse to bake fallback fonts into the PDF.
curl -sf --max-time 10 -o /dev/null "https://fonts.googleapis.com/css2?family=Fraunces" \
  || { echo "Cannot reach fonts.googleapis.com — not rendering with fallback fonts." >&2; exit 1; }

# Always serve this directory ourselves on a free port, and always clean up.
PORT=$(python3 -c 'import socket; s=socket.socket(); s.bind(("127.0.0.1",0)); print(s.getsockname()[1])')
python3 -m http.server "$PORT" --bind 127.0.0.1 >/dev/null 2>&1 &
SERVER=$!
trap '{ kill "$SERVER" && wait "$SERVER"; } 2>/dev/null || true' EXIT
for _ in $(seq 1 30); do
  curl -sf "http://127.0.0.1:$PORT/" 2>/dev/null | grep -q 'Blagoj Simonovski' && break
  sleep 0.2
done
curl -sf "http://127.0.0.1:$PORT/" | grep -q 'Blagoj Simonovski' \
  || { echo "Local server on :$PORT did not serve index.html" >&2; exit 1; }

"$CHROME" --headless=new --disable-gpu --hide-scrollbars \
  --no-pdf-header-footer --virtual-time-budget=8000 \
  --print-to-pdf="$OUT" "http://127.0.0.1:$PORT/" 2>/dev/null

# Sanity check: the three web fonts must actually be embedded in the result.
python3 - "$OUT" <<'PY'
import re, sys, zlib
d = open(sys.argv[1], 'rb').read()
names = set(re.findall(rb'/(?:BaseFont|FontName)\s*/([A-Za-z0-9+_-]+)', d))
for m in re.finditer(rb'stream\r?\n(.*?)endstream', d, re.S):
    try: names |= set(re.findall(rb'/(?:BaseFont|FontName)\s*/([A-Za-z0-9+_-]+)', zlib.decompress(m.group(1))))
    except zlib.error: pass
blob = b' '.join(names)
missing = [f for f in (b'Fraunces', b'InstrumentSans', b'JetBrainsMono') if f not in blob]
if missing:
    sys.exit(f"PDF is missing embedded font(s) {[m.decode() for m in missing]} — render fell back to system fonts.")
PY
echo "Wrote $OUT ($(du -h "$OUT" | cut -f1))"
