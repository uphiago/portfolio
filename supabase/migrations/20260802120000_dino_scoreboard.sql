-- Dino scoreboard: exact nickname identity, atomic personal bests, and an
-- intentional anonymous-insert honeypot.

begin;

alter table public.dino_scores
  add column if not exists note text,
  add column if not exists flagged boolean not null default false,
  add column if not exists submission_source text not null default 'server';

alter table public.dino_scores
  drop constraint if exists dino_scores_flag_check,
  drop constraint if exists dino_scores_source_check,
  drop constraint if exists dino_scores_visible_nickname_check;

-- Existing rows have no trustworthy origin metadata. Preserve them and
-- classify only by the corrected 50k threshold.
update public.dino_scores
set submission_source = 'server',
    flagged = (score >= 50000);

alter table public.dino_scores
  add constraint dino_scores_source_check
    check (submission_source in ('server', 'anonymous')),
  add constraint dino_scores_visible_nickname_check
    check (
      char_length(nickname) between 1 and 24
      and nickname ~ '[^[:space:]]'
    ),
  add constraint dino_scores_flag_check
    check (flagged = (score >= 50000 or submission_source = 'anonymous'));

create index if not exists dino_scores_exact_recent_idx
  on public.dino_scores ((nickname collate "C"), created_at desc, id desc);

create index if not exists dino_scores_exact_top_idx
  on public.dino_scores ((nickname collate "C"), score desc, created_at asc, id asc);

create or replace function public.classify_dino_score()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  request_role text := coalesce(auth.role(), '');
begin
  if new.nickname is null
     or char_length(new.nickname) = 0
     or new.nickname !~ '[^[:space:]]' then
    raise exception 'nickname_blank' using errcode = '22023';
  end if;

  if char_length(new.nickname) > 24 then
    raise exception 'nickname_too_long' using errcode = '22023';
  end if;

  if new.score is null or new.score < 1 or new.score > 99999 then
    raise exception 'invalid_score' using errcode = '22023';
  end if;

  if request_role in ('anon', 'authenticated') then
    new.submission_source := 'anonymous';
  else
    new.submission_source := 'server';
  end if;

  new.flagged := new.score >= 50000
    or new.submission_source = 'anonymous';

  return new;
end;
$$;

drop trigger if exists dino_scores_classify_insert on public.dino_scores;
create trigger dino_scores_classify_insert
before insert on public.dino_scores
for each row execute function public.classify_dino_score();

-- The honeypot exposes only the two user-controlled fields. Origin and flag
-- are always overwritten by the trigger.
drop policy if exists "dino_scores anon insert" on public.dino_scores;
create policy "dino_scores anon honeypot insert"
  on public.dino_scores
  for insert
  to anon, authenticated
  with check (submission_source = 'anonymous' and flagged = true);

revoke all on public.dino_scores from anon, authenticated;
grant select on public.dino_scores to anon, authenticated;
grant insert (nickname, score) on public.dino_scores to anon, authenticated;

create or replace function public.submit_dino_score(
  p_nickname text,
  p_score integer
)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  personal_best integer;
  inserted_row public.dino_scores%rowtype;
begin
  if p_nickname is null
     or char_length(p_nickname) = 0
     or p_nickname !~ '[^[:space:]]' then
    raise exception 'nickname_blank' using errcode = '22023';
  end if;

  if char_length(p_nickname) > 24 then
    raise exception 'nickname_too_long' using errcode = '22023';
  end if;

  if p_score is null or p_score < 1 or p_score > 99999 then
    raise exception 'invalid_score' using errcode = '22023';
  end if;

  -- Application-submitted 50k+ scores are preserved as pirate events and do
  -- not participate in the legitimate personal-best sequence.
  if p_score >= 50000 then
    insert into public.dino_scores (nickname, score)
    values (p_nickname, p_score)
    returning * into inserted_row;

    return jsonb_build_object(
      'inserted', true,
      'skipped', false,
      'hacker', true,
      'score', inserted_row.score
    );
  end if;

  -- Serialize exact-nickname submissions so concurrent requests cannot insert
  -- a lower score after a higher score.
  perform pg_advisory_xact_lock(hashtextextended(p_nickname, 0));

  select max(score)
  into personal_best
  from public.dino_scores
  where nickname collate "C" = p_nickname collate "C"
    and submission_source = 'server'
    and flagged = false;

  if personal_best is not null and p_score <= personal_best then
    return jsonb_build_object(
      'inserted', false,
      'skipped', true,
      'hacker', false,
      'score', personal_best
    );
  end if;

  insert into public.dino_scores (nickname, score)
  values (p_nickname, p_score)
  returning * into inserted_row;

  return jsonb_build_object(
    'inserted', true,
    'skipped', false,
    'hacker', false,
    'score', inserted_row.score
  );
