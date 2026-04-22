import { NextResponse } from 'next/server'
import { resolveEnsAddress } from '@/lib/ens'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get('name')
  if (!name) return NextResponse.json({ address: null })
  const address = await resolveEnsAddress(name)
  return NextResponse.json({ address })
}
