'use client'

import { useUser } from '@clerk/nextjs'
import { useEffect, useRef, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatWidget() {
  const { user } = useUser()
  const [open, setOpen] = useState(false)
  const [hundId, setHundId] = useState<string | null>(null)
  const [hundName, setHundName] = useState<string>('')
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!user) return
    supabase
      .from('hunde')
      .select('id, name')
      .eq('clerk_user_id', user.id)
      .single()
      .then(({ data }) => {
        if (data) {
          setHundId(data.id)
          setHundName(data.name)
          setMessages([{
            role: 'assistant',
            content: `Hallo! Ich bin dein Trainings-Assistent von Bad Dog Hundeschule. Ich kenne das Profil von ${data.name} und helfe dir gerne. Was möchtest du wissen?`,
          }])
        } else {
          setMessages([{
            role: 'assistant',
            content: 'Hallo! Erstelle zuerst ein Hundeprofil damit ich dir personalisierte Tipps geben kann.',
          }])
        }
      })
  }, [user])

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
        inputRef.current?.focus()
      }, 100)
    }
  }, [open, messages])

  async function handleSend(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMsg: Message = { role: 'user', content: input.trim() }
    const newMessages = [...messages, userMsg]
    setMessages(newMessages)
    setInput('')
    setLoading(true)
    setMessages(prev => [...prev, { role: 'assistant', content: '' }])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages.map(m => ({ role: m.role, content: m.content })),
          hundId,
        }),
      })

      if (!res.ok) {
        const errText = await res.text()
        setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: `Fehler: ${errText}` }])
        setLoading(false)
        return
      }

      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let full = ''
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        full += decoder.decode(value, { stream: true })
        setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: full }])
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Fehler'
      setMessages(prev => [...prev.slice(0, -1), { role: 'assistant', content: `Fehler: ${msg}` }])
    }

    setLoading(false)
  }

  return (
    <>
      {/* Chat Popup */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '88px', right: '24px',
          width: '360px', maxWidth: 'calc(100vw - 48px)',
          height: '500px', maxHeight: 'calc(100vh - 120px)',
          zIndex: 9999,
          display: 'flex', flexDirection: 'column',
          backgroundColor: '#111111',
          border: '1px solid #2A2A2A',
          boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
        }}>
          {/* Header */}
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid #2A2A2A',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '1.2rem' }}>🐾</span>
              <div>
                <p style={{ color: '#F2EDE4', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
                  KI-Berater
                </p>
                {hundName && (
                  <p style={{ color: '#888', fontSize: '0.65rem', margin: 0 }}>für {hundName}</p>
                )}
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1, padding: '4px' }}
            >✕</button>
          </div>

          {/* Nachrichten */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start', gap: '8px', alignItems: 'flex-start' }}>
                {m.role === 'assistant' && (
                  <span style={{ fontSize: '0.9rem', flexShrink: 0, marginTop: '2px' }}>🐾</span>
                )}
                <div style={{
                  maxWidth: '85%',
                  padding: '8px 12px',
                  fontSize: '0.8rem',
                  lineHeight: 1.5,
                  whiteSpace: 'pre-line',
                  backgroundColor: m.role === 'user' ? 'rgba(180,70,40,0.2)' : '#1A1A1A',
                  border: m.role === 'user' ? '1px solid rgba(180,70,40,0.4)' : '1px solid #2A2A2A',
                  color: m.role === 'user' ? '#F2EDE4' : '#C8C0B0',
                }}>
                  {m.content || (loading && i === messages.length - 1 ? '…' : '')}
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Eingabe */}
          <form onSubmit={handleSend} style={{
            borderTop: '1px solid #2A2A2A',
            padding: '10px',
            display: 'flex', gap: '8px',
            flexShrink: 0,
          }}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Frage stellen..."
              disabled={loading}
              style={{
                flex: 1,
                backgroundColor: '#1A1A1A',
                border: '1px solid #2A2A2A',
                color: '#F2EDE4',
                padding: '8px 12px',
                fontSize: '0.8rem',
                outline: 'none',
              }}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              style={{
                backgroundColor: loading || !input.trim() ? '#2A2A2A' : '#B44628',
                border: 'none',
                color: '#F2EDE4',
                padding: '8px 14px',
                cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
              }}
            >→</button>
          </form>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        style={{
          position: 'fixed', bottom: '24px', right: '24px',
          width: '56px', height: '56px',
          borderRadius: '50%',
          backgroundColor: '#B44628',
          border: '2px solid rgba(242,237,228,0.15)',
          color: '#F2EDE4',
          fontSize: '1.4rem',
          cursor: 'pointer',
          zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px rgba(180,70,40,0.4)',
        }}
        title="KI-Berater"
      >
        {open ? '✕' : '🐾'}
      </button>
    </>
  )
}
