'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Termin = {
  id: string
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

const typConfig: Record<string, { farbe: string; icon: string }> = {
  Hundeschule:    { farbe: 'bg-rust/20 text-rust border-rust/30',                       icon: '🐕' },
  Einzeltraining: { farbe: 'bg-amber-900/20 text-amber-400 border-amber-700/30',        icon: '🎯' },
  'Social Walk':  { farbe: 'bg-emerald-900/20 text-emerald-400 border-emerald-700/30',  icon: '🌿' },
  Mantrailing:    { farbe: 'bg-blue-900/20 text-blue-400 border-blue-700/30',           icon: '👃' },
}

function Auslastung({ belegt, plaetze }: { belegt: number; plaetze: number }) {
  const frei = plaetze - belegt
  const voll = belegt >= plaetze
  const fastVoll = frei <= 1 && !voll
  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {Array.from({ length: Math.min(plaetze, 10) }).map((_, i) => (
          <div key={i} className={`w-2 h-2 rounded-sm ${i < belegt ? 'bg-rust' : 'bg-cream/10'}`} />
        ))}
      </div>
      <span className={`text-xs font-medium ${voll ? 'text-red-400' : fastVoll ? 'text-amber-400' : 'text-emerald-400'}`}>
        {voll ? 'Ausgebucht' : `${frei} Platz${frei !== 1 ? 'ätze' : ''} frei`}
      </span>
    </div>
  )
}

function formatDatum(datum: string) {
  const d = new Date(datum)
  const tage = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
  const monate = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
  return `${tage[d.getDay()]}, ${String(d.getDate()).padStart(2, '0')}. ${monate[d.getMonth()]} ${d.getFullYear()}`
}

function getMonat(datum: string) {
  const d = new Date(datum)
  const monate = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
  return `${monate[d.getMonth()]} ${d.getFullYear()}`
}

