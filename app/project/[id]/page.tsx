'use client'

import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAccount } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { Project } from '@/types'
import Link from 'next/link'
import DonateButton from '@/components/donate/DonateButton'
import XMTPChatModal from '@/components/modals/XMTPChatModal'
import { useDonationTotal } from '@/hooks/useDonationTotal'
import ReactMarkdown from 'react-markdown'

export default function ProjectPage() {
  const { id } = useParams<{ id: string }>()
  const { isConnected } = useAccount()
  const { openConnectModal } = useConnectModal()
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [fundOpen, setFundOpen] = useState(false)
  const pendingFund = useRef(false)
  const [lightbox, setLightbox] = useState<string | null>(null)
  const { total, count } = useDonationTotal(project?.wallet_address ?? '')

  useEffect(() => {
    if (isConnected && pendingFund.current) {
      pendingFund.current = false
      setFundOpen(true)
    }
  }, [isConnected])

  function handleFundClick() {
    if (!isConnected) {
      pendingFund.current = true
      openConnectModal?.()
      return
    }
    setFundOpen(true)
  }

  useEffect(() => {
    fetch(`/api/projects/${id}`)
      .then(r => r.json())
      .then(d => { setProject(d); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="h-10 w-64 bg-[#1A1A26] rounded-xl animate-pulse mb-4" />
        <div className="h-4 w-96 bg-[#1A1A26] rounded animate-pulse" />
      </div>
    )
  }

  if (!project) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <p className="text-[#8888AA] text-lg">Project not found.</p>
      </div>
    )
  }

  const IPFS = 'https://gateway.pinata.cloud/ipfs'

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-3 flex-wrap mb-2">
            <h1 className="font-sora text-3xl font-bold text-[#F0F0FF]">{project.name}</h1>
            <span className="text-sm font-mono text-[#6C63FF] border border-[#6C63FF]/30 rounded-full px-3 py-0.5">
              {project.ens_domain}
            </span>
            <span className="text-xs px-2 py-1 rounded-full bg-[#1A1A26] border border-[#2A2A3E] text-[#8888AA]">
              {project.category}
            </span>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out ${project.name} (${project.ens_domain}) on ensblocks.eth!\n\n"${project.tagline}"\n\n${typeof window !== 'undefined' ? window.location.href : ''}`)}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border border-[#2A2A3E] text-[#8888AA] hover:border-[#F0F0FF] hover:text-[#F0F0FF] transition-colors"
            >
              𝕏 Share
            </a>
          </div>
          <p className="text-[#8888AA] text-sm mb-1">by {project.founder_name}</p>
          <p className="text-[#F0F0FF] text-lg font-medium mb-6">{project.tagline}</p>
          <p className="text-[#8888AA] mb-8">{project.short_desc}</p>

          {project.long_desc && (
            <div className="prose prose-invert prose-sm max-w-none mb-8 text-[#8888AA]">
              <ReactMarkdown>{project.long_desc}</ReactMarkdown>
            </div>
          )}

          {/* Links */}
          <div className="flex flex-wrap gap-3 mb-8">
            {project.github_url && (
              <a href={project.github_url} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 text-sm text-[#8888AA] hover:text-[#F0F0FF] border border-[#2A2A3E] rounded-full px-3 py-1.5 transition-colors">
                GitHub ↗
              </a>
            )}
            {project.demo_url && (
              <a href={project.demo_url} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 text-sm text-[#8888AA] hover:text-[#F0F0FF] border border-[#2A2A3E] rounded-full px-3 py-1.5 transition-colors">
                Live Demo ↗
              </a>
            )}
            {project.contact_twitter && (
              <a href={`https://twitter.com/${project.contact_twitter}`} target="_blank" rel="noreferrer"
                className="flex items-center gap-1.5 text-sm text-[#8888AA] hover:text-[#F0F0FF] border border-[#2A2A3E] rounded-full px-3 py-1.5 transition-colors">
                𝕏 @{project.contact_twitter}
              </a>
            )}
          </div>

          {/* Image gallery */}
          {project.ipfs_images && project.ipfs_images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
              {project.ipfs_images.map(cid => (
                <button key={cid} onClick={() => setLightbox(`${IPFS}/${cid}`)} className="group">
                  <img
                    src={`${IPFS}/${cid}`}
                    alt=""
                    className="w-full h-32 object-cover rounded-xl border border-[#2A2A3E] group-hover:border-[#6C63FF]/50 transition-colors"
                  />
                </button>
              ))}
            </div>
          )}

          {project.ipfs_pitch_deck && (
            <a
              href={`${IPFS}/${project.ipfs_pitch_deck}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#6C63FF] hover:underline"
            >
              📄 View Pitch Deck
            </a>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:w-72 flex-shrink-0">
          <div className="sticky top-24 bg-[#1A1A26] border border-[#2A2A3E] rounded-2xl p-6 space-y-4">
            <div>
              <p className="text-xs text-[#8888AA] mb-1">Total Donated</p>
              <p className="text-2xl font-mono font-bold text-[#00D4FF]">Ξ {Number(total).toFixed(4)}</p>
              <p className="text-xs text-[#8888AA]">from {count} supporter{count !== 1 ? 's' : ''}</p>
            </div>

            <DonateButton recipientAddress={project.wallet_address} projectId={project.id} />

            <button
              onClick={handleFundClick}
              className="w-full py-2.5 rounded-full border border-[#6C63FF]/50 text-[#6C63FF] text-sm font-medium hover:bg-[#6C63FF]/10 transition-colors"
            >
              {isConnected ? '💬 Message Founder' : 'Connect to Message'}
            </button>

            <div className="border-t border-[#2A2A3E] pt-4 space-y-2 text-xs text-[#8888AA]">
              <a
                href={`https://app.ens.domains/${project.ens_domain}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 hover:text-[#F0F0FF] transition-colors"
              >
                ENS: {project.ens_domain} ↗
              </a>
              {project.contact_email && (
                <a href={`mailto:${project.contact_email}`} className="flex items-center gap-1.5 hover:text-[#F0F0FF] transition-colors">
                  📧 {project.contact_email}
                </a>
              )}
              {project.contact_telegram && (
                <a href={`https://t.me/${project.contact_telegram}`} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-[#F0F0FF] transition-colors">
                  ✈️ @{project.contact_telegram}
                </a>
              )}
              {project.contact_discord && (
                <p>💬 {project.contact_discord}</p>
              )}
            </div>

            <div className="border-t border-[#2A2A3E] pt-3">
              <p className="text-[10px] text-yellow-400/70">
                ⚠ This platform does not custody funds. All donations go directly to project owners&apos; wallets.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Another */}
      <div className="mt-8 text-center">
        <Link href="/submit" className="text-sm text-[#8888AA] hover:text-[#6C63FF] transition-colors">
          + Submit Another Project
        </Link>
      </div>

      {fundOpen && (
        <XMTPChatModal
          recipientAddress={project.wallet_address}
          recipientName={project.founder_name}
          onClose={() => setFundOpen(false)}
        />
      )}
      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <img src={lightbox} alt="" className="max-w-full max-h-full rounded-xl" />
        </div>
      )}
    </div>
  )
}
