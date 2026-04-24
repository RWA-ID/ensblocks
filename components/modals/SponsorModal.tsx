'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL ?? ''

// ── icons ──────────────────────────────────────────────────────────────────

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

function ArrowIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  )
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-[18px] h-[18px]" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 16V4M7 9l5-5 5 5" />
      <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1" />
      <path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1" />
    </svg>
  )
}

// ── field primitives ───────────────────────────────────────────────────────

function FieldLabel({ children, hint }: { children: React.ReactNode; hint?: string }) {
  return (
    <div className="flex items-baseline justify-between mb-2">
      <label className="text-[11px] tracking-[0.18em] uppercase text-white/50 font-medium">{children}</label>
      {hint && <span className="text-[10px] text-white/30 tracking-wide">{hint}</span>}
    </div>
  )
}

function TextField({ label, hint, placeholder, type = 'text', value, onChange, prefix }: {
  label: string; hint?: string; placeholder: string; type?: string
  value: string; onChange: (v: string) => void; prefix?: string
}) {
  return (
    <div>
      <FieldLabel hint={hint}>{label}</FieldLabel>
      <div className="sm-field relative flex items-center rounded-xl">
        {prefix && <span className="pl-3.5 pr-1 text-white/40 text-sm font-mono select-none">{prefix}</span>}
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent px-3.5 py-3 text-[14.5px] text-white placeholder:text-white/25 outline-none"
        />
      </div>
    </div>
  )
}

function TextArea({ label, hint, placeholder, value, onChange, maxLength = 300 }: {
  label: string; hint?: string; placeholder: string
  value: string; onChange: (v: string) => void; maxLength?: number
}) {
  return (
    <div>
      <FieldLabel hint={hint}>{label}</FieldLabel>
      <div className="sm-field relative rounded-xl">
        <textarea
          value={value}
          onChange={e => onChange(e.target.value.slice(0, maxLength))}
          placeholder={placeholder}
          rows={3}
          className="w-full bg-transparent px-3.5 py-3 text-[14.5px] text-white placeholder:text-white/25 outline-none resize-none"
        />
        <div className="px-3.5 pb-2 flex justify-end">
          <span className="text-[10px] text-white/25 font-mono tabular-nums">{value.length}/{maxLength}</span>
        </div>
      </div>
    </div>
  )
}

// ── logo field ─────────────────────────────────────────────────────────────

function LogoField({ mode, setMode, url, setUrl, file, setFile }: {
  mode: 'upload' | 'url'; setMode: (m: 'upload' | 'url') => void
  url: string; setUrl: (v: string) => void
  file: File | null; setFile: (f: File | null) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [drag, setDrag] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    if (!file) { setPreview(null); return }
    const u = URL.createObjectURL(file)
    setPreview(u)
    return () => URL.revokeObjectURL(u)
  }, [file])

  const handleFiles = (files: FileList | null) => {
    const f = files?.[0]
    if (f) setFile(f)
  }

  return (
    <div>
      <div className="flex items-baseline justify-between mb-2">
        <label className="text-[11px] tracking-[0.18em] uppercase text-white/50 font-medium">Logo</label>
        <div className="sm-tabs inline-flex p-[3px] rounded-full text-[11px]">
          {(['upload', 'url'] as const).map(m => (
            <button key={m} type="button" onClick={() => setMode(m)}
              className={`px-2.5 py-1 rounded-full transition capitalize ${mode === m ? 'bg-white/10 text-white' : 'text-white/45 hover:text-white/70'}`}>
              {m === 'upload' ? 'Upload' : 'URL'}
            </button>
          ))}
        </div>
      </div>

      {mode === 'upload' ? (
        <div
          onDragOver={e => { e.preventDefault(); setDrag(true) }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files) }}
          onClick={() => inputRef.current?.click()}
          className={`sm-drop relative rounded-xl cursor-pointer overflow-hidden ${drag ? 'sm-drop--drag' : ''}`}
        >
          <input ref={inputRef} type="file" accept="image/png,image/jpeg,image/svg+xml,image/webp"
            className="hidden" onChange={e => handleFiles(e.target.files)} />
          {file ? (
            <div className="flex items-center gap-3 p-3">
              <div className="sm-logo-preview w-14 h-14 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                {preview && <img src={preview} alt="" className="max-w-full max-h-full object-contain" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] text-white truncate">{file.name}</div>
                <div className="text-[11px] text-white/35 mt-0.5 font-mono">
                  {(file.size / 1024).toFixed(1)} KB · {file.type.split('/')[1]?.toUpperCase() || 'IMG'}
                </div>
              </div>
              <button type="button" onClick={e => { e.stopPropagation(); setFile(null) }}
                className="text-white/40 hover:text-white/90 p-1.5 rounded-md hover:bg-white/5 transition flex-shrink-0">
                <XIcon />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3 p-3.5">
              <div className="sm-upload-icon w-10 h-10 rounded-lg flex items-center justify-center text-[#9B8CFF] flex-shrink-0">
                <UploadIcon />
              </div>
              <div className="min-w-0">
                <div className="text-[13.5px] text-white/85">Drop logo or <span className="text-[#9B8CFF]">browse</span></div>
                <div className="text-[11px] text-white/35 mt-0.5">SVG, PNG, JPG · up to 2 MB · 1:1 square preferred</div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="sm-field relative flex items-center rounded-xl">
          <span className="pl-3.5 text-white/35"><LinkIcon /></span>
          <input type="url" value={url} onChange={e => setUrl(e.target.value)}
            placeholder="https://yourprotocol.xyz/logo.svg"
            className="w-full bg-transparent px-3 py-3 text-[14.5px] text-white placeholder:text-white/25 outline-none" />
        </div>
      )}
    </div>
  )
}

