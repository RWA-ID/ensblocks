import { PinataSDK } from 'pinata'
import { readFileSync, readdirSync } from 'fs'
import { resolve, join } from 'path'

const jwt = process.env.PINATA_JWT
if (!jwt) { console.error('PINATA_JWT not set'); process.exit(1) }

const pinata = new PinataSDK({ pinataJwt: jwt })
const outDir = resolve(process.cwd(), 'out')

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

const fileObjects = allFiles.map(({ full, rel }) => {
  const buf = readFileSync(full)
  return new File([buf], rel)
})

console.log('Uploading to Pinata...')
try {
  const result = await pinata.upload.public.fileArray(fileObjects)
  console.log('\n✅ Upload complete!')
  console.log(`CID: ${result.cid}`)
  console.log(`View: https://gateway.pinata.cloud/ipfs/${result.cid}`)
} catch (e) {
  console.error('Upload failed:', e?.message ?? e)
  process.exit(1)
}
