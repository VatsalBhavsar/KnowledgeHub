'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ConnectWallet } from './ConnectWallet'
import ThemeToggle from './ThemeToggle'

export default function Header() {
    const pathname = usePathname()

    // Don’t show on login page
    if (pathname === '/login') return null

    return (
        <header className="w-full px-6 py-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm dark:shadow-md transition-colors duration-300">
            <Link href="/">
                <h1 className="text-xl font-bold text-zinc-800 dark:text-white tracking-wide hover:opacity-80 transition">
                    KnowledgeHub
                </h1>
            </Link>

            <div className="flex items-center gap-3">
                <ThemeToggle />
                <ConnectWallet />
            </div>
        </header>
    )
}