// ── slot preview ───────────────────────────────────────────────────────────

function SlotPreview({ name, logoPreview }: { name: string; logoPreview: string | null }) {
  const initial = name.trim().charAt(0).toUpperCase()
  return (
    <div className="sm-preview relative rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-[9.5px] tracking-[0.22em] uppercase text-white/35 font-medium">Your slot · live preview</span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] shadow-[0_0_8px_#00D4FF]" />
          <span className="text-[10px] text-white/40 font-mono tracking-wide">1 of 4</span>
        </div>
      </div>
      <div className="sm-slot relative rounded-[16px] p-4 min-h-[120px] flex flex-col justify-between">
        <div className="flex items-start justify-between">
          <div className="text-[9.5px] tracking-[0.22em] uppercase text-white/35">Slot 04</div>
          <div className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] shadow-[0_0_8px_#00D4FF]" />
        </div>
        <div className="flex items-center justify-center py-1.5">
          {logoPreview ? (
            <img src={logoPreview} alt="" className="max-h-10 max-w-[70%] object-contain" />
          ) : (
            <div className="sm-slot-mono flex items-center justify-center w-11 h-11 rounded-lg">
              <span className="font-display font-black text-xl text-white/30">{initial || '◇'}</span>
            </div>
          )}
        </div>
        <div className="text-[11px] text-white/70 text-center tracking-wide truncate">
          {name ? name : <span className="text-white/25">Your protocol</span>}
        </div>
      </div>
    </div>
  )
}

// ── success state ──────────────────────────────────────────────────────────

function SuccessState({ onClose }: { onClose: () => void }) {
  return (
    <div className="relative px-2 py-10 text-center">
      <div className="sm-success-ring mx-auto w-14 h-14 rounded-full flex items-center justify-center mb-5">
        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="#00D4FF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12l5 5L20 7" />
        </svg>
      </div>
      <h3 className="font-display font-semibold text-white text-lg tracking-tight">Inquiry received</h3>
      <p className="mt-2 text-[13.5px] text-white/55 max-w-sm mx-auto leading-relaxed">
        We got it. You&apos;ll hear back within 2 business days with availability and next steps.
      </p>
      <button onClick={onClose}
        className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-[13px] transition">
        Close
      </button>
    </div>
  )
}

// ── shared form body ───────────────────────────────────────────────────────

