# ============================================================
# Bhavya OS — Platform Startup Script
# Boots the AI Gateway and connects Claude Code to it.
# Run from the repo root: .\scripts\start-platform.ps1
# ============================================================

$ErrorActionPreference = "Stop"
$repoRoot = Split-Path -Parent $PSScriptRoot
$gatewayDir = Join-Path $repoRoot "https-github.com-Alishahryar1-free-claude-code"
$gatewayPort = 8082
$gatewayUrl  = "http://localhost:$gatewayPort"

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Bhavya OS — Platform Integration Boot" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# ── Step 1: Check AI Gateway already running ─────────────────
Write-Host "[1/4] Checking AI Gateway..." -ForegroundColor Yellow
try {
    $resp = Invoke-RestMethod -Uri "$gatewayUrl/health" -TimeoutSec 2
    if ($resp.status -eq "healthy") {
        Write-Host "      ✓ AI Gateway already running at $gatewayUrl" -ForegroundColor Green
        $gatewayRunning = $true
    }
} catch {
    $gatewayRunning = $false
}

# ── Step 2: Start AI Gateway if not running ──────────────────
if (-not $gatewayRunning) {
    Write-Host "[1/4] Starting AI Gateway on port $gatewayPort..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList `
        "-NoExit -Command `"cd '$gatewayDir'; python -m uvicorn server:app --host 0.0.0.0 --port $gatewayPort`"" `
        -WindowStyle Normal
    Write-Host "      Waiting for gateway to start..." -ForegroundColor DarkGray
    Start-Sleep -Seconds 4
    try {
        $resp = Invoke-RestMethod -Uri "$gatewayUrl/health" -TimeoutSec 5
        Write-Host "      ✓ AI Gateway started at $gatewayUrl" -ForegroundColor Green
    } catch {
        Write-Host "      ✗ Gateway did not start. Check the gateway window." -ForegroundColor Red
        exit 1
    }
}

# ── Step 3: Set Claude Code environment variables ───────────
Write-Host "[2/4] Connecting Claude Code → AI Gateway..." -ForegroundColor Yellow
$env:ANTHROPIC_BASE_URL = $gatewayUrl
$env:ANTHROPIC_AUTH_TOKEN = "freecc"
Write-Host "      ✓ ANTHROPIC_BASE_URL=$gatewayUrl" -ForegroundColor Green
Write-Host "      ✓ ANTHROPIC_AUTH_TOKEN=freecc" -ForegroundColor Green

# ── Step 4: Verify AI Gateway Models Endpoint ───────────────
Write-Host "[3/4] Verifying AI Gateway models endpoint..." -ForegroundColor Yellow
try {
    $models = Invoke-RestMethod -Uri "$gatewayUrl/v1/models" -TimeoutSec 5
    $modelCount = $models.data.Count
    Write-Host "      ✓ $modelCount Claude models registered via Gateway" -ForegroundColor Green
} catch {
    Write-Host "      ✗ Could not reach /v1/models — check gateway logs." -ForegroundColor Red
}

# ── Step 5: Set OpenHuman workspace ─────────────────────────
Write-Host "[4/4] Configuring OpenHuman Workspace..." -ForegroundColor Yellow
$env:OPENHUMAN_WORKSPACE = $repoRoot
Write-Host "      ✓ OPENHUMAN_WORKSPACE=$repoRoot" -ForegroundColor Green

# ── Summary ─────────────────────────────────────────────────
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Bhavya OS Platform — READY" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  AI Gateway:    $gatewayUrl" -ForegroundColor White
Write-Host "  Claude Code:   Run 'claude' in any terminal" -ForegroundColor White
Write-Host "  OpenHuman:     Workspace = $repoRoot" -ForegroundColor White
Write-Host "  Dashboard:     http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "  To launch Claude Code now:" -ForegroundColor DarkGray
Write-Host "  `$env:ANTHROPIC_BASE_URL='$gatewayUrl'; claude" -ForegroundColor DarkGray
Write-Host ""
