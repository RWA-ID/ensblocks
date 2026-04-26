/** @type {import('next').NextConfig} */
const isIPFS = process.env.BUILD_TARGET === 'ipfs'

const nextConfig = {
  ...(isIPFS ? { output: 'export', trailingSlash: true, images: { unoptimized: true } } : {}),
  staticPageGenerationTimeout: 180,
  experimental: {
    workerThreads: false,
    cpus: 1,
    serverComponentsExternalPackages: [
      '@xmtp/user-preferences-bindings-wasm',
      '@xmtp/browser-sdk',
      '@xmtp/wasm-bindings',
      'viem',
      'ox',
    ],
  },
  webpack(config, { isServer }) {
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

    // Prevent ox/viem tempo module from running in Node (it uses indexedDB)
    if (isServer) {
      config.resolve.alias['ox/_esm/tempo/internal/virtualMasterPool'] = false
      config.resolve.alias['ox/_esm/tempo/internal/virtualMasterPool.js'] = false
      config.resolve.alias['ox/_esm/tempo/VirtualMaster'] = false
      config.resolve.alias['ox/_esm/tempo/VirtualMaster.js'] = false
    }

    config.experiments = { ...config.experiments, asyncWebAssembly: true }

    return config
  },
}

export default nextConfig
