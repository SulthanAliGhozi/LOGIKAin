-- LOGIKAin portal demo seed
-- Jalankan setelah supabase/LOGIKAin.sql.
-- Ganti email di baris target_email dengan email akun client yang akan diuji.

do $$
declare
  target_email text := 'user@user.com';
  target_user uuid;
  demo_client uuid;
  demo_project uuid;
  demo_milestone uuid;
  demo_quote uuid;
  demo_invoice uuid;
  demo_ticket uuid;
begin
  select id into target_user from auth.users where lower(email) = lower(target_email) limit 1;
  if target_user is not null then
    update public.profiles
    set role = 'client', status = 'active', updated_at = now()
    where id = target_user;
  else
    raise notice 'User % belum ada di auth.users; data demo dibuat tanpa membership.', target_email;
  end if;

  select id into demo_client from public.clients
  where email = target_email or name = 'LOGIKAin Demo Client'
  order by created_at desc limit 1;

  if demo_client is null then
    insert into public.clients (name, legal_name, email, phone, status)
    values ('LOGIKAin Demo Client', 'PT LOGIKAin Demo Client', target_email, '+62 811 0000 0000', 'active')
    returning id into demo_client;
  else
    update public.clients set email = target_email, status = 'active', updated_at = now()
    where id = demo_client;
  end if;

  if target_user is not null then
    insert into public.client_memberships (client_id, user_id, portal_role, status)
    values (demo_client, target_user, 'client_owner', 'active')
    on conflict (client_id, user_id) do update
      set portal_role = 'client_owner', status = 'active';
  end if;

  insert into public.business_projects
    (client_id, name, description, status, start_date, target_date, budget_minor, currency)
  select demo_client, 'Demo Website Relaunch',
    'Project demo untuk mencoba progress, file, approval, feedback, dan support.',
    'active', current_date - 7, current_date + 30, 150000000, 'IDR'
  where not exists (
    select 1 from public.business_projects
    where client_id = demo_client and name = 'Demo Website Relaunch'
  );

  select id into demo_project from public.business_projects
  where client_id = demo_client and name = 'Demo Website Relaunch'
  order by created_at desc limit 1;

  insert into public.project_milestones
    (project_id, title, description, status, target_date, client_visible)
  select demo_project, 'Discovery dan audit', 'Memetakan kebutuhan bisnis dan prioritas pekerjaan.',
    'done', current_date - 1, true
  where not exists (
    select 1 from public.project_milestones
    where project_id = demo_project and title = 'Discovery dan audit'
  );

  insert into public.project_milestones
    (project_id, title, description, status, target_date, client_visible)
  select demo_project, 'Design dan implementation', 'Menyusun desain dan mulai implementasi.',
    'in_progress', current_date + 14, true
  where not exists (
    select 1 from public.project_milestones
    where project_id = demo_project and title = 'Design dan implementation'
  );

  select id into demo_milestone from public.project_milestones
  where project_id = demo_project and title = 'Design dan implementation'
  limit 1;

  insert into public.project_tasks
    (project_id, milestone_id, title, description, status, due_date, client_visible)
  select demo_project, demo_milestone, 'Review sitemap dan content direction',
    'Client meninjau struktur halaman dan arah konten.',
    'review', current_date + 5, true
  where not exists (
    select 1 from public.project_tasks
    where project_id = demo_project and title = 'Review sitemap dan content direction'
  );

  insert into public.quotes
    (quote_number, client_id, status, currency, total_minor, valid_until)
  select 'QUO-DEMO-PORTAL-001', demo_client, 'sent', 'IDR', 150000000, current_date + 14
  where not exists (
    select 1 from public.quotes where quote_number = 'QUO-DEMO-PORTAL-001'
  );

  select id into demo_quote from public.quotes
  where quote_number = 'QUO-DEMO-PORTAL-001';

  insert into public.quote_items
    (quote_id, description, quantity, unit_amount_minor, sort_order)
  select demo_quote, 'Discovery dan digital strategy', 1, 25000000, 1
  where not exists (
    select 1 from public.quote_items
    where quote_id = demo_quote and description = 'Discovery dan digital strategy'
  );

  insert into public.quote_items
    (quote_id, description, quantity, unit_amount_minor, sort_order)
  select demo_quote, 'Website design dan implementation', 1, 125000000, 2
  where not exists (
    select 1 from public.quote_items
    where quote_id = demo_quote and description = 'Website design dan implementation'
  );

  insert into public.invoices
    (invoice_number, client_id, project_id, status, currency, total_minor, issued_at, due_at)
  select 'INV-DEMO-PORTAL-001', demo_client, demo_project, 'issued', 'IDR',
    75000000, current_date, current_date + 14
  where not exists (
    select 1 from public.invoices where invoice_number = 'INV-DEMO-PORTAL-001'
  );

  select id into demo_invoice from public.invoices
  where invoice_number = 'INV-DEMO-PORTAL-001';

  insert into public.invoice_items
    (invoice_id, description, quantity, unit_amount_minor, sort_order)
  select demo_invoice, 'Termin pertama project', 1, 75000000, 1
  where not exists (
    select 1 from public.invoice_items
    where invoice_id = demo_invoice and description = 'Termin pertama project'
  );

  insert into public.invoice_snapshots
    (invoice_id, version, snapshot, created_by)
  select demo_invoice, 1,
    jsonb_build_object(
      'invoice_number', 'INV-DEMO-PORTAL-001',
      'client_name', 'LOGIKAin Demo Client',
      'total_minor', 75000000,
      'currency', 'IDR',
      'description', 'Termin pertama project'
    ),
    target_user
  where not exists (
    select 1 from public.invoice_snapshots
    where invoice_id = demo_invoice and version = 1
  );

  insert into public.project_approvals
    (project_id, title, request_note, status)
  select demo_project, 'Approval homepage direction',
    'Mohon review dan setujui arah homepage demo ini.',
    'pending'
  where not exists (
    select 1 from public.project_approvals
    where project_id = demo_project and title = 'Approval homepage direction'
  );

  insert into public.project_feedback
    (project_id, author_user_id, body, rating, visibility)
  select demo_project, target_user,
    'Contoh feedback dari client untuk menguji timeline project.',
    4, 'client'
  where not exists (
    select 1 from public.project_feedback
    where project_id = demo_project and body = 'Contoh feedback dari client untuk menguji timeline project.'
  );

  insert into public.support_tickets
    (reference, client_id, project_id, subject, description, priority, status)
  select 'SUP-DEMO-PORTAL-001', demo_client, demo_project,
    'Pertanyaan tentang timeline demo',
    'Contoh ticket untuk menguji thread support dan balasan staff.',
    'normal', 'open'
  where not exists (
    select 1 from public.support_tickets
    where reference = 'SUP-DEMO-PORTAL-001'
  );

  select id into demo_ticket from public.support_tickets
  where reference = 'SUP-DEMO-PORTAL-001';

  insert into public.support_messages
    (ticket_id, author_user_id, body, visibility)
  select demo_ticket, target_user,
    'Halo tim, ini pesan demo dari client.',
    'client'
  where not exists (
    select 1 from public.support_messages
    where ticket_id = demo_ticket and body = 'Halo tim, ini pesan demo dari client.'
  );

  raise notice 'Portal demo berhasil dibuat untuk %', target_email;
end $$;
