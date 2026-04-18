'use client';

import { useState } from 'react';
import { Fixture, Player, HardpointStats, SearchAndDestroyStats, OverloadStats } from '../../types';
import { getTeamConfig } from '../../utils/teamConfig';
import Image from 'next/image';

interface FixtureComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  fixture: Fixture;
}

type Tab = 'team' | 'hardpoint' | 'snd' | 'overload';

function StatRow({ label, val1, val2, format = 'number', higherIsBetter = true }: {
  label: string;
  val1: number;
  val2: number;
  format?: 'number' | 'percent' | 'ratio';
  higherIsBetter?: boolean;
}) {
  const fmt = (v: number) => {
    if (format === 'percent') return `${(v * 100).toFixed(1)}%`;
    if (format === 'ratio') return v.toFixed(2);
    return v.toFixed(1);
  };

  const better1 = higherIsBetter ? val1 > val2 : val1 < val2;
  const better2 = higherIsBetter ? val2 > val1 : val2 < val1;

  return (
    <div className="grid grid-cols-3 py-2 border-b border-gray-700 text-sm">
      <div className={`text-right pr-4 ${better1 ? 'text-green-400 font-semibold' : 'text-gray-300'}`}>
        {fmt(val1)}
      </div>
      <div className="text-center text-gray-400 text-xs">{label}</div>
      <div className={`text-left pl-4 ${better2 ? 'text-green-400 font-semibold' : 'text-gray-300'}`}>
        {fmt(val2)}
      </div>
    </div>
  );
}

function TeamStatsSection({ fixture }: { fixture: Fixture }) {
  const t1 = fixture.team1;
  const t2 = fixture.team2;
  return (
    <div className="space-y-4">
      <div className="bg-gray-700 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-white mb-3 text-center">Game Mode Win %</h4>
        <StatRow label="Hardpoint" val1={t1.gameModeWinPercents.Hardpoint} val2={t2.gameModeWinPercents.Hardpoint} format="percent" />
        <StatRow label="Search & Destroy" val1={t1.gameModeWinPercents.SearchAndDestroy} val2={t2.gameModeWinPercents.SearchAndDestroy} format="percent" />
        <StatRow label="Overload" val1={t1.gameModeWinPercents.Overload} val2={t2.gameModeWinPercents.Overload} format="percent" />
      </div>
      <div className="bg-gray-700 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-white mb-3 text-center">Team Info</h4>
        <StatRow label="Form Modifier" val1={t1.recentFormModifier} val2={t2.recentFormModifier} format="ratio" />
        <StatRow label="Months Since Roster Change" val1={t1.monthsSinceLastRosterChange} val2={t2.monthsSinceLastRosterChange} higherIsBetter={false} />
        <div className="grid grid-cols-3 py-2 border-b border-gray-700 text-sm">
          <div className="text-right pr-4 text-gray-300">{t1.players.length}</div>
          <div className="text-center text-gray-400 text-xs">Roster Size</div>
          <div className="text-left pl-4 text-gray-300">{t2.players.length}</div>
        </div>
      </div>
    </div>
  );
}

function HardpointSection({ fixture }: { fixture: Fixture }) {
  const t1Players = fixture.team1.players.sort((a, b) => a.name.localeCompare(b.name));
  const t2Players = fixture.team2.players.sort((a, b) => a.name.localeCompare(b.name));
  const t1c = getTeamConfig(fixture.team1.name).color;
  const t2c = getTeamConfig(fixture.team2.name).color;
  const avgStat = (players: Player[], fn: (s: HardpointStats) => number) =>
    players.length ? players.reduce((sum, p) => sum + fn(p.gameModePlayerStats.Hardpoint), 0) / players.length : 0;

  return (
    <div className="space-y-4">
      <div className="bg-gray-700 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-white mb-3 text-center">Team Averages</h4>
        <StatRow label="K/D Ratio" val1={avgStat(t1Players, s => s.KdRatio)} val2={avgStat(t2Players, s => s.KdRatio)} format="ratio" />
        <StatRow label="Kills/Map" val1={avgStat(t1Players, s => s.KillsPerMap)} val2={avgStat(t2Players, s => s.KillsPerMap)} />
        <StatRow label="Deaths/Map" val1={avgStat(t1Players, s => s.DeathsPerMap)} val2={avgStat(t2Players, s => s.DeathsPerMap)} higherIsBetter={false} />
        <StatRow label="Hill Time/10min" val1={avgStat(t1Players, s => s.HillTimePer10Mins)} val2={avgStat(t2Players, s => s.HillTimePer10Mins)} />
      </div>
      {t1Players.map((p1, i) => {
        const p2 = t2Players[i];
        if (!p2) return null;
        const s1 = p1.gameModePlayerStats.Hardpoint;
        const s2 = p2.gameModePlayerStats.Hardpoint;
        return (
          <div key={p1.id} className="bg-gray-700 rounded-lg p-4">
            <div className="grid grid-cols-3 mb-3">
              <div className="text-right pr-4 font-medium text-sm" style={{ color: t1c }}>{p1.name}</div>
              <div className="text-center text-gray-500 text-xs">vs</div>
              <div className="text-left pl-4 font-medium text-sm" style={{ color: t2c }}>{p2.name}</div>
            </div>
            <StatRow label="K/D" val1={s1.KdRatio} val2={s2.KdRatio} format="ratio" />
            <StatRow label="Kills/Map" val1={s1.KillsPerMap} val2={s2.KillsPerMap} />
            <StatRow label="Deaths/Map" val1={s1.DeathsPerMap} val2={s2.DeathsPerMap} higherIsBetter={false} />
            <StatRow label="Hill Time" val1={s1.HillTimePer10Mins} val2={s2.HillTimePer10Mins} />
          </div>
        );
      })}
    </div>
  );
}

