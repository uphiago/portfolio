import { NextResponse } from "next/server";
import {
  DINO_HACKER_THRESHOLD,
  insertScore,
  isRankingConfigured,
  normalizeScore,
  sanitizeNickname,
} from "@/src/lib/dinoRanking";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const DINO_SCORE_RATE_LIMIT_MS = 5000;

const attempts = globalThis.__dinoScoreAttempts || new Map();
globalThis.__dinoScoreAttempts = attempts;

function getClientKey(request) {
  const forwardedFor = request.headers.get("x-forwarded-for") || "";
  return (
    forwardedFor.split(",")[0].trim() ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

export async function POST(request) {
  if (!isRankingConfigured()) {
    return NextResponse.json(
      { ok: false, error: "disabled" },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  const nickname = sanitizeNickname(body?.nickname);
  const score = normalizeScore(body?.score);

  if (!nickname || score === null) {
    return NextResponse.json(
      { ok: false, error: "invalid_payload" },
      { status: 400 }
    );
  }

  const key = getClientKey(request);
  const now = Date.now();
  if (now - (attempts.get(key) || 0) < DINO_SCORE_RATE_LIMIT_MS) {
    return NextResponse.json(
      { ok: false, error: "rate_limited" },
      { status: 429 }
    );
  }
  attempts.set(key, now);

  try {
    await insertScore({ nickname, score });
    return NextResponse.json({
      ok: true,
      hacker: score >= DINO_HACKER_THRESHOLD,
    });
  } catch (error) {
    console.error("dino score insert failed", error);
    return NextResponse.json(
      { ok: false, error: "submit_failed" },
      { status: 500 }
    );
  }
}
