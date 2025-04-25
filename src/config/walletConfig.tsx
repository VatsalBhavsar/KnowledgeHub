'use client'

import '@rainbow-me/rainbowkit/styles.css'
import {
  RainbowKitProvider,
  getDefaultConfig,
  darkTheme,
  lightTheme,
} from '@rainbow-me/rainbowkit'

import { WagmiProvider } from 'wagmi'
import { sepolia } from 'wagmi/chains'
import { http } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode } from 'react'
import { useTheme } from '@/components/ThemeProvider'

const queryClient = new QueryClient()

const config = getDefaultConfig({
  appName: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_NAME!,
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
})

export function WalletProvider({ children }: { children: ReactNode }) {
  const { theme } = useTheme()

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={theme === 'dark' ? darkTheme() : lightTheme()}
          modalSize="compact"
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
