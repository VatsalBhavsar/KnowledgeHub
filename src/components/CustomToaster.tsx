'use client'

import { Toaster } from 'react-hot-toast'

export default function CustomToaster() {
    return (
        <Toaster
            position="top-center"
            toastOptions={{
                style: {
                    background: '#1f2937', // Tailwind's zinc-800
                    color: '#f9fafb',       // Tailwind's zinc-50
                    border: '1px solid #374151', // zinc-700
                },
                success: {
                    iconTheme: {
                        primary: '#4ade80',   // green-400
                        secondary: '#1f2937',
                    },
                },
                error: {
                    iconTheme: {
                        primary: '#f87171',   // red-400
                        secondary: '#1f2937',
                    },
                },
            }}
        />
    )
}
