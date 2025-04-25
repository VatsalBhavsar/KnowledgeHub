'use client'

import './globals.css'
import { ReactNode, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Provider as ReduxProvider } from 'react-redux'
import { store } from '@/store'
import { WalletProvider } from '@/config/walletConfig'
import { ThemeProvider } from '@/components/ThemeProvider'
import CustomToaster from '@/components/CustomToaster'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { useTheme } from 'next-themes' // ✅ Add this

export default function RootLayout({ children }: { children: ReactNode }) {
	const [themeClass, setThemeClass] = useState('')

	const { resolvedTheme } = useTheme() // ✅ Use resolved theme

	useEffect(() => {
		setThemeClass(resolvedTheme === 'dark' ? 'dark' : '')
	}, [resolvedTheme])

	return (
		<html lang="en" className={themeClass}> {/* ✅ theme class applied here */}
			<body className="bg-white text-black dark:bg-zinc-900 dark:text-white transition-colors duration-500 ease-in-out">
				<ReduxProvider store={store}>
					<ThemeProvider>
						<WalletProvider>
							<CustomToaster />
							<MountedApp>{children}</MountedApp>
						</WalletProvider>
					</ThemeProvider>
				</ReduxProvider>
			</body>
		</html>
	)
}

function MountedApp({ children }: { children: ReactNode }) {
	const [mounted, setMounted] = useState(false)
	const pathname = usePathname()

	useEffect(() => {
		setMounted(true)
	}, [])

	if (!mounted) return null
	if (pathname === '/login') return <>{children}</>

	return (
		<div className="h-screen flex flex-col">
			<Header />
			<div className="flex flex-1 overflow-hidden">
				<Sidebar />
				<main className="flex-1 overflow-y-auto p-6 bg-white dark:bg-zinc-900 transition-colors duration-500 ease-in-out">
					{children}
				</main>
			</div>
		</div>
	)
}
