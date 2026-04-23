import { execSync } from 'child_process'
import { renameSync, copyFileSync, existsSync } from 'fs'
import { resolve } from 'path'

const root = process.cwd()
const projectDir = resolve(root, 'app/project')
const projectBak = resolve(root, 'app/_project_bak')
const apiDir = resolve(root, 'app/api')
const apiBak = resolve(root, 'app/_api_bak')

// Hide dynamic routes — all API calls go to Vercel from IPFS anyway
renameSync(projectDir, projectBak)
renameSync(apiDir, apiBak)

let buildOk = false
try {
  execSync(
    'BUILD_TARGET=ipfs NEXT_PUBLIC_API_URL=https://ensblocks.vercel.app npx next build',
    { stdio: 'inherit', cwd: root }
  )
  buildOk = true
} finally {
  renameSync(projectBak, projectDir)
  renameSync(apiBak, apiDir)
  console.log('✓ Restored app/project and app/api')
}

if (buildOk) {
  // SPA fallback: Pinata gateway serves 404.html for unknown paths,
  // allowing client-side routing to handle /project/[id] URLs
  const outIndex = resolve(root, 'out/index.html')
  const out404   = resolve(root, 'out/404.html')
  if (existsSync(outIndex)) {
    copyFileSync(outIndex, out404)
    console.log('✓ Copied index.html → 404.html for SPA fallback')
  }
  console.log('\n✅ IPFS build complete — upload the out/ folder to Pinata')
}
