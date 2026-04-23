export async function resolveEnsAddress(name: string): Promise<string | null> {
  try {
    const { createPublicClient, http } = await import('viem')
    const { mainnet } = await import('viem/chains')
    const client = createPublicClient({
      chain: mainnet,
      transport: http(process.env.ALCHEMY_MAINNET_RPC || 'https://eth-mainnet.g.alchemy.com/v2/demo'),
    })
    const address = await client.getEnsAddress({ name: name.toLowerCase() })
    return address ?? null
  } catch {
    return null
  }
}
