# Project Structure

## Directory Organization

```
/app                    # Next.js App Router pages and components
  /api                  # API route handlers
    /clients            # Client management endpoints
    /health             # Health check endpoint
  /components           # Shared React components
  /[feature]            # Feature-specific pages (teams, players, fixtures, results, clients)
  layout.tsx            # Root layout with navigation
  providers.tsx         # React Query provider setup
  globals.css           # Global styles

/Services               # API service layer (capitalized)
  api.ts                # Base API configuration and utilities
  *Service.ts           # Feature-specific service modules

/hooks                  # Custom React hooks for data fetching
  use*.ts               # Hook files (e.g., useTeams, usePlayers)

/types                  # TypeScript type definitions
  index.ts              # Centralized type exports

/utils                  # Utility functions
  testApi.ts            # API testing utilities

/public                 # Static assets

/.kiro                  # Kiro IDE configuration
  /specs                # Feature specifications
  /steering             # Project steering documents
```

## Architectural Patterns

### Service Layer Pattern
- All API calls go through service modules in `/Services`
- Services use the centralized `apiRequest` utility
- Each domain has its own service file (TeamService, PlayerService, etc.)

### Custom Hooks Pattern
- Data fetching logic encapsulated in custom hooks (`/hooks`)
- Hooks use TanStack Query for caching and state management
- One hook per domain/feature (useTeams, usePlayers, useFixtures, etc.)

### Component Organization
- Shared components live in `/app/components`
- Page-specific components can be co-located with pages
- Form components follow naming pattern: `*Form.tsx`
- Modal components follow naming pattern: `*Modal.tsx`

### Type Definitions
- All types centralized in `/types/index.ts`
- Domain models match API response structures
- Enums for status types (ClientStatus, PlayerStatus, FixtureStatus)
- Request/Response types for API operations

## File Naming Conventions

- React components: PascalCase (e.g., `TeamForm.tsx`, `ClientDetailsModal.tsx`)
- Services: PascalCase with Service suffix (e.g., `TeamService.ts`)
- Hooks: camelCase with use prefix (e.g., `useTeams.ts`)
- Types: PascalCase for interfaces/types
- API routes: lowercase with Next.js route conventions

## Next.js App Router Conventions

- `page.tsx` - Route page component
- `layout.tsx` - Layout wrapper
- `route.ts` - API route handler
- Client components marked with `'use client'` directive
- Server components by default

## Import Path Alias

Use `@/*` to import from workspace root:
```typescript
import { Team } from '@/types';
import { apiRequest } from '@/Services/api';
```
