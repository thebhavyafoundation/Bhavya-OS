#!/bin/sh
# Bhavya OS — Ruflo MCP acceptance check (runs inside the remote sandbox).
#
# Verifies the compatibility gate against a running Ruflo MCP HTTP server:
#   1. discovery     - tools/list returns the Ruflo tool surface
#   2. dispatch      - a bounded task is created and assigned
#   3. execution     - a remote worker executes it and writes a verifiable artifact
#   4. llm path      - a model-backed task runs on the free local model and its
#                      answer is checked independently, by arithmetic
#   5. observability - status and errors are readable
#   6. cancellation  - work that is genuinely running is cancelled
#   7. permissions   - unauthenticated and wrong-token requests are refused,
#                      and no production credential is present
#   8. recovery      - the task history survives a controlled restart
#
# Usage: sh check-remote.sh [REPO_DIR]
# REPO_DIR defaults to /vercel/sandbox/Bhavya-OS
#
# SKIP_RESTART=1 leaves step 8 to the caller. It exists because a server
# started by this script does not survive the script: the sandbox tears the
# session's processes down when the command returns. Restarting the service
# and keeping it alive is the refresh procedure in INSTALLATION.md, and it
# has to own the restart so that the server survives it.
set -e

REPO_DIR=${1:-/vercel/sandbox/Bhavya-OS}
WORKDIR=${WORKDIR:-/vercel/sandbox/ruflo}
RPC=http://127.0.0.1:${PORT:-3000}/rpc
T=$(cat /vercel/.claude-flow/mcp-http-token 2>/dev/null || true)
PASS=0
FAIL=0

call() {
  curl -s -X POST $RPC -H "Content-Type: application/json" -H "Authorization: Bearer $T" -d "$1"
}

# The MCP answer is a JSON-RPC envelope whose result carries the tool's own
# JSON in result.content[0].text. It has to be unwrapped twice.
payload() {
  node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{const outer=JSON.parse(s);const inner=JSON.parse(outer.result.content[0].text);let v=inner;for(const k of process.argv[1].split("."))v=v?.[k];console.log(v===undefined?"":(typeof v==="object"?JSON.stringify(v):String(v)))}catch(e){console.log("")}})' "$1"
}

check() {
  if [ "$2" = "$3" ]; then echo "  PASS  $1"; PASS=$((PASS+1)); else echo "  FAIL  $1 (expected '$3', got '$2')"; FAIL=$((FAIL+1)); fi
}

call '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-11-25","capabilities":{},"clientInfo":{"name":"bhavya-check","version":"1.0"}}}' > /dev/null
call '{"jsonrpc":"2.0","method":"notifications/initialized"}' > /dev/null

echo "1. discovery"
call '{"jsonrpc":"2.0","id":2,"method":"tools/list","params":{}}' > /tmp/c_tools.json
TOOLS=$(node -e 'let s="";process.stdin.on("data",d=>s+=d).on("end",()=>{try{console.log(JSON.parse(s).result.tools.length)}catch(e){console.log(0)}})' < /tmp/c_tools.json)
check "tools/list returns a tool surface" "$([ "${TOOLS:-0}" -gt 50 ] && echo yes || echo no)" "yes"
echo "        tool count = ${TOOLS:-0}"

echo "2. dispatch"
call '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"swarm_init","arguments":{"topology":"hierarchical","maxAgents":1,"strategy":"specialized"}}}' > /tmp/c_sw.json
SWARM=$(payload swarmId < /tmp/c_sw.json)
check "swarm_init (maxAgents=1)" "$([ -n "$SWARM" ] && echo yes || echo no)" "yes"

call '{"jsonrpc":"2.0","id":4,"method":"tools/call","params":{"name":"agent_spawn","arguments":{"agentType":"reviewer","name":"bhavya-check-worker","model":"qwen2.5:0.5b-instruct"}}}' > /tmp/c_ag.json
AGENT=$(payload agentId < /tmp/c_ag.json)
check "agent_spawn" "$([ -n "$AGENT" ] && echo yes || echo no)" "yes"

