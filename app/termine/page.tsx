import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Termine',
  description: 'Alle Kurstermine der Bad Dog Hundeschule in 5330 Zurzach. Hundeschule, Einzeltraining, Social Walks und Mantrailing.',
}

type Kurs = {
  id: number
  kurs: string
  typ: 'Hundeschule' | 'Einzeltraining' | 'Social Walk' | 'Mantrailing'
  datum: string
  uhrzeit: string
  dauer: string
  plaetze: number
  belegt: number
  ort: string
  level: string
}

const termine: Kurs[] = [
  // April 2026
  {
    id: 1,
    kurs: 'Hundeschule Grundkurs',
    typ: 'Hundeschule',
    datum: 'Sa, 05. April 2026',
    uhrzeit: '09:00',
    dauer: '60 Min',
    plaetze: 6,
    belegt: 4,
    ort: 'Trainingsgelände Zurzach',
    level: 'Anfänger',
  },
  {
    id: 2,
    kurs: 'Social Walk Rheinufer',
    typ: 'Social Walk',
    datum: 'So, 06. April 2026',
    uhrzeit: '10:00',
    dauer: '90 Min',
    plaetze: 10,
    belegt: 7,
    ort: 'Treffpunkt Parkplatz Rheinufer',
    level: 'Alle Level',
  },
  {
    id: 3,
    kurs: 'Mantrailing Einsteiger',
    typ: 'Mantrailing',
    datum: 'Sa, 12. April 2026',
    uhrzeit: '08:30',
    dauer: '120 Min',
    plaetze: 4,
    belegt: 4,
    ort: 'Gelände Zurzach & Umgebung',
    level: 'Anfänger',
  },
  {
    id: 4,
    kurs: 'Hundeschule Aufbaukurs',
    typ: 'Hundeschule',
    datum: 'Sa, 12. April 2026',
    uhrzeit: '11:00',
    dauer: '60 Min',
    plaetze: 6,
    belegt: 3,
    ort: 'Trainingsgelände Zurzach',
    level: 'Fortgeschritten',
  },
  {
    id: 5,
    kurs: 'Social Walk Waldstrecke',
    typ: 'Social Walk',
    datum: 'So, 13. April 2026',
    uhrzeit: '10:00',
    dauer: '90 Min',
    plaetze: 10,
    belegt: 5,
    ort: 'Treffpunkt Waldparkplatz Zurzach',
    level: 'Alle Level',
  },
  {
    id: 6,
    kurs: 'Hundeschule Grundkurs',
    typ: 'Hundeschule',
    datum: 'Sa, 26. April 2026',
    uhrzeit: '09:00',
    dauer: '60 Min',
    plaetze: 6,
    belegt: 1,
    ort: 'Trainingsgelände Zurzach',
    level: 'Anfänger',
  },
  {
    id: 7,
    kurs: 'Mantrailing Fortgeschritten',
    typ: 'Mantrailing',
    datum: 'So, 27. April 2026',
    uhrzeit: '08:00',
    dauer: '150 Min',
    plaetze: 4,
    belegt: 2,
    ort: 'Gelände Zurzach & Umgebung',
    level: 'Fortgeschritten',
  },
  // Mai 2026
  {
    id: 8,
    kurs: 'Social Walk Rheinufer',
    typ: 'Social Walk',
    datum: 'So, 04. Mai 2026',
    uhrzeit: '10:00',
    dauer: '90 Min',
    plaetze: 10,
    belegt: 3,
    ort: 'Treffpunkt Parkplatz Rheinufer',
    level: 'Alle Level',
  },
  {
    id: 9,
    kurs: 'Hundeschule Grundkurs',
    typ: 'Hundeschule',
    datum: 'Sa, 10. Mai 2026',
    uhrzeit: '09:00',
    dauer: '60 Min',
    plaetze: 6,
    belegt: 0,
    ort: 'Trainingsgelände Zurzach',
    level: 'Anfänger',
  },
  {
    id: 10,
    kurs: 'Mantrailing Einsteiger',
    typ: 'Mantrailing',
    datum: 'Sa, 17. Mai 2026',
    uhrzeit: '08:30',
    dauer: '120 Min',
    plaetze: 4,
    belegt: 1,
    ort: 'Gelände Zurzach & Umgebung',
    level: 'Anfänger',
  },
  {
    id: 11,
    kurs: 'Social Walk Waldstrecke',
    typ: 'Social Walk',
    datum: 'So, 18. Mai 2026',
    uhrzeit: '10:00',
    dauer: '90 Min',
    plaetze: 10,
    belegt: 6,
    ort: 'Treffpunkt Waldparkplatz Zurzach',
    level: 'Alle Level',
  },
  {
    id: 12,
    kurs: 'Hundeschule Aufbaukurs',
    typ: 'Hundeschule',
    datum: 'Sa, 24. Mai 2026',
    uhrzeit: '11:00',
    dauer: '60 Min',
    plaetze: 6,
    belegt: 2,
    ort: 'Trainingsgelände Zurzach',
    level: 'Fortgeschritten',
  },
]

