// Simple utility to test API connectivity
import { TeamService } from '../Services/TeamService';
import { FixtureService } from '../Services/FixtureService';
import { Team, Fixture } from '../types';

export async function testApiConnection() {
  try {
    console.log('Testing API connection...');
    
    // Test teams endpoint
    const teams: Team[] = await TeamService.getTeams();
    console.log('Teams API working:', teams.length, 'teams found');
    
    // Test fixtures endpoint
    const fixtures: Fixture[] = await FixtureService.getFixtures();
    console.log('Fixtures API working:', fixtures.length, 'fixtures found');
    
    return { success: true, teams, fixtures };
  } catch (error) {
    console.error('API connection failed:', error);
    return { success: false, error };
  }
}