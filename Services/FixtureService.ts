import { Fixture, FixtureType, Result } from "../types";
import { apiRequest } from "./api";

export class FixtureService {
  static async getFixtures(): Promise<Fixture[]> {
    return apiRequest<Fixture[]>("/fixtures");
  }

  static async getUpcomingFixtures(): Promise<Fixture[]> {
    return apiRequest<Fixture[]>("/fixtures/upcoming");
  }

  static async getFixture(id: string): Promise<Fixture> {
    return apiRequest<Fixture>(`/fixtures/${id}`);
  }

  static async createFixture(fixture: Omit<Fixture, "id">): Promise<Fixture> {
    return apiRequest<Fixture>("/fixtures", {
      method: "POST",
      body: JSON.stringify(fixture),
    });
  }

  static async updateFixture(
    id: string,
    fixture: Partial<Fixture>,
  ): Promise<Fixture> {
    return apiRequest<Fixture>(`/fixtures/${id}`, {
      method: "PUT",
      body: JSON.stringify(fixture),
    });
  }

  static async deleteFixture(id: string): Promise<void> {
    return apiRequest<void>(`/fixtures/${id}`, {
      method: "DELETE",
    });
  }

  static async getResults(from?: string, to?: string): Promise<Result[]> {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const query = params.toString() ? `?${params.toString()}` : "";
    return apiRequest<Result[]>(`/fixtures/results${query}`);
  }
}
