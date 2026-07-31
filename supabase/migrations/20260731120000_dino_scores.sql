-- Dino game top 10 ranking.
-- Public read + anon insert (validated server-side + constrained by CHECK).
create table if not exists public.dino_scores (
  id uuid primary key default gen_random_uuid(),
  nickname text not null check (char_length(nickname) between 1 and 24),
  score integer not null check (score between 1 and 99999),
  created_at timestamptz not null default now()
);

create index if not exists dino_scores_score_idx
  on public.dino_scores (score desc, created_at asc);

alter table public.dino_scores enable row level security;

create policy "dino_scores public read"
  on public.dino_scores
  for select
  to anon, authenticated
  using (true);

create policy "dino_scores anon insert"
  on public.dino_scores
  for insert
  to anon
  with check (
    char_length(nickname) between 1 and 24
    and score between 1 and 99999
  );
