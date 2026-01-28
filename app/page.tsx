'use client';

import { useTeams } from '../hooks/useTeams';
import { useFixtures } from '../hooks/useFixtures';
import { ApiDebug } from './components/ApiDebug';
import { Team, Fixture } from '../types';

export default function Dashboard() {
  const { data: teams } = useTeams();
  const { data: fixtures } = useFixtures();

  // Type-safe helpers
  const teamsData = teams as Team[] | undefined;
  const fixturesData = fixtures as Fixture[] | undefined;
  
  const upcomingFixtures = fixturesData || [];
  const recentResults: never[] = []; // Results API not implemented yet - empty array

  // Calculate overall team stats from game mode win percentages
  const getOverallWinRate = (team: Team) => {
    const rates = team.gameModeWinPercents;
    return (rates.Hardpoint + rates.SearchAndDestroy + rates.Overload) / 3;
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      {/* Debug component - remove this once everything is working */}
      <div className="mb-6">
        <ApiDebug />
      </div>

      <div className="border-4 border-dashed border-gray-600 rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">Esports Management Dashboard</h2>
          <p className="text-gray-400">Welcome to your esports team management system</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-400 mb-2">Teams</h3>
            <p className="text-2xl font-bold text-white">{teamsData?.length || 0}</p>
            <p className="text-gray-400 text-sm">Total teams</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-green-400 mb-2">Players</h3>
            <p className="text-2xl font-bold text-white">
              {teamsData?.reduce((total, team) => total + team.players.length, 0) || 0}
            </p>
            <p className="text-gray-400 text-sm">Active players</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-yellow-400 mb-2">Fixtures</h3>
            <p className="text-2xl font-bold text-white">{upcomingFixtures.length}</p>
            <p className="text-gray-400 text-sm">Upcoming matches</p>
          </div>
          
          <div className="bg-gray-800 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-purple-400 mb-2">Results</h3>
            <p className="text-2xl font-bold text-white">{recentResults.length}</p>
            <p className="text-gray-400 text-sm">Recent results</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-4">
            <a
              href="/teams"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              Manage Teams
            </a>
            <a
              href="/fixtures"
              className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              View Fixtures
            </a>
            <a
              href="/clients"
              className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
              </svg>
              Manage Clients
            </a>
          </div>
        </div>

        {upcomingFixtures.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">Recent Fixtures</h3>
            <div className="space-y-4">
              {upcomingFixtures
                .sort((a, b) => new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime())
                .slice(0, 3)
                .map((fixture) => (
                <div key={fixture.id} className="bg-gray-800 p-4 rounded-lg flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-white font-medium">{fixture.team1.name}</span>
                    <span className="text-gray-400">vs</span>
                    <span className="text-white font-medium">{fixture.team2.name}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-400">
                      {new Date(fixture.startDateTime).toLocaleDateString()}
                    </p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {fixture.league.game.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {teamsData && teamsData.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Top Teams</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamsData
                .sort((a, b) => getOverallWinRate(b) - getOverallWinRate(a))
                .slice(0, 6)
                .map((team) => (
                <div key={team.id} className="bg-gray-800 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                      <span className="text-sm font-medium text-white">
                        {team.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{team.name}</h4>
                      <p className="text-xs text-gray-400">{team.players.length} players</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center">
                      <p className="text-gray-400">HP</p>
                      <p className="text-blue-400 font-medium">
                        {(team.gameModeWinPercents.Hardpoint * 100).toFixed(0)}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400">SND</p>
                      <p className="text-green-400 font-medium">
                        {(team.gameModeWinPercents.SearchAndDestroy * 100).toFixed(0)}%
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-400">OL</p>
                      <p className="text-purple-400 font-medium">
                        {(team.gameModeWinPercents.Overload * 100).toFixed(0)}%
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}