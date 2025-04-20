'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
  const { isConnected } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      // Redirect to home after login
      router.push('/');
    }
  }, [isConnected, router]);

  return (
    <div className="flex items-center justify-center h-screen bg-zinc-950 text-white">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold">Welcome to KnowledgeHub</h1>
        <p className="text-gray-400">Connect your wallet to get started</p>
        <div className="flex justify-center">
          <ConnectButton showBalance={false} />
        </div>
      </div>
    </div>
  );
}
