-- Tabelle: Hunde
create table hunde (
  id uuid default gen_random_uuid() primary key,
  clerk_user_id text not null,
  besitzer_name text,
  besitzer_email text,
  name text not null,
  rasse text,
  hund_alter text,
  geschlecht text,
  kastration text,
  besonderheiten text,
  foto_url text,
  erstellt_am timestamptz default now()
);

-- Tabelle: Verhaltensberichte
create table verhaltensberichte (
  id uuid default gen_random_uuid() primary key,
  hund_id uuid references hunde(id) on delete cascade,
  titel text not null,
  datum date not null,
  phase text,
  zusammenfassung text,
  anamnese text,
  verhaltensanalyse text,
  therapieplan text,
  naechste_schritte text,
  erstellt_am timestamptz default now()
);

-- Tabelle: Medien (Fotos & Videos)
create table bericht_medien (
  id uuid default gen_random_uuid() primary key,
  bericht_id uuid references verhaltensberichte(id) on delete cascade,
  url text not null,
  typ text check (typ in ('foto', 'video')),
  beschriftung text,
  erstellt_am timestamptz default now()
);

-- Storage Bucket für Medien
insert into storage.buckets (id, name, public)
values ('medien', 'medien', true);

-- Zugriffsrechte (offen, da Auth über Clerk läuft)
alter table hunde enable row level security;
alter table verhaltensberichte enable row level security;
alter table bericht_medien enable row level security;

create policy "Hunde lesen" on hunde for select using (true);
create policy "Hunde erstellen" on hunde for insert with check (true);
create policy "Hunde bearbeiten" on hunde for update using (true);

create policy "Berichte lesen" on verhaltensberichte for select using (true);
create policy "Berichte erstellen" on verhaltensberichte for insert with check (true);
create policy "Berichte bearbeiten" on verhaltensberichte for update using (true);

create policy "Medien lesen" on bericht_medien for select using (true);
create policy "Medien erstellen" on bericht_medien for insert with check (true);

create policy "Medien hochladen" on storage.objects for insert with check (bucket_id = 'medien');
create policy "Medien public lesen" on storage.objects for select using (bucket_id = 'medien');
