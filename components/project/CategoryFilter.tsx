'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { CATEGORIES } from '@/types'

export default function CategoryFilter() {
  const router = useRouter()
  const params = useSearchParams()
  const active = params.get('category') ?? ''

  function select(cat: string) {
    const next = new URLSearchParams(params.toString())
    if (cat === active) next.delete('category')
    else next.set('category', cat)
    router.push(`/explore?${next.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map(cat => (
        <button
          key={cat}
          onClick={() => select(cat)}
          className={`px-3 py-1 rounded-full text-sm transition-colors ${
            active === cat
              ? 'bg-[#6C63FF] text-white'
              : 'border border-[#2A2A3E] text-[#8888AA] hover:border-[#6C63FF] hover:text-[#F0F0FF]'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
