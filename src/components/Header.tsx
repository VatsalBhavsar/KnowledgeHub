'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ConnectWallet } from './ConnectWallet'
import ThemeToggle from './ThemeToggle'

export default function Header() {
    const pathname = usePathname()

    if (pathname === '/login') return null

    return (
        <header className="w-full px-6 py-4 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 shadow-md dark:shadow-lg shadow-zinc-200/40 dark:shadow-zinc-900/80 transition-colors duration-300">
            <Link href="/">
                <div className="group relative text-2xl font-extrabold flex items-center tracking-wide">
                    <span className="text-blue-600">Knowledge</span>
                    <span className="text-zinc-700 dark:text-white">Hub</span>
                    {/* Animated underline with opacity fade */}
                    <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-blue-600 transform scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100 transition-all origin-left duration-300"></span>
                </div>
            </Link>

            <div className="flex items-center gap-4">
                <ThemeToggle />
                <ConnectWallet />
            </div>
        </header>
    )
}
