import { afterEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";

import * as dinoRanking from "@/src/lib/dinoRanking";
import { POST } from "@/app/api/dino/score/route";
import { GET } from "@/app/api/dino/scores/route";

const {
  DINO_MAX_NICKNAME,
  DINO_MAX_SCORE,
  DINO_HACKER_THRESHOLD,
  fetchLastScores,
  fetchTopScores,
  insertScore,
  isRankingConfigured,
  normalizeScore,
  qualifiesForTop10,
  sanitizeNickname,
} = dinoRanking;

const ORIGINAL_ENV = { ...process.env };

describe("dino scoreboard migration", () => {
  it("defines database-owned honeypot and scoreboard invariants", () => {
    const sql = readFileSync(
      "supabase/migrations/20260802120000_dino_scoreboard.sql",
      "utf8"
    ).toLowerCase();

    expect(sql).toContain("create or replace function public.submit_dino_score");
    expect(sql).toContain("create or replace function public.get_dino_scoreboard");
    expect(sql).toContain("grant insert (nickname, score)");
    expect(sql).toContain("p_score >= 50000");
    expect(sql).toContain("pg_advisory_xact_lock");
    expect(sql).toContain('collate "c"');
    expect(sql).toContain("submission_source = 'anonymous'");
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
  process.env = { ...ORIGINAL_ENV };
});

describe("dinoRanking lib", () => {
  it("validates literal nicknames without rewriting them", () => {
    expect(dinoRanking.validateNickname(" Hiago  🦖 ")).toEqual({
      value: " Hiago  🦖 ",
      error: null,
    });
    expect(dinoRanking.validateNickname("   ")).toEqual({
      value: null,
      error: "nickname_blank",
    });
    expect(dinoRanking.validateNickname("x".repeat(25))).toEqual({
      value: null,
      error: "nickname_too_long",
    });
    expect(dinoRanking.validateNickname("🦖".repeat(24)).error).toBeNull();
  });

  it("uses 50k as the pirate threshold", () => {
    expect(dinoRanking.isHackerScore(49999)).toBe(false);
    expect(dinoRanking.isHackerScore(50000)).toBe(true);
  });

  it("preserves valid nicknames and rejects invalid ones without truncating", () => {
    expect(sanitizeNickname("  hiago   da silva  ")).toBe("  hiago   da silva  ");
    expect(sanitizeNickname("x".repeat(DINO_MAX_NICKNAME + 1))).toBe("");
    expect(sanitizeNickname(undefined)).toBe("");
  });

  it("normalizes scores within the accepted range", () => {
    expect(normalizeScore(10)).toBe(10);
    expect(normalizeScore("42")).toBe(42);
    expect(normalizeScore(0)).toBeNull();
    expect(normalizeScore(-5)).toBeNull();
    expect(normalizeScore(10.5)).toBeNull();
    expect(normalizeScore(DINO_MAX_SCORE + 1)).toBeNull();
    expect(normalizeScore("abc")).toBeNull();
    expect(normalizeScore(null)).toBeNull();
  });

  it("decides whether a score enters the top 10", () => {
    const scores = Array.from({ length: 10 }, (_, index) => ({ score: index + 1 }));

    expect(qualifiesForTop10(11, scores)).toBe(true);
    expect(qualifiesForTop10(10, scores)).toBe(false);
    expect(qualifiesForTop10(5, scores)).toBe(false);
    expect(qualifiesForTop10(0, scores)).toBe(false);
    expect(qualifiesForTop10(-1, scores)).toBe(false);
    expect(qualifiesForTop10(1, [])).toBe(true);
    expect(qualifiesForTop10(1, [{ score: 5 }])).toBe(true);
  });

  it("detects missing Supabase config", () => {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.SUPABASE_PUBLISHABLE_KEY;
    expect(isRankingConfigured()).toBe(false);

    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_PUBLISHABLE_KEY = "sb_publishable_123";
    expect(isRankingConfigured()).toBe(true);
  });

  it("uses the database pooler when local score submission has no service key", () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    process.env.SUPABASE_POOLER_CONNECTION =
      "postgresql://postgres.project@pooler.example.com:6543/postgres?sslmode=require";
    process.env.SUPABASE_DB_PASSWORD = "password-with-%";

    expect(dinoRanking.getScoreSubmissionMode()).toBe("database");

    delete process.env.SUPABASE_POOLER_CONNECTION;
    delete process.env.SUPABASE_DB_PASSWORD;
    expect(dinoRanking.getScoreSubmissionMode()).toBeNull();
  });

  it("prefers a modern Supabase secret key for server submissions", () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SECRET_KEY = "sb_secret_server_only";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "legacy-service-key";

    expect(dinoRanking.getScoreSubmissionMode()).toBe("secret_key");
  });

  it("prefers the service role key over the publishable key", () => {
    process.env.SUPABASE_URL = "https://x.supabase.co";
    process.env.SUPABASE_PUBLISHABLE_KEY = "sb_publishable_123";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "sb_secret_456";
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 201 });
    vi.stubGlobal("fetch", fetchMock);

    return insertScore({ nickname: "red", score: 5 }).then(() => {
      const [, options] = fetchMock.mock.calls[0];
      expect(options.headers.apikey).toBe("sb_secret_456");
      expect(options.headers.Authorization).toBe("Bearer sb_secret_456");
    });
  });

  it("fetches the top scores through PostgREST", async () => {
    process.env.SUPABASE_URL = "https://x.supabase.co";
    process.env.SUPABASE_PUBLISHABLE_KEY = "key-1";
    const rows = [{ nickname: "red", score: 1000, created_at: "2026-07-31T00:00:00Z" }];
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => rows });
    vi.stubGlobal("fetch", fetchMock);

    const result = await fetchTopScores(10);

    expect(result).toEqual(rows);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toContain("/rest/v1/dino_scores?");
    expect(url).toContain("score.desc");
    expect(url).toContain("created_at.asc");
    expect(url).toContain("limit=30");

    expect(options.headers.apikey).toBe("key-1");
    expect(options.headers.Authorization).toBe("Bearer key-1");
    expect(options.cache).toBe("no-store");
  });

  it("fetches the last scores ordered by recency", async () => {
    process.env.SUPABASE_URL = "https://x.supabase.co";
    process.env.SUPABASE_PUBLISHABLE_KEY = "key-1";
    const rows = [{ nickname: "red", score: 100, created_at: "2026-07-31T00:00:00Z" }];
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => rows });
    vi.stubGlobal("fetch", fetchMock);

    const result = await fetchLastScores(10);

    expect(result).toEqual(rows);
    const [url] = fetchMock.mock.calls[0];
    expect(url).toContain("order=created_at.desc");
    expect(url).toContain("limit=30");
  });

  it("inserts a score through PostgREST", async () => {
    process.env.SUPABASE_URL = "https://x.supabase.co";
    process.env.SUPABASE_PUBLISHABLE_KEY = "key-1";
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 201 });
    vi.stubGlobal("fetch", fetchMock);

    await insertScore({ nickname: "red", score: 777 });

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://x.supabase.co/rest/v1/dino_scores");
    expect(options.method).toBe("POST");
    expect(JSON.parse(options.body)).toEqual({ nickname: "red", score: 777, flagged: false });
  });

  it("flags the score when over threshold", async () => {
    process.env.SUPABASE_URL = "https://x.supabase.co";
    process.env.SUPABASE_PUBLISHABLE_KEY = "key-1";
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 201 });
    vi.stubGlobal("fetch", fetchMock);

    await insertScore({ nickname: "haxor", score: DINO_HACKER_THRESHOLD, flagged: true });

    const [, options] = fetchMock.mock.calls[0];
    const body = JSON.parse(options.body);
    expect(body.nickname).toBe("haxor");
    expect(body.flagged).toBe(true);
  });

  it("fetches all scoreboard views through one RPC", async () => {
    process.env.SUPABASE_URL = "https://x.supabase.co";
    process.env.SUPABASE_PUBLISHABLE_KEY = "key-1";
    const scoreboard = {
      recent: [{ nickname: " red ", score: 100, flagged: false }],
      topWithPirates: [{ nickname: "pirate", score: 50000, flagged: true }],
      topLegitimate: [{ nickname: " red ", score: 100, flagged: false }],
    };
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => scoreboard });
    vi.stubGlobal("fetch", fetchMock);

    await expect(dinoRanking.fetchScoreboard(10)).resolves.toEqual(scoreboard);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://x.supabase.co/rest/v1/rpc/get_dino_scoreboard");
    expect(options.method).toBe("POST");
    expect(JSON.parse(options.body)).toEqual({ p_limit: 10 });
  });

  it("submits a literal nickname through the atomic RPC", async () => {
    process.env.SUPABASE_URL = "https://x.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";
    const result = { inserted: true, skipped: false, hacker: false, score: 123 };
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => result });
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      dinoRanking.submitDinoScore({ nickname: " Hiago  🦖 ", score: 123 })
    ).resolves.toEqual(result);
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://x.supabase.co/rest/v1/rpc/submit_dino_score");
    expect(JSON.parse(options.body)).toEqual({ p_nickname: " Hiago  🦖 ", p_score: 123 });
  });

  it("submits with a secret key only in the apikey header", async () => {
    process.env.SUPABASE_URL = "https://x.supabase.co";
    process.env.SUPABASE_SECRET_KEY = "sb_secret_server_only";
    process.env.SUPABASE_PUBLISHABLE_KEY = "sb_publishable_public";
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ inserted: true, hacker: false }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await dinoRanking.submitDinoScoreWithSecret({ nickname: "red", score: 321 });

    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toBe("https://x.supabase.co/rest/v1/rpc/submit_dino_score");
    expect(options.headers.apikey).toBe("sb_secret_server_only");
    expect(options.headers.Authorization).toBeUndefined();
  });
});

