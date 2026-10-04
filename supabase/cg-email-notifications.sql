-- ══════════════════════════════════════════════════════════════════════
--  Common Ground · email notifications
--  Run once in the Supabase SQL editor. Safe to re-run.
--
--  How it works
--    1. A reply lands in `replies`. A trigger queues one outbox row for the
--       thread author and for everyone else who has replied in that thread.
--    2. pg_net posts {batch, token} to https://mycelium-learn.com/api/cg-notify.
--    3. That route trades the token for the email payload through
--       cg_claim_emails() and sends it over Gmail.
--  Member email addresses live in auth.users and never reach a browser. The
--  token is single use, so the route can only send what the database queued.
-- ══════════════════════════════════════════════════════════════════════

create extension if not exists pg_net;

-- ── per-member email settings (the token is the "manage emails" link) ──
create table if not exists public.cg_email_prefs (
  user_id       uuid primary key references auth.users(id) on delete cascade,
  token         text not null unique default replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''),
  replies       boolean not null default true,
  announcements boolean not null default true,
  updated_at    timestamptz not null default now()
);
alter table public.cg_email_prefs enable row level security;
drop policy if exists cg_email_prefs_own on public.cg_email_prefs;
create policy cg_email_prefs_own on public.cg_email_prefs
  for select to authenticated using (user_id = auth.uid());

-- ── outbox: one row per email. No policies, so only the functions below touch it ──
create table if not exists public.cg_email_outbox (
  id           uuid primary key default gen_random_uuid(),
  batch        uuid not null default gen_random_uuid(),
  token        text not null default replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', ''),
  kind         text not null check (kind in ('reply', 'announcement')),
  recipient_id uuid not null references auth.users(id) on delete cascade,
  question_id  uuid,
  reply_id     uuid,
  payload      jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now(),
  claimed_at   timestamptz,
  sent_at      timestamptz,
  error        text
);
-- a member is emailed once per reply, and once per announcement
create unique index if not exists cg_email_outbox_dedupe on public.cg_email_outbox
  (kind, recipient_id, question_id, coalesce(reply_id, '00000000-0000-0000-0000-000000000000'::uuid));
create index if not exists cg_email_outbox_batch on public.cg_email_outbox (batch);
alter table public.cg_email_outbox enable row level security;

-- ── hand a batch to the sender route ──
create or replace function public.cg_fire_email(p_batch uuid, p_token text)
returns void language plpgsql security definer set search_path = public, pg_temp as $$
begin
  perform net.http_post(
    url := 'https://mycelium-learn.com/api/cg-notify',
    body := jsonb_build_object('batch', p_batch, 'token', p_token),
    headers := jsonb_build_object('Content-Type', 'application/json'),
    timeout_milliseconds := 280000
  );
exception when others then
  null; -- a mail hiccup must never break posting
end $$;

-- ── queue reply emails ──
create or replace function public.cg_queue_reply_emails()
returns trigger language plpgsql security definer set search_path = public, pg_temp as $$
declare
  r record;
  v_batch uuid;
  v_token text;
begin
  for r in
    select distinct u.id as uid
    from (
      select q.proposed_by as uid from public.questions q where q.id = new.question_id
      union
      select rp.user_id from public.replies rp where rp.question_id = new.question_id and rp.id <> new.id
    ) p
    join auth.users u on u.id = p.uid
    where p.uid is not null and p.uid <> new.user_id and u.email is not null
  loop
    insert into public.cg_email_prefs (user_id) values (r.uid) on conflict do nothing;
    continue when not exists (select 1 from public.cg_email_prefs where user_id = r.uid and replies);
    -- a busy thread sends one email per member every 10 minutes, not one per reply
    continue when exists (
      select 1 from public.cg_email_outbox o
      where o.kind = 'reply' and o.recipient_id = r.uid and o.question_id = new.question_id
        and o.created_at > now() - interval '10 minutes');
    v_batch := null;
    insert into public.cg_email_outbox (kind, recipient_id, question_id, reply_id)
      values ('reply', r.uid, new.question_id, new.id)
      on conflict do nothing
      returning batch, token into v_batch, v_token;
    if v_batch is not null then perform public.cg_fire_email(v_batch, v_token); end if;
  end loop;
  return new;
exception when others then
  return new; -- never block a reply because of email
end $$;

drop trigger if exists cg_reply_email on public.replies;
create trigger cg_reply_email after insert on public.replies
  for each row execute function public.cg_queue_reply_emails();

-- ── the sender route trades {batch, token} for what to send. Single use. ──
create or replace function public.cg_claim_emails(p_batch uuid, p_token text)
returns jsonb language plpgsql security definer set search_path = public, pg_temp as $$
declare
  o record;
  v_out jsonb := '[]'::jsonb;
  v_email text;
  v_name text;
  v_unsub text;
  v_q jsonb;
  v_replies jsonb;
