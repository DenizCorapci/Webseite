create table kunden_profile (
  id uuid default gen_random_uuid() primary key,
  clerk_user_id text not null unique,
  vorname text not null default '',
  nachname text not null default '',
  email text not null default '',
  telefon text not null default '',
  plz text not null default '',
  ort text not null default '',
  created_at timestamp with time zone default now()
);

alter table kunden_profile enable row level security;
create policy "Profil öffentlich lesbar" on kunden_profile for select using (true);
create policy "Profil schreiben" on kunden_profile for all using (true) with check (true);
