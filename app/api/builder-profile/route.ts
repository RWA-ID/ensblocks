import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAddress } from 'viem'

const EDITABLE_FIELDS = ['display_name', 'bio', 'avatar_ipfs', 'twitter', 'github', 'telegram', 'discord', 'website']

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const wallet = searchParams.get('wallet')
  if (!wallet) return NextResponse.json({ error: 'wallet required' }, { status: 400 })

  let address: string
  try { address = getAddress(wallet) } catch {
    return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
  }

  const db = supabaseAdmin()
  const { data, error } = await db.from('builder_profiles').select('*').eq('wallet_address', address).single()
  if (error && error.code !== 'PGRST116') return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data ?? null)
}

export async function POST(req: Request) {
  return upsertProfile(req)
}

export async function PATCH(req: Request) {
  return upsertProfile(req)
}

async function upsertProfile(req: Request) {
  try {
    const submitter = req.headers.get('x-submitter')
    if (!submitter) return NextResponse.json({ error: 'Wallet not connected' }, { status: 401 })

    let submitterAddress: string
    try { submitterAddress = getAddress(submitter) } catch {
      return NextResponse.json({ error: 'Invalid submitter address' }, { status: 400 })
    }

    const body = await req.json()
    const updates: Record<string, unknown> = {
      wallet_address: submitterAddress,
      updated_at: new Date().toISOString(),
    }
    for (const field of EDITABLE_FIELDS) {
      if (field in body) updates[field] = body[field] || null
    }

    const db = supabaseAdmin()
    const { data, error } = await db
      .from('builder_profiles')
      .upsert(updates, { onConflict: 'wallet_address' })
      .select()
      .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Unexpected error' }, { status: 500 })
  }
}
