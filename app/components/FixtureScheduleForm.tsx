'use client';

import { useState, useEffect } from 'react';
import { useTeams } from '../../hooks/useTeams';
import { useFixtureTypes } from '../../hooks/useFixtures';
import { Team, FixtureType } from '../../types';

interface FixtureScheduleFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface FixtureFormData {
  team1Id: string;
  team2Id: string;
  seriesLength: number;
  fixtureTypeId: string;
  leagueId: string;
  startDateTime: string;
}

export function FixtureScheduleForm({ isOpen, onClose, onSuccess }: FixtureScheduleFormProps) {
  const { data: teams } = useTeams();
  const { data: fixtureTypes, isLoading: fixtureTypesLoading } = useFixtureTypes();
  const [formData, setFormData] = useState<FixtureFormData>({
    team1Id: '',
    team2Id: '',
    seriesLength: 5,
    fixtureTypeId: '',
    leagueId: 'a85df024-6762-4f84-8a14-2fe8e4b72bdd', // CDL league ID
    startDateTime: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const teamsData = teams as Team[] | undefined;
  const fixtureTypesData = fixtureTypes as FixtureType[] | undefined;

  // Set default date/time to tomorrow at 6 PM
  useEffect(() => {
    if (isOpen && !formData.startDateTime) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(18, 0, 0, 0);
      setFormData(prev => ({
        ...prev,
        startDateTime: tomorrow.toISOString().slice(0, 16)
      }));
    }
  }, [isOpen, formData.startDateTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.team1Id || !formData.team2Id) {
      setError('Please select both teams');
      return;
    }

    if (formData.team1Id === formData.team2Id) {
      setError('Please select different teams');
      return;
    }

    if (!formData.startDateTime) {
      setError('Please select a date and time');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('http://82.165.193.29:5050/api/Fixtures', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          team1Id: formData.team1Id,
          team2Id: formData.team2Id,
          seriesLength: formData.seriesLength,
          fixtureTypeId: formData.fixtureTypeId || null,
          leagueId: formData.leagueId,
          startDateTime: new Date(formData.startDateTime).toISOString()
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to schedule fixture: ${response.statusText}`);
      }

      // Success
      onSuccess?.();
      onClose();
      
      // Reset form
      setFormData({
        team1Id: '',
        team2Id: '',
        seriesLength: 5,
        fixtureTypeId: '',
        leagueId: 'a85df024-6762-4f84-8a14-2fe8e4b72bdd',
        startDateTime: ''
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to schedule fixture');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            Schedule New Fixture
          </h2>
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
              Team 1 *
            </label>
            <select
              required
              value={formData.team1Id}
              onChange={(e) => setFormData({ ...formData, team1Id: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Team 1</option>
              {teamsData?.sort((a, b) => a.name.localeCompare(b.name)).map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Team 2 *
            </label>
            <select
              required
              value={formData.team2Id}
              onChange={(e) => setFormData({ ...formData, team2Id: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select Team 2</option>
              {teamsData?.sort((a, b) => a.name.localeCompare(b.name)).map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Series Length *
            </label>
            <select
              required
              value={formData.seriesLength}
              onChange={(e) => setFormData({ ...formData, seriesLength: parseInt(e.target.value) })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">Best of 1 (BO1)</option>
              <option value="3">Best of 3 (BO3)</option>
              <option value="5">Best of 5 (BO5)</option>
              <option value="7">Best of 7 (BO7)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Match Date & Time *
            </label>
            <input
              type="datetime-local"
              required
              value={formData.startDateTime}
              onChange={(e) => setFormData({ ...formData, startDateTime: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Fixture Type
            </label>
            <select
              value={formData.fixtureTypeId}
              onChange={(e) => setFormData({ ...formData, fixtureTypeId: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={fixtureTypesLoading}
            >
              <option value="">Select Fixture Type (Optional)</option>
              {fixtureTypesData?.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            {fixtureTypesLoading && (
              <p className="text-xs text-gray-400 mt-1">Loading fixture types...</p>
            )}
          </div>

          {error && (
            <div className="p-3 bg-red-900 border border-red-700 rounded-md">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Scheduling...' : 'Schedule Fixture'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
