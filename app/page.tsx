'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import { Project } from '@/types'
import DonateButton from '@/components/donate/DonateButton'
import ProtocolSponsors from '@/components/sponsor/ProtocolSponsors'

const API = process.env.NEXT_PUBLIC_API_URL ?? ''
const PLATFORM_WALLET = process.env.NEXT_PUBLIC_PLATFORM_WALLET ?? ''

interface Stats { totalProjects: number; totalDonated: number; fundedProjects: number }

// ── helpers ────────────────────────────────────────────────────────────────

const CATEGORY_PALETTES: Record<string, [string, string, string]> = {
  AI:             ['#9B8CFF', '#6C63FF', '#00D4FF'],
  DeFi:           ['#1EE6B4', '#00D4FF', '#6C63FF'],
  Identity:       ['#6C63FF', '#9B8CFF', '#00D4FF'],
  Gaming:         ['#FF7AB6', '#FFB56C', '#6C63FF'],
  Infrastructure: ['#00D4FF', '#6C63FF', '#1EE6B4'],
  DAO:            ['#FFB56C', '#FF7AB6', '#6C63FF'],
  NFT:            ['#FF7AB6', '#6C63FF', '#00D4FF'],
  Social:         ['#FFB56C', '#FF7AB6', '#6C63FF'],
  Other:          ['#6C63FF', '#9B8CFF', '#00D4FF'],
}
const CATEGORY_GLYPHS: Record<string, string> = {
  AI: '◈', DeFi: '◎', Identity: '⬡', Gaming: '◆',
  Infrastructure: '⬢', DAO: '✦', NFT: '◐', Social: '≈', Other: '◇',
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const h = Math.floor(diff / 3600000)
  if (h < 1) return 'just now'
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d < 7) return `${d}d ago`
  return `${Math.floor(d / 7)}w ago`
}

// ── count-up hook ──────────────────────────────────────────────────────────

function useCountUp(target: number, duration = 1600, decimals = 0) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    if (target === 0) return
    started.current = false
    const el = ref.current
    if (!el) return

    const run = () => {
      if (started.current) return
      started.current = true
      const t0 = performance.now()
      const tick = (t: number) => {
        const p = Math.min(1, (t - t0) / duration)
        const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p)
        setVal(target * eased)
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }

    const obs = new IntersectionObserver(
      (entries) => { entries.forEach(e => { if (e.isIntersecting) run() }) },
      { threshold: 0.3 }
    )
    obs.observe(el)
    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight) run()
    return () => obs.disconnect()
  }, [target, duration])

  const display = decimals > 0 ? val.toFixed(decimals) : Math.floor(val).toLocaleString()
  return [display, ref] as const
}

// ── ProjectArt ─────────────────────────────────────────────────────────────

function ProjectArt({ palette, glyph, large }: { palette: [string,string,string]; glyph: string; large?: boolean }) {
  const [a, b, c] = palette
  return (
    <div className={`relative w-full overflow-hidden ${large ? 'aspect-[5/3]' : 'aspect-[4/3]'} ${large ? 'rounded-t-[18px]' : 'rounded-t-[20px]'}`}>
      <div className="absolute inset-0" style={{
        background: `radial-gradient(120% 90% at 20% 10%, ${a}, transparent 55%), radial-gradient(120% 90% at 90% 85%, ${b}, transparent 60%), linear-gradient(140deg, ${c}22, #0D0D14)`,
      }} />
      <div className="absolute inset-0 opacity-40 mix-blend-overlay" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px)',
        backgroundSize: large ? '22px 22px' : '28px 28px',
      }} />
      <div className={`absolute font-display font-black text-white/90 select-none leading-none ${large ? 'right-2 bottom-0' : '-right-4 -bottom-6'}`} style={{ fontSize: large ? 90 : 160 }}>
        {glyph}
      </div>
      <div className="absolute inset-0 hero-noise opacity-[0.08] mix-blend-overlay" />
    </div>
  )
}

