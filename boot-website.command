#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DOCS_DIR="$ROOT_DIR/docs"

HOST="${HOST:-127.0.0.1}"
PORT="${PORT:-5173}"
URL="http://${HOST}:${PORT}/"
PID_FILE="${LIEMAX_WEBSITE_PID_FILE:-$ROOT_DIR/.liemax-website.pid}"

echo "LIEMAX website launcher"
echo "Project: $ROOT_DIR"
echo "Serving: $DOCS_DIR"
echo "URL:     $URL"
echo

if [[ ! -d "$DOCS_DIR" || ! -f "$DOCS_DIR/index.html" ]]; then
  echo "Could not find docs/index.html."
  echo "Expected the static website at: $DOCS_DIR"
  exit 1
fi

echo "Rebuilding docs/data.js from latest source data..."
(cd "$ROOT_DIR" && npm run build:docs-data)
echo "Build complete."
echo

PYTHON_BIN="$(command -v python3 || command -v python || true)"
if [[ -z "$PYTHON_BIN" ]]; then
  echo "Could not find python3 or python on PATH."
  echo "Install Python, then run this file again."
  exit 1
fi

if [[ -f "$PID_FILE" ]]; then
  EXISTING_PID="$(cat "$PID_FILE" 2>/dev/null || true)"
  if [[ "$EXISTING_PID" =~ ^[0-9]+$ ]] && kill -0 "$EXISTING_PID" >/dev/null 2>&1; then
    echo "Website is already running with PID $EXISTING_PID."
    if [[ "${OPEN_BROWSER:-1}" != "0" ]] && command -v open >/dev/null 2>&1; then
      open "$URL"
    fi
    exit 0
  fi
  rm -f "$PID_FILE"
fi

if curl -fsS --max-time 2 "$URL" >/dev/null 2>&1; then
  echo "Something is already serving $URL."
  echo "Opening it now. If this is stale, stop that process or choose another PORT."
  if [[ "${OPEN_BROWSER:-1}" != "0" ]] && command -v open >/dev/null 2>&1; then
    open "$URL"
  fi
  exit 0
fi

echo "Starting static website server..."
cd "$DOCS_DIR"
"$PYTHON_BIN" -m http.server "$PORT" --bind "$HOST" &
SERVER_PID=$!
echo "$SERVER_PID" > "$PID_FILE"

cleanup() {
  trap - EXIT INT TERM HUP
  if [[ -f "$PID_FILE" ]] && [[ "$(cat "$PID_FILE" 2>/dev/null || true)" == "$SERVER_PID" ]]; then
    rm -f "$PID_FILE"
  fi
  if kill -0 "$SERVER_PID" >/dev/null 2>&1; then
    kill "$SERVER_PID" >/dev/null 2>&1 || true
    wait "$SERVER_PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup EXIT INT TERM HUP

for _ in {1..80}; do
  if curl -fsS --max-time 1 "$URL" >/dev/null 2>&1; then
    echo
    echo "Website is ready."
    if [[ "${OPEN_BROWSER:-1}" != "0" ]] && command -v open >/dev/null 2>&1; then
      open "$URL"
    fi
    break
  fi

  if ! kill -0 "$SERVER_PID" >/dev/null 2>&1; then
    echo "Dev server stopped before the site became reachable."
    wait "$SERVER_PID"
    exit $?
  fi

  sleep 0.25
done

echo "Keep this window open while using the website."
echo "Close this terminal or press Ctrl+C here to stop it."
echo "You can also run stop-website.command from this folder."
wait "$SERVER_PID"
