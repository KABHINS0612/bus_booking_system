Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "Starting Spring Boot Backend only (Port 3001)" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Set-Location -Path "$PSScriptRoot\..\frontend"
npm run dev:server
