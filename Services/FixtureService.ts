import { Fixture, FixtureType } from '../types';
import { apiRequest } from './api';

// CDL League ID

export class FixtureService {
  static async getFixtures(): Promise<Fixture[]> {
    return apiRequest<Fixture[]>('/Fixtures');
  }

  static async getFixture(id: string): Promise<Fixture> {
    return apiRequest<Fixture>(`/fixtures/${id}`);
  }

  static async getFixtureTypes(): Promise<FixtureType[]> {
    return apiRequest<FixtureType[]>('/FixtureTypes');
  }

  static async createFixture(fixture: Omit<Fixture, 'id'>): Promise<Fixture> {
    return apiRequest<Fixture>('/fixtures', {
      method: 'POST',
      body: JSON.stringify(fixture),
    });
  }

  static async updateFixture(id: string, fixture: Partial<Fixture>): Promise<Fixture> {
    return apiRequest<Fixture>(`/fixtures/${id}`, {
      method: 'PUT',
      body: JSON.stringify(fixture),
    });
  }

  static async deleteFixture(id: string): Promise<void> {
    return apiRequest<void>(`/fixtures/${id}`, {
      method: 'DELETE',
    });
  }
}
