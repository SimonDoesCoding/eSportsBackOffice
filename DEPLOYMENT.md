# Deployment Guide - Esports Management UI

This guide covers deploying the Esports Management UI with Auth0 authentication.

## Prerequisites

- Docker and Docker Compose installed
- Auth0 account configured (see AUTH0_SETUP.md)
- Access to your production server

## Environment Variables

The application requires the following environment variables:

### Auth0 Configuration
```bash
AUTH0_SECRET=<64-character-hex-string>
AUTH0_BASE_URL=https://backoffice.sitechesports.com
AUTH0_ISSUER_BASE_URL=https://dev-h624znvggxq2nsnp.us.auth0.com
AUTH0_CLIENT_ID=e7SLxsiyqgFmWhW0f1vbyxvbkfwNneB
AUTH0_CLIENT_SECRET=<your-auth0-client-secret>
```

### API Configuration
```bash
NEXT_PUBLIC_API_BASE_URL=https://localhost:7173/api
NEXT_PUBLIC_APP_NAME=Esports Management UI
```

## Local Development

1. Install dependencies:
```bash
npm install
```

2. Create `.env.local` file with your credentials (already created)

3. Start development server:
```bash
npm run dev
```

4. Visit `http://localhost:3000` - you'll be redirected to Auth0 login

## Docker Development

Run with hot reload:

```bash
docker-compose -f docker-compose.dev.yml up --build
```

Make sure to set environment variables in your shell or create a `.env` file:

```bash
export AUTH0_SECRET="your-secret"
export AUTH0_CLIENT_ID="e7SLxsiyqgFmWhW0f1vbyxvbkfwNneB"
export AUTH0_CLIENT_SECRET="your-client-secret"
```

## Production Deployment

### Option 1: Docker Compose

1. Create a `.env` file in your production server:

```bash
# .env
AUTH0_SECRET=a7f3e9d2c8b5a1f4e6d9c2b8a5f1e4d7c9b6a3f2e5d8c1b4a7f3e9d2c8b5a1f4
AUTH0_BASE_URL=https://backoffice.sitechesports.com
AUTH0_ISSUER_BASE_URL=https://dev-h624znvggxq2nsnp.us.auth0.com
AUTH0_CLIENT_ID=e7SLxsiyqgFmWhW0f1vbyxvbkfwNneB
AUTH0_CLIENT_SECRET=mVYwAs6Us2dzjpt1yBHsSpaEqECeQlA_mPew-_D58FkjNVBuy7DxSOWAyMcPStqB
NEXT_PUBLIC_API_BASE_URL=https://localhost:7173/api
```

2. Deploy with Docker Compose:

```bash
docker-compose up -d --build
```

3. Check logs:

```bash
docker logs esports-management-ui
```

### Option 2: Docker Hub

Pull and run the latest image:

```bash
docker pull simonaspinall/esports-back-office:latest

docker run -d \
  --name esports-ui \
  -p 3000:3000 \
  -e AUTH0_SECRET="a7f3e9d2c8b5a1f4e6d9c2b8a5f1e4d7c9b6a3f2e5d8c1b4a7f3e9d2c8b5a1f4" \
  -e AUTH0_BASE_URL="https://backoffice.sitechesports.com" \
  -e AUTH0_ISSUER_BASE_URL="https://dev-h624znvggxq2nsnp.us.auth0.com" \
  -e AUTH0_CLIENT_ID="e7SLxsiyqgFmWhW0f1vbyxvbkfwNneB" \
  -e AUTH0_CLIENT_SECRET="mVYwAs6Us2dzjpt1yBHsSpaEqECeQlA_mPew-_D58FkjNVBuy7DxSOWAyMcPStqB" \
  -e NEXT_PUBLIC_API_BASE_URL="https://localhost:7173/api" \
  --restart unless-stopped \
  simonaspinall/esports-back-office:latest
```

## CircleCI Deployment

The CircleCI pipeline automatically builds and pushes to Docker Hub on commits to `main` or `development` branches.

### Required CircleCI Environment Variables

Set these in CircleCI Project Settings → Environment Variables:

```
DOCKERHUB_USERNAME=simonaspinall
DOCKERHUB_TOKEN=<your-docker-hub-token>
GITHUB_TOKEN=<your-github-token>
GITHUB_PROJECT=<your-repo-name>
AUTH0_SECRET=a7f3e9d2c8b5a1f4e6d9c2b8a5f1e4d7c9b6a3f2e5d8c1b4a7f3e9d2c8b5a1f4
AUTH0_BASE_URL=https://backoffice.sitechesports.com
AUTH0_ISSUER_BASE_URL=https://dev-h624znvggxq2nsnp.us.auth0.com
AUTH0_CLIENT_ID=e7SLxsiyqgFmWhW0f1vbyxvbkfwNneB
AUTH0_CLIENT_SECRET=mVYwAs6Us2dzjpt1yBHsSpaEqECeQlA_mPew-_D58FkjNVBuy7DxSOWAyMcPStqB
NEXT_PUBLIC_API_BASE_URL=https://localhost:7173/api
```

## Auth0 Configuration Checklist

Ensure these are configured in your Auth0 application:

- ✅ **Allowed Callback URLs**: `https://backoffice.sitechesports.com/api/auth/callback`
- ✅ **Allowed Logout URLs**: `https://backoffice.sitechesports.com`
- ✅ **Allowed Web Origins**: `https://backoffice.sitechesports.com`

## Reverse Proxy Configuration

If using Nginx or similar, ensure you're forwarding the correct headers:

```nginx
location / {
    proxy_pass http://localhost:3000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
}
```

## SSL/TLS Configuration

Ensure your domain has a valid SSL certificate. For Let's Encrypt:

```bash
certbot --nginx -d backoffice.sitechesports.com
```

## Health Check

The application includes a health check endpoint:

```bash
curl https://backoffice.sitechesports.com/api/health
```

## Troubleshooting

### "Invalid state" error
- Clear browser cookies
- Verify callback URLs in Auth0 match exactly
- Check `AUTH0_BASE_URL` matches your domain

### Container won't start
- Check logs: `docker logs esports-management-ui`
- Verify all environment variables are set
- Ensure port 3000 is not already in use

### Authentication loop
- Verify `AUTH0_ISSUER_BASE_URL` is correct
- Check Auth0 application is enabled
- Ensure `AUTH0_SECRET` is set and valid

### API calls failing
- Check `NEXT_PUBLIC_API_BASE_URL` is correct
- Verify backend API is accessible
- Check CORS settings on backend

## Monitoring

Monitor your application with:

```bash
# View logs
docker logs -f esports-management-ui

# Check container status
docker ps | grep esports

# View resource usage
docker stats esports-management-ui
```

## Updating

To update to the latest version:

```bash
# Pull latest image
docker pull simonaspinall/esports-back-office:latest

# Stop and remove old container
docker stop esports-management-ui
docker rm esports-management-ui

# Start new container (use same docker run command as above)
```

Or with Docker Compose:

```bash
docker-compose pull
docker-compose up -d --force-recreate
```

## Security Best Practices

1. Never commit `.env.local` or `.env` files to git
2. Rotate `AUTH0_SECRET` regularly
3. Use different Auth0 applications for dev/staging/production
4. Enable MFA for admin users in Auth0
5. Review Auth0 logs regularly
6. Keep dependencies updated: `npm audit fix`
7. Use HTTPS only in production
8. Implement rate limiting on your reverse proxy

## Support

For issues:
- Check logs first
- Review Auth0 dashboard for authentication errors
- Verify environment variables are set correctly
- Ensure Auth0 callback URLs match your domain exactly
