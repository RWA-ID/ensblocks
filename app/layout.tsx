'use client'

import './globals.css'
import '@rainbow-me/rainbowkit/styles.css'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import { wagmiConfig } from '@/lib/wagmi'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useState } from 'react'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <html lang="en">
      <head>
        <title>ensblocks.eth — Discover ENS Projects</title>
        <meta name="description" content="The discovery and showcase platform for projects built on ENS." />
      </head>
      <body>
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProvider theme={darkTheme({
              accentColor: '#6C63FF',
              accentColorForeground: 'white',
              borderRadius: 'large',
            })}>
              <Navbar />
              <main className="min-h-screen pt-16">
                {children}
              </main>
              <Footer />
            </RainbowKitProvider>
          </QueryClientProvider>
        </WagmiProvider>
      </body>
    </html>
  )
}
