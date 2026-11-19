#!/bin/sh
# Bhavya OS — Ruflo MCP acceptance check (runs inside the remote sandbox).
#
# Verifies the full compatibility gate against a running Ruflo MCP HTTP server:
#   1. discovery     - tools/list returns the Ruflo tool surface
#   2. dispatch      - a bounded task is created and assigned
#   3. execution     - a remote worker executes it and writes a verifiable artifact
#   4. observability - status and errors are readable
#   5. cancellation  - task_cancel and agent_terminate work
#   6. permissions   - unauthenticated and wrong-token requests are refused
#
# Usage: sh check-remote.sh [REPO_DIR]
# REPO_DIR defaults to /vercel/sandbox/Bhavya-OS
set -e

REPO_DIR=${1:-/vercel/sandbox/Bhavya-OS}
RPC=http://127.0.0.1:${PORT:-3000}/rpc
T=$(cat /vercel/.claude-flow/mcp-http-token 2>/dev/null || true)
PASS=0
FAIL=0

call() {
  curl -s -X POST $RPC -H "Content-Type: application/json" -H "Authorization: Bearer $T" -d "$1"
}
jget() {
  node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const j=JSON.parse(s);const p=process.argv[1].split(".");let v=j;for(const k of p)v=v?.[k];console.log(typeof v==="object"?JSON.stringify(v):String(v))}catch(e){console.log("")}})' "$1"
}
check() {
  if [ "$2" = "$3" ]; then echo "  PASS  $1"; PASS=$((PASS+1)); else echo "  FAIL  $1 (expected '$3', got '$2')"; FAIL=$((FAIL+1)); fi
}

call '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-11-25","capabilities":{},"clientInfo":{"name":"bhavya-check","version":"1.0"}}}' > /dev/null
call '{"jsonrpc":"2.0","method":"notifications/initialized"}' > /dev/null

echo "1. discovery"
call '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' > /tmp/c_tools.json
TOOLS=$(jget result.tools.length < /tmp/c_tools.json)
check "tools/list returns a tool surface" "$([ "${TOOLS:-0}" -gt 50 ] && echo yes || echo no)" "yes"
echo "        tool count = ${TOOLS:-0}"

echo "2. dispatch"
call '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"swarm_init","arguments":{"topology":"hierarchical","maxAgents":1,"strategy":"specialized"}}}' > /tmp/c_sw.json
SWARM=$(jget result.content.0.text < /tmp/c_sw.json | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{console.log(JSON.parse(s).swarmId)}catch(e){console.log("")}})')
check "swarm_init (maxAgents=1)" "$([ -n "$SWARM" ] && echo yes || echo no)" "yes"

call '{"jsonrpc":"2.0","id":4,"method":"tools/call","params":{"name":"agent_spawn","arguments":{"agentType":"reviewer","name":"bhavya-check-worker","model":"qwen2.5:0.5b-instruct"}}}' > /tmp/c_ag.json
AGENT=$(jget result.content.0.text < /tmp/c_ag.json | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{console.log(JSON.parse(s).agentId)}catch(e){console.log("")}})')
check "agent_spawn" "$([ -n "$AGENT" ] && echo yes || echo no)" "yes"

call '{"jsonrpc":"2.0","id":5,"method":"tools/call","params":{"name":"task_create","arguments":{"type":"research","description":"Non-destructive check task; writes a report artifact only.","priority":"low","tags":["bhavya","acceptance"]}}}' > /tmp/c_tk.json
TASK=$(jget result.content.0.text < /tmp/c_tk.json | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{console.log(JSON.parse(s).taskId)}catch(e){console.log("")}})')
check "task_create" "$([ -n "$TASK" ] && echo yes || echo no)" "yes"

call '{"jsonrpc":"2.0","id":6,"method":"tools/call","params":{"name":"task_assign","arguments":{"taskId":"'"$TASK"'","agentIds":["'"$AGENT"'"]}}}' > /tmp/c_as.json
ASSIGNED=$(jget result.content.0.text < /tmp/c_as.json | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{console.log(JSON.parse(s).assignedTo.length)}catch(e){console.log("0")}})')
check "task_assign" "$([ "${ASSIGNED:-0}" -ge 1 ] && echo yes || echo no)" "yes"

