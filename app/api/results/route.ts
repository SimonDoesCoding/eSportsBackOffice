import { NextResponse } from "next/server";

const SB_URL = "https://bhdvltxqdhouvycyxwft.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoZHZsdHhxZGhvdXZ5Y3l4d2Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NDM2ODYsImV4cCI6MjA3NjExOTY4Nn0.mIVyn9Thbz7G3FMgnys5jC9iJFa0kBMAlWu9oi1vuYs";
const HEADERS = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}` };

export async function GET() {
  try {
    const mrRes = await fetch(`${SB_URL}/rest/v1/MatchResults?winner_id=not.is.null&order=created_at.desc&limit=200`, { headers: HEADERS });
    const matchResults = await mrRes.json();

    const teamsRes = await fetch(`${SB_URL}/rest/v1/Teams?select=id,name`, { headers: HEADERS });
    const teams = await teamsRes.json();
    const teamMap: Record<string, string> = {};
    for (const t of teams) teamMap[t.id] = t.name;

    // Fetch fixtures for start dates
    const fixtureIds = [...new Set(matchResults.map((mr: Record<string, unknown>) => mr.fixture_id).filter(Boolean))];
    const fixturesRes = await fetch(`${SB_URL}/rest/v1/Fixtures?id=in.(${fixtureIds.map((id: unknown) => `"${id}"`).join(",")})&select=id,start_date`, { headers: HEADERS });
    const fixtures = await fixturesRes.json();
    const fixtureMap: Record<string, string> = {};
    if (Array.isArray(fixtures)) for (const f of fixtures) fixtureMap[f.id] = f.start_date;

    // Fetch map results
    const mrIds = matchResults.map((mr: Record<string, unknown>) => mr.id);
    const mapRes = await fetch(`${SB_URL}/rest/v1/MapResults?match_result_id=in.(${mrIds.map((id: unknown) => `"${id}"`).join(",")})&order=map_index.asc`, { headers: HEADERS });
    const mapResults = await mapRes.json();
    const mapsByMatch: Record<string, Array<Record<string, unknown>>> = {};
    if (Array.isArray(mapResults)) {
      for (const m of mapResults) {
        const key = m.match_result_id as string;
        if (!mapsByMatch[key]) mapsByMatch[key] = [];
        mapsByMatch[key].push({
          map_index: m.map_index,
          game_mode: m.game_mode,
          map_name: m.map_name,
          team1_score: m.team1_score,
          team2_score: m.team2_score,
          winner_id: m.winner_id,
        });
      }
    }

    const results = matchResults.map((mr: Record<string, unknown>) => ({
      id: mr.id,
      fixture_id: mr.fixture_id,
      team1_name: teamMap[mr.team1_id as string] || "Unknown",
      team2_name: teamMap[mr.team2_id as string] || "Unknown",
      team1_id: mr.team1_id,
      team2_id: mr.team2_id,
      winner_id: mr.winner_id,
      team1_score: mr.team1_score,
      team2_score: mr.team2_score,
      start_date: fixtureMap[mr.fixture_id as string] || mr.created_at,
      maps: mapsByMatch[mr.id as string] || [],
    }));

    // Sort by fixture start date descending
    results.sort((a: Record<string, unknown>, b: Record<string, unknown>) =>
      new Date(b.start_date as string).getTime() - new Date(a.start_date as string).getTime()
    );

    return NextResponse.json(results);
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
  }
}
