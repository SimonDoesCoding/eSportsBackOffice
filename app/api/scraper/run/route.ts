import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const { command = "all" } = await req.json().catch(() => ({ command: "all" }));

  const allowedCommands = ["all", "completed", "upcoming", "player-stats", "team-stats", "challenger-stats"];
  if (!allowedCommands.includes(command)) {
    return new Response(JSON.stringify({ error: "Invalid command" }), { status: 400 });
  }

  const args = [command];
  if (command === "completed") args.push("--all"); // Can be toggled from UI later

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (type: string, message: string) => {
        controller.enqueue(encoder.encode(JSON.stringify({ type, message, timestamp: new Date().toISOString() }) + "\n"));
      };

      send("info", `Starting scraper: ${command}`);

      try {
        const { spawn } = await import("child_process");
        const scraperPath = process.env.SCRAPER_PATH || "C:\\dev\\CDLStatScraper\\CDLStatScraper";
        const proc = spawn("dotnet", ["run", "--", ...args], {
          cwd: scraperPath,
          shell: true,
        });

        proc.stdout.on("data", (data: Buffer) => {
          const lines = data.toString().split("\n").filter((l: string) => l.trim());
          for (const line of lines) {
            const type = categoriseLine(line);
            send(type, line.trim());
          }
        });

        proc.stderr.on("data", (data: Buffer) => {
          send("error", data.toString().trim());
        });

        await new Promise<void>((resolve) => {
          proc.on("close", (code: number | null) => {
            send(code === 0 ? "success" : "error", `Scraper finished with exit code ${code}`);
            resolve();
          });
          proc.on("error", (err: Error) => {
            send("error", `Failed to start scraper: ${err.message}`);
            resolve();
          });
        });
      } catch (err) {
        send("error", `Error: ${err instanceof Error ? err.message : "Unknown"}`);
      }

      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
      "Cache-Control": "no-cache",
    },
  });
}

function categoriseLine(line: string): string {
  const trimmed = line.trim();
  if (trimmed.startsWith("===")) return "header";
  if (trimmed.startsWith("Skip") || trimmed.includes("(already")) return "skip";
  if (trimmed.startsWith("Created") || trimmed.includes("Created")) return "created";
  if (trimmed.startsWith("Found") || trimmed.startsWith("Fetched")) return "info";
  if (trimmed.startsWith("Processing") || trimmed.startsWith("Fixture:")) return "processing";
  if (trimmed.includes("inserted") || trimmed.includes("updated")) return "created";
  if (trimmed.startsWith("Error") || trimmed.startsWith("Unhandled")) return "error";
  if (trimmed === "Done.") return "success";
  return "info";
}