// ── Hero ───────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="absolute inset-0 bg-[#0D0D14]" />
        <div className="absolute inset-0 opacity-[0.18]" style={{
          backgroundImage: 'linear-gradient(rgba(108,99,255,.12) 1px, transparent 1px), linear-gradient(90deg, rgba(108,99,255,.12) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, #000 20%, transparent 75%)',
          WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 40%, #000 20%, transparent 75%)',
        }} />
        <div className="hero-aurora hero-aurora-a" />
        <div className="hero-aurora hero-aurora-b" />
        <div className="hero-aurora hero-aurora-c" />
        <div className="absolute inset-0 opacity-[0.06] mix-blend-overlay hero-noise" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-[#0D0D14]" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-28 sm:pt-32 sm:pb-36 flex flex-col items-center text-center">
        <div className="hero-chip inline-flex items-center gap-2 text-xs tracking-[0.22em] uppercase text-white/70 px-4 py-2 rounded-full mb-10">
          <span className="hero-chip-dot" />
          ensblocks.eth <span className="text-white/30">·</span> v1 Launch
        </div>

        <h1 className="font-display font-black leading-[0.95] tracking-[-0.035em] text-[clamp(44px,8vw,104px)] max-w-5xl">
          <span className="block text-white/95">The Showcase Layer</span>
          <span className="block hero-shimmer">For ENS Builders</span>
        </h1>

        <p className="mt-8 text-white/60 text-lg sm:text-xl max-w-xl">
          Discover, fund, and support the projects redefining what an Ethereum-native name can do.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4">
          <Link href="/explore" className="btn-primary group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium text-white">
            <span>Explore Projects</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:translate-x-0.5">
              <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
          <Link href="/submit" className="btn-ghost group inline-flex items-center gap-2 px-7 py-3.5 rounded-full font-medium text-white/90">
            <span>Submit Yours</span>
            <span className="text-[#00D4FF] transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] tracking-[0.22em] uppercase text-white/40">
          <span className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] shadow-[0_0_10px_#00D4FF]" />
            Decentralized
          </span>
          <span className="text-white/15">/</span>
          <span className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6C63FF] shadow-[0_0_10px_#6C63FF]" />
            IPFS-hosted
          </span>
          <span className="text-white/15">/</span>
          <span className="inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white/70" />
            ENS-native
          </span>
        </div>
      </div>
    </section>
  )
}

// ── Stat cell ──────────────────────────────────────────────────────────────

function StatCell({ icon, value, decimals = 0, suffix, label, sub, accent }: {
  icon: React.ReactNode; value: number; decimals?: number
  suffix?: string; label: string; sub: string; accent: string
}) {
  const [display, ref] = useCountUp(value, 1600, decimals)
  return (
    <div ref={ref} className="group relative p-8 sm:p-10 transition-colors hover:bg-white/[0.02]">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex items-center justify-center w-9 h-9 rounded-lg text-base" style={{
          background: `linear-gradient(140deg, ${accent}22, transparent)`,
          boxShadow: `inset 0 0 0 1px ${accent}33`,
          color: accent,
        }}>
          {icon}
        </div>
        <div className="text-[11px] uppercase tracking-[0.22em] text-white/45">{label}</div>
      </div>
      <div className="flex items-baseline gap-2">
        <div className="font-display font-black tracking-[-0.03em] text-[56px] sm:text-[64px] leading-none text-white">{display}</div>
        {suffix && <div className="text-2xl font-display font-semibold text-white/50">{suffix}</div>}
      </div>
      <div className="mt-3 text-sm text-white/50">{sub}</div>
    </div>
  )
}

