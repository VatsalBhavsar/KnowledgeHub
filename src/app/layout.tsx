'use client';

import './globals.css';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store';
import { WalletProvider } from '@/config/walletConfig';
import CustomToaster from '@/components/CustomToaster'
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body className="bg-white text-black dark:bg-zinc-900 dark:text-white">
				<ReduxProvider store={store}>
					<WalletProvider>
						<CustomToaster />
						<AppShell>{children}</AppShell>
					</WalletProvider>
				</ReduxProvider>
			</body>
		</html>
	);
}

function AppShell({ children }: { children: ReactNode }) {
	const pathname = usePathname();
	const isLogin = pathname === '/login';

	if (isLogin) return <>{children}</>;

	return (
		<div className="h-screen flex flex-col">
			<Header />
			<div className="flex flex-1 overflow-hidden">
				<Sidebar />
				<main className="flex-1 overflow-y-auto p-6 bg-white dark:bg-zinc-900">
					{children}
				</main>
			</div>
		</div>
	);
}