end;
$$;

revoke all on function public.submit_dino_score(text, integer)
  from public, anon, authenticated;
grant execute on function public.submit_dino_score(text, integer)
  to service_role;

create or replace function public.get_dino_scoreboard(p_limit integer default 10)
returns jsonb
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  with recursive
  settings as (
    select least(greatest(coalesce(p_limit, 10), 1), 50) as row_limit
  ),
  ordered as (
    select
      score_row.*,
      max(
        case
          when score_row.submission_source = 'server'
               and score_row.flagged = false
            then score_row.score
        end
      ) over (
        partition by score_row.nickname collate "C"
        order by score_row.created_at, score_row.id
        rows between unbounded preceding and 1 preceding
      ) as preceding_legitimate_best
    from public.dino_scores score_row
  ),
  eligible as (
    select *
    from ordered
    where flagged = true
       or (
         submission_source = 'server'
         and flagged = false
         and (
           preceding_legitimate_best is null
           or score > preceding_legitimate_best
         )
       )
  ),
  recent_ranked as (
    select
      eligible.*,
      row_number() over (
        partition by nickname collate "C"
        order by created_at desc, id desc
      ) as exact_nickname_rank
    from eligible
  ),
  recent_rows as (
    select *
    from recent_ranked
    where exact_nickname_rank = 1
    order by created_at desc, id desc
    limit (select row_limit from settings)
  ),
  top_pirate_ranked as (
    select
      eligible.*,
      row_number() over (
        partition by nickname collate "C"
        order by score desc, created_at asc, id asc
      ) as exact_nickname_rank
    from eligible
  ),
  top_pirate_rows as (
    select *
    from top_pirate_ranked
    where exact_nickname_rank = 1
    order by score desc, created_at asc, id asc
    limit (select row_limit from settings)
  ),
  top_legitimate_ranked as (
    select
      eligible.*,
      row_number() over (
        partition by nickname collate "C"
        order by score desc, created_at asc, id asc
      ) as exact_nickname_rank
    from eligible
    where flagged = false and submission_source = 'server'
  ),
  top_legitimate_rows as (
    select *
    from top_legitimate_ranked
    where exact_nickname_rank = 1
    order by score desc, created_at asc, id asc
    limit (select row_limit from settings)
  )
  select jsonb_build_object(
    'recent', coalesce((
      select jsonb_agg(jsonb_build_object(
        'nickname', nickname,
        'score', score,
        'created_at', created_at,
        'flagged', flagged,
        'submission_source', submission_source
      ) order by created_at desc, id desc)
      from recent_rows
    ), '[]'::jsonb),
    'topWithPirates', coalesce((
      select jsonb_agg(jsonb_build_object(
        'nickname', nickname,
        'score', score,
        'created_at', created_at,
        'flagged', flagged,
        'submission_source', submission_source
      ) order by score desc, created_at asc, id asc)
      from top_pirate_rows
    ), '[]'::jsonb),
    'topLegitimate', coalesce((
      select jsonb_agg(jsonb_build_object(
        'nickname', nickname,
        'score', score,
        'created_at', created_at,
        'flagged', flagged,
        'submission_source', submission_source
      ) order by score desc, created_at asc, id asc)
      from top_legitimate_rows
    ), '[]'::jsonb)
  );
$$;

revoke all on function public.get_dino_scoreboard(integer) from public;
grant execute on function public.get_dino_scoreboard(integer)
  to anon, authenticated, service_role;

notify pgrst, 'reload schema';

commit;
