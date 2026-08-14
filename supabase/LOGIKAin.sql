-- LOGIKAin complete database setup
-- Run this single file in Supabase SQL Editor for a fresh project.
-- Do not run this file on a database that already has these migrations applied.

begin;

create extension if not exists pgcrypto;

-- ============================================================================
-- 001_contact_leads.sql
-- ============================================================================

create table if not exists public.contact_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table public.contact_leads enable row level security;

-- Public visitors may submit a lead through a controlled server action.
-- Reads and updates remain private to authenticated operators.
drop policy if exists "authenticated operators can read leads" on public.contact_leads;
create policy "authenticated operators can read leads"
  on public.contact_leads for select
  to authenticated
  using (true);

drop policy if exists "visitors can submit leads" on public.contact_leads;
create policy "visitors can submit leads"
  on public.contact_leads for insert
  to anon, authenticated
  with check (true);

drop policy if exists "authenticated operators can update leads" on public.contact_leads;
create policy "authenticated operators can update leads"
  on public.contact_leads for update
  to authenticated
  using (true)
  with check (true);

-- ============================================================================
-- 002_master_platform_core.sql
-- ============================================================================

-- LOGIKAin Master Platform core bounded contexts.
-- Every schema change belongs in a migration; keep provider-specific secrets out of SQL.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  full_name text,
  avatar_url text,
  role text not null default 'client' check (role in ('client','editor','sales','project_member','finance','support','admin','owner')),
  status text not null default 'active' check (status in ('active','invited','suspended')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
alter table public.profiles add column if not exists username text;
create unique index if not exists profiles_username_unique_idx on public.profiles (lower(username)) where username is not null;

create or replace function public.is_staff()
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.profiles p where p.id = auth.uid() and p.status = 'active'); $$;

create or replace function public.has_role(required_roles text[])
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.profiles p where p.id = auth.uid() and p.status = 'active' and p.role = any(required_roles)); $$;

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(), storage_path text not null unique, filename text not null,
  mime_type text, size_bytes bigint, width integer, height integer, alt_text text, is_decorative boolean not null default false,
  created_by uuid references auth.users(id), created_at timestamptz not null default now()
);

create table if not exists public.content_services (
  id uuid primary key default gen_random_uuid(), slug text not null unique, name text not null, summary text not null default '', body text not null default '',
  status text not null default 'draft' check (status in ('draft','review','published','archived')), featured boolean not null default false,
  seo_title text, seo_description text, og_image_id uuid references public.media_assets(id), published_at timestamptz, created_by uuid references auth.users(id), updated_at timestamptz not null default now()
);

create table if not exists public.content_industries (
  id uuid primary key default gen_random_uuid(), slug text not null unique, name text not null, summary text not null default '', body text not null default '',
  status text not null default 'draft' check (status in ('draft','review','published','archived')), seo_title text, seo_description text,
  created_by uuid references auth.users(id), updated_at timestamptz not null default now()
);

create table if not exists public.content_projects (
  id uuid primary key default gen_random_uuid(), slug text not null unique, title text not null, short_description text not null default '',
  overview text not null default '', problem text not null default '', analysis text not null default '', solution text not null default '', implementation text not null default '', results text not null default '',
  client_display_name text, project_year integer, status text not null default 'draft' check (status in ('draft','review','published','archived')),
  featured boolean not null default false, seo_title text, seo_description text, og_image_id uuid references public.media_assets(id), published_at timestamptz,
  created_by uuid references auth.users(id), updated_at timestamptz not null default now()
);

create table if not exists public.content_insights (
  id uuid primary key default gen_random_uuid(), slug text not null unique, title text not null, excerpt text not null default '', content text not null default '',
  author_id uuid references auth.users(id), status text not null default 'draft' check (status in ('draft','review','published','archived')),
  seo_title text, seo_description text, og_image_id uuid references public.media_assets(id), published_at timestamptz, updated_at timestamptz not null default now()
);

