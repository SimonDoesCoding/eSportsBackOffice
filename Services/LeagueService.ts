import { League, CreateLeagueRequest } from '../types';
import { apiRequest } from './api';

export class LeagueService {
  static async getLeagues(): Promise<League[]> {
    return apiRequest<League[]>('/Leagues');
  }

  static async createLeague(data: CreateLeagueRequest): Promise<League> {
    return apiRequest<League>('/Leagues', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async deleteLeague(id: string): Promise<void> {
    return apiRequest<void>(`/Leagues/${id}`, {
      method: 'DELETE',
    });
  }
}
