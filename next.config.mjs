/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // Stub out Coinbase Smart Wallet dep — we don't use Base/Coinbase connectors
    config.resolve.alias['@base-org/account'] = false
    config.resolve.alias['porto/internal'] = false
    config.resolve.alias['@coinbase/wallet-sdk'] = false
    return config
  },
}

export default nextConfig