create table if not exists public.redirects (
  id uuid primary key default gen_random_uuid(), source_path text not null unique, target_path text not null, status_code integer not null default 301 check (status_code in (301,302)), reason text, created_by uuid references auth.users(id), created_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(), name text not null, email text not null, phone text, company text, brief text not null default '', source text not null default 'website',
  status text not null default 'new' check (status in ('new','contacted','qualified','proposal','won','lost','archived')), assigned_to uuid references auth.users(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.clients (
  id uuid primary key default gen_random_uuid(), name text not null, legal_name text, email text, phone text, status text not null default 'active' check (status in ('prospect','active','inactive','archived')),
  originating_lead_id uuid references public.leads(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.client_contacts (
  id uuid primary key default gen_random_uuid(), client_id uuid not null references public.clients(id) on delete cascade, name text not null, email text not null, phone text, title text, is_primary boolean not null default false, created_at timestamptz not null default now()
);

create table if not exists public.client_memberships (
  id uuid primary key default gen_random_uuid(), client_id uuid not null references public.clients(id) on delete cascade, user_id uuid not null references auth.users(id) on delete cascade,
  portal_role text not null default 'member' check (portal_role in ('member','approver','billing')), status text not null default 'active', unique(client_id, user_id)
);

create table if not exists public.business_projects (
  id uuid primary key default gen_random_uuid(), client_id uuid references public.clients(id), originating_lead_id uuid references public.leads(id), name text not null, description text not null default '', status text not null default 'planning' check (status in ('planning','active','on_hold','completed','archived')),
  start_date date, target_date date, budget_minor bigint, currency text not null default 'IDR', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.project_milestones (
  id uuid primary key default gen_random_uuid(), project_id uuid not null references public.business_projects(id) on delete cascade, title text not null, description text not null default '', status text not null default 'planned', target_date date, client_visible boolean not null default true
);

create table if not exists public.project_tasks (
  id uuid primary key default gen_random_uuid(), project_id uuid not null references public.business_projects(id) on delete cascade, milestone_id uuid references public.project_milestones(id), assignee_id uuid references auth.users(id), title text not null, description text not null default '', status text not null default 'todo' check (status in ('todo','in_progress','blocked','done')), due_date date, client_visible boolean not null default false
);

create table if not exists public.quotes (
  id uuid primary key default gen_random_uuid(), quote_number text not null unique, lead_id uuid references public.leads(id), client_id uuid references public.clients(id), status text not null default 'draft' check (status in ('draft','sent','accepted','rejected','expired','cancelled')), currency text not null default 'IDR', total_minor bigint not null default 0, valid_until date, created_at timestamptz not null default now()
);

create table if not exists public.invoices (
  id uuid primary key default gen_random_uuid(), invoice_number text not null unique, client_id uuid not null references public.clients(id), project_id uuid references public.business_projects(id), status text not null default 'draft' check (status in ('draft','issued','partially_paid','paid','overdue','void')), currency text not null default 'IDR', total_minor bigint not null default 0, issued_at date, due_at date, created_at timestamptz not null default now()
);

create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(), invoice_id uuid not null references public.invoices(id) on delete cascade, amount_minor bigint not null, currency text not null default 'IDR', provider text, provider_reference text, status text not null default 'pending' check (status in ('pending','succeeded','failed','refunded')), paid_at timestamptz, metadata jsonb not null default '{}'::jsonb
);

create table if not exists public.support_tickets (
  id uuid primary key default gen_random_uuid(), reference text not null unique, client_id uuid not null references public.clients(id), project_id uuid references public.business_projects(id), subject text not null, description text not null default '', priority text not null default 'normal' check (priority in ('low','normal','high','urgent')), status text not null default 'open' check (status in ('open','in_progress','waiting','resolved','closed')), assigned_to uuid references auth.users(id), first_response_at timestamptz, resolved_at timestamptz, created_at timestamptz not null default now()
);

create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(), recipient_id uuid not null references auth.users(id) on delete cascade, type text not null, entity_type text, entity_id uuid, payload jsonb not null default '{}'::jsonb, read_at timestamptz, created_at timestamptz not null default now()
);

create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(), actor_id uuid references auth.users(id), action text not null, entity_type text not null, entity_id uuid, payload jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(), name text not null, slug text not null unique, status text not null default 'draft', metadata jsonb not null default '{}'::jsonb
);
create table if not exists public.tenants (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id), name text not null, slug text not null unique, status text not null default 'active', metadata jsonb not null default '{}'::jsonb
);
create table if not exists public.tenant_memberships (
  id uuid primary key default gen_random_uuid(), tenant_id uuid not null references public.tenants(id) on delete cascade, user_id uuid not null references auth.users(id) on delete cascade, role text not null default 'member', status text not null default 'active', unique(tenant_id, user_id)
);
create table if not exists public.plans (
  id uuid primary key default gen_random_uuid(), product_id uuid not null references public.products(id), code text not null, name text not null, price_metadata jsonb not null default '{}'::jsonb, limits jsonb not null default '{}'::jsonb, status text not null default 'active', unique(product_id, code)
);
create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(), tenant_id uuid not null references public.tenants(id) on delete cascade, plan_id uuid not null references public.plans(id), provider text, provider_subscription_id text, status text not null default 'trialing', period_start timestamptz, period_end timestamptz
);
create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(), tenant_id uuid not null references public.tenants(id) on delete cascade, feature_key text not null, quantity numeric not null default 1, occurred_at timestamptz not null default now(), metadata jsonb not null default '{}'::jsonb
);

-- Defense-in-depth: no protected table is exposed without RLS.
do $$ declare t text; begin foreach t in array array['profiles','media_assets','content_services','content_industries','content_projects','content_insights','redirects','leads','clients','client_contacts','client_memberships','business_projects','project_milestones','project_tasks','quotes','invoices','payments','support_tickets','notifications','audit_logs','products','tenants','tenant_memberships','plans','subscriptions','usage_events'] loop execute format('alter table public.%I enable row level security', t); end loop; end $$;

drop policy if exists "published services are public" on public.content_services;
create policy "published services are public" on public.content_services for select using (status = 'published');
drop policy if exists "published industries are public" on public.content_industries;
create policy "published industries are public" on public.content_industries for select using (status = 'published');
drop policy if exists "published projects are public" on public.content_projects;
create policy "published projects are public" on public.content_projects for select using (status = 'published');
drop policy if exists "published insights are public" on public.content_insights;
create policy "published insights are public" on public.content_insights for select using (status = 'published');
drop policy if exists "public can create leads" on public.leads;
create policy "public can create leads" on public.leads for insert to anon, authenticated with check (true);
drop policy if exists "staff can manage leads" on public.leads;
create policy "staff can manage leads" on public.leads for all to authenticated using (public.is_staff()) with check (public.is_staff());
drop policy if exists "staff can manage clients" on public.clients;
create policy "staff can manage clients" on public.clients for all to authenticated using (public.is_staff()) with check (public.is_staff());
drop policy if exists "staff can manage projects" on public.business_projects;
create policy "staff can manage projects" on public.business_projects for all to authenticated using (public.is_staff()) with check (public.is_staff());
drop policy if exists "members can read own notifications" on public.notifications;
create policy "members can read own notifications" on public.notifications for select to authenticated using (recipient_id = auth.uid());
drop policy if exists "members can read own membership" on public.client_memberships;
create policy "members can read own membership" on public.client_memberships for select to authenticated using (user_id = auth.uid());
drop policy if exists "members can read own projects" on public.business_projects;
create policy "members can read own projects" on public.business_projects for select to authenticated using (exists (select 1 from public.client_memberships m where m.client_id = business_projects.client_id and m.user_id = auth.uid() and m.status = 'active'));
drop policy if exists "members can read own milestones" on public.project_milestones;
create policy "members can read own milestones" on public.project_milestones for select to authenticated using (exists (select 1 from public.business_projects p join public.client_memberships m on m.client_id = p.client_id where p.id = project_milestones.project_id and m.user_id = auth.uid() and m.status = 'active'));
drop policy if exists "members can read own tasks" on public.project_tasks;
create policy "members can read own tasks" on public.project_tasks for select to authenticated using (exists (select 1 from public.business_projects p join public.client_memberships m on m.client_id = p.client_id where p.id = project_tasks.project_id and m.user_id = auth.uid() and m.status = 'active' and project_tasks.client_visible = true));
drop policy if exists "members can read own invoices" on public.invoices;
create policy "members can read own invoices" on public.invoices for select to authenticated using (exists (select 1 from public.client_memberships m where m.client_id = invoices.client_id and m.user_id = auth.uid() and m.status = 'active'));
drop policy if exists "members can read own tickets" on public.support_tickets;
create policy "members can read own tickets" on public.support_tickets for select to authenticated using (exists (select 1 from public.client_memberships m where m.client_id = support_tickets.client_id and m.user_id = auth.uid() and m.status = 'active'));
drop policy if exists "staff can read audit logs" on public.audit_logs;
create policy "staff can read audit logs" on public.audit_logs for select to authenticated using (public.has_role(array['admin','owner']));
drop policy if exists "staff can manage content" on public.content_services;
create policy "staff can manage content" on public.content_services for all to authenticated using (public.has_role(array['editor','admin','owner'])) with check (public.has_role(array['editor','admin','owner']));
drop policy if exists "staff can manage industries" on public.content_industries;
create policy "staff can manage industries" on public.content_industries for all to authenticated using (public.has_role(array['editor','admin','owner'])) with check (public.has_role(array['editor','admin','owner']));
drop policy if exists "staff can manage projects content" on public.content_projects;
create policy "staff can manage projects content" on public.content_projects for all to authenticated using (public.has_role(array['editor','admin','owner'])) with check (public.has_role(array['editor','admin','owner']));
drop policy if exists "staff can manage insights" on public.content_insights;
create policy "staff can manage insights" on public.content_insights for all to authenticated using (public.has_role(array['editor','admin','owner'])) with check (public.has_role(array['editor','admin','owner']));

