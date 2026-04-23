'use client'

import { useRef, useState } from 'react'

const TIERS = [
  { id: 'protocol', emoji: '🥇', name: 'Protocol Sponsor', price: '1 ETH/mo', spots: 5, perks: ['Logo in the Protocol Sponsors section on homepage', 'Permanent placement for the duration of sponsorship', 'Only 5 spots available'] },
]

export default function SponsorPage() {
  const formRef = useRef<HTMLDivElement>(null)
  const [tier, setTier] = useState('')
  const [result, setResult] = useState('')

  function selectTier(id: string) {
    setTier(id)
    formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setResult('Sending…')
    const formData = new FormData(e.currentTarget)
    formData.append('access_key', '746aef4e-9fa2-4942-af24-c7c983fc727e')
    formData.append('subject', `New Sponsor Inquiry: ${tier} tier`)

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      body: formData,
    })
    const data = await response.json()
    if (data.success) {
      setResult('success')
      ;(e.target as HTMLFormElement).reset()
      setTier('')
    } else {
      setResult('error')
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-12">
        <h1 className="font-sora text-4xl font-extrabold text-[#F0F0FF] mb-3">Sponsor ensblocks.eth</h1>
        <p className="text-[#8888AA] text-lg">Reach ENS builders, founders, and the Web3 community.</p>
      </div>

      {/* Tier cards */}
      <div className="flex justify-center mb-16">
        {TIERS.map(t => (
          <div
            key={t.id}
            className={`bg-[#1A1A26] border rounded-2xl p-6 flex flex-col transition-all w-full max-w-sm ${
              tier === t.id ? 'border-[#6C63FF] shadow-[0_0_20px_rgba(108,99,255,0.2)]' : 'border-[#2A2A3E]'
            }`}
          >
            <div className="text-3xl mb-3">{t.emoji}</div>
            <h3 className="font-sora font-bold text-[#F0F0FF] text-lg">{t.name}</h3>
            <p className="text-[#6C63FF] font-mono text-sm mb-3">{t.price}</p>
            <ul className="space-y-1.5 mb-6 flex-1">
              {t.perks.map(p => (
                <li key={p} className="text-xs text-[#8888AA] flex items-start gap-2">
                  <span className="text-[#6C63FF] mt-0.5">✓</span> {p}
                </li>
              ))}
            </ul>
            <button
              onClick={() => selectTier(t.id)}
              className="py-2.5 rounded-full bg-[#6C63FF] text-white text-sm font-medium hover:bg-[#5A52E0] transition-colors"
            >
              Get Started
            </button>
          </div>
        ))}
      </div>

      {/* Contact form */}
      <div ref={formRef} className="bg-[#12121A] border border-[#2A2A3E] rounded-2xl p-8 max-w-lg mx-auto">
        <h2 className="font-sora font-bold text-[#F0F0FF] text-xl mb-6">Get in Touch</h2>

        {result === 'success' ? (
          <div className="text-center py-8">
            <p className="text-3xl mb-3">🎉</p>
            <p className="text-[#F0F0FF] font-semibold">Inquiry sent!</p>
            <p className="text-[#8888AA] text-sm mt-1">We&apos;ll reach out within 48 hours.</p>
            <button
              onClick={() => setResult('')}
              className="mt-4 text-xs text-[#6C63FF] hover:underline"
            >
              Send another
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            {/* Hidden tier field passed to Web3Forms */}
            <input type="hidden" name="tier" value={tier} />

            {/* Tier selector */}
            <div className="grid grid-cols-3 gap-2">
              {TIERS.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTier(t.id)}
                  className={`py-1.5 rounded-lg border text-xs transition-colors ${
                    tier === t.id ? 'border-[#6C63FF] bg-[#6C63FF]/10 text-[#6C63FF]' : 'border-[#2A2A3E] text-[#8888AA]'
                  }`}
                >
                  {t.emoji} {t.name}
                </button>
              ))}
            </div>

            <input
              type="text"
              name="name"
              required
              placeholder="Name"
              className="w-full bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-4 py-2.5 text-sm text-[#F0F0FF] placeholder-[#8888AA] focus:outline-none focus:border-[#6C63FF]"
            />
            <input
              type="text"
              name="company"
              required
              placeholder="Company / Project"
              className="w-full bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-4 py-2.5 text-sm text-[#F0F0FF] placeholder-[#8888AA] focus:outline-none focus:border-[#6C63FF]"
            />
            <input
              type="email"
              name="email"
              required
              placeholder="Email"
              className="w-full bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-4 py-2.5 text-sm text-[#F0F0FF] placeholder-[#8888AA] focus:outline-none focus:border-[#6C63FF]"
            />
            <textarea
              name="message"
              rows={3}
              placeholder="Message (optional)"
              className="w-full bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-4 py-2.5 text-sm text-[#F0F0FF] placeholder-[#8888AA] focus:outline-none focus:border-[#6C63FF] resize-none"
            />

            {result === 'error' && (
              <p className="text-red-400 text-xs">Something went wrong. Please try again.</p>
            )}

            <button
              type="submit"
              disabled={!tier || result === 'Sending…'}
              className="w-full py-3 rounded-full bg-[#6C63FF] text-white font-medium hover:bg-[#5A52E0] transition-colors disabled:opacity-50"
            >
              {result === 'Sending…' ? 'Sending…' : 'Send Inquiry'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
