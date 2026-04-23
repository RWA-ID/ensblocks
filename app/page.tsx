'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Project } from '@/types'
import ProjectCard from '@/components/project/ProjectCard'
import ProtocolSponsors from '@/components/sponsor/ProtocolSponsors'

const API = process.env.NEXT_PUBLIC_API_URL ?? ''

interface Stats { totalProjects: number; totalDonated: number; fundedProjects: number }

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

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden py-28 px-4 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(108,99,255,0.12)_0%,_transparent_70%)] pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <h1 className="font-sora text-4xl sm:text-6xl font-extrabold text-[#F0F0FF] leading-tight mb-4">
            Discover Projects<br />
            <span className="text-[#6C63FF]">Built on ENS</span>
          </h1>
          <p className="text-[#8888AA] text-lg sm:text-xl mb-8">
            The Showcase Layer For ENS Builders
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/explore" className="px-8 py-3 rounded-full bg-[#6C63FF] text-white font-medium hover:bg-[#5A52E0] transition-colors">
              Explore Projects
            </Link>
            <Link href="/submit" className="px-8 py-3 rounded-full border border-[#6C63FF]/50 text-[#6C63FF] font-medium hover:bg-[#6C63FF]/10 transition-colors">
              Submit Yours →
            </Link>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      {stats && (
        <section className="border-y border-[#2A2A3E] bg-[#0D0D14]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-3 divide-x divide-[#2A2A3E]">
            <div className="text-center px-4">
              <p className="font-sora text-2xl font-bold text-[#F0F0FF]">{stats.totalProjects}</p>
              <p className="text-xs text-[#8888AA] mt-1">Projects Listed</p>
            </div>
            <div className="text-center px-4">
              <p className="font-sora text-2xl font-bold text-[#00D4FF]">Ξ {stats.totalDonated.toFixed(3)}</p>
              <p className="text-xs text-[#8888AA] mt-1">Total Donated</p>
            </div>
            <div className="text-center px-4">
              <p className="font-sora text-2xl font-bold text-[#6C63FF]">{stats.fundedProjects}</p>
              <p className="text-xs text-[#8888AA] mt-1">Projects Funded</p>
            </div>
          </div>
        </section>
      )}

      {/* Featured Projects */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="font-sora text-2xl font-bold text-[#F0F0FF] mb-6">Featured Projects</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
            {featured.map(p => (
              <div key={p.id} className="flex-shrink-0 w-72">
                <ProjectCard project={p} />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* New Projects */}
      {newest.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="font-sora text-2xl font-bold text-[#F0F0FF] mb-6">New Projects</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {newest.map(p => <ProjectCard key={p.id} project={p} />)}
          </div>
        </section>
      )}

      {featured.length === 0 && newest.length === 0 && (
        <section className="max-w-7xl mx-auto px-4 py-20 text-center">
          <p className="text-[#8888AA] text-lg mb-4">No projects yet.</p>
          <Link href="/submit" className="text-[#6C63FF] hover:underline">Be the first to submit →</Link>
        </section>
      )}

      {/* Sponsors */}
      <ProtocolSponsors />
    </div>
  )
}
