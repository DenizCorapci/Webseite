'use client'
export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import * as XLSX from 'xlsx'

type Kunde = {
  id: string
  clerk_user_id: string
  vorname: string
  nachname: string
  email: string
  telefon: string
  plz: string
  ort: string
  hund_name: string
  hund_rasse: string
}

const leer = { vorname: '', nachname: '', email: '', telefon: '', plz: '', ort: '' }

export default function AdminKundenPage() {
  const [kunden, setKunden] = useState<Kunde[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState(leer)
  const [saving, setSaving] = useState(false)
  const [search, setSearch] = useState('')

  async function load() {
    const { data: profile } = await supabase
      .from('kunden_profile')
      .select('*')
      .order('nachname', { ascending: true })

    const { data: hunde } = await supabase
      .from('hunde')
      .select('clerk_user_id, name, rasse')

    const hundeMap = new Map(hunde?.map(h => [h.clerk_user_id, h]) ?? [])

    const list: Kunde[] = (profile ?? []).map(p => ({
      id: p.id,
      clerk_user_id: p.clerk_user_id,
      vorname: p.vorname ?? '',
      nachname: p.nachname ?? '',
      email: p.email ?? '',
      telefon: p.telefon ?? '',
      plz: p.plz ?? '',
      ort: p.ort ?? '',
      hund_name: hundeMap.get(p.clerk_user_id)?.name ?? '—',
      hund_rasse: hundeMap.get(p.clerk_user_id)?.rasse ?? '—',
    }))

    setKunden(list)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function toggleSelect(id: string) {
    setSelected(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function toggleAll() {
    if (selected.size === gefiltert.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(gefiltert.map(k => k.id)))
    }
  }

  async function handleDelete() {
    if (selected.size === 0) return
    if (!confirm(`${selected.size} Kunde(n) wirklich löschen?`)) return
    for (const id of Array.from(selected)) {
      await supabase.from('kunden_profile').delete().eq('id', id)
    }
    setSelected(new Set())
    await load()
  }

  function startEdit(k: Kunde) {
    setEditId(k.id)
    setEditForm({ vorname: k.vorname, nachname: k.nachname, email: k.email, telefon: k.telefon, plz: k.plz, ort: k.ort })
  }

  async function handleSave() {
    if (!editId) return
    setSaving(true)
    await supabase.from('kunden_profile').update(editForm).eq('id', editId)
    setEditId(null)
    await load()
    setSaving(false)
  }

  function exportExcel() {
    const rows = gefiltert.map(k => ({
      Vorname: k.vorname,
      Nachname: k.nachname,
      Email: k.email,
      Telefon: k.telefon,
      PLZ: k.plz,
      Ort: k.ort,
      Hund: k.hund_name,
      Rasse: k.hund_rasse,
    }))
    const ws = XLSX.utils.json_to_sheet(rows)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Kunden')
    XLSX.writeFile(wb, 'bad-dog-kunden.xlsx')
  }

  const gefiltert = kunden.filter(k => {
    const s = search.toLowerCase()
    return !s || k.vorname.toLowerCase().includes(s) || k.nachname.toLowerCase().includes(s) ||
      k.email.toLowerCase().includes(s) || k.ort.toLowerCase().includes(s) || k.hund_name.toLowerCase().includes(s)
  })

  const felder: { label: string; key: keyof typeof leer }[] = [
    { label: 'Vorname', key: 'vorname' },
    { label: 'Nachname', key: 'nachname' },
    { label: 'E-Mail', key: 'email' },
    { label: 'Telefon', key: 'telefon' },
    { label: 'PLZ', key: 'plz' },
    { label: 'Ort', key: 'ort' },
  ]

  if (loading) return <div className="min-h-screen flex items-center justify-center pt-16"><p className="text-muted">Lade...</p></div>

  return (
    <div className="min-h-screen pt-32 pb-24 max-w-6xl mx-auto px-6">
      <Link href="/admin" className="text-xs text-muted hover:text-rust transition-colors mb-8 inline-block">← Zurück zum Dashboard</Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <h1 className="font-display text-5xl tracking-wider text-cream">KUNDENDATEN</h1>
        <div className="flex gap-2 flex-wrap">
          {selected.size > 0 && (
            <button onClick={handleDelete} className="text-xs border border-red-800/50 text-red-400 hover:border-red-600 px-4 py-2 transition-colors">
              🗑 {selected.size} löschen
            </button>
          )}
          <button onClick={exportExcel} className="btn-outline text-xs py-2 px-4">
            ↓ Excel Export
          </button>
        </div>
      </div>

      {/* Suche */}
      <input
        type="text"
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Suchen nach Name, E-Mail, Ort, Hund..."
        className="w-full bg-surface border border-border text-cream px-4 py-3 text-sm focus:border-rust focus:outline-none mb-6"
      />

      {/* Edit Modal */}
      {editId && (
        <div className="bg-card border border-border p-6 mb-6">
          <h2 className="font-display text-2xl tracking-wider text-cream mb-4">KUNDE BEARBEITEN</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {felder.map(({ label, key }) => (
              <div key={key}>
                <label className="block text-xs font-semibold tracking-widest uppercase text-cream/60 mb-1">{label}</label>
                <input
                  value={editForm[key]}
                  onChange={e => setEditForm({ ...editForm, [key]: e.target.value })}
                  className="w-full bg-surface border border-border text-cream px-3 py-2 text-sm focus:border-rust focus:outline-none"
                />
              </div>
            ))}
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={() => setEditId(null)} className="btn-outline text-xs py-2 px-4">Abbrechen</button>
            <button onClick={handleSave} disabled={saving} className="btn-primary text-xs py-2 px-4">
              {saving ? 'Speichern...' : 'Speichern →'}
            </button>
          </div>
        </div>
      )}

      {/* Tabelle */}
      {gefiltert.length === 0 ? (
        <div className="bg-card border border-border p-8 text-center">
          <p className="text-muted">{kunden.length === 0 ? 'Noch keine Kunden registriert.' : 'Keine Treffer.'}</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="py-3 px-3 text-left w-8">
                  <input
                    type="checkbox"
                    checked={selected.size === gefiltert.length && gefiltert.length > 0}
                    onChange={toggleAll}
                    className="accent-rust"
                  />
                </th>
                {['Name', 'E-Mail', 'Telefon', 'PLZ / Ort', 'Hund', ''].map(h => (
                  <th key={h} className="py-3 px-3 text-left text-xs font-semibold tracking-widest uppercase text-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gefiltert.map(k => (
                <tr
                  key={k.id}
                  className={`border-b border-border/50 hover:bg-surface transition-colors ${selected.has(k.id) ? 'bg-rust/5' : ''}`}
                >
                  <td className="py-3 px-3">
                    <input
                      type="checkbox"
                      checked={selected.has(k.id)}
                      onChange={() => toggleSelect(k.id)}
                      className="accent-rust"
                    />
                  </td>
                  <td className="py-3 px-3">
                    <p className="text-cream font-medium">{k.vorname} {k.nachname}</p>
                  </td>
                  <td className="py-3 px-3 text-muted">{k.email || '—'}</td>
                  <td className="py-3 px-3 text-muted">{k.telefon || '—'}</td>
                  <td className="py-3 px-3 text-muted">{k.plz && k.ort ? `${k.plz} ${k.ort}` : '—'}</td>
                  <td className="py-3 px-3">
                    <p className="text-cream">{k.hund_name}</p>
                    <p className="text-xs text-muted">{k.hund_rasse}</p>
                  </td>
                  <td className="py-3 px-3">
                    <button onClick={() => startEdit(k)} className="text-xs border border-border text-muted hover:border-rust hover:text-rust px-3 py-1.5 transition-colors">
                      ✏ Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-xs text-muted mt-4">{gefiltert.length} Kunde{gefiltert.length !== 1 ? 'n' : ''} {search ? '(gefiltert)' : 'total'}</p>
        </div>
      )}
    </div>
  )
}
