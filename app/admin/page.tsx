'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Hund = {
  id: string
  name: string
  rasse: string
  hund_alter: string
  besitzer_name: string
  besitzer_email: string
  bericht_anzahl: number
}

type AnfrageCount = { count: number }

type NaechsterTermin = {
  id: string
  kurs: string
  typ: string
  datum: string
  uhrzeit: string
  ort: string
  belegt: number
  plaetze: number
  quelle?: 'kurs' | 'buchung'
  kurs_typ?: string
}

const tagKurz = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
const monKurz = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']

const typFarbe: Record<string, string> = {
  Hundeschule:    'border-rust/40 text-rust',
  Einzeltraining: 'border-amber-700/40 text-amber-400',
  'Social Walk':  'border-emerald-700/40 text-emerald-400',
  Mantrailing:    'border-blue-700/40 text-blue-400',
}

export default function AdminPage() {
  const [hunde, setHunde] = useState<Hund[]>([])
  const [termine, setTermine] = useState<NaechsterTermin[]>([])
  const [zeitraum, setZeitraum] = useState<7 | 14 | 30>(7)
  const [neueAnfragen, setNeueAnfragen] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const heute = new Date()
      const bisDate = new Date(heute)
      bisDate.setDate(heute.getDate() + 30)

      const heuteIso = heute.toISOString().split('T')[0]
      const bisIso = bisDate.toISOString().split('T')[0]

      const [{ data }, { data: termineData }, { count: anfragenCount }, { data: bestaetigteAnfragen }] = await Promise.all([
        supabase.from('hunde').select('id, name, rasse, hund_alter, besitzer_name, besitzer_email').order('name'),
        supabase.from('termine')
          .select('id, kurs, typ, datum, uhrzeit, ort, belegt, plaetze')
          .gte('datum', heuteIso)
          .lte('datum', bisIso)
          .order('datum', { ascending: true })
          .order('uhrzeit', { ascending: true }),
        supabase.from('buchungsanfragen').select('*', { count: 'exact', head: true }).eq('status', 'neu'),
        supabase.from('buchungsanfragen')
          .select('id, vorname, nachname, wunsch_datum, wunsch_uhrzeit, kurs_typ')
          .eq('status', 'bestaetigt')
          .gte('wunsch_datum', heuteIso)
          .lte('wunsch_datum', bisIso)
          .order('wunsch_datum', { ascending: true })
          .order('wunsch_uhrzeit', { ascending: true }),
      ])

      if (data) {
        const hundeWithCount = await Promise.all(
          data.map(async (h) => {
            const { count } = await supabase
              .from('verhaltensberichte')
              .select('*', { count: 'exact', head: true })
              .eq('hund_id', h.id)
            return { ...h, bericht_anzahl: count ?? 0 }
          })
        )
        setHunde(hundeWithCount)
      }

      // Bestätigte Buchungsanfragen als Kalendereinträge
      const buchungsEintraege: NaechsterTermin[] = (bestaetigteAnfragen ?? [])
        .filter(a => a.wunsch_datum && a.wunsch_uhrzeit)
        .map(a => ({
          id: a.id,
          kurs: `${a.vorname} ${a.nachname}`,
          typ: 'Einzeltraining',
          datum: a.wunsch_datum,
          uhrzeit: a.wunsch_uhrzeit,
          ort: '—',
          belegt: 1,
          plaetze: 1,
          quelle: 'buchung' as const,
          kurs_typ: a.kurs_typ ?? '',
        }))

      const alleTermine = [...(termineData ?? []).map(t => ({ ...t, quelle: 'kurs' as const })), ...buchungsEintraege]
        .sort((a, b) => a.datum.localeCompare(b.datum) || a.uhrzeit.localeCompare(b.uhrzeit))

      setTermine(alleTermine)
      setNeueAnfragen(anfragenCount ?? 0)
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-16"><p className="text-muted">Lade...</p></div>

  return (
    <div className="min-h-screen pt-32 pb-24 max-w-5xl mx-auto px-6">
      <div className="mb-10">
        <p className="section-label mb-2">Admin</p>
        <div className="divider mb-4" />
        <h1 className="font-display text-6xl tracking-wider text-cream">
          MARCUS<br /><span className="text-rust">DASHBOARD</span>
        </h1>
      </div>

      {/* Kalender */}
      <div className="mb-10">
        {/* Header + Toggle */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl tracking-wider text-cream">
            TERMINE NÄCHSTE {zeitraum} TAGE
          </h2>
          <div className="flex items-center gap-1">
            {([7, 14, 30] as const).map(z => (
              <button key={z} onClick={() => setZeitraum(z)}
                className={`text-xs px-3 py-1.5 border transition-colors ${zeitraum === z ? 'border-rust bg-rust/10 text-rust' : 'border-border text-muted hover:border-rust/50 hover:text-cream'}`}>
                {z}T
              </button>
            ))}
            <Link href="/admin/termine" className="text-xs px-3 py-1.5 border border-border text-muted hover:border-rust/50 hover:text-cream transition-colors ml-1">
              Alle →
            </Link>
          </div>
        </div>

        {/* Tages-Kacheln */}
        {(() => {
          const heute = new Date().toISOString().split('T')[0]
          const tage = Array.from({ length: zeitraum }).map((_, i) => {
            const d = new Date()
            d.setDate(d.getDate() + i)
            const iso = d.toISOString().split('T')[0]
            const tagesTermine = termine.filter(t => t.datum === iso)
            return { d, iso, tagesTermine }
          })

          const cols = zeitraum === 7 ? 7 : zeitraum === 14 ? 7 : 6
          return (
            <div className={`grid gap-1.5`} style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}>
              {Array.from({ length: zeitraum }).map((_, i) => {
                const d = new Date()
                d.setDate(d.getDate() + i)
                const iso = d.toISOString().split('T')[0]
                const tagesTermine = termine.filter(t => t.datum === iso)
                const istHeute = iso === heute
                return (
                  <div key={i} className={`border p-1.5 flex flex-col ${istHeute ? 'border-rust bg-rust/10' : tagesTermine.length > 0 ? 'border-border bg-surface' : 'border-border/30'}`}
                    style={{ minHeight: zeitraum === 7 ? '100px' : '80px' }}>
                    <div className="text-center mb-1">
                      <p className={`text-xs font-semibold ${istHeute ? 'text-rust' : 'text-muted'}`}>{tagKurz[d.getDay()]}</p>
                      <p className={`font-display leading-tight ${zeitraum === 7 ? 'text-lg' : 'text-base'} ${istHeute ? 'text-rust' : 'text-cream'}`}>{d.getDate()}.</p>
                      <p className="text-xs text-muted">{monKurz[d.getMonth()]}</p>
                    </div>
                    <div className="space-y-0.5 flex-1">
                      {tagesTermine.map(t => (
                        <Link
                          key={t.id}
                          href={t.quelle === 'buchung' ? '/admin/anfragen' : '/admin/termine'}
                          className={`block px-1 py-0.5 border truncate hover:opacity-80 transition-opacity ${
                            t.quelle === 'buchung'
                              ? 'border-amber-700/50 text-amber-400 bg-amber-900/10'
                              : typFarbe[t.typ] ?? typFarbe['Hundeschule']
                          }`}
                          style={{ fontSize: zeitraum === 7 ? '11px' : '10px' }}>
                          <span className="font-medium">{t.uhrzeit}{t.kurs_typ === 'Ersttermin' ? `–${String(parseInt(t.uhrzeit) + 2).padStart(2, '0')}:00` : ''}</span> {t.kurs}
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )
        })()}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="bg-card border border-border p-6">
          <p className="section-label mb-1">Kunden</p>
          <p className="font-display text-5xl text-cream">{hunde.length}</p>
        </div>
        <div className="bg-card border border-border p-6">
          <p className="section-label mb-1">Berichte total</p>
          <p className="font-display text-5xl text-cream">
            {hunde.reduce((sum, h) => sum + h.bericht_anzahl, 0)}
          </p>
        </div>
      </div>

      {/* Schnellzugriff */}
      <div className="mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link href="/admin/sprachbericht" className="block bg-rust border border-rust hover:bg-rust/90 transition-colors p-5 sm:col-span-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-cream/80 text-xs font-semibold tracking-widest uppercase mb-1">Neu</p>
                <h3 className="font-display text-2xl tracking-wider text-cream">🎙 SPRACHBERICHT</h3>
                <p className="text-cream/70 text-xs mt-1">Trainingsbericht per Mikrofon aufnehmen → KI strukturiert → direkt im Kundenportal</p>
              </div>
              <span className="text-cream text-xl">→</span>
            </div>
          </Link>
          <Link href="/admin/termine" className="block bg-card border border-border hover:border-rust/50 transition-colors p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="section-label mb-1">Kurskalender</p>
                <h3 className="font-display text-2xl tracking-wider text-cream">TERMINE</h3>
              </div>
              <span className="text-rust text-xl">→</span>
            </div>
          </Link>
          <Link href="/admin/stories" className="block bg-card border border-border hover:border-rust/50 transition-colors p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="section-label mb-1">Vorher & Nachher</p>
                <h3 className="font-display text-2xl tracking-wider text-cream">STORIES</h3>
              </div>
              <span className="text-rust text-xl">→</span>
            </div>
          </Link>
          <Link href="/admin/lernvideos" className="block bg-card border border-border hover:border-rust/50 transition-colors p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="section-label mb-1">Videobibliothek</p>
                <h3 className="font-display text-2xl tracking-wider text-cream">LERNVIDEOS</h3>
              </div>
              <span className="text-rust text-xl">→</span>
            </div>
          </Link>
          <Link href="/admin/kunden" className="block bg-card border border-border hover:border-rust/50 transition-colors p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="section-label mb-1">Kontaktdaten</p>
                <h3 className="font-display text-2xl tracking-wider text-cream">KUNDEN</h3>
              </div>
              <span className="text-rust text-xl">→</span>
            </div>
          </Link>
          <Link href="/admin/anfragen" className="block bg-card border border-border hover:border-rust/50 transition-colors p-5 relative">
            <div className="flex items-center justify-between">
              <div>
                <p className="section-label mb-1">Buchungsformular</p>
                <h3 className="font-display text-2xl tracking-wider text-cream">ANFRAGEN</h3>
              </div>
              <div className="flex items-center gap-2">
                {neueAnfragen > 0 && (
                  <span className="bg-amber-500 text-ink text-xs font-bold px-2 py-0.5 rounded-full">{neueAnfragen}</span>
                )}
                <span className="text-rust text-xl">→</span>
              </div>
            </div>
          </Link>
          <Link href="/admin/tipps" className="block bg-card border border-border hover:border-rust/50 transition-colors p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="section-label mb-1">Tipps & Tricks</p>
                <h3 className="font-display text-2xl tracking-wider text-cream">TIPPS</h3>
              </div>
              <span className="text-rust text-xl">→</span>
            </div>
          </Link>
        </div>
      </div>

      {/* Hundeliste */}
      <h2 className="font-display text-3xl tracking-wider text-cream mb-4">ALLE HUNDE</h2>
      {hunde.length === 0 ? (
        <div className="bg-card border border-border p-8 text-center">
          <p className="text-muted">Noch keine Kunden registriert.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {hunde.map((h) => (
            <div key={h.id} className="bg-card border border-border p-6 flex items-center justify-between gap-4">
              <div>
                <h3 className="font-display text-2xl tracking-wider text-cream">{h.name.toUpperCase()}</h3>
                <p className="text-muted text-sm">{h.rasse} · {h.hund_alter}</p>
                <p className="text-muted text-xs mt-0.5">{h.besitzer_name} · {h.besitzer_email}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-muted border border-border px-3 py-1">
                  {h.bericht_anzahl} {h.bericht_anzahl === 1 ? 'Bericht' : 'Berichte'}
                </span>
                <Link
                  href={`/admin/bericht/neu?hund_id=${h.id}&hund_name=${h.name}`}
                  className="btn-primary text-xs py-2 px-4"
                >
                  + Bericht
                </Link>
                <Link
                  href={`/admin/hunde/${h.id}`}
                  className="btn-outline text-xs py-2 px-4"
                >
                  Ansehen →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
