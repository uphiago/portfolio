// Dino game top 10 ranking -> Supabase (PostgREST, publishable key + RLS).

export const DINO_MAX_NICKNAME = 24;
export const DINO_MAX_SCORE = 99999;
export const DINO_TOP_LIMIT = 10;

export const DINO_HACKER_THRESHOLD = 50000;

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

export function getScoreSubmissionMode() {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SECRET_KEY) {
    return "secret_key";
  }
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return "service_role";
  }
  if (
    process.env.SUPABASE_POOLER_CONNECTION &&
    process.env.SUPABASE_DB_PASSWORD
  ) {
    return "database";
  }
  return null;
}

export function sanitizeNickname(value) {
  return validateNickname(value).value || "";
}

export function validateNickname(value) {
  if (typeof value !== "string" || !/\S/u.test(value)) {
    return { value: null, error: "nickname_blank" };
  }
  if (Array.from(value).length > DINO_MAX_NICKNAME) {
    return { value: null, error: "nickname_too_long" };
  }
  return { value, error: null };
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

function dedupByNickname(rows) {
  const seen = new Set();
  return rows.filter((row) => {
    const key = row.nickname?.toLowerCase();
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export async function fetchTopScores(limit = DINO_TOP_LIMIT) {
  const { url, key } = supabaseConfig();
  const params = new URLSearchParams({
    select: "nickname,score,created_at,flagged",
    order: "score.desc,created_at.asc",
    limit: String(limit * 3),
  });

  const res = await fetch(`${url}/rest/v1/dino_scores?${params}`, {
    headers: restHeaders(key),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`supabase select failed: ${res.status}`);
  }
  const rows = await res.json();
  return dedupByNickname(rows).slice(0, limit);
}

export async function fetchLastScores(limit = DINO_TOP_LIMIT) {
  const { url, key } = supabaseConfig();
  const params = new URLSearchParams({
    select: "nickname,score,created_at,flagged",
    order: "created_at.desc",
    limit: String(limit * 3),
  });

  const res = await fetch(`${url}/rest/v1/dino_scores?${params}`, {
    headers: restHeaders(key),
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`supabase select failed: ${res.status}`);
  }
  const rows = await res.json();
  return dedupByNickname(rows).slice(0, limit);
}

export async function fetchScoreboard(limit = DINO_TOP_LIMIT) {
  const { url, key } = supabaseConfig();
  const res = await fetch(`${url}/rest/v1/rpc/get_dino_scoreboard`, {
    method: "POST",
    headers: restHeaders(key),
    cache: "no-store",
    body: JSON.stringify({ p_limit: limit }),
  });
  if (!res.ok) {
    throw new Error(`supabase scoreboard failed: ${res.status}`);
  }
  return res.json();
}

export async function submitDinoScore({ nickname, score }) {
  const { url, key } = supabaseConfig();
  const res = await fetch(`${url}/rest/v1/rpc/submit_dino_score`, {
    method: "POST",
    headers: restHeaders(key),
    cache: "no-store",
    body: JSON.stringify({ p_nickname: nickname, p_score: score }),
  });
  if (!res.ok) {
    throw new Error(`supabase score submission failed: ${res.status}`);
  }
  return res.json();
}

export async function submitDinoScoreWithSecret({ nickname, score }) {
  const url = process.env.SUPABASE_URL || "";
  const key = process.env.SUPABASE_SECRET_KEY || "";
  const res = await fetch(`${url}/rest/v1/rpc/submit_dino_score`, {
    method: "POST",
    headers: {
      apikey: key,
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({ p_nickname: nickname, p_score: score }),
  });
  if (!res.ok) {
    throw new Error(`supabase secret score submission failed: ${res.status}`);
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
