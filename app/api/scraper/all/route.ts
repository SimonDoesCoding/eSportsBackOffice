import { NextResponse } from "next/server";
import { headers } from "next/headers";

export async function POST() {
  try {
    const hdrs = await headers();
    const host = hdrs.get("host") || "localhost:3000";
    const protocol = host.startsWith("localhost") ? "http" : "https";
    const base = `${protocol}://${host}/api/scraper`;

    const results: Record<string, unknown> = {};

    for (const route of ["player-stats", "team-stats", "completed", "upcoming"]) {
      try {
        const res = await fetch(`${base}/${route}`, { method: "POST" });
        results[route] = await res.json();
      } catch (e: unknown) {
        results[route] = { error: e instanceof Error ? e.message : "Failed" };
      }
    }

    return NextResponse.json({ success: true, results });
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Unknown error" }, { status: 500 });
  }
}
