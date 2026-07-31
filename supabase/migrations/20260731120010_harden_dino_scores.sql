-- Hardening: leaderboard writes only via the server (service role).
-- Run this AFTER SUPABASE_SERVICE_ROLE_KEY is configured in the app env.

-- Anon can no longer insert (prevents direct score forgery via the
-- publishable key). Reads stay public (the leaderboard is public).
drop policy if exists "dino_scores anon insert" on public.dino_scores;

-- Defense in depth: strip the default all-DML grants and re-grant read only.
revoke all on public.dino_scores from anon, authenticated;
grant select on public.dino_scores to anon, authenticated;
