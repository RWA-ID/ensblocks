import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

interface ENSVerifyResult {
  verified: boolean
  isChecking: boolean
  resolvedAddress: string | null
}

export function useENSVerify(ensDomain: string): ENSVerifyResult {
  const { address } = useAccount()
  const [result, setResult] = useState<ENSVerifyResult>({
    verified: false,
    isChecking: false,
    resolvedAddress: null,
  })

  useEffect(() => {
    if (!ensDomain || !address) {
      setResult({ verified: false, isChecking: false, resolvedAddress: null })
      return
    }
    setResult(r => ({ ...r, isChecking: true }))
    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? ''}/api/ens-resolve?name=${encodeURIComponent(ensDomain)}`)
      .then(r => r.json())
      .then(({ address: resolved }) => {
        setResult({
          verified: resolved?.toLowerCase() === address.toLowerCase(),
          isChecking: false,
          resolvedAddress: resolved,
        })
      })
      .catch(() => setResult({ verified: false, isChecking: false, resolvedAddress: null }))
  }, [ensDomain, address])

  return result
}
