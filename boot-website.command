#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

HOST="${HOST:-127.0.0.1}"
PORT="${PORT:-5173}"
URL="http://${HOST}:${PORT}/"

echo "LIEMAX website launcher"
echo "Project: $ROOT_DIR"
echo "URL:     $URL"
echo

if curl -fsS --max-time 2 "$URL" >/dev/null 2>&1; then
  echo "Website is already running."
  if command -v open >/dev/null 2>&1; then
    open "$URL"
  fi
  exit 0
fi

if command -v npm >/dev/null 2>&1; then
  DEV_CMD=(npm run dev -- --host "$HOST" --port "$PORT")
else
  NODE_BIN="$(command -v node || true)"
  if [[ -z "$NODE_BIN" && -x "$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node" ]]; then
    NODE_BIN="$HOME/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"
  fi

  if [[ -z "$NODE_BIN" ]]; then
    echo "Could not find node or npm on PATH."
    echo "Install Node.js, then run this file again."
    exit 1
  fi

  if [[ ! -f "node_modules/vite/bin/vite.js" ]]; then
    echo "Vite is not installed in node_modules."
    echo "Run npm install, then run this file again."
    exit 1
  fi

  DEV_CMD=("$NODE_BIN" "node_modules/vite/bin/vite.js" --host "$HOST" --port "$PORT")
fi

echo "Starting dev server..."
"${DEV_CMD[@]}" &
SERVER_PID=$!

cleanup() {
  if kill -0 "$SERVER_PID" >/dev/null 2>&1; then
    kill "$SERVER_PID" >/dev/null 2>&1 || true
  fi
}
trap cleanup INT TERM

for _ in {1..80}; do
  if curl -fsS --max-time 1 "$URL" >/dev/null 2>&1; then
    echo
    echo "Website is ready."
    if command -v open >/dev/null 2>&1; then
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
echo "Press Ctrl+C here to stop the dev server."
wait "$SERVER_PID"
