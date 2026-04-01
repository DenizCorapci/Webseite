'use client'

import { useUser } from '@clerk/nextjs'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function NeuesHundprofilPage() {
  const { user } = useUser()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    rasse: '',
    hund_alter: '',
    geschlecht: 'Rüde',
    kastration: 'intakt',
    besonderheiten: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setLoading(true)

    await supabase.from('hunde').insert({
      clerk_user_id: user.id,
      besitzer_name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
      besitzer_email: user.emailAddresses[0]?.emailAddress ?? '',
      ...form,
    })

    router.push('/portal')
  }

  return (
    <div className="min-h-screen pt-32 pb-24 max-w-2xl mx-auto px-6">
      <p className="section-label mb-2">Kundenportal</p>
      <div className="divider mb-6" />
      <h1 className="font-display text-5xl tracking-wider text-cream mb-10">
        HUNDEPROFIL<br /><span className="text-rust">ERSTELLEN</span>
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {[
          { label: 'Name des Hundes', key: 'name', placeholder: 'z.B. Bruno' },
          { label: 'Rasse', key: 'rasse', placeholder: 'z.B. Deutscher Schäferhund' },
          { label: 'Alter', key: 'hund_alter', placeholder: 'z.B. 2 Jahre' },
        ].map(({ label, key, placeholder }) => (
          <div key={key}>
            <label className="block text-xs font-semibold tracking-widest uppercase text-cream/60 mb-2">{label}</label>
            <input
              type="text"
              required
              placeholder={placeholder}
              value={form[key as keyof typeof form]}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="w-full bg-surface border border-border text-cream px-4 py-3 text-sm focus:border-rust focus:outline-none"
            />
          </div>
        ))}

        <div>
          <label className="block text-xs font-semibold tracking-widest uppercase text-cream/60 mb-2">Geschlecht</label>
          <select
            value={form.geschlecht}
            onChange={(e) => setForm({ ...form, geschlecht: e.target.value })}
            className="w-full bg-surface border border-border text-cream px-4 py-3 text-sm focus:border-rust focus:outline-none"
          >
            <option>Rüde</option>
            <option>Hündin</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-widest uppercase text-cream/60 mb-2">Kastration</label>
          <select
            value={form.kastration}
            onChange={(e) => setForm({ ...form, kastration: e.target.value })}
            className="w-full bg-surface border border-border text-cream px-4 py-3 text-sm focus:border-rust focus:outline-none"
          >
            <option>intakt</option>
            <option>kastriert</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-widest uppercase text-cream/60 mb-2">Besonderheiten / Anmerkungen</label>
          <textarea
            rows={4}
            placeholder="z.B. reagiert auf andere Hunde, hatte Welpengruppe besucht..."
            value={form.besonderheiten}
            onChange={(e) => setForm({ ...form, besonderheiten: e.target.value })}
            className="w-full bg-surface border border-border text-cream px-4 py-3 text-sm focus:border-rust focus:outline-none resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-primary w-full justify-center"
        >
          {loading ? 'Wird gespeichert...' : 'Profil speichern →'}
        </button>
      </form>
    </div>
  )
}
