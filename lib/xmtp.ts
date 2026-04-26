import type { WalletClient } from 'viem'

export function createEOASigner(address: `0x${string}`, walletClient: WalletClient) {
  return {
    getAddress: async () => address,
    signMessage: async (message: string) => {
      return await walletClient.signMessage({ account: address, message })
    },
  }
}
