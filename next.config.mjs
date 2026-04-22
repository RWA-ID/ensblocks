/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  webpack(config) {
    config.resolve.alias['@base-org/account'] = false
    config.resolve.alias['porto/internal'] = false
    config.resolve.alias['@coinbase/wallet-sdk'] = false
    return config
  },
}

export default nextConfig
