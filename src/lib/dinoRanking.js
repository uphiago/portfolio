// Dino game top 10 ranking -> Supabase (PostgREST, publishable key + RLS).

export const DINO_MAX_NICKNAME = 24;
export const DINO_MAX_SCORE = 99999;
export const DINO_TOP_LIMIT = 10;
// Playful honeypot: anything this high is tampering (the legit game tops out
// far below). Scores at/over this get flagged and trigger the hacker notice.
export const DINO_HACKER_THRESHOLD = 50000;

function supabaseConfig() {
  return {
    url: process.env.SUPABASE_URL || "",
    // Prefer the secret (service role) key: it bypasses RLS so inserts stay
    // server-only. Falls back to the publishable key for local dev.
    key:
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_PUBLISHABLE_KEY ||
      "",
  };
}

export function isRankingConfigured() {
  const { url, key } = supabaseConfig();
  return Boolean(url && key);
}

export function sanitizeNickname(value) {
  return String(value || "").replace(/\s+/g, " ").trim().slice(0, DINO_MAX_NICKNAME);
}

export function normalizeScore(value) {
  const score = Number(value);
  if (!Number.isInteger(score) || score < 1 || score > DINO_MAX_SCORE) {
    return null;
  }
  return score;
}

export function qualifiesForTop10(score, scores, limit = DINO_TOP_LIMIT) {
  if (!Number.isInteger(score) || score < 1) {
    return false;
  }
  if (!Array.isArray(scores) || scores.length < limit) {
    return true;
  }
  return score > Number(scores[limit - 1]?.score || 0);
}

function restHeaders(key) {
  return {
    apikey: key,
    Authorization: `Bearer ${key}`,
    "Content-Type": "application/json",
  };
}

export async function fetchTopScores(limit = DINO_TOP_LIMIT) {
  const { url, key } = supabaseConfig();
  const params = new URLSearchParams({
    select: "nickname,score,created_at",
    order: "score.desc,created_at.asc",
    limit: String(limit),
  });

  const res = await fetch(`${url}/rest/v1/dino_scores?${params}`, {
    headers: restHeaders(key),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`supabase select failed: ${res.status}`);
  }
  return res.json();
}

export async function fetchLastScores(limit = DINO_TOP_LIMIT) {
  const { url, key } = supabaseConfig();
  const params = new URLSearchParams({
    select: "nickname,score,created_at",
    order: "created_at.desc",
    limit: String(limit),
  });

  const res = await fetch(`${url}/rest/v1/dino_scores?${params}`, {
    headers: restHeaders(key),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`supabase select failed: ${res.status}`);
  }
  return res.json();
}

export async function insertScore({ nickname, score }) {
  const { url, key } = supabaseConfig();
  const res = await fetch(`${url}/rest/v1/dino_scores`, {
    method: "POST",
    headers: {
      ...restHeaders(key),
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ nickname, score }),
  });
  if (!res.ok) {
    throw new Error(`supabase insert failed: ${res.status}`);
  }
}
