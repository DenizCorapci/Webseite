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

const leer = {
  kurs: '', typ: 'Hundeschule', datum: '', uhrzeit: '09:00',
  dauer: '60 Min', plaetze: 6, belegt: 0, ort: '', level: 'Anfänger',
}

const typen = ['Hundeschule', 'Einzeltraining', 'Social Walk', 'Mantrailing']
const level = ['Anfänger', 'Fortgeschritten', 'Alle Level']

export default function AdminTerminePage() {
  const [termine, setTermine] = useState<Termin[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(leer)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  async function load() {
    const { data } = await supabase.from('termine').select('*').order('datum', { ascending: true })
    setTermine(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

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
      <div className="space-y-3">
        {termine.length === 0 && (
          <div className="bg-card border border-border p-8 text-center">
            <p className="text-muted">Noch keine Termine erfasst.</p>
          </div>
        )}
        {termine.map(t => (
          <div key={t.id} className="bg-card border border-border p-5 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs border border-rust/30 text-rust px-2 py-0.5">{t.typ}</span>
                <span className="text-xs text-muted">{formatDatum(t.datum)} · {t.uhrzeit} Uhr</span>
              </div>
              <p className="text-cream font-medium truncate">{t.kurs}</p>
              <p className="text-muted text-xs mt-0.5">{t.ort} · {t.belegt}/{t.plaetze} Plätze</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => startEdit(t)} className="btn-outline text-xs py-1.5 px-3">✏</button>
              <button onClick={() => handleDelete(t.id)}
                className="text-xs border border-red-800/50 text-red-400 hover:border-red-600 px-3 py-1.5 transition-colors">
                🗑
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
