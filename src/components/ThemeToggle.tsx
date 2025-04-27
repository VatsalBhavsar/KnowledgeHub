'use client';

import { useTheme } from 'next-themes'; // ✅ Corrected
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';
import { AnimatePresence, motion } from 'framer-motion';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    return (
        <button
            onClick={toggleTheme}
            className="p-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors duration-300 relative overflow-hidden"
            aria-label="Toggle theme"
        >
            <AnimatePresence mode="wait" initial={false}>
                <motion.span
                    key={theme}
                    initial={{ opacity: 0, scale: 0.8, rotate: -90 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    exit={{ opacity: 0, scale: 0.8, rotate: 90 }}
                    transition={{ duration: 0.4 }}
                    className="block"
                >
                    {theme === 'light' ? (
                        <MoonIcon className="h-5 w-5 text-zinc-800" />
                    ) : (
                        <SunIcon className="h-5 w-5 text-yellow-400" />
                    )}
                </motion.span>
            </AnimatePresence>
        </button>
    );
}
