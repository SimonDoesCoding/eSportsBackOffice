import { Team } from '../types';
import { apiRequest } from './api';

export class TeamService {
  static async getTeams(): Promise<Team[]> {
    return apiRequest<Team[]>('/teams');
  }

  static async getTeam(id: string): Promise<Team> {
    return apiRequest<Team>(`/teams/${id}`);
  }

  static async createTeam(team: Omit<Team, 'id' | 'createdAt' | 'updatedAt'>): Promise<Team> {
    return apiRequest<Team>('/teams', {
      method: 'POST',
      body: JSON.stringify(team),
    });
  }

  static async updateTeam(team: Team): Promise<Team> {
    // Use PUT request to /teams endpoint with full team object including id
    return apiRequest<Team>('/teams', {
      method: 'PUT',
      body: JSON.stringify(team),
    });
  }

  static async deleteTeam(id: string): Promise<void> {
    return apiRequest<void>(`/teams/${id}`, {
      method: 'DELETE',
    });
  }
}