begin
  for o in
    update public.cg_email_outbox set claimed_at = now()
    where batch = p_batch and token = p_token and claimed_at is null
    returning *
  loop
    select u.email, p.username into v_email, v_name
      from auth.users u left join public.profiles p on p.id = u.id
      where u.id = o.recipient_id;
    continue when v_email is null;
    select token into v_unsub from public.cg_email_prefs where user_id = o.recipient_id;
    v_q := null; v_replies := '[]'::jsonb;
    if o.kind = 'reply' then
      select jsonb_build_object(
          'id', q.id, 'body', q.body, 'at', q.created_at, 'kind', q.kind, 'status', q.status,
          'name', p.username, 'color', p.avatar_color,
          'has_media', (q.media is not null or q.media_url is not null))
        into v_q
        from public.questions q left join public.profiles p on p.id = q.proposed_by
        where q.id = o.question_id;
      select coalesce(jsonb_agg(jsonb_build_object(
          'id', r.id, 'body', r.body, 'at', r.created_at,
          'name', coalesce(p.username, 'A member'), 'color', p.avatar_color,
          'has_media', (r.media is not null or r.media_url is not null)) order by r.created_at), '[]'::jsonb)
        into v_replies
        from public.replies r left join public.profiles p on p.id = r.user_id
        where r.question_id = o.question_id;
    end if;
    v_out := v_out || jsonb_build_array(jsonb_build_object(
      'id', o.id, 'kind', o.kind, 'to', v_email, 'name', v_name, 'unsub', v_unsub,
      'question_id', o.question_id, 'reply_id', o.reply_id,
      'question', v_q, 'replies', v_replies, 'payload', o.payload));
  end loop;
  return v_out;
end $$;

create or replace function public.cg_mark_email(p_id uuid, p_token text, p_ok boolean, p_error text default null)
returns void language sql security definer set search_path = public, pg_temp as $$
  update public.cg_email_outbox
     set sent_at = case when p_ok then now() else null end,
         error   = case when p_ok then null else left(coalesce(p_error, 'failed'), 500) end
   where id = p_id and token = p_token and claimed_at is not null and sent_at is null;
$$;

-- ── "manage emails" page, keyed by the token in each email footer ──
create or replace function public.cg_email_prefs_get(p_token text)
returns jsonb language sql security definer set search_path = public, pg_temp as $$
  select jsonb_build_object('replies', e.replies, 'announcements', e.announcements, 'name', p.username)
    from public.cg_email_prefs e left join public.profiles p on p.id = e.user_id
   where e.token = p_token;
$$;

create or replace function public.cg_email_prefs_set(p_token text, p_replies boolean, p_announcements boolean)
returns boolean language plpgsql security definer set search_path = public, pg_temp as $$
begin
  update public.cg_email_prefs
     set replies = p_replies, announcements = p_announcements, updated_at = now()
   where token = p_token;
  return found;
end $$;

-- ── announcements: admin only, each member gets a given announcement once ──
create or replace function public.cg_announce(
  p_qid uuid, p_title text, p_summary text default null, p_link text default null,
  p_image text default null, p_cta text default null, p_flair text default null)
returns integer language plpgsql security definer set search_path = public, pg_temp as $$
declare
  v_ok boolean := false;
  v_batch uuid := gen_random_uuid();
  v_token text := replace(gen_random_uuid()::text || gen_random_uuid()::text, '-', '');
  v_n integer := 0;
begin
  if session_user = 'postgres' then
    v_ok := true; -- run from the SQL editor
  else
    select coalesce(p.is_admin, false) or lower(u.email) = lower('joaquinriego32@gmail.com')
      into v_ok
      from auth.users u left join public.profiles p on p.id = u.id
     where u.id = auth.uid();
  end if;
  if not coalesce(v_ok, false) then raise exception 'Only an admin can send announcements.'; end if;
  if coalesce(trim(p_title), '') = '' then raise exception 'An announcement needs a title.'; end if;

  insert into public.cg_email_prefs (user_id)
    select u.id from auth.users u join public.profiles p on p.id = u.id where u.email is not null
    on conflict do nothing;

  insert into public.cg_email_outbox (batch, token, kind, recipient_id, question_id, payload)
    select v_batch, v_token, 'announcement', u.id, p_qid,
           jsonb_build_object('title', p_title, 'summary', p_summary, 'link', p_link,
                              'image', p_image, 'cta', p_cta, 'flair', p_flair)
      from auth.users u
      join public.profiles p on p.id = u.id
      join public.cg_email_prefs e on e.user_id = u.id
     where u.email is not null and e.announcements
    on conflict do nothing;
  get diagnostics v_n = row_count;
  if v_n > 0 then perform public.cg_fire_email(v_batch, v_token); end if;
  return v_n;
end $$;

-- ── SQL-editor helper: resend anything from the last two days that never went out ──
create or replace function public.cg_retry_emails()
returns integer language plpgsql security definer set search_path = public, pg_temp as $$
declare b record; v_n integer := 0;
begin
  for b in
    select distinct batch, token from public.cg_email_outbox
     where sent_at is null and created_at > now() - interval '2 days'
  loop
    update public.cg_email_outbox set claimed_at = null, error = null
     where batch = b.batch and sent_at is null;
    perform public.cg_fire_email(b.batch, b.token);
    v_n := v_n + 1;
  end loop;
  return v_n;
end $$;

-- ── who may call what ──
revoke all on function public.cg_fire_email(uuid, text) from public, anon, authenticated;
revoke all on function public.cg_queue_reply_emails() from public, anon, authenticated;
revoke all on function public.cg_retry_emails() from public, anon, authenticated;
revoke all on function public.cg_claim_emails(uuid, text) from public;
revoke all on function public.cg_mark_email(uuid, text, boolean, text) from public;
revoke all on function public.cg_email_prefs_get(text) from public;
revoke all on function public.cg_email_prefs_set(text, boolean, boolean) from public;
revoke all on function public.cg_announce(uuid, text, text, text, text, text, text) from public, anon;
grant execute on function public.cg_claim_emails(uuid, text) to anon, authenticated;
grant execute on function public.cg_mark_email(uuid, text, boolean, text) to anon, authenticated;
grant execute on function public.cg_email_prefs_get(text) to anon, authenticated;
grant execute on function public.cg_email_prefs_set(text, boolean, boolean) to anon, authenticated;
grant execute on function public.cg_announce(uuid, text, text, text, text, text, text) to authenticated;
