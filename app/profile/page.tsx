'use client'

import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { Project } from '@/types'
import { BuilderProfile } from '@/types/builder'
import Link from 'next/link'
import ProjectCard from '@/components/project/ProjectCard'
import BuilderProfileEditModal from '@/components/modals/BuilderProfileEditModal'

const IPFS = 'https://gateway.pinata.cloud/ipfs'

export default function ProfilePage() {
  const { address, isConnected } = useAccount()
  const { openConnectModal } = useConnectModal()
  const [projects, setProjects] = useState<Project[]>([])
  const [profile, setProfile] = useState<BuilderProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [editProfileOpen, setEditProfileOpen] = useState(false)

  useEffect(() => {
    if (!address) { setLoading(false); return }

    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL ?? ''}/api/projects?submitter=${address}`)
        .then(r => r.json()).catch(() => []),
      fetch(`${process.env.NEXT_PUBLIC_API_URL ?? ''}/api/builder-profile?wallet=${address}`)
        .then(r => r.json()).catch(() => null),
    ]).then(([p, b]) => {
      setProjects(Array.isArray(p) ? p : [])
      setProfile(b)
      setLoading(false)
    })
  }, [address])

  if (!isConnected) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center">
        <p className="text-[#8888AA] mb-6">Connect your wallet to view your profile.</p>
        <button
          onClick={() => openConnectModal?.()}
          className="px-8 py-3 rounded-full bg-[#6C63FF] text-white font-medium hover:bg-[#5A52E0] transition-colors"
        >
          Connect Wallet
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="h-10 w-48 bg-[#1A1A26] rounded-xl animate-pulse mb-4" />
        <div className="h-4 w-72 bg-[#1A1A26] rounded animate-pulse" />
      </div>
    )
  }

  const avatarSrc = profile?.avatar_ipfs ? `${IPFS}/${profile.avatar_ipfs}` : null
  const displayName = profile?.display_name || `${address?.slice(0, 6)}…${address?.slice(-4)}`

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Builder profile header */}
      <div className="bg-[#1A1A26] border border-[#2A2A3E] rounded-2xl p-6 mb-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="flex-shrink-0">
          {avatarSrc ? (
            <img src={avatarSrc} alt={displayName} className="w-20 h-20 rounded-full object-cover border border-[#2A2A3E]" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-[#2A2A3E] flex items-center justify-center text-[#6C63FF] font-bold text-2xl">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <h1 className="font-sora text-2xl font-bold text-[#F0F0FF] mb-1">{displayName}</h1>
          <p className="text-xs text-[#8888AA] font-mono mb-2">{address}</p>
          {profile?.bio && <p className="text-sm text-[#8888AA] mb-3">{profile.bio}</p>}

          {/* Socials */}
          <div className="flex flex-wrap gap-3">
            {profile?.twitter && (
              <a href={`https://twitter.com/${profile.twitter}`} target="_blank" rel="noreferrer"
                className="text-xs text-[#8888AA] hover:text-[#F0F0FF] transition-colors">𝕏 @{profile.twitter}</a>
            )}
            {profile?.github && (
              <a href={`https://github.com/${profile.github}`} target="_blank" rel="noreferrer"
                className="text-xs text-[#8888AA] hover:text-[#F0F0FF] transition-colors">GitHub</a>
            )}
            {profile?.telegram && (
              <a href={`https://t.me/${profile.telegram}`} target="_blank" rel="noreferrer"
                className="text-xs text-[#8888AA] hover:text-[#F0F0FF] transition-colors">Telegram</a>
            )}
            {profile?.website && (
              <a href={profile.website} target="_blank" rel="noreferrer"
                className="text-xs text-[#8888AA] hover:text-[#F0F0FF] transition-colors">Website ↗</a>
            )}
          </div>
        </div>

        <button
          onClick={() => setEditProfileOpen(true)}
          className="flex-shrink-0 px-4 py-2 rounded-full border border-[#2A2A3E] text-xs text-[#8888AA] hover:border-[#6C63FF]/50 hover:text-[#6C63FF] transition-colors"
        >
          {profile ? 'Edit profile' : '+ Set up profile'}
        </button>
      </div>

      {/* Projects */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-sora text-lg font-bold text-[#F0F0FF]">
          My Projects <span className="text-[#8888AA] font-normal text-sm">({projects.length})</span>
        </h2>
        <Link
          href="/submit"
          className="px-4 py-2 rounded-full bg-[#6C63FF] text-white text-sm font-medium hover:bg-[#5A52E0] transition-colors"
        >
          + Submit project
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[#2A2A3E] rounded-2xl">
          <p className="text-[#8888AA] mb-4">You haven&apos;t submitted any projects yet.</p>
          <Link href="/submit" className="text-sm text-[#6C63FF] hover:underline">
            Submit your first project →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map(p => <ProjectCard key={p.id} project={p} />)}
        </div>
      )}

      {editProfileOpen && (
        <BuilderProfileEditModal
          profile={profile}
          onClose={() => setEditProfileOpen(false)}
          onSaved={saved => setProfile(saved)}
        />
      )}
    </div>
  )
}
