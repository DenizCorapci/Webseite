-- pgvector Erweiterung aktivieren
create extension if not exists vector;

-- Tabelle für PDF-Chunks mit Embeddings
create table if not exists pdf_chunks (
  id bigserial primary key,
  dateiname text not null,
  inhalt text not null,
  embedding vector(1536),
  erstellt_am timestamptz default now()
);

-- Index für schnelle Vektorsuche
create index if not exists pdf_chunks_embedding_idx
  on pdf_chunks using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

-- Funktion für Ähnlichkeitssuche
create or replace function suche_pdf_chunks(
  anfrage_embedding vector(1536),
  anzahl int default 5
)
returns table (
  id bigint,
  dateiname text,
  inhalt text,
  aehnlichkeit float
)
language sql stable
as $$
  select
    id,
    dateiname,
    inhalt,
    1 - (embedding <=> anfrage_embedding) as aehnlichkeit
  from pdf_chunks
  order by embedding <=> anfrage_embedding
  limit anzahl;
$$;

-- RLS deaktivieren (nur interner Zugriff via service_role)
alter table pdf_chunks enable row level security;

create policy "Nur service_role darf lesen"
  on pdf_chunks for select
  using (false);
