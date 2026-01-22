'use client';

import { useState, useEffect } from 'react';
import { useCreateTeam, useUpdateTeam } from '../../hooks/useTeams';
import { Team, GameModeWinPercents } from '../../types';

interface TeamFormProps {
  isOpen: boolean;
  onClose: () => void;
  team?: Team; // Optional team for editing
}

export function TeamForm({ isOpen, onClose, team }: TeamFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    lastRosterChangeDate: new Date().toISOString().split('T')[0],
    recentFormModifier: 1,
    monthsSinceLastRosterChange: 0,
    gameModeWinPercents: {
      Hardpoint: 0,
      SearchAndDestroy: 0,
      Overload: 0
    }
  });

  const createTeamMutation = useCreateTeam();
  const updateTeamMutation = useUpdateTeam();
  const isEditing = !!team;

  // Populate form when editing
  useEffect(() => {
    if (team) {
      setFormData({
        name: team.name,
        lastRosterChangeDate: team.lastRosterChangeDate.split('T')[0],
        recentFormModifier: team.recentFormModifier,
        monthsSinceLastRosterChange: team.monthsSinceLastRosterChange,
        gameModeWinPercents: {
          Hardpoint: Math.round(team.gameModeWinPercents.Hardpoint * 100),
          SearchAndDestroy: Math.round(team.gameModeWinPercents.SearchAndDestroy * 100),
          Overload: Math.round(team.gameModeWinPercents.Overload * 100)
        }
      });
    } else {
      // Reset form for creating new team
      setFormData({
        name: '',
        lastRosterChangeDate: new Date().toISOString().split('T')[0],
        recentFormModifier: 1,
        monthsSinceLastRosterChange: 0,
        gameModeWinPercents: {
          Hardpoint: 0,
          SearchAndDestroy: 0,
          Overload: 0
        }
      });
    }
  }, [team, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const teamData = {
        ...formData,
        gameModeWinPercents: {
          Hardpoint: formData.gameModeWinPercents.Hardpoint / 100,
          SearchAndDestroy: formData.gameModeWinPercents.SearchAndDestroy / 100,
          Overload: formData.gameModeWinPercents.Overload / 100
        },
        players: team?.players || []
      };

      if (isEditing && team) {
        // For updating, include the team id and all required fields
        const updateData = {
          id: team.id,
          ...teamData
        };
        await updateTeamMutation.mutateAsync(updateData);
      } else {
        await createTeamMutation.mutateAsync(teamData);
      }
      
      onClose();
    } catch (error) {
      console.error(`Failed to ${isEditing ? 'update' : 'create'} team:`, error);
    }
  };

  const handleClose = () => {
    onClose();
    // Reset form when closing
    if (!team) {
      setFormData({
        name: '',
        lastRosterChangeDate: new Date().toISOString().split('T')[0],
        recentFormModifier: 1,
        monthsSinceLastRosterChange: 0,
        gameModeWinPercents: {
          Hardpoint: 0,
          SearchAndDestroy: 0,
          Overload: 0
        }
      });
    }
  };

  if (!isOpen) return null;

  const mutation = isEditing ? updateTeamMutation : createTeamMutation;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? 'Edit Team' : 'Add New Team'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Team Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter team name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Last Roster Change Date
            </label>
            <input
              type="date"
              value={formData.lastRosterChangeDate}
              onChange={(e) => setFormData({ ...formData, lastRosterChangeDate: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Months Since Last Roster Change
            </label>
            <input
              type="number"
              min="0"
              value={formData.monthsSinceLastRosterChange}
              onChange={(e) => setFormData({ ...formData, monthsSinceLastRosterChange: parseInt(e.target.value) || 0 })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300">
              Game Mode Win Percentages
            </label>
            
            <div>
              <label className="block text-xs text-gray-400 mb-1">Hardpoint (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.gameModeWinPercents.Hardpoint}
                onChange={(e) => setFormData({
                  ...formData,
                  gameModeWinPercents: {
                    ...formData.gameModeWinPercents,
                    Hardpoint: parseInt(e.target.value) || 0
                  }
                })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Search & Destroy (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.gameModeWinPercents.SearchAndDestroy}
                onChange={(e) => setFormData({
                  ...formData,
                  gameModeWinPercents: {
                    ...formData.gameModeWinPercents,
                    SearchAndDestroy: parseInt(e.target.value) || 0
                  }
                })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs text-gray-400 mb-1">Overload (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={formData.gameModeWinPercents.Overload}
                onChange={(e) => setFormData({
                  ...formData,
                  gameModeWinPercents: {
                    ...formData.gameModeWinPercents,
                    Overload: parseInt(e.target.value) || 0
                  }
                })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {mutation.isPending 
                ? (isEditing ? 'Updating...' : 'Creating...') 
                : (isEditing ? 'Update Team' : 'Create Team')
              }
            </button>
          </div>
        </form>

        {mutation.error && (
          <div className="mt-4 p-3 bg-red-900 border border-red-700 rounded-md">
            <p className="text-red-300 text-sm">
              Failed to {isEditing ? 'update' : 'create'} team: {mutation.error.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}