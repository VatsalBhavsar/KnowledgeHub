'use client';

import '@rainbow-me/rainbowkit/styles.css';
import {
  RainbowKitProvider,
  getDefaultConfig,
  darkTheme,
  lightTheme,
} from '@rainbow-me/rainbowkit';
import { WagmiProvider } from 'wagmi';
import { sepolia } from 'wagmi/chains';
import { http } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useEffect, useState } from 'react';
import { useTheme } from 'next-themes'; // ✅ USE NEXT-THEMES for Wallet Theme Sync

const queryClient = new QueryClient();

const config = getDefaultConfig({
  appName: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_NAME!,
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID!,
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
});

export function WalletProvider({ children }: { children: ReactNode }) {
  const { resolvedTheme } = useTheme(); // ✅ NOT 'theme' but 'resolvedTheme'
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !resolvedTheme) return null;

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          key={resolvedTheme} // ✅ Correct key for dynamic remount
          modalSize="compact"
          theme={resolvedTheme === 'dark' ? darkTheme({}) : lightTheme({})}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
