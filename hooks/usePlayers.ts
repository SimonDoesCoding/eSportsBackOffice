import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PlayerService } from '../Services/PlayerService';
import { PlayerFilters, CreatePlayerRequest, UpdatePlayerRequest } from '../types';

// Query hooks
export const usePlayers = (filters?: PlayerFilters) => {
  return useQuery({
    queryKey: ['players', filters],
    queryFn: () => PlayerService.getPlayers(filters),
  });
};

export const usePlayer = (id: string) => {
  return useQuery({
    queryKey: ['players', id],
    queryFn: () => PlayerService.getPlayer(id),
    enabled: !!id,
  });
};

// Mutation hooks
export const useCreatePlayer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (player: CreatePlayerRequest) => PlayerService.createPlayer(player),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
      queryClient.invalidateQueries({ queryKey: ['teams'] }); // Invalidate teams as well since rosters change
    },
  });
};

export const useUpdatePlayer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, player }: { id: string; player: UpdatePlayerRequest }) => 
      PlayerService.updatePlayer(id, player),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
      queryClient.invalidateQueries({ queryKey: ['players', id] });
      queryClient.invalidateQueries({ queryKey: ['teams'] }); // Invalidate teams as well
    },
  });
};

export const useDeletePlayer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => PlayerService.deletePlayer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
      queryClient.invalidateQueries({ queryKey: ['teams'] }); // Invalidate teams as well
    },
  });
};

export const useTransferPlayer = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ playerId, newTeamId }: { playerId: string; newTeamId: string }) => 
      PlayerService.transferPlayer(playerId, newTeamId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
};