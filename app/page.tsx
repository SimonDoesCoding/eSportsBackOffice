"use client";

import { useState } from "react";

import { useTeams } from "../hooks/useTeams";
import { useUpcomingFixtures } from "../hooks/useFixtures";
import { ApiDebug } from "./components/ApiDebug";
import { Team, Fixture } from "../types";
import { getTeamConfig, brand } from "../utils/teamConfig";
import Link from "next/link";
import Image from "next/image";

// Extended brand colors for dashboard
const dashboardBrand = {
  ...brand,
  coralHover: "#D4544A",
  tealHover: "#6BAA98",
  gray: "#C4C4C4",
  charcoal: "#4A4A4A",
};

export default function Dashboard() {
  const { data: teams } = useTeams();
  const { data: fixtures } = useUpcomingFixtures();

  // Type-safe helpers
  const teamsData = teams as Team[] | undefined;
  const fixturesData = fixtures as Fixture[] | undefined;

  const upcomingFixtures = fixturesData || [];
  const recentResults: never[] = []; // Results API not implemented yet - empty array

  const [scraperStatus, setScraperStatus] = useState<Record<string, string>>(
    {},
  );
  const runScraper = async (endpoint: string) => {
    setScraperStatus((prev) => ({ ...prev, [endpoint]: "running" }));
    try {
      const res = await fetch("/api/scraper/" + endpoint, { method: "POST" });
      const data = await res.json();
      setScraperStatus((prev) => ({
        ...prev,
        [endpoint]: data.success ? "done" : "error",
      }));
    } catch {
      setScraperStatus((prev) => ({ ...prev, [endpoint]: "error" }));
    }
    setTimeout(
      () => setScraperStatus((prev) => ({ ...prev, [endpoint]: "" })),
      3000,
    );
  };

  // Calculate overall team stats from game mode win percentages
  const getOverallWinRate = (team: Team) => {
    const rates = team.gameModeWinPercents;

    return (rates.Hardpoint + rates.SearchAndDestroy + rates.Overload) / 3;
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      {/* Debug component - remove this once everything is working */}
      <div className="mb-6">
        <ApiDebug />
      </div>

      <div className="border-4 border-dashed border-gray-600 rounded-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Esports Management Dashboard
          </h2>
          <p className="text-gray-400">
            Welcome to your esports team management system
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div
            className="bg-gray-800 p-6 rounded-lg border-t-4"
            style={{ borderColor: brand.coral }}
          >
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: brand.coral }}
            >
              Teams
            </h3>
            <p className="text-2xl font-bold text-white">
              {teamsData?.length || 0}
            </p>
            <p className="text-gray-400 text-sm">Total teams</p>
          </div>

          <div
            className="bg-gray-800 p-6 rounded-lg border-t-4"
            style={{ borderColor: brand.teal }}
          >
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: brand.teal }}
            >
              Players
            </h3>
            <p className="text-2xl font-bold text-white">
              {teamsData?.reduce(
                (total, team) => total + team.players.length,
                0,
              ) || 0}
            </p>
            <p className="text-gray-400 text-sm">Active players</p>
          </div>

          <div
            className="bg-gray-800 p-6 rounded-lg border-t-4"
            style={{ borderColor: brand.coral }}
          >
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: brand.coral }}
            >
              Fixtures
            </h3>
            <p className="text-2xl font-bold text-white">
              {upcomingFixtures.length}
            </p>
            <p className="text-gray-400 text-sm">Upcoming matches</p>
          </div>

          <div
            className="bg-gray-800 p-6 rounded-lg border-t-4"
            style={{ borderColor: brand.teal }}
          >
            <h3
              className="text-lg font-semibold mb-2"
              style={{ color: brand.teal }}
            >
              Results
            </h3>
            <p className="text-2xl font-bold text-white">
              {recentResults.length}
            </p>
            <p className="text-gray-400 text-sm">Recent results</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8 bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Quick Actions
          </h3>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/teams"
              className="inline-flex items-center px-4 py-2 text-white rounded-md transition-colors"
              style={{ backgroundColor: brand.coral }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor =
                  dashboardBrand.coralHover)
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = brand.coral)
              }
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                ></path>
              </svg>
              Manage Teams
            </Link>
            <Link
              href="/fixtures"
              className="inline-flex items-center px-4 py-2 text-white rounded-md transition-colors"
              style={{ backgroundColor: brand.teal }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor =
                  dashboardBrand.tealHover)
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = brand.teal)
              }
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
              View Fixtures
            </Link>
            <Link
              href="/clients"
              className="inline-flex items-center px-4 py-2 text-white rounded-md transition-colors"
              style={{ backgroundColor: brand.coral }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor =
                  dashboardBrand.coralHover)
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = brand.coral)
              }
            >
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                ></path>
              </svg>
              Manage Clients
            </Link>
          </div>
        </div>

        {/* Data Management */}
        <div className="mb-8 bg-gray-800 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            Data Management
          </h3>
          <p className="text-gray-400 text-sm mb-4">
            Sync data from BreakingPoint.gg
          </p>
          <div className="flex flex-wrap gap-3">
            {[
              { key: "player-stats", label: "Refresh Player Stats" },
              { key: "team-stats", label: "Refresh Team Stats" },
              { key: "completed", label: "Scrape Results" },
              { key: "upcoming", label: "Scrape Upcoming" },
              { key: "all", label: "Run All" },
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => runScraper(key)}
                disabled={scraperStatus[key] === "running"}
                className={
                  "px-4 py-2 text-sm rounded-lg font-medium transition-all " +
                  (scraperStatus[key] === "running"
                    ? "bg-yellow-600 text-white"
                    : scraperStatus[key] === "done"
                      ? "bg-green-600 text-white"
                      : scraperStatus[key] === "error"
                        ? "bg-red-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600")
                }
              >
                {scraperStatus[key] === "running"
                  ? "Running..."
                  : scraperStatus[key] === "done"
                    ? "Done!"
                    : scraperStatus[key] === "error"
                      ? "Error"
                      : label}
              </button>
            ))}
          </div>
        </div>

        {upcomingFixtures.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-white mb-4">
              Recent Fixtures
            </h3>
            <div className="space-y-4">
              {upcomingFixtures
                .sort(
                  (a, b) =>
                    new Date(b.startDateTime).getTime() -
                    new Date(a.startDateTime).getTime(),
                )
                .slice(0, 3)
                .map((fixture) => (
                  <div
                    key={fixture.id}
                    className="bg-gray-800 p-4 rounded-lg flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-4">
                      <span className="text-white font-medium">
                        {fixture.team1.name}
                      </span>
                      <span className="text-gray-400">vs</span>
                      <span className="text-white font-medium">
                        {fixture.team2.name}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-400">
                        {new Date(fixture.startDateTime).toLocaleDateString()}
                      </p>
                      <span
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                        style={{
                          backgroundColor: brand.teal + "33",
                          color: brand.teal,
                        }}
                      >
                        {fixture.league.game.name}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {teamsData && teamsData.length > 0 && (
          <div>
            <h3 className="text-xl font-semibold text-white mb-4">Top Teams</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamsData
                .sort((a, b) => getOverallWinRate(b) - getOverallWinRate(a))
                .slice(0, 6)
                .map((team) => (
                  <div key={team.id} className="bg-gray-800 p-4 rounded-lg">
                    <div className="flex items-center mb-3">
                      {(() => {
                        const tc = getTeamConfig(team.name);
                        return tc.logo ? (
                          <Image
                            src={tc.logo}
                            alt={team.name}
                            width={40}
                            height={40}
                            className="mr-3"
                          />
                        ) : (
                          <div
                            className="h-10 w-10 rounded-full flex items-center justify-center mr-3"
                            style={{ backgroundColor: tc.color }}
                          >
                            <span className="text-sm font-medium text-white">
                              {team.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        );
                      })()}
                      <div>
                        <h4
                          className="font-medium"
                          style={{ color: getTeamConfig(team.name).color }}
                        >
                          {team.name}
                        </h4>
                        <p className="text-xs text-gray-400">
                          {team.players.length} players
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="text-center">
                        <p className="text-gray-400">HP</p>
                        <p
                          className="font-medium"
                          style={{ color: getTeamConfig(team.name).color }}
                        >
                          {(team.gameModeWinPercents.Hardpoint * 100).toFixed(
                            0,
                          )}
                          %
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400">SND</p>
                        <p
                          className="font-medium"
                          style={{ color: getTeamConfig(team.name).color }}
                        >
                          {(
                            team.gameModeWinPercents.SearchAndDestroy * 100
                          ).toFixed(0)}
                          %
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-gray-400">OL</p>
                        <p
                          className="font-medium"
                          style={{ color: getTeamConfig(team.name).color }}
                        >
                          {(team.gameModeWinPercents.Overload * 100).toFixed(0)}
                          %
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
