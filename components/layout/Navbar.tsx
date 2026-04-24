'use client'

import Link from 'next/link'
import { useAccount } from 'wagmi'
import ENSBlocksLogo from '@/components/logo/ENSBlocksLogo'
import WalletConnectButton from '@/components/wallet/WalletConnectButton'

export default function Navbar() {
  const { isConnected } = useAccount()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#2A2A3E] bg-[#0A0A0F]/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2">
          <ENSBlocksLogo size="sm" />
          <span className="font-sora font-bold text-[#F0F0FF] text-lg tracking-tight">
            ensblocks<span className="text-[#6C63FF]">.eth</span>
          </span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm text-[#8888AA]">
          <Link href="/explore" className="hover:text-[#F0F0FF] transition-colors">Explore</Link>
          <Link href="/submit" className="hover:text-[#F0F0FF] transition-colors">Submit</Link>
          <Link href="/sponsor" className="hover:text-[#F0F0FF] transition-colors">Sponsor</Link>
          {isConnected && (
            <Link href="/profile" className="hover:text-[#F0F0FF] transition-colors text-[#6C63FF]">
              My Profile
            </Link>
          )}
        </div>
        <WalletConnectButton />
      </div>
    </nav>
  )
}
