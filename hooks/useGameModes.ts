import { useQuery } from '@tanstack/react-query';
import { GameModeService } from '../Services/GameModeService';
import { GameModeType } from '../types';

export function useGameModes() {
  return useQuery<GameModeType[]>({
    queryKey: ['gameModes'],
    queryFn: () => GameModeService.getGameModes(),
  });
}

export function useGameMode(id: string) {
  return useQuery<GameModeType>({
    queryKey: ['gameModes', id],
    queryFn: () => GameModeService.getGameMode(id),
    enabled: !!id,
  });
}
