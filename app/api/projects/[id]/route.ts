import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { indexDonationsForWallet } from '@/lib/indexer'

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const db = supabaseAdmin()
  const { data, error } = await db.from('projects').select('*').eq('id', params.id).single()
  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })

  // Revalidate donation total in background
  indexDonationsForWallet(data.wallet_address).catch(() => {})

  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
  })
}
