import { StatType } from '../types';
import { apiRequest } from './api';

export class StatService {
  static async getStats(): Promise<StatType[]> {
    return apiRequest<StatType[]>('/Stats');
  }

  static async getStat(id: string): Promise<StatType> {
    return apiRequest<StatType>(`/Stats/${id}`);
  }

  static async getStatsByGameMode(gameModeId: string): Promise<StatType[]> {
    return apiRequest<StatType[]>(`/Stats/gamemode/${gameModeId}`);
  }
}
