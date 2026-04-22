/** @type {import('next').NextConfig} */
const isIPFS = process.env.BUILD_TARGET === 'ipfs'

const nextConfig = {
  ...(isIPFS ? { output: 'export', trailingSlash: true, images: { unoptimized: true } } : {}),
  serverExternalPackages: ['@xmtp/user-preferences-bindings-wasm'],
  webpack(config) {
    // Stub optional wallet connector peer deps we don't use
    const stubs = [
      '@base-org/account',
      'porto/internal',
      '@coinbase/wallet-sdk',
      '@metamask/connect-evm',
      '@metamask/sdk',
      'accounts',
    ]
    stubs.forEach(mod => { config.resolve.alias[mod] = false })
    return config
  },
}

export default nextConfig
