import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { SimulationService } from '../Services/SimulationService';
import { SimulationResponse } from '../types';

/**
 * Hook to run a simulation
 */
export function useRunSimulation() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (fixtureId: string) => SimulationService.runSimulation(fixtureId),
    onSuccess: () => {
      // Invalidate simulations cache
      queryClient.invalidateQueries({ queryKey: ['simulations'] });
    },
  });
}

/**
 * Hook to get simulation history for a fixture
 */
export function useSimulationHistory(fixtureId: string) {
  return useQuery<SimulationResponse[]>({
    queryKey: ['simulations', 'fixture', fixtureId],
    queryFn: () => SimulationService.getSimulationHistory(fixtureId),
    enabled: !!fixtureId,
  });
}

/**
 * Hook to get all simulations
 */
export function useSimulations() {
  return useQuery<SimulationResponse[]>({
    queryKey: ['simulations'],
    queryFn: () => SimulationService.getAllSimulations(),
  });
}
