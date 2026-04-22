import { useEffect, useState } from 'react'

interface DonationTotal {
  total: string
  count: number
  isLoading: boolean
}

export function useDonationTotal(walletAddress: string): DonationTotal {
  const [data, setData] = useState<DonationTotal>({ total: '0', count: 0, isLoading: true })

  useEffect(() => {
    if (!walletAddress) return
    fetch(`/api/donations/${walletAddress}`)
      .then(r => r.json())
      .then(d => setData({ total: d.total, count: d.count, isLoading: false }))
      .catch(() => setData({ total: '0', count: 0, isLoading: false }))
  }, [walletAddress])

  return data
}
