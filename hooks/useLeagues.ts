'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { LeagueService } from '../Services/LeagueService';
import { League, CreateLeagueRequest } from '../types';

export function useLeagues() {
  return useQuery<League[]>({
    queryKey: ['leagues'],
    queryFn: () => LeagueService.getLeagues(),
  });
}

export function useCreateLeague() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateLeagueRequest) => LeagueService.createLeague(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leagues'] });
    },
  });
}

export function useDeleteLeague() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => LeagueService.deleteLeague(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leagues'] });
    },
  });
}
