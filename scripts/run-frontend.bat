@echo off
setlocal
echo ========================================================================
echo   MESHNOTE - Starting React Frontend Development Server (Vite)
echo ========================================================================

set ROOT_DIR=%~dp0..
cd /d "%ROOT_DIR%\frontend"

call npm run dev
endlocal
