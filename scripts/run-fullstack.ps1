Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "Starting Busbooking Dev Mode (Vite + Spring Boot)" -ForegroundColor Cyan
Write-Host "=======================================================" -ForegroundColor Cyan
Set-Location -Path "$PSScriptRoot\..\frontend"
npm run dev:full
