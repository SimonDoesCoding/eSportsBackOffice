# Docker Hub Publishing Guide

## Quick Start

### 1. Prerequisites
- Docker Hub account (create at https://hub.docker.com)
- Docker installed and running locally
- Node.js 20.9.0 or higher (required for Next.js)

### 2. One-Command Publishing (Windows)
```cmd
docker-publish.bat all yourusername v1.0.0
```

Replace `yourusername` with your Docker Hub username.

### 3. Using the Published Image
```bash
docker run -p 3000:3000 yourusername/esports-management-ui:latest
```

## Step-by-Step Process

### Step 1: Create Docker Hub Account
1. Go to https://hub.docker.com
2. Sign up for a free account
3. Verify your email address

### Step 2: Login Locally
```cmd
docker-publish.bat login yourusername
```
Enter your Docker Hub password when prompted.

### Step 3: Build and Push
```cmd
docker-publish.bat all yourusername latest
```

This will:
- ✅ Build the Docker image
- ✅ Tag it for Docker Hub
- ✅ Push it to your repository

### Step 4: Verify Upload
1. Go to https://hub.docker.com/r/yourusername/esports-management-ui
2. You should see your image listed

## Available Commands

| Command | Description | Example |
|---------|-------------|---------|
| `login` | Login to Docker Hub | `docker-publish.bat login yourusername` |
| `build` | Build the image | `docker-publish.bat build yourusername v1.0.0` |
| `tag` | Tag for Docker Hub | `docker-publish.bat tag yourusername v1.0.0` |
| `push` | Push to Docker Hub | `docker-publish.bat push yourusername v1.0.0` |
| `all` | Do everything | `docker-publish.bat all yourusername v1.0.0` |

## Version Tags

You can use different version tags:
- `latest` - Most recent version
- `v1.0.0` - Specific version
- `main` - Main branch build

Examples:
```cmd
docker-publish.bat all yourusername latest
docker-publish.bat all yourusername v1.0.0
docker-publish.bat all yourusername main
```

## Using Your Published Image

### Option 1: Direct Docker Run
```bash
docker run -p 3000:3000 -e NEXT_PUBLIC_API_BASE_URL=https://api.sitechesports.com/api yourusername/esports-management-ui:latest
```

### Option 2: Docker Compose
1. Edit `docker-compose.hub.yml`
2. Replace `yourusername` with your actual username
3. Run:
   ```bash
   docker-compose -f docker-compose.hub.yml up
   ```

### Option 3: In Production
```yaml
version: '3.8'
services:
  esports-ui:
    image: yourusername/esports-management-ui:latest
    ports:
      - "80:3000"
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_BASE_URL=https://api.sitechesports.com/api
    restart: always
```

## Automated Publishing (GitHub Actions)

If you push this code to GitHub:

1. **Add Secrets to GitHub:**
   - Go to your repo → Settings → Secrets and variables → Actions
   - Add `DOCKER_USERNAME` (your Docker Hub username)
   - Add `DOCKER_PASSWORD` (your Docker Hub password)

2. **Automatic Publishing:**
   - Push to main branch → builds `latest` tag
   - Create git tag `v1.0.0` → builds `v1.0.0` tag

## Troubleshooting

### "Access Denied" Error
- Make sure you're logged in: `docker login`
- Check your username is correct
- Verify your password/token

### "Repository Not Found"
- The repository is created automatically on first push
- Make sure the username in the image name matches your Docker Hub username

### Build Fails
- Check Docker is running
- Ensure you're in the project root directory
- Try: `docker system prune -a` to clean up

## Security Notes

- Use Docker Hub access tokens instead of passwords for better security
- Never commit Docker Hub credentials to your repository
- Use GitHub Secrets for automated publishing

## Next Steps

After publishing, you can:
1. Share the image with others
2. Deploy to cloud platforms (AWS, Google Cloud, Azure)
3. Use in CI/CD pipelines
4. Set up automated builds on Docker Hub