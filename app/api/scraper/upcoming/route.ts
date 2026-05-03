import { NextResponse } from "next/server";

const SB_URL = "https://bhdvltxqdhouvycyxwft.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoZHZsdHhxZGhvdXZ5Y3l4d2Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NDM2ODYsImV4cCI6MjA3NjExOTY4Nn0.mIVyn9Thbz7G3FMgnys5jC9iJFa0kBMAlWu9oi1vuYs";
const GAME_ID = "45ddae54-7587-4b58-bff5-7a9e5e16bbe4";
const ONLINE_FT = "17c529d2-7236-4646-9b53-db1a7a2882e0";
const LAN_FT = "b2a7ca99-ffc9-41d0-8344-e0216a284367";
const SB_HEADERS = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json" };

async function sb(path: string, opts: RequestInit = {}) {
  return fetch(`${SB_URL}/rest/v1/${path}`, { headers: SB_HEADERS, ...opts });
}

function isLan(eventName: string): boolean {
  const lower = eventName.toLowerCase();
  return lower.includes("major") && !lower.includes("qualifier") && !lower.includes("minor");
}

async function resolveTeam(name: string): Promise<string | null> {
  const res = await sb(`Teams?name=ilike.*${encodeURIComponent(name)}*&select=id`);
  const rows = await res.json();
  if (rows.length > 0) return rows[0].id;
  const createRes = await sb("Teams", {
    method: "POST",
    headers: { ...SB_HEADERS, Prefer: "return=representation" },
    body: JSON.stringify({ name, game_id: GAME_ID }),
  });
  const created = await createRes.json();
  return created[0]?.id ?? null;
}

async function getLeague(): Promise<string | null> {
  const res = await sb(`Leagues?game_id=eq.${GAME_ID}&select=id&limit=1`);
  const rows = await res.json();
  return rows[0]?.id ?? null;
}

export async function POST() {
  try {
    const leagueId = await getLeague();
    if (!leagueId) return NextResponse.json({ error: "No league found for CDL game" }, { status: 500 });

    let cursor: string | null = null;
    let totalFixtures = 0;

    while (true) {
      const input: Record<string, unknown> = {
        json: { seasonId: 2026, status: "upcoming_live", cdlOnly: true, teamIds: [], eventIds: [], pageSize: 25, direction: "forward", ...(cursor ? { cursor } : {}) },
      };
      const bpRes = await fetch(`https://breakingpoint.gg/api/trpc/matches.fetchMatchesPage?input=${encodeURIComponent(JSON.stringify(input))}`);
      if (!bpRes.ok) break;
      const bpData = await bpRes.json();
      const page = bpData?.result?.data?.json;
      const matches = page?.matches || page?.items || page?.data || [];
      if (!Array.isArray(matches) || matches.length === 0) break;

      for (const match of matches) {
        const team1Name = match.team1?.name || match.team1_name;
        const team2Name = match.team2?.name || match.team2_name;

        // Skip TBD teams
        if (!team1Name || !team2Name || team1Name === "TBD" || team2Name === "TBD") continue;

        const team1Id = await resolveTeam(team1Name);
        const team2Id = await resolveTeam(team2Name);
        if (!team1Id || !team2Id) continue;

        const eventName = match.event?.name || match.event_name || "";
        const fixtureTypeId = isLan(eventName) ? LAN_FT : ONLINE_FT;
        const startDate = match.start_time || match.scheduled_at || new Date().toISOString();

        // Check if fixture already exists
        const existRes = await sb(`Fixtures?team1_id=eq.${team1Id}&team2_id=eq.${team2Id}&start_date_time=eq.${encodeURIComponent(startDate)}&select=id`);
        const existRows = await existRes.json();
        let fixtureId: string;

        if (Array.isArray(existRows) && existRows.length > 0) {
          fixtureId = existRows[0].id;
        } else {
          const createRes = await sb("Fixtures", {
            method: "POST",
            headers: { ...SB_HEADERS, Prefer: "return=representation" },
            body: JSON.stringify({
              team1_id: team1Id,
              team2_id: team2Id,
              fixture_type_id: fixtureTypeId,
              league_id: leagueId,
              series_length: 5,
              start_date_time: startDate,
              game_id: GAME_ID,
            }),
          });
          const created = await createRes.json();
          fixtureId = created[0]?.id;
        }

        if (!fixtureId) continue;

        // Create placeholder MatchResult with no winner
        const bpMatchId = String(match.id);
        const mrExist = await sb(`MatchResults?bp_match_id=eq.${bpMatchId}&select=id`);
        const mrRows = await mrExist.json();
        if (!Array.isArray(mrRows) || mrRows.length === 0) {
          await sb("MatchResults", {
            method: "POST",
            body: JSON.stringify({
              fixture_id: fixtureId,
              team1_score: 0,
              team2_score: 0,
              winner_id: null,
              bp_match_id: bpMatchId,
            }),
          });
        }
        totalFixtures++;
      }

      cursor = page?.nextCursor || page?.next_cursor || null;
      if (!cursor) break;
    }

    return NextResponse.json({ success: true, message: `Upcoming fixtures synced: ${totalFixtures} processed.` });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
  }
}
