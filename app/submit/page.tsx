'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAccount } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { CATEGORIES } from '@/types'
import IPFSUploader from '@/components/upload/IPFSUploader'
import { useENSVerify } from '@/hooks/useENSVerify'

export default function SubmitPage() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { openConnectModal } = useConnectModal()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    ens_domain: '',
    name: '',
    tagline: '',
    category: CATEGORIES[0] as string,
    short_desc: '',
    long_desc: '',
    founder_name: '',
    wallet_address: '',
    contact_email: '',
    contact_telegram: '',
    contact_twitter: '',
    contact_discord: '',
    github_url: '',
    demo_url: '',
    ipfs_pitch_deck: '',
    ipfs_images: [] as string[],
    seeking_funding: false,
  })

  const { verified: ensVerified, isChecking: ensChecking } = useENSVerify(form.ens_domain)

  function set(field: string, value: unknown) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!isConnected || !address) { openConnectModal?.(); return }
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-submitter': address,
        },
        body: JSON.stringify({
          ...form,
          submitter_address: address,
          wallet_address: form.wallet_address || address,
          verified_ens_owner: ensVerified,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      router.push(`/project/${data.id}`)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Submission failed')
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="font-sora text-3xl font-bold text-[#F0F0FF] mb-2">Submit Your Project</h1>
      <p className="text-[#8888AA] mb-8">List your ENS-based project and connect with the community.</p>

      {!isConnected && (
        <div className="bg-[#1A1A26] border border-[#2A2A3E] rounded-2xl p-6 mb-8 text-center">
          <p className="text-[#8888AA] mb-4">Connect your wallet to submit a project.</p>
          <button
            onClick={() => openConnectModal?.()}
            className="px-8 py-3 rounded-full bg-[#6C63FF] text-white font-medium hover:bg-[#5A52E0] transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      )}

      {isConnected && (
        <div className="bg-green-900/20 border border-green-700/30 rounded-xl px-4 py-2 mb-6 text-xs text-green-400">
          ✓ Connected as {address?.slice(0, 6)}…{address?.slice(-4)}
        </div>
      )}

      <form onSubmit={submit} className="space-y-5">
        {/* ENS Domain */}
        <div>
          <label className="block text-sm text-[#F0F0FF] mb-1.5">ENS Domain *</label>
          <div className="relative">
            <input
              required
              placeholder="myproject.eth"
              value={form.ens_domain}
              onChange={e => set('ens_domain', e.target.value.toLowerCase())}
              className="w-full bg-[#12121A] border border-[#2A2A3E] rounded-xl px-4 py-2.5 text-sm text-[#F0F0FF] placeholder-[#8888AA] focus:outline-none focus:border-[#6C63FF] pr-24"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs">
              {ensChecking && <span className="text-[#8888AA]">checking…</span>}
              {!ensChecking && form.ens_domain && ensVerified && <span className="text-green-400">✓ owner</span>}
              {!ensChecking && form.ens_domain && !ensVerified && <span className="text-[#8888AA]">unverified</span>}
            </div>
          </div>
        </div>

        {/* Basic info */}
        {([
          { field: 'name' as const, label: 'Project Name', placeholder: 'My ENS Project', required: true },
          { field: 'founder_name' as const, label: 'Founder Name(s)', placeholder: 'Alice, Bob', required: true },
        ]).map(({ field, label, placeholder, required }) => (
          <div key={field}>
            <label className="block text-sm text-[#F0F0FF] mb-1.5">{label}{required ? ' *' : ''}</label>
            <input
              required={required}
              placeholder={placeholder}
              value={form[field]}
              onChange={e => set(field, e.target.value)}
              className="w-full bg-[#12121A] border border-[#2A2A3E] rounded-xl px-4 py-2.5 text-sm text-[#F0F0FF] placeholder-[#8888AA] focus:outline-none focus:border-[#6C63FF]"
            />
          </div>
        ))}

        {/* Tagline */}
        <div>
          <label className="block text-sm text-[#F0F0FF] mb-1.5">Tagline * <span className="text-[#8888AA]">({form.tagline.length}/100)</span></label>
          <input
            required
            maxLength={100}
            placeholder="One-line description"
            value={form.tagline}
            onChange={e => set('tagline', e.target.value)}
            className="w-full bg-[#12121A] border border-[#2A2A3E] rounded-xl px-4 py-2.5 text-sm text-[#F0F0FF] placeholder-[#8888AA] focus:outline-none focus:border-[#6C63FF]"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm text-[#F0F0FF] mb-1.5">Category *</label>
          <select
            value={form.category}
            onChange={e => set('category', e.target.value)}
            className="w-full bg-[#12121A] border border-[#2A2A3E] rounded-xl px-4 py-2.5 text-sm text-[#F0F0FF] focus:outline-none focus:border-[#6C63FF]"
          >
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Short desc */}
        <div>
          <label className="block text-sm text-[#F0F0FF] mb-1.5">Short Description * <span className="text-[#8888AA]">({form.short_desc.length}/280)</span></label>
          <textarea
            required
            maxLength={280}
            rows={3}
            placeholder="Brief overview of your project"
            value={form.short_desc}
            onChange={e => set('short_desc', e.target.value)}
            className="w-full bg-[#12121A] border border-[#2A2A3E] rounded-xl px-4 py-2.5 text-sm text-[#F0F0FF] placeholder-[#8888AA] focus:outline-none focus:border-[#6C63FF] resize-none"
          />
        </div>

        {/* Long desc */}
        <div>
          <label className="block text-sm text-[#F0F0FF] mb-1.5">Long Description * <span className="text-[#8888AA]">(markdown supported)</span></label>
          <textarea
            required
            rows={8}
            placeholder="Full description, features, roadmap…"
            value={form.long_desc}
            onChange={e => set('long_desc', e.target.value)}
            className="w-full bg-[#12121A] border border-[#2A2A3E] rounded-xl px-4 py-2.5 text-sm text-[#F0F0FF] placeholder-[#8888AA] focus:outline-none focus:border-[#6C63FF] font-mono resize-y"
          />
        </div>

        {/* Wallet address */}
        <div>
          <label className="block text-sm text-[#F0F0FF] mb-1.5">
            Donation Wallet Address *
            {isConnected && (
              <button type="button" onClick={() => set('wallet_address', address ?? '')} className="ml-2 text-xs text-[#6C63FF] hover:underline">
                use connected
              </button>
            )}
          </label>
          <input
            required
            placeholder={address ?? '0x…'}
            value={form.wallet_address}
            onChange={e => set('wallet_address', e.target.value)}
            className="w-full bg-[#12121A] border border-[#2A2A3E] rounded-xl px-4 py-2.5 text-sm font-mono text-[#F0F0FF] placeholder-[#8888AA] focus:outline-none focus:border-[#6C63FF]"
          />
        </div>

        {/* Contact */}
        <div>
          <p className="text-sm text-[#F0F0FF] mb-3">Contact (optional)</p>
          <div className="grid grid-cols-2 gap-3">
            {([
              { field: 'contact_email' as const, placeholder: 'Email' },
              { field: 'contact_telegram' as const, placeholder: 'Telegram handle' },
              { field: 'contact_twitter' as const, placeholder: 'X/Twitter handle' },
              { field: 'contact_discord' as const, placeholder: 'Discord handle' },
            ]).map(({ field, placeholder }) => (
              <input
                key={field}
                placeholder={placeholder}
                value={form[field]}
                onChange={e => set(field, e.target.value)}
                className="bg-[#12121A] border border-[#2A2A3E] rounded-xl px-4 py-2.5 text-sm text-[#F0F0FF] placeholder-[#8888AA] focus:outline-none focus:border-[#6C63FF]"
              />
            ))}
          </div>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 gap-3">
          {([
            { field: 'github_url' as const, placeholder: 'GitHub URL' },
            { field: 'demo_url' as const, placeholder: 'Demo URL' },
          ]).map(({ field, placeholder }) => (
            <input
              key={field}
              type="url"
              placeholder={placeholder}
              value={form[field]}
              onChange={e => set(field, e.target.value)}
              className="bg-[#12121A] border border-[#2A2A3E] rounded-xl px-4 py-2.5 text-sm text-[#F0F0FF] placeholder-[#8888AA] focus:outline-none focus:border-[#6C63FF]"
            />
          ))}
        </div>

        {/* File uploads */}
        <div>
          <label className="block text-sm text-[#F0F0FF] mb-1.5">Pitch Deck (PDF, optional)</label>
          <IPFSUploader
            accept={{ 'application/pdf': ['.pdf'] }}
            maxFiles={1}
            onUpload={cids => set('ipfs_pitch_deck', cids[0] ?? '')}
            label="Drop PDF or click to select (max 10MB)"
          />
        </div>

        <div>
          <label className="block text-sm text-[#F0F0FF] mb-1.5">Screenshots / Images (optional, max 5)</label>
          <IPFSUploader
            accept={{ 'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'], 'image/webp': ['.webp'], 'image/gif': ['.gif'] }}
            maxFiles={5}
            onUpload={cids => set('ipfs_images', cids)}
            label="Drop images or click to select (max 10MB each)"
          />
        </div>

        {/* Seeking funding */}
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.seeking_funding}
            onChange={e => set('seeking_funding', e.target.checked)}
            className="w-4 h-4 rounded accent-[#6C63FF]"
          />
          <span className="text-sm text-[#8888AA]">This project is actively seeking funding</span>
        </label>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 rounded-full bg-[#6C63FF] text-white font-medium hover:bg-[#5A52E0] transition-colors disabled:opacity-50"
        >
          {!isConnected ? 'Connect Wallet to Submit' : submitting ? 'Submitting…' : 'Submit Project'}
        </button>
      </form>
    </div>
  )
}
