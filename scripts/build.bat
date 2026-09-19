@echo off
setlocal
echo ========================================================================
echo   JVM VISION - Automated Full-Stack Build Pipeline
echo   Interactive Java Runtime Visualization & Failure Analysis Platform
echo ========================================================================

set SCRIPT_DIR=%~dp0
set ROOT_DIR=%SCRIPT_DIR%..
cd /d "%ROOT_DIR%"

echo [1/3] Building React Frontend with Vite...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo [ERROR] Frontend build failed!
    exit /b %errorlevel%
)
cd ..

echo [2/3] Copying Frontend Assets to Spring Boot static resources...
if not exist "backend\src\main\resources\static" mkdir "backend\src\main\resources\static"
xcopy /E /Y /I "frontend\dist\*" "backend\src\main\resources\static\"

echo [3/3] Compiling and Packaging Spring Boot JAR with Maven...
set MVN_CMD="%ROOT_DIR%\.tools\apache-maven-3.9.6\bin\mvn.cmd"
if not exist %MVN_CMD% (
    set MVN_CMD=mvn
)

call %MVN_CMD% clean package -f backend/pom.xml
if %errorlevel% neq 0 (
    echo [ERROR] Backend packaging failed!
    exit /b %errorlevel%
)

copy /Y "backend\target\jvm-vision.jar" "jvm-vision.jar"

echo ========================================================================
echo   BUILD SUCCESSFUL!
echo   Single runnable JAR created at: jvm-vision.jar
echo   To run: java -jar jvm-vision.jar
echo   Then open: http://localhost:8080
echo ========================================================================
endlocal
