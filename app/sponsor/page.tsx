'use client'

import { SponsorForm } from '@/components/modals/SponsorModal'

const WHAT_YOU_GET = [
  { icon: '◈', label: 'Dedicated slot in the Protocol Sponsors grid on the homepage' },
  { icon: '◎', label: 'Your logo displayed and linked to your product or service page' },
  { icon: '⬡', label: 'Visible to every ENS builder who visits ensblocks.eth' },
]

export default function SponsorPage() {
  return (
    <div className="relative min-h-screen">
      {/* aurora background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full" style={{
          background: 'radial-gradient(circle, rgba(108,99,255,0.12), transparent 60%)',
          filter: 'blur(80px)', transform: 'translate(-30%, -20%)',
        }} />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full" style={{
          background: 'radial-gradient(circle, rgba(0,212,255,0.08), transparent 60%)',
          filter: 'blur(80px)', transform: 'translate(20%, -20%)',
        }} />
      </div>

      <div className="relative max-w-5xl mx-auto px-6 py-20">
        {/* header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-5 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-white/60 text-[10px] tracking-[0.22em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#6C63FF]" />
            Protocol Sponsors
          </div>
          <h1 className="font-display font-black text-white text-[clamp(36px,6vw,72px)] tracking-tight leading-[0.95] mb-5">
            Reach <span className="hero-shimmer">ENS Builders</span>
          </h1>
          <p className="text-white/55 text-lg max-w-xl mx-auto leading-relaxed">
            One dedicated slot in the Protocol Sponsors section — your logo, your link, seen by every ENS builder on the platform.
          </p>
        </div>

        <div className="grid md:grid-cols-[1fr_1.6fr] gap-10 items-start">
          {/* left: what you get */}
          <div className="space-y-6">
            <div>
              <div className="text-[11px] tracking-[0.22em] uppercase text-white/40 mb-4">What&apos;s included</div>
              <div className="space-y-3">
                {WHAT_YOU_GET.map(item => (
                  <div key={item.label} className="flex items-start gap-3 p-4 rounded-2xl bg-white/[0.025] border border-white/[0.06]">
                    <span className="text-[#6C63FF] text-lg mt-0.5 flex-shrink-0">{item.icon}</span>
                    <p className="text-[13.5px] text-white/70 leading-relaxed">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl border border-white/[0.06]" style={{
              background: 'linear-gradient(140deg, rgba(108,99,255,0.06), rgba(0,212,255,0.03) 60%, transparent)',
            }}>
              <div className="text-[11px] tracking-[0.22em] uppercase text-white/40 mb-3">Pricing</div>
              <div className="font-display font-black text-white text-4xl tracking-tight">
                1 ETH<span className="text-white/40 text-xl font-normal"> /mo</span>
              </div>
              <p className="mt-2 text-[12px] text-white/40 leading-relaxed">
                4 slots total · quarterly billing · on-chain receipt
              </p>
              <div className="mt-4 pt-4 border-t border-white/[0.06] text-[11px] text-white/35 leading-relaxed">
                No tiers, no newsletter, no hero placement.
              </div>
            </div>
          </div>

          {/* right: form */}
          <div className="sm-modal relative rounded-[22px]">
            <div className="sm-frame absolute inset-0 pointer-events-none rounded-[22px]" />
            <div className="relative bg-[#141421] rounded-[22px] overflow-hidden">
              <div aria-hidden className="absolute inset-0 pointer-events-none overflow-hidden" style={{
                background: 'radial-gradient(420px 180px at 90% -40%, rgba(0,212,255,0.14), transparent 60%), radial-gradient(420px 200px at 0% -30%, rgba(108,99,255,0.18), transparent 60%)',
              }} />

              <div className="relative px-7 pt-6 pb-5">
                <div className="inline-flex items-center gap-2 mb-3 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/10 text-white/60 text-[10px] tracking-[0.22em] uppercase">
                  <span className="w-1 h-1 rounded-full bg-[#6C63FF]" />
                  Sponsor Inquiry
                </div>
                <h2 className="font-display font-semibold text-white text-[22px] tracking-tight leading-tight">
                  Apply for a <span className="sm-grad">Sponsor Slot</span>
                </h2>
                <p className="mt-1.5 text-[13px] text-white/50">One tile · your logo · your link.</p>
              </div>

              <div className="relative h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div className="relative px-7 pt-6 pb-6">
                <SponsorForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