-- ============================================================================
-- 003_operations_automation.sql
-- ============================================================================

create table if not exists public.content_revisions (
  id uuid primary key default gen_random_uuid(), content_type text not null, content_id uuid not null, version integer not null, snapshot jsonb not null default '{}'::jsonb, created_by uuid references auth.users(id), created_at timestamptz not null default now(), unique(content_type, content_id, version)
);

create table if not exists public.activity_logs (
  id uuid primary key default gen_random_uuid(), actor_id uuid references auth.users(id), entity_type text not null, entity_id uuid, action text not null, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);

create table if not exists public.project_files (
  id uuid primary key default gen_random_uuid(), project_id uuid not null references public.business_projects(id) on delete cascade, storage_path text not null, filename text not null, mime_type text, size_bytes bigint, client_visible boolean not null default false, uploaded_by uuid references auth.users(id), created_at timestamptz not null default now()
);

create table if not exists public.project_approvals (
  id uuid primary key default gen_random_uuid(), project_id uuid not null references public.business_projects(id) on delete cascade, milestone_id uuid references public.project_milestones(id), title text not null, request_note text not null default '', decision_note text, status text not null default 'pending' check (status in ('pending','approved','changes_requested','cancelled')), requested_at timestamptz not null default now(), decided_at timestamptz, decided_by uuid references auth.users(id)
);

create table if not exists public.project_comments (
  id uuid primary key default gen_random_uuid(), project_id uuid not null references public.business_projects(id) on delete cascade, author_user_id uuid references auth.users(id), body text not null, visibility text not null default 'internal' check (visibility in ('internal','client')), created_at timestamptz not null default now()
);

create table if not exists public.support_messages (
  id uuid primary key default gen_random_uuid(), ticket_id uuid not null references public.support_tickets(id) on delete cascade, author_user_id uuid references auth.users(id), body text not null, visibility text not null default 'client' check (visibility in ('internal','client')), created_at timestamptz not null default now()
);

create table if not exists public.automation_jobs (
  id uuid primary key default gen_random_uuid(), type text not null, status text not null default 'queued' check (status in ('queued','running','succeeded','failed','cancelled')), payload jsonb not null default '{}'::jsonb, run_at timestamptz not null default now(), attempts integer not null default 0, last_error text, idempotency_key text unique, created_at timestamptz not null default now(), finished_at timestamptz
);

create unique index if not exists automation_jobs_idempotency_key_idx on public.automation_jobs(idempotency_key) where idempotency_key is not null;

do $$ declare t text; begin foreach t in array array['content_revisions','activity_logs','project_files','project_approvals','project_comments','support_messages','automation_jobs'] loop execute format('alter table public.%I enable row level security', t); end loop; end $$;

drop policy if exists "staff can manage content revisions" on public.content_revisions;
create policy "staff can manage content revisions" on public.content_revisions for all to authenticated using (public.has_role(array['editor','admin','owner'])) with check (public.has_role(array['editor','admin','owner']));
drop policy if exists "staff can read activity logs" on public.activity_logs;
create policy "staff can read activity logs" on public.activity_logs for select to authenticated using (public.is_staff());
drop policy if exists "staff can manage project files" on public.project_files;
create policy "staff can manage project files" on public.project_files for all to authenticated using (public.is_staff()) with check (public.is_staff());
drop policy if exists "staff can manage project approvals" on public.project_approvals;
create policy "staff can manage project approvals" on public.project_approvals for all to authenticated using (public.is_staff()) with check (public.is_staff());
drop policy if exists "staff can manage project comments" on public.project_comments;
create policy "staff can manage project comments" on public.project_comments for all to authenticated using (public.is_staff()) with check (public.is_staff());
drop policy if exists "staff can manage support messages" on public.support_messages;
create policy "staff can manage support messages" on public.support_messages for all to authenticated using (public.is_staff()) with check (public.is_staff());
drop policy if exists "staff can manage automation jobs" on public.automation_jobs;
create policy "staff can manage automation jobs" on public.automation_jobs for all to authenticated using (public.has_role(array['admin','owner'])) with check (public.has_role(array['admin','owner']));

-- ============================================================================
-- 004_storage_policies.sql
-- ============================================================================

insert into storage.buckets (id, name, public)
values ('public-media', 'public-media', true), ('private-project-files', 'private-project-files', false)
on conflict (id) do nothing;

drop policy if exists "public marketing media can be read" on storage.objects;
create policy "public marketing media can be read"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'public-media');

drop policy if exists "staff can upload public media" on storage.objects;
create policy "staff can upload public media"
on storage.objects for insert
to authenticated
with check (bucket_id = 'public-media' and public.is_staff());

drop policy if exists "staff can update public media" on storage.objects;
create policy "staff can update public media"
on storage.objects for update
to authenticated
using (bucket_id = 'public-media' and public.is_staff())
with check (bucket_id = 'public-media' and public.is_staff());

drop policy if exists "staff can delete public media" on storage.objects;
create policy "staff can delete public media"
on storage.objects for delete
to authenticated
using (bucket_id = 'public-media' and public.is_staff());

