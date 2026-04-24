import { NextResponse } from 'next/server'
import { createPublicClient, http, namehash } from 'viem'
import { mainnet } from 'viem/chains'

const ENS_REGISTRY = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e' as const
const ENS_REGISTRY_ABI = [
  { name: 'owner', type: 'function', stateMutability: 'view',
    inputs: [{ name: 'node', type: 'bytes32' }],
    outputs: [{ name: '', type: 'address' }] },
] as const

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const name = searchParams.get('name')
  if (!name) return NextResponse.json({ owner: null })

  try {
    const client = createPublicClient({
      chain: mainnet,
      transport: http(process.env.ALCHEMY_MAINNET_RPC),
    })
    const owner = await client.readContract({
      address: ENS_REGISTRY,
      abi: ENS_REGISTRY_ABI,
      functionName: 'owner',
      args: [namehash(name.toLowerCase())],
    })
    return NextResponse.json({ owner })
  } catch {
    return NextResponse.json({ owner: null })
  }
}
