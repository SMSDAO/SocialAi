# SocialAi Bootstrap Script
# Run this script from the repository root to set up and start the project locally.
#   .\bootstrap.ps1

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'
Set-Location -Path $PSScriptRoot

Write-Host "=== SocialAi Bootstrap ===" -ForegroundColor Cyan

# 1. Install all workspace dependencies
Write-Host "`n[1/3] Installing dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "npm install failed, retrying with --legacy-peer-deps..." -ForegroundColor Yellow
    npm install --legacy-peer-deps
    if ($LASTEXITCODE -ne 0) {
        Write-Host "npm install failed even with --legacy-peer-deps. Aborting." -ForegroundColor Red
        exit $LASTEXITCODE
    }
}
Write-Host "Dependencies installed." -ForegroundColor Green

# 2. Initialise the database (requires a running PostgreSQL instance and psql on PATH)
Write-Host "`n[2/3] Initialising database..." -ForegroundColor Yellow
if (Get-Command psql -ErrorAction SilentlyContinue) {
    npm run db:init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "db:init failed. Aborting." -ForegroundColor Red
        exit $LASTEXITCODE
    }
    Write-Host "Database initialised." -ForegroundColor Green
} else {
    Write-Host "psql not found – skipping db:init. Install PostgreSQL and re-run, or run 'npm run db:init' manually." -ForegroundColor Yellow
}

# 3. Start all applications concurrently
Write-Host "`n[3/3] Starting applications..." -ForegroundColor Yellow
Write-Host "  - Public frontend  : http://localhost:4321" -ForegroundColor Cyan
Write-Host "  - Admin dashboard  : http://localhost:4200" -ForegroundColor Cyan
Write-Host "  - API / Node server: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""

# Run each app in its own PowerShell window so they all stay visible
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'Set-Location apps/public; npm run dev'
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'Set-Location apps/admin; npm start'
Start-Process powershell -ArgumentList '-NoExit', '-Command', 'node node/socialai.node.js'

Write-Host "All applications started. Close the individual windows to stop them." -ForegroundColor Green
