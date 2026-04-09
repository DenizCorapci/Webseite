'use client'
export const dynamic = 'force-dynamic'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type Hund = {
  id: string
  name: string
  rasse: string
  hund_alter: string
  geschlecht: string
  foto_url: string | null
}

type Bericht = {
  id: string
  titel: string
  datum: string
  phase: string
  zusammenfassung: string
}

type MeinTermin = {
  id: string
  kurs: string
  typ: string
  datum: string
  uhrzeit: string
  dauer: string
  ort: string
  level: string
  plaetze: number
  belegt: number
}

type Profil = {
  vorname: string
  nachname: string
}

export default function PortalPage() {
  const { user } = useUser()
  const router = useRouter()
  const [hund, setHund] = useState<Hund | null>(null)
  const [berichte, setBerichte] = useState<Bericht[]>([])
  const [profil, setProfil] = useState<Profil | null>(null)
  const [meineTermine, setMeineTermine] = useState<MeinTermin[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    async function load() {
      const [{ data: hundData }, { data: profilData }] = await Promise.all([
        supabase.from('hunde').select('*').eq('clerk_user_id', user!.id).single(),
        supabase.from('kunden_profile').select('vorname, nachname').eq('clerk_user_id', user!.id).single(),
      ])

      // Kein Profil vorhanden → zuerst Profil erfassen
      if (!profilData || !profilData.vorname) {
        router.push('/portal/profil')
        return
      }

      setProfil(profilData)
      setHund(hundData)

      if (hundData) {
        const { data: berichteData } = await supabase
          .from('verhaltensberichte')
          .select('id, titel, datum, phase, zusammenfassung')
          .eq('hund_id', hundData.id)
          .order('datum', { ascending: false })
        setBerichte(berichteData ?? [])
      }

      // Meine Termin-Anmeldungen
      const { data: anmeldungen } = await supabase
        .from('termin_anmeldungen')
        .select('termin_id')
        .eq('clerk_user_id', user!.id)

      if (anmeldungen && anmeldungen.length > 0) {
        const terminIds = anmeldungen.map(a => a.termin_id)
        const heute = new Date().toISOString().split('T')[0]
        const { data: termineData } = await supabase
          .from('termine')
          .select('id, kurs, typ, datum, uhrzeit, dauer, ort, level, plaetze, belegt')
          .in('id', terminIds)
          .gte('datum', heute)
          .order('datum', { ascending: true })
        setMeineTermine(termineData ?? [])
      }

      setLoading(false)
    }
    load()
  }, [user, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <p className="text-muted">Lade...</p>
      </div>
    )
  }

  // Vorname: aus Profil, sonst Clerk
  const vorname = profil?.vorname || user?.firstName || 'WILLKOMMEN'

  return (
    <div className="min-h-screen pt-32 pb-24 max-w-4xl mx-auto px-6">
      <div className="mb-10">
        <div className="flex items-start justify-between gap-4 mb-6">
          <h1 className="font-display text-7xl md:text-8xl tracking-wider text-cream">
            KUNDENPORTAL
          </h1>
          <Link href="/portal/profil" className="btn-outline text-xs py-2 px-4 flex-shrink-0 mt-4">
            Mein Profil
          </Link>
        </div>
        <div className="divider mb-4" />
        <p className="text-muted text-lg">Hallo, {vorname} 👋</p>
      </div>

      {!hund ? (
        <div className="bg-card border border-border p-8 text-center">
          <p className="text-4xl mb-4">🐕</p>
          <h2 className="font-display text-3xl tracking-wider text-cream mb-2">NOCH KEIN PROFIL</h2>
          <p className="text-muted text-sm mb-6">Erstelle jetzt das Profil deines Hundes.</p>
          <Link href="/portal/hund/neu" className="btn-primary">
            Hundeprofil erstellen →
          </Link>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Hundeprofil */}
          <div className="bg-card border border-border p-6 flex items-center gap-6">
            <div className="w-20 h-20 bg-surface border border-border flex items-center justify-center flex-shrink-0 overflow-hidden">
              {hund.foto_url ? (
                <img src={hund.foto_url} alt={hund.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-3xl">🐕</span>
              )}
            </div>
            <div className="flex-1">
              <p className="section-label mb-1">Mein Hund</p>
              <h2 className="font-display text-4xl tracking-wider text-cream">{hund.name.toUpperCase()}</h2>
              <p className="text-muted text-sm">{hund.rasse} · {hund.hund_alter} · {hund.geschlecht}</p>
            </div>
            <Link href="/portal/hund/bearbeiten" className="btn-outline text-xs py-2 px-4">
              Bearbeiten
            </Link>
          </div>

          {/* KI-Chat Banner */}
          <Link
            href="/portal/chat"
            className="block bg-rust/10 border border-rust/40 hover:border-rust hover:bg-rust/20 transition-all p-6 group"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-4xl">🐾</span>
                <div>
                  <p className="font-display text-4xl tracking-wider text-cream leading-tight">
                    CHATTE MIT MIR
                  </p>
                  <p className="text-cream font-semibold text-base mt-1 leading-relaxed">
                    Alle fundierten Informationen rund um den Hund,<br />exklusiv bei Bad Dog Hundeschule.
                  </p>
                  <p className="text-rust text-sm mt-2 font-medium">Probiere es aus! →</p>
                </div>
              </div>
              <span className="text-rust text-4xl flex-shrink-0 group-hover:translate-x-2 transition-transform">→</span>
            </div>
          </Link>

          {/* Meine Termine */}
          <div>
            <h3 className="font-display text-2xl tracking-wider text-cream mb-4">MEINE TERMINE</h3>
            {meineTermine.length === 0 ? (
              <div className="bg-card border border-border p-6 flex items-center justify-between gap-4">
                <p className="text-muted text-sm">Noch keine Termine gebucht.</p>
                <a href="/termine" className="btn-outline text-xs py-2 px-4 flex-shrink-0">Termine ansehen →</a>
              </div>
            ) : (
              <div className="space-y-3">
                {meineTermine.map(t => {
                  const frei = t.plaetze - t.belegt
                  const datum = new Date(t.datum)
                  const tage = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa']
                  const monate = ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember']
                  const datumStr = `${tage[datum.getDay()]}, ${String(datum.getDate()).padStart(2, '0')}. ${monate[datum.getMonth()]} ${datum.getFullYear()}`
                  return (
                    <div key={t.id} className="bg-card border border-border p-5">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-xs border border-rust/30 text-rust px-2 py-0.5">{t.typ}</span>
                            <span className="text-xs border border-border text-muted px-2 py-0.5">{t.level}</span>
                            <span className="text-xs border border-emerald-700/50 text-emerald-400 px-2 py-0.5">✓ Angemeldet</span>
                          </div>
                          <p className="text-cream font-medium">{t.kurs}</p>
                          <div className="mt-2 space-y-0.5">
                            <p className="text-muted text-xs">📅 {datumStr} · {t.uhrzeit} Uhr · {t.dauer}</p>
                            <p className="text-muted text-xs">📍 {t.ort}</p>
                            <p className="text-muted text-xs">👥 {t.belegt}/{t.plaetze} Plätze belegt · {frei} frei</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <a href="/termine" className="block text-center text-xs text-muted hover:text-rust transition-colors pt-1">
                  Weitere Termine ansehen →
                </a>
              </div>
            )}
          </div>

          {/* Verhaltensberichte */}
          <div>
            <h3 className="font-display text-2xl tracking-wider text-cream mb-4">VERHALTENSBERICHTE</h3>
            {berichte.length === 0 ? (
              <div className="bg-card border border-border p-6 text-center">
                <p className="text-muted text-sm">Noch kein Bericht vorhanden. Marcus erstellt deinen ersten Bericht nach der Einheit.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {berichte.map((b) => (
                  <Link
                    key={b.id}
                    href={`/portal/bericht/${b.id}`}
                    className="block bg-card border border-border hover:border-rust/50 transition-colors p-6"
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs border border-rust/30 text-rust px-2 py-0.5">{b.phase}</span>
                          <span className="text-xs text-muted">{new Date(b.datum).toLocaleDateString('de-CH')}</span>
                        </div>
                        <h4 className="text-cream font-medium">{b.titel}</h4>
                        <p className="text-muted text-xs mt-1 line-clamp-2">{b.zusammenfassung}</p>
                      </div>
                      <span className="text-rust text-xl flex-shrink-0">→</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
