'use client'

import { useEffect, useRef, useState } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { useConnectModal } from '@rainbow-me/rainbowkit'
import { Client, IdentifierKind, GroupMessageKind, SortDirection, ConsentState } from '@xmtp/browser-sdk'
import { toBytes } from 'viem'

interface Props {
  onClose: () => void
}

type ConvoSummary = {
  id: string
  peerInboxId: string
  lastMessage: string
  lastSentAt: Date | null
}

type Message = { id: string; senderInboxId: string; content: string; sentAt: Date }

export default function XMTPInboxModal({ onClose }: Props) {
  const { address, isConnected } = useAccount()
  const { data: walletClient } = useWalletClient()
  const { openConnectModal } = useConnectModal()

  const [status, setStatus] = useState<'idle' | 'connecting' | 'ready' | 'error'>('idle')
  const [connectStep, setConnectStep] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [convos, setConvos] = useState<ConvoSummary[]>([])
  const [debugInfo, setDebugInfo] = useState('')
  const [activeConvo, setActiveConvo] = useState<ConvoSummary | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [myInboxId, setMyInboxId] = useState('')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const xmtpRef = useRef<any>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const convoRef = useRef<any>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!activeConvo || !convoRef.current) return
    const interval = setInterval(async () => {
      try {
        await convoRef.current.sync()
        const msgs = await convoRef.current.messages({
          kind: GroupMessageKind.Application,
          direction: SortDirection.Ascending,
        })
        setMessages(msgs
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((m: any) => typeof m.content === 'string' && m.content.length > 0)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((m: any) => ({ id: m.id, senderInboxId: m.senderInboxId, content: m.content as string, sentAt: m.sentAt }))
        )
      } catch { /* silent */ }
    }, 3000)
    return () => clearInterval(interval)
  }, [activeConvo])

  async function connect() {
    if (!isConnected) { openConnectModal?.(); return }
    if (!walletClient || !address) return
    setStatus('connecting')
    setConnectStep('Loading encrypted messaging engine…')
    setErrorMsg('')
    try {
      const signer = {
        type: 'EOA' as const,
        getIdentifier: () => ({
          identifier: address.toLowerCase(),
          identifierKind: IdentifierKind.Ethereum,
        }),
        signMessage: async (message: string): Promise<Uint8Array> => {
          const sig = await walletClient.signMessage({ account: address, message })
          return toBytes(sig)
        },
      }

      setConnectStep('Sign the prompts in your wallet to enable messaging…')
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const xmtp = await Client.create(signer, { env: 'production' } as any)
      xmtpRef.current = xmtp
      setMyInboxId(xmtp.inboxId ?? '')
      setConnectStep('Loading your inbox…')

      const allStates = [ConsentState.Allowed, ConsentState.Unknown]
      // sync() discovers new conversations from the network, syncAll() syncs messages in known ones
      await xmtp.conversations.sync()
      await xmtp.conversations.syncAll(allStates)
      const dms = await xmtp.conversations.listDms({ consentStates: allStates })
      setDebugInfo(`inboxId: ${xmtp.inboxId?.slice(0, 12)}… | DMs found: ${dms.length}`)

      const summaries: ConvoSummary[] = await Promise.all(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dms.map(async (dm: any) => {
          const msgs = await dm.messages({
            kind: GroupMessageKind.Application,
            direction: SortDirection.Descending,
            limit: BigInt(1),
          })
          const last = msgs[0]
          const peerInboxId = await dm.peerInboxId()
          return {
            id: dm.id,
            peerInboxId,
            lastMessage: last && typeof last.content === 'string' ? last.content : '',
            lastSentAt: last?.sentAt ?? null,
          }
        })
      )

      // Sort by most recent message first
      summaries.sort((a, b) => {
        if (!a.lastSentAt) return 1
        if (!b.lastSentAt) return -1
        return b.lastSentAt.getTime() - a.lastSentAt.getTime()
      })

      setConvos(summaries)
      setStatus('ready')
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      console.error('XMTP inbox error:', msg)
      setErrorMsg(msg)
      setStatus('error')
    }
  }

  async function openDm(convo: ConvoSummary) {
    if (!xmtpRef.current) return
    setActiveConvo(convo)
    const dms = await xmtpRef.current.conversations.listDms()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const dm = dms.find((d: any) => d.id === convo.id)
    if (!dm) return
    convoRef.current = dm
    await dm.sync()
    const history = await dm.messages({
      kind: GroupMessageKind.Application,
      direction: SortDirection.Ascending,
    })
    setMessages(
      history
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter((m: any) => typeof m.content === 'string' && m.content.length > 0)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((m: any) => ({
          id: m.id,
          senderInboxId: m.senderInboxId,
          content: m.content as string,
          sentAt: m.sentAt,
        }))
    )
  }

  async function send() {
    if (!input.trim() || !convoRef.current) return
    setSending(true)
    try {
      await convoRef.current.sendText(input.trim())
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        senderInboxId: myInboxId,
        content: input.trim(),
        sentAt: new Date(),
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
          <div className="flex items-center gap-2">
            {activeConvo && (
              <button onClick={() => { setActiveConvo(null); setMessages([]) }} className="text-[#8888AA] hover:text-[#F0F0FF] text-sm mr-1">←</button>
            )}
            <p className="text-[#F0F0FF] font-semibold text-sm">
              {activeConvo ? `${activeConvo.peerInboxId.slice(0, 8)}…` : '📬 Messages'}
            </p>
            <span className="text-[10px] text-[#6C63FF] bg-[#6C63FF]/10 px-2 py-0.5 rounded-full">XMTP</span>
          </div>
          <button onClick={onClose} className="text-[#8888AA] hover:text-[#F0F0FF] text-xl">✕</button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {status === 'idle' && (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-6">
              <div className="text-4xl">📬</div>
              <div>
                <p className="text-[#F0F0FF] font-medium mb-1">Your Inbox</p>
                <p className="text-xs text-[#8888AA]">Connect to see encrypted messages from your supporters.</p>
              </div>
              <button
                onClick={connect}
                className="px-6 py-2.5 rounded-full bg-[#6C63FF] text-white text-sm font-medium hover:bg-[#5A52E0] transition-colors"
              >
                {isConnected ? 'Open Inbox' : 'Connect Wallet'}
              </button>
            </div>
          )}

          {status === 'connecting' && (
            <div className="flex flex-col items-center justify-center h-full gap-3">
              <div className="w-6 h-6 border-2 border-[#6C63FF] border-t-transparent rounded-full animate-spin" />
              <p className="text-[#8888AA] text-sm text-center px-4">{connectStep}</p>
            </div>
          )}

          {status === 'error' && (
            <div className="flex flex-col items-center justify-center h-full gap-3 px-4">
              <p className="text-red-400 text-sm text-center">Failed to load inbox.</p>
              {errorMsg && <p className="text-red-400/70 text-xs text-center break-all">{errorMsg}</p>}
              <button onClick={connect} className="text-xs text-[#6C63FF] hover:underline">Try again</button>
            </div>
          )}

          {status === 'ready' && !activeConvo && (
            <div className="flex flex-col h-full">
              {convos.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-2 text-center px-6">
                  <p className="text-[#8888AA] text-sm">No messages yet.</p>
                  <p className="text-xs text-[#8888AA]/60">When supporters message you, they&apos;ll appear here.</p>
                  {debugInfo && <p className="text-[10px] text-[#6C63FF]/60 font-mono mt-2">{debugInfo}</p>}
                </div>
              ) : (
                <div className="divide-y divide-[#2A2A3E]">
                  {convos.map(c => (
                    <button
                      key={c.id}
                      onClick={() => openDm(c)}
                      className="w-full px-5 py-4 text-left hover:bg-[#1A1A26] transition-colors"
                    >
                      <p className="text-xs text-[#6C63FF] font-mono mb-1">{c.peerInboxId.slice(0, 16)}…</p>
                      <p className="text-sm text-[#F0F0FF] truncate">{c.lastMessage || 'No messages yet'}</p>
                      {c.lastSentAt && (
                        <p className="text-[10px] text-[#8888AA] mt-1">{c.lastSentAt.toLocaleDateString()}</p>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {status === 'ready' && activeConvo && (
            <div className="flex flex-col h-full px-4 py-3 space-y-2 overflow-y-auto">
              {messages.length === 0 && (
                <p className="text-center text-xs text-[#8888AA] pt-4">No messages yet.</p>
              )}
              {messages.map(m => {
                const isMine = m.senderInboxId === myInboxId
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
            </div>
          )}
        </div>

        {/* Reply input */}
        {status === 'ready' && activeConvo && (
          <div className="px-4 pb-4 pt-2 border-t border-[#2A2A3E]">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                placeholder="Type a reply…"
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
