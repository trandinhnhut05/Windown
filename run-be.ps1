#!/usr/bin/env pwsh
# Script khởi chạy BE Windown
# Sử dụng: .\run-be.ps1

$env:PATH += ";C:\tools\apache-maven-3.9.6\bin"
$env:JAVA_HOME = "C:\Java"

Write-Host "🚀 Khởi chạy Windown Backend..." -ForegroundColor Cyan
Write-Host "📦 Maven: $(mvn --version | Select-String 'Apache Maven')" -ForegroundColor Gray
Write-Host "☕ Java: $(java --version 2>&1 | Select-Object -First 1)" -ForegroundColor Gray
Write-Host ""
Write-Host "🔗 Backend sẽ chạy tại: http://localhost:8080" -ForegroundColor Green
Write-Host "📚 Swagger UI (nếu có): http://localhost:8080/swagger-ui.html" -ForegroundColor Green
Write-Host ""

Set-Location $PSScriptRoot\BE
mvn spring-boot:run
