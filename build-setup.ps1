$CscPath = "C:\Windows\Microsoft.NET\Framework64\v4.0.30319\csc.exe"
$WorkingDir = "c:\Users\trand\IdeaProjects\Windown"

Write-Host "1. Re-compiling Launcher..." -ForegroundColor Cyan
& $CscPath /target:winexe /r:System.Windows.Forms.dll /r:System.dll /out:"$WorkingDir\XuongCoKhi-v1.0\XuongCoKhi.exe" "C:\Users\trand\.gemini\antigravity-ide\brain\fb724d4d-9b7b-4412-be99-a0a32e5a9b2d\scratch\Launcher.cs"

if ($LASTEXITCODE -ne 0) {
    Write-Error "Loi bien dich Launcher.cs"
    exit $LASTEXITCODE
}

Write-Host "2. Packaging and compiling Setup Installer..." -ForegroundColor Cyan
& $CscPath /target:winexe /r:System.Windows.Forms.dll /r:System.Drawing.dll /r:System.dll /resource:"$WorkingDir\XuongCoKhi-v1.0\XuongCoKhi.exe,XuongCoKhi.exe" /resource:"$WorkingDir\XuongCoKhi-v1.0\app\windown-be-0.0.1-SNAPSHOT.jar,windown-be-0.0.1-SNAPSHOT.jar" /out:"$WorkingDir\ManhNghiaWindow-Setup.exe" "$WorkingDir\Installer.cs"

if ($LASTEXITCODE -ne 0) {
    Write-Error "Loi bien dich Installer.cs"
    exit $LASTEXITCODE
}

Write-Host "============================================="
Write-Host "BUILD SUCCESS: ManhNghiaWindow-Setup.exe"
Write-Host "============================================="
