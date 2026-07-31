// Dino game top 10 ranking -> Supabase (PostgREST, publishable key + RLS).

export const DINO_MAX_NICKNAME = 24;
export const DINO_MAX_SCORE = 99999;
export const DINO_TOP_LIMIT = 10;

// Scores >= 10k get flagged as tampered.
export const DINO_HACKER_THRESHOLD = 10000;

function supabaseConfig() {
  return {
    url: process.env.SUPABASE_URL || "",
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

export function isHackerScore(score) {
  return Number.isInteger(score) && score >= DINO_HACKER_THRESHOLD;
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
    select: "nickname,score,created_at,flagged",
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
    select: "nickname,score,created_at,flagged",
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

export async function insertScore({ nickname, score, flagged = false }) {
  const { url, key } = supabaseConfig();
  const res = await fetch(`${url}/rest/v1/dino_scores`, {
    method: "POST",
    headers: {
      ...restHeaders(key),
      Prefer: "return=minimal",
    },
    body: JSON.stringify({ nickname, score, flagged }),
  });
  if (!res.ok) {
    throw new Error(`supabase insert failed: ${res.status}`);
  }
}

export async function fetchPersonalBest(nickname) {
  const { url, key } = supabaseConfig();
  const params = new URLSearchParams({
    select: "score",
    nickname: `eq.${encodeURIComponent(nickname)}`,
    order: "score.desc",
    limit: "1",
  });

  const res = await fetch(`${url}/rest/v1/dino_scores?${params}`, {
    headers: restHeaders(key),
    cache: "no-store",
  });
  if (!res.ok) {
    return 0;
  }
  const rows = await res.json();
  return rows.length > 0 ? rows[0].score : 0;
}
