'use client';

import { useState } from 'react';
import { Client } from '../../types';

interface ClientDetailsModalProps {
  client: Client | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ClientDetailsModal({ client, isOpen, onClose }: ClientDetailsModalProps) {
  const [showApiKey, setShowApiKey] = useState(false);

  if (!isOpen || !client) return null;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZoneName: 'short'
    });
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text).then(() => {
      alert(`${label} copied to clipboard!`);
    }).catch(() => {
      alert(`Failed to copy ${label}`);
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'suspended': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const maskApiKey = (apiKey: string) => {
    if (apiKey.length <= 8) return apiKey;
    return `${apiKey.substring(0, 4)}${'*'.repeat(apiKey.length - 8)}${apiKey.substring(apiKey.length - 4)}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            Client Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xl"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                <p className="text-white">{client.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <p className="text-white">{client.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Company</label>
                <p className="text-white">{client.company || 'Not specified'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(client.status)}`}>
                  {client.status}
                </span>
              </div>
            </div>
          </div>

          {/* Client ID and API Access */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">API Access</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Client ID</label>
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-800 px-3 py-2 rounded text-green-400 font-mono text-sm flex-1">
                    {client.clientId}
                  </code>
                  <button
                    onClick={() => copyToClipboard(client.clientId, 'Client ID')}
                    className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">API Key</label>
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-800 px-3 py-2 rounded text-yellow-400 font-mono text-sm flex-1">
                    {showApiKey ? client.apiKey : maskApiKey(client.apiKey)}
                  </code>
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="px-3 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 text-sm"
                  >
                    {showApiKey ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => copyToClipboard(client.apiKey, 'API Key')}
                    className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">RabbitMQ Queue</label>
                <div className="flex items-center space-x-2">
                  <code className="bg-gray-800 px-3 py-2 rounded text-purple-400 font-mono text-sm flex-1">
                    {client.rabbitMqQueue}
                  </code>
                  <button
                    onClick={() => copyToClipboard(client.rabbitMqQueue, 'RabbitMQ Queue')}
                    className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Information */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Activity</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Created</label>
                <p className="text-white text-sm">{formatDate(client.createdAt)}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Last Updated</label>
                <p className="text-white text-sm">{formatDate(client.updatedAt)}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Last Activity</label>
                <p className="text-white text-sm">
                  {client.lastActivity ? formatDate(client.lastActivity) : 'No activity recorded'}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">Actions</h3>
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                Edit Client
              </button>
              <button className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors">
                Regenerate API Key
              </button>
              <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors">
                Reset Queue
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
                {client.status === 'active' ? 'Suspend Client' : 'Activate Client'}
              </button>
            </div>
          </div>

          {/* API Usage Stats (Placeholder) */}
          <div className="bg-gray-700 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-4">API Usage (Last 30 Days)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-400">1,247</p>
                <p className="text-sm text-gray-400">API Requests</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">98.5%</p>
                <p className="text-sm text-gray-400">Success Rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-400">45ms</p>
                <p className="text-sm text-gray-400">Avg Response</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              * Usage statistics are placeholder data and will be replaced with actual metrics
            </p>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}