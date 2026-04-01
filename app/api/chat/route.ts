import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: NextRequest) {
  const { messages, hundId } = await req.json()

  // Hundeprofil laden
  let kontext = ''
  if (hundId) {
    const { data: hund } = await supabase
      .from('hunde')
      .select('name, rasse, hund_alter, geschlecht, kastration, besonderheiten')
      .eq('id', hundId)
      .single()

    if (hund) {
      kontext += `Hund: ${hund.name}, ${hund.rasse}, ${hund.hund_alter}, ${hund.geschlecht}, ${hund.kastration}`
      if (hund.besonderheiten) kontext += `, Besonderheiten: ${hund.besonderheiten}`
      kontext += '\n'
    }

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

Antworte immer auf Deutsch (Schweizer Deutsch ist ok). Halte Antworten kurz und verständlich. Gib konkrete Übungen und Schritte, keine langen Erklärungen.

Wenn du dir bei etwas nicht sicher bist, empfehle dem Kunden, direkt mit Marcus Kontakt aufzunehmen.

${kontext ? `--- Hundeprofil und aktueller Verhaltensbericht ---\n${kontext}---` : 'Noch kein Hundeprofil vorhanden.'}`

  const stream = await anthropic.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 1024,
    thinking: { type: 'adaptive' },
    system: systemPrompt,
    messages: messages,
    stream: true,
  })

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
