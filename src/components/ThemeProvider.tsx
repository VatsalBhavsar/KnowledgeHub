'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

type Theme = 'light' | 'dark'

interface ThemeContextType {
    theme: Theme
    setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    setTheme: () => { },
})

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(() => {
        if (typeof window !== 'undefined') {
            const stored = localStorage.getItem('theme') as Theme | null
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
            return stored || (prefersDark ? 'dark' : 'light')
        }
        return 'light'
    })

    // ✅ Sync <html> class and persist
    useEffect(() => {
        document.documentElement.classList.remove('dark', 'light')
        document.documentElement.classList.add(theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    const setTheme = (newTheme: Theme) => setThemeState(newTheme)

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext)
