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
  geschlecht: string
  kastration: string
  besonderheiten: string
  besitzer_name: string
  besitzer_email: string
  foto_url: string | null
}

type Bericht = {
  id: string
  titel: string
  datum: string
  phase: string
  zusammenfassung: string
}

export default function AdminHundDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [hund, setHund] = useState<Hund | null>(null)
  const [berichte, setBerichte] = useState<Bericht[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: hundData } = await supabase
        .from('hunde')
        .select('*')
        .eq('id', id)
        .single()
      setHund(hundData)

      const { data: berichteData } = await supabase
        .from('verhaltensberichte')
        .select('id, titel, datum, phase, zusammenfassung')
        .eq('hund_id', id)
        .order('datum', { ascending: false })
      setBerichte(berichteData ?? [])
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-16"><p className="text-muted">Lade...</p></div>
  if (!hund) return <div className="min-h-screen flex items-center justify-center pt-16"><p className="text-muted">Hund nicht gefunden.</p></div>

  return (
    <div className="min-h-screen pt-32 pb-24 max-w-4xl mx-auto px-6">
      <Link href="/admin" className="text-xs text-muted hover:text-rust transition-colors mb-8 inline-block">
        ← Zurück zum Dashboard
      </Link>

      {/* Hundeprofil */}
      <div className="bg-card border border-border p-6 flex items-center gap-6 mb-10">
        <div className="w-24 h-24 bg-surface border border-border flex items-center justify-center flex-shrink-0 overflow-hidden">
          {hund.foto_url ? (
            <img src={hund.foto_url} alt={hund.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl">🐕</span>
          )}
        </div>
        <div className="flex-1">
          <p className="section-label mb-1">Hundeprofil</p>
          <h1 className="font-display text-5xl tracking-wider text-cream">{hund.name.toUpperCase()}</h1>
          <p className="text-muted text-sm mt-1">{hund.rasse} · {hund.hund_alter} · {hund.geschlecht} · {hund.kastration}</p>
          <p className="text-muted text-xs mt-1">👤 {hund.besitzer_name} · {hund.besitzer_email}</p>
          {hund.besonderheiten && (
            <p className="text-cream/50 text-xs mt-2 max-w-lg">{hund.besonderheiten}</p>
          )}
        </div>
        <Link
          href={`/admin/bericht/neu?hund_id=${hund.id}&hund_name=${hund.name}`}
          className="btn-primary text-xs py-2 px-4 flex-shrink-0"
        >
          + Neuer Bericht
        </Link>
      </div>

      {/* Verhaltensberichte */}
      <h2 className="font-display text-3xl tracking-wider text-cream mb-4">VERHALTENSBERICHTE</h2>
      {berichte.length === 0 ? (
        <div className="bg-card border border-border p-8 text-center">
          <p className="text-muted">Noch kein Bericht vorhanden.</p>
          <Link
            href={`/admin/bericht/neu?hund_id=${hund.id}&hund_name=${hund.name}`}
            className="btn-primary inline-flex mt-4"
          >
            Ersten Bericht erstellen →
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {berichte.map((b) => (
            <Link
              key={b.id}
              href={`/admin/bericht/${b.id}`}
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
  )
}
