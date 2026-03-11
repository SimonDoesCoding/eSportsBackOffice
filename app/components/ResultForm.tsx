'use client';

import { useState, useEffect } from 'react';
import { Fixture, CreateResultRequest, MapResult, GameModeType, StatType } from '../../types';

interface ResultFormProps {
  isOpen: boolean;
  onClose: () => void;
  fixture: Fixture;
}

type Stage = 'team-scores' | 'map-scores' | 'player-stats';

// Hardcoded game modes until API endpoint is ready
const HARDCODED_GAME_MODES: GameModeType[] = [
  {
    id: "a3f11392-7e12-4ff5-8a6f-fb08c2f93571",
    name: "Hardpoint"
  },
  {
    id: "2d2f937c-6d29-4882-a5c8-f2d88639030c",
    name: "SearchDestroy"
  },
  {
    id: "0d01b136-f7b6-4965-bf06-6d720e0929bc",
    name: "Overload"
  }
];

// Hardcoded stats by game mode until API endpoint is ready
const HARDCODED_STATS_BY_GAME_MODE: Record<string, StatType[]> = {
  // Hardpoint stats
  "a3f11392-7e12-4ff5-8a6f-fb08c2f93571": [
    { id: "c67de129-0c31-4a59-8818-49f0409c89a2", name: "Kills", abbreviation: "K" },
    { id: "a325cf26-8ff9-4303-8b35-4ed03134f8d9", name: "Deaths", abbreviation: "D" },
    { id: "db7bbce5-42de-4a62-8a45-088c7b156375", name: "Hill Time", abbreviation: "HT" },
    { id: "c7cefe84-30e5-48f9-b5bf-491f14c2f3d0", name: "Objective Kills", abbreviation: "Obj K" }
  ],
  // SearchDestroy stats
  "2d2f937c-6d29-4882-a5c8-f2d88639030c": [
    { id: "c67de129-0c31-4a59-8818-49f0409c89a2", name: "Kills", abbreviation: "K" },
    { id: "a325cf26-8ff9-4303-8b35-4ed03134f8d9", name: "Deaths", abbreviation: "D" },
    { id: "a98d3d16-ddc4-46c9-8279-adf79fff7152", name: "Plants", abbreviation: "P" },
    { id: "dfa06b8c-a62a-412b-9709-a86eba949385", name: "Defuses", abbreviation: "Def" },
    { id: "a4cf810b-d638-4217-9fff-e5d9935f0007", name: "First Bloods", abbreviation: "FB" },
    { id: "811ced1e-d155-44c3-90ab-bb0759dae768", name: "First Deaths", abbreviation: "FD" }
  ],
  // Overload stats
  "0d01b136-f7b6-4965-bf06-6d720e0929bc": [
    { id: "c67de129-0c31-4a59-8818-49f0409c89a2", name: "Kills", abbreviation: "K" },
    { id: "a325cf26-8ff9-4303-8b35-4ed03134f8d9", name: "Deaths", abbreviation: "D" },
    { id: "1a8e94c1-442e-42b4-a75e-a3d4abc901c9", name: "Objectives", abbreviation: "Obj" },
    { id: "c7cefe84-30e5-48f9-b5bf-491f14c2f3d0", name: "Objective Kills", abbreviation: "Obj K" }
  ]
};

const getStatsForGameMode = (gameModeId: string): StatType[] => {
  return HARDCODED_STATS_BY_GAME_MODE[gameModeId] || [];
};

// Map order: HP, SD, OL, HP, SD, OL, SD
const MAP_GAME_MODE_ORDER = [
  "a3f11392-7e12-4ff5-8a6f-fb08c2f93571", // 1. Hardpoint
  "2d2f937c-6d29-4882-a5c8-f2d88639030c", // 2. SearchDestroy
  "0d01b136-f7b6-4965-bf06-6d720e0929bc", // 3. Overload
  "a3f11392-7e12-4ff5-8a6f-fb08c2f93571", // 4. Hardpoint
  "2d2f937c-6d29-4882-a5c8-f2d88639030c", // 5. SearchDestroy
  "0d01b136-f7b6-4965-bf06-6d720e0929bc", // 6. Overload
  "2d2f937c-6d29-4882-a5c8-f2d88639030c"  // 7. SearchDestroy
];

const getGameModeForMap = (mapNumber: number): string => {
  // mapNumber is 1-indexed, array is 0-indexed
  return MAP_GAME_MODE_ORDER[mapNumber - 1] || MAP_GAME_MODE_ORDER[0];
};

