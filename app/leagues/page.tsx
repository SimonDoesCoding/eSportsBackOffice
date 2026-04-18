'use client';

import { useState } from 'react';
import { useLeagues, useCreateLeague, useDeleteLeague } from '../../hooks/useLeagues';

// Hardcoded games until a Games API endpoint is available
const GAMES = [
  { id: 'cdl', name: 'Call of Duty' },
  { id: 'cs2', name: 'Counter-Strike 2' },
  { id: 'valorant', name: 'Valorant' },
];

export default function LeaguesPage() {
  const { data: leagues, isLoading, error } = useLeagues();
  const createLeague = useCreateLeague();
  const deleteLeague = useDeleteLeague();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [gameId, setGameId] = useState(GAMES[0].id);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim()) {
      setFormError('League name is required');
      return;
    }

    try {
      await createLeague.mutateAsync({ name: name.trim(), gameId });
      setName('');
      setGameId(GAMES[0].id);
      setShowForm(false);
    } catch {
      setFormError('Failed to create league. Please try again.');
    }
  };

  const handleDelete = async (id: string, leagueName: string) => {
    if (!confirm(`Delete league "${leagueName}"?`)) return;
    try {
      await deleteLeague.mutateAsync(id);
    } catch {
      alert('Failed to delete league.');
    }
  };

  if (isLoading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
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
          <h3 className="text-red-400 font-medium">Error loading leagues</h3>
          <p className="text-red-300 text-sm mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-white">Leagues</h1>
          <p className="mt-2 text-sm text-gray-400">
            Manage leagues and competitions.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-yellow-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-yellow-700"
          >
            {showForm ? 'Cancel' : 'Create League'}
          </button>
        </div>
      </div>

      {/* Create League Form */}
      {showForm && (
        <div className="mt-6 bg-gray-800 rounded-lg p-6">
          <h3 className="text-lg font-medium text-white mb-4">New League</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="league-name" className="block text-sm font-medium text-gray-300 mb-1">
                League Name
              </label>
              <input
                id="league-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. CDL Major 4"
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                autoFocus
              />
            </div>
            <div>
              <label htmlFor="league-game" className="block text-sm font-medium text-gray-300 mb-1">
                Game
              </label>
              <select
                id="league-game"
                value={gameId}
                onChange={(e) => setGameId(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                {GAMES.map((game) => (
                  <option key={game.id} value={game.id}>{game.name}</option>
                ))}
              </select>
            </div>
            {formError && (
              <div className="p-2 bg-red-900 border border-red-700 rounded-md">
                <p className="text-red-300 text-xs">{formError}</p>
              </div>
            )}
            <button
              type="submit"
              disabled={createLeague.isPending}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {createLeague.isPending ? 'Creating...' : 'Create League'}
            </button>
          </form>
        </div>
      )}

      {/* Leagues List */}
      <div className="mt-8">
        {leagues && leagues.length > 0 ? (
          <div className="space-y-4">
            {leagues
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((league) => (
              <div key={league.id} className="bg-gray-800 rounded-lg p-6 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium text-white">{league.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                      {league.game.name}
                    </span>
                    <span className="text-gray-500 text-xs">ID: {league.id}</span>
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(league.id, league.name)}
                  disabled={deleteLeague.isPending}
                  className="text-red-400 hover:text-red-300 text-sm disabled:opacity-50"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="text-center py-12">
                <h3 className="mt-2 text-sm font-medium text-gray-300">No leagues</h3>
                <p className="mt-1 text-sm text-gray-400">Create a league to get started.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
