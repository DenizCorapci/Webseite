-- Lernvideos Tabelle
create table lernvideos (
  id uuid default gen_random_uuid() primary key,
  titel text not null,
  beschreibung text not null,
  video_url text not null,
  kategorie text not null default 'Allgemein',
  reihenfolge integer default 0,
  created_at timestamp with time zone default now()
);

-- RLS
alter table lernvideos enable row level security;
create policy "Lernvideos öffentlich lesbar" on lernvideos for select using (true);
create policy "Lernvideos nur für Auth" on lernvideos for all using (auth.role() = 'authenticated');
