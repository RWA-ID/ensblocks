'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'

export default function WalletConnectButton() {
  const { isConnected } = useAccount()
  const router = useRouter()
  const prevConnected = useRef(isConnected)

  useEffect(() => {
    if (prevConnected.current && !isConnected) {
      router.push('/')
    }
    prevConnected.current = isConnected
  }, [isConnected, router])

  return (
    <ConnectButton
      showBalance={false}
      chainStatus="none"
      accountStatus={{ smallScreen: 'avatar', largeScreen: 'full' }}
    />
  )
}
