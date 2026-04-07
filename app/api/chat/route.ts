import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import OpenAI from 'openai'
import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

// Service-Role-Client für Vektorsuche (umgeht RLS)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

async function sucheRelevantesWissen(frage: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) return ''

  try {
    const embeddingResponse = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: frage,
    })
    const embedding = embeddingResponse.data[0].embedding

    const { data: chunks } = await supabaseAdmin.rpc('suche_pdf_chunks', {
      anfrage_embedding: embedding,
      anzahl: 8,
    })

    if (!chunks || chunks.length === 0) return ''

    const relevante = chunks
      .filter((c: { aehnlichkeit: number }) => c.aehnlichkeit > 0.3)
      .map((c: { inhalt: string; dateiname: string }) =>
        `[${c.dateiname}]\n${c.inhalt}`
      )
      .join('\n\n---\n\n')

    return relevante
  } catch {
    return ''
  }
}

export async function POST(req: NextRequest) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY nicht gesetzt' }), { status: 500 })
  }

  // Clerk-Auth prüfen
  const { userId } = await auth()
  if (!userId) {
    return new Response(JSON.stringify({ error: 'Nicht eingeloggt' }), { status: 401 })
  }

  const { messages, hundId } = await req.json()

  // Letzte Nutzerfrage für Vektorsuche extrahieren
  const letzteNachricht = [...messages].reverse().find((m: { role: string }) => m.role === 'user')
  const wissenskontext = letzteNachricht
    ? await sucheRelevantesWissen(letzteNachricht.content)
    : ''

  console.log(`[RAG] Frage: "${letzteNachricht?.content?.slice(0, 60)}" → ${wissenskontext ? `${wissenskontext.length} Zeichen Kontext gefunden` : 'kein Kontext'}`)

  // Sicherstellen dass die hundId dem eingeloggten User gehört
  let kontext = ''
  if (hundId) {
    const { data: hund } = await supabase
      .from('hunde')
      .select('name, rasse, hund_alter, geschlecht, kastration, besonderheiten, clerk_user_id')
      .eq('id', hundId)
      .single()

    // Zugriff verweigern wenn der Hund einem anderen User gehört
    if (!hund || hund.clerk_user_id !== userId) {
      return new Response(JSON.stringify({ error: 'Kein Zugriff' }), { status: 403 })
    }

    kontext += `Hund: ${hund.name}, ${hund.rasse}, ${hund.hund_alter}, ${hund.geschlecht}, ${hund.kastration}`
    if (hund.besonderheiten) kontext += `, Besonderheiten: ${hund.besonderheiten}`
    kontext += '\n'

    // Neusten Bericht laden
    const { data: bericht } = await supabase
      .from('verhaltensberichte')
      .select('titel, phase, zusammenfassung, anamnese, verhaltensanalyse, therapieplan, naechste_schritte')
      .eq('hund_id', hundId)
      .order('datum', { ascending: false })
      .limit(1)
      .single()

    if (bericht) {
      kontext += `Aktueller Bericht: ${bericht.titel} (${bericht.phase})\n`
      if (bericht.zusammenfassung) kontext += `Zusammenfassung: ${bericht.zusammenfassung}\n`
      if (bericht.anamnese) kontext += `Anamnese: ${bericht.anamnese}\n`
      if (bericht.verhaltensanalyse) kontext += `Verhaltensanalyse: ${bericht.verhaltensanalyse}\n`
      if (bericht.therapieplan) kontext += `Therapieplan: ${bericht.therapieplan}\n`
      if (bericht.naechste_schritte) kontext += `Nächste Schritte: ${bericht.naechste_schritte}\n`
    }
  }

  const systemPrompt = `Du bist ein freundlicher Hundetraining-Assistent von Bad Dog Hundeschule in 5330 Zurzach, Schweiz. Der Trainer heisst Marcus.

Du gibst den Kunden konkrete, praktische Tipps zum Hundetraining – immer basierend auf dem spezifischen Profil und Verhaltensbericht des Hundes.

Antworte immer auf Deutsch (Schweizer Deutsch ist ok). Gib vollständige, detaillierte Antworten – nutze alle relevanten Informationen aus den Unterlagen. Strukturiere die Antwort übersichtlich mit Schritten oder Abschnitten wenn sinnvoll.

Wenn du dir bei etwas nicht sicher bist, empfehle dem Kunden, direkt mit Marcus Kontakt aufzunehmen.

${kontext ? `--- Hundeprofil und aktueller Verhaltensbericht ---\n${kontext}---` : 'Noch kein Hundeprofil vorhanden.'}

${wissenskontext ? `--- Relevantes Fachwissen aus unseren Unterlagen ---\n${wissenskontext}\n---\n\nNutze dieses Fachwissen wenn es zur Frage passt. Zitiere keine Dateinamen.` : ''}

Schreibe am Ende jeder Antwort eine neue Zeile mit der Quellenangabe:
- Wenn du das Fachwissen aus den Unterlagen verwendet hast: "📚 Quelle: Bad Dog Unterlagen"
- Wenn du nur aus deinem allgemeinen Wissen geantwortet hast: "🧠 Quelle: Allgemeines Hundetraining-Wissen"`

  let stream
  try {
    stream = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 3000,
      system: systemPrompt,
      messages: messages,
      stream: true,
    })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('Anthropic error:', msg)
    return new Response(msg, { status: 500 })
  }

  const encoder = new TextEncoder()
  const readable = new ReadableStream({
    async start(controller) {
      for await (const event of stream) {
        if (
          event.type === 'content_block_delta' &&
          event.delta.type === 'text_delta'
        ) {
          controller.enqueue(encoder.encode(event.delta.text))
        }
      }
      controller.close()
    },
  })

  return new Response(readable, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
