-- Termine Tabelle
create table termine (
  id uuid default gen_random_uuid() primary key,
  kurs text not null,
  typ text not null check (typ in ('Hundeschule', 'Einzeltraining', 'Social Walk', 'Mantrailing')),
  datum date not null,
  uhrzeit text not null,
  dauer text not null,
  plaetze integer not null default 6,
  belegt integer not null default 0,
  ort text not null,
  level text not null,
  created_at timestamp with time zone default now()
);

-- RLS
alter table termine enable row level security;
create policy "Termine öffentlich lesbar" on termine for select using (true);
create policy "Termine nur für Auth" on termine for all using (auth.role() = 'authenticated');

-- Fiktive Daten übernehmen
insert into termine (kurs, typ, datum, uhrzeit, dauer, plaetze, belegt, ort, level) values
  ('Hundeschule Grundkurs',      'Hundeschule',  '2026-04-05', '09:00', '60 Min',  6,  4, 'Trainingsgelände Zurzach',          'Anfänger'),
  ('Social Walk Rheinufer',      'Social Walk',  '2026-04-06', '10:00', '90 Min',  10, 7, 'Treffpunkt Parkplatz Rheinufer',     'Alle Level'),
  ('Mantrailing Einsteiger',     'Mantrailing',  '2026-04-12', '08:30', '120 Min', 4,  4, 'Gelände Zurzach & Umgebung',         'Anfänger'),
  ('Hundeschule Aufbaukurs',     'Hundeschule',  '2026-04-12', '11:00', '60 Min',  6,  3, 'Trainingsgelände Zurzach',          'Fortgeschritten'),
  ('Social Walk Waldstrecke',    'Social Walk',  '2026-04-13', '10:00', '90 Min',  10, 5, 'Treffpunkt Waldparkplatz Zurzach',  'Alle Level'),
  ('Hundeschule Grundkurs',      'Hundeschule',  '2026-04-26', '09:00', '60 Min',  6,  1, 'Trainingsgelände Zurzach',          'Anfänger'),
  ('Mantrailing Fortgeschritten','Mantrailing',  '2026-04-27', '08:00', '150 Min', 4,  2, 'Gelände Zurzach & Umgebung',         'Fortgeschritten'),
  ('Social Walk Rheinufer',      'Social Walk',  '2026-05-04', '10:00', '90 Min',  10, 3, 'Treffpunkt Parkplatz Rheinufer',     'Alle Level'),
  ('Hundeschule Grundkurs',      'Hundeschule',  '2026-05-10', '09:00', '60 Min',  6,  0, 'Trainingsgelände Zurzach',          'Anfänger'),
  ('Mantrailing Einsteiger',     'Mantrailing',  '2026-05-17', '08:30', '120 Min', 4,  1, 'Gelände Zurzach & Umgebung',         'Anfänger'),
  ('Social Walk Waldstrecke',    'Social Walk',  '2026-05-18', '10:00', '90 Min',  10, 6, 'Treffpunkt Waldparkplatz Zurzach',  'Alle Level'),
  ('Hundeschule Aufbaukurs',     'Hundeschule',  '2026-05-24', '11:00', '60 Min',  6,  2, 'Trainingsgelände Zurzach',          'Fortgeschritten');
