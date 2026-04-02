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
      <div className="mb-10 flex items-start justify-between gap-4">
        <div>
          <p className="section-label mb-2">Kundenportal</p>
          <div className="divider mb-4" />
          <h1 className="font-display text-6xl tracking-wider text-cream">
            HALLO, {vorname.toUpperCase()}
          </h1>
        </div>
        <Link href="/portal/profil" className="btn-outline text-xs py-2 px-4 flex-shrink-0 mt-8">
          Mein Profil
        </Link>
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
