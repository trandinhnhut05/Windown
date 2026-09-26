$env:JAVA_HOME = "C:\Program Files\Microsoft\jdk-17.0.20.101-hotspot"
$env:PATH = "$env:JAVA_HOME\bin;C:\tools\apache-maven-3.9.6\bin;" + $env:PATH

Write-Host "Starting Windown Backend..." -ForegroundColor Cyan
Write-Host "Maven: $(mvn --version | Select-String 'Apache Maven')" -ForegroundColor Gray
Write-Host "Java: $(java --version 2>&1 | Select-Object -First 1)" -ForegroundColor Gray
Write-Host ""
Write-Host "Backend running at: http://localhost:8080" -ForegroundColor Green
Write-Host "Swagger UI: http://localhost:8080/swagger-ui.html" -ForegroundColor Green
Write-Host ""

Set-Location $PSScriptRoot\BE
mvn spring-boot:run
