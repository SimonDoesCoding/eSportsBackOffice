@echo off
REM Docker run script for Esports Management UI (Windows)

echo 🏆 Esports Management UI Docker Setup
echo ======================================

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker and try again.
    exit /b 1
)

REM Handle command line arguments
if "%1"=="dev" (
    echo 🚀 Starting development server...
    docker-compose -f docker-compose.dev.yml up --build
) else if "%1"=="prod" (
    echo 🏭 Starting production server...
    docker-compose up --build
) else if "%1"=="build" (
    echo 🔨 Building production image...
    docker-compose build
) else if "%1"=="stop" (
    echo 🛑 Stopping containers...
    docker-compose down
    docker-compose -f docker-compose.dev.yml down
) else if "%1"=="clean" (
    echo 🧹 Cleaning up containers and images...
    docker-compose down --rmi all --volumes --remove-orphans
    docker-compose -f docker-compose.dev.yml down --rmi all --volumes --remove-orphans
) else (
    echo Usage: %0 [dev^|prod^|build^|stop^|clean]
    echo.
    echo Commands:
    echo   dev    - Run development server with hot reload
    echo   prod   - Run production build
    echo   build  - Build production Docker image
    echo   stop   - Stop all containers
    echo   clean  - Remove containers and images
    echo.
)