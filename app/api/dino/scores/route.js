import { NextResponse } from "next/server";
import {
  DINO_TOP_LIMIT,
  fetchScoreboard,
  isRankingConfigured,
} from "@/src/lib/dinoRanking";

export const runtime = "nodejs";
// Always refetch on F5 — never prerender or cache the leaderboard.
export const dynamic = "force-dynamic";

export async function GET() {
  if (!isRankingConfigured()) {
    return NextResponse.json({
      ok: true,
      disabled: true,
      recent: [],
      topWithPirates: [],
      topLegitimate: [],
    });
  }

  try {
    const scoreboard = await fetchScoreboard(DINO_TOP_LIMIT);
    return NextResponse.json({ ok: true, ...scoreboard });
  } catch (error) {
    console.error("dino scores failed", error);
    return NextResponse.json({
      ok: true,
      disabled: true,
      recent: [],
      topWithPirates: [],
      topLegitimate: [],
    });
  }
}
