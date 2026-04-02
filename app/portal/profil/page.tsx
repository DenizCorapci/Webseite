'use client'
export const dynamic = 'force-dynamic'

import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ProfilPage() {
  const { user } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    vorname: '',
    nachname: '',
    email: '',
    telefon: '',
    plz: '',
    ort: '',
  })

  useEffect(() => {
    if (!user) return
    supabase
      .from('kunden_profile')
      .select('*')
      .eq('clerk_user_id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setForm({
            vorname: data.vorname ?? '',
            nachname: data.nachname ?? '',
            email: data.email ?? '',
            telefon: data.telefon ?? '',
            plz: data.plz ?? '',
            ort: data.ort ?? '',
          })
        } else {
          // Vorbefüllen mit Clerk-Daten
          setForm(prev => ({
            ...prev,
            vorname: user.firstName ?? '',
            nachname: user.lastName ?? '',
            email: user.emailAddresses[0]?.emailAddress ?? '',
          }))
        }
        setLoading(false)
      })
  }, [user])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setSaving(true)
    await supabase
      .from('kunden_profile')
      .upsert({ clerk_user_id: user.id, ...form }, { onConflict: 'clerk_user_id' })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <p className="text-muted">Lade...</p>
    </div>
  )

  const felder = [
    { label: 'Vorname', key: 'vorname', type: 'text', placeholder: 'Max' },
    { label: 'Nachname', key: 'nachname', type: 'text', placeholder: 'Muster' },
    { label: 'E-Mail', key: 'email', type: 'email', placeholder: 'max@example.com' },
    { label: 'Telefon', key: 'telefon', type: 'tel', placeholder: '+41 79 123 45 67' },
    { label: 'PLZ', key: 'plz', type: 'text', placeholder: '5330' },
    { label: 'Ort', key: 'ort', type: 'text', placeholder: 'Zurzach' },
  ]

  return (
    <div className="min-h-screen pt-32 pb-24 max-w-xl mx-auto px-6">
      <Link href="/portal" className="text-xs text-muted hover:text-rust transition-colors mb-8 inline-block">
        ← Zurück zum Portal
      </Link>

      <p className="section-label mb-2">Mein Profil</p>
      <div className="divider mb-6" />
      <h1 className="font-display text-5xl tracking-wider text-cream mb-8">
        MEINE DATEN
      </h1>

      <form onSubmit={handleSave} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {felder.map(({ label, key, type, placeholder }) => (
            <div key={key} className={key === 'email' ? 'sm:col-span-2' : ''}>
              <label className="block text-xs font-semibold tracking-widest uppercase text-cream/60 mb-1">
                {label}
              </label>
              <input
                type={type}
                value={form[key as keyof typeof form]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full bg-surface border border-border text-cream px-4 py-3 text-sm focus:border-rust focus:outline-none"
              />
            </div>
          ))}
        </div>

        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={() => router.push('/portal')}
            className="btn-outline flex-1 justify-center"
          >
            Abbrechen
          </button>
          <button
            type="submit"
            disabled={saving}
            className="btn-primary flex-1 justify-center"
          >
            {saving ? 'Speichern...' : saved ? 'Gespeichert ✓' : 'Speichern →'}
          </button>
        </div>
      </form>
    </div>
  )
}
