'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { BuilderProfile } from '@/types/builder'
import IPFSUploader from '@/components/upload/IPFSUploader'

interface Props {
  profile: BuilderProfile | null
  onClose: () => void
  onSaved: (profile: BuilderProfile) => void
}

const IPFS = 'https://gateway.pinata.cloud/ipfs'

export default function BuilderProfileEditModal({ profile, onClose, onSaved }: Props) {
  const { address } = useAccount()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    display_name: profile?.display_name ?? '',
    bio: profile?.bio ?? '',
    avatar_ipfs: profile?.avatar_ipfs ?? '',
    twitter: profile?.twitter ?? '',
    github: profile?.github ?? '',
    telegram: profile?.telegram ?? '',
    discord: profile?.discord ?? '',
    website: profile?.website ?? '',
  })

  function set(field: string, value: string) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!address) return
    setSaving(true)
    setError('')
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL ?? ''}/api/builder-profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-submitter': address },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onSaved(data)
      onClose()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed')
      setSaving(false)
    }
  }

  const avatarPreview = form.avatar_ipfs ? `${IPFS}/${form.avatar_ipfs}` : null

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-[#12121A] border border-[#2A2A3E] rounded-2xl w-full max-w-md my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A3E]">
          <h2 className="font-sora text-lg font-bold text-[#F0F0FF]">Builder Profile</h2>
          <button onClick={onClose} className="text-[#8888AA] hover:text-[#F0F0FF] transition-colors text-xl leading-none">✕</button>
        </div>

        <form onSubmit={save} className="p-6 space-y-5">
          {/* Avatar */}
          <div>
            <label className="block text-sm text-[#F0F0FF] mb-2">Profile Picture</label>
            <div className="flex items-center gap-4 mb-3">
              {avatarPreview ? (
                <img src={avatarPreview} alt="" className="w-16 h-16 rounded-full object-cover border border-[#2A2A3E]" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#2A2A3E] flex items-center justify-center text-[#6C63FF] font-bold text-xl">
                  {(form.display_name || address || '?').charAt(0).toUpperCase()}
                </div>
              )}
              <div className="flex-1">
                <IPFSUploader
                  accept={{ 'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'], 'image/webp': ['.webp'] }}
                  maxFiles={1}
                  onUpload={cids => set('avatar_ipfs', cids[0] ?? '')}
                  label="Upload photo"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm text-[#F0F0FF] mb-1.5">Display Name</label>
            <input
              placeholder="Your name or handle"
              value={form.display_name}
              onChange={e => set('display_name', e.target.value)}
              className="w-full bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-4 py-2.5 text-sm text-[#F0F0FF] placeholder-[#8888AA] focus:outline-none focus:border-[#6C63FF]"
            />
          </div>

          <div>
            <label className="block text-sm text-[#F0F0FF] mb-1.5">Bio <span className="text-[#8888AA]">({form.bio.length}/200)</span></label>
            <textarea
              maxLength={200}
              rows={3}
              placeholder="A short bio about you or your team…"
              value={form.bio}
              onChange={e => set('bio', e.target.value)}
              className="w-full bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-4 py-2.5 text-sm text-[#F0F0FF] placeholder-[#8888AA] focus:outline-none focus:border-[#6C63FF] resize-none"
            />
          </div>

          <div>
            <p className="text-sm text-[#F0F0FF] mb-3">Socials (optional)</p>
            <div className="space-y-3">
              {([
                { field: 'twitter',  placeholder: 'X / Twitter handle (no @)' },
                { field: 'github',   placeholder: 'GitHub username' },
                { field: 'telegram', placeholder: 'Telegram handle' },
                { field: 'discord',  placeholder: 'Discord handle' },
                { field: 'website',  placeholder: 'Personal website (https://…)' },
              ] as const).map(({ field, placeholder }) => (
                <input
                  key={field}
                  placeholder={placeholder}
                  value={form[field]}
                  onChange={e => set(field, e.target.value)}
                  className="w-full bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-4 py-2.5 text-sm text-[#F0F0FF] placeholder-[#8888AA] focus:outline-none focus:border-[#6C63FF]"
                />
              ))}
            </div>
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-full border border-[#2A2A3E] text-[#8888AA] text-sm hover:border-[#F0F0FF] hover:text-[#F0F0FF] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-full bg-[#6C63FF] text-white text-sm font-medium hover:bg-[#5A52E0] transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
