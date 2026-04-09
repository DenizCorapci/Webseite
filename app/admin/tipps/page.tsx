'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Tipp = {
  id: string
  titel: string
  beschreibung: string
  video_url: string
}

const leer = { titel: '', beschreibung: '', video_url: '' }

export default function AdminTippsPage() {
  const [tipps, setTipps] = useState<Tipp[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(leer)
  const [editId, setEditId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function load() {
    const { data } = await supabase.from('tipps').select('*').order('created_at', { ascending: false })
    setTipps(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    const dateiname = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    const { data, error } = await supabase.storage
      .from('tipps-videos')
      .upload(dateiname, file, { upsert: false })
    if (error) {
      alert('Upload fehlgeschlagen: ' + error.message)
      setUploading(false)
      return
    }
    const { data: urlData } = supabase.storage.from('tipps-videos').getPublicUrl(data.path)
    setForm(prev => ({ ...prev, video_url: urlData.publicUrl }))
    setUploading(false)
  }

  async function handleSave() {
    if (!form.titel || !form.video_url) return
    setSaving(true)
    if (editId) {
      await supabase.from('tipps').update(form).eq('id', editId)
    } else {
      await supabase.from('tipps').insert(form)
    }
    setForm(leer)
    setEditId(null)
    setShowForm(false)
    await load()
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Tipp wirklich löschen?')) return
    await supabase.from('tipps').delete().eq('id', id)
    setTipps(prev => prev.filter(t => t.id !== id))
  }

  function startEdit(t: Tipp) {
    setForm({ titel: t.titel, beschreibung: t.beschreibung, video_url: t.video_url })
    setEditId(t.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function getThumb(url: string) {
    const m = url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([^&?\s]+)/)
    if (m) return `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg`
    return null
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-16"><p className="text-muted">Lade...</p></div>

  return (
    <div className="min-h-screen pt-32 pb-24 max-w-4xl mx-auto px-6">
      <Link href="/admin" className="text-xs text-muted hover:text-rust transition-colors mb-8 inline-block">← Zurück zum Dashboard</Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-5xl tracking-wider text-cream">TIPPS</h1>
        <button onClick={() => { setForm(leer); setEditId(null); setShowForm(true) }} className="btn-primary text-xs py-2 px-4">
          + Neuer Tipp
        </button>
      </div>

      {showForm && (
        <div className="bg-card border border-border p-6 mb-8">
          <h2 className="font-display text-2xl tracking-wider text-cream mb-6">
            {editId ? 'TIPP BEARBEITEN' : 'NEUER TIPP'}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-cream/60 mb-1">Titel *</label>
              <input value={form.titel} onChange={e => setForm({ ...form, titel: e.target.value })}
                placeholder="z.B. Stressfreies Silvester für Hunde"
                className="w-full bg-surface border border-border text-cream px-4 py-2 text-sm focus:border-rust focus:outline-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-cream/60 mb-1">Beschreibung</label>
              <textarea value={form.beschreibung} onChange={e => setForm({ ...form, beschreibung: e.target.value })}
                rows={2} placeholder="Kurze Beschreibung des Inhalts"
                className="w-full bg-surface border border-border text-cream px-4 py-2 text-sm focus:border-rust focus:outline-none resize-none" />
            </div>
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-cream/60 mb-1">Video</label>
              <div className="space-y-3">
                {/* URL eingeben */}
                <input value={form.video_url} onChange={e => setForm({ ...form, video_url: e.target.value })}
                  placeholder="YouTube-Link oder Supabase-URL einfügen"
                  className="w-full bg-surface border border-border text-cream px-4 py-2 text-sm focus:border-rust focus:outline-none" />
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted">oder</span>
                  <input ref={fileRef} type="file" accept="video/*,audio/*" onChange={handleFileUpload} className="hidden" />
                  <button type="button" onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="btn-outline text-xs py-2 px-4">
                    {uploading ? 'Wird hochgeladen...' : '↑ Datei hochladen'}
                  </button>
                  {form.video_url && <span className="text-xs text-emerald-400">✓ URL gesetzt</span>}
                </div>
              </div>
              {/* Vorschau */}
              {form.video_url && getThumb(form.video_url) && (
                <img src={getThumb(form.video_url)!} alt="Vorschau" className="mt-2 h-24 object-cover border border-border" />
              )}
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={() => { setShowForm(false); setEditId(null); setForm(leer) }} className="btn-outline flex-1 justify-center">
              Abbrechen
            </button>
            <button onClick={handleSave} disabled={saving || !form.titel || !form.video_url} className="btn-primary flex-1 justify-center">
              {saving ? 'Speichern...' : 'Speichern →'}
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {tipps.length === 0 && (
          <div className="bg-card border border-border p-8 text-center">
            <p className="text-muted">Noch keine Tipps erfasst.</p>
          </div>
        )}
        {tipps.map(t => {
          const thumb = getThumb(t.video_url)
          return (
            <div key={t.id} className="bg-card border border-border p-5 flex items-center gap-4">
              <div className="w-20 h-14 bg-surface border border-border flex-shrink-0 overflow-hidden">
                {thumb
                  ? <img src={thumb} alt={t.titel} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-2xl">🎬</div>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-cream font-medium truncate">{t.titel}</p>
                {t.beschreibung && <p className="text-muted text-xs mt-0.5 truncate">{t.beschreibung}</p>}
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => startEdit(t)} className="btn-outline text-xs py-1.5 px-3">✏</button>
                <button onClick={() => handleDelete(t.id)}
                  className="text-xs border border-red-800/50 text-red-400 hover:border-red-600 px-3 py-1.5 transition-colors">
                  🗑
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
