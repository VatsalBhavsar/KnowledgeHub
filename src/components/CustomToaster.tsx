'use client'

import { Toaster } from 'react-hot-toast'
import { useTheme } from 'next-themes' // ⬅️ added

export default function CustomToaster() {
    const { resolvedTheme } = useTheme() // ⬅️ detect current theme

    const isDark = resolvedTheme === 'dark'

    return (
        <Toaster
            position="top-center"
            toastOptions={{
                style: {
                    background: isDark ? '#1f2937' : '#f9fafb', // dark: zinc-800, light: zinc-50
                    color: isDark ? '#f9fafb' : '#1f2937',      // dark: zinc-50, light: zinc-800
                    border: `1px solid ${isDark ? '#374151' : '#e5e7eb'}`, // dark: zinc-700, light: zinc-200
                },
                success: {
                    iconTheme: {
                        primary: '#4ade80',  // green-400
                        secondary: isDark ? '#1f2937' : '#f9fafb',
                    },
                },
                error: {
                    iconTheme: {
                        primary: '#f87171',  // red-400
                        secondary: isDark ? '#1f2937' : '#f9fafb',
                    },
                },
            }}
        />
    )
}
