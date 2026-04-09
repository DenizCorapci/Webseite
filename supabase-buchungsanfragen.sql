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
  status text not null default 'neu' check (status in ('neu', 'bestaetigt', 'abgesagt')),
  created_at timestamp with time zone default now()
);

alter table buchungsanfragen enable row level security;
create policy "Buchungsanfragen lesbar" on buchungsanfragen for select using (true);
create policy "Buchungsanfragen schreiben" on buchungsanfragen for all using (true) with check (true);
