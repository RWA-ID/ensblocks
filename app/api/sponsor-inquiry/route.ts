import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  const body = await req.json()
  const { name, email, url, logo_url, message } = body

  if (!name || !email) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const db = supabaseAdmin()
  await db.from('sponsor_inquiries').insert({
    name,
    company: name,
    email,
    tier: 'protocol-slot',
    url: url ?? null,
    logo_url: logo_url ?? null,
    message: message ?? null,
  })

  if (process.env.RESEND_API_KEY) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'ensblocks.eth <noreply@ensblocks.eth>',
        to: process.env.SPONSOR_INQUIRY_EMAIL ?? 'info@onchain-id.id',
        subject: `New Sponsor Inquiry from ${name}`,
        text: `Protocol: ${name}\nEmail: ${email}\nURL: ${url ?? 'N/A'}\nLogo: ${logo_url ?? 'N/A'}\nMessage: ${message ?? 'N/A'}`,
      }),
    }).catch(() => {})
  }

  return NextResponse.json({ ok: true })
}