function SndSection({ fixture }: { fixture: Fixture }) {
  const t1Players = fixture.team1.players.sort((a, b) => a.name.localeCompare(b.name));
  const t2Players = fixture.team2.players.sort((a, b) => a.name.localeCompare(b.name));
  const t1c = getTeamConfig(fixture.team1.name).color;
  const t2c = getTeamConfig(fixture.team2.name).color;
  const avgStat = (players: Player[], fn: (s: SearchAndDestroyStats) => number) =>
    players.length ? players.reduce((sum, p) => sum + fn(p.gameModePlayerStats.SearchAndDestroy), 0) / players.length : 0;

  return (
    <div className="space-y-4">
      <div className="bg-gray-700 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-white mb-3 text-center">Team Averages</h4>
        <StatRow label="K/D Ratio" val1={avgStat(t1Players, s => s.KdRatio)} val2={avgStat(t2Players, s => s.KdRatio)} format="ratio" />
        <StatRow label="Kills/Round" val1={avgStat(t1Players, s => s.KillsPerRound)} val2={avgStat(t2Players, s => s.KillsPerRound)} format="ratio" />
        <StatRow label="Deaths/Round" val1={avgStat(t1Players, s => s.DeathsPerRound)} val2={avgStat(t2Players, s => s.DeathsPerRound)} format="ratio" higherIsBetter={false} />
        <StatRow label="Plants/Map" val1={avgStat(t1Players, s => s.PlantsPerMap)} val2={avgStat(t2Players, s => s.PlantsPerMap)} />
        <StatRow label="Defuses/Map" val1={avgStat(t1Players, s => s.DefusesPerMap)} val2={avgStat(t2Players, s => s.DefusesPerMap)} />
        <StatRow label="Opening Duel Win %" val1={avgStat(t1Players, s => s.OpeningDuelWinPercent)} val2={avgStat(t2Players, s => s.OpeningDuelWinPercent)} format="percent" />
      </div>
      {t1Players.map((p1, i) => {
        const p2 = t2Players[i];
        if (!p2) return null;
        const s1 = p1.gameModePlayerStats.SearchAndDestroy;
        const s2 = p2.gameModePlayerStats.SearchAndDestroy;
        return (
          <div key={p1.id} className="bg-gray-700 rounded-lg p-4">
            <div className="grid grid-cols-3 mb-3">
              <div className="text-right pr-4 font-medium text-sm" style={{ color: t1c }}>{p1.name}</div>
              <div className="text-center text-gray-500 text-xs">vs</div>
              <div className="text-left pl-4 font-medium text-sm" style={{ color: t2c }}>{p2.name}</div>
            </div>
            <StatRow label="K/D" val1={s1.KdRatio} val2={s2.KdRatio} format="ratio" />
            <StatRow label="Kills/Round" val1={s1.KillsPerRound} val2={s2.KillsPerRound} format="ratio" />
            <StatRow label="Plants/Map" val1={s1.PlantsPerMap} val2={s2.PlantsPerMap} />
            <StatRow label="Defuses/Map" val1={s1.DefusesPerMap} val2={s2.DefusesPerMap} />
            <StatRow label="OD Win %" val1={s1.OpeningDuelWinPercent} val2={s2.OpeningDuelWinPercent} format="percent" />
          </div>
        );
      })}
    </div>
  );
}

