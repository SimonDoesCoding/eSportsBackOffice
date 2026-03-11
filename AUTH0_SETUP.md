# Auth0 Setup Guide

This guide will help you set up Auth0 authentication for the Esports Management UI.

## Step 1: Install Dependencies

Run the following command in your terminal:

```bash
npm install @auth0/nextjs-auth0
```

## Step 2: Create Auth0 Account and Application

1. Go to [Auth0](https://auth0.com/) and sign up for a free account
2. Create a new application:
   - Click "Applications" in the sidebar
   - Click "Create Application"
   - Name it "Esports Management UI"
   - Select "Regular Web Applications"
   - Click "Create"

## Step 3: Configure Auth0 Application

In your Auth0 application settings:

1. **Allowed Callback URLs**: Add these URLs (one per line):
   ```
   http://localhost:3000/api/auth/callback
   https://your-production-domain.com/api/auth/callback
   ```

2. **Allowed Logout URLs**: Add these URLs (one per line):
   ```
   http://localhost:3000
   https://your-production-domain.com
   ```

3. **Allowed Web Origins**: Add these URLs (one per line):
   ```
   http://localhost:3000
   https://your-production-domain.com
   ```

4. Click "Save Changes"

## Step 4: Configure Environment Variables

Create a `.env.local` file in the root of your project with the following variables:

```bash
# Auth0 Configuration
AUTH0_SECRET='use [openssl rand -hex 32] for production'
AUTH0_BASE_URL='http://localhost:3000'
AUTH0_ISSUER_BASE_URL='https://YOUR_AUTH0_DOMAIN'
AUTH0_CLIENT_ID='YOUR_AUTH0_CLIENT_ID'
AUTH0_CLIENT_SECRET='YOUR_AUTH0_CLIENT_SECRET'
```

Replace the placeholders:
- `YOUR_AUTH0_DOMAIN`: Found in your Auth0 application settings (e.g., `dev-abc123.us.auth0.com`)
- `YOUR_AUTH0_CLIENT_ID`: Found in your Auth0 application settings
- `YOUR_AUTH0_CLIENT_SECRET`: Found in your Auth0 application settings
- `AUTH0_SECRET`: Generate using `openssl rand -hex 32` in your terminal

## Step 5: Generate AUTH0_SECRET

Run this command in your terminal to generate a secure secret:

```bash
openssl rand -hex 32
```

Copy the output and use it as your `AUTH0_SECRET` value.

## Step 6: Test the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000`

3. You should be automatically redirected to Auth0 login page

4. After logging in, you'll be redirected back to your application

## Step 7: Add Users

You can add users in two ways:

1. **Self-registration**: Users can sign up through the Auth0 login page
2. **Manual creation**: In Auth0 Dashboard → User Management → Users → Create User

## Step 8: Production Deployment

For production:

1. Update `AUTH0_BASE_URL` to your production domain
2. Add production URLs to Auth0 application settings
3. Use a secure `AUTH0_SECRET` (never commit this to git)
4. Set environment variables in your hosting platform (Vercel, Docker, etc.)

## Docker Configuration

Add these environment variables to your `docker-compose.yml`:

```yaml
environment:
  - AUTH0_SECRET=${AUTH0_SECRET}
  - AUTH0_BASE_URL=${AUTH0_BASE_URL}
  - AUTH0_ISSUER_BASE_URL=${AUTH0_ISSUER_BASE_URL}
  - AUTH0_CLIENT_ID=${AUTH0_CLIENT_ID}
  - AUTH0_CLIENT_SECRET=${AUTH0_CLIENT_SECRET}
```

## Troubleshooting

### "Invalid state" error
- Clear your browser cookies and try again
- Verify your callback URLs are correct in Auth0

### "Unauthorized" error
- Check that your Auth0 credentials are correct
- Verify the Auth0 application is enabled

### Redirect loop
- Ensure `AUTH0_BASE_URL` matches your actual domain
- Check that middleware is configured correctly

## Security Best Practices

1. Never commit `.env.local` to version control
2. Use different Auth0 applications for development and production
3. Regularly rotate your `AUTH0_SECRET`
4. Enable Multi-Factor Authentication in Auth0 for admin users
5. Review Auth0 logs regularly for suspicious activity

## Additional Features

You can extend Auth0 with:
- Role-based access control (RBAC)
- Social login (Google, GitHub, etc.)
- Multi-factor authentication
- Custom login pages
- User metadata and profiles

Refer to [Auth0 Next.js SDK Documentation](https://auth0.com/docs/quickstart/webapp/nextjs) for more details.
