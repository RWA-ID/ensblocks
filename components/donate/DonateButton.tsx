'use client'

import { useEffect, useRef, useState } from 'react'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useAccount, useSendTransaction } from 'wagmi'
import { parseEther } from 'viem'
import { useRouter } from 'next/navigation'

interface DonateButtonProps {
  recipientAddress: string
  projectId: string
  compact?: boolean
}

type State = 'idle' | 'amount' | 'sending' | 'success' | 'error'

export default function DonateButton({ recipientAddress, projectId, compact }: DonateButtonProps) {
  const { openConnectModal } = useConnectModal()
  const { isConnected } = useAccount()
  const { sendTransactionAsync } = useSendTransaction()
  const router = useRouter()

  const [state, setState] = useState<State>('idle')
  const [amount, setAmount] = useState('0.01')
  const [txHash, setTxHash] = useState('')
  const [error, setError] = useState('')

  // Track whether the user clicked donate while disconnected
  const pendingDonate = useRef(false)
  // On compact cards, redirect to project page after connecting instead of donating inline
  const wasDisconnected = useRef(!isConnected)

  useEffect(() => {
    if (isConnected && pendingDonate.current) {
      pendingDonate.current = false
      const isRealProject = /^[0-9a-f-]{36}$/.test(projectId)
      if (compact && isRealProject) {
        router.push(`/project/${projectId}`)
      } else {
        setState('amount')
      }
    }
    wasDisconnected.current = !isConnected
  }, [isConnected, compact, projectId, router])

  function handleClick() {
    if (!isConnected) {
      pendingDonate.current = true
      openConnectModal?.()
      return
    }
    if (state === 'idle') setState('amount')
  }

  async function sendDonation() {
    try {
      setState('sending')
      const hash = await sendTransactionAsync({
        to: recipientAddress as `0x${string}`,
        value: parseEther(amount),
      })
      await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId, txHash: hash, to: recipientAddress, amount }),
      })
      setTxHash(hash)
      setState('success')
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Transaction failed')
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div className="text-center text-xs text-green-400 py-1">
        ✓ Donated Ξ{amount}!{' '}
        <a href={`https://etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer" className="underline">
          View tx
        </a>
      </div>
    )
  }

  if (state === 'amount') {
    return (
      <div className="flex gap-2 items-center">
        <span className="text-[#8888AA] text-sm">Ξ</span>
        <input
          type="number"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          step="0.001"
          min="0.001"
          className="w-20 bg-[#12121A] border border-[#2A2A3E] rounded-lg px-2 py-1 text-sm text-[#F0F0FF] focus:outline-none focus:border-[#6C63FF]"
        />
        <button
          onClick={sendDonation}
          className="flex-1 bg-[#6C63FF] text-white text-xs py-1.5 rounded-lg hover:bg-[#5A52E0] transition-colors"
        >
          Send
        </button>
        <button onClick={() => setState('idle')} className="text-[#8888AA] text-xs">✕</button>
      </div>
    )
  }

  if (state === 'error') {
    return (
      <div className="text-xs text-red-400">
        {error.slice(0, 60)}{' '}
        <button onClick={() => setState('idle')} className="underline">retry</button>
      </div>
    )
  }

  return (
    <button
      onClick={handleClick}
      disabled={state === 'sending'}
      className={`w-full transition-colors rounded-full font-medium ${
        compact
          ? 'text-xs py-1.5 border border-[#6C63FF]/50 text-[#6C63FF] hover:bg-[#6C63FF]/10'
          : 'py-3 bg-[#6C63FF] text-white hover:bg-[#5A52E0]'
      } disabled:opacity-50`}
    >
      {state === 'sending' ? 'Sending…' : compact ? 'Donate Ξ' : 'Donate ETH'}
    </button>
  )
}
