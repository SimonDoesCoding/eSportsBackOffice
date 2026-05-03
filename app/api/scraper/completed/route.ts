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
  // Create team
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

async function findOrCreateFixture(team1Id: string, team2Id: string, fixtureTypeId: string, leagueId: string, startDate: string): Promise<string> {
  // Check if fixture exists for these teams
  const res = await sb(`Fixtures?team1_id=eq.${team1Id}&team2_id=eq.${team2Id}&select=id&limit=1`);
  const rows = await res.json();
  if (rows.length > 0) return rows[0].id;

  // Also check reversed teams
  const res2 = await sb(`Fixtures?team1_id=eq.${team2Id}&team2_id=eq.${team1Id}&select=id&limit=1`);
  const rows2 = await res2.json();
  if (rows2.length > 0) return rows2[0].id;

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
  return created[0]?.id;
}

export async function POST() {
  try {
    const leagueId = await getLeague();
    if (!leagueId) return NextResponse.json({ error: "No league found for CDL game" }, { status: 500 });

    let cursor: string | null = null;
    let totalMatches = 0;
    let skipped = 0;

    while (true) {
      const input: Record<string, unknown> = {
        json: { seasonId: 2026, status: "completed", cdlOnly: true, teamIds: [], eventIds: [], pageSize: 25, direction: "forward", ...(cursor ? { cursor } : {}) },
      };
      const bpRes = await fetch(`https://breakingpoint.gg/api/trpc/matches.fetchMatchesPage?input=${encodeURIComponent(JSON.stringify(input))}`);
      if (!bpRes.ok) break;
      const bpData = await bpRes.json();
      const page = bpData?.result?.data?.json;
      const matches = page?.matches || page?.items || page?.data || [];
      if (!Array.isArray(matches) || matches.length === 0) break;

      for (const match of matches) {
        const bpMatchId = String(match.id);

        // Skip if already exists
        const existingRes = await sb(`MatchResults?bp_match_id=eq.${bpMatchId}&select=id`);
        const existing = await existingRes.json();
        if (Array.isArray(existing) && existing.length > 0) { skipped++; continue; }

        const team1Name = match.team1?.name || match.team1_name;
        const team2Name = match.team2?.name || match.team2_name;
        if (!team1Name || !team2Name) continue;

        const team1Id = await resolveTeam(team1Name);
        const team2Id = await resolveTeam(team2Name);
        if (!team1Id || !team2Id) continue;

        const eventName = match.event?.name || match.event_name || "";
        const fixtureTypeId = isLan(eventName) ? LAN_FT : ONLINE_FT;
        const startDate = match.start_time || match.scheduled_at || new Date().toISOString();

        const fixtureId = await findOrCreateFixture(team1Id, team2Id, fixtureTypeId, leagueId, startDate);
        if (!fixtureId) continue;

        // Determine winner
        const t1Score = match.team1_score ?? match.score?.team1 ?? 0;
        const t2Score = match.team2_score ?? match.score?.team2 ?? 0;
        const winnerId = t1Score > t2Score ? team1Id : t2Score > t1Score ? team2Id : null;

        // Create MatchResult
        const mrRes = await sb("MatchResults", {
          method: "POST",
          headers: { ...SB_HEADERS, Prefer: "return=representation" },
          body: JSON.stringify({
            fixture_id: fixtureId,
            team1_score: t1Score,
            team2_score: t2Score,
            winner_id: winnerId,
            bp_match_id: bpMatchId,
            completed_at: match.end_time || match.completed_at || startDate,
          }),
        });
        const mrRows = await mrRes.json();
        const matchResultId = mrRows[0]?.id;

        // Fetch match detail for per-map stats
        if (matchResultId) {
          try {
            const detailRes = await fetch(`https://breakingpoint.gg/match/${bpMatchId}`, {
              headers: { "User-Agent": "Mozilla/5.0" },
            });
            if (detailRes.ok) {
              const html = await detailRes.text();
              const ndMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/);
              if (ndMatch) {
                const nextData = JSON.parse(ndMatch[1]);
                const games = nextData?.props?.pageProps?.match?.games ||
                              nextData?.props?.pageProps?.games || [];

                for (let i = 0; i < games.length; i++) {
                  const game = games[i];
                  const mapT1Score = game.team1_score ?? game.score?.team1 ?? 0;
                  const mapT2Score = game.team2_score ?? game.score?.team2 ?? 0;
                  const mapWinnerId = mapT1Score > mapT2Score ? team1Id : mapT2Score > mapT1Score ? team2Id : null;

                  const mapRes = await sb("MapResults", {
                    method: "POST",
                    headers: { ...SB_HEADERS, Prefer: "return=representation" },
                    body: JSON.stringify({
                      match_result_id: matchResultId,
                      map_number: i + 1,
                      map_name: game.map_name || game.map?.name || `Map ${i + 1}`,
                      game_mode: game.mode_name || game.mode?.name || "Unknown",
                      team1_score: mapT1Score,
                      team2_score: mapT2Score,
                      winner_id: mapWinnerId,
                    }),
                  });
                  const mapRows = await mapRes.json();
                  const mapResultId = mapRows[0]?.id;

                  // Insert player stats for this map
                  if (mapResultId && game.player_stats) {
                    for (const ps of game.player_stats) {
                      const playerName = ps.player_tag || ps.player?.tag || ps.player_name;
                      if (!playerName) continue;

                      // Lookup player
                      const plRes = await sb(`Players?name=eq.${encodeURIComponent(playerName)}&select=id`);
                      const plRows = await plRes.json();
                      const plId = plRows[0]?.id;
                      if (!plId) continue;

                      const plTeamName = ps.team_name || ps.team?.name || "";
                      const plTeamId = plTeamName.toLowerCase().includes(team1Name.toLowerCase()) ? team1Id : team2Id;

                      await sb("MapPlayerStats", {
                        method: "POST",
                        body: JSON.stringify({
                          map_result_id: mapResultId,
                          player_id: plId,
                          team_id: plTeamId,
                          kills: ps.kills ?? 0,
                          deaths: ps.deaths ?? 0,
                          assists: ps.assists ?? 0,
                          damage: ps.damage ?? 0,
                        }),
                      });
                    }
                  }
                }
              }
            }
          } catch {
            // Non-fatal: skip map details if parsing fails
          }
        }
        totalMatches++;
      }

      cursor = page?.nextCursor || page?.next_cursor || null;
      if (!cursor) break;
    }

    return NextResponse.json({ success: true, message: `Completed matches synced: ${totalMatches} new, ${skipped} skipped.` });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
  }
}
