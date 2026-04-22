'use client'

import { createConfig, http } from 'wagmi'
import { mainnet } from 'wagmi/chains'

export const wagmiConfig = createConfig({
  chains: [mainnet],
  transports: {
    [mainnet.id]: http(process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_RPC || 'https://eth-mainnet.g.alchemy.com/v2/demo'),
  },
  ssr: true,
})
