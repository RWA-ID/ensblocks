import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(_req: Request, { params }: { params: { wallet: string } }) {
  const db = supabaseAdmin()
  const { data, error } = await db
    .from('donations')
    .select('amount_eth')
    .eq('to_address', params.wallet)

  if (error) return NextResponse.json({ total: '0', count: 0 })

  const total = data.reduce((sum, d) => sum + Number(d.amount_eth), 0)
  return NextResponse.json({ total: total.toFixed(6), count: data.length })
}
