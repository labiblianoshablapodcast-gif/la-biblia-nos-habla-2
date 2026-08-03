-- LA BIBLIA NOS HABLA
-- VERSION 8.3A - EDITOR PROFESIONAL DE PREDICACIONES
-- Ejecute este archivo completo UNA SOLA VEZ en Supabase SQL Editor.

alter table public.sermons add column if not exists subtitle text;
alter table public.sermons add column if not exists tags text[] default '{}';
alter table public.sermons add column if not exists scheduled_at timestamptz;
alter table public.sermons add column if not exists updated_at timestamptz default now();

create index if not exists sermons_scheduled_at_idx on public.sermons(scheduled_at);
create index if not exists sermons_tags_idx on public.sermons using gin(tags);

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists sermons_touch_updated_at on public.sermons;
create trigger sermons_touch_updated_at
before update on public.sermons
for each row execute procedure public.touch_updated_at();
