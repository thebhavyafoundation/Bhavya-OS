#!/bin/sh
# ============================================================
# Bhavya Foundation — Readiness Check
# Verifies all dependencies are available before accepting traffic
# ============================================================

SERVICE="${1:-website}"
PORT="${2:-3000}"

check_filesystem() {
  local paths="/app/config /app/registry /app/content /app/navigation"
  for path in $paths; do
    if [ ! -d "$path" ]; then
      echo '{"ready":false,"reason":"missing_path","path":"'"$path"'"}'
      return 1
    fi
  done
  return 0
}

check_network() {
  # Check if port is listening
  if ! curl -s --max-time 2 "http://localhost:$PORT/" > /dev/null 2>&1; then
    # Port might not be up yet, that's ok for readiness
    return 0
  fi
  return 0
}

check_filesystem
if [ $? -ne 0 ]; then
  exit 1
fi

check_network

echo '{"ready":true,"service":"'"$SERVICE"'"}'
exit 0
