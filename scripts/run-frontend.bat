@echo off
setlocal
echo ========================================================================
echo   JVM VISION - Starting Vite Dev Server (:5173)
echo ========================================================================
cd /d "%~dp0..\frontend"
call npm run dev
endlocal
