import { SiweMessage } from 'siwe'
import { getSession } from '@/lib/session'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { message, signature } = await req.json()
  const session = await getSession()

  try {
    const siwe = new SiweMessage(message)
    const { data } = await siwe.verify({ signature, nonce: session.nonce })

    if (data.nonce !== session.nonce) {
      return NextResponse.json({ ok: false, error: 'Invalid nonce' }, { status: 422 })
    }

    session.address = data.address
    // ens is not a standard SIWE field — leave undefined
    session.ens = undefined
    session.nonce = undefined
    await session.save()

    return NextResponse.json({ ok: true, address: data.address })
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'Verification failed' }, { status: 422 })
  }
}