drop policy if exists "staff can manage private project files" on storage.objects;
create policy "staff can manage private project files"
on storage.objects for all
to authenticated
using (bucket_id = 'private-project-files' and public.is_staff())
with check (bucket_id = 'private-project-files' and public.is_staff());

-- ============================================================================
-- 005_invoice_snapshots.sql
-- ============================================================================

create table if not exists public.invoice_snapshots (
  id uuid primary key default gen_random_uuid(), invoice_id uuid not null references public.invoices(id) on delete restrict, version integer not null, snapshot jsonb not null default '{}'::jsonb, created_by uuid references auth.users(id), created_at timestamptz not null default now(), unique(invoice_id, version)
);
alter table public.invoice_snapshots enable row level security;
drop policy if exists "staff can manage invoice snapshots" on public.invoice_snapshots;
create policy "staff can manage invoice snapshots" on public.invoice_snapshots for all to authenticated using (public.has_role(array['finance','admin','owner'])) with check (public.has_role(array['finance','admin','owner']));
drop policy if exists "client members can read invoice snapshots" on public.invoice_snapshots;
create policy "client members can read invoice snapshots" on public.invoice_snapshots for select to authenticated using (exists (select 1 from public.invoices i join public.client_memberships m on m.client_id = i.client_id where i.id = invoice_snapshots.invoice_id and m.user_id = auth.uid() and m.status = 'active'));

-- ============================================================================
-- 006_seed_public_content.sql
-- ============================================================================

-- LOGIKAin public content seed
-- Safe to rerun: each record is keyed by its stable slug.

-- Keep this seed compatible with projects that were created from an earlier
-- version of the schema before published_at was added to every content table.
alter table public.content_services add column if not exists published_at timestamptz;
alter table public.content_services add column if not exists updated_at timestamptz not null default now();
alter table public.content_industries add column if not exists published_at timestamptz;
alter table public.content_industries add column if not exists updated_at timestamptz not null default now();
alter table public.content_projects add column if not exists published_at timestamptz;
alter table public.content_projects add column if not exists updated_at timestamptz not null default now();
alter table public.content_insights add column if not exists published_at timestamptz;
alter table public.content_insights add column if not exists updated_at timestamptz not null default now();

insert into public.content_services (slug, name, summary, body, status, published_at)
values
  ('ai-automation', 'AI & Automation', 'Otomasi workflow yang membuat tim bekerja lebih cepat dan konsisten.', 'Kami memetakan proses, memilih titik otomasi yang tepat, lalu membangun sistem AI yang aman dan mudah dioperasikan.', 'published', now()),
  ('web-platform', 'Web Platform', 'Website dan platform digital yang cepat, terukur, dan siap berkembang.', 'Dari arsitektur informasi hingga implementasi Next.js dan Supabase, kami membangun fondasi digital yang dapat diukur.', 'published', now()),
  ('product-design', 'Product Design', 'Pengalaman produk yang jelas, usable, dan relevan dengan kebutuhan bisnis.', 'Riset, strategi konten, prototyping, dan design system kami rangkai menjadi pengalaman produk yang mudah dipahami.', 'published', now()),
  ('data-intelligence', 'Data Intelligence', 'Data yang lebih rapi untuk keputusan bisnis yang lebih tajam.', 'Kami membantu menyatukan sumber data, membangun dashboard, dan menyiapkan insight yang bisa ditindaklanjuti.', 'published', now()),
  ('growth-engineering', 'Growth Engineering', 'Eksperimen dan engineering untuk mengubah trafik menjadi pertumbuhan.', 'Kami menggabungkan SEO teknis, analytics, landing page, dan eksperimen konversi dalam satu siklus pertumbuhan.', 'published', now()),
  ('managed-digital-ops', 'Managed Digital Ops', 'Pendampingan berkelanjutan untuk menjaga sistem digital tetap sehat.', 'Tim kami membantu monitoring, perbaikan berkelanjutan, dokumentasi, dan prioritas roadmap setelah peluncuran.', 'published', now())
on conflict (slug) do update set name = excluded.name, summary = excluded.summary, body = excluded.body, status = excluded.status, published_at = excluded.published_at, updated_at = now();

insert into public.content_industries (slug, name, summary, body, status, published_at)
values
  ('financial-services', 'Financial Services', 'Membangun pengalaman finansial yang tepercaya dan efisien.', 'Platform finansial membutuhkan kejelasan, keamanan, dan alur yang minim friksi.', 'published', now()),
  ('healthcare', 'Healthcare', 'Teknologi yang membantu layanan kesehatan terasa lebih manusiawi.', 'Kami merancang sistem yang membantu tim dan pasien menemukan informasi serta menyelesaikan proses dengan lebih mudah.', 'published', now()),
  ('education', 'Education', 'Membuat pengetahuan lebih mudah diakses dan dikelola.', 'Dari platform pembelajaran hingga operasi internal, kami membantu institusi pendidikan bergerak lebih terstruktur.', 'published', now()),
  ('retail-commerce', 'Retail & Commerce', 'Pengalaman commerce yang terhubung dari discovery sampai repeat order.', 'Kami menyatukan brand, katalog, transaksi, dan data pelanggan untuk menciptakan pertumbuhan yang berkelanjutan.', 'published', now())
on conflict (slug) do update set name = excluded.name, summary = excluded.summary, body = excluded.body, status = excluded.status, published_at = excluded.published_at, updated_at = now();

insert into public.content_projects (slug, title, short_description, overview, status, published_at)
values
  ('nusa-finance', 'Nusa Finance', 'Platform finansial yang menyederhanakan keputusan bisnis.', 'Strategi produk, desain, dan engineering disatukan untuk membangun pengalaman finansial yang lebih jelas.', 'published', now()),
  ('ruang-sehat', 'Ruang Sehat', 'Layanan digital yang membuat akses informasi kesehatan lebih mudah.', 'Sistem konten dan pengalaman pengguna dirancang untuk mendukung kebutuhan pengguna dan tim operasional.', 'published', now()),
  ('kelas-utama', 'Kelas Utama', 'Platform pembelajaran dengan fondasi konten dan data yang kuat.', 'Arsitektur platform dipersiapkan agar tim dapat menerbitkan, mengukur, dan mengembangkan pengalaman belajar dengan cepat.', 'published', now())
on conflict (slug) do update set title = excluded.title, short_description = excluded.short_description, overview = excluded.overview, status = excluded.status, published_at = excluded.published_at, updated_at = now();

