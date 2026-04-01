'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Bericht = {
  id: string
  titel: string
  datum: string
  phase: string
  zusammenfassung: string
  anamnese: string
  verhaltensanalyse: string
  therapieplan: string
  naechste_schritte: string
  medien: { url: string; typ: 'foto' | 'video'; beschriftung: string }[]
}

export default function BerichtDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  const [bericht, setBericht] = useState<Bericht | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('verhaltensberichte')
        .select('*, bericht_medien(*)')
        .eq('id', id)
        .single()
      if (data) {
        setBericht({ ...data, medien: data.bericht_medien ?? [] })
      }
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-16"><p className="text-muted">Lade...</p></div>
  if (!bericht) return <div className="min-h-screen flex items-center justify-center pt-16"><p className="text-muted">Bericht nicht gefunden.</p></div>

  const abschnitte = [
    { label: 'Anamnese', inhalt: bericht.anamnese },
    { label: 'Verhaltensanalyse', inhalt: bericht.verhaltensanalyse },
    { label: 'Therapieplan', inhalt: bericht.therapieplan },
    { label: 'Nächste Schritte', inhalt: bericht.naechste_schritte },
  ]

  return (
    <div className="min-h-screen pt-32 pb-24 max-w-3xl mx-auto px-6">
      <Link href="/portal" className="text-xs text-muted hover:text-rust transition-colors mb-8 inline-block">
        ← Zurück zum Portal
      </Link>

      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="text-xs border border-rust/30 text-rust px-2 py-0.5">{bericht.phase}</span>
          <span className="text-xs text-muted">{new Date(bericht.datum).toLocaleDateString('de-CH')}</span>
        </div>
        <h1 className="font-display text-5xl tracking-wider text-cream">{bericht.titel.toUpperCase()}</h1>
        <p className="mt-3 text-cream/60 leading-relaxed">{bericht.zusammenfassung}</p>
      </div>

      <div className="space-y-8">
        {abschnitte.map(({ label, inhalt }) => inhalt && (
          <div key={label} className="bg-card border border-border p-6">
            <p className="section-label mb-3">{label}</p>
            <p className="text-cream/70 text-sm leading-relaxed whitespace-pre-line">{inhalt}</p>
          </div>
        ))}

        {bericht.medien.length > 0 && (
          <div>
            <h3 className="font-display text-2xl tracking-wider text-cream mb-4">FOTOS & VIDEOS</h3>
            <div className="grid grid-cols-2 gap-3">
              {bericht.medien.map((m, i) => (
                <div key={i} className="bg-card border border-border overflow-hidden">
                  {m.typ === 'foto' ? (
                    <img src={m.url} alt={m.beschriftung} className="w-full aspect-square object-cover" />
                  ) : (
                    <video src={m.url} controls className="w-full aspect-video" />
                  )}
                  {m.beschriftung && (
                    <p className="text-xs text-muted px-3 py-2">{m.beschriftung}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
