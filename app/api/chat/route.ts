import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'
import { auth } from '@clerk/nextjs/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

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

Antworte immer auf Deutsch (Schweizer Deutsch ist ok). Halte Antworten kurz und verständlich. Gib konkrete Übungen und Schritte, keine langen Erklärungen.

Wenn du dir bei etwas nicht sicher bist, empfehle dem Kunden, direkt mit Marcus Kontakt aufzunehmen.

${kontext ? `--- Hundeprofil und aktueller Verhaltensbericht ---\n${kontext}---` : 'Noch kein Hundeprofil vorhanden.'}`

  let stream
  try {
    stream = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
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
