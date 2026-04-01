'use client'
export const dynamic = 'force-dynamic'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

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

export default function PortalPage() {
  const { user } = useUser()
  const [hund, setHund] = useState<Hund | null>(null)
  const [berichte, setBerichte] = useState<Bericht[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    async function load() {
      const { data: hundData } = await supabase
        .from('hunde')
        .select('*')
        .eq('clerk_user_id', user!.id)
        .single()
      setHund(hundData)

      if (hundData) {
        const { data: berichteData } = await supabase
          .from('verhaltensberichte')
          .select('id, titel, datum, phase, zusammenfassung')
          .eq('hund_id', hundData.id)
          .order('datum', { ascending: false })
        setBerichte(berichteData ?? [])
      }
      setLoading(false)
    }
    load()
  }, [user])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-16">
        <p className="text-muted">Lade...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-32 pb-24 max-w-4xl mx-auto px-6">
      <div className="mb-10">
        <p className="section-label mb-2">Kundenportal</p>
        <div className="divider mb-4" />
        <h1 className="font-display text-6xl tracking-wider text-cream">
          HALLO, {user?.firstName?.toUpperCase() ?? 'WILLKOMMEN'}
        </h1>
      </div>

      {!hund ? (
        /* Noch kein Hundeprofil */
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

          {/* KI-Berater */}
          <Link
            href="/portal/chat"
            className="block bg-card border border-rust/30 hover:border-rust transition-colors p-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-rust/20 border border-rust/40 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">🐾</span>
              </div>
              <div className="flex-1">
                <h3 className="font-display text-xl tracking-wider text-cream">KI-BERATER</h3>
                <p className="text-muted text-sm mt-0.5">Persönliche Trainingstipps für {hund.name} — basierend auf dem Verhaltensbericht</p>
              </div>
              <span className="text-rust text-xl flex-shrink-0">→</span>
            </div>
          </Link>

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
