'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Termin = {
  id: string
  kurs: string
  typ: string
  datum: string
  uhrzeit: string
  dauer: string
  plaetze: number
  belegt: number
  ort: string
  level: string
}

type Teilnehmer = {
  id: string
  clerk_user_id: string
  vorname: string
  nachname: string
  email: string
  telefon: string
  hund_name: string
  hund_rasse: string
  angemeldet_am: string
  quelle: 'portal' | 'anfrage'
  status?: string
}

const leer = {
  kurs: '', typ: 'Hundeschule', datum: '', uhrzeit: '09:00',
  dauer: '60 Min', plaetze: 6, belegt: 0, ort: '', level: 'Anfänger',
}

const typen = ['Ersttermin', 'Hundeschule', 'Einzeltraining', 'Social Walk', 'Mantrailing']
const level = ['Anfänger', 'Fortgeschritten', 'Alle Level']

export default function AdminTerminePage() {
  const [termine, setTermine] = useState<Termin[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(leer)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [teilnehmer, setTeilnehmer] = useState<Teilnehmer[]>([])
  const [loadingTeilnehmer, setLoadingTeilnehmer] = useState(false)

  async function load() {
    const { data } = await supabase.from('termine').select('*').order('datum', { ascending: true })
    setTermine(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function loadTeilnehmer(terminId: string) {
    setLoadingTeilnehmer(true)
    const { data: anmeldungen } = await supabase
      .from('termin_anmeldungen')
      .select('id, clerk_user_id, created_at')
      .eq('termin_id', terminId)
      .order('created_at', { ascending: true })

    const userIds = (anmeldungen ?? []).map(a => a.clerk_user_id)

    let profilMap = new Map<string, { clerk_user_id: string; vorname: string; nachname: string; email: string; telefon: string }>()
    let hundeMap = new Map<string, { clerk_user_id: string; name: string; rasse: string }>()

    if (userIds.length > 0) {
      const { data: profile } = await supabase
        .from('kunden_profile')
        .select('clerk_user_id, vorname, nachname, email, telefon')
        .in('clerk_user_id', userIds)

      const { data: hunde } = await supabase
        .from('hunde')
        .select('clerk_user_id, name, rasse')
        .in('clerk_user_id', userIds)

      profilMap = new Map(profile?.map(p => [p.clerk_user_id, p]) ?? [])
      hundeMap = new Map(hunde?.map(h => [h.clerk_user_id, h]) ?? [])
    }

    const portalListe: Teilnehmer[] = (anmeldungen ?? []).map(a => {
      const p = profilMap.get(a.clerk_user_id)
      const h = hundeMap.get(a.clerk_user_id)
      return {
        id: a.id,
        clerk_user_id: a.clerk_user_id,
        vorname: p?.vorname ?? '—',
        nachname: p?.nachname ?? '—',
        email: p?.email ?? '—',
        telefon: p?.telefon ?? '—',
        hund_name: h?.name ?? '—',
        hund_rasse: h?.rasse ?? '—',
        angemeldet_am: a.created_at,
        quelle: 'portal' as const,
      }
    })

    // Buchungsanfragen (nicht eingeloggte Kunden)
    const { data: anfragen } = await supabase
      .from('buchungsanfragen')
      .select('id, vorname, nachname, email, telefon, hund_name, hund_rasse, status, created_at')
      .eq('termin_id', terminId)
      .order('created_at', { ascending: true })

    const anfragenListe: Teilnehmer[] = (anfragen ?? []).map(a => ({
      id: a.id,
      clerk_user_id: '',
      vorname: a.vorname,
      nachname: a.nachname,
      email: a.email,
      telefon: a.telefon,
      hund_name: a.hund_name || '—',
      hund_rasse: a.hund_rasse || '—',
      angemeldet_am: a.created_at,
      quelle: 'anfrage' as const,
      status: a.status,
    }))

    setTeilnehmer([...portalListe, ...anfragenListe])
    setLoadingTeilnehmer(false)
  }

  function toggleExpand(id: string) {
    if (expandedId === id) {
      setExpandedId(null)
      setTeilnehmer([])
    } else {
      setExpandedId(id)
      loadTeilnehmer(id)
    }
  }

  async function handleRemoveAnmeldung(tn: Teilnehmer, terminId: string) {
    if (!confirm('Anmeldung wirklich entfernen?')) return
    if (tn.quelle === 'portal') {
      await supabase.from('termin_anmeldungen').delete().eq('id', tn.id)
      const t = termine.find(t => t.id === terminId)
      if (t && t.belegt > 0) {
        await supabase.from('termine').update({ belegt: t.belegt - 1 }).eq('id', terminId)
      }
      await load()
    } else {
      await supabase.from('buchungsanfragen').delete().eq('id', tn.id)
    }
    await loadTeilnehmer(terminId)
  }

  async function handleStatusChange(anfrageId: string, status: string, terminId: string) {
    await supabase.from('buchungsanfragen').update({ status }).eq('id', anfrageId)
    await loadTeilnehmer(terminId)
  }

  async function handleSave() {
    setSaving(true)
    if (editId) {
      await supabase.from('termine').update(form).eq('id', editId)
    } else {
      await supabase.from('termine').insert(form)
    }
    setForm(leer)
    setEditId(null)
    setShowForm(false)
    await load()
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Termin wirklich löschen?')) return
    await supabase.from('termine').delete().eq('id', id)
    if (expandedId === id) setExpandedId(null)
    setTermine(prev => prev.filter(t => t.id !== id))
  }

  function startEdit(t: Termin) {
    setForm({ kurs: t.kurs, typ: t.typ, datum: t.datum, uhrzeit: t.uhrzeit, dauer: t.dauer, plaetze: t.plaetze, belegt: t.belegt, ort: t.ort, level: t.level })
    setEditId(t.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function formatDatum(datum: string) {
    return new Date(datum).toLocaleDateString('de-CH', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-16"><p className="text-muted">Lade...</p></div>

  return (
    <div className="min-h-screen pt-32 pb-24 max-w-4xl mx-auto px-6">
      <Link href="/admin" className="text-xs text-muted hover:text-rust transition-colors mb-8 inline-block">← Zurück zum Dashboard</Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-5xl tracking-wider text-cream">TERMINE</h1>
        <button onClick={() => { setForm(leer); setEditId(null); setShowForm(true) }} className="btn-primary text-xs py-2 px-4">
          + Neuer Termin
        </button>
      </div>

      {/* Formular */}
      {showForm && (
        <div className="bg-card border border-border p-6 mb-8">
          <h2 className="font-display text-2xl tracking-wider text-cream mb-6">
            {editId ? 'TERMIN BEARBEITEN' : 'NEUER TERMIN'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold tracking-widest uppercase text-cream/60 mb-1">Kursname</label>
              <input value={form.kurs} onChange={e => setForm({ ...form, kurs: e.target.value })}
                className="w-full bg-surface border border-border text-cream px-4 py-2 text-sm focus:border-rust focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-cream/60 mb-1">Typ</label>
              <select value={form.typ} onChange={e => setForm({ ...form, typ: e.target.value })}
                className="w-full bg-surface border border-border text-cream px-4 py-2 text-sm focus:border-rust focus:outline-none">
                {typen.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-cream/60 mb-1">Level</label>
              <select value={form.level} onChange={e => setForm({ ...form, level: e.target.value })}
                className="w-full bg-surface border border-border text-cream px-4 py-2 text-sm focus:border-rust focus:outline-none">
                {level.map(l => <option key={l}>{l}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-cream/60 mb-1">Datum</label>
              <input type="date" value={form.datum} onChange={e => setForm({ ...form, datum: e.target.value })}
                className="w-full bg-surface border border-border text-cream px-4 py-2 text-sm focus:border-rust focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-cream/60 mb-1">Uhrzeit</label>
              <input type="time" value={form.uhrzeit} onChange={e => setForm({ ...form, uhrzeit: e.target.value })}
                className="w-full bg-surface border border-border text-cream px-4 py-2 text-sm focus:border-rust focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-cream/60 mb-1">Dauer</label>
              <input value={form.dauer} onChange={e => setForm({ ...form, dauer: e.target.value })}
                placeholder="z.B. 60 Min"
                className="w-full bg-surface border border-border text-cream px-4 py-2 text-sm focus:border-rust focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-cream/60 mb-1">Plätze total</label>
              <input type="number" value={form.plaetze} onChange={e => setForm({ ...form, plaetze: Number(e.target.value) })}
                className="w-full bg-surface border border-border text-cream px-4 py-2 text-sm focus:border-rust focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-cream/60 mb-1">Belegt</label>
              <input type="number" value={form.belegt} onChange={e => setForm({ ...form, belegt: Number(e.target.value) })}
                className="w-full bg-surface border border-border text-cream px-4 py-2 text-sm focus:border-rust focus:outline-none" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold tracking-widest uppercase text-cream/60 mb-1">Ort</label>
              <input value={form.ort} onChange={e => setForm({ ...form, ort: e.target.value })}
                className="w-full bg-surface border border-border text-cream px-4 py-2 text-sm focus:border-rust focus:outline-none" />
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => { setShowForm(false); setEditId(null); setForm(leer) }} className="btn-outline flex-1 justify-center">
              Abbrechen
            </button>
            <button onClick={handleSave} disabled={saving || !form.kurs || !form.datum} className="btn-primary flex-1 justify-center">
              {saving ? 'Speichern...' : 'Speichern →'}
            </button>
          </div>
        </div>
      )}

      {/* Liste */}
      <div className="space-y-2">
        {termine.length === 0 && (
          <div className="bg-card border border-border p-8 text-center">
            <p className="text-muted">Noch keine Termine erfasst.</p>
          </div>
        )}
        {termine.map(t => (
          <div key={t.id} className="border border-border overflow-hidden">
            {/* Termin Zeile */}
            <div
              className={`bg-card p-5 flex items-center gap-4 cursor-pointer hover:bg-surface transition-colors ${expandedId === t.id ? 'border-b border-border' : ''}`}
              onClick={() => toggleExpand(t.id)}
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs border border-rust/30 text-rust px-2 py-0.5">{t.typ}</span>
                  <span className="text-xs text-muted">{formatDatum(t.datum)} · {t.uhrzeit} Uhr</span>
                </div>
                <p className="text-cream font-medium truncate">{t.kurs}</p>
                <p className="text-muted text-xs mt-0.5">{t.ort} · {t.belegt}/{t.plaetze} Plätze</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-muted">{expandedId === t.id ? '▲' : '▼'} Teilnehmer</span>
                <button
                  onClick={e => { e.stopPropagation(); startEdit(t) }}
                  className="btn-outline text-xs py-1.5 px-3"
                >✏</button>
                <button
                  onClick={e => { e.stopPropagation(); handleDelete(t.id) }}
                  className="text-xs border border-red-800/50 text-red-400 hover:border-red-600 px-3 py-1.5 transition-colors"
                >🗑</button>
              </div>
            </div>

            {/* Teilnehmerliste */}
            {expandedId === t.id && (
              <div className="bg-surface p-5">
                {loadingTeilnehmer ? (
                  <p className="text-muted text-sm">Lade Teilnehmer...</p>
                ) : teilnehmer.length === 0 ? (
                  <p className="text-muted text-sm">Noch keine Anmeldungen.</p>
                ) : (
                  <>
                    <p className="text-xs font-semibold tracking-widest uppercase text-muted mb-3">
                      {teilnehmer.length} Teilnehmer
                    </p>
                    <div className="space-y-2">
                      {teilnehmer.map(tn => (
                        <div key={tn.id} className="bg-card border border-border p-4 flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-4">
                              <div>
                                <div className="flex items-center gap-2 mb-0.5">
                                  <p className="text-cream font-medium text-sm">{tn.vorname} {tn.nachname}</p>
                                  <span className={`text-xs px-2 py-0.5 border rounded-sm ${tn.quelle === 'portal' ? 'border-emerald-700/50 text-emerald-400' : 'border-amber-700/50 text-amber-400'}`}>
                                    {tn.quelle === 'portal' ? 'Portal' : 'Anfrage'}
                                  </span>
                                </div>
                                <p className="text-muted text-xs">{tn.email} · {tn.telefon}</p>
                              </div>
                              <div className="hidden sm:block border-l border-border pl-4">
                                <p className="text-cream text-sm">{tn.hund_name}</p>
                                <p className="text-muted text-xs">{tn.hund_rasse}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <span className="text-xs text-muted hidden sm:block">
                              {new Date(tn.angemeldet_am).toLocaleDateString('de-CH')}
                            </span>
                            {tn.quelle === 'anfrage' && (
                              <select
                                value={tn.status ?? 'neu'}
                                onChange={e => handleStatusChange(tn.id, e.target.value, t.id)}
                                className="text-xs bg-surface border border-border text-cream px-2 py-1 focus:border-rust focus:outline-none"
                              >
                                <option value="neu">Neu</option>
                                <option value="bestaetigt">Bestätigt</option>
                                <option value="abgesagt">Abgesagt</option>
                              </select>
                            )}
                            <button
                              onClick={() => handleRemoveAnmeldung(tn, t.id)}
                              className="text-xs border border-red-800/50 text-red-400 hover:border-red-600 px-3 py-1.5 transition-colors"
                            >
                              Entfernen
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
