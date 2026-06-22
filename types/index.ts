// Core data models for esports management system based on actual API response

export type Game = 'cdl' | 'cs2' | 'valorant';
export type PlayerStatus = 'active' | 'inactive' | 'substitute' | 'retired';
export type MatchFormat = 'BO1' | 'BO3' | 'BO5';
export type FixtureStatus = 'scheduled' | 'live' | 'completed' | 'cancelled';

// Game mode types for CDL
export type GameMode = 'Hardpoint' | 'SearchAndDestroy' | 'Overload';

export interface GameModeWinPercents {
  Hardpoint: number;
  SearchAndDestroy: number;
  Overload: number;
}

export interface HardpointStats {
  KillsPerMap: number;
  DeathsPerMap: number;
  KdRatio: number;
  HillTimePer10Mins: number;
}

export interface SearchAndDestroyStats {
  KillsPerMap: number;
  DeathsPerMap: number;
  KdRatio: number;
  PlantsPerMap: number;
  DefusesPerMap: number;
  KillsPerRound: number;
  DeathsPerRound: number;
  OpeningDuelsWon: number;
  OpeningDuelsLost: number;
  OpeningDuelWinPercent: number;
}

export interface OverloadStats {
  KillsPerMap: number;
  DeathsPerMap: number;
  KdRatio: number;
  OverloadsPerMap: number;
}

export interface GameModePlayerStats {
  Hardpoint: HardpointStats;
  SearchAndDestroy: SearchAndDestroyStats;
  Overload: OverloadStats;
}

export interface Player {
  id: string;
  name: string;
  gameModePlayerStats: GameModePlayerStats;
}

export interface Team {
  id: string;
  name: string;
  gameModeWinPercents: GameModeWinPercents;
  lastRosterChangeDate: string;
  recentFormModifier: number;
  monthsSinceLastRosterChange: number;
  players: Player[];
}

// Legacy interfaces for fixtures and results (to be updated when API is available)
export interface FixtureType {
  id: string;
  name: string;
}

export interface Fixture {
  id: string;
  team1: Team;
  team2: Team;
  seriesLength: number;
  fixtureType: {
    id: string;
    name: string;
  };
  league: {
    id: string;
    name: string;
    game: {
      id: string;
      name: string;
    };
  };
  startDateTime: string;
  result?: Result; // Optional result if one exists
}

export interface Result {
  id: string;
  fixtureId: string;
  team1Name: string;
  team2Name: string;
  winnerId: string;
  team1Score: number;
  team2Score: number;
  startDate: string;
  maps: MapResultDto[];
}

export interface MapResultDto {
  mapIndex: number;
  gameMode: string;
  mapName: string;
  team1Score: number;
  team2Score: number;
  winnerId: string;
}

// Detailed Result Submission Types
export interface PlayerMapResultStat {
  statId: string;
  statValue: number;
}

export interface PlayerMapResult {
  playerId: string;
  playerMapResultStatsData: PlayerMapResultStat[];
}

export interface MapResult {
  gameModeId: string;
  mapNumber: number;
  team1Score: number;
  team2Score: number;
  playerMapResults: PlayerMapResult[];
}

export interface CreateResultRequest {
  fixtureId: string;
  team1Score: number;
  team2Score: number;
  playerMapResultData: MapResult[];
}

// Game Mode and Stat Types
export interface GameModeType {
  id: string;
  name: string;
}

export interface StatType {
  id: string;
  name: string;
  abbreviation?: string;
  category?: string;
}

// Client Management Types
export type ClientStatus = 'active' | 'inactive' | 'pending' | 'suspended';

export interface Client {
  id: string;
  clientId: string;
  name: string;
  email: string;
  company?: string;
  status: ClientStatus;
  apiKey: string;
  rabbitMqQueue: string;
  createdAt: string;
  updatedAt: string;
  lastActivity?: string;
}

export interface CreateClientRequest {
  name: string;
  email: string;
  company?: string;
}

export interface OnboardClientResponse {
  client: Client;
  apiKey: string;
  rabbitMqQueue: string;
  success: boolean;
  message: string;
}


// League Types
export interface League {
  id: string;
  name: string;
  game: {
    id: string;
    name: string;
  };
}

export interface CreateLeagueRequest {
  name: string;
  gameId: string;
}

// Simulation Types
export interface SimulationRequest {
  fixtureId: string;
  team1Id: string;
  team2Id: string;
  seriesLength: number;
}

export interface SimulationResult {
  fixtureId: string;
  team1Score: number;
  team2Score: number;
  predictedWinner: string;
  confidence: number;
  mapResults?: Array<{
    mapNumber: number;
    gameMode: GameMode;
    winner: string;
    score?: string;
  }>;
  simulationMetadata?: {
    timestamp: string;
    version: string;
    factors: string[];
  };
}

export interface SimulationResponse {
  success: boolean;
  simulation: SimulationResult;
  message?: string;
}

// Insights Types
export interface InsightsTeamRef {
  id: string;
  name: string;
}

export interface InsightsSeriesData {
  team1_win_probability: number;
  team2_win_probability: number;
  favourite: string;
  sweep_probability: number;
  distance_probability: number;
  team1_avg_kills: number;
  team2_avg_kills: number;
  team1_avg_deaths: number;
  team2_avg_deaths: number;
  team1_avg_kd: number;
  team2_avg_kd: number;
  avg_total_maps: number;
  score_distribution: Record<string, number>;
}

export interface InsightsMapData {
  map_index: number;
  team1_win_probability: number;
  team2_win_probability: number;
  team1_avg_kills: number;
  team2_avg_kills: number;
  team1_avg_kd: number;
  team2_avg_kd: number;
  played_percentage: number;
}

export interface FixtureInsights {
  fixture_id: string;
  simulation_id: string;
  game_id: string;
  team1: InsightsTeamRef;
  team2: InsightsTeamRef;
  series: InsightsSeriesData;
  maps: InsightsMapData[];
  headline_insights: string[];
  generated_at: string;
}