echo "3. execution (remote worker writes a verifiable artifact)"
OUT="$REPO_DIR/ruflo-acceptance-report.md"
call '{"jsonrpc":"2.0","id":7,"method":"tools/call","params":{"name":"terminal_execute","arguments":{"command":"sh -c '"'"'cd '"$REPO_DIR"' && printf \"%s\\n\" \"# Ruflo acceptance report\" \"repo=HEAD $(git rev-parse --short HEAD)\" \"written_by=terminal_execute\" > ruflo-acceptance-report.md && echo WROTE'"'"'"}}}' > /tmp/c_ex.json
EXIT=$(jget result.content.0.text < /tmp/c_ex.json | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{console.log(JSON.parse(s).exitCode)}catch(e){console.log("")}})')
check "terminal_execute exit code" "$EXIT" "0"
check "artifact written" "$([ -s "$OUT" ] && echo yes || echo no)" "yes"
cd "$REPO_DIR" 2>/dev/null || true
MOD=$(git status --porcelain 2>/dev/null | grep -c '^ M' || true)
check "no tracked application file modified" "$MOD" "0"

echo "3b. LLM execution path (free local model)"
call '{"jsonrpc":"2.0","id":8,"method":"tools/call","params":{"name":"agent_execute","arguments":{"agentId":"'"$AGENT"'","prompt":"Reply with exactly: RUFLO_ACCEPTANCE_OK","maxTokens":40}}}' > /tmp/c_llm.json
OUTL=$(jget result.content.0.text < /tmp/c_llm.json | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{console.log(JSON.parse(s).output)}catch(e){console.log("")}})')
check "agent_execute via local model" "$OUTL" "RUFLO_ACCEPTANCE_OK"

echo "4. observability"
call '{"jsonrpc":"2.0","id":9,"method":"tools/call","params":{"name":"task_status","arguments":{"taskId":"'"$TASK"'"}}}' > /tmp/c_st.json
STATUS=$(jget result.content.0.text < /tmp/c_st.json | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{console.log(JSON.parse(s).status)}catch(e){console.log("")}})')
check "task_status readable" "$([ -n "$STATUS" ] && echo yes || echo no)" "yes"

echo "5. cancellation"
call '{"jsonrpc":"2.0","id":10,"method":"tools/call","params":{"name":"task_cancel","arguments":{"taskId":"'"$TASK"'","reason":"acceptance check"}}}' > /tmp/c_cn.json
CANCELLED=$(jget result.content.0.text < /tmp/c_cn.json | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{console.log(JSON.parse(s).status)}catch(e){console.log("")}})')
check "task_cancel sets cancelled" "$CANCELLED" "cancelled"
call '{"jsonrpc":"2.0","id":11,"method":"tools/call","params":{"name":"agent_terminate","arguments":{"agentId":"'"$AGENT"'"}}}' > /tmp/c_tm.json
TERMINATED=$(jget result.content.0.text < /tmp/c_tm.json | node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{console.log(JSON.parse(s).terminated)}catch(e){console.log("")}})')
check "agent_terminate" "$TERMINATED" "true"

echo "6. permissions"
NOAUTH=$(curl -s -o /dev/null -w '%{http_code}' -X POST $RPC -H 'Content-Type: application/json' -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}')
check "unauthenticated RPC refused" "$NOAUTH" "401"
BADTOK=$(curl -s -o /dev/null -w '%{http_code}' -X POST $RPC -H 'Content-Type: application/json' -H 'Authorization: Bearer wrong' -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}')
check "wrong-token RPC refused" "$BADTOK" "401"
HEALTH=$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:${PORT:-3000}/health)
check "health endpoint reachable" "$HEALTH" "200"

echo
echo "RESULT: $PASS passed, $FAIL failed"
[ "$FAIL" -eq 0 ]
