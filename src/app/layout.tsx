'use client';

import './globals.css';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store';
import { WalletProvider } from '@/config/walletConfig';
import { ThemeProvider } from 'next-themes'; 
import CustomToaster from '@/components/CustomToaster';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body className="bg-white text-black dark:bg-zinc-900 dark:text-white transition-colors duration-500 ease-in-out">
				<ReduxProvider store={store}>
					<ThemeProvider attribute="class" defaultTheme="system" enableSystem>
						<WalletProvider>
							<CustomToaster />
							<MountedApp>{children}</MountedApp>
						</WalletProvider>
					</ThemeProvider>
				</ReduxProvider>
			</body>
		</html>
	);
}

function MountedApp({ children }: { children: ReactNode }) {
	const pathname = usePathname();

	if (pathname === '/login') return <>{children}</>;

	return (
		<div className="h-screen flex flex-col">
			<Header />
			<div className="flex flex-1 overflow-hidden">
				<Sidebar />
				<main className="flex-1 overflow-y-auto bg-white dark:bg-zinc-900 transition-colors duration-500 ease-in-out">
					{children}
				</main>
			</div>
		</div>
	);
}
