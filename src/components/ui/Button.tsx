'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils'; // Utility to merge classNames

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'error' | 'warning' | 'success';
    size?: 'sm' | 'md' | 'lg';
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    fullWidth?: boolean;
    loading?: boolean;
    children: ReactNode;
}

export default function Button({
    variant = 'primary',
    size = 'md',
    leftIcon,
    rightIcon,
    fullWidth = false,
    loading = false,
    children,
    className,
    disabled,
    ...props
}: ButtonProps) {
    return (
        <button
            disabled={disabled || loading}
            {...props}
            className={cn(
                'inline-flex items-center justify-center font-medium rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed',
                variantStyles[variant],
                sizeStyles[size],
                fullWidth && 'w-full',
                className
            )}
        >
            {loading ? (
                <Spinner variant={variant} />
            ) : (
                <>
                    {leftIcon && <span className="mr-2">{leftIcon}</span>}
                    {children}
                    {rightIcon && <span className="ml-2">{rightIcon}</span>}
                </>
            )}
        </button>
    );
}

// 🎨 Variant styles (Tailwind colors)
const variantStyles: Record<string, string> = {
    primary: `
    bg-blue-600 text-white
    hover:bg-blue-700
    focus:ring-blue-500
    dark:bg-blue-600 dark:hover:bg-blue-700
  `,
    secondary: `
    border border-blue-600 text-blue-600
    hover:bg-blue-50
    focus:ring-blue-500
    dark:border-blue-400 dark:text-blue-400 dark:hover:bg-blue-950
  `,
    error: `
    bg-red-500 text-white
    hover:bg-red-600
    focus:ring-red-400
    dark:bg-red-500 dark:hover:bg-red-600
  `,
    warning: `
    bg-yellow-400 text-black
    hover:bg-yellow-500
    focus:ring-yellow-400
    dark:bg-yellow-400 dark:hover:bg-yellow-500 dark:text-black
  `,
    success: `
    bg-green-500 text-white
    hover:bg-green-600
    focus:ring-green-400
    dark:bg-green-500 dark:hover:bg-green-600
  `,
};

// 📏 Size styles
const sizeStyles: Record<string, string> = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-5 py-3',
};

// ⏳ Dynamic spinner
function Spinner({ variant }: { variant: string }) {
    let spinnerColor = 'text-white dark:text-white'; // default
    if (variant === 'secondary') {
        spinnerColor = 'text-blue-600 dark:text-blue-400';
    } else if (variant === 'warning') {
        spinnerColor = 'text-black'; // warning button is black text
    }

    return (
        <svg
            className={cn('animate-spin h-5 w-5', spinnerColor)}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            />
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
        </svg>
    );
}
