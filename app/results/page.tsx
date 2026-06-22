'use client';

import { useState, useEffect } from 'react';
import { getTeamConfig } from '../../utils/teamConfig';
import { FixtureService } from '../../Services/FixtureService';
import { Result } from '../../types';
import Image from 'next/image';

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    FixtureService.getResults()
      .then(data => { setResults(Array.isArray(data) ? data : []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading results...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-white">Match Results</h1>
          <p className="mt-2 text-sm text-gray-400">
            Completed matches from the CDL season ({results.length} results)
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        {results.length === 0 ? (
          <div className="bg-gray-800 rounded-lg p-12 text-center">
            <p className="text-gray-400">No results found. Run the scraper to import completed matches.</p>
          </div>
        ) : (
          results.map((r) => {
            const t1Won = r.team1Score > r.team2Score;
            const t2Won = r.team2Score > r.team1Score;
            const t1Config = getTeamConfig(r.team1Name);
            const t2Config = getTeamConfig(r.team2Name);
            const isExpanded = expanded === r.id;

            return (
              <div key={r.id} className="bg-gray-800 rounded-lg overflow-hidden">
                <div
                  className="p-5 cursor-pointer hover:bg-gray-750 transition-colors"
                  onClick={() => setExpanded(isExpanded ? null : r.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 flex items-center justify-end gap-3">
                      <span className={"text-lg font-semibold " + (t1Won ? "text-green-400" : "text-white")}>{r.team1Name}</span>
                      {t1Config.logo ? (
                        <Image src={t1Config.logo} alt={r.team1Name} width={36} height={36} />
                      ) : (
                        <div className="h-9 w-9 rounded-full flex items-center justify-center" style={{ backgroundColor: t1Config.color }}>
                          <span className="text-xs font-bold text-white">{r.team1Name.charAt(0)}</span>
                        </div>
                      )}
                    </div>

                    <div className="px-6 text-center min-w-[140px]">
                      <div className="flex items-center justify-center gap-3">
                        <span className={"text-3xl font-bold " + (t1Won ? "text-green-400" : "text-gray-500")}>{r.team1Score}</span>
                        <span className="text-xl text-gray-600">-</span>
                        <span className={"text-3xl font-bold " + (t2Won ? "text-green-400" : "text-gray-500")}>{r.team2Score}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{new Date(r.startDate).toLocaleDateString()}</p>
                    </div>

                    <div className="flex-1 flex items-center gap-3">
                      {t2Config.logo ? (
                        <Image src={t2Config.logo} alt={r.team2Name} width={36} height={36} />
                      ) : (
                        <div className="h-9 w-9 rounded-full flex items-center justify-center" style={{ backgroundColor: t2Config.color }}>
                          <span className="text-xs font-bold text-white">{r.team2Name.charAt(0)}</span>
                        </div>
                      )}
                      <span className={"text-lg font-semibold " + (t2Won ? "text-green-400" : "text-white")}>{r.team2Name}</span>
                    </div>

                    <svg className={"w-5 h-5 text-gray-400 ml-4 transition-transform " + (isExpanded ? "rotate-180" : "")} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                {isExpanded && r.maps.length > 0 && (
                  <div className="border-t border-gray-700 px-5 py-4">
                    <div className="space-y-2">
                      {r.maps.map((m, i) => {
                        const t1MapWon = m.team1Score > m.team2Score;
                        const t2MapWon = m.team2Score > m.team1Score;
                        return (
                          <div key={i} className="flex items-center justify-between bg-gray-900 rounded-lg px-4 py-3">
                            <span className="text-sm text-gray-400 w-24">Map {m.mapIndex}</span>
                            <span className="text-sm text-gray-400 w-32 text-center">{m.gameMode}</span>
                            <span className="text-sm text-gray-500 w-28 text-center">{m.mapName}</span>
                            <div className="flex items-center gap-3 w-24 justify-center">
                              <span className={"text-lg font-bold " + (t1MapWon ? "text-green-400" : "text-gray-500")}>{m.team1Score}</span>
                              <span className="text-gray-600">-</span>
                              <span className={"text-lg font-bold " + (t2MapWon ? "text-green-400" : "text-gray-500")}>{m.team2Score}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
