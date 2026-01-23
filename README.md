# Esports Management UI

This is a [Next.js](https://nextjs.org) project for managing esports teams, players, fixtures, and results.

## Prerequisites

- **Node.js 20.9.0 or higher** (required for Next.js)
- npm or yarn package manager

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Features

- **Team Management**: Create, edit, and manage esports teams
- **Player Management**: View player statistics and team rosters  
- **Fixture Management**: Schedule and view upcoming matches
- **Results Management**: Record and view match results
- **API Integration**: Connected to sitechesports.com API
- **Docker Support**: Containerized for easy deployment

## API Configuration

The application connects to the esports API at `https://api.sitechesports.com/api`. The API provides:
- Teams data with game mode win percentages
- Fixtures data for CDL league
- Player statistics and roster information

## Docker Deployment

See [DOCKER-HUB-GUIDE.md](./DOCKER-HUB-GUIDE.md) for complete Docker deployment instructions.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
