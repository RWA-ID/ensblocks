import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const db = supabaseAdmin()

  const [countRes, fundedRes, donationsRes] = await Promise.all([
    db.from('projects').select('*', { count: 'exact', head: true }),
    db.from('projects').select('id', { count: 'exact', head: true }).gt('donation_total', 0),
    db.from('donations').select('amount_eth'),
  ])

  const totalProjects = countRes.count ?? 0
  const fundedProjects = fundedRes.count ?? 0
  const totalDonated = (donationsRes.data ?? []).reduce((sum, d) => sum + Number(d.amount_eth), 0)

  return NextResponse.json({ totalProjects, totalDonated, fundedProjects }, {
    headers: { 'Cache-Control': 'no-store' },
  })
}
