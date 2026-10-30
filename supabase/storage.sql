-- WorkEthio · KYC document storage (run AFTER supabase/schema.sql)
--
-- Binaries go to the private bucket `kyc-documents` under the demo-user/ prefix;
-- Postgres keeps only the object path so any device can fetch the same image.

-- 1. Object paths for the uploaded images
alter table public.workethio_verifications
  add column if not exists id_file_path     text,
  add column if not exists selfie_file_path text;

-- 2. Private bucket (created once)
insert into storage.buckets (id, name, public)
values ('kyc-documents', 'kyc-documents', false)
on conflict (id) do nothing;

-- 3. Single-user access: only objects under demo-user/
drop policy if exists "workethio demo kyc read" on storage.objects;
create policy "workethio demo kyc read" on storage.objects
  for select to anon, authenticated
  using (
    bucket_id = 'kyc-documents'
    and (storage.foldername(name))[1] = 'demo-user'
  );

drop policy if exists "workethio demo kyc insert" on storage.objects;
create policy "workethio demo kyc insert" on storage.objects
  for insert to anon, authenticated
  with check (
    bucket_id = 'kyc-documents'
    and (storage.foldername(name))[1] = 'demo-user'
  );

drop policy if exists "workethio demo kyc update" on storage.objects;
create policy "workethio demo kyc update" on storage.objects
  for update to anon, authenticated
  using (
    bucket_id = 'kyc-documents'
    and (storage.foldername(name))[1] = 'demo-user'
  )
  with check (
    bucket_id = 'kyc-documents'
    and (storage.foldername(name))[1] = 'demo-user'
  );

drop policy if exists "workethio demo kyc delete" on storage.objects;
create policy "workethio demo kyc delete" on storage.objects
  for delete to anon, authenticated
  using (
    bucket_id = 'kyc-documents'
    and (storage.foldername(name))[1] = 'demo-user'
  );
