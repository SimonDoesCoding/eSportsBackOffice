'use client';

import { useState, useEffect } from 'react';
import { Fixture, Result } from '../../types';

interface ResultFormProps {
  isOpen: boolean;
  onClose: () => void;
  fixture: Fixture;
  result?: Result; // Optional existing result for editing
}

export function ResultForm({ isOpen, onClose, fixture, result }: ResultFormProps) {
  const [formData, setFormData] = useState({
    team1Score: 0,
    team2Score: 0,
    completedAt: ''
  });

  const isEditing = !!result;

  // Calculate default completion time (1.5 hours after start time)
  const getDefaultCompletionTime = () => {
    const startTime = new Date(fixture.startDateTime);
    const completionTime = new Date(startTime.getTime() + (1.5 * 60 * 60 * 1000)); // Add 1.5 hours
    return completionTime.toISOString().slice(0, 16); // datetime-local format
  };

  // Populate form when editing
  useEffect(() => {
    if (result) {
      setFormData({
        team1Score: result.team1Score,
        team2Score: result.team2Score,
        completedAt: new Date(result.completedAt).toISOString().slice(0, 16)
      });
    } else {
      // Reset form for new result with default completion time
      setFormData({
        team1Score: 0,
        team2Score: 0,
        completedAt: getDefaultCompletionTime()
      });
    }
  }, [result, isOpen, fixture.startDateTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // For now, just show an alert since the results API isn't implemented yet
    const action = isEditing ? 'update' : 'create';
    const resultData = {
      fixtureId: fixture.id,
      team1Score: formData.team1Score,
      team2Score: formData.team2Score,
      completedAt: formData.completedAt
    };
    
    alert(`${action === 'create' ? 'Creating' : 'Updating'} result:\n${JSON.stringify(resultData, null, 2)}\n\nThis will be implemented when the results API endpoint is available.`);
    onClose();
  };

  const handleClose = () => {
    onClose();
    // Reset form when closing
    if (!result) {
      setFormData({
        team1Score: 0,
        team2Score: 0,
        completedAt: getDefaultCompletionTime()
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? 'Edit Result' : 'Enter Result'}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Match Info */}
        <div className="mb-6 p-4 bg-gray-700 rounded-lg">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 mb-2">
              <span className="text-white font-medium">{fixture.team1.name}</span>
              <span className="text-gray-400">vs</span>
              <span className="text-white font-medium">{fixture.team2.name}</span>
            </div>
            <p className="text-sm text-gray-400">
              {new Date(fixture.startDateTime).toLocaleDateString()} • BO{fixture.seriesLength}
            </p>
            <p className="text-xs text-blue-400">{fixture.league.name}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {fixture.team1.name} Score
              </label>
              <input
                type="number"
                min="0"
                max={Math.ceil(fixture.seriesLength / 2)}
                required
                value={formData.team1Score}
                onChange={(e) => setFormData({ ...formData, team1Score: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                {fixture.team2.name} Score
              </label>
              <input
                type="number"
                min="0"
                max={Math.ceil(fixture.seriesLength / 2)}
                required
                value={formData.team2Score}
                onChange={(e) => setFormData({ ...formData, team2Score: parseInt(e.target.value) || 0 })}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Completed At
            </label>
            <input
              type="datetime-local"
              required
              value={formData.completedAt}
              onChange={(e) => setFormData({ ...formData, completedAt: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div className="text-center text-sm text-gray-400 py-2">
            <p>Note: Results API endpoint is not yet implemented.</p>
            <p>This form will be fully functional once the API is ready.</p>
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
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              {isEditing ? 'Update Result' : 'Save Result'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}