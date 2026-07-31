-- Audit trail for flagged (hacked) score submissions.
-- ip_hash is a sha256 of the caller IP + server pepper (not raw IP, LGPD).
alter table public.dino_scores
  add column if not exists ip_hash text,
  add column if not exists user_agent text,
  add column if not exists flagged boolean not null default false;

create index if not exists dino_scores_flagged_idx
  on public.dino_scores (flagged, created_at desc);

-- No 50k+ score can enter unflagged: either via the API (server sets it) or
-- via direct PostgREST (the row is rejected unless flagged is true).
update public.dino_scores
  set flagged = (score >= 50000);

alter table public.dino_scores
  add constraint dino_scores_flag_check
  check (flagged = (score >= 50000));
