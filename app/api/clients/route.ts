import { NextResponse } from 'next/server';
import { Client } from '../../../types';

// Mock client data - replace with actual database queries
const mockClients: Client[] = [
  {
    id: '1',
    clientId: 'client_1706123456_abc123def',
    name: 'Acme Esports',
    email: 'admin@acmeesports.com',
    company: 'Acme Gaming Inc.',
    status: 'active',
    apiKey: 'sk_live_1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    rabbitMqQueue: 'queue_acme_esports_1706123456',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:45:00Z',
    lastActivity: '2024-01-25T09:15:00Z'
  },
  {
    id: '2',
    clientId: 'client_1706234567_def456ghi',
    name: 'Pro Gaming League',
    email: 'contact@progamingleague.com',
    company: 'PGL Entertainment',
    status: 'active',
    apiKey: 'sk_live_abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    rabbitMqQueue: 'queue_pro_gaming_league_1706234567',
    createdAt: '2024-01-18T16:20:00Z',
    updatedAt: '2024-01-22T11:30:00Z',
    lastActivity: '2024-01-26T15:45:00Z'
  },
  {
    id: '3',
    clientId: 'client_1706345678_ghi789jkl',
    name: 'Elite Gaming',
    email: 'info@elitegaming.net',
    company: '',
    status: 'pending',
    apiKey: 'sk_test_fedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
    rabbitMqQueue: 'queue_elite_gaming_1706345678',
    createdAt: '2024-01-22T08:45:00Z',
    updatedAt: '2024-01-22T08:45:00Z'
  },
  {
    id: '4',
    clientId: 'client_1706456789_jkl012mno',
    name: 'Cyber Sports Network',
    email: 'admin@cybersports.tv',
    company: 'CSN Media Group',
    status: 'suspended',
    apiKey: 'sk_live_0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef',
    rabbitMqQueue: 'queue_cyber_sports_network_1706456789',
    createdAt: '2024-01-10T12:00:00Z',
    updatedAt: '2024-01-24T10:15:00Z',
    lastActivity: '2024-01-20T18:30:00Z'
  }
];

export async function GET() {
  try {
    // In a real application, you would fetch from your database
    // const clients = await db.clients.findMany();
    
    return NextResponse.json(mockClients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients' },
      { status: 500 }
    );
  }
}