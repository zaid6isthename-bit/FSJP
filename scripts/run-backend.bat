@echo off
setlocal
echo ========================================================================
echo   MESHNOTE - Starting Spring Boot Local Java Node (:8080)
echo ========================================================================

set ROOT_DIR=%~dp0..
cd /d "%ROOT_DIR%"

set MVN_CMD="%ROOT_DIR%\.tools\apache-maven-3.9.6\bin\mvn.cmd"
if not exist %MVN_CMD% (
    set MVN_CMD=mvn
)

call %MVN_CMD% spring-boot:run -f backend/pom.xml
endlocal
