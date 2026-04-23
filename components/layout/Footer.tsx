'use client'

import Link from 'next/link'
import ENSBlocksLogo from '@/components/logo/ENSBlocksLogo'
import DonateButton from '@/components/donate/DonateButton'

const PLATFORM_WALLET = process.env.NEXT_PUBLIC_PLATFORM_WALLET ?? ''

export default function Footer() {
  return (
    <footer className="border-t border-[#2A2A3E] bg-[#0A0A0F] pt-10 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <ENSBlocksLogo size="sm" />
            <span className="text-[#8888AA] text-sm">ensblocks.eth — built on ENS</span>
          </div>

          {/* Nav */}
          <div className="flex flex-wrap items-center gap-5 text-sm text-[#8888AA]">
            <Link href="/explore" className="hover:text-[#F0F0FF] transition-colors">Explore</Link>
            <Link href="/submit" className="hover:text-[#F0F0FF] transition-colors">Submit Project</Link>
            <Link href="/sponsor" className="hover:text-[#F0F0FF] transition-colors">Sponsor</Link>
            <a href="https://github.com/RWA-ID/ensblocks" target="_blank" rel="noreferrer" className="hover:text-[#F0F0FF] transition-colors">GitHub</a>
            <Link href="/privacy" className="hover:text-[#F0F0FF] transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-[#F0F0FF] transition-colors">Terms</Link>
          </div>

          {/* Support the platform */}
          {PLATFORM_WALLET && (
            <div className="flex items-center gap-3 bg-[#1A1A26] border border-[#2A2A3E] rounded-2xl px-4 py-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-medium text-[#F0F0FF]">Support the Platform</p>
                <p className="text-[10px] text-[#6C63FF] font-mono">ensblocks.eth</p>
              </div>
              <div className="w-28">
                <DonateButton recipientAddress={PLATFORM_WALLET} projectId="platform" compact />
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-[#8888AA]/60">
          ⚠ This platform does not custody funds. Donations go directly to project wallets.
        </p>
      </div>
    </footer>
  )
}