function OverloadSection({ fixture }: { fixture: Fixture }) {
  const t1Players = fixture.team1.players.sort((a, b) => a.name.localeCompare(b.name));
  const t2Players = fixture.team2.players.sort((a, b) => a.name.localeCompare(b.name));
  const t1c = getTeamConfig(fixture.team1.name).color;
  const t2c = getTeamConfig(fixture.team2.name).color;
  const avgStat = (players: Player[], fn: (s: OverloadStats) => number) =>
    players.length ? players.reduce((sum, p) => sum + fn(p.gameModePlayerStats.Overload), 0) / players.length : 0;

  return (
    <div className="space-y-4">
      <div className="bg-gray-700 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-white mb-3 text-center">Team Averages</h4>
        <StatRow label="K/D Ratio" val1={avgStat(t1Players, s => s.KdRatio)} val2={avgStat(t2Players, s => s.KdRatio)} format="ratio" />
        <StatRow label="Kills/Map" val1={avgStat(t1Players, s => s.KillsPerMap)} val2={avgStat(t2Players, s => s.KillsPerMap)} />
        <StatRow label="Deaths/Map" val1={avgStat(t1Players, s => s.DeathsPerMap)} val2={avgStat(t2Players, s => s.DeathsPerMap)} higherIsBetter={false} />
        <StatRow label="Overloads/Map" val1={avgStat(t1Players, s => s.OverloadsPerMap)} val2={avgStat(t2Players, s => s.OverloadsPerMap)} />
      </div>
      {t1Players.map((p1, i) => {
        const p2 = t2Players[i];
        if (!p2) return null;
        const s1 = p1.gameModePlayerStats.Overload;
        const s2 = p2.gameModePlayerStats.Overload;
        return (
          <div key={p1.id} className="bg-gray-700 rounded-lg p-4">
            <div className="grid grid-cols-3 mb-3">
              <div className="text-right pr-4 font-medium text-sm" style={{ color: t1c }}>{p1.name}</div>
              <div className="text-center text-gray-500 text-xs">vs</div>
              <div className="text-left pl-4 font-medium text-sm" style={{ color: t2c }}>{p2.name}</div>
            </div>
            <StatRow label="K/D" val1={s1.KdRatio} val2={s2.KdRatio} format="ratio" />
            <StatRow label="Kills/Map" val1={s1.KillsPerMap} val2={s2.KillsPerMap} />
            <StatRow label="Deaths/Map" val1={s1.DeathsPerMap} val2={s2.DeathsPerMap} higherIsBetter={false} />
            <StatRow label="Overloads/Map" val1={s1.OverloadsPerMap} val2={s2.OverloadsPerMap} />
          </div>
        );
      })}
    </div>
  );
}

export function FixtureComparisonModal({ isOpen, onClose, fixture }: FixtureComparisonModalProps) {
  const [activeTab, setActiveTab] = useState<Tab>('team');

  if (!isOpen) return null;

  const tabs: { key: Tab; label: string }[] = [
    { key: 'team', label: 'Team Stats' },
    { key: 'hardpoint', label: 'Hardpoint' },
    { key: 'snd', label: 'S&D' },
    { key: 'overload', label: 'Overload' },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-lg w-full max-w-3xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 p-4 border-b border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-bold text-white">Fixture Comparison</h2>
              <p className="text-xs text-gray-400 mt-1">
                {new Date(fixture.startDateTime).toLocaleDateString()} - BO{fixture.seriesLength}
              </p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-white text-xl">✕</button>
          </div>
          {/* Team Headers */}
          <div className="grid grid-cols-3 mt-4">
            <div className="text-right pr-4">
              <div className="flex items-center justify-end space-x-2">
                <span className="font-semibold" style={{ color: getTeamConfig(fixture.team1.name).color }}>{fixture.team1.name}</span>
                {(() => { const tc = getTeamConfig(fixture.team1.name); return tc.logo ? (
                  <Image src={tc.logo} alt={fixture.team1.name} width={32} height={32} />
                ) : (
                  <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: tc.color }}>
                    <span className="text-xs font-bold">{fixture.team1.name.charAt(0)}</span>
                  </div>
                ); })()}
              </div>
            </div>
            <div className="text-center text-gray-500 text-lg font-bold self-center">VS</div>
            <div className="text-left pl-4">
              <div className="flex items-center space-x-2">
                {(() => { const tc = getTeamConfig(fixture.team2.name); return tc.logo ? (
                  <Image src={tc.logo} alt={fixture.team2.name} width={32} height={32} />
                ) : (
                  <div className="h-8 w-8 rounded-full flex items-center justify-center" style={{ backgroundColor: tc.color }}>
                    <span className="text-xs font-bold">{fixture.team2.name.charAt(0)}</span>
                  </div>
                ); })()}
                <span className="font-semibold" style={{ color: getTeamConfig(fixture.team2.name).color }}>{fixture.team2.name}</span>
              </div>
            </div>
          </div>
          {/* Tabs */}
          <div className="flex space-x-1 mt-4">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === tab.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'team' && <TeamStatsSection fixture={fixture} />}
          {activeTab === 'hardpoint' && <HardpointSection fixture={fixture} />}
          {activeTab === 'snd' && <SndSection fixture={fixture} />}
          {activeTab === 'overload' && <OverloadSection fixture={fixture} />}
        </div>
      </div>
    </div>
  );
}
