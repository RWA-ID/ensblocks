import { NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  const body = await req.json()
  const { name, company, email, tier, message } = body

  if (!name || !company || !email || !tier) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const db = supabaseAdmin()
  await db.from('sponsor_inquiries').insert({ name, company, email, tier, message })

  // Send email via Resend if configured
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
        subject: `New Sponsor Inquiry: ${tier} tier from ${company}`,
        text: `Name: ${name}\nCompany: ${company}\nEmail: ${email}\nTier: ${tier}\nMessage: ${message ?? 'N/A'}`,
      }),
    }).catch(() => {})
  }

  return NextResponse.json({ ok: true })
}
