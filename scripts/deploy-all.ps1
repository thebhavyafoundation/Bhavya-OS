# Bhavya Foundation - Deploy All Apps to Vercel
# Usage: .\scripts\deploy-all.ps1

$apps = @(
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

$rootDir = "F:\Bhavya Foundation"
$vercelJson = "$rootDir\vercel.json"

foreach ($appInfo in $apps) {
    $name = $appInfo.Name
    $package = $appInfo.Package

    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "Deploying: $name" -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan

    # Update root vercel.json
    $config = @"
{
  "`$schema": "https://openapi.vercel.sh/vercel.json",
  "installCommand": "pnpm install --no-frozen-lockfile",
  "buildCommand": "node scripts/vercel-build-app.mjs $name",
  "framework": "nextjs",
  "outputDirectory": "apps/$name/.next"
}
"@
    Set-Content -Path $vercelJson -Value $config

    # Remove old .vercel link
    Remove-Item -Recurse -Force "$rootDir\.vercel" -ErrorAction SilentlyContinue

    # Link and deploy
    Push-Location $rootDir
    vercel link --yes --project $name --scope bhavya-foundation 2>&1 | Out-Null
    vercel --prod --yes 2>&1
    Pop-Location

    Write-Host "✓ $name deployed" -ForegroundColor Green
    Start-Sleep -Seconds 5
}

Write-Host ""
Write-Host "All apps deployed!" -ForegroundColor Green
