import { apiRequest } from "./api";

export class StatService {
  /**
   * Recalculate all team and player stats.
   * POST /stats/recalculate
   */
  static async recalculate(fixtureTypeId?: string): Promise<void> {
    const query = fixtureTypeId ? `?fixtureTypeId=${fixtureTypeId}` : "";
    return apiRequest<void>(`/stats/recalculate${query}`, {
      method: "POST",
    });
  }

  /**
   * Recalculate online stats only.
   * POST /stats/recalculate/online
   */
  static async recalculateOnline(): Promise<void> {
    return apiRequest<void>("/stats/recalculate/online", {
      method: "POST",
    });
  }
}
