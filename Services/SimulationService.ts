import { SimulationResponse } from '../types';
import { apiRequest } from './api';

export class SimulationService {
  /**
   * Run a simulation for a fixture
   * Calls the simulation API at http://82.165.193.29:5050/api/simulation
   */
  static async runSimulation(fixtureId: string): Promise<SimulationResponse> {
    return apiRequest<SimulationResponse>('/simulation', {
      method: 'POST',
      body: JSON.stringify(fixtureId), // Send fixtureId as JSON string (wrapped in quotes)
    });
  }

  /**
   * Get simulation history for a fixture
   */
  static async getSimulationHistory(fixtureId: string): Promise<SimulationResponse[]> {
    return apiRequest<SimulationResponse[]>(`/simulations/fixture/${fixtureId}`);
  }

  /**
   * Get all simulations
   */
  static async getAllSimulations(): Promise<SimulationResponse[]> {
    return apiRequest<SimulationResponse[]>('/simulations');
  }
}