const getDefaultScoreForGameMode = (gameModeId: string): number => {
  // Hardpoint ID
  if (gameModeId === "a3f11392-7e12-4ff5-8a6f-fb08c2f93571") {
    return 250;
  }
  // SearchDestroy ID
  if (gameModeId === "2d2f937c-6d29-4882-a5c8-f2d88639030c") {
    return 6;
  }
  // Overload - no default specified, use 0
  return 0;
};

const isSweep = (team1Score: number, team2Score: number): boolean => {
  return (team1Score === 3 && team2Score === 0) ||
         (team1Score === 0 && team2Score === 3) ||
         (team1Score === 5 && team2Score === 0) ||
         (team1Score === 0 && team2Score === 5);
};

export function ResultForm({ isOpen, onClose, fixture }: ResultFormProps) {
  // Use hardcoded game modes for now
  const gameModes = HARDCODED_GAME_MODES;
  
  const [stage, setStage] = useState<Stage>('team-scores');
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [maps, setMaps] = useState<MapResult[]>([]);
  const [currentMapIndex, setCurrentMapIndex] = useState(0);
  const [currentTeam, setCurrentTeam] = useState<'team1' | 'team2'>('team1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasDraft, setHasDraft] = useState(false);

  const team1Players = fixture.team1.players;
  const team2Players = fixture.team2.players;

  // LocalStorage key for this fixture
  const storageKey = `result-draft-${fixture.id}`;

  // Load draft from localStorage
  useEffect(() => {
    if (isOpen) {
      const savedDraft = localStorage.getItem(storageKey);
      if (savedDraft) {
        try {
          const draft = JSON.parse(savedDraft);
          setTeam1Score(draft.team1Score || 0);
          setTeam2Score(draft.team2Score || 0);
          setMaps(draft.maps || []);
          setStage(draft.stage || 'team-scores');
          setCurrentMapIndex(draft.currentMapIndex || 0);
          setCurrentTeam(draft.currentTeam || 'team1');
          setHasDraft(true);
        } catch (e) {
          console.error('Failed to load draft:', e);
          setHasDraft(false);
        }
      } else {
        setHasDraft(false);
      }
    }
  }, [isOpen, storageKey]);

  // Save draft to localStorage whenever data changes
  useEffect(() => {
    if (isOpen && (team1Score > 0 || team2Score > 0 || maps.length > 0)) {
      const draft = {
        team1Score,
        team2Score,
        maps,
        stage,
        currentMapIndex,
        currentTeam,
        savedAt: new Date().toISOString()
      };
      localStorage.setItem(storageKey, JSON.stringify(draft));
    }
  }, [isOpen, team1Score, team2Score, maps, stage, currentMapIndex, currentTeam, storageKey]);

  // Reset form when opened (only if no draft exists)
  useEffect(() => {
    if (isOpen) {
      const savedDraft = localStorage.getItem(storageKey);
      if (!savedDraft) {
        setStage('team-scores');
        setTeam1Score(0);
        setTeam2Score(0);
        setMaps([]);
        setCurrentMapIndex(0);
        setCurrentTeam('team1');
        setError(null);
      }
    }
  }, [isOpen, storageKey]);

  // Initialize maps when moving to stage 2
  useEffect(() => {
    if (stage === 'map-scores' && maps.length === 0) {
      const totalMaps = team1Score + team2Score;
      const isSweepScenario = isSweep(team1Score, team2Score);
      const winningTeam = team1Score > team2Score ? 'team1' : 'team2';
      const allPlayers = [...fixture.team1.players, ...fixture.team2.players];
      
      const initialMaps: MapResult[] = [];
      for (let i = 0; i < totalMaps; i++) {
        const mapNumber = i + 1;
        const gameModeId = getGameModeForMap(mapNumber);
        const statsForMode = getStatsForGameMode(gameModeId);
        
        // For sweeps, prefill the winning team's score
        let team1MapScore = 0;
        let team2MapScore = 0;
        
        if (isSweepScenario) {
          const defaultScore = getDefaultScoreForGameMode(gameModeId);
          if (winningTeam === 'team1') {
            team1MapScore = defaultScore;
          } else {
            team2MapScore = defaultScore;
          }
        }
        
        initialMaps.push({
          gameModeId: gameModeId,
          mapNumber: mapNumber,
          team1Score: team1MapScore,
          team2Score: team2MapScore,
          playerMapResults: allPlayers.map(player => ({
            playerId: player.id,
            playerMapResultStatsData: statsForMode.map(stat => ({
              statId: stat.id,
              statValue: 0
            }))
          }))
        });
      }
      setMaps(initialMaps);
    }
  }, [stage, maps.length, team1Score, team2Score, fixture.team1.players, fixture.team2.players]);

  const updateMapGameMode = (mapIndex: number, gameModeId: string) => {
    const newMaps = [...maps];
    newMaps[mapIndex].gameModeId = gameModeId;
    setMaps(newMaps);
  };

  const updateMapScore = (mapIndex: number, team: 'team1' | 'team2', score: number) => {
    const newMaps = [...maps];
    if (team === 'team1') {
      newMaps[mapIndex].team1Score = score;
    } else {
      newMaps[mapIndex].team2Score = score;
    }
    setMaps(newMaps);
  };

  const updatePlayerStat = (mapIndex: number, playerId: string, statId: string, value: number) => {
    const newMaps = [...maps];
    const playerResult = newMaps[mapIndex].playerMapResults.find(p => p.playerId === playerId);
    if (playerResult) {
      let stat = playerResult.playerMapResultStatsData.find(s => s.statId === statId);
      if (!stat) {
        // Stat doesn't exist, create it
        stat = { statId, statValue: value };
        playerResult.playerMapResultStatsData.push(stat);
      } else {
        stat.statValue = value;
      }
    }
    setMaps(newMaps);
  };

  const handleStage1Next = () => {
    setError(null);
    if (team1Score + team2Score === 0) {
      setError('Please enter the match scores');
      return;
    }
    if (team1Score === 0 && team2Score === 0) {
      setError('At least one team must have scored');
      return;
    }
    setStage('map-scores');
  };

  const handleStage2Next = () => {
    setError(null);
    // Game modes are now auto-assigned, so no validation needed
    setCurrentMapIndex(0);
    setCurrentTeam('team1');
    setStage('player-stats');
  };

  const handleStage2Back = () => {
    setStage('team-scores');
  };

  const handleStage3Back = () => {
    if (currentTeam === 'team2') {
      // Go back to team1 of current map
      setCurrentTeam('team1');
    } else if (currentMapIndex > 0) {
      // Go back to team2 of previous map
      setCurrentMapIndex(currentMapIndex - 1);
      setCurrentTeam('team2');
    } else {
      // Go back to stage 2
      setStage('map-scores');
    }
  };

  const handleStage3Next = () => {
    setError(null);
    
    if (currentTeam === 'team1') {
      // Move to team2 of current map
      setCurrentTeam('team2');
    } else if (currentMapIndex < maps.length - 1) {
      // Move to team1 of next map
      setCurrentMapIndex(currentMapIndex + 1);
      setCurrentTeam('team1');
    } else {
      // All done, submit
      handleSubmit();
    }
  };

  const isLastStep = currentMapIndex === maps.length - 1 && currentTeam === 'team2';

  const clearDraft = () => {
    if (confirm('Are you sure you want to clear the saved draft? This cannot be undone.')) {
      localStorage.removeItem(storageKey);
      setStage('team-scores');
      setTeam1Score(0);
      setTeam2Score(0);
      setMaps([]);
      setCurrentMapIndex(0);
      setCurrentTeam('team1');
      setHasDraft(false);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      const resultData: CreateResultRequest = {
        fixtureId: fixture.id,
        team1Score,
        team2Score,
        playerMapResultData: maps
      };

      const response = await fetch(`https://api.sitechesports.com/api/fixtures/${fixture.id}/result`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resultData),
      });

      if (!response.ok) {
        throw new Error(`Failed to submit result: ${response.statusText}`);
      }

      // Clear the draft from localStorage after successful submission
      localStorage.removeItem(storageKey);
      
      onClose();
      alert('Result submitted successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit result');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="flex-shrink-0 p-4 border-b border-gray-700">
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-4">
              <h2 className="text-lg font-bold text-white">
                Enter Result: {fixture.team1.name} vs {fixture.team2.name}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                {stage === 'team-scores' && 'Step 1 of 3: Overall Match Score'}
                {stage === 'map-scores' && 'Step 2 of 3: Map Scores'}
                {stage === 'player-stats' && `Step 3 of 3: Map ${currentMapIndex + 1}/${maps.length} - ${currentTeam === 'team1' ? fixture.team1.name : fixture.team2.name}`}
              </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-xl flex-shrink-0">
              ✕
            </button>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center mt-3">
            <div className={`flex-1 h-1.5 rounded-l ${stage === 'team-scores' ? 'bg-blue-600' : 'bg-blue-800'}`}></div>
            <div className={`flex-1 h-1.5 ${stage === 'map-scores' ? 'bg-blue-600' : stage === 'player-stats' ? 'bg-blue-800' : 'bg-gray-600'}`}></div>
            <div className={`flex-1 h-1.5 rounded-r ${stage === 'player-stats' ? 'bg-blue-600' : 'bg-gray-600'}`}></div>
          </div>

          {/* Draft notification */}
          {hasDraft && (
            <div className="mt-2 p-2 bg-green-900 border border-green-700 rounded-md flex justify-between items-center">
              <p className="text-green-300 text-xs">
                ✓ Draft loaded - Your progress has been saved
              </p>
              <button
                onClick={clearDraft}
                className="text-xs text-green-400 hover:text-green-300 underline"
              >
                Clear Draft
              </button>
            </div>
          )}
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto p-4">

        {/* Stage 1: Team Scores */}
        {stage === 'team-scores' && (
          <>
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-base font-semibold text-white mb-3">Overall Match Score</h3>
              <p className="text-xs text-gray-400 mb-3">
                Enter the final score for the match (Best of {fixture.seriesLength})
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {fixture.team1.name}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={fixture.seriesLength}
                    value={team1Score}
                    onChange={(e) => setTeam1Score(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white text-xl text-center"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    {fixture.team2.name}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={fixture.seriesLength}
                    value={team2Score}
                    onChange={(e) => setTeam2Score(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-gray-600 border border-gray-500 rounded-md text-white text-xl text-center"
                  />
                </div>
              </div>
              {(team1Score + team2Score > 0) && (
                <p className="text-xs text-gray-400 mt-3 text-center">
                  Total maps played: {team1Score + team2Score}
                </p>
              )}
            </div>

            {error && (
              <div className="p-2 bg-red-900 border border-red-700 rounded-md mt-3">
                <p className="text-red-300 text-xs">{error}</p>
              </div>
            )}
          </>
        )}

        {/* Stage 2: Map Scores */}
        {stage === 'map-scores' && (
          <>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="mb-3">
                <h3 className="text-base font-semibold text-white">Map Scores</h3>
                <p className="text-xs text-gray-400">
                  Final Score: {fixture.team1.name} {team1Score} - {team2Score} {fixture.team2.name}
                </p>
              </div>

              {isSweep(team1Score, team2Score) && (
                <div className="mb-3 p-2 bg-blue-900 border border-blue-700 rounded-md">
                  <p className="text-blue-300 text-xs">
                    <strong>Sweep detected!</strong> Map scores pre-filled (HP: 250, SD: 6).
                  </p>
                </div>
              )}

              <div className="space-y-3">
                {maps.map((map, mapIndex) => (
                  <div key={mapIndex} className="bg-gray-600 rounded-lg p-3">
                    <h4 className="text-sm font-semibold text-white mb-2">Map {map.mapNumber}</h4>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">
                          Game Mode
                        </label>
                        <select
                          value={map.gameModeId}
                          onChange={(e) => updateMapGameMode(mapIndex, e.target.value)}
                          className="w-full px-2 py-1.5 bg-gray-700 border border-gray-500 rounded-md text-white text-sm"
                          disabled
                        >
                          {gameModes?.map(mode => (
                            <option key={mode.id} value={mode.id}>{mode.name}</option>
                          ))}
                        </select>
                        <p className="text-xs text-gray-400 mt-0.5">Auto-assigned</p>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">
                          {fixture.team1.name}
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={map.team1Score}
                          onChange={(e) => updateMapScore(mapIndex, 'team1', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1.5 bg-gray-700 border border-gray-500 rounded-md text-white text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-300 mb-1">
                          {fixture.team2.name}
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={map.team2Score}
                          onChange={(e) => updateMapScore(mapIndex, 'team2', parseInt(e.target.value) || 0)}
                          className="w-full px-2 py-1.5 bg-gray-700 border border-gray-500 rounded-md text-white text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div className="p-2 bg-red-900 border border-red-700 rounded-md mt-3">
                <p className="text-red-300 text-xs">{error}</p>
              </div>
            )}
          </>
        )}

        {/* Stage 3: Player Stats */}
        {stage === 'player-stats' && (
          <>
            <div className="bg-gray-700 rounded-lg p-4">
              <div className="mb-3">
                <h3 className="text-base font-semibold text-white">Player Statistics</h3>
                <p className="text-xs text-gray-400">
                  Map {currentMapIndex + 1} - {gameModes?.find(g => g.id === maps[currentMapIndex]?.gameModeId)?.name}
                </p>
              </div>

              {maps[currentMapIndex] && (
                <div>
                  <h4 className="text-sm font-semibold mb-3" style={{ color: currentTeam === 'team1' ? '#60a5fa' : '#f87171' }}>
                    {currentTeam === 'team1' ? fixture.team1.name : fixture.team2.name}
                  </h4>

                  <div className="space-y-2">
                    {(currentTeam === 'team1' ? team1Players : team2Players).map(player => {
                      const currentMap = maps[currentMapIndex];
                      const statsForMode = getStatsForGameMode(currentMap.gameModeId);
                      
                      return (
                        <div key={player.id} className="bg-gray-600 rounded p-2">
                          <div className="font-medium text-white text-sm mb-2">{player.name}</div>
                          <div className="grid grid-cols-2 gap-2">
                            {statsForMode.map(stat => {
                              const statValue = currentMap.playerMapResults
                                .find(p => p.playerId === player.id)
                                ?.playerMapResultStatsData.find(s => s.statId === stat.id)
                                ?.statValue || 0;
                              
                              // Special handling for Hill Time (convert seconds to MM:SS format)
                              if (stat.id === 'db7bbce5-42de-4a62-8a45-088c7b156375') {
                                const minutes = Math.floor(statValue / 60);
                                const seconds = Math.floor(statValue % 60);
                                const displayValue = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                                
                                return (
                                  <div key={stat.id}>
                                    <label className="block text-xs text-gray-400 mb-0.5">
                                      {stat.name}
                                    </label>
                                    <input
                                      type="text"
                                      defaultValue={displayValue}
                                      key={`${player.id}-${stat.id}-${statValue}`}
                                      onBlur={(e) => {
                                        const value = e.target.value.trim();
                                        if (!value) {
                                          updatePlayerStat(currentMapIndex, player.id, stat.id, 0);
                                          return;
                                        }
                                        
                                        // Parse MM:SS format
                                        if (value.includes(':')) {
                                          const parts = value.split(':');
                                          const mins = parseInt(parts[0]) || 0;
                                          const secs = parseInt(parts[1]) || 0;
                                          const totalSeconds = (mins * 60) + Math.min(secs, 59);
                                          updatePlayerStat(currentMapIndex, player.id, stat.id, totalSeconds);
                                        } else {
                                          // Just numbers, treat as seconds
                                          const num = parseInt(value) || 0;
                                          updatePlayerStat(currentMapIndex, player.id, stat.id, num);
                                        }
                                      }}
                                      placeholder="M:SS"
                                      className="w-full px-2 py-1 bg-gray-700 border border-gray-500 rounded text-white text-sm text-center"
                                    />
                                  </div>
                                );
                              }
                              
                              // Regular stat input
                              return (
                                <div key={stat.id}>
                                  <label className="block text-xs text-gray-400 mb-0.5">
                                    {stat.name}
                                  </label>
                                  <input
                                    type="number"
                                    min="0"
                                    value={statValue}
                                    onChange={(e) => updatePlayerStat(currentMapIndex, player.id, stat.id, parseFloat(e.target.value) || 0)}
                                    className="w-full px-2 py-1 bg-gray-700 border border-gray-500 rounded text-white text-sm"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {getStatsForGameMode(maps[currentMapIndex].gameModeId).length === 0 && (
                    <div className="bg-yellow-900 border border-yellow-700 rounded-md p-2 mt-2">
                      <p className="text-yellow-300 text-xs">
                        No stats configured for this game mode yet.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {error && (
              <div className="p-2 bg-red-900 border border-red-700 rounded-md mt-3">
                <p className="text-red-300 text-xs">{error}</p>
              </div>
            )}
          </>
        )}
        </div>

        {/* Footer - Fixed */}
        <div className="flex-shrink-0 p-4 border-t border-gray-700">
          <div className="flex justify-between">
            {stage === 'team-scores' && (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleStage1Next}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Next: Map Scores →
                </button>
              </>
            )}
            {stage === 'map-scores' && (
              <>
                <button
                  type="button"
                  onClick={handleStage2Back}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleStage2Next}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                >
                  Next: Player Stats →
                </button>
              </>
            )}
            {stage === 'player-stats' && (
              <>
                <button
                  type="button"
                  onClick={handleStage3Back}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={handleStage3Next}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
                >
                  {isSubmitting ? 'Submitting...' : isLastStep ? 'Submit Result' : 'Next →'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