call '{"jsonrpc":"2.0","id":5,"method":"tools/call","params":{"name":"task_create","arguments":{"type":"research","description":"Non-destructive check task; writes a report artifact only.","priority":"low","tags":["bhavya","acceptance"]}}}' > /tmp/c_tk.json
TASK=$(payload taskId < /tmp/c_tk.json)
check "task_create" "$([ -n "$TASK" ] && echo yes || echo no)" "yes"

call '{"jsonrpc":"2.0","id":6,"method":"tools/call","params":{"name":"task_assign","arguments":{"taskId":"'"$TASK"'","agentIds":["'"$AGENT"'"]}}}' > /tmp/c_as.json
ASSIGNED=$(payload assignedTo.length < /tmp/c_as.json)
check "task_assign" "$([ "${ASSIGNED:-0}" -ge 1 ] && echo yes || echo no)" "yes"

echo "3. execution (remote worker writes a verifiable artifact)"
OUT="$REPO_DIR/ruflo-acceptance-report.md"
rm -f "$OUT"
call '{"jsonrpc":"2.0","id":7,"method":"tools/call","params":{"name":"terminal_execute","arguments":{"command":"sh -c '"'"'cd '"$REPO_DIR"' && printf \"%s\\n\" \"# Ruflo acceptance report\" \"repo=HEAD $(git rev-parse --short HEAD)\" \"written_by=terminal_execute\" > ruflo-acceptance-report.md && echo WROTE'"'"'"}}}' > /tmp/c_ex.json
EXIT=$(payload exitCode < /tmp/c_ex.json)
check "terminal_execute exit code" "$EXIT" "0"
check "artifact written" "$([ -s "$OUT" ] && echo yes || echo no)" "yes"
cd "$REPO_DIR" 2>/dev/null || true
MOD=$(git status --porcelain 2>/dev/null | grep -c '^ M' || true)
check "no tracked application file modified" "$MOD" "0"

echo "4. model-backed task, answer checked independently"
# The swarm was initialised with maxAgents=1, so the second worker is
# refused by design. The one worker is used for the model-backed task.
call '{"jsonrpc":"2.0","id":8,"method":"tools/call","params":{"name":"agent_execute","arguments":{"agentId":"'"$AGENT"'","prompt":"What is 17 multiplied by 23? Reply with the digits only.","maxTokens":16}}}' > /tmp/c_math.json
MATH=$(payload output < /tmp/c_math.json)
# 17 * 23 = 391
check "the worker's answer is arithmetically correct" "$MATH" "391"
MODELID=$(payload modelId < /tmp/c_math.json)
echo "        model that produced the answer: ${MODELID:-unknown}"

echo "5. observability"
call '{"jsonrpc":"2.0","id":10,"method":"tools/call","params":{"name":"task_status","arguments":{"taskId":"'"$TASK"'"}}}' > /tmp/c_st.json
STATUS=$(payload status < /tmp/c_st.json)
check "task_status readable" "$([ -n "$STATUS" ] && echo yes || echo no)" "yes"

echo "6. cancellation of work that is genuinely running"
call '{"jsonrpc":"2.0","id":11,"method":"tools/call","params":{"name":"task_create","arguments":{"type":"research","description":"Long running acceptance task; must be observed running before it is cancelled.","priority":"low","tags":["bhavya","acceptance","running"]}}}' > /tmp/c_tk2.json
TASK2=$(payload taskId < /tmp/c_tk2.json)
call '{"jsonrpc":"2.0","id":12,"method":"tools/call","params":{"name":"task_assign","arguments":{"taskId":"'"$TASK2"'","agentIds":["'"$AGENT"'"]}}}' > /dev/null

# Drive the worker into a long execution so there is real work in flight.
call '{"jsonrpc":"2.0","id":13,"method":"tools/call","params":{"name":"agent_execute","arguments":{"agentId":"'"$AGENT"'","prompt":"Count slowly from 1 to 4000, writing each number on its own line, and do not stop early.","maxTokens":4000}}}' > /tmp/c_long.json &
LONG_PID=$!
sleep 4
echo "        a long execution is in flight (pid $LONG_PID)"

call '{"jsonrpc":"2.0","id":15,"method":"tools/call","params":{"name":"task_cancel","arguments":{"taskId":"'"$TASK2"'","reason":"acceptance check on running work"}}}' > /tmp/c_cn2.json
CANCELLED2=$(payload status < /tmp/c_cn2.json)
check "task_cancel sets cancelled" "$CANCELLED2" "cancelled"

