import { execSync } from 'child_process'
import { renameSync, copyFileSync, existsSync } from 'fs'
import { resolve } from 'path'

const root = process.cwd()
const apiDir = resolve(root, 'app/api')
const apiBak = resolve(root, 'app/_api_bak')

// Hide API routes — all API calls go to Vercel from IPFS anyway
renameSync(apiDir, apiBak)

let buildOk = false
try {
  execSync(
    'BUILD_TARGET=ipfs NEXT_PUBLIC_API_URL=https://ensblocks.vercel.app npx next build',
    { stdio: 'inherit', cwd: root }
  )
  buildOk = true
} finally {
  renameSync(apiBak, apiDir)
  console.log('✓ Restored app/api')
}

if (buildOk) {
  const outIndex = resolve(root, 'out/index.html')
  const out404   = resolve(root, 'out/404.html')
  if (existsSync(outIndex)) {
    copyFileSync(outIndex, out404)
    console.log('✓ Copied index.html → 404.html for SPA fallback')
  }
  console.log('\n✅ IPFS build complete — upload the out/ folder to Pinata')
}
