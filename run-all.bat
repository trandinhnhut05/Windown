@echo off
title He Thong Manh Nghia 2 - Khoi dong tat ca dich vu
chcp 65001 >nul
echo =========================================================================
echo    DANG KHOI DONG HE THONG MANHNGHIA2.VN
echo    1. Web Khach hang : https://manhnghia2.vn
echo    2. Trang Quan tri : https://manhnghia2.vn/admin
echo    3. API Backend    : https://api.manhnghia2.vn
echo =========================================================================
echo.

echo [1/4] Dang khoi dong Cloudflare Tunnel...
start "1. Cloudflare Tunnel" cmd /k "C:\Users\dinhn\cloudflared\cloudflared.exe tunnel --config C:\Users\dinhn\.cloudflared\config.yml run manhnghia2-tunnel"

timeout /t 2 >nul
echo [2/4] Dang khoi dong Web Co Khi (Port 3000)...
start "2. Web Co Khi" cmd /k "cd /d c:\Users\dinhn\.gemini\antigravity-ide\scratch\Windown\web_cokhi && node server.js"

timeout /t 2 >nul
echo [3/4] Dang khoi dong Admin Frontend (Port 5173)...
start "3. Admin Frontend" cmd /k "cd /d c:\Users\dinhn\.gemini\antigravity-ide\scratch\Windown\admin\FE && npm.cmd run dev"

timeout /t 2 >nul
echo [4/4] Dang khoi dong Admin Backend Spring Boot (Port 8080)...
start "4. Admin Backend" powershell -NoExit -ExecutionPolicy Bypass -File "c:\Users\dinhn\.gemini\antigravity-ide\scratch\Windown\admin\run-be.ps1"

echo.
echo =========================================================================
echo   HOAN TAT! Ban co the truy cap ngay:
echo   - https://manhnghia2.vn
echo   - https://manhnghia2.vn/admin
echo =========================================================================
echo Dung dong cac cua so dang chay ngam nhe!
pause
