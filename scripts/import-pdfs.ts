/**
 * PDF-Import-Skript für RAG-System
 *
 * Verwendung:
 *   1. .env.local sicherstellen (OPENAI_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
 *   2. npx tsx scripts/import-pdfs.ts
 */

import fs from 'fs'
import path from 'path'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

// Env-Variablen laden (ohne dotenv — direkt aus process.env oder .env.local manuell)
function loadEnv() {
  const envPath = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envPath)) return
  const lines = fs.readFileSync(envPath, 'utf-8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx === -1) continue
    const key = trimmed.slice(0, idx).trim()
    const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '')
    if (!process.env[key]) process.env[key] = val
  }
}

loadEnv()

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!OPENAI_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Fehlende Umgebungsvariablen:')
  if (!OPENAI_API_KEY) console.error('  - OPENAI_API_KEY')
  if (!SUPABASE_URL) console.error('  - NEXT_PUBLIC_SUPABASE_URL')
  if (!SUPABASE_SERVICE_KEY) console.error('  - SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

const openai = new OpenAI({ apiKey: OPENAI_API_KEY })
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const PDF_ORDNER = path.join(process.cwd(), 'PDF')
const CHUNK_GROESSE = 800   // Zeichen pro Chunk
const CHUNK_UEBERLAPPUNG = 150 // Überlappung zwischen Chunks

function textInChunks(text: string): string[] {
  // Zeilenumbrüche normalisieren
  const bereinigt = text
    .replace(/\r\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  const chunks: string[] = []
  let position = 0

  while (position < bereinigt.length) {
    let ende = position + CHUNK_GROESSE

    // Chunk an Satzgrenze beenden wenn möglich
    if (ende < bereinigt.length) {
      const satzende = bereinigt.lastIndexOf('.', ende)
      const absatzende = bereinigt.lastIndexOf('\n\n', ende)
      const grenze = Math.max(satzende, absatzende)
      if (grenze > position + CHUNK_GROESSE / 2) {
        ende = grenze + 1
      }
    }

    const chunk = bereinigt.slice(position, ende).trim()
    if (chunk.length > 50) { // Sehr kurze Chunks überspringen
      chunks.push(chunk)
    }

    position = ende - CHUNK_UEBERLAPPUNG
  }

  return chunks
}

async function embedding(text: string): Promise<number[]> {
  for (let versuch = 0; versuch < 5; versuch++) {
    try {
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      })
      return response.data[0].embedding
    } catch (err: unknown) {
      const status = (err as { status?: number }).status
      if (status === 429) {
        const wartezeit = (versuch + 1) * 2000
        process.stdout.write(` (Rate Limit, warte ${wartezeit / 1000}s)`)
        await new Promise(r => setTimeout(r, wartezeit))
      } else {
        throw err
      }
    }
  }
  throw new Error('Embedding nach 5 Versuchen fehlgeschlagen')
}

async function importiereEinePdf(dateipfad: string) {
  const dateiname = path.basename(dateipfad)
  console.log(`\n📄 Verarbeite: ${dateiname}`)

  // Bestehende Chunks löschen
  const { error: loeschFehler } = await supabase
    .from('pdf_chunks')
    .delete()
    .eq('dateiname', dateiname)

  if (loeschFehler) {
    console.error(`  Fehler beim Löschen alter Chunks:`, loeschFehler.message)
  }

  // PDF lesen und Text extrahieren
  const pdfBuffer = fs.readFileSync(dateipfad)
  const { PDFParse } = await import('pdf-parse')
  const parser = new PDFParse({ data: pdfBuffer })
  const pdfDaten = await parser.getText()
  const text = pdfDaten.text

  console.log(`  Text: ${text.length} Zeichen`)

  const chunks = textInChunks(text)
  console.log(`  Chunks: ${chunks.length}`)

  // Chunks einzel verarbeiten (Rate Limit beachten)
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i]
    process.stdout.write(`  Chunk ${i + 1}/${chunks.length}...`)

    const embed = await embedding(chunk)

    const { error } = await supabase.from('pdf_chunks').insert({
      dateiname,
      inhalt: chunk,
      embedding: embed,
    })

    if (error) {
      console.error(`\n  Fehler bei Chunk ${i + 1}:`, error.message)
    } else {
      process.stdout.write(' ✓\n')
    }

    // Pause um Rate Limit (100 RPM) zu vermeiden
    await new Promise(r => setTimeout(r, 700))
  }
}

async function main() {
  if (!fs.existsSync(PDF_ORDNER)) {
    console.error(`Ordner "${PDF_ORDNER}" nicht gefunden.`)
    process.exit(1)
  }

  const dateien = fs.readdirSync(PDF_ORDNER).filter(f => f.toLowerCase().endsWith('.pdf'))

  if (dateien.length === 0) {
    console.error(`Keine PDF-Dateien im Ordner "${PDF_ORDNER}" gefunden.`)
    process.exit(1)
  }

  console.log(`🐕 Bad Dog PDF-Import`)
  console.log(`Gefunden: ${dateien.length} PDF(s) in "${PDF_ORDNER}"`)

  for (const datei of dateien) {
    await importiereEinePdf(path.join(PDF_ORDNER, datei))
  }

  console.log('\n✅ Import abgeschlossen!')
}

main().catch(err => {
  console.error('Fehler:', err)
  process.exit(1)
})
