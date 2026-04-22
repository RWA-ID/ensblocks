import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'

export const publicClient = createPublicClient({
  chain: mainnet,
  transport: http(process.env.ALCHEMY_MAINNET_RPC || 'https://eth-mainnet.g.alchemy.com/v2/demo'),
})

export async function resolveEnsAddress(name: string): Promise<string | null> {
  try {
    const address = await publicClient.getEnsAddress({ name: name.toLowerCase() })
    return address ?? null
  } catch {
    return null
  }
}
