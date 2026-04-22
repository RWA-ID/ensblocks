/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
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
