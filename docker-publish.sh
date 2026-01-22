#!/bin/bash

# Docker Hub publishing script for Esports Management UI

echo "🐳 Docker Hub Publishing Script"
echo "==============================="

# Configuration
DOCKER_USERNAME=""
IMAGE_NAME="esports-management-ui"
VERSION="latest"

# Function to show usage
show_usage() {
    echo "Usage: $0 [build|push|login|tag] [username] [version]"
    echo ""
    echo "Commands:"
    echo "  login    - Login to Docker Hub"
    echo "  build    - Build the Docker image"
    echo "  tag      - Tag the image for Docker Hub"
    echo "  push     - Push image to Docker Hub"
    echo "  all      - Do everything (build, tag, push)"
    echo ""
    echo "Examples:"
    echo "  $0 login yourusername"
    echo "  $0 build yourusername v1.0.0"
    echo "  $0 push yourusername latest"
    echo "  $0 all yourusername v1.0.0"
    echo ""
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        echo "❌ Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Login to Docker Hub
docker_login() {
    echo "🔐 Logging into Docker Hub..."
    docker login
    if [ $? -eq 0 ]; then
        echo "✅ Successfully logged into Docker Hub"
    else
        echo "❌ Failed to login to Docker Hub"
        exit 1
    fi
}

# Build the Docker image
build_image() {
    local username=$1
    local version=$2
    
    echo "🔨 Building Docker image..."
    docker build -t ${IMAGE_NAME}:${version} .
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully built image: ${IMAGE_NAME}:${version}"
    else
        echo "❌ Failed to build Docker image"
        exit 1
    fi
}

# Tag the image for Docker Hub
tag_image() {
    local username=$1
    local version=$2
    
    echo "🏷️  Tagging image for Docker Hub..."
    docker tag ${IMAGE_NAME}:${version} ${username}/${IMAGE_NAME}:${version}
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully tagged image: ${username}/${IMAGE_NAME}:${version}"
    else
        echo "❌ Failed to tag Docker image"
        exit 1
    fi
}

# Push the image to Docker Hub
push_image() {
    local username=$1
    local version=$2
    
    echo "🚀 Pushing image to Docker Hub..."
    docker push ${username}/${IMAGE_NAME}:${version}
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully pushed image: ${username}/${IMAGE_NAME}:${version}"
        echo "🌐 Image available at: https://hub.docker.com/r/${username}/${IMAGE_NAME}"
    else
        echo "❌ Failed to push Docker image"
        exit 1
    fi
}

# Main script logic
check_docker

# Parse arguments
COMMAND=$1
USERNAME=$2
VERSION=${3:-"latest"}

case "$COMMAND" in
    "login")
        if [ -z "$USERNAME" ]; then
            echo "❌ Username required for login"
            show_usage
            exit 1
        fi
        docker_login
        ;;
    "build")
        if [ -z "$USERNAME" ]; then
            echo "❌ Username required for build"
            show_usage
            exit 1
        fi
        build_image $USERNAME $VERSION
        ;;
    "tag")
        if [ -z "$USERNAME" ]; then
            echo "❌ Username required for tag"
            show_usage
            exit 1
        fi
        tag_image $USERNAME $VERSION
        ;;
    "push")
        if [ -z "$USERNAME" ]; then
            echo "❌ Username required for push"
            show_usage
            exit 1
        fi
        push_image $USERNAME $VERSION
        ;;
    "all")
        if [ -z "$USERNAME" ]; then
            echo "❌ Username required for full publish"
            show_usage
            exit 1
        fi
        echo "🚀 Starting full publish process..."
        build_image $USERNAME $VERSION
        tag_image $USERNAME $VERSION
        push_image $USERNAME $VERSION
        echo "🎉 Publish complete!"
        ;;
    *)
        show_usage
        exit 1
        ;;
esac