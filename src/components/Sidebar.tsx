'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import {
    Home,
    PencilLine,
    FileText,
    ClipboardList,
} from 'lucide-react' // Make sure lucide-react is installed

const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Create', href: '/create', icon: PencilLine },
    { label: 'Drafts', href: '/drafts', icon: FileText },
    { label: 'Reviews', href: '/reviews', icon: ClipboardList },
]

export default function Sidebar() {
    const pathname = usePathname()

    return (
        <aside className="min-w-[220px] h-screen px-6 py-6 border-r bg-white border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 transition-colors">
            <nav className="space-y-2">
                {navItems.map(({ label, href, icon: Icon }) => {
                    const isActive = pathname === href

                    return (
                        <Link
                            key={href}
                            href={href}
                            className={clsx(
                                'flex items-center gap-3 py-2 px-3 rounded-md text-sm font-medium transition-all group',
                                isActive
                                    ? 'bg-zinc-200 dark:bg-zinc-800 text-black dark:text-white'
                                    : 'text-zinc-600 dark:text-gray-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-black dark:hover:text-white'
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{label}</span>
                        </Link>
                    )
                })}
            </nav>
        </aside>
    )
}
