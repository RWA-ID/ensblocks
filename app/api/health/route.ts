import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabase_anon_key: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    supabase_service_role: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    walletconnect_project_id: !!process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID,
    api_url: process.env.NEXT_PUBLIC_API_URL ?? '(not set)',
  })
}
