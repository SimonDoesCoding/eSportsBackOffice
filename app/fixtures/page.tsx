'use client';

import { useState } from 'react';
import { useFixtures } from '../../hooks/useFixtures';
import { useRunSimulation } from '../../hooks/useSimulations';
import { ResultForm } from '../components/ResultForm';
import { FixtureScheduleForm } from '../components/FixtureScheduleForm';
import { Fixture, Result } from '../../types';

export default function FixturesPage() {
  const { data: fixtures, isLoading, error, refetch } = useFixtures();
  const runSimulation = useRunSimulation();
  const [resultFormOpen, setResultFormOpen] = useState(false);
  const [scheduleFormOpen, setScheduleFormOpen] = useState(false);
  const [selectedFixture, setSelectedFixture] = useState<Fixture | null>(null);
  const [editingResult, setEditingResult] = useState<Result | undefined>(undefined);

  // Type-safe helper
  const fixturesData = fixtures as Fixture[] | undefined;

  const handleScheduleMatch = () => {
    setScheduleFormOpen(true);
  };

  const handleScheduleSuccess = () => {
    refetch(); // Refresh fixtures list
    alert('Fixture scheduled successfully!');
  };

  const handleEnterResult = (fixture: Fixture) => {
    setSelectedFixture(fixture);
    setEditingResult(undefined);
    setResultFormOpen(true);
  };

  const handleViewEditResult = (fixture: Fixture) => {
    setSelectedFixture(fixture);
    setEditingResult(fixture.result);
    setResultFormOpen(true);
  };

  const handleCloseResultForm = () => {
    setResultFormOpen(false);
    setSelectedFixture(null);
    setEditingResult(undefined);
  };

  const isFixtureInPast = (startDateTime: string) => {
    return new Date(startDateTime) < new Date();
  };

  const hasResult = (fixture: Fixture) => {
    return !!fixture.result;
  };

  const handleRunSimulation = async (fixture: Fixture) => {
    try {
      const result = await runSimulation.mutateAsync(fixture.id);

      if (result.success) {
        const sim = result.simulation;
        alert(
          `Simulation Complete!\n\n` +
          `${fixture.team1.name} vs ${fixture.team2.name}\n` +
          `Predicted Score: ${sim.team1Score} - ${sim.team2Score}\n` +
          `Predicted Winner: ${sim.predictedWinner}\n` +
          `Confidence: ${(sim.confidence * 100).toFixed(1)}%\n\n` +
          `${sim.message || 'Simulation completed successfully'}`
        );
      }
    } catch (error) {
      console.error('Simulation error:', error);
      alert(
        `Simulation Failed\n\n` +
        `Unable to run simulation for ${fixture.team1.name} vs ${fixture.team2.name}.\n\n` +
        `Error: ${error instanceof Error ? error.message : 'Unknown error'}\n\n` +
        `Note: Make sure your simulation API endpoint is configured at https://api.sitechesports.com/api/simulation`
      );
    }
  };

  if (isLoading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 mb-8"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-800 rounded-lg p-6">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-red-900 border border-red-700 rounded-lg p-4">
          <h3 className="text-red-400 font-medium">Error loading fixtures</h3>
          <p className="text-red-300 text-sm mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-white">Fixtures</h1>
          <p className="mt-2 text-sm text-gray-400">
            Schedule and manage matches for {fixturesData && fixturesData.length > 0 ? fixturesData[0].league.name : 'CDL'}. Fixtures are sorted by date (most recent first).
          </p>
          {fixturesData && fixturesData.length > 0 && (
            <p className="mt-1 text-xs text-gray-500">
              Showing fixtures for {fixturesData[0].league.name} ({fixturesData[0].league.game.name})
            </p>
          )}
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={handleScheduleMatch}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-yellow-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 sm:w-auto"
          >
            Schedule Match
          </button>
        </div>
      </div>
      
      <div className="mt-8">
        {fixturesData && fixturesData.length > 0 ? (
          <div className="space-y-6">
            {fixturesData
              .sort((a, b) => new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime())
              .map((fixture) => (
              <div key={fixture.id} className="bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="flex items-center mb-2">
                          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                            <span className="text-xs font-bold text-white">
                              {fixture.team1.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <h3 className="text-lg font-medium text-white">{fixture.team1.name}</h3>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center">
                            <p className="text-gray-400">HP</p>
                            <p className="text-blue-400 font-medium">
                              {(fixture.team1.gameModeWinPercents.Hardpoint * 100).toFixed(0)}%
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-400">SND</p>
                            <p className="text-green-400 font-medium">
                              {(fixture.team1.gameModeWinPercents.SearchAndDestroy * 100).toFixed(0)}%
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-400">OL</p>
                            <p className="text-purple-400 font-medium">
                              {(fixture.team1.gameModeWinPercents.Overload * 100).toFixed(0)}%
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <span className="text-2xl font-bold text-gray-400">VS</span>
                        <p className="text-xs text-gray-500 mt-1">BO{fixture.seriesLength}</p>
                        {hasResult(fixture) && (
                          <div className="mt-2 text-sm font-bold">
                            <span className={fixture.result!.team1Score > fixture.result!.team2Score ? 'text-green-400' : 'text-gray-400'}>
                              {fixture.result!.team1Score}
                            </span>
                            <span className="text-gray-400 mx-1">-</span>
                            <span className={fixture.result!.team2Score > fixture.result!.team1Score ? 'text-green-400' : 'text-gray-400'}>
                              {fixture.result!.team2Score}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-center">
                        <div className="flex items-center mb-2">
                          <div className="h-8 w-8 rounded-full bg-red-600 flex items-center justify-center mr-3">
                            <span className="text-xs font-bold text-white">
                              {fixture.team2.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <h3 className="text-lg font-medium text-white">{fixture.team2.name}</h3>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-xs">
                          <div className="text-center">
                            <p className="text-gray-400">HP</p>
                            <p className="text-blue-400 font-medium">
                              {(fixture.team2.gameModeWinPercents.Hardpoint * 100).toFixed(0)}%
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-400">SND</p>
                            <p className="text-green-400 font-medium">
                              {(fixture.team2.gameModeWinPercents.SearchAndDestroy * 100).toFixed(0)}%
                            </p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-400">OL</p>
                            <p className="text-purple-400 font-medium">
                              {(fixture.team2.gameModeWinPercents.Overload * 100).toFixed(0)}%
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {fixture.league.game.name}
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {fixture.fixtureType.name}
                        </span>
                        {isFixtureInPast(fixture.startDateTime) && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Completed
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-400">
                        {new Date(fixture.startDateTime).toLocaleDateString()} at{' '}
                        {new Date(fixture.startDateTime).toLocaleTimeString()}
                      </p>
                      <p className="text-sm text-blue-400 mt-1">{fixture.league.name}</p>
                      
                      {/* Action Buttons */}
                      <div className="mt-3 flex flex-col gap-2">
                        {/* Simulation Button - Only for future fixtures */}
                        {!isFixtureInPast(fixture.startDateTime) && (
                          <button
                            onClick={() => handleRunSimulation(fixture)}
                            disabled={runSimulation.isPending}
                            className="inline-flex items-center justify-center px-3 py-1 text-xs bg-cyan-600 text-white rounded hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {runSimulation.isPending ? (
                              <>
                                <svg className="animate-spin w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Running...
                              </>
                            ) : (
                              <>
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                                </svg>
                                Run Simulation
                              </>
                            )}
                          </button>
                        )}
                        
                        {/* Result Action Buttons - Only for Past Fixtures */}
                        {isFixtureInPast(fixture.startDateTime) && (
                          <>
                            {hasResult(fixture) ? (
                              <button
                                onClick={() => handleViewEditResult(fixture)}
                                className="inline-flex items-center justify-center px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                              >
                                Edit Result
                              </button>
                            ) : (
                              <button
                                onClick={() => handleEnterResult(fixture)}
                                className="inline-flex items-center justify-center px-3 py-1 text-xs bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
                              >
                                Enter Result
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="text-center py-12">
                <h3 className="mt-2 text-sm font-medium text-gray-300">No fixtures</h3>
                <p className="mt-1 text-sm text-gray-400">No upcoming matches found for CDL.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Result Form Modal */}
      {selectedFixture && (
        <ResultForm 
          isOpen={resultFormOpen} 
          onClose={handleCloseResultForm}
          fixture={selectedFixture}
          result={editingResult}
        />
      )}

      {/* Schedule Fixture Form */}
      <FixtureScheduleForm
        isOpen={scheduleFormOpen}
        onClose={() => setScheduleFormOpen(false)}
        onSuccess={handleScheduleSuccess}
      />
    </div>
  );
}