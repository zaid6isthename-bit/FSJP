@echo off
setlocal
echo ========================================================================
echo   JVM VISION - Interactive Java Runtime Visualization Platform
echo   See what your Java program actually does.
echo ========================================================================

set ROOT_DIR=%~dp0..
cd /d "%ROOT_DIR%"

if not exist "jvm-vision.jar" (
    if exist "backend\target\jvm-vision.jar" (
        copy /Y "backend\target\jvm-vision.jar" "jvm-vision.jar"
    ) else (
        echo [INFO] jvm-vision.jar not found. Running build first...
        call "%ROOT_DIR%\scripts\build.bat"
    )
)

echo [INFO] Starting JVM VISION on http://localhost:8080 ...
echo [INFO] Press Ctrl+C to stop.
echo.

start "" "http://localhost:8080"
java -jar jvm-vision.jar

endlocal