insert into public.content_insights (slug, title, excerpt, content, status, published_at)
values
  ('ai-ready-organization', 'Membangun Organisasi yang AI-Ready', 'Apa yang perlu disiapkan sebelum AI benar-benar memberi dampak.', 'AI yang berguna dimulai dari proses yang jelas, data yang dapat dipercaya, dan tim yang memahami batas serta peluang teknologi.', 'published', now()),
  ('seo-as-product', 'SEO sebagai Produk', 'SEO yang sehat bukan checklist, melainkan bagian dari pengalaman produk.', 'Struktur informasi, performa, konten, dan internal linking perlu dirancang sebagai satu sistem yang terus berkembang.', 'published', now()),
  ('digital-operating-model', 'Digital Operating Model', 'Cara menyusun ritme kerja digital yang membuat keputusan lebih cepat.', 'Model operasi yang baik menyatukan ownership, data, eksperimen, dan dokumentasi agar strategi dapat dieksekusi konsisten.', 'published', now())
on conflict (slug) do update set title = excluded.title, excerpt = excluded.excerpt, content = excluded.content, status = excluded.status, published_at = excluded.published_at, updated_at = now();

-- ============================================================================
-- 007_client_project_file_access.sql
-- ============================================================================

-- Client access is limited to files explicitly marked client_visible and owned by a project
-- belonging to the authenticated user's active client membership.

drop policy if exists "members can read visible project files" on public.project_files;
create policy "members can read visible project files" on public.project_files
  for select to authenticated
  using (client_visible = true and exists (
    select 1 from public.business_projects p
    join public.client_memberships m on m.client_id = p.client_id
    where p.id = project_files.project_id and m.user_id = auth.uid() and m.status = 'active'
  ));

drop policy if exists "members can download visible project files" on storage.objects;
create policy "members can download visible project files" on storage.objects
  for select to authenticated
  using (bucket_id = 'private-project-files' and exists (
    select 1 from public.project_files f
    join public.business_projects p on p.id = f.project_id
    join public.client_memberships m on m.client_id = p.client_id
    where f.storage_path = storage.objects.name and f.client_visible = true and m.user_id = auth.uid() and m.status = 'active'
  ));

-- ============================================================================
-- 008_client_support_messages.sql
-- ============================================================================

drop policy if exists "members can read client support messages" on public.support_messages;
create policy "members can read client support messages" on public.support_messages
  for select to authenticated
  using (visibility = 'client' and exists (
    select 1 from public.support_tickets t
    join public.client_memberships m on m.client_id = t.client_id
    where t.id = support_messages.ticket_id and m.user_id = auth.uid() and m.status = 'active'
  ));

drop policy if exists "members can create client support messages" on public.support_messages;
create policy "members can create client support messages" on public.support_messages
  for insert to authenticated
  with check (author_user_id = auth.uid() and visibility = 'client' and exists (
    select 1 from public.support_tickets t
    join public.client_memberships m on m.client_id = t.client_id
    where t.id = support_messages.ticket_id and m.user_id = auth.uid() and m.status = 'active'
  ));

-- ============================================================================
-- 009_staff_access_policies.sql
-- ============================================================================

-- Internal admin surfaces require explicit policies for profile and membership administration.
drop policy if exists "staff can read profiles" on public.profiles;
create policy "staff can read profiles" on public.profiles
  for select to authenticated using (public.is_staff());

drop policy if exists "admins can update profiles" on public.profiles;
create policy "admins can update profiles" on public.profiles
  for update to authenticated using (public.has_role(array['admin', 'owner'])) with check (public.has_role(array['admin', 'owner']));

drop policy if exists "staff can manage client memberships" on public.client_memberships;
create policy "staff can manage client memberships" on public.client_memberships
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "staff can manage client contacts" on public.client_contacts;
create policy "staff can manage client contacts" on public.client_contacts
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "staff can manage media assets" on public.media_assets;
create policy "staff can manage media assets" on public.media_assets
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "staff can create activity logs" on public.activity_logs;
create policy "staff can create activity logs" on public.activity_logs
  for insert to authenticated with check (public.is_staff());

drop policy if exists "staff can manage quotes" on public.quotes;
create policy "staff can manage quotes" on public.quotes
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "staff can manage invoices" on public.invoices;
create policy "staff can manage invoices" on public.invoices
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "staff can manage payments" on public.payments;
create policy "staff can manage payments" on public.payments
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "staff can manage support tickets" on public.support_tickets;
create policy "staff can manage support tickets" on public.support_tickets
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

drop policy if exists "staff can manage redirects" on public.redirects;
create policy "staff can manage redirects" on public.redirects
  for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- ============================================================================
-- 010_profile_on_signup.sql
-- ============================================================================

-- Ensure every Auth user has a profile row, while keeping new accounts
-- inactive until an operator explicitly grants access.
create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, full_name, role, status)
  values (new.id, nullif(new.raw_user_meta_data ->> 'username', ''), coalesce(new.raw_user_meta_data ->> 'full_name', new.email), 'project_member', 'invited')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile
  after insert on auth.users
  for each row execute function public.handle_new_user_profile();

-- ============================================================================
-- 011_prd_completion_entities.sql
-- ============================================================================

create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(), quote text not null, author_name text not null,
  author_role text, company_name text, status text not null default 'draft' check (status in ('draft','review','published','archived')),
  featured boolean not null default false, created_by uuid references auth.users(id), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.technologies (id uuid primary key default gen_random_uuid(), name text not null unique, slug text not null unique);
