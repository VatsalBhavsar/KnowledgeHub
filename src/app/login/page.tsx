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
            router.push('/');
        }
    }, [isConnected, router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-white transition-colors duration-300">
            <div className="text-center space-y-10 px-6">
                {/* Welcome Text */}
                <div className="space-y-3">
                    <p className="text-lg text-gray-400 tracking-wider">Welcome to</p>
                    <div className="group relative text-5xl font-extrabold flex justify-center items-center tracking-wide">
                        <span className="text-blue-500">Knowledge</span>
                        <span className="text-white">Hub</span>
                        <span className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-full h-[2px] bg-blue-500 scale-x-0 group-hover:scale-x-100 opacity-0 group-hover:opacity-100 transition-all origin-center duration-300"></span>
                    </div>
                </div>

                {/* Taglines */}
                <div className="space-y-2">
                    <p className="text-lg text-gray-400 tracking-wide">
                        Decentralized Knowledge Sharing Platform
                    </p>
                    <p className="text-md text-gray-500 italic">
                        Empowering Authentic and Unbiased Knowledge Creation
                    </p>
                </div>

                {/* Connect Button */}
                <div className="flex justify-center pt-8">
                    <ConnectButton showBalance={false} />
                </div>
            </div>
        </div>
    );
}
