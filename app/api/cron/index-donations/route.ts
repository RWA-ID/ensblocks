import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { indexDonationsForWallet } from '@/lib/indexer'

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = supabaseAdmin()
  const { data: projects } = await db.from('projects').select('wallet_address')
  if (!projects) return NextResponse.json({ ok: true, indexed: 0 })

  const wallets = Array.from(new Set(projects.map(p => p.wallet_address)))
  await Promise.all(wallets.map(w => indexDonationsForWallet(w).catch(() => {})))

  return NextResponse.json({ ok: true, indexed: wallets.length })
}
