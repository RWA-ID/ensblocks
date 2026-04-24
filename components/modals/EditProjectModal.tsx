'use client'

import { useState } from 'react'
import { useAccount } from 'wagmi'
import { Project, CATEGORIES } from '@/types'
import IPFSUploader from '@/components/upload/IPFSUploader'

interface Props {
  project: Project
  onClose: () => void
  onSaved: (updated: Project) => void
}

export default function EditProjectModal({ project, onClose, onSaved }: Props) {
  const { address } = useAccount()
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [form, setForm] = useState({
    name: project.name,
    tagline: project.tagline,
    category: project.category,
    short_desc: project.short_desc,
    long_desc: project.long_desc,
    founder_name: project.founder_name,
    wallet_address: project.wallet_address,
    contact_email: project.contact_email ?? '',
    contact_telegram: project.contact_telegram ?? '',
    contact_twitter: project.contact_twitter ?? '',
    contact_discord: project.contact_discord ?? '',
    website_url: project.website_url ?? '',
    github_url: project.github_url ?? '',
    demo_url: project.demo_url ?? '',
    ipfs_pitch_deck: project.ipfs_pitch_deck ?? '',
    ipfs_images: project.ipfs_images ?? [],
    seeking_funding: project.seeking_funding,
  })

  function set(field: string, value: unknown) {
    setForm(f => ({ ...f, [field]: value }))
  }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!address) return
    setSaving(true)
    setError('')
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? ''}/api/projects?id=${project.id}`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json', 'x-submitter': address },
          body: JSON.stringify(form),
        }
      )
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      onSaved(data)
      onClose()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Save failed')
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-[#12121A] border border-[#2A2A3E] rounded-2xl w-full max-w-2xl my-8">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2A2A3E]">
          <h2 className="font-sora text-lg font-bold text-[#F0F0FF]">Edit Project</h2>
          <button onClick={onClose} className="text-[#8888AA] hover:text-[#F0F0FF] transition-colors text-xl leading-none">✕</button>
        </div>

        <form onSubmit={save} className="p-6 space-y-5">
          {/* ENS locked */}
          <div>
            <label className="block text-sm text-[#8888AA] mb-1.5">ENS Domain (locked)</label>
            <div className="w-full bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-4 py-2.5 text-sm text-[#8888AA] font-mono">
              {project.ens_domain}
            </div>
          </div>

          {([
            { field: 'name', label: 'Project Name', required: true },
            { field: 'founder_name', label: 'Founder Name(s)', required: true },
          ] as const).map(({ field, label, required }) => (
            <div key={field}>
              <label className="block text-sm text-[#F0F0FF] mb-1.5">{label}{required ? ' *' : ''}</label>
              <input
                required={required}
                value={form[field]}
                onChange={e => set(field, e.target.value)}
                className="w-full bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-4 py-2.5 text-sm text-[#F0F0FF] placeholder-[#8888AA] focus:outline-none focus:border-[#6C63FF]"
              />
            </div>
          ))}

          <div>
            <label className="block text-sm text-[#F0F0FF] mb-1.5">Tagline * <span className="text-[#8888AA]">({form.tagline.length}/100)</span></label>
            <input
              required
              maxLength={100}
              value={form.tagline}
              onChange={e => set('tagline', e.target.value)}
              className="w-full bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-4 py-2.5 text-sm text-[#F0F0FF] placeholder-[#8888AA] focus:outline-none focus:border-[#6C63FF]"
            />
          </div>

          <div>
            <label className="block text-sm text-[#F0F0FF] mb-1.5">Category *</label>
            <select
              value={form.category}
              onChange={e => set('category', e.target.value)}
              className="w-full bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-4 py-2.5 text-sm text-[#F0F0FF] focus:outline-none focus:border-[#6C63FF]"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm text-[#F0F0FF] mb-1.5">Short Description * <span className="text-[#8888AA]">({form.short_desc.length}/280)</span></label>
            <textarea
              required
              maxLength={280}
              rows={3}
              value={form.short_desc}
              onChange={e => set('short_desc', e.target.value)}
              className="w-full bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-4 py-2.5 text-sm text-[#F0F0FF] placeholder-[#8888AA] focus:outline-none focus:border-[#6C63FF] resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-[#F0F0FF] mb-1.5">Long Description * <span className="text-[#8888AA]">(markdown supported)</span></label>
            <textarea
              required
              rows={8}
              value={form.long_desc}
              onChange={e => set('long_desc', e.target.value)}
              className="w-full bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-4 py-2.5 text-sm text-[#F0F0FF] placeholder-[#8888AA] focus:outline-none focus:border-[#6C63FF] font-mono resize-y"
            />
          </div>

          <div>
            <label className="block text-sm text-[#F0F0FF] mb-1.5">Donation Wallet *</label>
            <input
              required
              value={form.wallet_address}
              onChange={e => set('wallet_address', e.target.value)}
              className="w-full bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-4 py-2.5 text-sm text-[#F0F0FF] font-mono placeholder-[#8888AA] focus:outline-none focus:border-[#6C63FF]"
            />
          </div>

          <div>
            <p className="text-sm text-[#F0F0FF] mb-3">Contact (optional)</p>
            <div className="grid grid-cols-2 gap-3">
              {([
                { field: 'contact_email', placeholder: 'Email' },
                { field: 'contact_telegram', placeholder: 'Telegram handle' },
                { field: 'contact_twitter', placeholder: 'X handle (no @)' },
                { field: 'contact_discord', placeholder: 'Discord handle' },
              ] as const).map(({ field, placeholder }) => (
                <input
                  key={field}
                  placeholder={placeholder}
                  value={form[field]}
                  onChange={e => set(field, e.target.value)}
                  className="bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-4 py-2.5 text-sm text-[#F0F0FF] placeholder-[#8888AA] focus:outline-none focus:border-[#6C63FF]"
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {([
              { field: 'website_url', placeholder: 'Project Website URL (https://…)' },
              { field: 'github_url', placeholder: 'GitHub URL (optional)' },
              { field: 'demo_url', placeholder: 'Live Demo URL (optional)' },
            ] as const).map(({ field, placeholder }) => (
              <input
                key={field}
                type="url"
                placeholder={placeholder}
                value={form[field]}
                onChange={e => set(field, e.target.value)}
                className="bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-4 py-2.5 text-sm text-[#F0F0FF] placeholder-[#8888AA] focus:outline-none focus:border-[#6C63FF]"
              />
            ))}
          </div>

          <div>
            <label className="block text-sm text-[#F0F0FF] mb-1.5">Pitch Deck (PDF, optional)</label>
            <IPFSUploader
              accept={{ 'application/pdf': ['.pdf'] }}
              maxFiles={1}
              onUpload={cids => set('ipfs_pitch_deck', cids[0] ?? '')}
              label={form.ipfs_pitch_deck ? '✓ Uploaded — drop new PDF to replace' : 'Drop PDF or click to select (max 10MB)'}
            />
          </div>

          <div>
            <label className="block text-sm text-[#F0F0FF] mb-1.5">Screenshots / Images (optional, max 5)</label>
            <IPFSUploader
              accept={{ 'image/png': ['.png'], 'image/jpeg': ['.jpg', '.jpeg'], 'image/webp': ['.webp'], 'image/gif': ['.gif'] }}
              maxFiles={5}
              onUpload={cids => set('ipfs_images', cids)}
              label={form.ipfs_images.length ? `✓ ${form.ipfs_images.length} image(s) — drop new to replace` : 'Drop images or click to select (max 10MB each)'}
            />
          </div>

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
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
