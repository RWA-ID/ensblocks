import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { createPublicClient, http, namehash } from 'viem'
import { mainnet } from 'viem/chains'

const ENS_REGISTRY = '0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e' as const
const ENS_REGISTRY_ABI = [
  { name: 'owner', type: 'function', stateMutability: 'view',
    inputs: [{ name: 'node', type: 'bytes32' }],
    outputs: [{ name: '', type: 'address' }] },
] as const

interface ENSVerifyResult {
  verified: boolean
  isChecking: boolean
}

export function useENSVerify(ensDomain: string): ENSVerifyResult {
  const { address } = useAccount()
  const [result, setResult] = useState<ENSVerifyResult>({ verified: false, isChecking: false })

  useEffect(() => {
    if (!ensDomain || !address) {
      setResult({ verified: false, isChecking: false })
      return
    }

    let cancelled = false
    setResult({ verified: false, isChecking: true })

    const client = createPublicClient({
      chain: mainnet,
      transport: http(process.env.NEXT_PUBLIC_ALCHEMY_MAINNET_RPC || 'https://eth-mainnet.g.alchemy.com/v2/demo'),
    })

    client.readContract({
      address: ENS_REGISTRY,
      abi: ENS_REGISTRY_ABI,
      functionName: 'owner',
      args: [namehash(ensDomain.toLowerCase())],
    }).then(owner => {
      if (cancelled) return
      setResult({
        verified: (owner as string).toLowerCase() === address.toLowerCase(),
        isChecking: false,
      })
    }).catch(() => {
      if (!cancelled) setResult({ verified: false, isChecking: false })
    })

    return () => { cancelled = true }
  }, [ensDomain, address])

  return result
}
