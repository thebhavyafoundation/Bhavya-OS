# Bhavya Foundation - Deploy All Apps to Vercel (PowerShell)
# Usage: .\scripts\deploy-vercel-all.ps1
# Or single app: .\scripts\deploy-vercel-all.ps1 -App knowledge

param(
    [string]$App
)

$apps = @(
    @{ Name = "knowledge"; Package = "knowledge" },
    @{ Name = "dashboard"; Package = "dashboard" },
    @{ Name = "forest"; Package = "forest" },
    @{ Name = "heritage"; Package = "heritage" },
    @{ Name = "research"; Package = "research" },
    @{ Name = "volunteer"; Package = "volunteer" },
    @{ Name = "library"; Package = "library" },
    @{ Name = "admin"; Package = "admin-app" },
    @{ Name = "docs"; Package = "docs-app" },
    @{ Name = "transparency"; Package = "transparency" },
    @{ Name = "design-system"; Package = "design-system" }
)

$rootDir = Split-Path $PSScriptRoot -Parent
$vercelJson = Join-Path $rootDir "vercel.json"
$originalContent = Get-Content $vercelJson -Raw

function Deploy-App {
    param($appInfo)

    $name = $appInfo.Name
    $package = $appInfo.Package

    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "Deploying: $name" -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan

    # Update root vercel.json
    $config = @{
        '$schema' = 'https://openapi.vercel.sh/vercel.json'
        installCommand = 'pnpm install --no-frozen-lockfile'
        buildCommand = "node scripts/vercel-build-app.mjs $name"
        framework = 'nextjs'
        outputDirectory = "apps/$name/.next"
    } | ConvertTo-Json -Depth 3

    Set-Content -Path $vercelJson -Value $config

    # Deploy
    Push-Location $rootDir
    try {
        vercel --prod --yes
        Write-Host "✓ $name deployed successfully" -ForegroundColor Green
    } catch {
        Write-Host "✗ $name deployment failed: $_" -ForegroundColor Red
    }
    Pop-Location
}

if ($App) {
    $appInfo = $apps | Where-Object { $_.Name -eq $App }
    if ($appInfo) {
        Deploy-App $appInfo
    } else {
        Write-Host "Unknown app: $App" -ForegroundColor Red
        Write-Host "Available apps: $($apps.Name -join ', ')"
    }
} else {
    foreach ($appInfo in $apps) {
        Deploy-App $appInfo
    }
}

# Restore original vercel.json
Set-Content -Path $vercelJson -Value $originalContent
Write-Host ""
Write-Host "Root vercel.json restored." -ForegroundColor Yellow
