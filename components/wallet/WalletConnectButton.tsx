'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'

export default function WalletConnectButton() {
  return (
    <ConnectButton
      showBalance={false}
      chainStatus="none"
      accountStatus={{ smallScreen: 'avatar', largeScreen: 'full' }}
    />
  )
}