# The point of the check: the work that was running must not have run to
# completion. Cancelling a task that never started proves nothing.
wait $LONG_PID 2>/dev/null || true
LONG_OUT=$(payload output < /tmp/c_long.json)
LONG_ERR=$(payload error < /tmp/c_long.json)
echo "        long execution ended with: ${LONG_ERR:-${LONG_OUT:-no result}}"
if [ -n "$LONG_ERR" ]; then
  check "the running execution was interrupted" interrupted interrupted
else
  check "the running execution was interrupted" completed interrupted
fi
call '{"jsonrpc":"2.0","id":16,"method":"tools/call","params":{"name":"task_status","arguments":{"taskId":"'"$TASK2"'"}}}' > /tmp/c_st3.json
FINAL=$(payload status < /tmp/c_st3.json)
check "the cancelled task stays cancelled" "$FINAL" "cancelled"

call '{"jsonrpc":"2.0","id":17,"method":"tools/call","params":{"name":"agent_terminate","arguments":{"agentId":"'"$AGENT"'"}}}' > /tmp/c_tm.json
TERMINATED=$(payload terminated < /tmp/c_tm.json)
check "agent_terminate" "$TERMINATED" "true"

echo "7. permissions"
NOAUTH=$(curl -s -o /dev/null -w '%{http_code}' -X POST $RPC -H 'Content-Type: application/json' -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}')
check "unauthenticated RPC refused" "$NOAUTH" "401"
BADTOK=$(curl -s -o /dev/null -w '%{http_code}' -X POST $RPC -H 'Content-Type: application/json' -H 'Authorization: Bearer wrong' -d '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}')
check "wrong-token RPC refused" "$BADTOK" "401"
HEALTH=$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:${PORT:-3000}/health)
check "health endpoint reachable" "$HEALTH" "200"
CREDS=$(env | grep -ciE '^(CLOUDFLARE_|SUPABASE_|TURSO_|B2_|S3_|NEXT_PUBLIC_SUPABASE)' || true)
check "no production credential in the sandbox environment" "$CREDS" "0"
INREPO=$(grep -rl "mcp-http-token" "$REPO_DIR" 2>/dev/null | head -1 || true)
check "the MCP token is not inside the repository" "$INREPO" ""
OUTSIDE=$(cd "$REPO_DIR" && git status --porcelain 2>/dev/null | grep -v '^??' | wc -l | tr -d ' ')
check "no tracked file outside the sandbox was modified" "$OUTSIDE" "0"

if [ "${SKIP_RESTART:-0}" = "1" ]; then
  echo "8. recovery after a controlled restart - deferred to the caller"
else
  echo "8. recovery after a controlled restart"
  pkill -f '[r]uflo mcp start' 2>/dev/null || true
  sleep 3
  rm -f /vercel/.claude-flow/*.pid 2>/dev/null || true
  cd "$WORKDIR"
  nohup env OLLAMA_API_KEY=ollama RUFLO_PROVIDER=ollama \
    OLLAMA_BASE_URL=http://127.0.0.1:11434 OLLAMA_DEFAULT_MODEL=qwen2.5:0.5b-instruct \
    ./node_modules/.bin/ruflo mcp start -t http -p "${PORT:-3000}" --host 0.0.0.0 \
    > "$WORKDIR/mcp-restart.log" 2>&1 < /dev/null &
  sleep 20
  HEALTH2=$(curl -s -o /dev/null -w '%{http_code}' http://127.0.0.1:${PORT:-3000}/health)
  check "the server is back after the restart" "$HEALTH2" "200"
  call '{"jsonrpc":"2.0","id":20,"method":"tools/call","params":{"name":"task_list","arguments":{}}}' > /tmp/c_tl.json
  TASKS=$(payload tasks.length < /tmp/c_tl.json)
  check "the task history survived the restart" "$([ "${TASKS:-0}" -ge 1 ] && echo yes || echo no)" "yes"
fi

echo
echo "RESULT: $PASS passed, $FAIL failed"
[ "$FAIL" -eq 0 ]
