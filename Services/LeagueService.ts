import { League } from '../types';
import { apiRequest } from './api';

export class LeagueService {
  static async getLeagues(): Promise<League[]> {
    return apiRequest<League[]>('/Leagues');
  }
}
