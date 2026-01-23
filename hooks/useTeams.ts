'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { TeamService } from '../Services/TeamService';
import { Team } from '../types/index';

export function useTeams() {
  return useQuery<Team[]>({
    queryKey: ['teams'],
    queryFn: TeamService.getTeams,
  });
}

export function useTeam(id: string) {
  return useQuery<Team>({
    queryKey: ['teams', id],
    queryFn: () => TeamService.getTeam(id),
    enabled: !!id,
  });
}

export function useCreateTeam() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: TeamService.createTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
}

export function useUpdateTeam() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: TeamService.updateTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
}

export function useDeleteTeam() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: TeamService.deleteTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
}