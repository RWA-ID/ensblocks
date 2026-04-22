'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Project } from '@/types'
import ProjectGrid from '@/components/project/ProjectGrid'
import CategoryFilter from '@/components/project/CategoryFilter'
import Link from 'next/link'

function ExploreContent() {
  const params = useSearchParams()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [q, setQ] = useState(params.get('q') ?? '')
  const [sort, setSort] = useState(params.get('sort') ?? 'donation_total')
  const category = params.get('category') ?? ''

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function load(p: number) {
    setLoading(true)
    const sp = new URLSearchParams({ page: String(p), sort })
    if (category) sp.set('category', category)
    if (q) sp.set('q', q)
    const res = await fetch(`/api/projects?${sp.toString()}`)
    const data: Project[] = await res.json()
    if (p === 1) setProjects(data)
    else setProjects(prev => [...prev, ...data])
    setHasMore(data.length === 12)
    setLoading(false)
  }

  useEffect(() => {
    setPage(1)
    setProjects([])
    load(1)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, sort, q])

  function loadMore() {
    const next = page + 1
    setPage(next)
    load(next)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
        <h1 className="font-sora text-3xl font-bold text-[#F0F0FF]">Explore Projects</h1>
        <Link href="/submit" className="px-5 py-2 rounded-full bg-[#6C63FF] text-white text-sm font-medium hover:bg-[#5A52E0] transition-colors">
          + Submit Project
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="search"
          placeholder="Search by name, tagline, ENS…"
          value={q}
          onChange={e => setQ(e.target.value)}
          className="flex-1 bg-[#12121A] border border-[#2A2A3E] rounded-xl px-4 py-2.5 text-sm text-[#F0F0FF] placeholder-[#8888AA] focus:outline-none focus:border-[#6C63FF]"
        />
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="bg-[#12121A] border border-[#2A2A3E] rounded-xl px-4 py-2.5 text-sm text-[#F0F0FF] focus:outline-none focus:border-[#6C63FF]"
        >
          <option value="donation_total">Most Supported</option>
          <option value="newest">Newest</option>
          <option value="alphabetical">Alphabetical</option>
        </select>
      </div>

      <div className="mb-8">
        <Suspense>
          <CategoryFilter />
        </Suspense>
      </div>

      {loading && projects.length === 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 bg-[#1A1A26] rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : (
        <ProjectGrid projects={projects} />
      )}

      {hasMore && !loading && (
        <div className="text-center mt-10">
          <button
            onClick={loadMore}
            className="px-8 py-3 rounded-full border border-[#2A2A3E] text-[#8888AA] hover:border-[#6C63FF] hover:text-[#F0F0FF] transition-colors"
          >
            Load More
          </button>
        </div>
      )}
    </div>
  )
}

export default function ExplorePage() {
  return (
    <Suspense>
      <ExploreContent />
    </Suspense>
  )
}
