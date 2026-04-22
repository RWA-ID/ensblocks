import { supabaseAdmin } from './supabase'

interface AlchemyTransfer {
  hash: string
  from: string
  to: string
  value: string
  blockNum: string
}

export async function indexDonationsForWallet(walletAddress: string) {
  const db = supabaseAdmin()
  const alchemyKey = process.env.ALCHEMY_API_KEY!
  const rpc = `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`

  const res = await fetch(rpc, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      id: 1,
      jsonrpc: '2.0',
      method: 'alchemy_getAssetTransfers',
      params: [{
        toAddress: walletAddress,
        category: ['external'],
        excludeZeroValue: true,
        withMetadata: false,
        maxCount: '0x64',
      }],
    }),
  })

  const json = await res.json()
  const transfers: AlchemyTransfer[] = json.result?.transfers ?? []

  const { data: project } = await db
    .from('projects')
    .select('id')
    .eq('wallet_address', walletAddress)
    .single()

  if (!project) return

  for (const tx of transfers) {
    const amountEth = parseFloat(tx.value)
    if (isNaN(amountEth) || amountEth <= 0) continue

    await db.from('donations').upsert({
      project_id: project.id,
      tx_hash: tx.hash,
      from_address: tx.from,
      to_address: tx.to,
      amount_eth: amountEth,
      block_number: parseInt(tx.blockNum, 16),
    }, { onConflict: 'tx_hash', ignoreDuplicates: true })
  }

  await db.rpc('refresh_donation_total', { p_wallet: walletAddress })
}
