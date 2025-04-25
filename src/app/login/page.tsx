'use client'

import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export default function LoginPage() {
    const { isConnected } = useAccount()
    const router = useRouter()

    useEffect(() => {
        if (isConnected) {
            router.push('/')
        }
    }, [isConnected, router])

    return (
        <div className="flex items-center justify-center min-h-screen bg-white dark:bg-zinc-950 text-black dark:text-white transition-colors duration-300">
            <div className="text-center space-y-6">
                <h1 className="text-4xl font-extrabold tracking-tight">Welcome to KnowledgeHub</h1>
                <p className="text-gray-600 dark:text-gray-400 text-lg">Connect your wallet to continue</p>
                <div className="flex justify-center">
                    <ConnectButton showBalance={false} />
                </div>
            </div>
        </div>
    )
}
