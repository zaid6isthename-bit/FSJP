@echo off
setlocal
echo ========================================================================
echo   MESHNOTE - Offline Peer-to-Peer Academic Knowledge Network
echo   Your classroom, connected locally.
echo ========================================================================

set ROOT_DIR=%~dp0..
cd /d "%ROOT_DIR%"

if not exist "meshnote.jar" (
    if exist "backend\target\meshnote.jar" (
        copy /Y "backend\target\meshnote.jar" "meshnote.jar"
    ) else (
        echo [INFO] meshnote.jar not found. Running build first...
        call "%ROOT_DIR%\scripts\build.bat"
    )
)

echo [INFO] Starting MESHNOTE Node on http://localhost:8080 ...
echo [INFO] Press Ctrl+C to stop.
echo.

start "" "http://localhost:8080"
java -jar meshnote.jar

endlocal
