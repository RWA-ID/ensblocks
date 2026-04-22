import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { getAddress } from 'viem'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const category = searchParams.get('category')
  const sort = searchParams.get('sort') ?? 'donation_total'
  const search = searchParams.get('q')
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = 12

  const db = supabaseAdmin()
  let query = db.from('projects').select('*').range((page - 1) * limit, page * limit - 1)

  if (category) query = query.eq('category', category)
  if (search) query = query.or(`name.ilike.%${search}%,tagline.ilike.%${search}%,ens_domain.ilike.%${search}%`)

  if (sort === 'donation_total') query = query.order('donation_total', { ascending: false })
  else if (sort === 'newest') query = query.order('created_at', { ascending: false })
  else if (sort === 'alphabetical') query = query.order('name', { ascending: true })

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const submitter = req.headers.get('x-submitter')
  if (!submitter) return NextResponse.json({ error: 'Wallet not connected' }, { status: 401 })

  let submitterAddress: string
  try {
    submitterAddress = getAddress(submitter)
  } catch {
    return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 })
  }

  const body = await req.json()
  const db = supabaseAdmin()

  // Rate limit: 5 per wallet per hour
  const hourAgo = new Date(Date.now() - 3600000).toISOString()
  const { count } = await db
    .from('projects')
    .select('*', { count: 'exact', head: true })
    .eq('submitter_address', submitterAddress)
    .gte('created_at', hourAgo)

  if ((count ?? 0) >= 5) {
    return NextResponse.json({ error: 'Rate limit: max 5 submissions per hour' }, { status: 429 })
  }

  const { data, error } = await db.from('projects').insert({
    ...body,
    submitter_address: submitterAddress,
    wallet_address: getAddress(body.wallet_address),
    ens_domain: body.ens_domain.toLowerCase(),
  }).select().single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
