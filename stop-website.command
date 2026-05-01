#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

HOST="${HOST:-127.0.0.1}"
PORT="${PORT:-5173}"
URL="http://${HOST}:${PORT}/"
PID_FILE="${LIEMAX_WEBSITE_PID_FILE:-$ROOT_DIR/.liemax-website.pid}"

echo "LIEMAX website stopper"
echo "Project: $ROOT_DIR"
echo "URL:     $URL"
echo

if [[ ! -f "$PID_FILE" ]]; then
  echo "No LIEMAX website PID file found."
  echo "If the site is still open, close the launcher terminal or stop the process using port $PORT."
  exit 0
fi

SERVER_PID="$(cat "$PID_FILE" 2>/dev/null || true)"
if [[ ! "$SERVER_PID" =~ ^[0-9]+$ ]]; then
  echo "PID file was invalid; removing it."
  rm -f "$PID_FILE"
  exit 0
fi

if ! kill -0 "$SERVER_PID" >/dev/null 2>&1; then
  echo "Website process $SERVER_PID is not running; removing stale PID file."
  rm -f "$PID_FILE"
  exit 0
fi

echo "Stopping website process $SERVER_PID..."
kill "$SERVER_PID" >/dev/null 2>&1 || true

for _ in {1..40}; do
  if ! kill -0 "$SERVER_PID" >/dev/null 2>&1; then
    rm -f "$PID_FILE"
    echo "Website stopped."
    exit 0
  fi
  sleep 0.25
done

echo "Website did not stop after 10 seconds; forcing it now."
kill -9 "$SERVER_PID" >/dev/null 2>&1 || true
rm -f "$PID_FILE"
echo "Website stopped."
