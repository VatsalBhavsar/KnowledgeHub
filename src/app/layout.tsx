'use client';

import './globals.css';
import { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from '@/store';
import { WalletProvider } from '@/config/walletConfig';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<body>
				<ReduxProvider store={store}>
					<WalletProvider>
						<HeaderWrapper>{children}</HeaderWrapper>
					</WalletProvider>
				</ReduxProvider>
			</body>
		</html>
	);
}

function HeaderWrapper({ children }: { children: ReactNode }) {
	const pathname = usePathname()
	const isLogin = pathname === '/login'

	return (
		<>
			{!isLogin && <Header />}
			<div className="flex">
				{!isLogin && <Sidebar />}
				<main className="flex-1 p-6">{children}</main>
			</div>
		</>
	)
}
