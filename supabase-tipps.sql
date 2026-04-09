create table tipps (
  id uuid default gen_random_uuid() primary key,
  titel text not null,
  beschreibung text not null default '',
  video_url text not null,
  created_at timestamp with time zone default now()
);

alter table tipps enable row level security;
create policy "Tipps öffentlich lesbar" on tipps for select using (true);
create policy "Tipps schreiben" on tipps for all using (true) with check (true);

-- Storage Bucket für Videos (im Supabase Dashboard unter Storage erstellen: "tipps-videos", public)
