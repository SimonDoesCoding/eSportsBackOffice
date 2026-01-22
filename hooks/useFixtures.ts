'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { FixtureService } from '../Services/FixtureService';
import { Fixture } from '../types/index';

export function useFixtures() {
  return useQuery({
    queryKey: ['fixtures'],
    queryFn: FixtureService.getFixtures,
  });
}

export function useFixture(id: string) {
  return useQuery({
    queryKey: ['fixtures', id],
    queryFn: () => FixtureService.getFixture(id),
    enabled: !!id,
  });
}

export function useCreateFixture() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: FixtureService.createFixture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixtures'] });
    },
  });
}

export function useUpdateFixture() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, fixture }: { id: string; fixture: Partial<Fixture> }) =>
      FixtureService.updateFixture(id, fixture),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixtures'] });
    },
  });
}

export function useDeleteFixture() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: FixtureService.deleteFixture,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fixtures'] });
    },
  });
}