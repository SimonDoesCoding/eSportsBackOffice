import { useQuery } from '@tanstack/react-query';
import { InsightsService } from '../Services/InsightsService';
import { FixtureInsights } from '../types';

export function useFixtureInsights(fixtureId: string) {
  return useQuery<FixtureInsights>({
    queryKey: ['insights', fixtureId],
    queryFn: () => InsightsService.getFixtureInsights(fixtureId),
    enabled: !!fixtureId,
  });
}