const typConfig: Record<Kurs['typ'], { farbe: string; icon: string }> = {
  Hundeschule:    { farbe: 'bg-rust/20 text-rust border-rust/30',          icon: '🐕' },
  Einzeltraining: { farbe: 'bg-amber-900/20 text-amber-400 border-amber-700/30', icon: '🎯' },
  'Social Walk':  { farbe: 'bg-emerald-900/20 text-emerald-400 border-emerald-700/30', icon: '🌿' },
  Mantrailing:    { farbe: 'bg-blue-900/20 text-blue-400 border-blue-700/30', icon: '👃' },
}

function Auslastung({ belegt, plaetze }: { belegt: number; plaetze: number }) {
  const frei = plaetze - belegt
  const voll = belegt >= plaetze
  const fastVoll = frei <= 1 && !voll

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {Array.from({ length: plaetze }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-sm ${i < belegt ? 'bg-rust' : 'bg-cream/10'}`}
          />
        ))}
      </div>
      <span className={`text-xs font-medium ${voll ? 'text-red-400' : fastVoll ? 'text-amber-400' : 'text-emerald-400'}`}>
        {voll ? 'Ausgebucht' : `${frei} Platz${frei !== 1 ? 'ätze' : ''} frei`}
      </span>
    </div>
  )
}

export default function TerminePage() {
  const monate = ['April 2026', 'Mai 2026']
  const grouped = monate.map((monat) => ({
    monat,
    termine: termine.filter((t) => t.datum.includes(monat.split(' ')[0])),
  }))

  return (
    <>
      {/* Header */}
      <section className="pt-32 pb-16 max-w-7xl mx-auto px-6">
        <p className="section-label mb-3">Kurskalender</p>
        <div className="divider mb-6" />
        <h1 className="font-display text-7xl sm:text-8xl tracking-wider text-cream">
          TERMINE<br /><span className="text-rust">2026</span>
        </h1>
        <p className="mt-6 text-cream/60 text-lg max-w-xl leading-relaxed">
          Alle verfügbaren Kurstermine auf einen Blick. Plätze sind begrenzt — frühzeitig anmelden lohnt sich.
        </p>

        {/* Legende */}
        <div className="mt-8 flex flex-wrap gap-3">
          {(Object.entries(typConfig) as [Kurs['typ'], { farbe: string; icon: string }][]).map(([typ, cfg]) => (
            <span key={typ} className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs border rounded-sm ${cfg.farbe}`}>
              {cfg.icon} {typ}
            </span>
          ))}
        </div>
      </section>

      {/* Termine */}
      <section className="max-w-7xl mx-auto px-6 pb-24 space-y-16">
        {grouped.map(({ monat, termine: monatsTermine }) => (
          <div key={monat}>
            <h2 className="font-display text-3xl tracking-wider text-cream/40 mb-6 uppercase">
              {monat}
            </h2>
            <div className="space-y-3">
              {monatsTermine.map((t) => {
                const cfg = typConfig[t.typ]
                const voll = t.belegt >= t.plaetze
                return (
                  <div
                    key={t.id}
                    className={`bg-card border border-border p-6 flex flex-col lg:flex-row lg:items-center gap-6 ${voll ? 'opacity-60' : ''}`}
                  >
                    {/* Datum */}
                    <div className="lg:w-48 flex-shrink-0">
                      <p className="text-cream font-medium text-sm">{t.datum}</p>
                      <p className="text-muted text-xs mt-0.5">{t.uhrzeit} Uhr · {t.dauer}</p>
                    </div>

                    {/* Kurs */}
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs border rounded-sm ${cfg.farbe}`}>
                          {cfg.icon} {t.typ}
                        </span>
                        <span className="text-xs text-muted border border-border px-2 py-0.5 rounded-sm">
                          {t.level}
                        </span>
                      </div>
                      <p className="text-cream font-medium">{t.kurs}</p>
                      <p className="text-muted text-xs mt-0.5">📍 {t.ort}</p>
                    </div>

                    {/* Auslastung */}
                    <div className="lg:w-48 flex-shrink-0">
                      <Auslastung belegt={t.belegt} plaetze={t.plaetze} />
                    </div>

                    {/* CTA */}
                    <div className="flex-shrink-0">
                      {voll ? (
                        <span className="text-xs text-muted border border-border px-4 py-2 block text-center">
                          Ausgebucht
                        </span>
                      ) : (
                        <Link href="/buchen" className="btn-primary text-xs py-2 px-4">
                          Anmelden →
                        </Link>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </section>

      {/* CTA */}
      <section className="bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="font-display text-5xl tracking-wider text-cream mb-4">
            KEIN PASSENDER TERMIN?
          </h2>
          <p className="text-muted mb-8">
            Marcus bietet auch Einzeltraining mit flexiblen Terminen an — meld dich einfach.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/buchen" className="btn-primary">Anfrage senden</Link>
            <Link href="/kontakt" className="btn-outline">Kontakt</Link>
          </div>
        </div>
      </section>
    </>
  )
}
