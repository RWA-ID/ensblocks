import { useEffect, useState } from 'react'

interface ENSResolveResult {
  resolvedAddress: string | null
  isResolving: boolean
}

export function useENSResolve(ensDomain: string): ENSResolveResult {
  const [result, setResult] = useState<ENSResolveResult>({ resolvedAddress: null, isResolving: false })

  useEffect(() => {
    if (!ensDomain || !ensDomain.includes('.')) {
      setResult({ resolvedAddress: null, isResolving: false })
      return
    }
    setResult(r => ({ ...r, isResolving: true }))
    const timer = setTimeout(() => {
      fetch(`${process.env.NEXT_PUBLIC_API_URL ?? ''}/api/ens-resolve?name=${encodeURIComponent(ensDomain)}`)
        .then(r => r.json())
        .then(({ address }) => setResult({ resolvedAddress: address ?? null, isResolving: false }))
        .catch(() => setResult({ resolvedAddress: null, isResolving: false }))
    }, 600)
    return () => clearTimeout(timer)
  }, [ensDomain])

  return result
}
