'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ConnectWallet } from './ConnectWallet'

export default function Header() {
    const pathname = usePathname()

    // Don’t show on login page
    if (pathname === '/login') return null

    return (
        <header className="w-full px-6 py-4 flex items-center justify-between border-b border-zinc-800 bg-zinc-900 shadow-md">
            <Link href="/">
                <h1 className="text-xl font-bold text-white tracking-wide hover:opacity-80 transition">
                    KnowledgeHub
                </h1>
            </Link>

            <div>
                <ConnectWallet />
            </div>
        </header>
    )
}