function StatsBar({ stats }: { stats: Stats | null }) {
  if (!stats) return null
  const fundingRate = stats.totalProjects > 0
    ? `${Math.round((stats.fundedProjects / stats.totalProjects) * 100)}% funding rate`
    : 'Receiving donations'

  return (
    <section className="relative z-10 -mt-20 sm:-mt-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="stats-card relative rounded-[28px] p-1">
          <div className="relative rounded-[24px] bg-[#12121C]/80 backdrop-blur-xl overflow-hidden">
            <div className="absolute inset-0 opacity-[0.4] pointer-events-none" style={{
              background: 'radial-gradient(1200px 300px at 0% 0%, rgba(108,99,255,0.18), transparent 60%), radial-gradient(900px 300px at 100% 100%, rgba(0,212,255,0.14), transparent 55%)',
            }} />
            <div className="relative grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-white/[0.06]">
              <StatCell
                icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M2 6l6-3 6 3v7H2V6z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/><path d="M6 13V9h4v4" stroke="currentColor" strokeWidth="1.4"/></svg>}
                value={stats.totalProjects}
                label="Projects Listed"
                sub="Live on ensblocks.eth"
                accent="#6C63FF"
              />
              <StatCell
                icon={<span style={{ fontFamily: 'ui-serif,Georgia,serif', fontWeight: 700 }}>Ξ</span>}
                value={stats.totalDonated}
                decimals={3}
                suffix="ETH"
                label="Total Donated"
                sub="To ENS builders"
                accent="#00D4FF"
              />
              <StatCell
                icon={<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8.5l3 3 7-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                value={stats.fundedProjects}
                label="Projects Funded"
                sub={fundingRate}
                accent="#9B8CFF"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Featured Projects ──────────────────────────────────────────────────────

function FeaturedCard({ project }: { project: Project }) {
  const palette = CATEGORY_PALETTES[project.category] ?? CATEGORY_PALETTES.Other
  const glyph = CATEGORY_GLYPHS[project.category] ?? '◇'
  const coverImage = project.ipfs_images?.[0]

  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${project.name} (${project.ens_domain}) on ensblocks.eth!\n\n"${project.tagline}"\n\nhttps://ensblocks.eth.limo/project?id=${project.id}`)}`

  return (
    <Link href={`/project?id=${project.id}`} className="relative group block">
      <article className="featured-card relative shrink-0 w-[340px] sm:w-[380px] rounded-[22px] overflow-hidden">
        {coverImage ? (
          <img src={`https://gateway.pinata.cloud/ipfs/${coverImage}`} alt={project.name} className="w-full aspect-[4/3] object-cover" />
        ) : (
          <ProjectArt palette={palette} glyph={glyph} />
        )}
        <div className="p-5">
          <div className="flex items-center justify-between gap-3 mb-2">
            <div className="text-sm font-mono text-white/70">{project.ens_domain}</div>
            <span className="px-2 py-0.5 rounded-full text-[10px] tracking-widest uppercase bg-white/5 text-white/60 border border-white/10">
              {project.category}
            </span>
          </div>
          <h3 className="font-display font-semibold text-white text-xl leading-tight tracking-tight">{project.name}</h3>
          <p className="mt-2 text-sm text-white/55 leading-relaxed line-clamp-2">{project.tagline}</p>
          <div className="mt-5 flex items-center justify-between pt-4 border-t border-white/[0.06]">
            <div className="flex items-center gap-1.5 text-white/80">
              <span className="text-[#00D4FF] font-display">Ξ</span>
              <span className="font-display font-semibold">{Number(project.donation_total).toFixed(3)}</span>
              <span className="text-white/40 text-xs">donated</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-xs text-white/50">{project.founder_name}</div>
              <a
                href={shareUrl}
                target="_blank"
                rel="noreferrer"
                onClick={e => e.stopPropagation()}
                className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full border border-white/10 text-white/40 hover:border-white/30 hover:text-white/70 transition-colors"
              >
                𝕏 Share
              </a>
            </div>
          </div>
        </div>
      </article>
    </Link>
  )
}

function FeaturedProjects({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null
  return (
    <section className="relative mt-28 sm:mt-36">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 top-0 h-full" style={{
          background: 'radial-gradient(1400px 500px at 50% 0%, rgba(108,99,255,0.10), transparent 60%)',
        }} />
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#2A2A3E] to-transparent" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6 pt-14">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-[#6C63FF]/10 border border-[#6C63FF]/30 text-[#9B8CFF] text-xs tracking-[0.22em] uppercase">
              <svg width="11" height="13" viewBox="0 0 11 13" fill="none"><path d="M5.5 0s2 2.5 2 4.5-1 2.5-1 2.5 3 .5 3 3.5-2.5 4-4 4-4-1-4-4 2-4 2-5-.5-2.5 0-4 2-1.5 2-1.5z" fill="currentColor"/></svg>
              Spotlight
            </div>
            <h2 className="font-display font-bold text-white text-3xl sm:text-4xl tracking-tight">Featured Projects</h2>
            <p className="text-white/50 mt-2 max-w-md">The most-supported ENS projects on the platform.</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-xs text-white/40">
            <span>Scroll</span>
            <span>→</span>
          </div>
        </div>
      </div>

      <div className="featured-scroll relative max-w-[100vw] overflow-x-auto">
        <div className="flex gap-5 pb-6 pt-2" style={{
          width: 'max-content',
          marginLeft: 'max(24px, calc((100vw - 1152px) / 2))',
          paddingRight: 48,
        }}>
          {projects.map(p => <FeaturedCard key={p.id} project={p} />)}
        </div>
      </div>
    </section>
  )
}

// ── New Projects ───────────────────────────────────────────────────────────

function NewCard({ project, hero, delay }: { project: Project; hero?: boolean; delay: number }) {
  const ref = useRef<HTMLElement>(null)
  const [visible, setVisible] = useState(false)
  const palette = CATEGORY_PALETTES[project.category] ?? CATEGORY_PALETTES.Other
  const glyph = CATEGORY_GLYPHS[project.category] ?? '◇'
  const coverImage = project.ipfs_images?.[0]

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { setTimeout(() => setVisible(true), delay); obs.disconnect() }
      })
    }, { threshold: 0.15 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [delay])

  const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${project.name} (${project.ens_domain}) on ensblocks.eth!\n\n"${project.tagline}"\n\nhttps://ensblocks.eth.limo/project?id=${project.id}`)}`

  return (
    <Link href={`/project?id=${project.id}`} className="block">
      <article
        ref={ref}
        className={`new-card relative rounded-[20px] overflow-hidden transition-all duration-700 cursor-pointer ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${hero ? 'new-card-hero md:col-span-2 md:row-span-2' : ''}`}
      >
        {hero && (
          <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#00D4FF]/15 border border-[#00D4FF]/40 backdrop-blur text-[#00D4FF] text-[10px] tracking-[0.22em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] shadow-[0_0_8px_#00D4FF] animate-pulse" />
            Recently Added
          </div>
        )}
        {coverImage ? (
          <img src={`https://gateway.pinata.cloud/ipfs/${coverImage}`} alt={project.name}
            className={`w-full object-cover ${hero ? 'aspect-[5/3]' : 'aspect-[5/3]'} rounded-t-[18px]`} />
        ) : (
          <ProjectArt palette={palette} glyph={glyph} large />
        )}
        <div className={`p-4 ${hero ? 'sm:p-6' : ''}`}>
          <div className="flex items-center justify-between mb-1.5">
            <div className="text-xs font-mono text-white/60">{project.ens_domain}</div>
            <span className="px-1.5 py-0.5 rounded text-[9px] tracking-widest uppercase bg-white/5 text-white/50 border border-white/10">
              {project.category}
            </span>
          </div>
          <h3 className={`font-display font-semibold text-white tracking-tight ${hero ? 'text-2xl' : 'text-base'}`}>{project.name}</h3>
          {hero && <p className="mt-2 text-sm text-white/55 leading-relaxed">{project.tagline}</p>}
          <div className="mt-3 flex items-center justify-between text-[11px] text-white/40">
            <span>{timeAgo(project.created_at)}</span>
            <a
              href={shareUrl}
              target="_blank"
              rel="noreferrer"
              onClick={e => e.stopPropagation()}
              className="flex items-center gap-1 px-2 py-0.5 rounded-full border border-white/10 text-white/40 hover:border-white/30 hover:text-white/70 transition-colors"
            >
              𝕏 Share
            </a>
          </div>
        </div>
      </article>
    </Link>
  )
}

