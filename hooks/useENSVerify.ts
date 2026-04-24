import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

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

    fetch(`${process.env.NEXT_PUBLIC_API_URL ?? ''}/api/ens-owner?name=${encodeURIComponent(ensDomain.toLowerCase())}`)
      .then(r => r.json())
      .then(({ owner }) => {
        if (cancelled) return
        setResult({
          verified: !!owner && owner.toLowerCase() === address.toLowerCase(),
          isChecking: false,
        })
      })
      .catch(() => {
        if (!cancelled) setResult({ verified: false, isChecking: false })
      })

    return () => { cancelled = true }
  }, [ensDomain, address])

  return result
}
