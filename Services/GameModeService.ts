import { GameModeType } from '../types';
import { apiRequest } from './api';

export class GameModeService {
  static async getGameModes(): Promise<GameModeType[]> {
    return apiRequest<GameModeType[]>('/GameModes');
  }

  static async getGameMode(id: string): Promise<GameModeType> {
    return apiRequest<GameModeType>(`/GameModes/${id}`);
  }
}
