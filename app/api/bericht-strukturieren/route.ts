import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: Request) {
  const { transkription, hundName } = await req.json()
  if (!transkription) return Response.json({ error: 'Keine Transkription' }, { status: 400 })

  const prompt = `Du bist ein Assistent für Hundeschule-Trainingsberichte. Marcus (Hundetrainer) hat folgende Sprachnotiz nach einer Trainingseinheit diktiert:

---
${transkription}
---

Extrahiere daraus einen strukturierten Verhaltensbericht für den Hund "${hundName || 'unbekannt'}".

Antworte NUR mit einem JSON-Objekt (kein Markdown, keine Erklärung):
{
  "titel": "kurzer prägnanter Titel (max 60 Zeichen)",
  "zusammenfassung": "Zusammenfassung der Trainingseinheit in 2-4 Sätzen",
  "naechste_schritte": "Was soll der Kunde bis zum nächsten Termin üben"
}

Falls ein Abschnitt nicht aus der Sprachnotiz hervorgeht, fülle ihn mit einem leeren String "".`

  try {
    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1024,
      messages: [{ role: 'user', content: prompt }],
    })

    let text = message.content[0].type === 'text' ? message.content[0].text : ''

    // Markdown-Fences entfernen falls Claude sie trotzdem schreibt
    text = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/```\s*$/i, '').trim()

    const json = JSON.parse(text)
    return Response.json(json)
  } catch (err) {
    console.error('bericht-strukturieren Fehler:', err)
    return Response.json({ error: String(err) }, { status: 500 })
  }
}
