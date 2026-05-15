create table buchungsanfragen (
  id uuid default gen_random_uuid() primary key,
  termin_id uuid references termine(id) on delete set null,
  vorname text not null default '',
  nachname text not null default '',
  email text not null default '',
  telefon text not null default '',
  hund_name text not null default '',
  hund_rasse text not null default '',
  hund_alter text not null default '',
  nachricht text not null default '',
  wunsch_datum date,
  wunsch_uhrzeit text,
  kurs_typ text,
  status text not null default 'neu' check (status in ('neu', 'bestaetigt', 'abgesagt')),
  created_at timestamp with time zone default now()
);

alter table buchungsanfragen enable row level security;

-- Jeder darf eine Anfrage einreichen (Formular auf der Website)
create policy "Buchungsanfragen schreiben" on buchungsanfragen
  for insert with check (true);

-- Nur eingeloggte Admins dürfen alle Anfragen lesen
create policy "Buchungsanfragen lesen (Admin)" on buchungsanfragen
  for select using (auth.role() = 'authenticated');

-- Nur eingeloggte Admins dürfen Status ändern
create policy "Buchungsanfragen aktualisieren (Admin)" on buchungsanfragen
  for update using (auth.role() = 'authenticated');