create table if not exists public.project_media (id uuid primary key default gen_random_uuid(), project_id uuid not null references public.content_projects(id) on delete cascade, media_asset_id uuid not null references public.media_assets(id) on delete cascade, sort_order integer not null default 0, alt_text text not null default '', unique(project_id, media_asset_id));
create table if not exists public.project_services (project_id uuid not null references public.content_projects(id) on delete cascade, service_id uuid not null references public.content_services(id) on delete cascade, primary key(project_id, service_id));
create table if not exists public.project_technologies (project_id uuid not null references public.content_projects(id) on delete cascade, technology_id uuid not null references public.technologies(id) on delete cascade, primary key(project_id, technology_id));
create table if not exists public.quote_items (id uuid primary key default gen_random_uuid(), quote_id uuid not null references public.quotes(id) on delete cascade, description text not null, quantity integer not null default 1 check (quantity > 0), unit_amount_minor bigint not null default 0 check (unit_amount_minor >= 0), sort_order integer not null default 0);
create table if not exists public.invoice_items (id uuid primary key default gen_random_uuid(), invoice_id uuid not null references public.invoices(id) on delete cascade, description text not null, quantity integer not null default 1 check (quantity > 0), unit_amount_minor bigint not null default 0 check (unit_amount_minor >= 0), sort_order integer not null default 0);
create table if not exists public.lead_notes (id uuid primary key default gen_random_uuid(), lead_id uuid not null references public.leads(id) on delete cascade, author_id uuid references auth.users(id), body text not null, created_at timestamptz not null default now());
create table if not exists public.client_notes (id uuid primary key default gen_random_uuid(), client_id uuid not null references public.clients(id) on delete cascade, author_id uuid references auth.users(id), body text not null, created_at timestamptz not null default now());
create table if not exists public.support_attachments (id uuid primary key default gen_random_uuid(), ticket_id uuid not null references public.support_tickets(id) on delete cascade, storage_path text not null, filename text not null, uploaded_by uuid references auth.users(id), created_at timestamptz not null default now());
create table if not exists public.project_feedback (id uuid primary key default gen_random_uuid(), project_id uuid not null references public.business_projects(id) on delete cascade, author_user_id uuid references auth.users(id), body text not null, rating integer check (rating between 1 and 5), visibility text not null default 'client' check (visibility in ('internal','client')), created_at timestamptz not null default now());
create table if not exists public.client_documents (id uuid primary key default gen_random_uuid(), client_id uuid not null references public.clients(id) on delete cascade, storage_path text not null, filename text not null, visibility text not null default 'internal' check (visibility in ('internal','client')), uploaded_by uuid references auth.users(id), created_at timestamptz not null default now());
create table if not exists public.service_agreements (id uuid primary key default gen_random_uuid(), client_id uuid not null references public.clients(id), project_id uuid references public.business_projects(id), status text not null default 'active', cadence text, amount_minor bigint not null default 0, currency text not null default 'IDR', next_invoice_at date, created_at timestamptz not null default now());
create table if not exists public.product_entitlements (id uuid primary key default gen_random_uuid(), tenant_id uuid not null references public.tenants(id) on delete cascade, feature_key text not null, value jsonb not null default '{}'::jsonb, source text, created_at timestamptz not null default now(), unique(tenant_id, feature_key));
create table if not exists public.site_settings (key text primary key, value jsonb not null default '{}'::jsonb, updated_by uuid references auth.users(id), updated_at timestamptz not null default now());
create table if not exists public.navigation_items (id uuid primary key default gen_random_uuid(), label text not null, href text not null, sort_order integer not null default 0, visible boolean not null default true, updated_at timestamptz not null default now());

do $$ declare t text; begin foreach t in array array['testimonials','technologies','project_media','project_services','project_technologies','quote_items','invoice_items','lead_notes','client_notes','support_attachments','project_feedback','client_documents','service_agreements','product_entitlements','site_settings','navigation_items'] loop execute format('alter table public.%I enable row level security', t); end loop; end $$;
drop policy if exists "staff can manage completion entities" on public.testimonials;
create policy "staff can manage completion entities" on public.testimonials for all to authenticated using (public.is_staff()) with check (public.is_staff());
drop policy if exists "published testimonials are public" on public.testimonials;
create policy "published testimonials are public" on public.testimonials for select using (status = 'published');
do $$ declare t text; begin foreach t in array array['technologies','project_media','project_services','project_technologies','quote_items','invoice_items','lead_notes','client_notes','support_attachments','project_feedback','client_documents','service_agreements','site_settings','navigation_items'] loop execute format('drop policy if exists "staff can manage %s" on public.%I', t, t); execute format('create policy "staff can manage %s" on public.%I for all to authenticated using (public.is_staff()) with check (public.is_staff())', t, t); end loop; end $$;
drop policy if exists "members can read visible project feedback" on public.project_feedback;
create policy "members can read visible project feedback" on public.project_feedback for select to authenticated using (visibility = 'client' and exists (select 1 from public.business_projects p join public.client_memberships m on m.client_id = p.client_id where p.id = project_feedback.project_id and m.user_id = auth.uid() and m.status = 'active'));
drop policy if exists "tenant members can read entitlements" on public.product_entitlements;
create policy "tenant members can read entitlements" on public.product_entitlements for select to authenticated using (exists (select 1 from public.tenant_memberships m where m.tenant_id = product_entitlements.tenant_id and m.user_id = auth.uid() and m.status = 'active'));
drop policy if exists "staff can manage product entitlements" on public.product_entitlements;
create policy "staff can manage product entitlements" on public.product_entitlements for all to authenticated using (public.has_role(array['admin','owner'])) with check (public.has_role(array['admin','owner']));

-- Preserve commercial history: issued invoices and accepted quotes cannot be edited in place.
create or replace function public.protect_commercial_history() returns trigger language plpgsql as $$ begin
  if tg_table_name = 'quotes' and old.status = 'accepted' and (new.total_minor <> old.total_minor or new.quote_number <> old.quote_number) then raise exception 'Accepted quotation is immutable'; end if;
  if tg_table_name = 'invoices' and old.status in ('issued','partially_paid','paid','overdue') and (new.total_minor <> old.total_minor or new.invoice_number <> old.invoice_number) then raise exception 'Issued invoice is immutable'; end if;
  return new;
end; $$;
drop trigger if exists protect_quote_history on public.quotes;
create trigger protect_quote_history before update on public.quotes for each row execute function public.protect_commercial_history();
drop trigger if exists protect_invoice_history on public.invoices;
create trigger protect_invoice_history before update on public.invoices for each row execute function public.protect_commercial_history();

-- Normalize state machines to the final PRD vocabulary on fresh and upgraded databases.
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('client','editor','sales','project_member','finance','support','admin','owner'));
alter table public.business_projects drop constraint if exists business_projects_status_check;
alter table public.business_projects add constraint business_projects_status_check check (status in ('planned','active','on_hold','review','completed','cancelled','planning','archived'));
alter table public.project_tasks drop constraint if exists project_tasks_status_check;
alter table public.project_tasks add constraint project_tasks_status_check check (status in ('todo','in_progress','blocked','review','done','cancelled'));
alter table public.quotes drop constraint if exists quotes_status_check;
alter table public.quotes add constraint quotes_status_check check (status in ('draft','sent','viewed','accepted','rejected','expired','revision_requested','cancelled'));
alter table public.support_tickets drop constraint if exists support_tickets_status_check;
alter table public.support_tickets add constraint support_tickets_status_check check (status in ('open','in_progress','waiting_client','resolved','closed','waiting'));
alter table public.client_memberships drop constraint if exists client_memberships_portal_role_check;
alter table public.client_memberships add constraint client_memberships_portal_role_check check (portal_role in ('client_owner','client_admin','client_member','viewer','member','approver','billing'));

