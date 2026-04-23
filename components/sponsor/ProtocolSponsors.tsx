'use client'

import { useState } from 'react'
import SponsorModal from '@/components/modals/SponsorModal'

// Real sponsors would come from API/DB. Empty for now.
const LIVE_SPONSORS: { name: string; logo?: string; url?: string }[] = []

const GHOST_COUNT = 5
const VALUE_PROPS = [
  { icon: '🎯', label: 'Targeted ENS builder audience' },
  { icon: '🚀', label: 'Early exposure to new projects' },
  { icon: '👁', label: 'Direct visibility on project pages' },
]

export default function ProtocolSponsors() {
  const [open, setOpen] = useState(false)

  const ghostsNeeded = Math.max(0, GHOST_COUNT - LIVE_SPONSORS.length)

  return (
    <>
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="font-sora text-2xl sm:text-3xl font-bold text-[#F0F0FF] mb-2">
            Protocol Sponsors
          </h2>
          <p className="text-[#8888AA] text-sm">
            Protocols powering the discovery layer for ENS builders
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {/* Featured CTA card */}
          <div className="relative bg-gradient-to-br from-[#1E1B3A] to-[#12121A] border border-[#6C63FF]/50 rounded-2xl p-6 flex flex-col items-center text-center gap-4 hover:border-[#6C63FF] hover:shadow-[0_0_28px_rgba(108,99,255,0.25)] transition-all duration-300 hover:scale-[1.03] lg:col-span-1">
            <div className="absolute top-3 right-3 text-[10px] font-mono text-[#6C63FF] bg-[#6C63FF]/10 px-2 py-0.5 rounded-full">
              5 slots · 1 ETH/mo
            </div>
            <div className="w-12 h-12 rounded-full bg-[#6C63FF]/20 flex items-center justify-center text-2xl">
              ⚡
            </div>
            <div>
              <p className="text-[#F0F0FF] font-sora font-bold text-base">Power the ENS discovery layer</p>
              <p className="text-[#8888AA] text-xs mt-1 leading-relaxed">
                Reach ENS builders, founders, and the Web3 community
              </p>
            </div>
            <button
              onClick={() => setOpen(true)}
              className="w-full py-2.5 rounded-full bg-[#6C63FF] text-white text-sm font-medium hover:bg-[#5A52E0] transition-colors"
            >
              Become a Sponsor
            </button>
          </div>

          {/* Live sponsors */}
          {LIVE_SPONSORS.map((s) => (
            <a
              key={s.name}
              href={s.url ?? '#'}
              target="_blank"
              rel="noreferrer"
              className="bg-[#1A1A26] border border-[#2A2A3E] rounded-2xl p-6 flex flex-col items-center text-center gap-3 hover:border-[#6C63FF]/60 hover:shadow-[0_0_20px_rgba(108,99,255,0.15)] hover:scale-[1.03] transition-all duration-300"
            >
              {s.logo ? (
                <img src={s.logo} alt={s.name} className="h-10 object-contain" />
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#6C63FF]/20 flex items-center justify-center text-lg font-bold text-[#6C63FF]">
                  {s.name.charAt(0)}
                </div>
              )}
              <p className="text-[#F0F0FF] font-semibold text-sm">{s.name}</p>
              <span className="text-[10px] text-[#00D4FF] font-mono bg-[#00D4FF]/10 px-2 py-0.5 rounded-full">
                Protocol Sponsor
              </span>
            </a>
          ))}

          {/* Ghost / placeholder cards */}
          {Array.from({ length: ghostsNeeded }).map((_, i) => (
            <button
              key={`ghost-${i}`}
              onClick={() => setOpen(true)}
              className="group border-2 border-dashed border-[#2A2A3E] rounded-2xl p-6 flex flex-col items-center text-center gap-3 hover:border-[#6C63FF]/50 hover:bg-[#6C63FF]/5 transition-all duration-300 hover:scale-[1.03] animate-pulse-slow"
            >
              <div className="w-10 h-10 rounded-full border-2 border-dashed border-[#2A2A3E] group-hover:border-[#6C63FF]/40 flex items-center justify-center text-[#2A2A3E] group-hover:text-[#6C63FF]/40 text-xl transition-colors">
                +
              </div>
              <div>
                <p className="text-[#3A3A5E] group-hover:text-[#6C63FF]/60 font-semibold text-sm transition-colors">
                  Your Protocol Here
                </p>
                <p className="text-[#2A2A3E] group-hover:text-[#6C63FF]/40 text-xs mt-0.5 transition-colors">
                  Sponsor this slot
                </p>
              </div>
              <span className="text-[10px] text-[#3A3A5E] group-hover:text-[#6C63FF]/60 border border-dashed border-[#2A2A3E] group-hover:border-[#6C63FF]/30 px-3 py-1 rounded-full transition-all">
                Become a Sponsor
              </span>
            </button>
          ))}
        </div>

        {/* Value props row */}
        <div className="border-t border-[#2A2A3E] pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {VALUE_PROPS.map((v) => (
            <div key={v.label} className="flex items-center gap-3 justify-center sm:justify-start">
              <span className="text-lg">{v.icon}</span>
              <span className="text-sm text-[#8888AA]">{v.label}</span>
            </div>
          ))}
        </div>
      </section>

      {open && <SponsorModal onClose={() => setOpen(false)} />}
    </>
  )
}
