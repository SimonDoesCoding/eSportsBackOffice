'use client';

import { useState, useRef, useCallback } from 'react';

interface LogEntry {
  type: string;
  message: string;
  timestamp: string;
}

const COMMANDS = [
  { id: 'all', label: 'Run All', description: 'Completed + Upcoming + Player Stats + Team Stats + Challengers' },
  { id: 'completed', label: 'Completed Matches', description: 'Scrape recent completed match results' },
  { id: 'upcoming', label: 'Upcoming Matches', description: 'Scrape upcoming fixtures' },
  { id: 'player-stats', label: 'Player Stats', description: 'Update CDL player statistics' },
  { id: 'team-stats', label: 'Team Stats', description: 'Update CDL team statistics' },
  { id: 'challenger-stats', label: 'Challenger Stats', description: 'Update Challengers player & team stats' },
];

const TYPE_COLORS: Record<string, string> = {
  header: 'text-yellow-400 font-bold',
  skip: 'text-gray-500',
  created: 'text-green-400',
  processing: 'text-blue-400',
  error: 'text-red-400',
  success: 'text-green-300 font-bold',
  info: 'text-gray-300',
};

export default function ScraperPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [running, setRunning] = useState(false);
  const [activeCommand, setActiveCommand] = useState<string | null>(null);
  const [stats, setStats] = useState({ created: 0, skipped: 0, errors: 0 });
  const logEndRef = useRef<HTMLDivElement>(null);

  const runScraper = useCallback(async (command: string) => {
    setRunning(true);
    setActiveCommand(command);
    setLogs([]);
    setStats({ created: 0, skipped: 0, errors: 0 });

    try {
      const res = await fetch('/api/scraper/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command }),
      });

      if (!res.body) throw new Error('No response body');

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (!line.trim()) continue;
          try {
            const entry: LogEntry = JSON.parse(line);
            setLogs(prev => [...prev, entry]);
            setStats(prev => ({
              created: prev.created + (entry.type === 'created' ? 1 : 0),
              skipped: prev.skipped + (entry.type === 'skip' ? 1 : 0),
              errors: prev.errors + (entry.type === 'error' ? 1 : 0),
            }));
            logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
          } catch { /* skip malformed lines */ }
        }
      }
    } catch (err) {
      setLogs(prev => [...prev, { type: 'error', message: `Request failed: ${err instanceof Error ? err.message : 'Unknown'}`, timestamp: new Date().toISOString() }]);
    }

    setRunning(false);
    setActiveCommand(null);
  }, []);

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="sm:flex sm:items-center mb-6">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-white">Scraper</h1>
          <p className="mt-2 text-sm text-gray-400">
            Run the CDL stat scraper to sync data from Breaking Point. Output streams in real-time.
          </p>
        </div>
      </div>

      {/* Command Buttons */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {COMMANDS.map(cmd => (
          <button
            key={cmd.id}
            onClick={() => runScraper(cmd.id)}
            disabled={running}
            className={`p-4 rounded-lg text-left transition-all ${
              running && activeCommand === cmd.id
                ? 'bg-blue-900 border-2 border-blue-400'
                : running
                ? 'bg-gray-800 opacity-50 cursor-not-allowed'
                : 'bg-gray-800 hover:bg-gray-700 border-2 border-transparent hover:border-gray-600'
            }`}
          >
            <div className="font-medium text-white text-sm">{cmd.label}</div>
            <div className="text-xs text-gray-400 mt-1">{cmd.description}</div>
            {running && activeCommand === cmd.id && (
              <div className="mt-2 flex items-center">
                <svg className="animate-spin w-4 h-4 text-blue-400 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-xs text-blue-400">Running...</span>
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Stats Bar */}
      {logs.length > 0 && (
        <div className="flex gap-4 mb-4 text-sm">
          <span className="text-green-400">✓ Created: {stats.created}</span>
          <span className="text-gray-500">○ Skipped: {stats.skipped}</span>
          <span className="text-red-400">✗ Errors: {stats.errors}</span>
          <span className="text-gray-400">Total lines: {logs.length}</span>
        </div>
      )}

      {/* Log Output */}
      <div className="bg-gray-950 rounded-lg border border-gray-700 p-4 h-[500px] overflow-y-auto font-mono text-xs">
        {logs.length === 0 && !running && (
          <p className="text-gray-600">Select a command above to start the scraper...</p>
        )}
        {logs.map((entry, i) => (
          <div key={i} className={`py-0.5 ${TYPE_COLORS[entry.type] || 'text-gray-300'}`}>
            <span className="text-gray-600 mr-2">{new Date(entry.timestamp).toLocaleTimeString()}</span>
            {entry.message}
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
}
