-- Stories Tabelle
create table stories (
  id uuid default gen_random_uuid() primary key,
  hunde_name text not null,
  rasse text not null,
  besitzer text not null,
  ort text not null,
  kurs text not null,
  dauer text not null,
  vorher text not null,
  nachher text not null,
  zitat text not null,
  foto_vorher text not null,
  foto_nachher text not null,
  reihenfolge integer default 0,
  created_at timestamp with time zone default now()
);

-- RLS
alter table stories enable row level security;
create policy "Stories öffentlich lesbar" on stories for select using (true);
create policy "Stories nur für Auth" on stories for all using (auth.role() = 'authenticated');

-- Fiktive Daten übernehmen
insert into stories (hunde_name, rasse, besitzer, ort, kurs, dauer, vorher, nachher, zitat, foto_vorher, foto_nachher, reihenfolge) values
(
  'Bruno', 'Deutscher Schäferhund, 2 Jahre', 'Familie Steiner', 'Zurzach',
  'Einzeltraining + Hundeschule', '3 Monate',
  'Bruno zog so stark an der Leine, dass Spaziergänge zur Tortur wurden. Er bellte jeden Hund an, sprang Fremde an und war zuhause kaum zu beruhigen. Wir hatten schon fast aufgegeben.',
  'Heute läuft Bruno entspannt an lockerer Leine. Er begrüsst andere Hunde ruhig, sitzt auf Kommando und ist zu einem echten Familienhund geworden. Spaziergänge sind wieder Freude statt Stress.',
  'Marcus hat uns von Anfang an ernst genommen. Nach zwei Wochen sahen wir erste Resultate — nach drei Monaten hatten wir einen anderen Hund.',
  'https://images.pexels.com/photos/2853422/pexels-photo-2853422.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1390361/pexels-photo-1390361.jpeg?auto=compress&cs=tinysrgb&w=600',
  1
),
(
  'Luna', 'Labrador Mix, 1.5 Jahre', 'Sarah K.', 'Baden',
  'Hundeschule Grundkurs', '6 Wochen',
  'Luna war überdreht, konnte sich null konzentrieren und ignorierte jeden Rückruf. Im Park lief sie einfach davon — ich hatte ständig Angst, sie zu verlieren.',
  'Der Rückruf klappt heute zuverlässig, auch mit Ablenkung. Luna hat gelernt, sich zu fokussieren. Der Grundkurs war der Wendepunkt — endlich haben wir eine gemeinsame Sprache.',
  'Ich hätte nicht gedacht, dass sechs Wochen so viel ausmachen können. Luna ist immer noch verspielt und lebhaft — aber jetzt auch verlässlich.',
  'https://images.pexels.com/photos/1108099/pexels-photo-1108099.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/825949/pexels-photo-825949.jpeg?auto=compress&cs=tinysrgb&w=600',
  2
),
(
  'Rex', 'Rottweiler, 3 Jahre', 'Marco & Julia B.', 'Döttingen',
  'Einzeltraining', '8 Wochen',
  'Rex hatte starke Angstreaktion gegenüber anderen Hunden — nicht aus Aggression, sondern aus Unsicherheit. Er zitterte, bellte hysterisch und war in der Stadt nicht führbar.',
  'Mit viel Geduld und gezieltem Desensibilisierungstraining kann Rex heute an anderen Hunden vorbeigehen, ohne zu reagieren. Er ist ruhiger, selbstsicherer und entspannter als je zuvor.',
  'Marcus hat sofort erkannt, dass Rex Angst hatte — nicht Böswilligkeit. Diese Unterscheidung hat alles verändert. Endlich jemand der unseren Hund wirklich versteht.',
  'https://images.pexels.com/photos/4587991/pexels-photo-4587991.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/1805164/pexels-photo-1805164.jpeg?auto=compress&cs=tinysrgb&w=600',
  3
),
(
  'Mia', 'Border Collie, 4 Jahre', 'Thomas W.', 'Klingnau',
  'Mantrailing', '4 Monate',
  'Mia war intelligent aber unterfordert — zerstörte zuhause Möbel, jaulte stundenlang und war rastlos. Wir wussten, sie brauchte mehr als normale Spaziergänge.',
  'Mantrailing hat Mia eine Aufgabe gegeben. Die Erschöpfung nach einem Trail ist tiefer als nach zwei Stunden Laufen. Sie ist ausgeglichen, zufrieden — und meine Couch ist gerettet.',
  'Wer einen Border Collie hat, braucht Nasenarbeit. Marcus hat mir das mit dem ersten Training gezeigt. Mia lebt jetzt für ihre Trails.',
  'https://images.pexels.com/photos/3023579/pexels-photo-3023579.jpeg?auto=compress&cs=tinysrgb&w=600',
  'https://images.pexels.com/photos/551628/pexels-photo-551628.jpeg?auto=compress&cs=tinysrgb&w=600',
  4
);
