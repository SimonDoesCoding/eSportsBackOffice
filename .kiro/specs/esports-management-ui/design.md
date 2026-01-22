# Esports Management UI - Design Document

## Architecture Overview

### Technology Stack
- **Frontend Framework**: React 18 with TypeScript
- **Build Tool**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **State Management**: React Query (TanStack Query) for server state
- **HTTP Client**: Fetch API with custom service layer
- **Containerization**: Docker with multi-stage build
- **Development**: Hot reload, TypeScript strict mode

### Project Structure
```
/app
  /components          # Reusable UI components
  /teams              # Team management pages
  /players            # Player management pages  
  /fixtures           # Fixture management pages
  /results            # Results management pages
  /stats              # Statistics and analytics pages
  /globals.css        # Global styles
  /layout.tsx         # Root layout
  /page.tsx           # Home/dashboard page
/Services             # Backend service integration
/types               # TypeScript type definitions
/utils               # Utility functions
/hooks               # Custom React hooks
/public              # Static assets
```

## Data Models

### Team Model
```typescript
interface Team {
  id: string;
  name: string;
  logo?: string;
  region: string;
  games: Game[];
  players: Player[];
  socialMedia?: {
    twitter?: string;
    instagram?: string;
    youtube?: string;
  };
  stats: TeamStats;
  createdAt: Date;
  updatedAt: Date;
}

interface TeamStats {
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number;
  currentStreak: number;
  streakType: 'win' | 'loss';
}
```

### Player Model
```typescript
interface Player {
  id: string;
  gamertag: string;
  realName?: string;
  age?: number;
  nationality: string;
  teamId?: string;
  roles: PlayerRole[];
  status: PlayerStatus;
  stats: PlayerStats;
  createdAt: Date;
  updatedAt: Date;
}

type PlayerStatus = 'active' | 'inactive' | 'substitute' | 'retired';
type Game = 'cdl' | 'cs2' | 'valorant';

interface PlayerRole {
  game: Game;
  role: string; // Game-specific roles
}

interface PlayerStats {
  totalMatches: number;
  totalMaps: number;
  kills: number;
  deaths: number;
  assists: number;
  kd: number;
  adr: number; // Average Damage per Round
  rating: number;
  clutchWins: number;
  clutchAttempts: number;
}
```

### Fixture Model
```typescript
interface Fixture {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  game: Game;
  format: MatchFormat;
  scheduledAt: Date;
  tournament?: string;
  league?: string;
  streamUrl?: string;
  venue?: string;
  status: FixtureStatus;
  createdAt: Date;
  updatedAt: Date;
}

type MatchFormat = 'BO1' | 'BO3' | 'BO5';
type FixtureStatus = 'scheduled' | 'live' | 'completed' | 'cancelled';
```

### Result Model
```typescript
interface Result {
  id: string;
  fixtureId: string;
  fixture: Fixture;
  homeScore: number;
  awayScore: number;
  maps: MapResult[];
  playerStats: PlayerMatchStats[];
  completedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

interface MapResult {
  mapName: string;
  homeScore: number;
  awayScore: number;
  gameMode?: string;
  duration?: number;
}

interface PlayerMatchStats {
  playerId: string;
  player: Player;
  kills: number;
  deaths: number;
  assists: number;
  adr: number;
  rating: number;
  clutchWins: number;
  clutchAttempts: number;
}
```

## Component Architecture

### Core Components

#### Layout Components
- `Layout`: Root layout with navigation
- `Sidebar`: Navigation sidebar with menu items
- `Header`: Top header with user info and actions
- `Breadcrumbs`: Navigation breadcrumbs

#### Data Display Components
- `DataTable`: Reusable table with sorting, filtering, pagination
- `StatCard`: Display key statistics
- `PlayerCard`: Player information display
- `TeamCard`: Team information display
- `FixtureCard`: Upcoming fixture display
- `ResultCard`: Match result display

#### Form Components
- `TeamForm`: Create/edit team form
- `PlayerForm`: Create/edit player form
- `FixtureForm`: Create/edit fixture form
- `ResultForm`: Record match results form

#### Chart Components
- `PerformanceChart`: Player/team performance over time
- `StatComparison`: Compare statistics between entities
- `WinLossChart`: Win/loss visualization

### Page Components

#### Dashboard (`/page.tsx`)
- Overview statistics
- Recent results
- Upcoming fixtures
- Top performers

#### Teams (`/teams/page.tsx`)
- Team list with search and filters
- Team creation button
- Team statistics overview

