alter table quotes add column attachments text[] not null default '{}';
alter table appointments add column attachments text[] not null default '{}';
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
 values('reference-uploads','reference-uploads',false,5242880,array['image/jpeg','image/png','image/webp']) on conflict do nothing;
-- Envoi anonyme uniquement via URL signee creee par la Edge Function; lecture/suppression: admins seulement.
create policy "ref admin read" on storage.objects for select using(bucket_id='reference-uploads' and is_admin());
create policy "ref admin delete" on storage.objects for delete using(bucket_id='reference-uploads' and is_admin());
