import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  const { projectId, txHash, to, amount } = await req.json()
  if (!projectId || !txHash || !to || !amount) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
  }

  const db = supabaseAdmin()
  await db.from('donations').upsert({
    project_id: projectId,
    tx_hash: txHash,
    from_address: '0x0',
    to_address: to,
    amount_eth: parseFloat(amount),
    block_number: 0,
  }, { onConflict: 'tx_hash', ignoreDuplicates: true })

  return NextResponse.json({ ok: true })
}
