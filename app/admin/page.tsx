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

export default function AdminPage() {
  const [hunde, setHunde] = useState<Hund[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from('hunde')
        .select('id, name, rasse, hund_alter, besitzer_name, besitzer_email')
        .order('name')

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
