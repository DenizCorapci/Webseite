create table termin_anmeldungen (
  id uuid default gen_random_uuid() primary key,
  termin_id uuid not null references termine(id) on delete cascade,
  clerk_user_id text not null,
  created_at timestamp with time zone default now(),
  unique(termin_id, clerk_user_id)
);

alter table termin_anmeldungen enable row level security;
create policy "Anmeldungen lesbar" on termin_anmeldungen for select using (true);
create policy "Anmeldungen schreiben" on termin_anmeldungen for all using (true) with check (true);
