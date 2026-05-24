Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "Starting Busbooking Frontend (React + Vite only)" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Set-Location -Path "$PSScriptRoot\..\frontend"
npm run dev
