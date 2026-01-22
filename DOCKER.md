# Docker Setup for Esports Management UI

This guide explains how to run the Esports Management UI using Docker.

## Prerequisites

- Docker installed and running
- Docker Compose (usually included with Docker Desktop)

## Quick Start

### Option 1: Using Helper Scripts

**Linux/Mac:**
```bash
# Make script executable
chmod +x docker-run.sh

# Run development server
./docker-run.sh dev

# Run production server
./docker-run.sh prod
```

**Windows:**
```cmd
# Run development server
docker-run.bat dev

# Run production server
docker-run.bat prod
```

### Option 2: Using Docker Compose Directly

**Development (with hot reload):**
```bash
docker-compose -f docker-compose.dev.yml up --build
```

**Production:**
```bash
docker-compose up --build
```

## Available Commands

| Command | Description |
|---------|-------------|
| `dev` | Run development server with hot reload |
| `prod` | Run production build |
| `build` | Build production Docker image only |
| `stop` | Stop all running containers |
| `clean` | Remove containers and images |

## Accessing the Application

Once running, the application will be available at:
- **http://localhost:3000**

## Environment Variables

The following environment variables are configured:

- `NEXT_PUBLIC_API_BASE_URL`: API endpoint (default: https://api.sitechesports.com/api)
- `NEXT_PUBLIC_APP_NAME`: Application name
- `NODE_ENV`: Environment mode (development/production)

## Docker Images

### Production Image
- Multi-stage build for optimized size
- Uses Node.js 18 Alpine Linux
- Runs as non-root user for security
- Standalone Next.js output

### Development Image
- Single-stage build with all dependencies
- Volume mounting for hot reload
- Includes development tools

## Troubleshooting

### Port Already in Use
If port 3000 is already in use, you can change it in the docker-compose files:
```yaml
ports:
  - "3001:3000"  # Use port 3001 instead
```

### Docker Not Running
Make sure Docker Desktop is running before executing commands.

### Build Issues
If you encounter build issues, try cleaning up:
```bash
# Using helper script
./docker-run.sh clean

# Or manually
docker system prune -a
```

## File Structure

```
├── Dockerfile              # Production build
├── Dockerfile.dev          # Development build
├── docker-compose.yml      # Production compose
├── docker-compose.dev.yml  # Development compose
├── .dockerignore           # Files to exclude from build
├── docker-run.sh           # Helper script (Linux/Mac)
├── docker-run.bat          # Helper script (Windows)
└── DOCKER.md              # This file
```

## Publishing to Docker Hub

### Manual Publishing

**Linux/Mac:**
```bash
# Make script executable
chmod +x docker-publish.sh

# Login to Docker Hub
./docker-publish.sh login yourusername

# Build, tag, and push in one command
./docker-publish.sh all yourusername v1.0.0
```

**Windows:**
```cmd
# Login to Docker Hub
docker-publish.bat login yourusername

# Build, tag, and push in one command
docker-publish.bat all yourusername v1.0.0
```

### Individual Steps

1. **Login to Docker Hub:**
   ```bash
   docker login
   ```

2. **Build the image:**
   ```bash
   docker build -t esports-management-ui:latest .
   ```

3. **Tag for Docker Hub:**
   ```bash
   docker tag esports-management-ui:latest yourusername/esports-management-ui:latest
   ```

4. **Push to Docker Hub:**
   ```bash
   docker push yourusername/esports-management-ui:latest
   ```

### Automated Publishing with GitHub Actions

The repository includes a GitHub Actions workflow that automatically:
- Builds the Docker image on every push to main/master
- Pushes to Docker Hub with proper versioning
- Supports multi-platform builds (AMD64 and ARM64)

**Setup:**
1. Add these secrets to your GitHub repository:
   - `DOCKER_USERNAME`: Your Docker Hub username
   - `DOCKER_PASSWORD`: Your Docker Hub password or access token

2. Push to main branch or create a tag:
   ```bash
   git tag v1.0.0
   git push origin v1.0.0
   ```

### Using Published Image

Once published, anyone can run your image:
```bash
docker run -p 3000:3000 yourusername/esports-management-ui:latest
```

Or with docker-compose:
```yaml
version: '3.8'
services:
  esports-ui:
    image: yourusername/esports-management-ui:latest
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_BASE_URL=https://api.sitechesports.com/api
```

## Production Deployment

For production deployment, you can:

1. **Build and run locally:**
   ```bash
   docker-compose up --build -d
   ```

2. **Push to registry:**
   ```bash
   docker build -t your-registry/esports-ui:latest .
   docker push your-registry/esports-ui:latest
   ```

3. **Deploy to cloud platforms** (AWS ECS, Google Cloud Run, etc.)

## Security Notes

- Production container runs as non-root user
- Only necessary files are copied to container
- Environment variables are used for configuration
- No sensitive data is baked into the image