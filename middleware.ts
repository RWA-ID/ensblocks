import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  if (req.method === 'OPTIONS') {
    return new NextResponse(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, x-submitter',
      },
    })
  }

  const res = NextResponse.next()
  res.headers.set('Access-Control-Allow-Origin', '*')
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS')
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, x-submitter')
  return res
}

export const config = {
  matcher: '/api/:path*',
}