#### Team Detail (`/teams/[id]/page.tsx`)
- Team information
- Roster management
- Team statistics
- Match history

#### Players (`/players/page.tsx`)
- Player list with search and filters
- Player creation button
- Player statistics overview

#### Player Detail (`/players/[id]/page.tsx`)
- Player information
- Performance statistics
- Match history
- Transfer history

#### Fixtures (`/fixtures/page.tsx`)
- Upcoming fixtures list
- Calendar view
- Create fixture button
- Filter by team/game/tournament

#### Results (`/results/page.tsx`)
- Match results list
- Detailed result views
- Statistics summaries
- Filter and search capabilities

## Service Layer

### API Services
```typescript
// Services/TeamService.ts
class TeamService {
  async getTeams(filters?: TeamFilters): Promise<Team[]>
  async getTeam(id: string): Promise<Team>
  async createTeam(team: CreateTeamRequest): Promise<Team>
  async updateTeam(id: string, team: UpdateTeamRequest): Promise<Team>
  async deleteTeam(id: string): Promise<void>
}

// Services/PlayerService.ts
class PlayerService {
  async getPlayers(filters?: PlayerFilters): Promise<Player[]>
  async getPlayer(id: string): Promise<Player>
  async createPlayer(player: CreatePlayerRequest): Promise<Player>
  async updatePlayer(id: string, player: UpdatePlayerRequest): Promise<Player>
  async deletePlayer(id: string): Promise<void>
  async transferPlayer(playerId: string, newTeamId: string): Promise<Player>
}

// Services/FixtureService.ts
class FixtureService {
  async getFixtures(filters?: FixtureFilters): Promise<Fixture[]>
  async getFixture(id: string): Promise<Fixture>
  async createFixture(fixture: CreateFixtureRequest): Promise<Fixture>
  async updateFixture(id: string, fixture: UpdateFixtureRequest): Promise<Fixture>
  async deleteFixture(id: string): Promise<void>
}

// Services/ResultService.ts
class ResultService {
  async getResults(filters?: ResultFilters): Promise<Result[]>
  async getResult(id: string): Promise<Result>
  async createResult(result: CreateResultRequest): Promise<Result>
  async updateResult(id: string, result: UpdateResultRequest): Promise<Result>
  async deleteResult(id: string): Promise<void>
}
```

## State Management

### React Query Implementation
```typescript
// hooks/useTeams.ts
export const useTeams = (filters?: TeamFilters) => {
  return useQuery({
    queryKey: ['teams', filters],
    queryFn: () => TeamService.getTeams(filters),
  });
};

export const useCreateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: TeamService.createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
};
```

## UI/UX Design