-- ============================================================================
-- 012_seed_operations_demo_data.sql
-- ============================================================================
-- Idempotent starter data for local/demo operation. Auth users are deliberately
-- not created here; create them in Supabase Auth, then grant access in /admin/users.

insert into public.technologies (name, slug) values
  ('Next.js', 'nextjs'), ('Supabase', 'supabase'), ('AI & Automation', 'ai-automation'), ('Analytics', 'analytics')
on conflict (slug) do update set name = excluded.name;

insert into public.leads (name, email, company, brief, source, status)
select 'Demo Lead', 'demo@logikain.id', 'Demo Company', 'Kebutuhan awal untuk merapikan proses operasional dan dashboard.', 'seed', 'qualified'
where not exists (select 1 from public.leads where email = 'demo@logikain.id');

insert into public.clients (name, legal_name, email, phone, status)
select 'Demo Client', 'PT Demo Client Indonesia', 'client@demo.logikain.id', '+62 811 0000 0000', 'active'
where not exists (select 1 from public.clients where email = 'client@demo.logikain.id');

insert into public.business_projects (client_id, originating_lead_id, name, description, status, start_date, target_date, budget_minor, currency)
select c.id, l.id, 'Demo Digital Operating System', 'Contoh project untuk menguji alur delivery, milestone, task, file, dan approval.', 'active', current_date, current_date + 45, 750000000, 'IDR'
from public.clients c cross join public.leads l
where c.email = 'client@demo.logikain.id' and l.email = 'demo@logikain.id'
and not exists (select 1 from public.business_projects where name = 'Demo Digital Operating System');

insert into public.project_milestones (project_id, title, description, status, target_date, client_visible)
select p.id, 'Discovery & mapping', 'Pemetaan proses dan prioritas awal.', 'in_progress', current_date + 10, true
from public.business_projects p
where p.name = 'Demo Digital Operating System'
and not exists (select 1 from public.project_milestones m where m.project_id = p.id and m.title = 'Discovery & mapping');

insert into public.project_tasks (project_id, milestone_id, title, description, status, due_date, client_visible)
select p.id, m.id, 'Review current workflow', 'Review alur kerja saat ini bersama stakeholder.', 'in_progress', current_date + 7, true
from public.business_projects p join public.project_milestones m on m.project_id = p.id and m.title = 'Discovery & mapping'
where p.name = 'Demo Digital Operating System'
and not exists (select 1 from public.project_tasks t where t.project_id = p.id and t.title = 'Review current workflow');

insert into public.quotes (quote_number, lead_id, client_id, status, currency, total_minor, valid_until)
select 'QT-DEMO-001', l.id, c.id, 'sent', 'IDR', 750000000, current_date + 14
from public.leads l cross join public.clients c
where l.email = 'demo@logikain.id' and c.email = 'client@demo.logikain.id'
and not exists (select 1 from public.quotes where quote_number = 'QT-DEMO-001');

insert into public.invoices (invoice_number, client_id, project_id, status, currency, total_minor, issued_at, due_at)
select 'INV-DEMO-001', c.id, p.id, 'issued', 'IDR', 250000000, current_date, current_date + 14
from public.clients c join public.business_projects p on p.client_id = c.id
where c.email = 'client@demo.logikain.id' and p.name = 'Demo Digital Operating System'
and not exists (select 1 from public.invoices where invoice_number = 'INV-DEMO-001');

insert into public.support_tickets (reference, client_id, project_id, subject, description, priority, status)
select 'SUP-DEMO-001', c.id, p.id, 'Demo support request', 'Contoh ticket untuk menguji alur support dan status update.', 'normal', 'open'
from public.clients c join public.business_projects p on p.client_id = c.id
where c.email = 'client@demo.logikain.id' and p.name = 'Demo Digital Operating System'
and not exists (select 1 from public.support_tickets where reference = 'SUP-DEMO-001');

insert into public.testimonials (quote, author_name, author_role, company_name, status, featured)
select 'Tim kami akhirnya punya cara kerja yang lebih jelas dan mudah diikuti.', 'Dina Pratama', 'COO', 'Demo Company', 'published', true
where not exists (select 1 from public.testimonials where author_name = 'Dina Pratama' and company_name = 'Demo Company');

insert into public.site_settings (key, value)
values
  ('homepage', '{"hero_badge":"DIGITAL PARTNER UNTUK BISNIS YANG BERGERAK","show_testimonials":true}'::jsonb),
  ('navigation', '[{"label":"Solusi","href":"/services","visible":true},{"label":"Cara kerja","href":"/process","visible":true},{"label":"Tentang kami","href":"/about","visible":true}]'::jsonb),
  ('contact', '{"email":"hello@logikain.id","whatsapp":"","response_sla":"1 hari kerja"}'::jsonb)
on conflict (key) do update set value = excluded.value, updated_at = now();

insert into public.navigation_items (label, href, sort_order, visible)
select item.label, item.href, item.sort_order, true
from (values ('Solusi','/services',10),('Cara kerja','/process',20),('Tentang kami','/about',30),('Mulai percakapan','/start-project',40)) as item(label, href, sort_order)
where not exists (select 1 from public.navigation_items n where n.href = item.href);

-- 012_username_auth.sql
-- Keep self-registration aligned with public.profiles.username.
create or replace function public.handle_new_user_profile()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, full_name, role, status)
  values (new.id, nullif(new.raw_user_meta_data ->> 'username', ''), coalesce(new.raw_user_meta_data ->> 'full_name', new.email), 'project_member', 'invited')
  on conflict (id) do update set username = coalesce(excluded.username, public.profiles.username), full_name = coalesce(excluded.full_name, public.profiles.full_name);
  return new;
end;
$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile after insert on auth.users for each row execute function public.handle_new_user_profile();

