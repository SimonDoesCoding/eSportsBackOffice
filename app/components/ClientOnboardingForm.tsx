'use client';

import { useState } from 'react';
import { useOnboardClient } from '../../hooks/useClients';
import { CreateClientRequest, OnboardClientResponse } from '../../types';

interface ClientOnboardingFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (response: OnboardClientResponse) => void;
}

export function ClientOnboardingForm({ isOpen, onClose, onSuccess }: ClientOnboardingFormProps) {
  const [formData, setFormData] = useState<CreateClientRequest>({
    name: '',
    email: '',
    company: ''
  });

  const onboardMutation = useOnboardClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const response = await onboardMutation.mutateAsync(formData);
      
      if (response.success) {
        onSuccess?.(response);
        onClose();
        // Reset form
        setFormData({
          name: '',
          email: '',
          company: ''
        });
      }
    } catch (error) {
      console.error('Failed to onboard client:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">
            Onboard New Client
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <div className="mb-4 p-3 bg-blue-900 border border-blue-700 rounded-md">
          <p className="text-blue-300 text-sm">
            This will automatically generate API key, create RabbitMQ queue, and assign client ID.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Client Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter client name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="client@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Company (Optional)
            </label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Company name"
            />
          </div>

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
              disabled={onboardMutation.isPending}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              {onboardMutation.isPending ? 'Onboarding...' : 'Onboard Client'}
            </button>
          </div>
        </form>

        {onboardMutation.error && (
          <div className="mt-4 p-3 bg-red-900 border border-red-700 rounded-md">
            <p className="text-red-300 text-sm">
              Failed to onboard client: {onboardMutation.error.message}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}