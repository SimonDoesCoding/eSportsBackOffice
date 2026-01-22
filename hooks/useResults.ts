import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ResultService } from '../Services/ResultService';
import { ResultFilters, CreateResultRequest, UpdateResultRequest } from '../types';

// Query hooks
export const useResults = (filters?: ResultFilters) => {
  return useQuery({
    queryKey: ['results', filters],
    queryFn: () => ResultService.getResults(filters),
  });
};

export const useResult = (id: string) => {
  return useQuery({
    queryKey: ['results', id],
    queryFn: () => ResultService.getResult(id),
    enabled: !!id,
  });
};

// Mutation hooks
export const useCreateResult = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (result: CreateResultRequest) => ResultService.createResult(result),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results'] });
      queryClient.invalidateQueries({ queryKey: ['teams'] }); // Invalidate teams for updated stats
      queryClient.invalidateQueries({ queryKey: ['players'] }); // Invalidate players for updated stats
    },
  });
};

export const useUpdateResult = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, result }: { id: string; result: UpdateResultRequest }) => 
      ResultService.updateResult(id, result),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['results'] });
      queryClient.invalidateQueries({ queryKey: ['results', id] });
      queryClient.invalidateQueries({ queryKey: ['teams'] }); // Invalidate teams for updated stats
      queryClient.invalidateQueries({ queryKey: ['players'] }); // Invalidate players for updated stats
    },
  });
};

export const useDeleteResult = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => ResultService.deleteResult(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['results'] });
      queryClient.invalidateQueries({ queryKey: ['teams'] }); // Invalidate teams for updated stats
      queryClient.invalidateQueries({ queryKey: ['players'] }); // Invalidate players for updated stats
    },
  });
};