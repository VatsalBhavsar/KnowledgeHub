'use client'

import { useAccount } from 'wagmi'
import { useRouter } from 'next/navigation'
import { useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

export default function WalletGuard({ children }: { children: React.ReactNode }) {
    const { isConnected } = useAccount()
    const router = useRouter()
    const hasRedirected = useRef(false) // ⛔ Prevent double toasts

    useEffect(() => {
        if (!isConnected && !hasRedirected.current) {
            hasRedirected.current = true
            toast.error('Please connect your wallet to access that page.')
            router.push('/')
        }
    }, [isConnected, router])

    return isConnected ? <>{children}</> : null
}
