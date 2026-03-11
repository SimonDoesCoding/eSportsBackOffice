import { useQuery } from '@tanstack/react-query';
import { StatService } from '../Services/StatService';
import { StatType } from '../types';

export function useStats() {
  return useQuery<StatType[]>({
    queryKey: ['stats'],
    queryFn: () => StatService.getStats(),
  });
}

export function useStat(id: string) {
  return useQuery<StatType>({
    queryKey: ['stats', id],
    queryFn: () => StatService.getStat(id),
    enabled: !!id,
  });
}

export function useStatsByGameMode(gameModeId: string) {
  return useQuery<StatType[]>({
    queryKey: ['stats', 'gameMode', gameModeId],
    queryFn: () => StatService.getStatsByGameMode(gameModeId),
    enabled: !!gameModeId,
  });
}
