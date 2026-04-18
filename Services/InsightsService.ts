import { FixtureInsights } from '../types';
import { apiRequest } from './api';

export class InsightsService {
  static async getFixtureInsights(fixtureId: string): Promise<FixtureInsights> {
    return apiRequest<FixtureInsights>(`/insights/${fixtureId}`);
  }
}
