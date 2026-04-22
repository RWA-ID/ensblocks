import Link from 'next/link'
import ENSBlocksLogo from '@/components/logo/ENSBlocksLogo'

export default function Footer() {
  return (
    <footer className="border-t border-[#2A2A3E] bg-[#0A0A0F] py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ENSBlocksLogo size="sm" />
          <span className="text-[#8888AA] text-sm">ensblocks.eth — built on ENS</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-[#8888AA]">
          <Link href="/explore" className="hover:text-[#F0F0FF] transition-colors">Explore</Link>
          <Link href="/submit" className="hover:text-[#F0F0FF] transition-colors">Submit Project</Link>
          <Link href="/sponsor" className="hover:text-[#F0F0FF] transition-colors">Sponsor</Link>
        </div>
        <p className="text-xs text-[#8888AA]">
          ⚠ This platform does not custody funds. Donations go directly to project wallets.
        </p>
      </div>
    </footer>
  )
}
