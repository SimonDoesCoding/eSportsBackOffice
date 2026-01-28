import { NextRequest, NextResponse } from 'next/server';
import { CreateClientRequest, OnboardClientResponse } from '../../../../types';

export async function POST(request: NextRequest) {
  try {
    const clientData: CreateClientRequest = await request.json();

    // Validate required fields
    if (!clientData.name || !clientData.email) {
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      );
    }

    // Generate unique identifiers (replace with your actual logic)
    const clientId = `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const apiKey = `sk_${Math.random().toString(36).substr(2, 32)}${Math.random().toString(36).substr(2, 32)}`;
    const rabbitMqQueue = `queue_${clientData.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`;

    // Mock client object (replace with actual database creation)
    const client = {
      id: `${Date.now()}`,
      clientId,
      name: clientData.name,
      email: clientData.email,
      company: clientData.company || '',
      status: 'active' as const,
      apiKey,
      rabbitMqQueue,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const response: OnboardClientResponse = {
      client,
      apiKey,
      rabbitMqQueue,
      success: true,
      message: `Client ${clientData.name} has been successfully onboarded with full API access and RabbitMQ queue setup.`,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Client onboarding error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to onboard client',
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred'
      },
      { status: 500 }
    );
  }
}