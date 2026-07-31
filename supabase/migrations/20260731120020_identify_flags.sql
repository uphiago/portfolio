alter table public.dino_scores
  add column if not exists note text,
  add column if not exists flagged boolean not null default false;

create index if not exists dino_scores_flagged_idx
  on public.dino_scores (flagged, created_at desc);

-- Scores >= 50k can never enter unflagged.
update public.dino_scores
  set flagged = (score >= 49999);

alter table public.dino_scores
  add constraint dino_scores_flag_check
  check (flagged = (score >= 49999));
