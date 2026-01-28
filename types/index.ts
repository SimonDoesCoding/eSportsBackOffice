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
  team1Score: number;
  team2Score: number;
  completedAt: string;
  createdAt?: string;
  updatedAt?: string;
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