### Design System
- **Color Palette**: Dark theme optimized for esports
  - Primary: Electric blue (#00D4FF)
  - Secondary: Neon green (#39FF14)
  - Background: Dark gray (#1A1A1A)
  - Surface: Medium gray (#2D2D2D)
  - Text: White (#FFFFFF) and light gray (#CCCCCC)

### Navigation Structure
```
Dashboard
├── Teams
│   ├── All Teams
│   └── Team Detail
│       ├── Overview
│       ├── Roster
│       ├── Statistics
│       └── Matches
├── Players
│   ├── All Players
│   └── Player Detail
│       ├── Overview
│       ├── Statistics
│       └── History
├── Fixtures
│   ├── Upcoming
│   ├── Calendar View
│   └── Create Fixture
├── Results
│   ├── Recent Results
│   ├── Match Detail
│   └── Record Result
└── Statistics
    ├── Team Stats
    ├── Player Stats
    └── League Overview
```

### Responsive Design
- **Desktop**: Full sidebar navigation, multi-column layouts
- **Tablet**: Collapsible sidebar, adapted layouts
- **Mobile**: Bottom navigation, single-column layouts

## Docker Configuration

### Multi-stage Dockerfile
```dockerfile
# Build stage
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### Environment Configuration
```env
# Backend API Configuration
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080/api
NEXT_PUBLIC_APP_NAME=Esports Management UI

# Optional: Analytics and monitoring
NEXT_PUBLIC_ANALYTICS_ID=
```

## Performance Optimizations

### Code Splitting
- Route-based code splitting with Next.js App Router
- Component-level lazy loading for heavy components
- Dynamic imports for charts and analytics

### Data Loading
- React Query for caching and background updates
- Pagination for large datasets
- Optimistic updates for better UX

### Bundle Optimization
- Tree shaking for unused code elimination
- Image optimization with Next.js Image component
- CSS purging with Tailwind CSS

## Error Handling

### Error Boundaries
```typescript
class ErrorBoundary extends Component {
  // Catch and display component errors
}
```

### API Error Handling
```typescript
const handleApiError = (error: ApiError) => {
  // Log error
  // Show user-friendly message
  // Retry logic where appropriate
};
```

## Testing Strategy

### Unit Tests
- Component testing with React Testing Library
- Service layer testing with Jest
- Utility function testing

### Integration Tests
- API integration testing
- User flow testing
- Cross-browser compatibility

### Property-Based Testing
Property-based tests will validate core business logic and data integrity:

#### Team Management Properties
1. **Team Creation Invariant**: Created teams always have valid required fields
2. **Team Update Consistency**: Team updates preserve data integrity
3. **Team Deletion Safety**: Team deletion properly handles dependencies

#### Player Management Properties
4. **Player Transfer Integrity**: Player transfers maintain consistent team rosters
5. **Statistics Calculation Accuracy**: Player statistics are calculated correctly from match data
6. **Role Assignment Validity**: Player roles are valid for their assigned games

#### Fixture Management Properties
7. **Fixture Scheduling Consistency**: Scheduled fixtures have valid teams and times
8. **Match Format Validation**: Match formats are appropriate for the selected game

#### Results Management Properties
9. **Result Data Integrity**: Match results are consistent with fixture data
10. **Statistics Aggregation Accuracy**: Individual match stats correctly aggregate to player totals

## Correctness Properties

### 1. Team Creation Invariant
**Property**: All created teams must have valid required fields and proper initialization
- Team name is non-empty string
- Team ID is unique
- Team stats are initialized to zero
- Created timestamp is valid

### 2. Team Update Consistency  
**Property**: Team updates preserve data integrity and relationships
- Team ID remains unchanged
- Player relationships are maintained
- Statistics remain consistent
- Update timestamp is newer than creation

### 3. Team Deletion Safety
**Property**: Team deletion properly handles all dependencies
- Associated players are handled appropriately
- Fixture references are updated or prevented
- Historical data integrity is maintained

### 4. Player Transfer Integrity
**Property**: Player transfers maintain consistent team rosters
- Player can only be on one active team at a time
- Transfer updates both source and destination teams
- Player statistics are preserved across transfers
- Transfer history is maintained

### 5. Statistics Calculation Accuracy
**Property**: Player statistics are calculated correctly from match data
- K/D ratio equals kills divided by deaths (with death > 0)
- Total matches equals sum of individual match participations
- Win rate calculations are mathematically correct
- Statistics are non-negative

### 6. Role Assignment Validity
**Property**: Player roles are valid for their assigned games
- CDL players have valid CDL roles (AR, SMG, Flex, Support)
- CS2 players have valid CS2 roles (IGL, Entry, Support, AWP, Lurker)
- Valorant players have valid agent roles (Duelist, Controller, Initiator, Sentinel)

### 7. Fixture Scheduling Consistency
**Property**: Scheduled fixtures have valid teams and times
- Home and away teams are different
- Scheduled time is in the future (for new fixtures)
- Both teams exist in the system
- Match format is valid for the game type

### 8. Match Format Validation
**Property**: Match formats are appropriate for the selected game
- BO1, BO3, BO5 formats are valid for all supported games
- Map pools are appropriate for the game
- Team sizes match game requirements (4v4 for CDL, 5v5 for CS2/Valorant)

### 9. Result Data Integrity
**Property**: Match results are consistent with fixture data
- Result references a valid fixture
- Team scores are non-negative integers
- Map results sum to match result
- Player stats belong to participating teams

### 10. Statistics Aggregation Accuracy
**Property**: Individual match stats correctly aggregate to player totals
- Sum of match kills equals player total kills
- Sum of match deaths equals player total deaths
- Average calculations are mathematically correct
- Time-based statistics are properly weighted

## Implementation Priority

### Phase 1: Core Infrastructure
1. Project setup with Next.js and TypeScript
2. Docker configuration
3. Basic routing and layout
4. Service layer foundation

### Phase 2: Team Management
1. Team CRUD operations
2. Team list and detail views
3. Basic team statistics

### Phase 3: Player Management
1. Player CRUD operations
2. Player list and detail views
3. Player statistics and profiles

### Phase 4: Fixture Management
1. Fixture CRUD operations
2. Calendar and list views
3. Fixture scheduling interface

### Phase 5: Results Management
1. Result recording interface
2. Match result displays
3. Statistical calculations

### Phase 6: Analytics and Polish
1. Advanced statistics views
2. Performance optimizations
3. Enhanced UI/UX
4. Comprehensive testing