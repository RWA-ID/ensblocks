import { readFileSync, readdirSync } from 'fs'
import { resolve, join, extname } from 'path'

const jwt = process.env.PINATA_JWT
if (!jwt) { console.error('PINATA_JWT not set'); process.exit(1) }

const outDir = resolve(process.cwd(), 'out')

const MIME = {
  '.html': 'text/html', '.css': 'text/css', '.js': 'application/javascript',
  '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml', '.ico': 'image/x-icon',
  '.webp': 'image/webp', '.woff': 'font/woff', '.woff2': 'font/woff2',
  '.txt': 'text/plain', '.xml': 'application/xml', '.pdf': 'application/pdf',
}

function getAllFiles(dir, base = '') {
  const entries = readdirSync(dir, { withFileTypes: true })
  let files = []
  for (const e of entries) {
    const full = join(dir, e.name)
    const rel = base ? base + '/' + e.name : e.name
    if (e.isDirectory()) files = files.concat(getAllFiles(full, rel))
    else files.push({ full, rel })
  }
  return files
}

const allFiles = getAllFiles(outDir)
console.log(`Preparing ${allFiles.length} files...`)

// Use Pinata's pinFileToIPFS with multipart FormData — each file gets a
// relative path in the filename so Pinata builds the proper IPFS directory tree.
const form = new FormData()

for (const { full, rel } of allFiles) {
  const buf = readFileSync(full)
  const mime = MIME[extname(rel).toLowerCase()] ?? 'application/octet-stream'
  const blob = new Blob([buf], { type: mime })
  form.append('file', blob, `ensblocks/${rel}`)
}

form.append('pinataOptions', JSON.stringify({ wrapWithDirectory: false }))
form.append('pinataMetadata', JSON.stringify({ name: 'ensblocks.eth' }))

console.log('Uploading to Pinata...')
try {
  const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: { Authorization: `Bearer ${jwt}` },
    body: form,
  })

  if (!res.ok) {
    const text = await res.text()
    console.error('Upload failed:', text)
    process.exit(1)
  }

  const { IpfsHash } = await res.json()
  console.log('\n✅ Upload complete!')
  console.log(`CID: ${IpfsHash}`)
  console.log(`View: https://gateway.pinata.cloud/ipfs/${IpfsHash}`)
} catch (e) {
  console.error('Upload failed:', e?.message ?? e)
  process.exit(1)
}
