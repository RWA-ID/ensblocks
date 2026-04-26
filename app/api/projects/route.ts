import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createPublicClient, http, getAddress, namehash } from 'viem'
import { mainnet } from 'viem/chains'

const ENS_REGISTRY = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e' as const
const ENS_REGISTRY_ABI = [
  { name: 'owner', type: 'function', stateMutability: 'view',
    inputs: [{ name: 'node', type: 'bytes32' }],
    outputs: [{ name: '', type: 'address' }] },
] as const

async function getEnsOwner(domain: string): Promise<string | null> {
  try {
    const client = createPublicClient({
      chain: mainnet,
      transport: http(process.env.ALCHEMY_MAINNET_RPC),
    })
    const node = namehash(domain)
    const owner = await client.readContract({
      address: ENS_REGISTRY, abi: ENS_REGISTRY_ABI, functionName: 'owner', args: [node],
    })
    return owner as string
  } catch {
    return null
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const db = supabaseAdmin()

  // Single project lookup: /api/projects?id=xxx
  const id = searchParams.get('id')
  if (id) {
    const { data, error } = await db.from('projects').select('*').eq('id', id).single()
    if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
    })
  }

  const category = searchParams.get('category')
  const sort = searchParams.get('sort') ?? 'donation_total'
  const search = searchParams.get('q')
  const submitter = searchParams.get('submitter')
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = 12

  let query = db.from('projects').select('*').range((page - 1) * limit, page * limit - 1)

  if (submitter) query = query.eq('submitter_address', submitter)
  if (category) query = query.eq('category', category)
  if (search) query = query.or(`name.ilike.%${search}%,tagline.ilike.%${search}%,ens_domain.ilike.%${search}%`)

  if (sort === 'donation_total') query = query.order('donation_total', { ascending: false })
  else if (sort === 'newest') query = query.order('created_at', { ascending: false })
  else if (sort === 'alphabetical') query = query.order('name', { ascending: true })

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, {
    headers: { 'Cache-Control': 'no-store' },
  })
}

export async function POST(req: Request) {
  try {
    const submitter = req.headers.get('x-submitter')
    if (!submitter) return NextResponse.json({ error: 'Wallet not connected' }, { status: 401 })

    let submitterAddress: string
    try {
      submitterAddress = getAddress(submitter)
    } catch {
      return NextResponse.json({ error: 'Invalid submitter address' }, { status: 400 })
    }

    const body = await req.json()

    if (!body.wallet_address) {
      return NextResponse.json({ error: 'Donation wallet address is required' }, { status: 400 })
    }

    let walletAddress: string
    try {
      walletAddress = getAddress(body.wallet_address)
    } catch {
      return NextResponse.json({ error: 'Invalid donation wallet address — make sure your ENS resolved correctly' }, { status: 400 })
    }

    // Verify ENS ownership on-chain
    const ensDomain = body.ens_domain?.toLowerCase()
    if (!ensDomain) {
      return NextResponse.json({ error: 'ENS domain is required' }, { status: 400 })
    }
    const ensOwner = await getEnsOwner(ensDomain)
    if (!ensOwner) {
      return NextResponse.json({ error: 'Could not verify ENS ownership — please try again' }, { status: 400 })
    }
    if (ensOwner.toLowerCase() !== submitterAddress.toLowerCase()) {
      return NextResponse.json({ error: `You must be the owner of ${ensDomain} to submit this project` }, { status: 403 })
    }

    const db = supabaseAdmin()

    // Rate limit: 5 per wallet per hour
    let count = 0
    try {
      const hourAgo = new Date(Date.now() - 3600000).toISOString()
      const { count: c, error: rateErr } = await db
        .from('projects')
        .select('*', { count: 'exact', head: true })
        .eq('submitter_address', submitterAddress)
        .gte('created_at', hourAgo)
      if (rateErr) console.error('rate limit query error:', rateErr)
      count = c ?? 0
    } catch (rateEx) {
      console.error('rate limit exception:', rateEx)
      return NextResponse.json({ error: 'rate-limit-check-failed: ' + String(rateEx) }, { status: 500 })
    }

    if (count >= 5) {
      return NextResponse.json({ error: 'Rate limit: max 5 submissions per hour' }, { status: 429 })
    }

    const { data, error } = await db.from('projects').insert({
      ens_domain: body.ens_domain?.toLowerCase(),
      name: body.name,
      tagline: body.tagline,
      category: body.category,
      short_desc: body.short_desc,
      long_desc: body.long_desc,
      founder_name: body.founder_name,
      wallet_address: walletAddress,
      contact_email: body.contact_email || null,
      contact_telegram: body.contact_telegram || null,
      contact_twitter: body.contact_twitter || null,
      contact_discord: body.contact_discord || null,
      website_url: body.website_url || null,
      github_url: body.github_url || null,
      demo_url: body.demo_url || null,
      ipfs_pitch_deck: body.ipfs_pitch_deck || null,
      ipfs_images: body.ipfs_images?.length ? body.ipfs_images : null,
      seeking_funding: body.seeking_funding ?? false,
      submitter_address: submitterAddress,
      verified_ens_owner: true,
    }).select().single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data, { status: 201 })
  } catch (e: unknown) {
    console.error('POST /api/projects error:', e)
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Unexpected server error' }, { status: 500 })
  }
}

const EDITABLE_FIELDS = [
  'name', 'tagline', 'category', 'short_desc', 'long_desc', 'founder_name',
  'wallet_address', 'contact_email', 'contact_telegram', 'contact_twitter',
  'contact_discord', 'website_url', 'github_url', 'demo_url',
  'ipfs_pitch_deck', 'ipfs_images', 'seeking_funding',
]

export async function PATCH(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) return NextResponse.json({ error: 'Project id required' }, { status: 400 })

    const submitter = req.headers.get('x-submitter')
    if (!submitter) return NextResponse.json({ error: 'Wallet not connected' }, { status: 401 })

    let submitterAddress: string
    try {
      submitterAddress = getAddress(submitter)
    } catch {
      return NextResponse.json({ error: 'Invalid submitter address' }, { status: 400 })
    }

    const db = supabaseAdmin()
    const { data: project, error: fetchErr } = await db
      .from('projects').select('submitter_address, ens_domain').eq('id', id).single()
    if (fetchErr || !project) return NextResponse.json({ error: 'Project not found' }, { status: 404 })

    if (project.submitter_address.toLowerCase() !== submitterAddress.toLowerCase()) {
      return NextResponse.json({ error: 'Only the project owner can edit this listing' }, { status: 403 })
    }

    // Re-verify ENS ownership so a transferred ENS can't be edited by old owner
    const ensOwner = await getEnsOwner(project.ens_domain)
    if (ensOwner && ensOwner.toLowerCase() !== submitterAddress.toLowerCase()) {
      return NextResponse.json({ error: 'ENS domain ownership has changed — edit not allowed' }, { status: 403 })
    }

    const body = await req.json()
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
    for (const field of EDITABLE_FIELDS) {
      if (field in body) updates[field] = body[field] ?? null
    }

    if (updates.wallet_address) {
      try { updates.wallet_address = getAddress(updates.wallet_address as string) }
      catch { return NextResponse.json({ error: 'Invalid donation wallet address' }, { status: 400 }) }
    }

    const { data, error } = await db.from('projects').update(updates).eq('id', id).select().single()
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch (e: unknown) {
    console.error('PATCH /api/projects error:', e)
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Unexpected server error' }, { status: 500 })
  }
}
