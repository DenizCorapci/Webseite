-- Felder für Wunschtermin hinzufügen
alter table buchungsanfragen
  add column if not exists wunsch_datum date,
  add column if not exists wunsch_uhrzeit text;
