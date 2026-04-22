'use client'

import { useEffect, useRef, useState } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { Client } from '@xmtp/xmtp-js'
import { createEOASigner } from '@/lib/xmtp'

interface XMTPChatModalProps {
  recipientAddress: string
  recipientName: string
  onClose: () => void
}

type Message = { id: string; senderAddress: string; content: string; sent: Date }

export default function XMTPChatModal({ recipientAddress, recipientName, onClose }: XMTPChatModalProps) {
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()
  const { open } = useWeb3Modal()

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [status, setStatus] = useState<'idle' | 'connecting' | 'ready' | 'error'>('idle')
  const [canMessage, setCanMessage] = useState<boolean | null>(null)
  const [sending, setSending] = useState(false)
  const conversationRef = useRef<Awaited<ReturnType<Client['conversations']['newConversation']>> | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function connect() {
    if (!isConnected) { open(); return }
    if (!walletClient || !address) return
    setStatus('connecting')
    try {
      const signer = createEOASigner(address, walletClient)
      // @ts-expect-error — XMTP signer type compat
      const xmtp = await Client.create(signer, { env: 'production' })

      const can = await Client.canMessage(recipientAddress)
      setCanMessage(can)

      if (can) {
        const convo = await xmtp.conversations.newConversation(recipientAddress)
        conversationRef.current = convo
        const history = await convo.messages()
        setMessages(history.map(m => ({
          id: m.id,
          senderAddress: m.senderAddress,
          content: m.content as string,
          sent: m.sent,
        })))
      }
      setStatus('ready')
    } catch {
      setStatus('error')
    }
  }

  async function send() {
    if (!input.trim() || !conversationRef.current) return
    setSending(true)
    try {
      await conversationRef.current.send(input.trim())
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        senderAddress: address!,
        content: input.trim(),
        sent: new Date(),
      }])
      setInput('')
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-[#12121A] border border-[#2A2A3E] rounded-2xl w-full max-w-md flex flex-col h-[560px]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#2A2A3E]">
          <div>
            <p className="text-[#F0F0FF] font-semibold text-sm">{recipientName}</p>
            <p className="text-[10px] text-[#8888AA] font-mono">{recipientAddress.slice(0, 6)}…{recipientAddress.slice(-4)}</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-[#6C63FF] bg-[#6C63FF]/10 px-2 py-0.5 rounded-full">XMTP</span>
            <button onClick={onClose} className="text-[#8888AA] hover:text-[#F0F0FF] text-xl">✕</button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
          {status === 'idle' && (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <div className="text-4xl">💬</div>
              <div>
                <p className="text-[#F0F0FF] font-medium mb-1">Message {recipientName}</p>
                <p className="text-xs text-[#8888AA]">Send a direct encrypted message via XMTP to discuss funding.</p>
              </div>
              <button
                onClick={connect}
                className="px-6 py-2.5 rounded-full bg-[#6C63FF] text-white text-sm font-medium hover:bg-[#5A52E0] transition-colors"
              >
                {isConnected ? 'Connect to XMTP' : 'Connect Wallet'}
              </button>
            </div>
          )}

          {status === 'connecting' && (
            <div className="flex items-center justify-center h-full">
              <p className="text-[#8888AA] text-sm animate-pulse">Connecting to XMTP…</p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <p className="text-red-400 text-sm">Failed to connect.</p>
              <button onClick={connect} className="text-xs text-[#6C63FF] hover:underline">Try again</button>
            </div>
          )}

          {status === 'ready' && canMessage === false && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center px-6">
              <p className="text-[#8888AA] text-sm">
                This founder hasn&apos;t enabled XMTP yet. Try reaching out via their contact links instead.
              </p>
            </div>
          )}

          {status === 'ready' && canMessage === true && (
            <>
              {messages.length === 0 && (
                <p className="text-center text-xs text-[#8888AA] pt-4">No messages yet. Say hi!</p>
              )}
              {messages.map(m => {
                const isMine = m.senderAddress.toLowerCase() === address?.toLowerCase()
                return (
                  <div key={m.id} className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] px-3 py-2 rounded-2xl text-sm ${
                      isMine ? 'bg-[#6C63FF] text-white rounded-br-sm' : 'bg-[#1A1A26] text-[#F0F0FF] rounded-bl-sm'
                    }`}>
                      {m.content}
                    </div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </>
          )}
        </div>

        {/* Input */}
        {status === 'ready' && canMessage === true && (
          <div className="px-4 pb-4 pt-2 border-t border-[#2A2A3E]">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                placeholder="Type a message…"
                className="flex-1 bg-[#1A1A26] border border-[#2A2A3E] rounded-xl px-4 py-2.5 text-sm text-[#F0F0FF] placeholder-[#8888AA] focus:outline-none focus:border-[#6C63FF]"
              />
              <button
                onClick={send}
                disabled={!input.trim() || sending}
                className="px-4 py-2.5 rounded-xl bg-[#6C63FF] text-white text-sm font-medium hover:bg-[#5A52E0] transition-colors disabled:opacity-50"
              >
                {sending ? '…' : '↑'}
              </button>
            </div>
            <p className="text-[10px] text-[#8888AA]/60 mt-1.5 text-center">End-to-end encrypted via XMTP</p>
          </div>
        )}
      </div>
    </div>
  )
}
