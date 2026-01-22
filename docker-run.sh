#!/bin/bash

# Docker run script for Esports Management UI

echo "🏆 Esports Management UI Docker Setup"
echo "======================================"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Function to show usage
show_usage() {
    echo "Usage: $0 [dev|prod|build|stop|clean]"
    echo ""
    echo "Commands:"
    echo "  dev    - Run development server with hot reload"
    echo "  prod   - Run production build"
    echo "  build  - Build production Docker image"
    echo "  stop   - Stop all containers"
    echo "  clean  - Remove containers and images"
    echo ""
}

# Handle command line arguments
case "$1" in
    "dev")
        echo "🚀 Starting development server..."
        docker-compose -f docker-compose.dev.yml up --build
        ;;
    "prod")
        echo "🏭 Starting production server..."
        docker-compose up --build
        ;;
    "build")
        echo "🔨 Building production image..."
        docker-compose build
        ;;
    "stop")
        echo "🛑 Stopping containers..."
        docker-compose down
        docker-compose -f docker-compose.dev.yml down
        ;;
    "clean")
        echo "🧹 Cleaning up containers and images..."
        docker-compose down --rmi all --volumes --remove-orphans
        docker-compose -f docker-compose.dev.yml down --rmi all --volumes --remove-orphans
        ;;
    *)
        show_usage
        exit 1
        ;;
esac