describe("GET /api/dino/scores", () => {
  it("returns disabled when ranking is not configured", async () => {
    delete process.env.SUPABASE_URL;
    const res = await GET();
    const data = await res.json();
    expect(data.disabled).toBe(true);
    expect(data.recent).toEqual([]);
    expect(data.topWithPirates).toEqual([]);
    expect(data.topLegitimate).toEqual([]);
  });

  it("returns the three scoreboard views when configured", async () => {
    process.env.SUPABASE_URL = "https://x.supabase.co";
    process.env.SUPABASE_PUBLISHABLE_KEY = "key-1";
    const scoreboard = {
      recent: [{ nickname: "red", score: 100 }],
      topWithPirates: [{ nickname: "pirate", score: 50000, flagged: true }],
      topLegitimate: [{ nickname: "red", score: 100 }],
    };
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => scoreboard }));

    const res = await GET();
    const data = await res.json();
    expect(data.ok).toBe(true);
    expect(data.disabled).toBeFalsy();
    expect(data).toMatchObject(scoreboard);
  });
});

describe("POST /api/dino/score", () => {
  it("returns 503 when ranking is not configured", async () => {
    delete process.env.SUPABASE_URL;
    const res = await POST(
      new Request("http://localhost/api/dino/score", {
        method: "POST",
        body: JSON.stringify({ nickname: "red", score: 10 }),
      })
    );
    expect(res.status).toBe(503);
  });

  it("rejects invalid payloads", async () => {
    process.env.SUPABASE_URL = "https://x.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";

    const badPayloads = [
      { nickname: "   ", score: 10 },
      { nickname: "red", score: 0 },
      { nickname: "red", score: DINO_MAX_SCORE + 1 },
      { nickname: "red", score: "x" },
      { nickname: "x".repeat(DINO_MAX_NICKNAME + 1), score: 10 },
      {},
    ];

    for (const body of badPayloads) {
      const res = await POST(
        new Request("http://localhost/api/dino/score", {
          method: "POST",
          body: JSON.stringify(body),
        })
      );
      expect(res.status).toBe(400);
    }
  });

  it("submits a valid score atomically and rate-limits the same client", async () => {
    process.env.SUPABASE_URL = "https://x.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ inserted: true, skipped: false, hacker: false }),
    }));

    const request = (ip) =>
      new Request("http://localhost/api/dino/score", {
        method: "POST",
        headers: { "x-forwarded-for": ip, "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: "red", score: 100 }),
      });

    expect((await POST(request("1.2.3.4"))).status).toBe(200);
    expect((await POST(request("1.2.3.4"))).status).toBe(429);
    expect((await POST(request("5.6.7.8"))).status).toBe(200);
  });

  it("returns the database pirate classification", async () => {
    process.env.SUPABASE_URL = "https://x.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";
    const fetchMock = vi.fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ inserted: true, hacker: false }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ inserted: true, hacker: true }) });
    vi.stubGlobal("fetch", fetchMock);

    const low = await POST(
      new Request("http://localhost/api/dino/score", {
        method: "POST",
        headers: { "x-forwarded-for": "9.9.9.9", "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: "red", score: 100 }),
      })
    );
    expect((await low.json()).hacker).toBeFalsy();

    const high = await POST(
      new Request("http://localhost/api/dino/score", {
        method: "POST",
        headers: { "x-forwarded-for": "8.8.8.8", "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: "red", score: DINO_HACKER_THRESHOLD }),
      })
    );
    expect(high.status).toBe(200);
    expect((await high.json()).hacker).toBe(true);
  });

  it("preserves the literal nickname in the RPC payload", async () => {
    process.env.SUPABASE_URL = "https://x.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "service-key";
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ inserted: true, skipped: false, hacker: false }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await POST(
      new Request("http://localhost/api/dino/score", {
        method: "POST", headers: { "x-forwarded-for": "7.7.7.7", "Content-Type": "application/json" },
        body: JSON.stringify({ nickname: " Hiago  🦖 ", score: 321 }),
      })
    );

    const [url, options] = fetchMock.mock.calls[0];
    const body = JSON.parse(options.body);
    expect(url).toContain("/rpc/submit_dino_score");
    expect(body).toEqual({ p_nickname: " Hiago  🦖 ", p_score: 321 });
  });
});
