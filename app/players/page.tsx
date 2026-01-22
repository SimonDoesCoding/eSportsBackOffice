'use client';

import { useState } from 'react';
import { useTeams } from '../../hooks/useTeams';
import { PlayerForm } from '../components/PlayerForm';

export default function PlayersPage() {
  const { data: teams, isLoading, error } = useTeams();
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Flatten all players from all teams and sort alphabetically
  const allPlayers = teams?.flatMap(team => 
    team.players.map(player => ({
      ...player,
      teamName: team.name,
      teamId: team.id
    }))
  ).sort((a, b) => a.name.localeCompare(b.name)) || [];

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
          <h3 className="text-red-400 font-medium">Error loading players</h3>
          <p className="text-red-300 text-sm mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-white">Players</h1>
          <p className="mt-2 text-sm text-gray-400">
            View player profiles and statistics across all teams. Players are sorted alphabetically.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:w-auto"
          >
            Add Player
          </button>
        </div>
      </div>
      
      <div className="mt-8">
        {allPlayers.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
            {allPlayers.map((player) => (
              <div key={player.id} className="bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-green-600 flex items-center justify-center mr-4">
                        <span className="text-lg font-bold text-white">
                          {player.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">{player.name}</h3>
                        <p className="text-sm text-gray-400">{player.teamName}</p>
                      </div>
                    </div>
                  </div>

                  {/* Game Mode Stats */}
                  <div className="space-y-4">
                    {/* Hardpoint Stats */}
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-blue-400 mb-2">Hardpoint</h4>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-gray-400">K/D Ratio</p>
                          <p className="text-white font-medium">
                            {player.gameModePlayerStats.Hardpoint.KdRatio.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Kills/Map</p>
                          <p className="text-white font-medium">
                            {player.gameModePlayerStats.Hardpoint.KillsPerMap.toFixed(1)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Deaths/Map</p>
                          <p className="text-white font-medium">
                            {player.gameModePlayerStats.Hardpoint.DeathsPerMap.toFixed(1)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Hill Time/10m</p>
                          <p className="text-white font-medium">
                            {player.gameModePlayerStats.Hardpoint.HillTimePer10Mins.toFixed(0)}s
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Search and Destroy Stats */}
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-green-400 mb-2">Search & Destroy</h4>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-gray-400">K/D Ratio</p>
                          <p className="text-white font-medium">
                            {player.gameModePlayerStats.SearchAndDestroy.KdRatio.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Opening Duel %</p>
                          <p className="text-white font-medium">
                            {(player.gameModePlayerStats.SearchAndDestroy.OpeningDuelWinPercent * 100).toFixed(0)}%
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Plants/Map</p>
                          <p className="text-white font-medium">
                            {player.gameModePlayerStats.SearchAndDestroy.PlantsPerMap.toFixed(1)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Defuses/Map</p>
                          <p className="text-white font-medium">
                            {player.gameModePlayerStats.SearchAndDestroy.DefusesPerMap.toFixed(1)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Overload Stats */}
                    <div className="bg-gray-700 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-purple-400 mb-2">Overload</h4>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <p className="text-gray-400">K/D Ratio</p>
                          <p className="text-white font-medium">
                            {player.gameModePlayerStats.Overload.KdRatio.toFixed(2)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Overloads/Map</p>
                          <p className="text-white font-medium">
                            {player.gameModePlayerStats.Overload.OverloadsPerMap.toFixed(1)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Kills/Map</p>
                          <p className="text-white font-medium">
                            {player.gameModePlayerStats.Overload.KillsPerMap.toFixed(1)}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-400">Deaths/Map</p>
                          <p className="text-white font-medium">
                            {player.gameModePlayerStats.Overload.DeathsPerMap.toFixed(1)}
                          </p>
                        </div>
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
                <h3 className="mt-2 text-sm font-medium text-gray-300">No players</h3>
                <p className="mt-1 text-sm text-gray-400">Players will appear here when teams are loaded.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Player Form Modal */}
      <PlayerForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
    </div>
  );
}