-- ACHYUT // CONTROL ROOM — telemetry + signal board schema.
-- Run once in the Supabase SQL editor. All tables are service-role only:
-- RLS is enabled with NO policies, so the anon key can never touch them.

create table if not exists cr_counters (
  key text primary key,
  value bigint not null default 0
);

create table if not exists cr_daily (
  day text primary key, -- IST day key, e.g. 2026-07-18
  count bigint not null default 0
);

create table if not exists cr_sections (
  section text primary key,
  reached bigint not null default 0
);

create table if not exists cr_signals (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  message text not null,
  ip_hash text,
  created_at timestamptz not null default now()
);

alter table cr_counters enable row level security;
alter table cr_daily enable row level security;
alter table cr_sections enable row level security;
alter table cr_signals enable row level security;

-- Atomic visit recording: bumps totals for new sessions, always returns the
-- day's running number for "you are visitor #N today".
create or replace function cr_record_visit(p_day text, p_new_session boolean)
returns table (visitor_number bigint, today_count bigint, total_count bigint)
language plpgsql
security definer
as $$
declare
  v_today bigint;
  v_total bigint;
begin
  if p_new_session then
    insert into cr_daily (day, count) values (p_day, 1)
      on conflict (day) do update set count = cr_daily.count + 1
      returning count into v_today;
    insert into cr_counters (key, value) values ('total_visitors', 1)
      on conflict (key) do update set value = cr_counters.value + 1
      returning value into v_total;
  else
    select count into v_today from cr_daily where day = p_day;
    select value into v_total from cr_counters where key = 'total_visitors';
    v_today := coalesce(v_today, 0);
    v_total := coalesce(v_total, 0);
  end if;
  return query select v_today, v_today, v_total;
end;
$$;

create or replace function cr_bump_section(p_section text)
returns void
language sql
security definer
as $$
  insert into cr_sections (section, reached) values (p_section, 1)
    on conflict (section) do update set reached = cr_sections.reached + 1;
$$;