-- Final RBAC policy pass. Earlier bootstrap policies are replaced here so
-- database access matches the server-side permission matrix.
drop policy if exists "staff can manage leads" on public.leads;
create policy "staff can manage leads" on public.leads for all to authenticated using (public.has_role(array['sales','admin','owner'])) with check (public.has_role(array['sales','admin','owner']));
drop policy if exists "staff can manage clients" on public.clients;
create policy "staff can manage clients" on public.clients for all to authenticated using (public.has_role(array['sales','admin','owner'])) with check (public.has_role(array['sales','admin','owner']));
drop policy if exists "staff can manage projects" on public.business_projects;
create policy "staff can manage projects" on public.business_projects for all to authenticated using (public.has_role(array['project_member','admin','owner'])) with check (public.has_role(array['project_member','admin','owner']));
drop policy if exists "staff can manage quotes" on public.quotes;
create policy "staff can manage quotes" on public.quotes for all to authenticated using (public.has_role(array['sales','finance','admin','owner'])) with check (public.has_role(array['sales','finance','admin','owner']));
drop policy if exists "staff can manage invoices" on public.invoices;
create policy "staff can manage invoices" on public.invoices for all to authenticated using (public.has_role(array['finance','admin','owner'])) with check (public.has_role(array['finance','admin','owner']));
drop policy if exists "staff can manage payments" on public.payments;
create policy "staff can manage payments" on public.payments for all to authenticated using (public.has_role(array['finance','admin','owner'])) with check (public.has_role(array['finance','admin','owner']));
drop policy if exists "staff can manage support tickets" on public.support_tickets;
create policy "staff can manage support tickets" on public.support_tickets for all to authenticated using (public.has_role(array['support','admin','owner'])) with check (public.has_role(array['support','admin','owner']));
drop policy if exists "staff can manage client memberships" on public.client_memberships;
create policy "staff can manage client memberships" on public.client_memberships for all to authenticated using (public.has_role(array['sales','admin','owner'])) with check (public.has_role(array['sales','admin','owner']));
drop policy if exists "staff can manage project files" on public.project_files;
create policy "staff can manage project files" on public.project_files for all to authenticated using (public.has_role(array['project_member','admin','owner'])) with check (public.has_role(array['project_member','admin','owner']));
drop policy if exists "staff can manage project approvals" on public.project_approvals;
create policy "staff can manage project approvals" on public.project_approvals for all to authenticated using (public.has_role(array['project_member','admin','owner'])) with check (public.has_role(array['project_member','admin','owner']));
drop policy if exists "staff can manage project comments" on public.project_comments;
create policy "staff can manage project comments" on public.project_comments for all to authenticated using (public.has_role(array['project_member','admin','owner'])) with check (public.has_role(array['project_member','admin','owner']));
drop policy if exists "staff can manage support messages" on public.support_messages;
create policy "staff can manage support messages" on public.support_messages for all to authenticated using (public.has_role(array['support','admin','owner'])) with check (public.has_role(array['support','admin','owner']));
drop policy if exists "staff can manage media assets" on public.media_assets;
create policy "staff can manage media assets" on public.media_assets for all to authenticated using (public.has_role(array['editor','admin','owner'])) with check (public.has_role(array['editor','admin','owner']));
drop policy if exists "staff can manage redirects" on public.redirects;
create policy "staff can manage redirects" on public.redirects for all to authenticated using (public.has_role(array['editor','admin','owner'])) with check (public.has_role(array['editor','admin','owner']));
drop policy if exists "staff can manage automation jobs" on public.automation_jobs;
create policy "staff can manage automation jobs" on public.automation_jobs for all to authenticated using (public.has_role(array['admin','owner'])) with check (public.has_role(array['admin','owner']));

-- Client portal read/write policies for the demo and production portal flows.
drop policy if exists "members can read own quotes" on public.quotes;
create policy "members can read own quotes" on public.quotes for select to authenticated using (exists (select 1 from public.client_memberships m where m.client_id = quotes.client_id and m.user_id = auth.uid() and m.status = 'active'));
drop policy if exists "members can decide own quotes" on public.quotes;
create policy "members can decide own quotes" on public.quotes for update to authenticated using (exists (select 1 from public.client_memberships m where m.client_id = quotes.client_id and m.user_id = auth.uid() and m.status = 'active')) with check (status in ('sent','viewed','accepted','rejected','revision_requested'));
drop policy if exists "members can read own quote items" on public.quote_items;
create policy "members can read own quote items" on public.quote_items for select to authenticated using (exists (select 1 from public.quotes q join public.client_memberships m on m.client_id = q.client_id where q.id = quote_items.quote_id and m.user_id = auth.uid() and m.status = 'active'));
drop policy if exists "members can read own invoice items" on public.invoice_items;
create policy "members can read own invoice items" on public.invoice_items for select to authenticated using (exists (select 1 from public.invoices i join public.client_memberships m on m.client_id = i.client_id where i.id = invoice_items.invoice_id and m.user_id = auth.uid() and m.status = 'active'));
drop policy if exists "members can read own approvals" on public.project_approvals;
create policy "members can read own approvals" on public.project_approvals for select to authenticated using (exists (select 1 from public.business_projects p join public.client_memberships m on m.client_id = p.client_id where p.id = project_approvals.project_id and m.user_id = auth.uid() and m.status = 'active'));
drop policy if exists "members can decide own approvals" on public.project_approvals;
create policy "members can decide own approvals" on public.project_approvals for update to authenticated using (exists (select 1 from public.business_projects p join public.client_memberships m on m.client_id = p.client_id where p.id = project_approvals.project_id and m.user_id = auth.uid() and m.status = 'active')) with check (status in ('pending','approved','changes_requested','cancelled'));
drop policy if exists "members can create own feedback" on public.project_feedback;
create policy "members can create own feedback" on public.project_feedback for insert to authenticated with check (author_user_id = auth.uid() and visibility = 'client' and exists (select 1 from public.business_projects p join public.client_memberships m on m.client_id = p.client_id where p.id = project_feedback.project_id and m.user_id = auth.uid() and m.status = 'active'));
drop policy if exists "members can create own support tickets" on public.support_tickets;
create policy "members can create own support tickets" on public.support_tickets for insert to authenticated with check (exists (select 1 from public.client_memberships m where m.client_id = support_tickets.client_id and m.user_id = auth.uid() and m.status = 'active'));

commit;
