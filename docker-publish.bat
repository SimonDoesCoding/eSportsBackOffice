@echo off
REM Docker Hub publishing script for Esports Management UI (Windows)

echo 🐳 Docker Hub Publishing Script
echo ===============================

REM Configuration
set IMAGE_NAME=esports-management-ui
set VERSION=latest

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker and try again.
    exit /b 1
)

REM Parse arguments
set COMMAND=%1
set USERNAME=%2
if "%3"=="" (
    set VERSION=latest
) else (
    set VERSION=%3
)

REM Handle commands
if "%COMMAND%"=="login" (
    if "%USERNAME%"=="" (
        echo ❌ Username required for login
        goto show_usage
    )
    echo 🔐 Logging into Docker Hub...
    docker login
    if %errorlevel% equ 0 (
        echo ✅ Successfully logged into Docker Hub
    ) else (
        echo ❌ Failed to login to Docker Hub
        exit /b 1
    )
) else if "%COMMAND%"=="build" (
    if "%USERNAME%"=="" (
        echo ❌ Username required for build
        goto show_usage
    )
    echo 🔨 Building Docker image...
    docker build -t %IMAGE_NAME%:%VERSION% .
    if %errorlevel% equ 0 (
        echo ✅ Successfully built image: %IMAGE_NAME%:%VERSION%
    ) else (
        echo ❌ Failed to build Docker image
        exit /b 1
    )
) else if "%COMMAND%"=="tag" (
    if "%USERNAME%"=="" (
        echo ❌ Username required for tag
        goto show_usage
    )
    echo 🏷️  Tagging image for Docker Hub...
    docker tag %IMAGE_NAME%:%VERSION% %USERNAME%/%IMAGE_NAME%:%VERSION%
    if %errorlevel% equ 0 (
        echo ✅ Successfully tagged image: %USERNAME%/%IMAGE_NAME%:%VERSION%
    ) else (
        echo ❌ Failed to tag Docker image
        exit /b 1
    )
) else if "%COMMAND%"=="push" (
    if "%USERNAME%"=="" (
        echo ❌ Username required for push
        goto show_usage
    )
    echo 🚀 Pushing image to Docker Hub...
    docker push %USERNAME%/%IMAGE_NAME%:%VERSION%
    if %errorlevel% equ 0 (
        echo ✅ Successfully pushed image: %USERNAME%/%IMAGE_NAME%:%VERSION%
        echo 🌐 Image available at: https://hub.docker.com/r/%USERNAME%/%IMAGE_NAME%
    ) else (
        echo ❌ Failed to push Docker image
        exit /b 1
    )
) else if "%COMMAND%"=="all" (
    if "%USERNAME%"=="" (
        echo ❌ Username required for full publish
        goto show_usage
    )
    echo 🚀 Starting full publish process...
    
    echo 🔨 Building Docker image...
    docker build -t %IMAGE_NAME%:%VERSION% .
    if %errorlevel% neq 0 (
        echo ❌ Failed to build Docker image
        exit /b 1
    )
    
    echo 🏷️  Tagging image for Docker Hub...
    docker tag %IMAGE_NAME%:%VERSION% %USERNAME%/%IMAGE_NAME%:%VERSION%
    if %errorlevel% neq 0 (
        echo ❌ Failed to tag Docker image
        exit /b 1
    )
    
    echo 🚀 Pushing image to Docker Hub...
    docker push %USERNAME%/%IMAGE_NAME%:%VERSION%
    if %errorlevel% neq 0 (
        echo ❌ Failed to push Docker image
        exit /b 1
    )
    
    echo 🎉 Publish complete!
    echo 🌐 Image available at: https://hub.docker.com/r/%USERNAME%/%IMAGE_NAME%
) else (
    goto show_usage
)

goto end

:show_usage
echo Usage: %0 [build^|push^|login^|tag^|all] [username] [version]
echo.
echo Commands:
echo   login    - Login to Docker Hub
echo   build    - Build the Docker image
echo   tag      - Tag the image for Docker Hub
echo   push     - Push image to Docker Hub
echo   all      - Do everything (build, tag, push)
echo.
echo Examples:
echo   %0 login yourusername
echo   %0 build yourusername v1.0.0
echo   %0 push yourusername latest
echo   %0 all yourusername v1.0.0
echo.

:end