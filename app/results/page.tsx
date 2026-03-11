'use client';

import { useFixtures } from '../../hooks/useFixtures';
import { Fixture } from '../../types';

export default function ResultsPage() {
  const { data: fixtures, isLoading, error } = useFixtures();

  const fixturesData = fixtures as Fixture[] | undefined;

  // Filter fixtures that have results
  const fixturesWithResults = fixturesData?.filter(f => f.result) || [];

  // Sort by most recent first
  const sortedResults = [...fixturesWithResults].sort((a, b) => 
    new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime()
  );

  if (isLoading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading results...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-red-900 border border-red-700 rounded-md p-4">
          <p className="text-red-300">Error loading results: {error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-white">Match Results</h1>
          <p className="mt-2 text-sm text-gray-400">
            View completed match results and scores
          </p>
        </div>
      </div>
      
      <div className="mt-8">
        {sortedResults.length === 0 ? (
          <div className="bg-gray-800 shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-300">No results yet</h3>
                <p className="mt-1 text-sm text-gray-400">Results will appear here once matches are completed.</p>
                <div className="mt-6">
                  <a
                    href="/fixtures"
                    className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                  >
                    Go to Fixtures
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedResults.map((fixture) => {
              const result = fixture.result!;
              const team1Won = result.team1Score > result.team2Score;
              const team2Won = result.team2Score > result.team1Score;
              
              return (
                <div key={fixture.id} className="bg-gray-800 overflow-hidden shadow rounded-lg">
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      {/* Team 1 */}
                      <div className="flex-1 text-center">
                        <div className="flex items-center justify-center mb-2">
                          <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                            <span className="text-sm font-bold text-white">
                              {fixture.team1.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <h3 className={`text-xl font-medium ${team1Won ? 'text-green-400' : 'text-white'}`}>
                            {fixture.team1.name}
                          </h3>
                        </div>
                      </div>

                      {/* Score */}
                      <div className="px-8 text-center">
                        <div className="flex items-center space-x-4">
                          <div className={`text-4xl font-bold ${team1Won ? 'text-green-400' : 'text-gray-400'}`}>
                            {result.team1Score}
                          </div>
                          <div className="text-2xl text-gray-500">-</div>
                          <div className={`text-4xl font-bold ${team2Won ? 'text-green-400' : 'text-gray-400'}`}>
                            {result.team2Score}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">BO{fixture.seriesLength}</p>
                      </div>

                      {/* Team 2 */}
                      <div className="flex-1 text-center">
                        <div className="flex items-center justify-center mb-2">
                          <h3 className={`text-xl font-medium ${team2Won ? 'text-green-400' : 'text-white'}`}>
                            {fixture.team2.name}
                          </h3>
                          <div className="h-10 w-10 rounded-full bg-red-600 flex items-center justify-center ml-3">
                            <span className="text-sm font-bold text-white">
                              {fixture.team2.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Match Details */}
                    <div className="mt-4 pt-4 border-t border-gray-700">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {fixture.league.game.name}
                          </span>
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {fixture.fixtureType.name}
                          </span>
                          <span className="text-gray-400">{fixture.league.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="text-gray-400">
                            {new Date(fixture.startDateTime).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </p>
                          <p className="text-xs text-gray-500">
                            Completed: {new Date(result.completedAt).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
