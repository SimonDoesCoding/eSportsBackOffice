import { SimulationResponse } from "../types";
import { apiRequest } from "./api";

export class SimulationService {
  /**
   * Run a simulation for a fixture.
   * POST /simulation/{fixtureId}
   */
  static async runSimulation(fixtureId: string): Promise<SimulationResponse> {
    return apiRequest<SimulationResponse>(`/simulation/${fixtureId}`, {
      method: "POST",
    });
  }
}
