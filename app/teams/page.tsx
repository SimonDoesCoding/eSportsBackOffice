'use client';

import { useState } from 'react';
import { useTeams } from '../../hooks/useTeams';
import { TeamForm } from '../components/TeamForm';
import { Team } from '../../types';

export default function TeamsPage() {
  const { data: teams, isLoading, error } = useTeams();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | undefined>(undefined);

  const handleAddTeam = () => {
    setEditingTeam(undefined);
    setIsFormOpen(true);
  };

  const handleEditTeam = (team: Team) => {
    setEditingTeam(team);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTeam(undefined);
  };

  if (isLoading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 mb-8"></div>
          <div className="bg-gray-800 rounded-lg p-6">
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="bg-red-900 border border-red-700 rounded-lg p-4">
          <h3 className="text-red-400 font-medium">Error loading teams</h3>
          <p className="text-red-300 text-sm mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-white">Teams</h1>
          <p className="mt-2 text-sm text-gray-400">
            Manage your esports teams and rosters. Teams are sorted alphabetically. Click on a team name to edit.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            type="button"
            onClick={handleAddTeam}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
          >
            Add Team
          </button>
        </div>
      </div>
      
      <div className="mt-8">
        {teams && teams.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {teams
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((team) => (
              <div key={team.id} className="bg-gray-800 overflow-hidden shadow rounded-lg">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-blue-600 flex items-center justify-center mr-4">
                        <span className="text-lg font-bold text-white">
                          {team.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <button
                          onClick={() => handleEditTeam(team)}
                          className="text-xl font-bold text-white hover:text-blue-400 transition-colors duration-200 text-left"
                        >
                          {team.name}
                        </button>
                        <p className="text-sm text-gray-400">
                          {team.players.length} players • {team.monthsSinceLastRosterChange} months since roster change
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Click to edit team details
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => handleEditTeam(team)}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Are you sure you want to delete ${team.name}? This action cannot be undone.`)) {
                            // TODO: Implement delete functionality
                            alert('Delete functionality will be implemented when needed');
                          }
                        }}
                        className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  {/* Game Mode Win Percentages */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium text-gray-300 mb-3">Game Mode Win Rates</h4>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center">
                        <p className="text-xs font-medium text-gray-400">Hardpoint</p>
                        <p className="text-lg font-bold text-blue-400">
                          {(team.gameModeWinPercents.Hardpoint * 100).toFixed(0)}%
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-medium text-gray-400">Search & Destroy</p>
                        <p className="text-lg font-bold text-green-400">
                          {(team.gameModeWinPercents.SearchAndDestroy * 100).toFixed(0)}%
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-xs font-medium text-gray-400">Overload</p>
                        <p className="text-lg font-bold text-purple-400">
                          {(team.gameModeWinPercents.Overload * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Players */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-3">Players</h4>
                    {team.players.length > 0 ? (
                      <div className="space-y-2">
                        {team.players
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((player) => (
                          <div key={player.id} className="flex items-center justify-between bg-gray-700 rounded-lg p-3">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-gray-600 flex items-center justify-center mr-3">
                                <span className="text-xs font-medium text-white">
                                  {player.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span className="text-white font-medium">{player.name}</span>
                            </div>
                            <div className="flex space-x-3 text-xs">
                              <div className="text-center">
                                <p className="text-gray-400">HP K/D</p>
                                <p className="text-white font-medium">
                                  {player.gameModePlayerStats.Hardpoint.KdRatio.toFixed(2)}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-gray-400">SND K/D</p>
                                <p className="text-white font-medium">
                                  {player.gameModePlayerStats.SearchAndDestroy.KdRatio.toFixed(2)}
                                </p>
                              </div>
                              <div className="text-center">
                                <p className="text-gray-400">OL K/D</p>
                                <p className="text-white font-medium">
                                  {player.gameModePlayerStats.Overload.KdRatio.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 bg-gray-700 rounded-lg">
                        <p className="text-gray-400 text-sm">No players assigned</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="text-center py-12">
                <h3 className="mt-2 text-sm font-medium text-gray-300">No teams</h3>
                <p className="mt-1 text-sm text-gray-400">Get started by creating your first team.</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Team Form Modal */}
      <TeamForm 
        isOpen={isFormOpen} 
        onClose={handleCloseForm}
        team={editingTeam}
      />
    </div>
  );
}