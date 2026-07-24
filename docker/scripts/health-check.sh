#!/bin/sh
# ============================================================
# Bhavya Foundation — Health Check Script
# Usage: /app/docker/scripts/health-check.sh [service] [port]
# ============================================================

SERVICE="${1:-website}"
PORT="${2:-3000}"
TIMEOUT=5

check_http() {
  local url="$1"
  local status=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$url" 2>/dev/null)
  if [ "$status" -ge 200 ] && [ "$status" -lt 400 ]; then
    echo '{"status":"healthy","service":"'"$SERVICE"'","http_status":'"$status"'}'
    return 0
  else
    echo '{"status":"unhealthy","service":"'"$SERVICE"'","http_status":'"$status"'}'
    return 1
  fi
}

check_process() {
  local proc="$1"
  if pgrep -x "$proc" > /dev/null 2>&1; then
    echo '{"status":"healthy","service":"'"$SERVICE"'","process":"'"$proc"'"}'
    return 0
  else
    echo '{"status":"unhealthy","service":"'"$SERVICE"'","process":"'"$proc"'"}'
    return 1
  fi
}

case "$SERVICE" in
  website)
    check_http "http://localhost:$PORT/"
    ;;
  design-system)
    check_http "http://localhost:$PORT/"
    ;;
  runtime|api)
    check_http "http://localhost:$PORT/health"
    ;;
  nginx|proxy)
    check_process "nginx"
    ;;
  *)
    echo "Unknown service: $SERVICE"
    exit 1
    ;;
esac