export function SponsorForm({ onSuccess, onCancel }: { onSuccess?: () => void; onCancel?: () => void }) {
  const [form, setForm] = useState({ name: '', url: '', email: '', message: '' })
  const [logoMode, setLogoMode] = useState<'upload' | 'url'>('upload')
  const [logoUrl, setLogoUrl] = useState('')
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (logoMode === 'upload' && logoFile) {
      const u = URL.createObjectURL(logoFile)
      setLogoPreview(u)
      return () => URL.revokeObjectURL(u)
    }
    if (logoMode === 'url' && logoUrl) { setLogoPreview(logoUrl); return }
    setLogoPreview(null)
  }, [logoMode, logoFile, logoUrl])

  const update = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }))

  const canSubmit = !!(form.name.trim() && form.url.trim() && form.email.trim() &&
    (logoFile != null || logoUrl.trim()))

  const submit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit || submitting) return
    setSubmitting(true)
    await fetch(`${API}/api/sponsor-inquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        url: form.url,
        logo_url: logoFile ? `[file:${logoFile.name}]` : logoUrl,
        message: form.message,
      }),
    }).catch(() => {})
    setSubmitting(false)
    setSubmitted(true)
    onSuccess?.()
  }, [form, logoFile, logoUrl, canSubmit, submitting, onSuccess])

  if (submitted) return <SuccessState onClose={onCancel ?? (() => {})} />

  return (
    <form onSubmit={submit} className="space-y-4">
      <SlotPreview name={form.name} logoPreview={logoPreview} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
        <TextField label="Protocol / Company" placeholder="Acme Protocol" value={form.name} onChange={update('name')} />
        <TextField label="Contact Email" placeholder="team@acme.xyz" type="email" value={form.email} onChange={update('email')} />
      </div>

      <TextField label="Destination URL" hint="Where the slot links to" placeholder="yourprotocol.xyz" prefix="https://" value={form.url} onChange={update('url')} />

      <LogoField mode={logoMode} setMode={setLogoMode} url={logoUrl} setUrl={setLogoUrl} file={logoFile} setFile={setLogoFile} />

      <TextArea label="Message" hint="Optional" placeholder="Timing, questions, anything you'd like us to know…" value={form.message} onChange={update('message')} />

      <div className="pt-3 flex items-center justify-between gap-4">
        <p className="text-[11px] text-white/35 leading-snug">
          We&apos;ll reply within 2 business days.<br />
          No tiers, no newsletter, no hero placement.
        </p>
        <button type="submit" disabled={!canSubmit || submitting}
          className={`sm-submit group relative inline-flex items-center gap-2 px-5 py-3 rounded-full text-white font-medium text-[13.5px] tracking-wide transition whitespace-nowrap ${!canSubmit || submitting ? 'sm-submit--disabled' : ''}`}>
          <span className="relative z-10">{submitting ? 'Sending…' : 'Apply for a Sponsor Slot'}</span>
          {!submitting && <ArrowIcon />}
        </button>
      </div>
    </form>
  )
}

// ── modal wrapper ──────────────────────────────────────────────────────────

export default function SponsorModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false)

  return (
    <div className="sm-backdrop fixed inset-0 z-50 flex items-start sm:items-center justify-center p-4 sm:p-6">
      <div className="fixed inset-0 bg-[#05050A]/80 backdrop-blur-[6px]" onClick={onClose} />

      <div role="dialog" aria-labelledby="sm-title"
        className="sm-modal sm-modal-scroll relative w-full max-w-[560px] rounded-[22px] my-auto">
        <div className="sm-frame absolute inset-0 pointer-events-none rounded-[22px]" />

        <div className="relative bg-[#141421] rounded-[22px] overflow-hidden">
          <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden" style={{
            background: 'radial-gradient(420px 180px at 90% -40%, rgba(0,212,255,0.18), transparent 60%), radial-gradient(420px 200px at 0% -30%, rgba(108,99,255,0.22), transparent 60%)',
          }} />

          <div className="relative px-7 pt-6 pb-5 flex items-start justify-between gap-6">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 mb-3 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-white/60 text-[10px] tracking-[0.22em] uppercase">
                <span className="w-1 h-1 rounded-full bg-[#6C63FF]" />
                Sponsor Inquiry
              </div>
              <h2 id="sm-title" className="font-display font-semibold text-white text-[22px] tracking-tight leading-tight">
                Apply for a <span className="sm-grad">Sponsor Slot</span>
              </h2>
              <p className="mt-1.5 text-[13px] text-white/50 leading-relaxed">
                One dedicated tile in the Protocol Sponsors grid — your logo, your link.
              </p>
            </div>
            <button onClick={onClose} className="sm-close flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white/60 hover:text-white transition" aria-label="Close">
              <XIcon />
            </button>
          </div>

          <div className="relative h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="relative px-7 pt-6 pb-6">
            {submitted
              ? <SuccessState onClose={onClose} />
              : <SponsorForm onSuccess={() => setSubmitted(true)} onCancel={onClose} />}
          </div>
        </div>
      </div>
    </div>
  )
}
