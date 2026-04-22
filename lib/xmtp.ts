import type { WalletClient } from 'viem'
import { toBytes } from 'viem'

export function createEOASigner(address: `0x${string}`, walletClient: WalletClient) {
  return {
    type: 'EOA' as const,
    getIdentifier: () => ({
      identifier: address.toLowerCase(),
      identifierKind: 'Ethereum' as const,
    }),
    signMessage: async (message: string) => {
      const signature = await walletClient.signMessage({ account: address, message })
      return toBytes(signature)
    },
  }
}
