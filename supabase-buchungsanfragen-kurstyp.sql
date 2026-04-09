alter table buchungsanfragen
  add column if not exists kurs_typ text not null default '';
