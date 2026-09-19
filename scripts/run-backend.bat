@echo off
setlocal
echo ========================================================================
echo   JVM VISION - Starting Spring Boot Backend (:8080)
echo ========================================================================
cd /d "%~dp0..\backend"
set MVN_CMD="%~dp0..\.tools\apache-maven-3.9.6\bin\mvn.cmd"
if not exist %MVN_CMD% (
    set MVN_CMD=mvn
)
call %MVN_CMD% spring-boot:run
endlocal
