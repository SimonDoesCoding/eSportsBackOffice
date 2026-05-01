'use client';

import { use, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useFixture } from '../../../hooks/useFixtures';
import { useFixtureInsights } from '../../../hooks/useInsights';
import { InsightsMapData } from '../../../types';
import { getTeamConfig, brand } from '../../../utils/teamConfig';
import { SocialPostModal } from '../../components/SocialPostModal';

const MAP_GAME_MODES = ['Hardpoint', 'S&D', 'Overload', 'Hardpoint', 'S&D', 'Overload', 'S&D'];

type Tab = 'overview' | 'maps' | 'players';

function WinProbBar({ team1Pct, team1Name, team2Name, team1Color, team2Color }: {
  team1Pct: number; team1Name: string; team2Name: string; team1Color?: string; team2Color?: string;
}) {
  const t1 = (team1Pct * 100).toFixed(1);
  const t2 = ((1 - team1Pct) * 100).toFixed(1);
  const c1 = team1Color || brand.coral;
  const c2 = team2Color || brand.teal;
  return (
    <div>
      <div className="flex justify-between text-xs text-gray-400 mb-1">
        <span>{team1Name} ({t1}%)</span>
        <span>{team2Name} ({t2}%)</span>
      </div>
      <div className="flex h-6 rounded-full overflow-hidden">
        <div className="transition-all" style={{ width: `${t1}%`, backgroundColor: c1 }} />
        <div className="transition-all" style={{ width: `${t2}%`, backgroundColor: c2 }} />
      </div>
    </div>
  );
}

function ScoreDistChart({ distribution, team1Name, team2Name, team1Color, team2Color }: {
  distribution: Record<string, number>; team1Name: string; team2Name: string; team1Color?: string; team2Color?: string;
}) {
  const entries = Object.entries(distribution).sort((a, b) => b[1] - a[1]);
  const maxVal = Math.max(...entries.map(([, v]) => v));
  const c1 = team1Color || brand.coral;
  const c2 = team2Color || brand.teal;

  return (
    <div className="bg-gray-700 rounded-lg p-4">
      <h3 className="text-sm font-semibold text-white mb-3">Score Distribution</h3>
      <div className="space-y-2">
        {entries.map(([score, prob]) => {
          const [s1, s2] = score.split('-').map(Number);
          const isTeam1Win = s1 > s2;
          return (
            <div key={score} className="flex items-center gap-2">
              <span className="text-xs text-gray-400 w-10 text-right">{score}</span>
              <div className="flex-1 h-5 bg-gray-600 rounded overflow-hidden">
                <div
                  className="h-full rounded transition-all"
                  style={{ width: `${(prob / maxVal) * 100}%`, backgroundColor: isTeam1Win ? c1 : c2 }}
                />
              </div>
              <span className="text-xs text-gray-300 w-14 text-right">{(prob * 100).toFixed(1)}%</span>
            </div>
          );
        })}
      </div>
      <div className="flex justify-between mt-2 text-xs text-gray-500">
        <span style={{ color: c1 }}>{team1Name} wins</span>
        <span style={{ color: c2 }}>{team2Name} wins</span>
      </div>
    </div>
  );
}

