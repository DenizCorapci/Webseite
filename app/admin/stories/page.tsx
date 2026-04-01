'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Story = {
  id: string
  hunde_name: string
  rasse: string
  besitzer: string
  ort: string
  kurs: string
  dauer: string
  vorher: string
  nachher: string
  zitat: string
  foto_vorher: string
  foto_nachher: string
  reihenfolge: number
}

const leer = {
  hunde_name: '', rasse: '', besitzer: '', ort: '', kurs: '', dauer: '',
  vorher: '', nachher: '', zitat: '', foto_vorher: '', foto_nachher: '', reihenfolge: 0,
}

export default function AdminStoriesPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(leer)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  async function load() {
    const { data } = await supabase.from('stories').select('*').order('reihenfolge', { ascending: true })
    setStories(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleSave() {
    setSaving(true)
    if (editId) {
      await supabase.from('stories').update(form).eq('id', editId)
    } else {
      await supabase.from('stories').insert({ ...form, reihenfolge: stories.length + 1 })
    }
    setForm(leer)
    setEditId(null)
    setShowForm(false)
    await load()
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Story wirklich löschen?')) return
    await supabase.from('stories').delete().eq('id', id)
    setStories(prev => prev.filter(s => s.id !== id))
  }

  function startEdit(s: Story) {
    setForm({ hunde_name: s.hunde_name, rasse: s.rasse, besitzer: s.besitzer, ort: s.ort, kurs: s.kurs, dauer: s.dauer, vorher: s.vorher, nachher: s.nachher, zitat: s.zitat, foto_vorher: s.foto_vorher, foto_nachher: s.foto_nachher, reihenfolge: s.reihenfolge })
    setEditId(s.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const felder: { label: string; key: keyof typeof leer; rows?: number; placeholder?: string }[] = [
    { label: 'Hundename', key: 'hunde_name', placeholder: 'z.B. Bruno' },
    { label: 'Rasse & Alter', key: 'rasse', placeholder: 'z.B. Deutscher Schäferhund, 2 Jahre' },
    { label: 'Besitzer', key: 'besitzer', placeholder: 'z.B. Familie Steiner' },
    { label: 'Ort', key: 'ort', placeholder: 'z.B. Zurzach' },
    { label: 'Kurs', key: 'kurs', placeholder: 'z.B. Einzeltraining + Hundeschule' },
    { label: 'Dauer', key: 'dauer', placeholder: 'z.B. 3 Monate' },
    { label: 'Das Problem (Vorher)', key: 'vorher', rows: 4 },
    { label: 'Die Veränderung (Nachher)', key: 'nachher', rows: 4 },
    { label: 'Zitat des Besitzers', key: 'zitat', rows: 3 },
    { label: 'Foto Vorher (URL)', key: 'foto_vorher', placeholder: 'https://...' },
    { label: 'Foto Nachher (URL)', key: 'foto_nachher', placeholder: 'https://...' },
  ]

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-16"><p className="text-muted">Lade...</p></div>

  return (
    <div className="min-h-screen pt-32 pb-24 max-w-4xl mx-auto px-6">
      <Link href="/admin" className="text-xs text-muted hover:text-rust transition-colors mb-8 inline-block">← Zurück zum Dashboard</Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-5xl tracking-wider text-cream">STORIES</h1>
        <button onClick={() => { setForm(leer); setEditId(null); setShowForm(true) }} className="btn-primary text-xs py-2 px-4">
          + Neue Story
        </button>
      </div>

      {/* Formular */}
      {showForm && (
        <div className="bg-card border border-border p-6 mb-8">
          <h2 className="font-display text-2xl tracking-wider text-cream mb-6">
            {editId ? 'STORY BEARBEITEN' : 'NEUE STORY'}
          </h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {felder.slice(0, 6).map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold tracking-widest uppercase text-cream/60 mb-1">{label}</label>
                  <input
                    value={form[key] as string}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full bg-surface border border-border text-cream px-4 py-2 text-sm focus:border-rust focus:outline-none"
                  />
                </div>
              ))}
            </div>
            {felder.slice(6).map(({ label, key, rows, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-semibold tracking-widest uppercase text-cream/60 mb-1">{label}</label>
                {rows ? (
                  <textarea
                    rows={rows}
                    value={form[key] as string}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    className="w-full bg-surface border border-border text-cream px-4 py-2 text-sm focus:border-rust focus:outline-none resize-none"
                  />
                ) : (
                  <input
                    value={form[key] as string}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full bg-surface border border-border text-cream px-4 py-2 text-sm focus:border-rust focus:outline-none"
                  />
                )}
              </div>
            ))}
            {/* Foto-Vorschau */}
            {(form.foto_vorher || form.foto_nachher) && (
              <div className="grid grid-cols-2 gap-3">
                {form.foto_vorher && <img src={form.foto_vorher} alt="Vorher" className="w-full aspect-square object-cover border border-border opacity-60 grayscale" />}
                {form.foto_nachher && <img src={form.foto_nachher} alt="Nachher" className="w-full aspect-square object-cover border border-border" />}
              </div>
            )}
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => { setShowForm(false); setEditId(null); setForm(leer) }} className="btn-outline flex-1 justify-center">Abbrechen</button>
            <button onClick={handleSave} disabled={saving || !form.hunde_name} className="btn-primary flex-1 justify-center">
              {saving ? 'Speichern...' : 'Speichern →'}
            </button>
          </div>
        </div>
      )}

      {/* Liste */}
      <div className="space-y-3">
        {stories.length === 0 && (
          <div className="bg-card border border-border p-8 text-center">
            <p className="text-muted">Noch keine Stories vorhanden.</p>
          </div>
        )}
        {stories.map((s, i) => (
          <div key={s.id} className="bg-card border border-border p-5 flex items-center gap-4">
            {s.foto_nachher && (
              <img src={s.foto_nachher} alt={s.hunde_name} className="w-14 h-14 object-cover border border-border flex-shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-muted">#{i + 1}</span>
                <span className="text-xs border border-rust/30 text-rust px-2 py-0.5">{s.kurs}</span>
              </div>
              <p className="text-cream font-medium">{s.hunde_name} — {s.rasse}</p>
              <p className="text-muted text-xs mt-0.5">{s.besitzer} · {s.ort} · {s.dauer}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => startEdit(s)} className="btn-outline text-xs py-1.5 px-3">✏</button>
              <button onClick={() => handleDelete(s.id)} className="text-xs border border-red-800/50 text-red-400 hover:border-red-600 px-3 py-1.5 transition-colors">🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
