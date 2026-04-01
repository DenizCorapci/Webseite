'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'

type Video = {
  id: string
  titel: string
  beschreibung: string
  video_url: string
  kategorie: string
  reihenfolge: number
}

const leer = { titel: '', beschreibung: '', video_url: '', kategorie: 'Grundlagen', reihenfolge: 0 }

const kategorien = ['Grundlagen', 'Leinenführigkeit', 'Mantrailing', 'Sozialverhalten', 'Impulskontrolle', 'Allgemein']

export default function AdminLernvideosPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(leer)
  const [saving, setSaving] = useState(false)
  const [editId, setEditId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)

  async function load() {
    const { data } = await supabase.from('lernvideos').select('*').order('reihenfolge', { ascending: true })
    setVideos(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleSave() {
    setSaving(true)
    if (editId) {
      await supabase.from('lernvideos').update(form).eq('id', editId)
    } else {
      await supabase.from('lernvideos').insert({ ...form, reihenfolge: videos.length + 1 })
    }
    setForm(leer)
    setEditId(null)
    setShowForm(false)
    await load()
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Video wirklich löschen?')) return
    await supabase.from('lernvideos').delete().eq('id', id)
    setVideos(prev => prev.filter(v => v.id !== id))
  }

  function startEdit(v: Video) {
    setForm({ titel: v.titel, beschreibung: v.beschreibung, video_url: v.video_url, kategorie: v.kategorie, reihenfolge: v.reihenfolge })
    setEditId(v.id)
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function getVideoThumb(url: string) {
    const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/)
    if (yt) return `https://img.youtube.com/vi/${yt[1]}/mqdefault.jpg`
    return null
  }

  function getVideoTyp(url: string) {
    if (url.includes('youtube.com') || url.includes('youtu.be')) return 'YouTube'
    if (url.includes('vimeo.com')) return 'Vimeo'
    return 'Direktlink'
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-16"><p className="text-muted">Lade...</p></div>

  return (
    <div className="min-h-screen pt-32 pb-24 max-w-4xl mx-auto px-6">
      <Link href="/admin" className="text-xs text-muted hover:text-rust transition-colors mb-8 inline-block">← Zurück zum Dashboard</Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-5xl tracking-wider text-cream">LERNVIDEOS</h1>
        <button onClick={() => { setForm(leer); setEditId(null); setShowForm(true) }} className="btn-primary text-xs py-2 px-4">
          + Neues Video
        </button>
      </div>

      {/* Formular */}
      {showForm && (
        <div className="bg-card border border-border p-6 mb-8">
          <h2 className="font-display text-2xl tracking-wider text-cream mb-6">
            {editId ? 'VIDEO BEARBEITEN' : 'NEUES VIDEO'}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-cream/60 mb-1">Video URL</label>
              <input
                value={form.video_url}
                onChange={e => setForm({ ...form, video_url: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=... oder https://vimeo.com/..."
                className="w-full bg-surface border border-border text-cream px-4 py-2 text-sm focus:border-rust focus:outline-none"
              />
              {form.video_url && (
                <p className="text-xs text-muted mt-1">Erkannt: {getVideoTyp(form.video_url)}</p>
              )}
            </div>

            {/* YouTube Vorschau */}
            {getVideoThumb(form.video_url) && (
              <img src={getVideoThumb(form.video_url)!} alt="Vorschau" className="w-48 border border-border" />
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-cream/60 mb-1">Titel</label>
                <input
                  value={form.titel}
                  onChange={e => setForm({ ...form, titel: e.target.value })}
                  placeholder="z.B. Leinenführigkeit Grundübung"
                  className="w-full bg-surface border border-border text-cream px-4 py-2 text-sm focus:border-rust focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-widest uppercase text-cream/60 mb-1">Kategorie</label>
                <select
                  value={form.kategorie}
                  onChange={e => setForm({ ...form, kategorie: e.target.value })}
                  className="w-full bg-surface border border-border text-cream px-4 py-2 text-sm focus:border-rust focus:outline-none"
                >
                  {kategorien.map(k => <option key={k}>{k}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold tracking-widest uppercase text-cream/60 mb-1">Beschreibung</label>
              <textarea
                rows={3}
                value={form.beschreibung}
                onChange={e => setForm({ ...form, beschreibung: e.target.value })}
                placeholder="Kurze Beschreibung was im Video gezeigt wird..."
                className="w-full bg-surface border border-border text-cream px-4 py-2 text-sm focus:border-rust focus:outline-none resize-none"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button onClick={() => { setShowForm(false); setEditId(null); setForm(leer) }} className="btn-outline flex-1 justify-center">Abbrechen</button>
            <button onClick={handleSave} disabled={saving || !form.titel || !form.video_url} className="btn-primary flex-1 justify-center">
              {saving ? 'Speichern...' : 'Speichern →'}
            </button>
          </div>
        </div>
      )}

      {/* Liste */}
      <div className="space-y-3">
        {videos.length === 0 && (
          <div className="bg-card border border-border p-8 text-center">
            <p className="text-muted">Noch keine Videos erfasst.</p>
          </div>
        )}
        {videos.map((v, i) => {
          const thumb = getVideoThumb(v.video_url)
          return (
            <div key={v.id} className="bg-card border border-border p-5 flex items-center gap-4">
              {thumb ? (
                <img src={thumb} alt={v.titel} className="w-20 h-14 object-cover border border-border flex-shrink-0" />
              ) : (
                <div className="w-20 h-14 bg-surface border border-border flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">🎬</span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-muted">#{i + 1}</span>
                  <span className="text-xs border border-border text-muted px-2 py-0.5">{v.kategorie}</span>
                  <span className="text-xs text-muted">{getVideoTyp(v.video_url)}</span>
                </div>
                <p className="text-cream font-medium truncate">{v.titel}</p>
                <p className="text-muted text-xs mt-0.5 truncate">{v.video_url}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => startEdit(v)} className="btn-outline text-xs py-1.5 px-3">✏</button>
                <button onClick={() => handleDelete(v.id)} className="text-xs border border-red-800/50 text-red-400 hover:border-red-600 px-3 py-1.5 transition-colors">🗑</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
