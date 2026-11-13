#!/bin/sh
# Bhavya OS — Ruflo remote bootstrap (runs INSIDE a remote sandbox, never on the laptop).
#
# Authority: AGENTS.md + docs/architecture/PLATFORM-TRUTH.md
# Reference: docs/tools/ruflo/INSTALLATION.md
#
# Pinned upstream: ruflo@3.76.0 (npm) / ruvnet/ruflo @ dc25dd9b522bf1f3761f0d061a0bd0deb1900ba1
#
# This script is idempotent and safe to re-run. It installs Ruflo, installs the
# free local model used for the LLM execution path, starts the MCP server over
# HTTP with bearer authentication, and prints the RPC endpoint.
#
# IMPORTANT: this must run in the approved remote environment (Vercel Sandbox),
# never on the control-centre laptop. See the machine resource contract.
set -e

RUFLO_VERSION=3.76.0
MODEL=qwen2.5:0.5b-instruct
WORKDIR=${WORKDIR:-/vercel/sandbox/ruflo}
PORT=${PORT:-3000}

mkdir -p "$WORKDIR"
cd "$WORKDIR"

echo "[1/5] installing ruflo@$RUFLO_VERSION"
if [ ! -d node_modules/ruflo ]; then
  npm init -y > /dev/null 2>&1
  npm install "ruflo@$RUFLO_VERSION" --no-audit --no-fund
else
  echo "     already installed"
fi

echo "[2/5] installing zstd (required by the ollama installer)"
if ! command -v zstd > /dev/null 2>&1; then
  export DEBIAN_FRONTEND=noninteractive
  sudo apt-get update -qq > /dev/null 2>&1 || true
  sudo apt-get install -y zstd > /dev/null 2>&1 || true
fi
command -v zstd > /dev/null 2>&1 && echo "     zstd ok"

echo "[3/5] installing ollama + $MODEL (free local model, no payment method)"
if ! command -v ollama > /dev/null 2>&1; then
  curl -fsSL https://ollama.com/install.sh -o /tmp/ollama.sh
  sh /tmp/ollama.sh
fi
if ! pgrep -f "ollama serve" > /dev/null 2>&1; then
  nohup env OLLAMA_HOST=127.0.0.1:11434 ollama serve > "$WORKDIR/ollama.log" 2>&1 &
  sleep 10
fi
ollama list 2>/dev/null | grep -q "$MODEL" || ollama pull "$MODEL"

echo "[4/5] starting the Ruflo MCP server over HTTP with bearer auth"
pkill -f 'claude-flow-mcp' 2>/dev/null || true
sleep 2
nohup env OLLAMA_API_KEY=ollama \
  RUFLO_PROVIDER=ollama \
  OLLAMA_BASE_URL=http://127.0.0.1:11434 \
  npx ruflo mcp start -t http -p "$PORT" --host 0.0.0.0 \
  > "$WORKDIR/mcp.log" 2>&1 &
sleep 20
grep -E 'Tools|Status|Transport' "$WORKDIR/mcp.log" | head -3

echo "[5/5] verification"
T=$(cat /vercel/.claude-flow/mcp-http-token 2>/dev/null || true)
if [ -n "$T" ]; then
  echo "     token present (len ${#T}); stored at /vercel/.claude-flow/mcp-http-token"
  echo "     /health: $(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:$PORT/health)"
  echo "     /rpc without auth: $(curl -s -o /dev/null -w '%{http_code}' -X POST http://127.0.0.1:$PORT/rpc -H 'Content-Type: application/json' -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}')  (401 expected)"
else
  echo "     WARNING: no MCP token found"
fi

echo
echo "Ruflo MCP listening on 0.0.0.0:$PORT — publish this port to reach it from the agent."
