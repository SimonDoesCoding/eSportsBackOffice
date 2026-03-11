# Technology Stack

## Framework & Runtime

- Next.js 16.1.1 (React 19.2.3) with App Router
- Node.js 18.18.0 (required minimum version)
- TypeScript 5 with strict mode enabled

## UI & Styling

- Tailwind CSS 4 for styling
- Material-UI (MUI) components and icons
- MUI X Date Pickers for date/time selection
- Emotion for styled components
- Inter font (Google Fonts)

## State Management & Data Fetching

- TanStack Query (React Query) v5 for server state management
- Custom React hooks for data fetching (located in `/hooks`)
- Service layer pattern (located in `/Services`)

## Build System & Tools

- Next.js standalone output for Docker deployment
- ESLint 9 with Next.js config
- PostCSS with Tailwind

## Common Commands

```bash
# Development
npm run dev          # Start development server on localhost:3000

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint

# Docker
docker-compose -f docker-compose.dev.yml up --build    # Development with hot reload
docker-compose up --build                               # Production build
```

## API Configuration

- Base API URL: `https://localhost:7173/api`
- All API calls use centralized `apiRequest` utility from `Services/api.ts`
- Custom `ApiError` class for error handling

## TypeScript Configuration

- Target: ES2017
- Module resolution: bundler
- Path alias: `@/*` maps to workspace root
- Strict mode enabled
- JSX: react-jsx (React 19 automatic runtime)

## Docker Support

- Multi-stage production builds using Node 18 Alpine
- Development containers with hot reload
- Standalone Next.js output for optimized container size
- Non-root user execution for security
