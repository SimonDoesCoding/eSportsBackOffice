import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ClientService } from '../Services/ClientService';
import { Client, CreateClientRequest } from '../types';

export function useClients() {
  return useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: () => ClientService.getClients(),
  });
}

export function useOnboardClient() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (client: CreateClientRequest) => ClientService.onboardClient(client),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] });
    },
  });
}