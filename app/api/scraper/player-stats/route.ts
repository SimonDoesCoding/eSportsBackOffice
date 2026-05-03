import { NextResponse } from "next/server";

const SB_URL = "https://bhdvltxqdhouvycyxwft.supabase.co";
const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJoZHZsdHhxZGhvdXZ5Y3l4d2Z0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA1NDM2ODYsImV4cCI6MjA3NjExOTY4Nn0.mIVyn9Thbz7G3FMgnys5jC9iJFa0kBMAlWu9oi1vuYs";
const GAME_ID = "45ddae54-7587-4b58-bff5-7a9e5e16bbe4";
const SB_HEADERS = { apikey: SB_KEY, Authorization: `Bearer ${SB_KEY}`, "Content-Type": "application/json" };

const BP_INPUT = encodeURIComponent(JSON.stringify({
  json: { onlyCDLStats: true, seasonId: 2026, modeId: [1, 2, 3, 4, 5], mapId: [], eventType: [], eventId: [], teamId: [], onlyChallengersStats: false, startAt: null, endAt: null, aggregateMatchStats: true },
  meta: { values: { startAt: ["undefined"], endAt: ["undefined"] } }
}));

async function sb(path: string, opts: RequestInit = {}) {
  return fetch(`${SB_URL}/rest/v1/${path}`, { headers: SB_HEADERS, ...opts });
}

export async function POST() {
  try {
    const res = await fetch(`https://breakingpoint.gg/api/trpc/playerStats.getAggregatedOrderedPlayerStats?input=${BP_INPUT}`);
    if (!res.ok) return NextResponse.json({ error: `BP API error: ${res.status}` }, { status: 500 });
    const data = await res.json();
    const players = data?.result?.data?.json;
    if (!Array.isArray(players)) return NextResponse.json({ error: "Unexpected BP response structure" }, { status: 500 });

    let created = 0, updated = 0;

    for (const p of players) {
      const tag = p.player_tag;
      if (!tag) continue;

      // Lookup player by name
      const playerRes = await sb(`Players?name=eq.${encodeURIComponent(tag)}&select=id`);
      const playerRows = await playerRes.json();
      let playerId: string;

      if (playerRows.length === 0) {
        // Create player
        const createRes = await sb("Players", {
          method: "POST",
          headers: { ...SB_HEADERS, Prefer: "return=representation" },
          body: JSON.stringify({ name: tag, game_id: GAME_ID, status: "active" }),
        });
        const created_rows = await createRes.json();
        playerId = created_rows[0]?.id;
        if (!playerId) continue;
        created++;
      } else {
        playerId = playerRows[0].id;
      }

      // Delete old stats
      await sb(`PlayerStats?player_id=eq.${playerId}`, { method: "DELETE" });

      // Calculate snd_odl (opening duels lost) from odw_pct and odw
      const sndOdw = p.snd_odw ?? 0;
      const sndOdwPct = p.snd_odw_pct ?? 0;
      const totalDuels = sndOdwPct > 0 ? Math.round(sndOdw / (sndOdwPct / 100)) : 0;
      const sndOdl = totalDuels - sndOdw;

      // Insert new stats
      await sb("PlayerStats", {
        method: "POST",
        headers: { ...SB_HEADERS, Prefer: "return=representation" },
        body: JSON.stringify({
          player_id: playerId,
          hardpoint_kd_ratio: p.hp_kd ?? 0,
          hardpoint_hilltime_per_10_mins: p.hp_obj_10m ?? p.hp_obj_time ?? 0,
          hardpoint_kills: p.hp_kills ?? 0,
          hardpoint_deaths: p.hp_deaths ?? 0,
          hardpoint_maps_played: p.hp_game_count ?? 0,
          search_destroy_kd_ratio: p.snd_kd ?? 0,
          search_destroy_opening_duel_win_percent: sndOdwPct,
          search_destroy_kills: p.snd_kills ?? 0,
          search_destroy_deaths: p.snd_deaths ?? 0,
          search_destroy_kills_per_round: p.snd_kpr ?? 0,
          search_destroy_deaths_per_round: p.snd_dpr ?? 0,
          search_destroy_plants: p.plant_count ?? 0,
          search_destroy_defuses: p.defuse_count ?? 0,
          search_destroy_opening_duels_won: sndOdw,
          search_destroy_opening_duels_lost: sndOdl,
          search_destroy_maps_played: p.snd_game_count ?? 0,
          overload_kills: p.ovl_kills ?? 0,
          overload_deaths: p.ovl_deaths ?? 0,
          overload_kd_ratio: p.ovl_kd ?? 0,
          overload_objectives: p.ovl_overloads ?? 0,
          overload_maps_played: p.ovl_game_count ?? 0,
          avg_overload_deaths: p.ovl_game_count ? (p.ovl_deaths ?? 0) / p.ovl_game_count : 0,
        }),
      });
      updated++;
    }

    return NextResponse.json({ success: true, message: `Player stats synced. ${created} new players, ${updated} stats updated.` });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
  }
}
