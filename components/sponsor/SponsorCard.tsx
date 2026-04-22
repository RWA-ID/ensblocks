'use client'

import { useState } from 'react'
import ENSBlocksLogo from '@/components/logo/ENSBlocksLogo'
import SponsorModal from '@/components/modals/SponsorModal'
import Link from 'next/link'

interface SponsorCardProps {
  ctaMode?: 'modal' | 'page'
}

export default function SponsorCard({ ctaMode = 'modal' }: SponsorCardProps) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <div className="bg-[#1A1A26] border border-[#6C63FF]/30 rounded-2xl p-6 flex flex-col items-center text-center gap-4 hover:border-[#6C63FF]/70 hover:shadow-[0_0_20px_rgba(108,99,255,0.15)] transition-all">
        <ENSBlocksLogo size="md" />
        <div>
          <p className="text-[#F0F0FF] font-sora font-semibold">Power the ENS discovery layer</p>
          <p className="text-[#8888AA] text-sm mt-1">Reach ENS builders, founders, and the Web3 community.</p>
        </div>
        {ctaMode === 'modal' ? (
          <button
            onClick={() => setOpen(true)}
            className="px-5 py-2 rounded-full bg-[#6C63FF] text-white text-sm font-medium hover:bg-[#5A52E0] transition-colors"
          >
            Become a Sponsor
          </button>
        ) : (
          <Link
            href="/sponsor"
            className="px-5 py-2 rounded-full bg-[#6C63FF] text-white text-sm font-medium hover:bg-[#5A52E0] transition-colors"
          >
            Become a Sponsor
          </Link>
        )}
      </div>
      {open && <SponsorModal onClose={() => setOpen(false)} />}
    </>
  )
}
