export const IPFS_GATEWAY = 'https://gateway.pinata.cloud/ipfs'

export function ipfsUrl(cid: string): string {
  return `${IPFS_GATEWAY}/${cid}`
}

export async function uploadToPinata(file: File): Promise<string> {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PINATA_JWT}`,
    },
    body: formData,
  })

  if (!res.ok) throw new Error('Pinata upload failed')
  const data = await res.json()
  return data.IpfsHash as string
}
