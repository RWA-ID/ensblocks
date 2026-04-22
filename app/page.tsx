'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Project, CATEGORIES } from '@/types'
import ProjectCard from '@/components/project/ProjectCard'
import SponsorCard from '@/components/sponsor/SponsorCard'

const API = process.env.NEXT_PUBLIC_API_URL ?? ''

export default function HomePage() {
  const [featured, setFeatured] = useState<Project[]>([])
  const [newest, setNewest] = useState<Project[]>([])

  useEffect(() => {
    fetch(`${API}/api/projects?sort=donation_total&page=1`)
      .then(r => r.json()).then(d => setFeatured((d ?? []).slice(0, 6)))
    fetch(`${API}/api/projects?sort=newest&page=1`)
      .then(r => r.json()).then(d => setNewest((d ?? []).slice(0, 8)))
  }, [])

  const platformWallet = process.env.NEXT_PUBLIC_PLATFORM_WALLET ?? ''

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
            The home of Ethereum-native builders.
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

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="font-sora text-2xl font-bold text-[#F0F0FF] mb-6">Explore by Category</h2>
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map(cat => (
            <Link
              key={cat}
              href={`/explore?category=${cat}`}
              className="px-4 py-2 rounded-full border border-[#2A2A3E] text-[#8888AA] hover:border-[#6C63FF] hover:text-[#F0F0FF] transition-colors"
            >
              {cat}
            </Link>
          ))}
        </div>
      </section>


      {/* Sponsors */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="font-sora text-2xl font-bold text-[#F0F0FF] mb-2 text-center">Protocol Sponsors</h2>
        <p className="text-[#8888AA] text-sm text-center mb-8">Protocols powering the ENS discovery layer</p>
        <div className="flex justify-center">
          <SponsorCard ctaMode="page" />
        </div>
      </section>
    </div>
  )
}
