'use client';

import { useTeams } from '../../hooks/useTeams';
import { useFixtures } from '../../hooks/useFixtures';

export function ApiDebug() {
  const { data: teams, isLoading: teamsLoading, error: teamsError } = useTeams();
  const { data: fixtures, isLoading: fixturesLoading, error: fixturesError } = useFixtures();

  return (
    <div className="bg-gray-800 p-4 rounded-lg text-sm">
      <h3 className="text-white font-medium mb-2">API Debug Info</h3>
      
      <div className="mb-2">
        <span className="text-blue-400">Teams:</span>
        {teamsLoading && <span className="text-yellow-400 ml-2">Loading...</span>}
        {teamsError && <span className="text-red-400 ml-2">Error: {teamsError.message}</span>}
        {teams && Array.isArray(teams) && <span className="text-green-400 ml-2">Loaded {teams.length} teams</span>}
      </div>
      
      <div>
        <span className="text-blue-400">Fixtures:</span>
        {fixturesLoading && <span className="text-yellow-400 ml-2">Loading...</span>}
        {fixturesError && <span className="text-red-400 ml-2">Error: {fixturesError.message}</span>}
        {fixtures && Array.isArray(fixtures) && <span className="text-green-400 ml-2">Loaded {fixtures.length} fixtures</span>}
      </div>
    </div>
  );
}