function NewProjects({ projects }: { projects: Project[] }) {
  if (projects.length === 0) return null
  return (
    <section className="relative mt-28 sm:mt-36">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between gap-6 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-white/60 text-xs tracking-[0.22em] uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] shadow-[0_0_8px_#00D4FF]" />
              Fresh
            </div>
            <h2 className="font-display font-bold text-white text-3xl sm:text-4xl tracking-tight">New Projects</h2>
            <p className="text-white/50 mt-2 max-w-md">The latest builders to launch on ENS Blocks.</p>
          </div>
          <Link href="/explore" className="group hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 text-white/70 hover:text-white hover:border-white/25 text-sm transition bg-white/[0.02] backdrop-blur-sm">
            View All
            <span className="transition-transform group-hover:translate-x-0.5">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[1fr] gap-4 sm:gap-5">
          {projects.map((p, i) => (
            <NewCard key={p.id} project={p} hero={i === 0} delay={i * 80} />
          ))}
        </div>
      </div>
    </section>
  )
}

// ── Support Platform ───────────────────────────────────────────────────────

function SupportPlatform() {
  const [copied, setCopied] = useState(false)
  const copy = useCallback(() => {
    navigator.clipboard?.writeText('ensblocks.eth')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [])

  return (
    <section className="relative px-6 pb-20 mt-28 sm:mt-36">
      <div className="max-w-6xl mx-auto">
        <div className="support-card relative rounded-[28px] overflow-hidden">
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(800px 300px at 10% 0%, rgba(108,99,255,0.35), transparent 60%), radial-gradient(700px 280px at 100% 100%, rgba(0,212,255,0.28), transparent 60%)',
          }} />
          <div className="absolute inset-0 opacity-[0.15] pointer-events-none" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,.18) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.18) 1px, transparent 1px)',
            backgroundSize: '44px 44px',
            maskImage: 'radial-gradient(ellipse 80% 100% at 50% 50%, #000 20%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 100% at 50% 50%, #000 20%, transparent 80%)',
          }} />

          <div className="relative grid md:grid-cols-[1.3fr_1fr] gap-10 p-8 sm:p-12">
            <div>
              <div className="inline-flex items-center gap-2 mb-5 px-3 py-1 rounded-full bg-white/[0.06] border border-white/10 text-white/70 text-xs tracking-[0.22em] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00D4FF] shadow-[0_0_10px_#00D4FF]" />
                Support The Platform
              </div>
              <h2 className="font-display font-bold text-white text-3xl sm:text-4xl tracking-tight leading-tight">
                ENS Blocks is <span className="hero-shimmer">public infrastructure</span>.
              </h2>
              <p className="mt-4 text-white/60 max-w-lg leading-relaxed">
                We run on donations from the community we serve. Every contribution keeps the platform IPFS-hosted, ad-free, and builder-owned.
              </p>
            </div>

            <div className="flex flex-col justify-center gap-4">
              <div className="ens-chip flex items-center justify-between gap-3 px-5 py-4 rounded-2xl">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-9 h-9 shrink-0">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[#6C63FF] to-[#00D4FF]" />
                    <div className="absolute inset-[3px] rounded-[7px] bg-[#0D0D14] flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-[3px] bg-gradient-to-br from-[#6C63FF] to-[#00D4FF]" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] tracking-[0.22em] uppercase text-white/40">Donate to</div>
                    <div className="font-mono text-white truncate">ensblocks.eth</div>
                  </div>
                </div>
                <button
                  onClick={copy}
                  className="shrink-0 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white text-xs transition"
                >
                  {copied ? 'Copied!' : 'Copy'}
                </button>
              </div>
              {PLATFORM_WALLET && (
                <DonateButton recipientAddress={PLATFORM_WALLET} projectId="platform" compact={false} />
              )}
              <div className="text-[11px] text-white/40 text-center tracking-wide">
                100% of donations flow to platform maintenance &amp; bounties.
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ── Empty state ────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-32 text-center">
      <p className="text-white/40 text-lg mb-4">No projects yet.</p>
      <Link href="/submit" className="text-[#6C63FF] hover:underline">Be the first to submit →</Link>
    </section>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [featured, setFeatured] = useState<Project[]>([])
  const [newest, setNewest] = useState<Project[]>([])
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch(`${API}/api/projects?sort=donation_total&page=1`)
      .then(r => r.json()).then(d => setFeatured((d ?? []).slice(0, 6)))
    fetch(`${API}/api/projects?sort=newest&page=1`)
      .then(r => r.json()).then(d => setNewest((d ?? []).slice(0, 8)))
    fetch(`${API}/api/stats`)
      .then(r => r.json()).then(setStats)
  }, [])

  const hasProjects = featured.length > 0 || newest.length > 0

  return (
    <div>
      <Hero />
      <StatsBar stats={stats} />
      {hasProjects ? (
        <>
          <FeaturedProjects projects={featured} />
          <NewProjects projects={newest} />
        </>
      ) : (
        <EmptyState />
      )}
      <ProtocolSponsors />
      <SupportPlatform />
    </div>
  )
}
