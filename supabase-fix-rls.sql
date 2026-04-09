-- Berechtigungen für lernvideos fix
drop policy if exists "Lernvideos nur für Auth" on lernvideos;
create policy "Lernvideos schreiben" on lernvideos for all using (true) with check (true);

-- Berechtigungen für stories fix
drop policy if exists "Stories nur für Auth" on stories;
create policy "Stories schreiben" on stories for all using (true) with check (true);

-- Berechtigungen für termine fix
drop policy if exists "Termine nur für Auth" on termine;
create policy "Termine schreiben" on termine for all using (true) with check (true);
