'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Create', href: '/create' },
    { label: 'Drafts', href: '/drafts' },
    { label: 'Reviews', href: '/reviews' },
]

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="min-w-[200px] h-screen px-6 py-6 border-r bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 transition-colors">
            <nav className="space-y-4">
                {navItems.map(({ label, href }) => (
                    <Link
                        key={href}
                        href={href}
                        className={clsx(
                            'block py-2 px-3 rounded transition',
                            pathname === href
                                ? 'bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white font-semibold'
                                : 'text-zinc-600 dark:text-gray-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                        )}
                    >
                        {label}
                    </Link>
                ))}
            </nav>
        </aside>
    )
}
