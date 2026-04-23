'use client'

import { useState } from 'react'
import SponsorModal from '@/components/modals/SponsorModal'

const LIVE_SPONSORS: { name: string; logo?: string; url?: string }[] = []
const TOTAL_SLOTS = 4

function SponsorSlot({ n }: { n: number }) {
  return (
    <div className="sponsor-slot relative rounded-[20px] p-6 min-h-[140px] flex flex-col justify-between">
      <div className="flex items-start justify-between">
        <div className="text-[10px] tracking-[0.22em] uppercase text-white/35">
          Slot {String(n).padStart(2, '0')}
        </div>
        <div className="w-2 h-2 rounded-full bg-white/20" />
      </div>
      <div className="flex items-center justify-center py-3">
        <div className="font-display font-black text-white/10 select-none text-5xl">⬙</div>
      </div>
      <div className="text-[11px] text-white/35 text-center tracking-wide">Reserved</div>
    </div>
  )
}

function SponsorCTA({ onOpen }: { onOpen: () => void }) {
  return (
    <div className="sponsor-cta relative rounded-[20px] p-[1.5px] overflow-hidden">
      <div className="relative rounded-[19px] bg-[#10101A] p-6 min-h-[140px] flex flex-col justify-between overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{
          background: 'radial-gradient(300px 160px at 80% 120%, rgba(0,212,255,0.16), transparent 60%), radial-gradient(300px 160px at 0% 0%, rgba(108,99,255,0.2), transparent 60%)',
        }} />
        <div className="relative flex items-start justify-between">
          <div className="text-[10px] tracking-[0.22em] uppercase text-[#9B8CFF]">Become a Sponsor</div>
          <div className="flex -space-x-1">
            <span className="w-2 h-2 rounded-full bg-[#6C63FF] shadow-[0_0_8px_#6C63FF]" />
            <span className="w-2 h-2 rounded-full bg-[#00D4FF] shadow-[0_0_8px_#00D4FF]" />
          </div>
        </div>
        <div className="relative">
          <div className="font-display font-semibold text-white text-xl tracking-tight">Reach ENS Builders</div>
          <div className="mt-2 text-xs text-white/50 leading-relaxed">
            Join protocols already reaching thousands of ENS-native shippers.
          </div>
        </div>
        <button
          onClick={onOpen}
          className="relative mt-4 inline-flex items-center justify-between gap-2 px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm transition"
        >
          <span>Apply</span>
          <span className="text-[#00D4FF]">→</span>
        </button>
      </div>
    </div>
  )
}

export default function ProtocolSponsors() {
  const [open, setOpen] = useState(false)
  const ghostsNeeded = Math.max(0, TOTAL_SLOTS - 1 - LIVE_SPONSORS.length)

  return (
    <>
      <section className="relative mt-28 sm:mt-36 pb-10">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-end justify-between gap-6 mb-3">
            <div>
              <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-white/60 text-xs tracking-[0.22em] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#6C63FF]" />
                Backed By
              </div>
              <h2 className="font-display font-bold text-white text-3xl sm:text-4xl tracking-tight">Protocol Sponsors</h2>
            </div>
          </div>
          <p className="text-white/50 max-w-lg mb-8">
            Join protocols already reaching ENS builders — quarterly slots, transparent pricing, on-chain receipts.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
            {LIVE_SPONSORS.map(s => (
              <a key={s.name} href={s.url ?? '#'} target="_blank" rel="noreferrer"
                className="sponsor-slot relative rounded-[20px] p-6 min-h-[140px] flex flex-col items-center justify-center gap-3 hover:border-white/20 transition-all">
                {s.logo
                  ? <img src={s.logo} alt={s.name} className="h-10 object-contain" />
                  : <div className="w-10 h-10 rounded-full bg-[#6C63FF]/20 flex items-center justify-center text-lg font-bold text-[#6C63FF]">{s.name.charAt(0)}</div>}
                <p className="text-white font-semibold text-sm">{s.name}</p>
                <span className="text-[10px] text-[#00D4FF] font-mono bg-[#00D4FF]/10 px-2 py-0.5 rounded-full">Protocol Sponsor</span>
              </a>
            ))}
            {Array.from({ length: ghostsNeeded }).map((_, i) => (
              <SponsorSlot key={i} n={LIVE_SPONSORS.length + i + 1} />
            ))}
            <SponsorCTA onOpen={() => setOpen(true)} />
          </div>
        </div>
      </section>

      {open && <SponsorModal onClose={() => setOpen(false)} />}
    </>
  )
}
