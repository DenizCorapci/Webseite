import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const ALLE_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00']

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const datum = searchParams.get('datum')
  if (!datum) return Response.json({ error: 'Kein Datum' }, { status: 400 })

  // Bestätigte Buchungsanfragen an diesem Tag
  const { data: bestaetigte } = await supabase
    .from('buchungsanfragen')
    .select('wunsch_uhrzeit, kurs_typ')
    .eq('wunsch_datum', datum)
    .eq('status', 'bestaetigt')

  // Gruppentermine an diesem Tag
  const { data: termineAmTag } = await supabase
    .from('termine')
    .select('uhrzeit')
    .eq('datum', datum)

  const belegtSet = new Set<string>()

  // Gruppentermine: je 1 Stunde
  termineAmTag?.forEach(t => { if (t.uhrzeit) belegtSet.add(t.uhrzeit) })

  // Buchungsanfragen: Ersttermin = 2 Stunden, sonst 1 Stunde
  bestaetigte?.forEach(b => {
    if (!b.wunsch_uhrzeit) return
    belegtSet.add(b.wunsch_uhrzeit)
    if (b.kurs_typ === 'Ersttermin') {
      // Nächste Stunde auch blockieren
      const idx = ALLE_SLOTS.indexOf(b.wunsch_uhrzeit)
      if (idx >= 0 && idx + 1 < ALLE_SLOTS.length) {
        belegtSet.add(ALLE_SLOTS[idx + 1])
      }
    }
  })

  const slots = ALLE_SLOTS.map((uhrzeit, idx) => {
    const istBelegt = belegtSet.has(uhrzeit)
    // Für Ersttermin-Prüfung: nächste Stunde auch frei?
    const naechsterBelegt = idx + 1 < ALLE_SLOTS.length ? belegtSet.has(ALLE_SLOTS[idx + 1]) : true
    return {
      uhrzeit,
      verfuegbar: !istBelegt,
      verfuegbar2h: !istBelegt && !naechsterBelegt, // beide Stunden frei
    }
  })

  return Response.json({ datum, slots })
}
