-- Estudio Kids: ejecutar una vez en SQL Editor del proyecto Supabase del sitio.
-- No modifica perfiles, roles ni tablas existentes del ministerio.
-- Puede ejecutarse otra vez sin borrar resultados.
begin;
create table if not exists public.kids_progress (
 parent_id uuid not null references auth.users(id) on delete cascade,
 learner_slot smallint not null check (learner_slot between 1 and 3),
 age_group text not null check (age_group in ('4-6','7-10')),
 lesson_id text not null check (lesson_id = 'david-y-goliat'),
 score smallint not null check (score between 0 and 3),
 total smallint not null default 3 check (total = 3),
 consent_version text not null check (consent_version = 'kids-v1'),
 completed_at timestamptz not null default now(),
 primary key (parent_id,learner_slot,age_group,lesson_id)
);
alter table public.kids_progress enable row level security;
alter table public.kids_progress force row level security;
revoke all on public.kids_progress from public,anon,authenticated;
grant select,insert,update,delete on public.kids_progress to authenticated;
drop policy if exists "kids_read_own" on public.kids_progress;
create policy "kids_read_own" on public.kids_progress for select to authenticated using ((select auth.uid()) = parent_id);
drop policy if exists "kids_insert_own" on public.kids_progress;
create policy "kids_insert_own" on public.kids_progress for insert to authenticated with check ((select auth.uid()) = parent_id);
drop policy if exists "kids_update_own" on public.kids_progress;
create policy "kids_update_own" on public.kids_progress for update to authenticated using ((select auth.uid()) = parent_id) with check ((select auth.uid()) = parent_id);
drop policy if exists "kids_delete_own" on public.kids_progress;
create policy "kids_delete_own" on public.kids_progress for delete to authenticated using ((select auth.uid()) = parent_id);
-- Señal pública sin datos personales: se instala al final de la misma transacción.
create or replace function public.kids_progress_ready() returns boolean
language sql stable security invoker set search_path = '' as $$ select true; $$;
revoke all on function public.kids_progress_ready() from public;
grant execute on function public.kids_progress_ready() to anon,authenticated;
commit;

-- Verificación de configuración: rls_activo=true, rls_forzado=true,
-- anon_puede_leer=false, anon_puede_escribir=false, politicas=4.
select c.relrowsecurity as rls_activo,c.relforcerowsecurity as rls_forzado,
 has_table_privilege('anon','public.kids_progress','SELECT') as anon_puede_leer,
 has_table_privilege('anon','public.kids_progress','INSERT') as anon_puede_escribir,
 (select count(*) from pg_policies where schemaname='public' and tablename='kids_progress') as politicas
from pg_class c where c.oid='public.kids_progress'::regclass;
