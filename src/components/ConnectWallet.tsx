'use client';

import { useEffect } from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useAppDispatch } from '@/store/hooks';
import { connectWallet, disconnectWallet } from '@/store/slices/walletSlice';

export const ConnectWallet = () => {
  const { address, isConnected } = useAccount();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isConnected && address) {
      dispatch(connectWallet(address));
    } else {
      dispatch(disconnectWallet());
    }
  }, [address, isConnected, dispatch]);

  return <ConnectButton showBalance={false} />;
};