export default function TerminePage() {
  const { user } = useUser()
  const [termine, setTermine] = useState<Termin[]>([])
  const [loading, setLoading] = useState(true)
  const [meineAnmeldungen, setMeineAnmeldungen] = useState<Set<string>>(new Set())
  const [busy, setBusy] = useState<string | null>(null)

  async function load() {
    const heute = new Date().toISOString().split('T')[0]
    const { data } = await supabase
      .from('termine')
      .select('*')
      .gte('datum', heute)
      .order('datum', { ascending: true })
    setTermine(data ?? [])

    if (user) {
      const { data: anmeldungen } = await supabase
        .from('termin_anmeldungen')
        .select('termin_id')
        .eq('clerk_user_id', user.id)
      setMeineAnmeldungen(new Set(anmeldungen?.map(a => a.termin_id) ?? []))
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [user])

  async function handleAnmelden(termin: Termin) {
    if (!user) return
    setBusy(termin.id)
    const bereitsAngemeldet = meineAnmeldungen.has(termin.id)
    if (bereitsAngemeldet) {
      await supabase.from('termin_anmeldungen').delete()
        .eq('termin_id', termin.id).eq('clerk_user_id', user.id)
      await supabase.from('termine').update({ belegt: Math.max(0, termin.belegt - 1) }).eq('id', termin.id)
    } else {
      await supabase.from('termin_anmeldungen').insert({ termin_id: termin.id, clerk_user_id: user.id })
      await supabase.from('termine').update({ belegt: termin.belegt + 1 }).eq('id', termin.id)
    }
    await load()
    setBusy(null)
  }

  const monateMap = new Map<string, Termin[]>()
  for (const t of termine) {
    const monat = getMonat(t.datum)
    if (!monateMap.has(monat)) monateMap.set(monat, [])
    monateMap.get(monat)!.push(t)
  }

  return (
    <>
      <section className="pt-32 pb-16 max-w-7xl mx-auto px-6">
        <p className="section-label mb-3">Kurskalender</p>
        <div className="divider mb-6" />
        <h1 className="font-display text-7xl sm:text-8xl tracking-wider text-cream">
          TERMINE<br /><span className="text-rust">2026</span>
        </h1>
        <p className="mt-6 text-cream/60 text-lg max-w-xl leading-relaxed">
          Alle verfügbaren Kurstermine auf einen Blick. Plätze sind begrenzt — frühzeitig anmelden lohnt sich.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          {Object.entries(typConfig).map(([typ, cfg]) => (
            <span key={typ} className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs border rounded-sm ${cfg.farbe}`}>
              {cfg.icon} {typ}
            </span>
          ))}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-24 space-y-16">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <p className="text-muted">Lade...</p>
          </div>
        ) : termine.length === 0 ? (
          <div className="bg-card border border-border p-12 text-center">
            <p className="text-muted">Aktuell keine Termine geplant. Meld dich bei Marcus für individuelle Termine.</p>
          </div>
        ) : (
          Array.from(monateMap.entries()).map(([monat, monatsTermine]) => (
            <div key={monat}>
              <h2 className="font-display text-3xl tracking-wider text-cream/40 mb-6 uppercase">{monat}</h2>
              <div className="space-y-3">
                {monatsTermine.map((t) => {
                  const cfg = typConfig[t.typ] ?? typConfig['Hundeschule']
                  const voll = t.belegt >= t.plaetze
                  const angemeldet = meineAnmeldungen.has(t.id)
                  const isBusy = busy === t.id
                  return (
                    <div key={t.id} className={`bg-card border border-border p-6 flex flex-col lg:flex-row lg:items-center gap-6 ${voll && !angemeldet ? 'opacity-60' : ''}`}>
                      <div className="lg:w-48 flex-shrink-0">
                        <p className="text-cream font-medium text-sm">{formatDatum(t.datum)}</p>
                        <p className="text-muted text-xs mt-0.5">{t.uhrzeit} Uhr · {t.dauer}</p>
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs border rounded-sm ${cfg.farbe}`}>
                            {cfg.icon} {t.typ}
                          </span>
                          <span className="text-xs text-muted border border-border px-2 py-0.5 rounded-sm">{t.level}</span>
                          {angemeldet && (
                            <span className="text-xs border border-emerald-700/50 text-emerald-400 px-2 py-0.5 rounded-sm">✓ Angemeldet</span>
                          )}
                        </div>
                        <p className="text-cream font-medium">{t.kurs}</p>
                        <p className="text-muted text-xs mt-0.5">📍 {t.ort}</p>
                      </div>
                      <div className="lg:w-48 flex-shrink-0">
                        <Auslastung belegt={t.belegt} plaetze={t.plaetze} />
                      </div>
                      <div className="flex-shrink-0">
                        {user ? (
                          angemeldet ? (
                            <button
                              onClick={() => handleAnmelden(t)}
                              disabled={isBusy}
                              className="text-xs border border-border text-muted hover:border-red-600 hover:text-red-400 px-4 py-2 transition-colors"
                            >
                              {isBusy ? '...' : 'Abmelden'}
                            </button>
                          ) : voll ? (
                            <span className="text-xs text-muted border border-border px-4 py-2 block text-center">Ausgebucht</span>
                          ) : (
                            <button
                              onClick={() => handleAnmelden(t)}
                              disabled={isBusy}
                              className="btn-primary text-xs py-2 px-4"
                            >
                              {isBusy ? '...' : 'Anmelden →'}
                            </button>
                          )
                        ) : (
                          voll ? (
                            <span className="text-xs text-muted border border-border px-4 py-2 block text-center">Ausgebucht</span>
                          ) : (
                            <Link
                              href={`/buchen?termin_id=${t.id}&kurs=${encodeURIComponent(t.kurs)}&datum=${t.datum}&uhrzeit=${encodeURIComponent(t.uhrzeit)}&ort=${encodeURIComponent(t.ort)}&typ=${encodeURIComponent(t.typ)}`}
                              className="btn-primary text-xs py-2 px-4"
                            >Anmelden →</Link>
                          )
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))
        )}
      </section>

      <section className="bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto px-6 py-16 text-center">
          <h2 className="font-display text-5xl tracking-wider text-cream mb-4">KEIN PASSENDER TERMIN?</h2>
          <p className="text-muted mb-8">Marcus bietet auch Einzeltraining mit flexiblen Terminen an — meld dich einfach.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/buchen" className="btn-primary">Anfrage senden</Link>
            <Link href="/kontakt" className="btn-outline">Kontakt</Link>
          </div>
        </div>
      </section>
    </>
  )
}
