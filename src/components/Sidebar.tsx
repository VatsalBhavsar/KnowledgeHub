'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'

const navItems = [
    { label: 'Home', href: '/' },
    { label: 'Create', href: '/create' },
    { label: 'Drafts', href: '/drafts' },
    { label: 'Reviews', href: '/reviews' }
]

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="min-w-[200px] h-screen px-6 py-6 bg-zinc-900 border-r border-zinc-800">
            <nav className="space-y-4">
                {navItems.map(({ label, href }) => (
                    <Link
                        key={href}
                        href={href}
                        className={clsx(
                            'block py-2 px-3 rounded hover:bg-zinc-800 transition',
                            pathname === href ? 'bg-zinc-800 text-white font-semibold' : 'text-gray-400'
                        )}
                    >
                        {label}
                    </Link>
                ))}
            </nav>
        </aside>
    )
}
