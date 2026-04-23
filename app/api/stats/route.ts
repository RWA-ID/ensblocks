import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const db = supabaseAdmin()

  const [projectsRes, donationsRes] = await Promise.all([
    db.from('projects').select('id, donation_total', { count: 'exact' }),
    db.from('donations').select('amount_eth'),
  ])

  const totalProjects = projectsRes.count ?? 0
  const totalDonated = (donationsRes.data ?? []).reduce((sum, d) => sum + Number(d.amount_eth), 0)
  const fundedProjects = (projectsRes.data ?? []).filter(p => Number(p.donation_total) > 0).length

  return NextResponse.json({ totalProjects, totalDonated, fundedProjects })
}
