'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Anfrage = {
  id: string
  vorname: string
  nachname: string
  email: string
  telefon: string
  hund_name: string
  hund_rasse: string
  hund_alter: string
  nachricht: string
  status: string
  created_at: string
  termin_id: string | null
  termin_kurs: string | null
  termin_datum: string | null
  wunsch_datum: string | null
  wunsch_uhrzeit: string | null
}

const statusFarbe: Record<string, string> = {
  neu:         'border-amber-700/50 text-amber-400 bg-amber-900/10',
  bestaetigt:  'border-emerald-700/50 text-emerald-400 bg-emerald-900/10',
  abgesagt:    'border-red-800/50 text-red-400 bg-red-900/10',
}

export default function AdminAnfragenPage() {
  const [anfragen, setAnfragen] = useState<Anfrage[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'alle' | 'neu' | 'bestaetigt' | 'abgesagt'>('alle')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  async function load() {
    const { data } = await supabase
      .from('buchungsanfragen')
      .select('id, vorname, nachname, email, telefon, hund_name, hund_rasse, hund_alter, nachricht, status, created_at, termin_id, wunsch_datum, wunsch_uhrzeit')
      .order('created_at', { ascending: false })

    if (!data) { setLoading(false); return }

    // Termin-Details nachladen
    const terminIds = Array.from(new Set(data.filter(a => a.termin_id).map(a => a.termin_id)))
    let termineMap = new Map<string, { kurs: string; datum: string }>()
    if (terminIds.length > 0) {
      const { data: termData } = await supabase
        .from('termine')
        .select('id, kurs, datum')
        .in('id', terminIds)
      termineMap = new Map(termData?.map(t => [t.id, { kurs: t.kurs, datum: t.datum }]) ?? [])
    }

    setAnfragen(data.map(a => ({
      ...a,
      termin_kurs: a.termin_id ? (termineMap.get(a.termin_id)?.kurs ?? null) : null,
      termin_datum: a.termin_id ? (termineMap.get(a.termin_id)?.datum ?? null) : null,
      wunsch_datum: a.wunsch_datum ?? null,
      wunsch_uhrzeit: a.wunsch_uhrzeit ?? null,
    })))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleStatus(id: string, status: string) {
    await supabase.from('buchungsanfragen').update({ status }).eq('id', id)
    setAnfragen(prev => prev.map(a => a.id === id ? { ...a, status } : a))
  }

  async function handleDelete(id: string) {
    if (!confirm('Anfrage wirklich löschen?')) return
    await supabase.from('buchungsanfragen').delete().eq('id', id)
    setAnfragen(prev => prev.filter(a => a.id !== id))
  }

  const gefiltert = anfragen.filter(a => filter === 'alle' || a.status === filter)
  const anzahlNeu = anfragen.filter(a => a.status === 'neu').length

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-16"><p className="text-muted">Lade...</p></div>

  return (
    <div className="min-h-screen pt-32 pb-24 max-w-4xl mx-auto px-6">
      <Link href="/admin" className="text-xs text-muted hover:text-rust transition-colors mb-8 inline-block">← Zurück zum Dashboard</Link>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-5xl tracking-wider text-cream">ANFRAGEN</h1>
          {anzahlNeu > 0 && (
            <p className="text-amber-400 text-sm mt-1">● {anzahlNeu} neue Anfrage{anzahlNeu !== 1 ? 'n' : ''}</p>
          )}
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-1 mb-6">
        {(['alle', 'neu', 'bestaetigt', 'abgesagt'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`text-xs px-4 py-2 border transition-colors capitalize ${filter === f ? 'border-rust bg-rust/10 text-rust' : 'border-border text-muted hover:border-rust/50 hover:text-cream'}`}>
            {f === 'alle' ? `Alle (${anfragen.length})` :
             f === 'neu' ? `Neu (${anfragen.filter(a => a.status === 'neu').length})` :
             f === 'bestaetigt' ? `Bestätigt (${anfragen.filter(a => a.status === 'bestaetigt').length})` :
             `Abgesagt (${anfragen.filter(a => a.status === 'abgesagt').length})`}
          </button>
        ))}
      </div>

      {gefiltert.length === 0 ? (
        <div className="bg-card border border-border p-8 text-center">
          <p className="text-muted">Keine Anfragen vorhanden.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {gefiltert.map(a => (
            <div key={a.id} className="border border-border overflow-hidden">
              {/* Kopfzeile */}
              <div
                className="bg-card p-4 flex items-center gap-4 cursor-pointer hover:bg-surface transition-colors"
                onClick={() => setExpandedId(expandedId === a.id ? null : a.id)}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 border rounded-sm ${statusFarbe[a.status] ?? statusFarbe['neu']}`}>
                      {a.status === 'neu' ? 'Neu' : a.status === 'bestaetigt' ? 'Bestätigt' : 'Abgesagt'}
                    </span>
                    {a.wunsch_datum && (
                      <span className="text-xs border border-rust/40 text-rust px-2 py-0.5 font-medium">
                        📅 {new Date(a.wunsch_datum).toLocaleDateString('de-CH', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })}
                        {a.wunsch_uhrzeit ? ` · ${a.wunsch_uhrzeit} Uhr` : ''}
                      </span>
                    )}
                    {a.termin_kurs && (
                      <span className="text-xs border border-border text-muted px-2 py-0.5 rounded-sm truncate max-w-[200px]">
                        {a.termin_kurs}{a.termin_datum ? ` · ${new Date(a.termin_datum).toLocaleDateString('de-CH')}` : ''}
                      </span>
                    )}
                    <span className="text-xs text-muted">
                      {new Date(a.created_at).toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-cream font-medium">{a.vorname} {a.nachname}</p>
                  <p className="text-muted text-xs">{a.email} · {a.telefon || '—'}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-muted">{expandedId === a.id ? '▲' : '▼'}</span>
                </div>
              </div>

              {/* Details */}
              {expandedId === a.id && (
                <div className="bg-surface border-t border-border p-5 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-2">Kontakt</p>
                      <p className="text-cream text-sm">{a.vorname} {a.nachname}</p>
                      <p className="text-muted text-xs mt-0.5">{a.email}</p>
                      <p className="text-muted text-xs">{a.telefon || '—'}</p>
                      {a.telefon && (
                        <a href={`https://wa.me/${a.telefon.replace(/\s+/g, '').replace('+', '')}`}
                          target="_blank" rel="noopener noreferrer"
                          className="inline-block mt-2 text-xs border border-emerald-700/50 text-emerald-400 px-3 py-1 hover:bg-emerald-900/20 transition-colors">
                          WhatsApp →
                        </a>
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-2">Hund</p>
                      <p className="text-cream text-sm">{a.hund_name || '—'}</p>
                      <p className="text-muted text-xs mt-0.5">{a.hund_rasse || '—'} · {a.hund_alter || '—'}</p>
                    </div>
                  </div>
                  {a.nachricht && (
                    <div>
                      <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-2">Nachricht</p>
                      <p className="text-cream text-sm whitespace-pre-wrap">{a.nachricht}</p>
                    </div>
                  )}

                  {/* Aktionen */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                    <p className="text-xs font-semibold tracking-widest uppercase text-muted self-center mr-2">Status:</p>
                    {['neu', 'bestaetigt', 'abgesagt'].map(s => (
                      <button key={s} onClick={() => handleStatus(a.id, s)}
                        className={`text-xs px-3 py-1.5 border transition-colors ${a.status === s ? statusFarbe[s] : 'border-border text-muted hover:border-rust/50'}`}>
                        {s === 'neu' ? 'Neu' : s === 'bestaetigt' ? '✓ Bestätigen' : '✗ Absagen'}
                      </button>
                    ))}
                    <button onClick={() => handleDelete(a.id)}
                      className="text-xs border border-red-800/50 text-red-400 hover:border-red-600 px-3 py-1.5 transition-colors ml-auto">
                      Löschen
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
