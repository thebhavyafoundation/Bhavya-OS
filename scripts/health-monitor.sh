#!/bin/bash
# ============================================================
# Bhavya Foundation — Health Monitor
# Checks all services and reports status
# Usage: ./scripts/health-monitor.sh [url]
# ============================================================

set -euo pipefail

BASE_URL="${1:-https://staging.bhavya.foundation}"
PASS=0
FAIL=0
WARN=0

check() {
  local name="$1"
  local url="$2"
  local expected="${3:-200}"

  STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$url" 2>/dev/null || echo "000")
  
  if [ "$STATUS" = "$expected" ]; then
    echo "  ✅ $name: $STATUS"
    PASS=$((PASS + 1))
  elif [ "$STATUS" = "000" ]; then
    echo "  ❌ $name: TIMEOUT"
    FAIL=$((FAIL + 1))
  else
    echo "  ⚠️  $name: $STATUS (expected $expected)"
    WARN=$((WARN + 1))
  fi
}

echo ""
echo "╔══════════════════════════════════════════╗"
echo "║   Bhavya Foundation — Health Monitor     ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "Target: $BASE_URL"
echo ""

echo "🌐 Application Health:"
check "Website" "$BASE_URL/"
check "API Health" "$BASE_URL/api/health"
check "Admin Platform" "$BASE_URL/admin/"
check "Admin Health" "$BASE_URL/admin/api/health"
check "Design System" "$BASE_URL/design/"

echo ""
echo "🔒 Security Headers:"
HEADERS=$(curl -s -I --max-time 10 "$BASE_URL" 2>/dev/null)

check_header() {
  local name="$1"
  if echo "$HEADERS" | grep -qi "$2"; then
    echo "  ✅ $name: Present"
    PASS=$((PASS + 1))
  else
    echo "  ⚠️  $name: Missing"
    WARN=$((WARN + 1))
  fi
}

check_header "HSTS" "strict-transport-security"
check_header "X-Frame-Options" "x-frame-options"
check_header "X-Content-Type-Options" "x-content-type-options"
check_header "Referrer-Policy" "referrer-policy"

echo ""
echo "📊 Summary:"
echo "  Passed: $PASS"
echo "  Failed: $FAIL"
echo "  Warnings: $WARN"

if [ "$FAIL" -gt 0 ]; then
  echo ""
  echo "❌ HEALTH CHECK FAILED"
  exit 1
else
  echo ""
  echo "✅ HEALTH CHECK PASSED"
  exit 0
fi