function MapBreakdown({ maps, team1Name, team2Name, team1Color, team2Color }: {
  maps: InsightsMapData[]; team1Name: string; team2Name: string; team1Color?: string; team2Color?: string;
}) {
  const c1 = team1Color || brand.coral;
  const c2 = team2Color || brand.teal;
  return (
    <div className="space-y-4">
      {maps.map((map) => (
        <div key={map.map_index} className="bg-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-semibold text-white">
              Map {map.map_index + 1} - {MAP_GAME_MODES[map.map_index] || 'Unknown'}
            </h4>
            {map.played_percentage < 1 && (
              <span className="text-xs text-gray-400">
                Played {(map.played_percentage * 100).toFixed(0)}% of series
              </span>
            )}
          </div>
          <WinProbBar team1Pct={map.team1_win_probability} team1Name={team1Name} team2Name={team2Name} team1Color={c1} team2Color={c2} />
          <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
            <div className="text-right" style={{ color: c1 }}>{map.team1_avg_kills.toFixed(0)}</div>
            <div className="text-center text-gray-400">Avg Kills</div>
            <div className="text-left" style={{ color: c2 }}>{map.team2_avg_kills.toFixed(0)}</div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-right" style={{ color: c1 }}>{map.team1_avg_kd.toFixed(3)}</div>
            <div className="text-center text-gray-400">Avg K/D</div>
            <div className="text-left" style={{ color: c2 }}>{map.team2_avg_kd.toFixed(3)}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PlayerComparison({ fixture }: { fixture: { team1: { name: string; players: Array<{ id: string; name: string; gameModePlayerStats: { Hardpoint: { KdRatio: number; KillsPerMap: number; DeathsPerMap: number; HillTimePer10Mins: number }; SearchAndDestroy: { KdRatio: number; KillsPerRound: number; PlantsPerMap: number; DefusesPerMap: number; OpeningDuelWinPercent: number }; Overload: { KdRatio: number; KillsPerMap: number; DeathsPerMap: number; OverloadsPerMap: number } } }> }; team2: { name: string; players: Array<{ id: string; name: string; gameModePlayerStats: { Hardpoint: { KdRatio: number; KillsPerMap: number; DeathsPerMap: number; HillTimePer10Mins: number }; SearchAndDestroy: { KdRatio: number; KillsPerRound: number; PlantsPerMap: number; DefusesPerMap: number; OpeningDuelWinPercent: number }; Overload: { KdRatio: number; KillsPerMap: number; DeathsPerMap: number; OverloadsPerMap: number } } }> } } }) {
  const t1 = fixture.team1.players.sort((a, b) => a.name.localeCompare(b.name));
  const t2 = fixture.team2.players.sort((a, b) => a.name.localeCompare(b.name));
  const t1Config = getTeamConfig(fixture.team1.name);
  const t2Config = getTeamConfig(fixture.team2.name);

  const modes = [
    { key: 'Hardpoint' as const, label: 'Hardpoint', stats: (p: typeof t1[0]) => [
      { label: 'K/D', v: p.gameModePlayerStats.Hardpoint.KdRatio, fmt: 'ratio' },
      { label: 'Kills/Map', v: p.gameModePlayerStats.Hardpoint.KillsPerMap, fmt: 'num' },
      { label: 'Deaths/Map', v: p.gameModePlayerStats.Hardpoint.DeathsPerMap, fmt: 'num' },
      { label: 'Hill Time', v: p.gameModePlayerStats.Hardpoint.HillTimePer10Mins, fmt: 'num' },
    ]},
    { key: 'SearchAndDestroy' as const, label: 'Search & Destroy', stats: (p: typeof t1[0]) => [
      { label: 'K/D', v: p.gameModePlayerStats.SearchAndDestroy.KdRatio, fmt: 'ratio' },
      { label: 'Kills/Round', v: p.gameModePlayerStats.SearchAndDestroy.KillsPerRound, fmt: 'ratio' },
      { label: 'Plants/Map', v: p.gameModePlayerStats.SearchAndDestroy.PlantsPerMap, fmt: 'num' },
      { label: 'Defuses/Map', v: p.gameModePlayerStats.SearchAndDestroy.DefusesPerMap, fmt: 'num' },
      { label: 'OD Win%', v: p.gameModePlayerStats.SearchAndDestroy.OpeningDuelWinPercent, fmt: 'pct' },
    ]},
    { key: 'Overload' as const, label: 'Overload', stats: (p: typeof t1[0]) => [
      { label: 'K/D', v: p.gameModePlayerStats.Overload.KdRatio, fmt: 'ratio' },
      { label: 'Kills/Map', v: p.gameModePlayerStats.Overload.KillsPerMap, fmt: 'num' },
      { label: 'Deaths/Map', v: p.gameModePlayerStats.Overload.DeathsPerMap, fmt: 'num' },
      { label: 'Overloads', v: p.gameModePlayerStats.Overload.OverloadsPerMap, fmt: 'num' },
    ]},
  ];

  const fmtVal = (v: number, fmt: string) => {
    if (fmt === 'ratio') return v.toFixed(2);
    if (fmt === 'pct') return `${(v * 100).toFixed(1)}%`;
    return v.toFixed(1);
  };

  return (
    <div className="space-y-6">
      {modes.map(mode => (
        <div key={mode.key}>
          <h3 className="text-sm font-semibold text-white mb-3">{mode.label}</h3>
          <div className="space-y-3">
            {t1.map((p1, i) => {
              const p2 = t2[i];
              if (!p2) return null;
              const s1 = mode.stats(p1);
              const s2 = mode.stats(p2);
              return (
                <div key={p1.id} className="bg-gray-700 rounded-lg p-3">
                  <div className="grid grid-cols-3 mb-2">
                    <div className="text-right pr-3 font-medium text-xs" style={{ color: t1Config.color }}>{p1.name}</div>
                    <div className="text-center text-gray-500 text-xs">vs</div>
                    <div className="text-left pl-3 font-medium text-xs" style={{ color: t2Config.color }}>{p2.name}</div>
                  </div>
                  {s1.map((stat, si) => (
                    <div key={stat.label} className="grid grid-cols-3 py-1 text-xs">
                      <div className={`text-right pr-3 ${stat.v > s2[si].v ? 'text-green-400 font-semibold' : 'text-gray-300'}`}>
                        {fmtVal(stat.v, stat.fmt)}
                      </div>
                      <div className="text-center text-gray-500">{stat.label}</div>
                      <div className={`text-left pl-3 ${s2[si].v > stat.v ? 'text-green-400 font-semibold' : 'text-gray-300'}`}>
                        {fmtVal(s2[si].v, s2[si].fmt)}
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function FixtureDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: fixture, isLoading: fixtureLoading } = useFixture(id);
  const { data: insights, isLoading: insightsLoading, error: insightsError } = useFixtureInsights(id);
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  if (fixtureLoading) {
    return (
      <div className="px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-700 rounded w-1/3"></div>
          <div className="h-64 bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  if (!fixture) {
    return (
      <div className="px-4 py-6">
        <div className="bg-red-900 border border-red-700 rounded-lg p-4">
          <p className="text-red-300">Fixture not found</p>
        </div>
        <Link href="/fixtures" className="text-sm mt-4 inline-block" style={{ color: brand.coral }}>
          ? Back to Fixtures
        </Link>
      </div>
    );
  }

  const t1Name = fixture.team1.name;
  const t2Name = fixture.team2.name;
  const t1Config = getTeamConfig(t1Name);
  const t2Config = getTeamConfig(t2Name);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'overview', label: 'Overview & Insights' },
    { key: 'maps', label: 'Map Breakdown' },
    { key: 'players', label: 'Player Comparison' },
  ];

  return (
    <div className="px-4 py-6">
      {/* Back link */}
      <Link href="/fixtures" className="text-sm mb-4 inline-block" style={{ color: brand.coral }}>
        ? Back to Fixtures
      </Link>

      {/* Header */}
      <div className="bg-gray-800 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="text-center">
              {t1Config.logo ? (
                <Image src={t1Config.logo} alt={t1Name} width={48} height={48} className="mx-auto mb-2" />
              ) : (
                <div className="h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: t1Config.color }}>
                  <span className="text-lg font-bold">{t1Name.charAt(0)}</span>
                </div>
              )}
              <h2 className="text-lg font-semibold" style={{ color: t1Config.color }}>{t1Name}</h2>
            </div>
            <div className="text-center">
              <span className="text-3xl font-bold text-gray-400">VS</span>
              <p className="text-xs text-gray-500 mt-1">BO{fixture.seriesLength}</p>
              {fixture.result && (
                <p className="text-lg font-bold mt-1">
                  <span className={fixture.result.team1Score > fixture.result.team2Score ? 'text-green-400' : 'text-gray-400'}>
                    {fixture.result.team1Score}
                  </span>
                  <span className="text-gray-500 mx-1">-</span>
                  <span className={fixture.result.team2Score > fixture.result.team1Score ? 'text-green-400' : 'text-gray-400'}>
                    {fixture.result.team2Score}
                  </span>
                </p>
              )}
            </div>
            <div className="text-center">
              {t2Config.logo ? (
                <Image src={t2Config.logo} alt={t2Name} width={48} height={48} className="mx-auto mb-2" />
              ) : (
                <div className="h-12 w-12 rounded-full flex items-center justify-center mx-auto mb-2" style={{ backgroundColor: t2Config.color }}>
                  <span className="text-lg font-bold">{t2Name.charAt(0)}</span>
                </div>
              )}
              <h2 className="text-lg font-semibold" style={{ color: t2Config.color }}>{t2Name}</h2>
            </div>
          </div>
          <div className="text-right text-sm text-gray-400">
            <p>{new Date(fixture.startDateTime).toLocaleDateString()}</p>
            <p>{new Date(fixture.startDateTime).toLocaleTimeString()}</p>
            <p className="mt-1" style={{ color: brand.teal }}>{fixture.league.name}</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-6">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              activeTab === tab.key ? 'text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
            style={activeTab === tab.key ? { backgroundColor: brand.coral } : undefined}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <OverviewTab
          insights={insights}
          insightsLoading={insightsLoading}
          insightsError={insightsError}
          fixture={fixture}
          t1Name={t1Name}
          t2Name={t2Name}
          t1Color={t1Config.color}
          t2Color={t2Config.color}
        />
      )}
      {activeTab === 'maps' && insights && (
        <MapBreakdown maps={insights.maps} team1Name={t1Name} team2Name={t2Name} team1Color={t1Config.color} team2Color={t2Config.color} />
      )}
      {activeTab === 'maps' && !insights && (
        <div className="bg-gray-800 rounded-lg p-6 text-center text-gray-400">
          {insightsLoading ? 'Loading map data...' : 'No insights available. Run a simulation first.'}
        </div>
      )}
      {activeTab === 'players' && (
        <PlayerComparison fixture={fixture} />
      )}
    </div>
  );
}

function OverviewTab({ insights, insightsLoading, insightsError, fixture, t1Name, t2Name, t1Color, t2Color }: {
  insights: ReturnType<typeof useFixtureInsights>['data'];
  insightsLoading: boolean;
  insightsError: Error | null;
  fixture: NonNullable<ReturnType<typeof useFixture>['data']>;
  t1Name: string;
  t2Name: string;
  t1Color: string;
  t2Color: string;
}) {
  const [showPostModal, setShowPostModal] = useState(false);
  if (insightsLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-32 bg-gray-700 rounded"></div>
        <div className="h-48 bg-gray-700 rounded"></div>
      </div>
    );
  }

  if (insightsError || !insights) {
    return (
      <div className="space-y-6">
        <div className="bg-yellow-900 border border-yellow-700 rounded-lg p-4">
          <p className="text-yellow-300 text-sm">
            No insights available for this fixture. Run a simulation first to generate insights.
          </p>
        </div>
        {/* Still show team comparison */}
        <TeamComparisonSection fixture={fixture} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Headline Insights */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-white mb-3">Key Insights</h3>
        <ul className="space-y-2">
          {insights.headline_insights.map((insight, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
              <span className="mt-0.5" style={{ color: brand.coral }}>•</span>
              <span>{insight}</span>
            </li>
          ))}
        </ul>
        <p className="text-xs text-gray-500 mt-3">
          Generated {new Date(insights.generated_at).toLocaleString()}
        </p>
        <button
          onClick={() => setShowPostModal(true)}
          className="mt-3 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm rounded-lg transition-all"
        >
          Generate Social Post
        </button>
      </div>

      {showPostModal && (
        <SocialPostModal
          fixtureId={fixture.id}
          insights={insights}
          onClose={() => setShowPostModal(false)}
        />
      )}

      {/* Series Win Probability */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Series Win Probability</h3>
        <WinProbBar
          team1Pct={insights.series.team1_win_probability}
          team1Name={t1Name}
          team2Name={t2Name}
          team1Color={t1Color}
          team2Color={t2Color}
        />
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-gray-700 rounded p-3 text-center">
            <p className="text-xs text-gray-400">Sweep Probability</p>
            <p className="text-lg font-bold text-white">{(insights.series.sweep_probability * 100).toFixed(1)}%</p>
          </div>
          <div className="bg-gray-700 rounded p-3 text-center">
            <p className="text-xs text-gray-400">Goes the Distance</p>
            <p className="text-lg font-bold text-white">{(insights.series.distance_probability * 100).toFixed(1)}%</p>
          </div>
          <div className="bg-gray-700 rounded p-3 text-center">
            <p className="text-xs text-gray-400">Avg Maps Played</p>
            <p className="text-lg font-bold text-white">{insights.series.avg_total_maps.toFixed(1)}</p>
          </div>
          <div className="bg-gray-700 rounded p-3 text-center">
            <p className="text-xs text-gray-400">Favourite</p>
            <p className="text-lg font-bold" style={{ color: insights.series.favourite === t1Name ? t1Color : t2Color }}>{insights.series.favourite}</p>
          </div>
        </div>
      </div>

      {/* Score Distribution */}
      <ScoreDistChart distribution={insights.series.score_distribution} team1Name={t1Name} team2Name={t2Name} team1Color={t1Color} team2Color={t2Color} />

      {/* Series Stats Comparison */}
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-sm font-semibold text-white mb-4">Series Stats</h3>
        <div className="space-y-1">
          {[
            { label: 'Avg Kills', v1: insights.series.team1_avg_kills, v2: insights.series.team2_avg_kills, fmt: 'num' },
            { label: 'Avg Deaths', v1: insights.series.team1_avg_deaths, v2: insights.series.team2_avg_deaths, fmt: 'num', lower: true },
            { label: 'Avg K/D', v1: insights.series.team1_avg_kd, v2: insights.series.team2_avg_kd, fmt: 'ratio' },
          ].map(row => (
            <div key={row.label} className="grid grid-cols-3 py-2 border-b border-gray-700 text-sm">
              <div className={`text-right pr-4 ${(!row.lower ? row.v1 > row.v2 : row.v1 < row.v2) ? 'text-green-400 font-semibold' : 'text-gray-300'}`}>
                {row.fmt === 'ratio' ? row.v1.toFixed(3) : row.v1.toFixed(1)}
              </div>
              <div className="text-center text-gray-400 text-xs">{row.label}</div>
              <div className={`text-left pl-4 ${(!row.lower ? row.v2 > row.v1 : row.v2 < row.v1) ? 'text-green-400 font-semibold' : 'text-gray-300'}`}>
                {row.fmt === 'ratio' ? row.v2.toFixed(3) : row.v2.toFixed(1)}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Team Comparison from fixture data */}
      <TeamComparisonSection fixture={fixture} />
    </div>
  );
}

function TeamComparisonSection({ fixture }: { fixture: NonNullable<ReturnType<typeof useFixture>['data']> }) {
  const t1 = fixture.team1;
  const t2 = fixture.team2;
  const t1Color = getTeamConfig(t1.name).color;
  const t2Color = getTeamConfig(t2.name).color;
  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-sm font-semibold text-white mb-4">Game Mode Win Rates</h3>
      <div className="space-y-3">
        {(['Hardpoint', 'SearchAndDestroy', 'Overload'] as const).map(mode => {
          const label = mode === 'SearchAndDestroy' ? 'Search & Destroy' : mode;
          return (
            <div key={mode}>
              <WinProbBar
                team1Pct={t1.gameModeWinPercents[mode] / (t1.gameModeWinPercents[mode] + t2.gameModeWinPercents[mode]) || 0.5}
                team1Name={`${t1.name} (${(t1.gameModeWinPercents[mode] * 100).toFixed(0)}%)`}
                team2Name={`${t2.name} (${(t2.gameModeWinPercents[mode] * 100).toFixed(0)}%)`}
                team1Color={t1Color}
                team2Color={t2Color}
              />
              <p className="text-xs text-gray-500 text-center mt-1">{label}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
