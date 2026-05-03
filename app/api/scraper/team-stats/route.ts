import { NextResponse } from "next/server";

const SB_URL = "https://bhdvltxqdhouvycyxwft.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoZHZsdHhxZGhvdXZ5Y3l4d2Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NDM2ODYsImV4cCI6MjA3NjExOTY4Nn0.mIVyn9Thbz7G3FMgnys5jC9iJFa0kBMAlWu9oi1vuYs";
const SB_HEADERS = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json" };

const BP_INPUT = encodeURIComponent(JSON.stringify({
  json: { onlyCDLStats: true, seasonId: 2026, modeId: [1, 2, 3, 4, 5], mapId: [], eventType: [], eventId: [], teamId: [], onlyChallengersStats: false, startAt: null, endAt: null, aggregateMatchStats: true },
  meta: { values: { startAt: ["undefined"], endAt: ["undefined"] } }
}));

// BP team_id -> team name mapping for CDL teams
const BP_TEAM_MAP: Record<number, string> = {
  1: "Atlanta FaZe", 2: "Boston Breach", 3: "Carolina Royal Ravens", 4: "Cloud9 New York",
  5: "Los Angeles Guerrillas", 6: "Los Angeles Thieves", 7: "Miami Heretics", 8: "Minnesota ROKKR",
  9: "New York Subliners", 10: "Optic Texas", 11: "Seattle Surge", 12: "Toronto Ultra",
  13: "Vegas Legion", 14: "Paris Legion", 15: "London Royal Ravens", 16: "Florida Mutineers",
  17: "Faze Vegas", 18: "G2 Min", 19: "Miami", 20: "Paris", 21: "Falcons",
  22: "Toronto", 23: "Vancouver",
};

async function sb(path: string, opts: RequestInit = {}) {
  return fetch(`${SB_URL}/rest/v1/${path}`, { headers: SB_HEADERS, ...opts });
}

export async function POST() {
  try {
    const res = await fetch(`https://breakingpoint.gg/api/trpc/teamStats.getAggregatedOrderedTeamStats?input=${BP_INPUT}`);
    if (!res.ok) return NextResponse.json({ error: `BP API error: ${res.status}` }, { status: 500 });
    const data = await res.json();
    const teams = data?.result?.data?.json;
    if (!Array.isArray(teams)) return NextResponse.json({ error: "Unexpected BP response structure" }, { status: 500 });

    let synced = 0;

    for (const t of teams) {
      // Resolve team name from response or fallback to mapping
      const teamName = t.team_name || t.team?.name || BP_TEAM_MAP[t.team_id] || null;
      if (!teamName) continue;

      // Lookup team in Supabase
      const teamRes = await sb(`Teams?name=ilike.*${encodeURIComponent(teamName)}*&select=id`);
      const teamRows = await teamRes.json();
      if (!Array.isArray(teamRows) || teamRows.length === 0) continue;
      const teamId = teamRows[0].id;

      // Check for existing TeamStats
      const existingRes = await sb(`TeamStats?team_id=eq.${teamId}&select=id`);
      const existing = await existingRes.json();

      const statsData = {
        team_id: teamId,
        hardpoint_win_percent: t.hp_map_win_percentage ?? 0,
        search_destroy_win_percent: t.snd_map_win_percentage ?? 0,
        overload_win_percent: t.ovl_map_win_percentage ?? 0,
        hardpoint_avg_score: t.hp_average_points ?? 0,
        search_destroy_avg_round_wins: t.snd_average_points ?? 0,
        overload_avg_score: t.ovl_average_points ?? 0,
      };

      if (existing.length > 0) {
        await sb(`TeamStats?id=eq.${existing[0].id}`, {
          method: "PATCH",
          headers: { ...SB_HEADERS, Prefer: "return=representation" },
          body: JSON.stringify(statsData),
        });
      } else {
        await sb("TeamStats", {
          method: "POST",
          headers: { ...SB_HEADERS, Prefer: "return=representation" },
          body: JSON.stringify(statsData),
        });
      }
      synced++;
    }

    return NextResponse.json({ success: true, message: `Team stats synced for ${synced} teams.` });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
  }
}
