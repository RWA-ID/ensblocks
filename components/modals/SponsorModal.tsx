'use client'

import { useState } from 'react'

const TIERS = [
  { id: 'protocol', emoji: '🥇', name: 'Protocol', price: '1 ETH/mo', perks: 'Hero placement, newsletter mention, dedicated blog post, priority listing' },
]

interface SponsorModalProps {
  onClose: () => void
  defaultTier?: string
}

export default function SponsorModal({ onClose, defaultTier = '' }: SponsorModalProps) {
  const [tier, setTier] = useState(defaultTier)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: '', company: '', email: '', message: '' })

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? ''}/api/sponsor-inquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, tier }),
    })
    setSending(false)
    setSent(true)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#12121A] border border-[#2A2A3E] rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-[#F0F0FF] font-sora font-bold text-xl">Sponsor ensblocks.eth</h2>
          <button onClick={onClose} className="text-[#8888AA] hover:text-[#F0F0FF] text-xl">✕</button>
        </div>

        {sent ? (
          <div className="text-center py-10">
            <p className="text-2xl mb-2">🎉</p>
            <p className="text-[#F0F0FF] font-semibold">Inquiry sent!</p>
            <p className="text-[#8888AA] text-sm mt-1">We&apos;ll be in touch soon.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3 mb-6">
              {TIERS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTier(t.id)}
                  className={`p-3 rounded-xl border text-left transition-colors ${
                    tier === t.id ? 'border-[#6C63FF] bg-[#6C63FF]/10' : 'border-[#2A2A3E] hover:border-[#6C63FF]/50'
                  }`}
                >
                  <div className="text-lg">{t.emoji}</div>
                  <div className="text-xs font-semibold text-[#F0F0FF] mt-1">{t.name}</div>
                  <div className="text-[10px] text-[#6C63FF] font-mono">{t.price}</div>
                  <div className="text-[10px] text-[#8888AA] mt-1">{t.perks}</div>
                </button>
              ))}
            </div>
            <form onSubmit={submit} className="space-y-3">
              {(['name', 'company', 'email'] as const).map(field => (
                <input
                  key={field}
                  required
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={form[field]}
                  onChange={e => setForm(f => ({ ...f, [field]: e.target.value }))}
                  className="w-full bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-4 py-2.5 text-sm text-[#F0F0FF] placeholder-[#8888AA] focus:outline-none focus:border-[#6C63FF]"
                />
              ))}
              <textarea
                placeholder="Message (optional)"
                rows={3}
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                className="w-full bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-4 py-2.5 text-sm text-[#F0F0FF] placeholder-[#8888AA] focus:outline-none focus:border-[#6C63FF] resize-none"
              />
              <button
                type="submit"
                disabled={sending || !tier}
                className="w-full py-3 rounded-full bg-[#6C63FF] text-white font-medium hover:bg-[#5A52E0] transition-colors disabled:opacity-50"
              >
                {sending ? 'Sending…' : 'Send Inquiry'}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
