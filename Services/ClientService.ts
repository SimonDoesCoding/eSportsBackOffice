import { Client, CreateClientRequest, OnboardClientResponse } from '../types';
import { apiRequest } from './api';

export class ClientService {
  static async getClients(): Promise<Client[]> {
    return apiRequest<Client[]>('/clients');
  }

  static async getClient(id: string): Promise<Client> {
    return apiRequest<Client>(`/clients/${id}`);
  }

  static async onboardClient(client: CreateClientRequest): Promise<OnboardClientResponse> {
    // This endpoint will handle the full onboarding process:
    // 1. Create client record
    // 2. Generate API key
    // 3. Create RabbitMQ queue
    // 4. Return all credentials
    return apiRequest<OnboardClientResponse>('/clients/onboard', {
      method: 'POST',
      body: JSON.stringify(client),
    });
  }

  static async updateClient(id: string, client: Partial<Client>): Promise<Client> {
    return apiRequest<Client>(`/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(client),
    });
  }

  static async deleteClient(id: string): Promise<void> {
    return apiRequest<void>(`/clients/${id}`, {
      method: 'DELETE',
    });
  }

  static async regenerateApiKey(id: string): Promise<{ apiKey: string }> {
    return apiRequest<{ apiKey: string }>(`/clients/${id}/regenerate-key`, {
      method: 'POST',
    });
  }
}