'use client';

import { useState } from 'react';
import { useTeams } from '../../hooks/useTeams';

interface PlayerFormProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PlayerForm({ isOpen, onClose }: PlayerFormProps) {
  const { data: teams } = useTeams();
  const [formData, setFormData] = useState({
    name: '',
    teamId: '',
    // Default stats structure
    gameModePlayerStats: {
      Hardpoint: {
        KillsPerMap: 0,
        DeathsPerMap: 0,
        KdRatio: 0,
        HillTimePer10Mins: 0
      },
      SearchAndDestroy: {
        KillsPerMap: 0,
        DeathsPerMap: 0,
        KdRatio: 0,
        PlantsPerMap: 0,
        DefusesPerMap: 0,
        KillsPerRound: 0,
        DeathsPerRound: 0,
        OpeningDuelsWon: 0,
        OpeningDuelsLost: 0,
        OpeningDuelWinPercent: 0
      },
      Overload: {
        KillsPerMap: 0,
        DeathsPerMap: 0,
        KdRatio: 0,
        OverloadsPerMap: 0
      }
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // For now, just show an alert since we don't have a player creation API yet
    alert('Player creation will be implemented when the API endpoint is available');
    onClose();
    
    // Reset form
    setFormData({
      name: '',
      teamId: '',
      gameModePlayerStats: {
        Hardpoint: {
          KillsPerMap: 0,
          DeathsPerMap: 0,
          KdRatio: 0,
          HillTimePer10Mins: 0
        },
        SearchAndDestroy: {
          KillsPerMap: 0,
          DeathsPerMap: 0,
          KdRatio: 0,
          PlantsPerMap: 0,
          DefusesPerMap: 0,
          KillsPerRound: 0,
          DeathsPerRound: 0,
          OpeningDuelsWon: 0,
          OpeningDuelsLost: 0,
          OpeningDuelWinPercent: 0
        },
        Overload: {
          KillsPerMap: 0,
          DeathsPerMap: 0,
          KdRatio: 0,
          OverloadsPerMap: 0
        }
      }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Add New Player</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Player Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter player name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Team
            </label>
            <select
              required
              value={formData.teamId}
              onChange={(e) => setFormData({ ...formData, teamId: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Select a team</option>
              {teams?.sort((a, b) => a.name.localeCompare(b.name)).map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-sm font-medium text-blue-400 mb-3">Hardpoint Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-400 mb-1">Kills/Map</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.gameModePlayerStats.Hardpoint.KillsPerMap}
                  onChange={(e) => setFormData({
                    ...formData,
                    gameModePlayerStats: {
                      ...formData.gameModePlayerStats,
                      Hardpoint: {
                        ...formData.gameModePlayerStats.Hardpoint,
                        KillsPerMap: parseFloat(e.target.value) || 0
                      }
                    }
                  })}
                  className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">Deaths/Map</label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.gameModePlayerStats.Hardpoint.DeathsPerMap}
                  onChange={(e) => setFormData({
                    ...formData,
                    gameModePlayerStats: {
                      ...formData.gameModePlayerStats,
                      Hardpoint: {
                        ...formData.gameModePlayerStats.Hardpoint,
                        DeathsPerMap: parseFloat(e.target.value) || 0
                      }
                    }
                  })}
                  className="w-full px-2 py-1 bg-gray-600 border border-gray-500 rounded text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-gray-400 py-4">
            <p>Note: Player creation API endpoint is not yet implemented.</p>
            <p>This form will be fully functional once the API is ready.</p>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Create Player
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}